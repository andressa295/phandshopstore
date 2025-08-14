'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Poppins } from 'next/font/google';
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

export default function LoginParceirosPage() {
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
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (email === "teste@exemplo.com" && senha === "123456") {
        setMessage('Login bem-sucedido!');
        router.push('/dashboard');
      } else {
        setError('E-mail ou senha incorretos.');
      }
    } catch (err) {
      setError('Ocorreu um erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={`${styles.mainContainer} ${poppins.className}`}>
      <div className={styles.contentGrid}>
        {/* Coluna do formulário (agora à esquerda) */}
        <div className={styles.formWrapper}>
          <div className={styles.formContainer}>
            <div className={styles.logoWrapper}>
              <Image
                src="/logoroxo.png"
                alt="Logotipo"
                width={170}
                height={30}
                className={styles.logo}
              />
            </div>

            <div className={styles.header}>
              <h1 className={styles.title}>Login de Parceiros</h1>
              <p className={styles.subtitle}>Acesse seu painel para acompanhar suas comissões.</p>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>E-mail</label>
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
                    className={`${styles.input} ${styles.passwordInput}`}
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

              <p className={styles.linkWrapper}>
                Ainda não é parceiro?{" "}
                <Link href="/sitecriadores/afiliado" className={styles.link}>
                  Crie sua conta
                </Link>
              </p>

              {error && (<p className={styles.errorText}>{error}</p>)}

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </div>

        {/* Coluna da imagem (agora à direita) */}
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