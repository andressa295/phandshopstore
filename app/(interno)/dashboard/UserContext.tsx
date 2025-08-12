'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { PostgrestError } from '@supabase/supabase-js';

// **CORREÇÃO 1: Interface UserProfile atualizada**
export interface UserProfile {
  id: string; // ID do usuário do Supabase
  email: string;
  nome_completo: string;
  lojaId: string | null;
  lojaNome: string | null;
  lojaSlug: string | null;
  plano: 'plano_gratis' | 'plano_basico' | 'plano_essencial' | 'plano_profissional' | 'plano_premium' | null;
  recorrencia: 'mensal' | 'anual' | null;
  preco_mensal?: number;
  preco_anual?: number;
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
        // Não redirecionamos aqui para evitar conflitos com o middleware
        return;
      }

      setUser(supabaseUser);

      // **CORREÇÃO 2: Query ajustada para buscar recorrência da tabela 'planos'**
      let { data: userProfileData, error: profileError } = await supabase
        .from('usuarios')
        .select(`
          id,
          email,
          nome_completo,
          lojas(
            id, 
            nome_loja, 
            slug, 
            assinaturas(
              planos(nome, preco_mensal, preco_anual, recorrencia), 
              status
            )
          )
        `)
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        console.error("Erro ao carregar perfil:", profileError);
        setProfile(null);
      } else if (userProfileData) {
        const lojaData = Array.isArray(userProfileData.lojas) && userProfileData.lojas.length > 0 ? userProfileData.lojas[0] : null;
        const assinaturaData = lojaData?.assinaturas?.[0] || null;
        const planoData = assinaturaData?.planos?.[0] || null;

        // **CORREÇÃO 3: Mapeamento dos dados completo**
        const formattedProfile: UserProfile = {
          id: userProfileData.id,
          email: userProfileData.email,
          nome_completo: userProfileData.nome_completo,
          lojaId: lojaData?.id || null,
          lojaNome: lojaData?.nome_loja || null,
          lojaSlug: lojaData?.slug || null,
          plano: planoData?.nome as UserProfile['plano'] || 'plano_gratis',
          recorrencia: planoData?.recorrencia || null,
          preco_mensal: planoData?.preco_mensal || 0,
          preco_anual: planoData?.preco_anual || 0,
        };
        setProfile(formattedProfile);
      } else {
        setProfile(null);
      }

      setLoading(false);
    }
    
    // CORREÇÃO: Removemos a lógica de redirecionamento para evitar conflito com o middleware
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'USER_UPDATED') {
          fetchUserData();
        }
      }
    );

    fetchUserData();

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