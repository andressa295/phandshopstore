import './globals.css';
import type { Metadata } from 'next';
import { FiShoppingBag } from 'react-icons/fi';
import { Poppins } from 'next/font/google';
import { Footer } from './components/ui/FooterGlobal';
import Header from './components/ui/HeaderGlobal';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Sua Plataforma de Lojas Online',
  description: 'Crie sua loja virtual com facilidade e a menor taxa do mercado.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.className}>
      <body style={{ margin: 0, padding: 0, background: '#fff' }}>
        <Header />

        <main style={{ padding: '2rem 1rem', maxWidth: '1440px', margin: '0 auto' }}>
          {children}
        </main>

        <div
          style={{
            width: '100%',
            background: 'linear-gradient(to right, #4b0082, #9b59b6)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              display: 'flex',
              gap: '2.5rem',
              whiteSpace: 'nowrap',
              padding: '0.5rem 0',
              animation: 'marquee 20s linear infinite',
              alignItems: 'center',
              color: '#fff',
              fontWeight: 500,
              fontSize: '0.875rem',
            }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
                Criar loja <FiShoppingBag style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }} />
              </span>
            ))}
          </div>
        </div>

        <Footer />

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
        `}</style>
      </body>
    </html>
  );
}
