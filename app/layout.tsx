import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { headers } from 'next/headers';
import { getSupabaseServerClient } from '@/lib/supabaseServer'; // Importa getSupabaseServerClient
import { SupabaseProvider } from './(site)/components/SupabaseProvider'; 
import VisitTracker from './(site)/components/VisitTracker';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Sua Plataforma de Lojas Online',
  description: 'Crie sua loja virtual com facilidade e a menor taxa do mercado.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = await getSupabaseServerClient(); 

  const {
    data: { user },
  } = await supabase.auth.getUser(); 

  const host = (await headers()).get('host');
  let lojaId: string | null = null;

  if (host) {
    const subdominio = host.split('.')[0];

    const { data: lojaData, error: lojaError } = await supabase 
      .from('lojas')
      .select('id')
      .or(`subdominio.eq.${subdominio},dominio_personalizado.eq.${host}`)
      .single();

    if (lojaError && lojaError.code !== 'PGRST116') {
      console.error('Erro ao buscar loja pelo host:', lojaError.message);
    } else if (lojaData) {
      lojaId = lojaData.id;
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