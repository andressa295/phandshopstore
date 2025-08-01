import { getSupabaseServerClient } from '@/lib/supabaseServer'; 
import { SupabaseProvider } from './components/SupabaseProvider'; 
import '../globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from './components/ui/HeaderGlobal';
import { Footer } from './components/ui/FooterGlobal';
import { FiShoppingBag } from 'react-icons/fi';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Phandshop - Sua Loja Online', 
  description: 'Crie sua loja virtual com facilidade e a menor taxa do mercado.', 
};

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await getSupabaseServerClient(); 

  const { data: { user } } = await supabase.auth.getUser(); 

  return (
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