'use client';

import Link from 'next/link';
import Image from 'next/image';

interface CriadorHeaderProps {
  backLink?: string;
}

export default function CriadorHeader({ backLink }: CriadorHeaderProps) {
  return (
    <header
      style={{
        width: '100%',
        maxWidth: '420px',            // Limita largura igual ao resto da página
        margin: '0 auto',             // Centraliza horizontalmente
        padding: '1rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#121212',  // Fundo dark (mesmo do container)
        borderBottom: '1px solid #2C2C2C', // Borda sutil dark
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        boxSizing: 'border-box',
      }}
    >
      <div style={{ flex: 1 }}>
        {backLink && (
          <Link href={backLink}>
            <span
              style={{
                color: '#8B5CF6',      // Roxo Phandshop
                fontWeight: 600,
                fontSize: 14,
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              ← Voltar
            </span>
          </Link>
        )}
      </div>

      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Logo Phandshop"
            width={150}
            height={40}
            priority
          />
        </Link>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center',
          gap: 6,
          fontSize: 14,
          fontWeight: 500,
          color: '#EDEDED',       // Cor clara pro texto no dark
        }}
      >
        <span>Já tem conta?</span>
        <Link href="/sitecriadores/login">
          <span
            style={{
              color: '#8B5CF6',
              textDecoration: 'underline',
              cursor: 'pointer',
              userSelect: 'none',
            }}
          >
            Faça login
          </span>
        </Link>
      </div>
    </header>
  );
}
