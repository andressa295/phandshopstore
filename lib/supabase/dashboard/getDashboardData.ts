// lib/supabase/dashboard/getDashboardData.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export interface VendasSemanaisData {
    name: string;
    vendas: number;
}

export interface DashboardData {
    vendasHoje: number;
    visitantesHoje: number;
    produtosEmEstoque: number;
    pedidosPendentes: number;
    estoqueBaixoAlert: number;
    faturamentoMes: number;
    ticketMedio: number;
    taxaConversao: number;
    vendasSemanaisGrafico: VendasSemanaisData[];
}

export async function getDashboardData(lojaId: string): Promise<DashboardData | null> {
    const supabase = createServerComponentClient({ cookies });
    const today = new Date();

    try {
        const [
            vendasRes,
            visitasRes,
            produtosEmEstoqueRes,
            estoqueBaixoRes,
            pedidosPendentesRes
        ] = await Promise.all([
            // CORREÇÃO: Usando a tabela 'vendas'
            supabase
                .from('vendas')
                .select('valor_total, created_at, status')
                .eq('loja_id', lojaId)
                .gte('created_at', new Date(today.getFullYear(), today.getMonth(), 1).toISOString()),
            
            // CORREÇÃO: Usando a tabela 'historico_acessos'
            supabase
                .from('historico_acessos')
                .select('*', { count: 'exact' })
                .eq('loja_id', lojaId)
                .gte('created_at', new Date(today.getFullYear(), today.getMonth(), 1).toISOString()),

            supabase
                .from('produtos')
                .select('id', { count: 'exact' })
                .eq('loja_id', lojaId),
            
            supabase
                .from('produtos')
                .select('id', { count: 'exact' })
                .eq('loja_id', lojaId)
                .lt('estoque', 5),
                
            supabase
                .from('vendas')
                .select('status', { count: 'exact' })
                .eq('loja_id', lojaId)
                .eq('status', 'pendente')
        ]);
        
        const vendas = vendasRes.data || [];
        const visitasMes = visitasRes.count || 0;

        const vendasHoje = vendas
            .filter(v => new Date(v.created_at).toDateString() === today.toDateString())
            .reduce((acc, curr) => acc + (curr.valor_total || 0), 0);

        const faturamentoMes = vendas.reduce((acc, curr) => acc + (curr.valor_total || 0), 0);
        const numVendasMes = vendas.length;
        const ticketMedio = numVendasMes > 0 ? (faturamentoMes / numVendasMes) : 0;
        const taxaConversao = visitasMes > 0 ? (numVendasMes / visitasMes) * 100 : 0;
        const vendasSemanaisGrafico = gerarGraficoSemanal(vendas, today);

        return {
            vendasHoje,
            visitantesHoje: visitasMes,
            produtosEmEstoque: produtosEmEstoqueRes.count || 0,
            pedidosPendentes: pedidosPendentesRes.count || 0,
            estoqueBaixoAlert: estoqueBaixoRes.count || 0,
            faturamentoMes,
            ticketMedio,
            taxaConversao,
            vendasSemanaisGrafico,
        };

    } catch (error) {
        console.error('Erro no serviço getDashboardData:', error);
        return null;
    }
}

function gerarGraficoSemanal(vendas: any[], hoje: Date): VendasSemanaisData[] {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const umaSemanaAtras = new Date(hoje);
    umaSemanaAtras.setDate(hoje.getDate() - 6);

    const vendasPorDia = Array(7).fill(0).map((_, i) => {
        const dia = new Date(umaSemanaAtras);
        dia.setDate(umaSemanaAtras.getDate() + i);
        const diaStr = dias[dia.getDay()];
        
        const vendasDoDia = vendas
            .filter(p => new Date(p.created_at).toDateString() === dia.toDateString())
            .reduce((acc, curr) => acc + (curr.valor_total || 0), 0);

        return { name: diaStr, vendas: vendasDoDia };
    });

    return vendasPorDia;
}
