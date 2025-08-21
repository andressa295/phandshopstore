// app/(interno)/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClientDashboard from './components/DashboardClient'; // CORREÇÃO: Nome do componente
import { notFound } from 'next/navigation';
import { PostgrestError } from '@supabase/supabase-js';

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
        // O middleware já cuida do redirecionamento, mas é um fallback seguro
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Acesso negado. Por favor, faça login.</p>
            </div>
        );
    }

    // 1. Buscar a loja do usuário logado
    const { data: lojaData, error: lojaError } = await supabase
        .from('lojas')
        .select('id')
        .eq('usuario_id', user.id)
        .single();

    if (lojaError) {
        const pgError = lojaError as PostgrestError;
        if (pgError.code === 'PGRST116') { // Não encontrou a loja
            console.warn(`[DashboardPage] Usuário '${user.id}' não tem uma loja cadastrada.`);
            // Mensagem amigável ou redirecionamento para criar loja (se não for feito pelo middleware)
            return (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-gray-500">Você ainda não tem uma loja cadastrada. Por favor, crie uma para gerenciar seu dashboard.</p>
                </div>
            );
        } else {
            console.error('[DashboardPage] Erro ao buscar a loja do usuário:', lojaError);
            return (
                <div className="flex justify-center items-center h-screen">
                    <p className="text-red-500">Erro: Não foi possível encontrar a loja do usuário. Verifique as permissões.</p>
                </div>
            );
        }
    }

    const lojaId = lojaData?.id;

    if (!lojaId) { // Fallback caso a query retorne null
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">Você ainda não tem uma loja cadastrada. Por favor, crie uma para gerenciar seu dashboard.</p>
            </div>
        );
    }

    // Buscando dados reais do banco de dados para os KPIs, FILTRANDO POR LOJA
    const todayISO = new Date().toISOString().split('T')[0];

    const { data: vendasRes, error: vendasError } = await supabase
        .from('vendas') // CORREÇÃO: Usando 'vendas'
        .select('valor_total')
        .eq('loja_id', lojaId) // FILTRANDO POR LOJA
        .gte('created_at', todayISO);

    const { count: visitantesHoje, error: visitantesError } = await supabase
        .from('historico_acessos') // CORREÇÃO: Usando 'historico_acessos'
        .select('*', { count: 'exact' })
        .eq('loja_id', lojaId) // FILTRANDO POR LOJA
        .gte('created_at', todayISO);

    const { count: estoqueBaixo, error: estoqueError } = await supabase
        .from('produtos')
        .select('estoque', { count: 'exact' })
        .eq('loja_id', lojaId) // FILTRANDO POR LOJA
        .lt('estoque', 50);

    const { count: pedidosPendentes, error: pedidosError } = await supabase
        .from('vendas') // CORREÇÃO: Usando 'vendas'
        .select('status', { count: 'exact' })
        .eq('loja_id', lojaId) // FILTRANDO POR LOJA
        .eq('status', 'pendente');

    if (vendasError || visitantesError || estoqueError || pedidosError) {
        console.error('Erro ao buscar dados do dashboard:', vendasError || visitantesError || estoqueError || pedidosError);
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Erro ao carregar o dashboard. Verifique a conexão com o banco de dados.</p>
            </div>
        );
    }

    const vendasHoje = vendasRes ? vendasRes.reduce((sum, item) => sum + item.valor_total, 0) : 0;

    const dashboardData: DashboardData = {
        vendasHoje: vendasHoje,
        visitantesHoje: visitantesHoje || 0,
        estoqueBaixo: estoqueBaixo || 0,
        pedidosPendentes: pedidosPendentes || 0,
    };

    return <ClientDashboard data={dashboardData} />; // CORREÇÃO: Nome do componente
}