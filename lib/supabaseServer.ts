// lib/supabaseServer.ts
// Este helper é para uso em Server Components (page.tsx, layout.tsx, etc.)
// Para API Routes (route.ts), a criação do cliente Supabase é feita de forma ligeiramente diferente.

import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const getSupabaseServerClient = () => {
  return createServerComponentClient({ cookies });
};