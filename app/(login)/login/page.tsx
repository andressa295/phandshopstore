'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Poppins } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Login.module.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// Componente de Modal de Mensagem (mantido como está)
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
        // Buscar se o usuário tem alguma loja (não mais apenas uma)
        const { data: lojasData, error: lojaError } = await supabase
          .from('lojas')
          .select('id, slug')
          .eq('owner_id', data.user.id);

        if (lojaError) {
          console.error("Erro ao buscar dados da loja:", lojaError.message);
          setError('Não foi possível encontrar a loja. Tente novamente.');
          setLoading(false);
          return;
        }

        // Se o usuário tem pelo menos uma loja, redireciona para o dashboard
        if (lojasData && lojasData.length > 0) {
          console.log("Login bem-sucedido. Redirecionando para o dashboard.");
          router.push('/dashboard'); // ✅ CORRIGIDO AQUI: Redireciona para o dashboard
        } else {
          // Se o usuário não tem uma loja, redireciona para o onboarding
          router.push('/onboarding');
        }
      }

      setLoading(false);
    } catch (err: any) {
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
                    {showPassword ? 'Ocultar' : 'Mostrar'}
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
