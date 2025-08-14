'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Login.module.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

const MessageModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div className={styles.messageModalOverlay}>
      <div className={styles.messageModalContent}>
        <p>{message}</p>
        <button onClick={onClose} className={styles.messageModalButton}>Fechar</button>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validarEmail(email)) {
      setError('Email inválido.');
      return;
    }
    if (senha.length < 6) {
      setError('Senha muito curta.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (signInError) {
        console.error("Falha no login:", signInError);
        setError('Falha no login. Verifique seu e-mail e senha.');
        setLoading(false);
        return;
      }

      if (data.user) {
        const { error: logError } = await supabase.from('historico_acessos').insert({
          usuario_id: data.user.id,
          dispositivo: navigator.userAgent,
        });
        if (logError) {
          console.error("Erro ao registrar acesso:", logError.message);
        }
      }

      setLoading(false);
      router.push('/dashboard');
    } catch (err) {
      console.error("Erro inesperado durante o login:", err);
      setError('Ocorreu um erro inesperado. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className={`${styles.mainContainer} ${poppins.className}`}>
      <div className={styles.contentGrid}>
        <div className={styles.formWrapper}>
          <div className={styles.formContainer}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logoroxo.png"
                alt="Logotipo"
                width={190}
                height={40}
                className={styles.logo}
              />
            </div>

            <div className={styles.header}>
              <h1 className={styles.title}>Login</h1>
              <p className={styles.subtitle}>Acesse sua conta</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className={styles.input}
                  placeholder="nome@exemplo.com.br"
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="senha" className={styles.label}>Senha</label>
                <div className={styles.passwordContainer}>
                  <input
                    id="senha"
                    type={showPassword ? 'text' : 'password'}
                    value={senha}
                    onChange={e => setSenha(e.target.value)}
                    required
                    minLength={6}
                    className={styles.input}
                    placeholder="Defina sua senha"
                  />
                  <span 
                    className={styles.passwordToggleIcon} 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/>
                        <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z"/>
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M10.79 12.912l-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-1.613-1.614A9.977 9.977 0 0 0 0 8c0 1.549.31 3.015.834 4.385l-1.025 1.025a.5.5 0 0 0 .708.708l1.025-1.025c1.37.524 2.836.834 4.385.834h.001c.708 0 1.354-.085 1.954-.236a.5.5 0 0 0-.217-.962zm3.808-3.007a.5.5 0 0 0-.708.708l-1.025-1.025A9.977 9.977 0 0 0 16 8c0-1.549-.31-3.015-.834-4.385l1.025-1.025a.5.5 0 0 0-.708-.708l-1.025 1.025C12.836 4.985 11.37 5.295 9.82 5.295h-.001a4.5 4.5 0 0 1 2.378 1.492.5.5 0 0 0 .708.707l1.025 1.025zM8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z"/>
                      </svg>
                    )}
                  </span>
                </div>
              </div>

              <a
                href="#"
                className={styles.forgotPasswordLink}
                onClick={e => {
                  e.preventDefault();
                  setMessage('Funcionalidade de recuperação de senha ainda não implementada.');
                }}
              >
                Esqueci a senha
              </a>

              {error && (<p className={styles.errorText}>{error}</p>)}

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>

              <p className={styles.loginPrompt}>
                Não tem uma conta? <Link href="/cadastro" className={styles.loginLink}>Crie sua loja grátis</Link>
              </p>
            </form>
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <Image
            src="/testelogin.png"
            alt="Pessoas felizes usando a plataforma"
            layout="fill"
            objectFit="cover"
            priority
            className={styles.image}
          />
        </div>
      </div>
      {message && <MessageModal message={message} onClose={() => setMessage('')} />}
    </main>
  );
}