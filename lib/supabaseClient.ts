'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Cliente para usar em componentes React (client-side)
export const supaBaseCliente = createClientComponentClient();
