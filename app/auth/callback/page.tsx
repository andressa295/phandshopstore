'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Tenta obter a sessão do usuário
      const { data: { session } } = await supabase.auth.getSession();
      
      // Se a sessão for válida, redireciona para a página de onboarding
      if (session) {
        router.replace('/onboarding');
      } else {
        // Se a sessão for inválida, redireciona para o login com um erro
        router.replace('/login?error=auth_failed');
      }
    };

    handleAuthCallback();
  }, [supabase, router]);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <p>Confirmando e-mail...</p>
    </div>
  );
}