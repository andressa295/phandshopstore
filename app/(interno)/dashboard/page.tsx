// app/(interno)/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClientDashboard from './components/ClientDashboard';
import { getDashboardData } from '@/lib/supabase/dashboard/getDashboardData';
import { UserProfile } from './UserContext'; // Certifique-se de que UserProfile está importado corretamente

export default async function DashboardPage() {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Poppins, sans-serif', color: '#dc3545' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Acesso Negado!</h1>
                <p style={{ fontSize: '0.95rem', color: '#666666', marginTop: '16px' }}>
                    Você precisa estar logado para acessar esta página.
                </p>
            </div>
        );
    }

    const { data: userData, error: profileError } = await supabase
        .from('lojas')
        .select(`
            id,
            nome_loja,
            slug,
            user_id,
            assinaturas(
                status,
                planos(
                    nome_plano,
                    preco_anual
                )
            )
        `)
        .eq('user_id', user.id)
        .single();

    if (profileError || !userData) {
        console.error("Erro ao buscar perfil do usuário:", profileError);
        return (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Poppins, sans-serif', color: '#dc3545' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Erro ao Carregar Perfil</h1>
                <p style={{ fontSize: '0.95rem', color: '#666666', marginTop: '16px' }}>
                    Não foi possível carregar seu perfil. Tente novamente mais tarde.
                </p>
            </div>
        );
    }

    const lojaData = userData;
    const assinaturaData = lojaData?.assinaturas && Array.isArray(lojaData.assinaturas) && lojaData.assinaturas.length > 0 ? lojaData.assinaturas[0] : null;

    const planoNome = assinaturaData?.planos?.[0]?.nome_plano || 'plano_gratis';
    const recorrencia = assinaturaData?.planos?.[0]?.preco_anual > 0 ? 'anual' : 'mensal';

    const dashboardData = await getDashboardData(lojaData.id);

    // CORREÇÃO: UserProfile deve ter 'email: string | null | undefined'
    const userProfile: UserProfile = {
        id: user.id,
        nome_completo: 'Nome de Exemplo',
        email: user.email ?? null, // Ajustado para ser string ou null
        lojaId: lojaData.id,
        lojaNome: lojaData?.nome_loja,
        lojaSlug: lojaData?.slug,
        plano: planoNome,
        recorrencia: recorrencia,
    };

    return (
        <ClientDashboard
            dashboardData={dashboardData}
            userProfile={userProfile}
            userEmail={user.email}
        />
    );
}