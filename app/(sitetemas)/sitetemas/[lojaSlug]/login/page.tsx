'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { Mail, Loader2, LogIn } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';

const LoginPage: React.FC = () => {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const { config, lojaData } = useTheme();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');

    try {
      // Esta é a função mágica do Supabase para login sem senha
      const { error: loginError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          // O URL para onde o cliente será redirecionado após o clique no e-mail
          emailRedirectTo: `${window.location.origin}/${lojaData?.slug || ''}/minha-conta/pedidos`,
        },
      });

      if (loginError) {
        setError(`Erro: ${loginError.message}`);
      } else {
        setMessage('Cheque seu e-mail! Enviamos um link de confirmação para você.');
        setEmail('');
      }
    } catch (err: any) {
      setError(`Erro inesperado: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const lojaNome = config.headerTitle || lojaData?.nome_loja || 'Sua Loja';

  return (
    <div className="ph-login-page">
      <div className="ph-login-card">
        <h1 className="ph-login-title">Acesse sua conta em {lojaNome}</h1>
        <p className="ph-login-subtitle">Entre com seu e-mail para ver seus pedidos e dados.</p>
        <form onSubmit={handleLogin} className="ph-login-form">
          <div className="ph-form-group">
            <Mail size={20} className="ph-input-icon" />
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="ph-input-field"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="ph-login-button"
          >
            {isLoading ? <Loader2 size={24} className="ph-loading-icon" /> : <LogIn size={20} />}
            {isLoading ? 'Enviando...' : 'Entrar'}
          </button>
        </form>
        {message && <p className="ph-login-message">{message}</p>}
        {error && <p className="ph-login-error">{error}</p>}
      </div>
    </div>
  );
};

export default LoginPage;