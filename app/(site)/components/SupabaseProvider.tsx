'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';

// Importa as interfaces de dados do Supabase que definimos
import { LojaDataSupabase, UserProfile } from '../../(painel)/personalizar/types'; // Ajuste o caminho se necessário

// A interface UserProfile já foi definida no seu types.ts
// export interface UserProfile { ... }

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
    async function fetchUserProfile(userId: string) {
      setLoading(true);
      console.log("--- SupabaseProvider: Iniciando fetchUserProfile ---");
      console.log("SupabaseProvider: userId para busca:", userId);

      try {
        // Usando a interface LojaDataSupabase para tipar o retorno
        const { data: lojaData, error: lojaError } = await supabase
          .from('lojas')
          .select(`
            id, 
            nome_loja, 
            slug, 
            owner_id, 
            assinaturas(
              status,
              periodo_atual_fim,
              planos(
                nome_plano, 
                preco_mensal, 
                preco_anual
              )
            )
          `)
          .eq('owner_id', userId)
          .maybeSingle(); // ✅ corrigido

        if (lojaError) {
          console.error("SupabaseProvider: Erro ao carregar loja:", lojaError);
          setProfile(null);
        } else if (lojaData) {
          console.log("SupabaseProvider: Dados da loja carregados:", lojaData);

          const assinaturaData = lojaData.assinaturas?.[0] || null;
          const planoData = assinaturaData?.planos?.[0] || null;

          const userProfileData: UserProfile = {
            id: userId,
            email: user?.email ?? null,
            nome_completo: null, // Você precisaria buscar isso da tabela 'usuarios' se quiser
            lojaId: lojaData.id,
            lojaNome: lojaData.nome_loja,
            lojaSlug: lojaData.slug,
            plano: planoData?.nome_plano || 'Plano Grátis',
            recorrencia: assinaturaData?.status === 'active' ? (planoData?.preco_anual ? 'anual' : 'mensal') : null,
            preco_mensal: planoData?.preco_mensal || null,
            preco_anual: planoData?.preco_anual || null,
          };
          setProfile(userProfileData);
          console.log("SupabaseProvider: Perfil formatado:", userProfileData);
        } else {
          console.log("SupabaseProvider: Nenhuma loja encontrada para o usuário.");
          setProfile({ 
            id: userId, 
            email: user?.email ?? null, 
            nome_completo: null, 
            lojaId: null, 
            lojaNome: null, 
            lojaSlug: null,
            plano: 'Plano Grátis',
            recorrencia: null,
            preco_mensal: null,
            preco_anual: null,
          });
        }
      } catch (err: any) {
        console.error("SupabaseProvider: Erro inesperado ao buscar o perfil do usuário:", err);
        setProfile(null);
      } finally {
        setLoading(false);
        console.log("--- SupabaseProvider: Fim de fetchUserProfile ---");
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("SupabaseProvider: Evento de autenticação:", event, "Session:", session);
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    if (initialUser) {
      setUser(initialUser);
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
