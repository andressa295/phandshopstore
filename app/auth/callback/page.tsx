'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      console.log("--- AuthCallbackPage: Iniciando verificação de autenticação ---");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('AuthCallbackPage: Erro ao obter a sessão:', sessionError);
        router.replace('/login?error=auth_failed');
        return;
      }
      
      if (session) {
        const { user } = session;
        console.log('AuthCallbackPage: Usuário autenticado:', user.id);

        // Tentar buscar a loja do usuário
        const { data: loja, error: lojaError } = await supabase
          .from('lojas')
          .select('slug')
          .eq('owner_id', user.id) // Usar 'owner_id'
          .single();

        if (lojaError && lojaError.code !== 'PGRST116') { // PGRST116 é 'no rows found'
          // Se for um erro real do banco de dados (não apenas loja não encontrada)
          console.error('AuthCallbackPage: Erro real ao buscar loja do usuário:', lojaError);
          router.replace('/login?error=db_error'); // Redireciona para login com erro de DB
          return;
        }

        if (loja) {
          // Loja encontrada, redireciona para o slug da loja
          console.log('AuthCallbackPage: Loja encontrada, redirecionando para:', `/${loja.slug}`);
          router.replace(`/${loja.slug}`);
        } else {
          // Nenhuma loja encontrada para o usuário, redireciona para onboarding
          console.log('AuthCallbackPage: Nenhuma loja encontrada para o usuário, redirecionando para /onboarding');
          router.replace('/onboarding');
        }
      } else {
        // Nenhuma sessão encontrada, redireciona para o login
        console.log('AuthCallbackPage: Nenhuma sessão encontrada, redirecionando para /login');
        router.replace('/login?error=auth_failed');
      }
      console.log("--- AuthCallbackPage: Fim da verificação ---");
    };

    handleAuthCallback();
  }, [supabase, router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Confirmando e-mail...</p>
    </div>
  );
}
