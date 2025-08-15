// app/auth/callback/page.tsx
'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // Se a sessão for válida, redireciona para a página de onboarding
        router.replace('/onboarding');
      } else {
        // Se a sessão for inválida (token expirado, etc.), redireciona para o login com um erro
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