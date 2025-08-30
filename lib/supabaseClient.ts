'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verificação de segurança para evitar erros em tempo de execução
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('As variáveis de ambiente do Supabase não estão definidas.');
}

export const supabase = createClientComponentClient({
  supabaseUrl,
  supabaseKey: supabaseAnonKey,
});