'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { PostgrestError } from '@supabase/supabase-js';

export interface UserProfile {
  nome_completo: string | null;
  email: string | null;
  plano: 'plano_gratis' | 'plano_basico' | 'plano_essencial' | 'plano_profissional' | 'plano_premium' | null;
  recorrencia: 'mensal' | 'anual' | null;
  lojaId: string | null;
  lojaNome: string | null;
  lojaSlug: string | null;
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

      if (userError) {
        console.error("Erro ao obter usuário:", userError);
        setUser(null);
        setProfile(null);
        setLoading(false);
        router.push('/login');
        return;
      }

      if (!supabaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        router.push('/login');
        return;
      }

      setUser(supabaseUser);

      // CORREÇÃO: A query foi ajustada para buscar o plano e a recorrência
      // fazendo um JOIN com as tabelas 'lojas' e 'assinaturas'.
      let { data: userProfileData, error: profileError } = await supabase
        .from('usuarios')
        .select(`
          nome_completo,
          email,
          lojas(id, nome_loja, slug, assinaturas(planos(nome), status, data_inicio))
        `)
        .eq('id', supabaseUser.id)
        .single();

      if (profileError && (profileError as PostgrestError).code === 'PGRST116') {
        console.warn("Perfil do usuário não encontrado na tabela 'usuarios'. Criando um novo perfil básico.");

        const { data: newProfileData, error: newProfileError } = await supabase
          .from('usuarios')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email,
            nome_completo: supabaseUser.email?.split('@')[0],
          })
          .select('nome_completo, email')
          .single();
        
        if (newProfileError) {
          console.error("Erro ao criar novo perfil de usuário:", newProfileError);
          setProfile(null);
        } else {
          // Se o perfil foi criado, buscamos as informações de plano e recorrência novamente
          const { data: updatedProfile, error: updatedProfileError } = await supabase
            .from('usuarios')
            .select(`
              nome_completo,
              email,
              lojas(id, nome_loja, slug, assinaturas(planos(nome), status, data_inicio))
            `)
            .eq('id', supabaseUser.id)
            .single();

          if (updatedProfileError) {
            console.error("Erro ao carregar perfil após a criação:", updatedProfileError);
            setProfile(null);
          } else {
            userProfileData = updatedProfile;
          }
        }
      } else if (profileError) {
        console.error("Erro inesperado ao carregar perfil do usuário:", JSON.stringify(profileError, null, 2));
        setProfile(null);
      }
      
      if (userProfileData) {
        // CORREÇÃO: Mapeamento de dados de forma mais segura para evitar erros de tipagem.
        const lojaData = Array.isArray(userProfileData.lojas) && userProfileData.lojas.length > 0 ? userProfileData.lojas[0] : null;
        const assinaturaData = lojaData?.assinaturas?.[0] || null;
        const plano = assinaturaData?.planos?.[0]?.nome || 'plano_gratis';

        const formattedProfile: UserProfile = {
          nome_completo: userProfileData.nome_completo,
          email: userProfileData.email,
          lojaId: lojaData?.id || null,
          lojaNome: lojaData?.nome_loja || null,
          lojaSlug: lojaData?.slug || null,
          plano: plano as UserProfile['plano'],
          recorrencia: assinaturaData?.status === 'ativa' ? 'mensal' : null, // Ajuste a recorrência com base no seu esquema se existir
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
        if (event === 'SIGNED_OUT') {
          router.push('/login');
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

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
