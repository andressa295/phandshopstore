// lib/supabase/dashboard/getDashboardData.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/supabase/supabase.types';

export interface DashboardData {
    vendasHoje: number;
    visitantesHoje: number;
    pedidosPendentes: number;
    estoqueBaixoAlert: number;
    faturamentoMes: number;
    ticketMedio: number;
    taxaConversao: number;
    vendasSemanaisGrafico: { name: string; vendas: number }[];
    faturamentoComRepasse: number;
    custosFixos: number;
    custosVariaveis: number;
    mesAtual: number;
    mesAnterior: number;
    metaMensal: number;
    notificacoesPendentes: number;
    sistemaStatus: string;
}

// Função auxiliar para gerar o gráfico semanal
function gerarGraficoSemanal(vendas: any[], hoje: Date): DashboardData['vendasSemanaisGrafico'] {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const vendasPorDia: { [key: string]: number } = {};
    const umaSemanaAtras = new Date(hoje);
    umaSemanaAtras.setDate(hoje.getDate() - 6);

    for (let i = 0; i < 7; i++) {
        const dia = new Date(umaSemanaAtras);
        dia.setDate(umaSemanaAtras.getDate() + i);
        vendasPorDia[dia.toDateString()] = 0;
    }

    vendas.forEach(venda => {
        const dataVenda = new Date(venda.created_at);
        const dataVendaStr = dataVenda.toDateString();
        if (vendasPorDia[dataVendaStr] !== undefined) {
            vendasPorDia[dataVendaStr] += venda.valor_venda || 0;
        }
    });

    return Object.keys(vendasPorDia)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map(dateStr => ({
            name: dias[new Date(dateStr).getDay()],
            vendas: vendasPorDia[dateStr],
        }));
}

export async function getDashboardData(lojaId: string): Promise<DashboardData | null> {
    const supabase = createServerComponentClient<Database>({ cookies });

    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

        const [
            vendasRes,
            produtosRes,
            historicoAcessosRes,
            lojaRes,
            pedidosPendentesRes,
            estoqueBaixoRes
        ] = await Promise.all([
            supabase.from('receita_historico')
                .select('valor_venda, created_at, status')
                .eq('loja_id', lojaId)
                .gte('created_at', startOfMonth.toISOString()),

            supabase.from('produtos')
                .select('id, estoque')
                .eq('loja_id', lojaId),

            supabase.from('historico_acessos')
                .select('id')
                .eq('loja_id', lojaId)
                .gte('created_at', startOfMonth.toISOString()),

            supabase.from('lojas')
                .select('meta_mensal, custos_fixos, custos_variaveis')
                .eq('id', lojaId)
                .single(),

            supabase.from('pedidos')
                .select('id', { count: 'exact' })
                .eq('loja_id', lojaId)
                .eq('status', 'pendente'),

            supabase.from('produtos')
                .select('id', { count: 'exact' })
                .eq('loja_id', lojaId)
                .lt('estoque', 5),
        ]);

        const vendas = vendasRes.data || [];
        const visitantes = historicoAcessosRes.data || [];
        const lojaData = lojaRes.data;

        const numVendasMes = vendas.length;
        const numVisitantesMes = visitantes.length;
        const faturamentoMes = vendas.reduce((acc, curr) => acc + (curr.valor_venda || 0), 0);
        
        const vendasHoje = vendas
            .filter(v => new Date(v.created_at).toDateString() === today.toDateString())
            .reduce((acc, curr) => acc + (curr.valor_venda || 0), 0) || 0;
        
        const ticketMedio = numVendasMes > 0 ? faturamentoMes / numVendasMes : 0;
        const taxaConversao = numVisitantesMes > 0 ? (numVendasMes / numVisitantesMes) * 100 : 0;
        const estoqueBaixoAlert = estoqueBaixoRes.count || 0;
        const pedidosPendentes = pedidosPendentesRes.count || 0;
        const vendasSemanaisGrafico = gerarGraficoSemanal(vendas, today);

        return {
            vendasHoje,
            visitantesHoje: numVisitantesMes,
            pedidosPendentes,
            estoqueBaixoAlert,
            faturamentoMes,
            ticketMedio,
            taxaConversao,
            vendasSemanaisGrafico,
            
            faturamentoComRepasse: faturamentoMes * 0.15,
            custosFixos: lojaData?.custos_fixos || 0,
            custosVariaveis: lojaData?.custos_variaveis || 0,
            mesAtual: faturamentoMes,
            mesAnterior: faturamentoMes * 0.9,
            metaMensal: lojaData?.meta_mensal || 0,
            notificacoesPendentes: 2, // placeholder
            sistemaStatus: 'Operacional',
        };
    } catch (error) {
        console.error('Erro inesperado em getDashboardData:', error);
        return null;
    }
}