'use client'; 

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  createClientComponentClient,
  User,
} from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

interface UserContextType {
  user: User | null;
  profile: any | null; 
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface SupabaseProviderProps {
  initialUser: User | null;
  children: ReactNode;
}

export function SupabaseProvider({ 
  initialUser,
  children,
}: SupabaseProviderProps) {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      setLoading(true);

      const { data, error } = await supabase
        .from('usuarios') 
        .select('*')
        .eq('id', userId)
        .single();

      console.log('🔍 Supabase retorno do perfil:', { data, error });

      if (error) { 
        console.error('❌ Erro ao buscar perfil do usuário:', error.message || 'Erro desconhecido');
        console.error('Detalhes completos do erro (se disponíveis):', JSON.stringify(error, null, 2));
        setProfile(null);
      } else if (data) {
        setProfile(data);
      } else {
        console.log('⚠️ Perfil do usuário não encontrado para o ID:', userId, 'sem erro explícito.');
        setProfile(null);
      }

      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          if (session.user.id) {
            fetchUserProfile(session.user.id);
          } else {
            console.warn('⚠️ Usuário logado sem ID. Não foi possível buscar perfil.');
            setProfile(null);
            setLoading(false);
          }
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      }
    );

    if (initialUser) {
      if (initialUser.id) {
        fetchUserProfile(initialUser.id);
      } else {
        console.warn('⚠️ Usuário inicial sem ID. Não foi possível buscar perfil.');
        setProfile(null);
        setLoading(false);
      }
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
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a SupabaseProvider');
  }
  return context;
};