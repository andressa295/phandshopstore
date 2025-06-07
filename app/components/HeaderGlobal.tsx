'use client';

import React from 'react';
import Link from 'next/link';

const headerStyles: React.CSSProperties = {
  position: 'relative',
  top: 0,
  left: 0,
  width: '100%',
  height: '64px',
  backgroundColor: '#fff',
  borderBottom: '1px solid #E5E7EB',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  zIndex: 1000,
  fontFamily: "'Poppins', sans-serif",
};

const logoStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 700,
  color: '#6D28D9',
  textDecoration: 'none',
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
};

const linkStyle: React.CSSProperties = {
  color: '#4B5563',
  textDecoration: 'none',
  fontWeight: 500,
  fontSize: '0.95rem',
  transition: 'color 0.2s ease',
  fontFamily: "'Poppins', sans-serif",
};

const buttonStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  backgroundColor: '#6D28D9',
  color: '#fff',
  borderRadius: '0.5rem',
  fontWeight: 600,
  textDecoration: 'none',
  fontSize: '0.95rem',
  fontFamily: "'Poppins', sans-serif",
};

export default function Header() {
  return (
    <header style={headerStyles}>
      <Link href="/" style={logoStyle}>
        Phandshop
      </Link>
      <nav style={navStyle}>
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
    </header>
  );
}
