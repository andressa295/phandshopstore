'use client';

import Image from "next/image";
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

export function Footer() {
  return (
    <footer
      id="contato"
      style={{
        backgroundColor: '#4b0082',
        color: '#fff',
        padding: '3rem 1.5rem',
        display: 'grid',
        gap: '2.5rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        fontSize: '0.875rem',
        fontFamily: 'inherit', // já pega do layout (Poppins)
      }}
    >

      <div>
        <h4 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Menu</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {['Loja online', 'Funcionalidades', 'Dropship', 'Loja de temas', 'Comparar plataforma'].map((item, idx) => (
            <li key={idx} style={{ marginBottom: '0.5rem' }}>
              <a href="#" style={{ textDecoration: 'none', color: '#fff', cursor: 'pointer' }}>{item}</a>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 style={{ fontWeight: 600, marginBottom: '0.75rem' }}>Atendimento</h4>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ textDecoration: 'none', color: '#fff', cursor: 'pointer' }}>Central de ajuda</a></li>
          <li style={{ marginBottom: '0.5rem' }}><a href="#" style={{ textDecoration: 'none', color: '#fff', cursor: 'pointer' }}>Fale conosco</a></li>
          <li style={{ marginBottom: '0.5rem' }}>
            <a
              href="https://wa.me/seunumero"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none', color: '#fff', display: 'block', textAlign: 'center' }}
            >
              Whatsapp
            </a>
          </li>
        </ul>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <a href="#" aria-label="Instagram" style={{ color: '#fff' }}>
            <FaInstagram size={20} />
          </a>
          <a href="#" aria-label="Facebook" style={{ color: '#fff' }}>
            <FaFacebook size={20} />
          </a>
          <a href="#" aria-label="Whatsapp" style={{ color: '#fff' }}>
            <FaWhatsapp size={20} />
          </a>
        </div>
      </div>
<div>
        <Image src="/logo.png" alt="Logo" width={170} height={50} />
        <p>© {new Date().getFullYear()} Phandshop. Todos os direitos reservados.</p>
      </div>
      
      <style jsx>{`
        @media (max-width: 600px) {
          footer {
            grid-template-columns: 1fr !important;
            text-align: center;
          }
          footer div {
            margin-bottom: 2rem;
          }
          footer div:last-child {
            margin-bottom: 0;
          }
        }
      `}</style>
    </footer>
  );
}
