import { createClient } from '@supabase/supabase-js';

// Cliente para tarefas internas (jobs, automações, etc.)
export const supaBaseAdmin = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
