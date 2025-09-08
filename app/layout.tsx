import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { headers } from 'next/headers';
import { createServerComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { SupabaseProvider } from './(site)/components/SupabaseProvider';
import VisitTracker from './(site)/components/VisitTracker';
import './globals.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Sua Plataforma de Lojas Online',
  description: 'Crie sua loja virtual com facilidade e a menor taxa do mercado.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // VERIFICAÇÃO ADICIONADA: se as chaves não existirem, retorna um erro controlado
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return (
      <html lang="pt-BR" className={poppins.className}>
        <body>
          <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
            <h1>Erro de Configuração</h1>
            <p>As chaves do Supabase n&atilde;o est&atilde;o definidas.</p>
          </div>
        </body>
      </html>
    );
  }

  // CORRIGIDO: A inicialização do cliente Supabase é feita aqui, dentro do componente
  const supabase = createServerComponentClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  
  const host = (await headers()).get('host');
  let lojaId: string | null = null;
  
  if (host) {
    const hostParts = host.split('.');
    const subdominio = hostParts.length > 2 && hostParts[0] !== 'www' ? hostParts[0] : null;

    if (subdominio) {
      const { data: lojaData, error: lojaError } = await supabase
        .from('lojas')
        .select('id')
        .eq('slug', subdominio)
        .single();
    
      if (!lojaError && lojaData) {
        lojaId = lojaData.id;
      }
    }
  }

  return (
    <html lang="pt-BR" className={poppins.className}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400..900&display=swap" rel="stylesheet" />
        
        <script
          async
          defer
          data-website-id="0b0f68e0-5d10-4c8a-98f3-c83f265cb3c2"
          src="https://umami.phandshop.com.br/script.js"
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#ffffff' }}>
        <SupabaseProvider initialUser={user}>
          <main className="main-layout">{children}</main>
        </SupabaseProvider>

        {lojaId && <VisitTracker lojaId={lojaId} />}
      </body>
    </html>
  );
}