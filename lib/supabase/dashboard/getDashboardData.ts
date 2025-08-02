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

export async function getDashboardData(userId: string): Promise<DashboardData | null> {
    const supabase = createServerComponentClient({ cookies });
    const today = new Date();
    const todayISO = today.toISOString().split('T')[0];

    try {
        const [
            pedidosRes,
            visitasRes,
            estoqueRes,
            estoqueBaixoRes,
            pedidosPendentesRes,
        ] = await Promise.all([
            // Busca todos os pedidos do mês para calcular todos os KPIs de vendas
            supabase
                .from('pedidos')
                .select('valor_total, created_at, status')
                .eq('loja_id', userId)
                .gte('created_at', new Date(today.getFullYear(), today.getMonth(), 1).toISOString()),
            
            // Busca visitas do mês para calcular conversão
            supabase
                .from('visitas_loja')
                .select('*', { count: 'exact' })
                .eq('loja_id', userId)
                .gte('created_at', new Date(today.getFullYear(), today.getMonth(), 1).toISOString()),

            // Total de produtos em estoque
            supabase
                .from('produtos')
                .select('*', { count: 'exact' })
                .eq('loja_id', userId),
            
            // Produtos com estoque baixo (exemplo: < 5)
            supabase
                .from('produtos')
                .select('*', { count: 'exact' })
                .eq('loja_id', userId)
                .lt('estoque', 5),
                
            // Pedidos pendentes
            supabase
                .from('pedidos')
                .select('status', { count: 'exact' })
                .eq('loja_id', userId)
                .eq('status', 'pendente')
        ]);
        
        const pedidos = pedidosRes.data || [];
        const visitasMes = visitasRes.count || 0;

        const vendasHoje = pedidos
            .filter(p => new Date(p.created_at).toDateString() === today.toDateString())
            .reduce((acc, curr) => acc + (curr.valor_total || 0), 0);

        const faturamentoMes = pedidos.reduce((acc, curr) => acc + (curr.valor_total || 0), 0);
        const numPedidosMes = pedidos.length;
        const ticketMedio = numPedidosMes > 0 ? (faturamentoMes / numPedidosMes) : 0;
        const taxaConversao = visitasMes > 0 ? (numPedidosMes / visitasMes) * 100 : 0;
        const vendasSemanaisGrafico = gerarGraficoSemanal(pedidos);

        return {
            vendasHoje,
            visitantesHoje: visitasMes, // Reutiliza a contagem de visitas do mês como KPI "hoje"
            produtosEmEstoque: estoqueRes.count || 0,
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

function gerarGraficoSemanal(pedidos: any[]): VendasSemanaisData[] {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const hoje = new Date();
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(hoje.getDate() - 6);

    const vendasPorDia = Array(7).fill(0).map((_, i) => {
        const dia = new Date(umaSemanaAtras);
        dia.setDate(umaSemanaAtras.getDate() + i);
        const diaStr = dias[dia.getDay()];
        
        const vendasDoDia = pedidos
            .filter(p => new Date(p.created_at).toDateString() === dia.toDateString())
            .reduce((acc, curr) => acc + (curr.valor_total || 0), 0);

        return { name: diaStr, vendas: vendasDoDia };
    });

    return vendasPorDia;
}