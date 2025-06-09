'use client';

// Adicionado useState e ícones
import React, { useState } from 'react'; 
import Link from 'next/link';
import Image from 'next/image';
import { FaBars, FaTimes } from 'react-icons/fa'; // <<-- ADICIONADO

// Seus objetos de estilo originais (NÃO FORAM MODIFICADOS)
const headerStyles: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '64px',
  backgroundColor: '#6b21a8', display: 'flex', alignItems: 'center',
  justifyContent: 'space-between', padding: '0 2rem', zIndex: 1000,
  fontFamily: "'Poppins', sans-serif",
};
const logoContainerStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none',
};
const navStyle: React.CSSProperties = {
  display: 'flex', alignItems: 'center', gap: '1.5rem',
};
const linkStyle: React.CSSProperties = {
  color: '#eee', textDecoration: 'none', fontWeight: 500,
  fontSize: '0.95rem', transition: 'color 0.2s ease',
};
const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem', backgroundColor: '#fff', color: '#4c1d95',
  borderRadius: '0.5rem', fontWeight: 600, textDecoration: 'none',
  fontSize: '0.95rem',
};

// Estilos APENAS para os novos elementos do menu mobile
const hamburgerButtonStyle: React.CSSProperties = {
  display: 'none', // Escondido por padrão no desktop
  background: 'none', border: 'none', color: 'white', cursor: 'pointer', zIndex: 1002,
};
const mobileNavOverlayStyle: React.CSSProperties = {
  position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
  backgroundColor: 'rgba(49, 18, 92, 0.98)', backdropFilter: 'blur(5px)',
  display: 'flex', flexDirection: 'column', alignItems: 'center',
  justifyContent: 'center', gap: '2rem',
  transition: 'opacity 0.3s ease-in-out', zIndex: 1001,
};
const mobileNavLinkStyle: React.CSSProperties = { ...linkStyle, fontSize: '1.5rem' };
const mobileNavButtonStyle: React.CSSProperties = { ...buttonStyle, fontSize: '1.2rem', padding: '0.75rem 1.5rem' };


export default function Header() {
  // <<-- ADICIONADO: Estado para controlar se o menu está aberto -->>
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Função para fechar o menu, para ser usada nos links
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <>
      <header style={headerStyles}>
        <Link href="/" style={logoContainerStyle} onClick={closeMenu}>
          <Image
            src="/logo.png"
            alt="Phandshop Logo"
            width={190}
            height={50}
            priority
          />
        </Link>

        {/* NAVEGAÇÃO DESKTOP (será escondida no mobile pelo <style jsx>) */}
        <nav style={navStyle} className="nav-desktop">
          <Link href="/planos" style={linkStyle}>
            Planos e Preços
          </Link>
          <Link href="/login" style={linkStyle}>
            Fazer Login
          </Link>
          <Link href="/cadastro" style={buttonStyle}>
            Criar loja virtual
          </Link>
        </nav>

        {/* <<-- ADICIONADO: Botão Hambúrguer/X que só aparece no mobile -->> */}
        <button 
          className="hamburger-button" 
          style={hamburgerButtonStyle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Abrir menu"
        >
          {isMenuOpen ? <FaTimes size={26} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* <<-- ADICIONADO: Painel do menu que só aparece quando 'isMenuOpen' é true -->> */}
      {isMenuOpen && (
        <div style={mobileNavOverlayStyle}>
          <Link href="/planos" style={mobileNavLinkStyle} onClick={closeMenu}>
            Planos e Preços
          </Link>
          <Link href="/login" style={mobileNavLinkStyle} onClick={closeMenu}>
            Fazer Login
          </Link>
          <Link href="/cadastro" style={mobileNavButtonStyle} onClick={closeMenu}>
            Criar loja virtual
          </Link>
        </div>
      )}

      {/* <<-- ADICIONADO: Bloco de CSS para a responsividade -->> */}
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop {
            display: none;
          }
          .hamburger-button {
            display: block;
          }
        }
      `}</style>
    </>
  );
}