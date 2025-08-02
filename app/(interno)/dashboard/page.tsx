// app/(interno)/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClientDashboard from './components/ClientDashboard';
import { getDashboardData } from '@/lib/supabase/dashboard/getDashboardData';
import { UserProfile } from './UserContext'; 

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
    
    const { data: userProfileData, error: profileError } = await supabase
        .from('usuarios')
        .select('nome_completo, plano, recorrencia, email')
        .eq('id', user.id)
        .single();
    
    // Busca os dados do dashboard usando o novo serviço
    const dashboardData = await getDashboardData(user.id);

    return (
        <ClientDashboard
            dashboardData={dashboardData}
            userProfile={userProfileData as UserProfile}
            userEmail={user.email}
        />
    );
}