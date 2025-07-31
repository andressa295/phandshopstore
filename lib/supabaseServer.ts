// lib/supabaseServer.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getSupabaseServerClient = async () => { // <-- **ADICIONE 'async' AQUI**
  return createServerComponentClient({ cookies });
};