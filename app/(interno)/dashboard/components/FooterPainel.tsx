'use client';

import React from 'react';

const footerStyles: React.CSSProperties = {
  marginTop: 'auto',
  padding: '1rem 1.5rem',
  backgroundColor: '#6b21a8',
  color: '#eee',
  fontSize: '0.875rem',
  textAlign: 'center',
  fontFamily: "'Poppins', sans-serif",
};

export default function FooterPainel() {
  return (
    <footer style={footerStyles}>
      © {new Date().getFullYear()} Phandshop - Todos os direitos reservados.
    </footer>
  );
}
