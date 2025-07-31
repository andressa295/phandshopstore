// app\(site)\components\SupabaseProvider.tsx

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
  profile: any | null; // Considere criar uma interface 'Profile' para tipagem forte
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface SupabaseProviderProps {
  initialUser: User | null;
  children: ReactNode;
}

export const SupabaseProvider = ({
  initialUser,
  children,
}: SupabaseProviderProps) => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(initialUser);
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async (userId: string) => {
      setLoading(true);

      const { data, error } = await supabase
        .from('usuarios') // Assegure-se que este é o nome correto da sua tabela de perfis
        .select('*')
        .eq('id', userId)
        .single();

      console.log('🔍 Supabase retorno do perfil:', { data, error });

      // MELHORIA AQUI: Log mais detalhado do erro
      if (error) { // Removido Object.keys(error).length > 0 para pegar qualquer erro
        console.error('❌ Erro ao buscar perfil do usuário:', error.message || 'Erro desconhecido');
        console.error('Detalhes completos do erro (se disponíveis):', JSON.stringify(error, null, 2));
        setProfile(null);
      } else if (data) {
        setProfile(data);
      } else {
        // Isso pode acontecer se .single() não encontrar nada e não retornar um erro explícito
        console.log('⚠️ Perfil do usuário não encontrado para o ID:', userId, 'sem erro explícito.');
        setProfile(null);
      }

      setLoading(false);
    };

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          setUser(session.user);
          // Certifique-se de chamar fetchUserProfile apenas se tiver um ID de usuário
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
          // router.push('/login'); // habilita se quiser redirecionar
        }
      }
    );

    // Lida com o initialUser vindo do servidor
    if (initialUser) {
      // Garante que o ID do usuário inicial é válido antes de buscar o perfil
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
  }, [initialUser, supabase, router]); // Dependências

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

export default SupabaseProvider;