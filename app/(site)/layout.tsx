import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { SupabaseProvider } from './components/SupabaseProvider';
import '../globals.css';
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import Header from './components/ui/HeaderGlobal';
import { Footer } from './components/ui/FooterGlobal';
import { FiShoppingBag } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';

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

        <main style={{ paddingTop: '0px', flexGrow: 1 }}>
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

        {/* Botão flutuante do WhatsApp */}
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 9999,
          }}
        >
          <div
            style={{
              backgroundColor: 'rgba(240, 240, 240, 0.9)', // cinza clarinho e translúcido
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#333',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
            }}
          >
            Falar com um especialista
          </div>
          <a
            href="https://wa.me/5511949184370?text=Ol%C3%A1%2C+quero+saber+mais+sobre+a+Phandshop"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#25D366',
              color: '#fff',
              borderRadius: '50%',
              width: '56px',
              height: '56px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            }}
          >
            <FaWhatsapp size={28} />
          </a>
        </div>
      </div>
    </SupabaseProvider>
  );
}
