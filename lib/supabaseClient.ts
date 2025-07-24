// lib/supabaseClient.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// Mude esta linha para usar a variável com o prefixo correto e o nome completo
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; 

export const supabase = createClient(supabaseUrl, supabaseKey);