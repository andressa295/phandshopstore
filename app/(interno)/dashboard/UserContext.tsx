'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  nome: string;
  plano: string;
  recorrencia: string;
  email: string;
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

      const { data: userProfileData, error: profileError } = await supabase
        .from('usuarios')
        .select('nome, plano, recorrencia, email')
        .eq('id', supabaseUser.id)
        .single();

      if (profileError) {
        // --- CORREÇÃO: USANDO JSON.stringify PARA VER O CONTEÚDO COMPLETO DO ERRO ---
        console.error("Erro ao carregar perfil do usuário:", JSON.stringify(profileError, null, 2));
        setProfile(null);
      } else {
        setProfile(userProfileData as UserProfile);
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