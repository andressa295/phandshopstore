'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { createClientComponentClient, Session, User } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

// Defina o contexto com o tipo de usuário ou null
interface UserContextType {
  user: User | null;
  profile: any | null; // Defina um tipo mais específico para 'profile' se tiver
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface SupabaseProviderProps {
  initialUser: User | null; // Mudado de initialSession: Session | null
  children: ReactNode;
}

export const SupabaseProvider = ({ initialUser, children }: SupabaseProviderProps) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser); // Inicializa com o usuário passado
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      setLoading(true);
      const { data, error } = await supabase
        .from('usuarios') // Assumindo que sua tabela de perfis é 'usuarios'
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Erro ao buscar perfil do usuário:', error);
        setProfile(null);
      } else {
        setProfile(data);
      }
      setLoading(false);
    };

    // Listener para mudanças de estado de autenticação
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
        // Opcional: redirecionar para login se o usuário sair
        // router.push('/login');
      }
    });

    // Se o usuário inicial já existe, busca o perfil
    if (initialUser) {
      fetchUserProfile(initialUser.id);
    } else {
      setLoading(false);
    }

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [initialUser, supabase, router]);

  return (
    <UserContext.Provider value={{ user, profile, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a SupabaseProvider');
  }
  return context;
};

export default SupabaseProvider; // Exporta como default também