// lib/supabaseServer.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

/**
 * Cria e retorna um cliente Supabase para uso em Server Components e API Routes.
 * Este utilitário ajuda a evitar avisos de linting do Next.js sobre o uso de 'cookies()'.
 */
export const getSupabaseServerClient = () => {
  return createServerComponentClient({ cookies });
};
