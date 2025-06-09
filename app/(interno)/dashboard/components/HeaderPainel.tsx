'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

const headerStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '64px',
  backgroundColor: '#6b21a8',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '0 2rem',
  zIndex: 1100,
  fontFamily: "'Poppins', sans-serif",
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  overflow: 'visible', // <--- ADICIONE ESTA LINHA
};

const logoStyle: React.CSSProperties = {
  height: '40px',
};

const navStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '1.5rem',
};

const avatarWrapperStyle: React.CSSProperties = {
  position: 'relative',
  cursor: 'pointer',
};

const avatarStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: '#fff',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '1.2rem',
  fontWeight: 'bold',
  color: '#6b21a8',
};

const dropdownStyle: React.CSSProperties = {
  position: 'absolute',
  top: '48px', // Posição abaixo do avatar
  right: 0,
  backgroundColor: '#fff',
  color: '#333',
  borderRadius: '6px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  padding: '0.5rem 0',
  minWidth: '160px',
  zIndex: 1200, // z-index maior que o do header para ficar por cima
};

const dropdownItemStyle: React.CSSProperties = {
  padding: '0.5rem 1rem',
  textDecoration: 'none',
  display: 'block',
  color: '#333',
  fontSize: '0.9rem',
};

export default function HeaderPainel() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fecha dropdown se clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header style={headerStyles}>
        {/* LOGO */}
        <Link href="/painel">
          <img
            src="/logo.png" // troque por tua logo real
            alt="Phandshop Logo"
            style={logoStyle}
          />
        </Link>

        {/* NAVEGAÇÃO */}
        <nav style={navStyle} className="nav-desktop">
          <div
            style={avatarWrapperStyle}
            onClick={() => setDropdownOpen(!dropdownOpen)}
            ref={dropdownRef}
          >
            <div style={avatarStyle}>
              👤
            </div>
            {dropdownOpen && (
              <div style={dropdownStyle}>
                <Link href="/painel/minha-conta" style={dropdownItemStyle}>
                  Minha Conta
                </Link>
                <Link href="/logout" style={dropdownItemStyle}>
                  Sair
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* RESPONSIVO */}
      <style jsx>{`
        @media (max-width: 768px) {
          .nav-desktop {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}