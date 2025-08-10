'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';

// Definindo o tipo de dado para o perfil completo do usuário
interface UserProfile {
  id: string;
  email: string;
  nome_completo: string;
  lojaId: string | null;
  lojaNome: string | null;
  lojaSlug: string | null;
  plano: 'plano_gratis' | 'plano_basico' | 'plano_essencial' | 'plano_profissional' | 'plano_premium' | null;
  recorrencia: 'mensal' | 'anual' | null;
}

interface SupabaseContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

// CORREÇÃO FINAL: Rotas públicas completas
const publicRoutes = [
  '/',
  '/login',
  '/cadastro',
  '/plataforma',
  '/planos',
  '/profissionais',
  '/recursos',
  '/sobre',
  '/trabalhe-conosco',
  '/afiliados',
  '/ajuda',
  '/contato',
  '/faq',
  '/blog',
  '/cases-de-sucesso',
  '/ferramentas',
  '/comunidade',
  '/parceiros',
  '/auth',
  '/conversao',
  '/sitecriadores/afiliado',
  '/sitecriadores/login',
  '/seja-um-parceiro/parceiros/temas',
  '/seja-um-parceiro',
  '/seja-um-parceiro/criadores',
  '/diretrizes',
  '/seja-um-parceiro/parceiros/cadastro',
  '/seja-um-parceiro/tecnologicos',
  '/seja-um-parceiro/conteudos',
  '/docs-api',
  '/contratar',
  '/contratar/diretorio',
  '/contratar/design',
  '/contratar/configuracao',
  '/contratar/migracao',
  '/contratar/desenvolvimento',
  '/contratar/marketing',
  '/contratar/auditoria',
  
];

export function SupabaseProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null; }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select(`
          id,
          email,
          nome_completo,
          lojas(id, nome_loja, slug, assinaturas(planos(nome), status))
        `)
        .eq('id', userId)
        .single();

      if (userError || !userData) {
        console.error('Erro ao buscar perfil do usuário:', userError);
        setProfile(null);
      } else {
        const lojaData = Array.isArray(userData.lojas) && userData.lojas.length > 0 ? userData.lojas[0] : null;
        const assinaturaData = lojaData?.assinaturas?.[0] || null;
        const planoData = assinaturaData?.planos?.[0] || null;

        const userProfileData: UserProfile = {
          id: userData.id,
          email: userData.email,
          nome_completo: userData.nome_completo,
          lojaId: lojaData?.id || null,
          lojaNome: lojaData?.nome_loja || null,
          lojaSlug: lojaData?.slug || null,
          plano: planoData?.nome as UserProfile['plano'] || 'plano_gratis',
          recorrencia: 'mensal',
        };
        setProfile(userProfileData);
      }
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        
        const pathWithoutLocale = pathname.startsWith('/pt-BR') || pathname.startsWith('/en-US') || pathname.startsWith('/es-ES')
          ? pathname.substring(6)
          : pathname;

        if (!publicRoutes.includes(pathWithoutLocale)) {
          router.push('/login');
        }
      }
    });

    if (initialUser) {
      fetchUserProfile(initialUser.id);
    } else {
      setLoading(false);
      const pathWithoutLocale = pathname.startsWith('/pt-BR') || pathname.startsWith('/en-US') || pathname.startsWith('/es-ES')
          ? pathname.substring(6)
          : pathname;

      if (!publicRoutes.includes(pathWithoutLocale)) {
        router.push('/login');
      }
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [initialUser, supabase, router, pathname]);

  return (
    <SupabaseContext.Provider value={{ user, profile, loading }}>
      {children}
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (context === undefined) {
    throw new Error('useSupabase deve ser usado dentro de um SupabaseProvider');
  }
  return context;
}