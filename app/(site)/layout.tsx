// app/(site)/layout.tsx

// IMPORTS NECESSÁRIOS PARA O SUPABASE SERVER-SIDE
import { getSupabaseServerClient } from '@/lib/supabaseServer'; // Certifique-se que o caminho está correto
import SupabaseProvider from './components/SupabaseProvider'; // Caminho para o SupabaseProvider DENTRO DA PASTA (site)

// Imports que você já tinha
import '../globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from './components/ui/HeaderGlobal';
import { Footer } from './components/ui/FooterGlobal';
import { FiShoppingBag } from 'react-icons/fi';
// import { headers } from 'next/headers'; // Comentado, pois não é estritamente necessário neste layout, mas pode ser adicionado se precisar do host aqui.

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Phandshop - Sua Loja Online', 
  description: 'Crie sua loja virtual com facilidade e a menor taxa do mercado.', 
};

// ESTE COMPONENTE É ASYNC
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // CORRIGIDO: AGORA AWAITAMOS getSupabaseServerClient()
  const supabase = await getSupabaseServerClient(); 

  // Obtém o usuário logado
  const { data: { user } } = await supabase.auth.getUser(); // 'supabase' já é o objeto correto

  return (
    // Envolve TUDO com o SupabaseProvider
    <SupabaseProvider initialUser={user}>
      <div
        className={poppins.className} 
        style={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Header />

        <main style={{ paddingTop: '70px', flexGrow: 1 }}>
          {children}
        </main>

        {/* Seu marquee aqui */}
        <div className="phand-marquee-container">
          <div className="phand-marquee">
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                Criar loja grátis <FiShoppingBag style={{ margin: '0 0.5rem' }} />
              </span>
            ))}
          </div>
        </div>

        <Footer />
      </div>
    </SupabaseProvider>
  );
}