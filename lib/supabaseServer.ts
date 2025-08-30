import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// Exporta função para criar client server-side
export function supaBaseServer() {
  return createRouteHandlerClient({ cookies });
}
