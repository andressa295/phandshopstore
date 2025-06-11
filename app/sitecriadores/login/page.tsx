'use client';

import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import styles from "./Login.module.css";

export default function LoginParceirosPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !senha) {
      setError("Preencha e-mail e senha para continuar.");
      return;
    }

    // Lógica de login mock
    if (email === "dev@phandshop.com" && senha === "123456") {
      alert("Login realizado com sucesso! Bem-vinda, dev.");
      // Aqui você redirecionaria para o painel do parceiro
      // window.location.href = '/parceiros/painel'; 
    } else {
      setError("E-mail ou senha incorretos.");
    }
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

          <button type="submit" className={styles.button}>
            Entrar
          </button>
        </form>

        <p className={styles.linkWrapper}>
          Ainda não é parceiro?{" "}
          <Link href="/sitecriadores/afiliado" className={styles.link}>
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