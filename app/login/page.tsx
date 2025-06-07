'use client';

import { useState } from 'react';
import { Poppins } from 'next/font/google';
import Header from '../components/HeaderGlobal';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validarEmail(email)) return setError('Email inválido');
    if (senha.length < 6) return setError('Senha muito curta');

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      alert('Login mock sucesso!');
    }, 1000);
  };

  return (
    <main
      className={poppins.className}
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f9f7fd',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(8, 8, 8, 0.1)',
          width: '100%',
          maxWidth: '400px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
        noValidate
      >
        <h2
          style={{
            color: '#6b21a8',
            fontWeight: '600',
            marginBottom: '0.5rem',
            fontSize: '1.5rem',
          }}
        >
          Bem-vinda(o) de volta!
        </h2>
        <h1
          style={{
            marginBottom: '1.5rem',
            color: '#6b21a8',
            fontSize: '2rem',
            fontWeight: '700',
          }}
        >
          Fazer Login
        </h1>

        <label
          htmlFor="email"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', textAlign: 'left' }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            borderRadius: '0.5rem',
            border: '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />

        <label
          htmlFor="senha"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600', textAlign: 'left' }}
        >
          Senha
        </label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
          minLength={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />

        <a
          href="#"
          style={{
            display: 'block',
            textAlign: 'right',
            color: '#6b21a8',
            fontWeight: '600',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
          onMouseEnter={e => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={e => (e.currentTarget.style.textDecoration = 'none')}
        >
          Esqueci a senha
        </a>

        {error && (
          <p
            style={{
              color: '#dc2626',
              marginBottom: '1rem',
              fontWeight: '600',
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#6b21a8',
            color: '#fff',
            padding: '0.75rem',
            borderRadius: '9999px',
            fontWeight: '700',
            fontSize: '1.1rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => {
            if (!loading) (e.currentTarget.style.backgroundColor = '#7c3aed');
          }}
          onMouseLeave={e => {
            if (!loading) (e.currentTarget.style.backgroundColor = '#6b21a8');
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}
