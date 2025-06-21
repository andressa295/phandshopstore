import './globals.css';
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main lang="pt-BR" className={poppins.className}>
      <div
        
      >
        <Header />

        <main style={{ paddingTop: '70px' }}>
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
    </main>
  );
}
