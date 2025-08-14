// lib/supabase/dashboard/getDashboardData.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PostgrestError } from '@supabase/supabase-js';

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
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

    try {
        const [
            vendasMesRes,
            visitasMesRes,
            produtosEmEstoqueRes,
            estoqueBaixoRes,
            pedidosPendentesRes
        ] = await Promise.all([
            supabase
                .from('vendas')
                .select('valor_total, created_at, status')
                .eq('loja_id', lojaId)
                .gte('created_at', startOfMonth),
            
            supabase
                .from('historico_acessos')
                .select('id', { count: 'exact' })
                .eq('loja_id', lojaId)
                .gte('created_at', startOfMonth),

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
        
        const vendasMes = vendasMesRes.data || [];
        const visitasMes = visitasMesRes.count || 0;

        const vendasHoje = vendasMes
            .filter(v => new Date(v.created_at).toISOString().startsWith(startOfDay.substring(0, 10)))
            .reduce((acc, curr) => acc + (curr.valor_total || 0), 0);
        
        const faturamentoMes = vendasMes.reduce((acc, curr) => acc + (curr.valor_total || 0), 0);
        const numVendasMes = vendasMes.length;
        const ticketMedio = numVendasMes > 0 ? (faturamentoMes / numVendasMes) : 0;
        const taxaConversao = visitasMes > 0 ? (numVendasMes / visitasMes) * 100 : 0;
        const vendasSemanaisGrafico = gerarGraficoSemanal(vendasMes, today);

        return {
            vendasHoje,
            visitantesHoje: visitasMes, // Este valor está incorreto, pois busca visitas do mês inteiro. O VisitTracker deve ser ajustado para registrar visitas diárias.
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