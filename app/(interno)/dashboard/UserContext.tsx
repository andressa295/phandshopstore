'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';

export interface UserProfile {
  id: string; // ID do usuário do Supabase
  email: string | null;
  nome_completo: string | null;
  lojaId: string | null;
  lojaNome: string | null;
  lojaSlug: string | null;
  plano: string | null;
  recorrencia: 'mensal' | 'anual' | null;
  preco_mensal?: number | null;
  preco_anual?: number | null;
}

interface UserContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserData() {
      setLoading(true);
      const { data: { user: supabaseUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !supabaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      setUser(supabaseUser);

      const { data: lojaData, error: profileError } = await supabase
        .from('lojas')
        .select(`
          id, 
          nome_loja, 
          slug, 
          assinaturas(
            status,
            planos(
              nome_plano, 
              preco_mensal, 
              preco_anual
            )
          )
        `)
        .eq('user_id', supabaseUser.id)
        .single();
      
      if (profileError) {
        console.error("Erro ao carregar perfil:", profileError);
        setProfile(null);
      } else if (lojaData) {
        const assinaturaData = lojaData.assinaturas?.[0] || null;
        const planoData = assinaturaData?.planos?.[0] || null;

        const formattedProfile: UserProfile = {
          id: supabaseUser.id,
          email: supabaseUser.email ?? null,
          nome_completo: supabaseUser.user_metadata.full_name as string || null,
          lojaId: lojaData?.id || null,
          lojaNome: lojaData?.nome_loja || null,
          lojaSlug: lojaData?.slug || null,
          plano: planoData?.nome_plano || 'Plano Grátis',
          recorrencia: (planoData?.preco_anual || 0) > 0 ? 'anual' : 'mensal',
          preco_mensal: planoData?.preco_mensal || 0,
          preco_anual: planoData?.preco_anual || 0,
        };
        setProfile(formattedProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    }
    
    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          fetchUserData();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser deve ser usado dentro de um UserProvider');
  }
  return context;
}