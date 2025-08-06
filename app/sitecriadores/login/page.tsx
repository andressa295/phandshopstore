'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import styles from "./Login.module.css";

// Conexão com o Supabase.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginParceirosPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!email || !senha) {
      setError("Preencha e-mail e senha para continuar.");
      setLoading(false);
      return;
    }

    // Lógica de login com o Supabase
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });
    
    setLoading(false);

    if (authError) {
      setError(authError.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : authError.message);
      return;
    }

    // Redireciona para o painel de afiliados após o login bem-sucedido
    router.push('/afiliado/dashboard');
  };

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        <Image 
          src="/logo.png" // Use uma versão branca da sua logo
          alt="Phandshop" 
          width={180} 
          height={45} 
        />
      </header>

      <div className={styles.box}>
        <h1 className={styles.title}>Login de Parceiros</h1>
        <p className={styles.subtitle}>Acesse seu painel para acompanhar suas comissões.</p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exemplo.com"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="senha" className={styles.label}>Senha</label>
            <input
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
              className={styles.input}
              required
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <p className={styles.linkWrapper}>
          Ainda não é parceiro?{" "}
          <Link href="/sitecriadores/dashboard" className={styles.link}>
            Crie sua conta
          </Link>
        </p>
      </div>
      
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Phandshop. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}
