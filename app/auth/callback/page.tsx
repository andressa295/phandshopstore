'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao obter a sessão:', error);
        router.replace('/login?error=auth_failed');
        return;
      }
      
      if (session) {
        router.replace('/onboarding');
      } else {
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