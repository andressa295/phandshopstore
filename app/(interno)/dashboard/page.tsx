// app/(interno)/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClientDashboard from './components/ClientDashboard';
import { getDashboardData } from '@/lib/supabase/dashboard/getDashboardData';
import { UserProfile } from './UserContext'; 

export default async function DashboardPage() {
    // CORREÇÃO: Passando a função `cookies` como um argumento, não o resultado da sua chamada.
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
        .from('usuarios')
        .select(`
            nome_completo, 
            email,
            lojas(id, nome_loja, slug)
        `)
        .eq('id', user.id)
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

    const lojaData = userData.lojas && Array.isArray(userData.lojas) && userData.lojas.length > 0 ? userData.lojas[0] : null;
    const lojaId = lojaData?.id || null;

    if (!lojaId) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'Poppins, sans-serif', color: '#666666' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>Loja não encontrada</h1>
                <p style={{ fontSize: '0.95rem', color: '#666666', marginTop: '16px' }}>
                    Você ainda não tem uma loja cadastrada. Crie uma para gerenciar seu dashboard.
                </p>
            </div>
        );
    }
    
    const dashboardData = await getDashboardData(lojaId);
    
    const userProfile: UserProfile = {
        nome_completo: userData.nome_completo,
        plano: null, 
        recorrencia: null,
        email: userData.email,
        lojaId: lojaId,
        lojaNome: lojaData?.nome_loja,
        lojaSlug: lojaData?.slug,
    };

    return (
        <ClientDashboard
            dashboardData={dashboardData}
            userProfile={userProfile}
            userEmail={user.email}
        />
    );
}
