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

      if (session?.user) {
        const user = session.user;

        // Tenta carregar loja vinculada ao usuário
        const { data: loja } = await supabase
          .from('lojas')
          .select('id, slug')
          .eq('owner_id', user.id)
          .maybeSingle();

        if (loja) {
          router.replace('/dashboard'); // ✅ já tem loja, vai pro painel
        } else {
          router.replace('/onboarding'); // ✅ não tem loja, cria uma
        }
      } else {
        router.replace('/login'); // ❌ só se realmente não tem sessão
      }
    };

    handleAuthCallback();
  }, [supabase, router]);

  return <p>Confirmando e-mail...</p>;
}
