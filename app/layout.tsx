import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
// Removido: import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers'; // cookies ainda é necessário para o utilitário
import SupabaseProvider from './(site)/components/SupabaseProvider'; // Ajuste o caminho se necessário
import VisitTracker from './(site)/components/VisitTracker'; // Ajuste o caminho se necessário
import { getSupabaseServerClient } from '@/lib/supabaseServer'; // Ajuste o caminho se 'lib' não estiver na raiz ou se o alias não estiver configurado

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Sua Plataforma de Lojas Online',
  description: 'Crie sua loja virtual com facilidade e a menor taxa do mercado.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // CORREÇÃO: Usando o utilitário para criar o cliente Supabase
  const supabase = getSupabaseServerClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  let lojaId: string | null = null;
  const host = (await headers()).get('host'); // Obtém o hostname da requisição (ex: minhaloja.phandshop.com.br ou customdomain.com)

  if (host) {
    const { data: lojaData, error: lojaError } = await supabase
      .from('lojas')
      .select('id')
      .or(`subdominio.eq.${host.split('.')[0]},dominio_personalizado.eq.${host}`) // Verifica se o host é um subdomínio ou domínio personalizado
      .single();

    if (lojaError && lojaError.code !== 'PGRST116') { // PGRST116 é "no rows found"
      console.error('Erro ao buscar loja pelo host:', lojaError.message);
    } else if (lojaData) {
      lojaId = lojaData.id;
    }
  }

  return (
    <html lang="pt-BR" className={poppins.className}>
      <head>
        {/* Script de rastreamento do Umami (para a plataforma Phandshop em si) */}
        {/* Mantenha este script se ele for para rastrear o uso da sua plataforma (Phandshop.com.br) */}
        <script
          async
          defer
          data-website-id="0b0f68e0-5d10-4c8a-98f3-c83f265cb3c2"
          src="https://umami.phandshop.com.br/script.js"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#fff' }}>
        <main style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
          {/* Passa o objeto 'user' para o SupabaseProvider */}
          {/* Você precisará ajustar o SupabaseProvider para aceitar 'initialUser' em vez de 'initialSession' */}
          <SupabaseProvider initialUser={user}>
            {children}
          </SupabaseProvider>
        </main>

        {/* Componente de rastreamento de visitas para CADA LOJA */}
        {/* Ele só será renderizado e ativado se um lojaId for encontrado */}
        {lojaId && <VisitTracker lojaId={lojaId} />}
      </body>
    </html>
  );
}
