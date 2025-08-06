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
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user ?? null;
  
  const host = (await headers()).get('host');
  let lojaId: string | null = null;
  
  if (host) {
    const hostParts = host.split('.');
    const subdominio = hostParts.length > 2 && hostParts[0] !== 'www' ? hostParts[0] : null;

    if (subdominio) {
      console.log(`Tentando buscar loja com slug: ${subdominio}`);
      // CORREÇÃO: Usando 'slug' em vez de 'subdominio' na query
      const { data: lojaData, error: lojaError } = await supabase
        .from('lojas')
        .select('id')
        .eq('slug', subdominio)
        .single();
    
      if (lojaError && lojaError.code !== 'PGRST116') {
        console.error('Erro ao buscar loja pelo slug:', lojaError.message);
      } else if (lojaData) {
        lojaId = lojaData.id;
        console.log(`Loja encontrada com ID: ${lojaId}`);
      } else {
        console.warn(`Nenhuma loja encontrada para o slug: ${subdominio}`);
      }
    } else {
      console.warn('Não é um subdomínio válido. Pulando a busca por loja.');
    }
  }

  return (
    <html lang="pt-BR" className={poppins.className}>
      <head>
        <script
          async
          defer
          data-website-id="0b0f68e0-5d10-4c8a-98f3-c83f265cb3c2"
          src="https://umami.phandshop.com.br/script.js"
        />
      </head>
      <body style={{ margin: 0, padding: 0, backgroundColor: '#fff' }}>
        <SupabaseProvider initialUser={user}>
          <main
            style={{
              width: '100%',
              minHeight: '100vh',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {children}
          </main>
        </SupabaseProvider>

        {lojaId && <VisitTracker lojaId={lojaId} />}
      </body>
    </html>
  );
}
