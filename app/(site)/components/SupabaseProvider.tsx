'use client';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { SessionContextProvider } from '@supabase/auth-helpers-react'; 
import { useState, ReactNode } from 'react';

interface SupabaseProviderProps {
  children: ReactNode;
  initialSession: Session | null;
}

export default function SupabaseProvider({ children, initialSession }: SupabaseProviderProps) {
  const [supabaseClient] = useState(() => createClientComponentClient());

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={initialSession}>
      {children}
    </SessionContextProvider>
  );
}