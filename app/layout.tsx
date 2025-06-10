
import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';


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
        
        <main style={{ padding: '2rem 1rem', maxWidth: '1440px', margin: '0 auto' }}>
          {children}
        </main>

        
        
      </body>
    </html>
  );
}
