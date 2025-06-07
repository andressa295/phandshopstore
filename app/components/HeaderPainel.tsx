'use client';

import React from 'react';
import Link from 'next/link';

const headerStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '56px',
  backgroundColor: '#5b21b6', // roxo escuro firme
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  padding: '0 1.5rem',
  zIndex: 1100,
  fontWeight: 600,
  fontFamily: "'Poppins', sans-serif",
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
};

const navStyle: React.CSSProperties = {
  marginLeft: 'auto',
  display: 'flex',
  gap: '1.5rem',
};

const linkStyle: React.CSSProperties = {
  color: '#ddd',
  textDecoration: 'none',
  fontSize: '0.9rem',
};

export default function HeaderPainel() {
  return (
    <header style={headerStyles}>
      <Link href="/painel" style={{ color: '#fff', fontWeight: '700', fontSize: '1.2rem' }}>
        Phandshop Painel
      </Link>
      <nav style={navStyle}>
        <Link href="/logout" style={linkStyle}>Sair</Link>
      </nav>
    </header>
  );
}
