// app/(interno)/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClientDashboard from './components/ClientDashboard';
import { getDashboardData, DashboardData } from '@/lib/supabase/dashboard/getDashboardData';
import { UserProfile } from './UserContext';
import { redirect } from 'next/navigation';

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
    .eq('user_id', user.id)
    .single();

  if (lojaError || !lojaData) {
    console.error('Erro ao carregar loja do usuário:', lojaError);
    redirect('/onboarding');
  }

  // Selecionar apenas a assinatura ativa
  const assinaturaAtiva = Array.isArray(lojaData.assinaturas)
    ? lojaData.assinaturas.find(a => a.status === 'ativa') || null
    : null;

  // Selecionar o plano vinculado à assinatura ativa
  const planoAtivo = assinaturaAtiva?.planos?.[0] || null;

  // Determinar recorrência automática
  const recorrencia = planoAtivo?.preco_anual && planoAtivo.preco_anual > 0
    ? 'anual'
    : planoAtivo?.preco_mensal && planoAtivo.preco_mensal > 0
    ? 'mensal'
    : null;

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
    plano: planoAtivo?.nome_plano || 'Plano Grátis', // placeholder só se não tiver assinatura
    recorrencia,
    preco_mensal: planoAtivo?.preco_mensal ?? null,
    preco_anual: planoAtivo?.preco_anual ?? null,
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
