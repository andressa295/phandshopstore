// lib/supabaseServer.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getSupabaseServerClient = () => {
  // Passa a função cookies diretamente para o cliente Supabase.
  // Isso resolve o erro de contexto síncrono.
  return createServerComponentClient({ cookies });
};
