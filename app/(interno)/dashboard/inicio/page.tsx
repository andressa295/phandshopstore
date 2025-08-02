// app/(interno)/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import DashboardClient from './components/DashboardClient';

// Definindo a interface para os dados que serão passados para o componente
interface DashboardData {
    vendasHoje: number;
    visitantesHoje: number;
    estoqueBaixo: number;
    pedidosPendentes: number;
}

export default async function DashboardPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Acesso negado. Por favor, faça login.</p>
            </div>
        );
    }

    // Buscando dados reais do banco de dados para os KPIs
    const today = new Date().toISOString().split('T')[0];

    const { data: vendasData, error: vendasError } = await supabase
        .from('pedidos')
        .select('valor_total')
        .gte('created_at', today);

    const { count: visitantesHoje, error: visitantesError } = await supabase
        .from('visitas_loja')
        .select('*', { count: 'exact' })
        .gte('created_at', today);

    const { count: estoqueBaixo, error: estoqueError } = await supabase
        .from('produtos')
        .select('estoque', { count: 'exact' })
        .lt('estoque', 50);

    const { count: pedidosPendentes, error: pedidosError } = await supabase
        .from('pedidos')
        .select('status', { count: 'exact' })
        .eq('status', 'pendente');

    if (vendasError || visitantesError || estoqueError || pedidosError) {
        console.error('Erro ao buscar dados do dashboard:', vendasError || visitantesError || estoqueError || pedidosError);
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Erro ao carregar o dashboard. Verifique a conexão com o banco de dados.</p>
            </div>
        );
    }

    const vendasHoje = vendasData ? vendasData.reduce((sum, item) => sum + item.valor_total, 0) : 0;

    const dashboardData: DashboardData = {
        vendasHoje: vendasHoje,
        visitantesHoje: visitantesHoje || 0,
        estoqueBaixo: estoqueBaixo || 0,
        pedidosPendentes: pedidosPendentes || 0,
    };

    return <DashboardClient data={dashboardData} />;
}