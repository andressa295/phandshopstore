import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClientDashboard from './components/ClientDashboard';
import { getDashboardData, DashboardData } from '@/lib/supabase/dashboard/getDashboardData';
import { UserProfile } from './UserContext';
import { redirect } from 'next/navigation';
import { User, PostgrestError } from '@supabase/supabase-js'; // Adicionadas as importações de User e PostgrestError

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Buscar loja e assinatura ativa do usuário
  const { data: lojaData, error: lojaError } = await supabase
    .from('lojas')
    .select(`
      id,
      nome_loja,
      slug,
      assinaturas (
        status,
        plano_id,
        planos (
          nome_plano,
          preco_mensal,
          preco_anual
        )
      )
    `)
    .eq('owner_id', user.id) // CORREÇÃO: Coluna agora é 'owner_id'
    .single();

  if (lojaError || !lojaData) {
    console.error('Erro ao carregar loja do usuário:', lojaError);
    redirect('/onboarding');
  }

  // Selecionar apenas a assinatura ativa
  const assinaturaData =
    Array.isArray(lojaData.assinaturas) && lojaData.assinaturas.length > 0
      ? lojaData.assinaturas[0]
      : null;

  // Selecionar o plano vinculado à assinatura ativa
  const planoData =
    assinaturaData &&
    Array.isArray(assinaturaData.planos) &&
    assinaturaData.planos.length > 0
      ? assinaturaData.planos[0]
      : null;

  // Determinar recorrência automática
  let recorrencia: 'anual' | 'mensal' | null = null;
  if (planoData?.preco_anual && planoData.preco_anual > 0) {
    recorrencia = 'anual';
  } else if (planoData?.preco_mensal && planoData.preco_mensal > 0) {
    recorrencia = 'mensal';
  }

  // Construir o perfil do usuário com dados reais
  const userProfile: UserProfile = {
    id: user.id,
    nome_completo:
      typeof user.user_metadata?.full_name === 'string'
        ? user.user_metadata.full_name
        : null,
    email: user.email ?? '',
    lojaId: lojaData.id,
    lojaNome: lojaData.nome_loja,
    lojaSlug: lojaData.slug,
    plano: planoData?.nome_plano || 'Plano Grátis', // placeholder só se não tiver assinatura
    recorrencia: recorrencia,
    preco_mensal: planoData?.preco_mensal ?? null,
    preco_anual: planoData?.preco_anual ?? null,
  };

  const dashboardData: DashboardData | null = await getDashboardData(lojaData.id);

  return (
    <ClientDashboard
      dashboardData={dashboardData}
      userProfile={userProfile}
      userEmail={user.email ?? ''}
    />
  );
}
