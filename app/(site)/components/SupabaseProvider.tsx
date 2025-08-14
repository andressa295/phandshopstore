'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';

export interface UserProfile {
  id: string;
  email: string | null; // CORRIGIDO: Agora permite null
  nome_completo: string | null;
  lojaId: string | null;
  lojaNome: string | null;
  lojaSlug: string | null;
  plano: string | null;
  recorrencia: string | null;
  preco_mensal?: number | null;
  preco_anual?: number | null;
}

interface SupabaseContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null; }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      setLoading(true);
      const { data: lojaData, error: lojaError } = await supabase
        .from('lojas')
        .select(`
          id,
          nome_loja,
          slug,
          user_id,
          assinaturas(
            planos(
              nome_plano,
              preco_mensal,
              preco_anual
            ),
            status,
            periodo_atual_fim
          )
        `)
        .eq('user_id', userId)
        .single();

      if (lojaError) {
        if (lojaError.code === 'PGRST116') {
          setProfile(null);
        } else {
          console.error('Erro ao buscar o perfil do usuário:', lojaError);
          setProfile(null);
        }
      } else {
        const assinaturaData = lojaData?.assinaturas?.[0] || null;
        const planoData = assinaturaData?.planos?.[0] || null;

        const userProfileData: UserProfile = {
          id: lojaData.user_id,
          email: user?.email ?? null, // CORRIGIDO: Atribuindo user.email, que pode ser null
          nome_completo: null,
          lojaId: lojaData.id,
          lojaNome: lojaData.nome_loja,
          lojaSlug: lojaData.slug,
          plano: planoData?.nome_plano || null,
          recorrencia: assinaturaData?.periodo_atual_fim ? (planoData?.preco_anual ? 'anual' : 'mensal') : null,
          preco_mensal: planoData?.preco_mensal || null,
          preco_anual: planoData?.preco_anual || null,
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
      }
    });

    if (initialUser) {
      fetchUserProfile(initialUser.id);
    } else {
      setLoading(false);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, [initialUser, supabase, user?.email]);

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