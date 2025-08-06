'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import '@/app/globals.css';

// Funções de utilidade
function getNomeParceiro(ref: string | string[] | undefined) {
  if (!ref || Array.isArray(ref)) {
    return 'um parceiro Phandshop';
  }
  return ref
    .split('-')
    .map(name => name.charAt(0).toUpperCase() + name.slice(1))
    .join(' ');
}

export default function RefPage() {
  const router = useRouter();
  const params = useParams<{ ref: string }>();

  const nomeParceiro = getNomeParceiro(params.ref);

  useEffect(() => {
    if (typeof window !== 'undefined' && params.ref) {
      localStorage.setItem('phandshop_ref', params.ref);
    }

    const timer = setTimeout(() => {
      router.replace('/cadastro');
    }, 2000);

    return () => clearTimeout(timer);
  }, [params.ref, router]);

  // Estilos embutidos para evitar dependência de CSS Module
  const containerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    background: 'var(--brand-purple)',
  };
  
  const boxStyle = {
    background: 'white',
    padding: '3rem',
    borderRadius: '12px',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
    textAlign: 'center' as 'center',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
    maxWidth: '500px',
  };

  const textStyle = {
    fontSize: '1.5rem',
    fontWeight: '500',
    marginTop: '2rem',
    color: 'var(--gray-dark-text)',
  };

  const subtextStyle = {
    fontSize: '1rem',
    color: 'var(--gray-text)',
    marginTop: '0.5rem',
  };

  const spinnerStyle = {
    width: '40px',
    height: '40px',
    border: '4px solid var(--purple-light)',
    borderTopColor: 'var(--purple-main)',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginTop: '2rem',
  };

  const keyframesStyle = `
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `;

  return (
    <main style={containerStyle}>
      <style>{keyframesStyle}</style>
      <div style={boxStyle}>
        <Image
          src="/phandshop-logo.png"
          alt="Phandshop"
          width={200}
          height={50}
        />
        <p style={textStyle}>
          Você foi indicado por <strong>{nomeParceiro}</strong>.
        </p>
        <p style={subtextStyle}>
          Seja bem-vindo(a)! Estamos te redirecionando para a criação da sua loja...
        </p>
        <div style={spinnerStyle}></div>
      </div>
    </main>
  );
}
