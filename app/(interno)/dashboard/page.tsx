import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClientDashboard from './components/ClientDashboard';
import { getStoreDashboardData, StoreDashboardData } from '@/lib/supabase/dashboard/getStoreDashboardData';
import { UserProfile } from '@/types/UserProfile'; // IMPORTAÇÃO CORRETA DA INTERFACE
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    const { data: lojaData, error: lojaError } = await supabase
        .from('lojas')
        .select(`id, nome_loja, slug, assinaturas(status, planos(nome_plano, preco_mensal, preco_anual))`)
        .eq('user_id', user.id)
        .single();
    
    if (lojaError || !lojaData) {
        redirect('/onboarding');
    }

    const dashboardData = await getStoreDashboardData(lojaData.id);

    const assinaturaData = lojaData?.assinaturas && Array.isArray(lojaData.assinaturas) && lojaData.assinaturas.length > 0 ? lojaData.assinaturas[0] : null;
    const planoData = assinaturaData?.planos && Array.isArray(assinaturaData.planos) && assinaturaData.planos.length > 0 ? assinaturaData.planos[0] : null;
    
    let recorrencia: 'anual' | 'mensal' | null = null;
    if (planoData?.preco_anual && planoData.preco_anual > 0) {
        recorrencia = 'anual';
    } else {
        recorrencia = 'mensal';
    }

    const userProfile: UserProfile = {
        id: user.id,
        nome_completo: user.user_metadata?.full_name as string || null,
        email: user.email ?? null,
        lojaId: lojaData.id,
        lojaNome: lojaData.nome_loja,
        lojaSlug: lojaData.slug,
        plano: planoData?.nome_plano || 'Plano Grátis',
        recorrencia: recorrencia,
        preco_mensal: planoData?.preco_mensal || null,
        preco_anual: planoData?.preco_anual || null,
    };

    return (
        <ClientDashboard
            dashboardData={dashboardData}
            userProfile={userProfile}
            userEmail={user.email}
        />
    );
}