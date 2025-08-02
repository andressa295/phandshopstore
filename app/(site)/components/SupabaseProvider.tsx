'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface SupabaseContextType {
  user: User | null;
  loading: boolean;
}

const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);

export function SupabaseProvider({ children, initialUser }: { children: ReactNode; initialUser: User | null; }) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    // Inicializa o estado de carregamento e o usuário
    setUser(initialUser);
    setLoading(false);

    // Adiciona o listener de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Se o usuário saiu, limpa a sessão e redireciona
      if (event === 'SIGNED_OUT') {
        setUser(null);
        router.push('/login');
      } else {
        // Para outros eventos (SIGNED_IN, USER_UPDATED), atualiza o estado do usuário
        setUser(session?.user ?? null);
      }
    });

    // Limpa a assinatura quando o componente é desmontado
    return () => {
      subscription?.unsubscribe();
    };
  }, [initialUser, supabase, router]);

  return (
    <SupabaseContext.Provider value={{ user, loading }}>
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
