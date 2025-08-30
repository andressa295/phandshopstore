import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';

// Cliente para usar em rotas API ou páginas server-side
export function supaBaseServer() {
  return createRouteHandlerClient({ cookies });
}
