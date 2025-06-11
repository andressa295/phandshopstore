'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Garanta que este caminho está correto
import Image from 'next/image';
import Link from 'next/link';
import styles from './Cadastro.module.css';

export default function CadastroParceiroPage() {
  // --- TODA A SUA LÓGICA ORIGINAL (useState, handleSubmit, etc) ---
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmaSenha: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  }

  function validate() {
    const newErrors: { [key: string]: string } = {};
    if (!form.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'E-mail inválido.';
    if (form.senha.length < 6) newErrors.senha = 'A senha precisa ter pelo menos 6 caracteres.';
    if (form.senha !== form.confirmaSenha) newErrors.confirmaSenha = 'As senhas não conferem.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
      options: {
        data: { nome: form.nome },
      },
    });
    setLoading(false);

    if (error) {
      if (error.message.includes('User already registered')) {
        setErrors({ email: 'Este e-mail já está cadastrado.' });
      } else {
        setErrors({ form: 'Erro ao criar conta: ' + error.message });
      }
    } else {
      alert('Cadastro realizado com sucesso! 🎉 Verifique seu e-mail para confirmar a conta.');
      setForm({ nome: '', email: '', senha: '', confirmaSenha: '' });
    }
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
        {/* =======================================================
            AQUI A MUDANÇA: A logo agora é um link para a página inicial
            ======================================================= */}
        <Link href="/">
          <Image 
            src="/logo.png" 
            alt="Phandshop - Voltar para a página inicial" 
            width={180} 
            height={45} 
            style={{ cursor: 'pointer' }}
          />
        </Link>
      </header>

      <div className={styles.box}>
        <h2 className={styles.title}>Crie sua conta de Parceiro</h2>
        
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <label htmlFor="nome" className={styles.label}>Nome completo</label>
            <input
              id="nome" name="nome" type="text" value={form.nome}
              onChange={handleChange} placeholder="Seu nome completo"
              className={`${styles.input} ${errors.nome ? styles.inputError : ''}`} required
            />
            {errors.nome && <p className={styles.errorText}>{errors.nome}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>E-mail</label>
            <input
              id="email" name="email" type="email" value={form.email}
              onChange={handleChange} placeholder="seu@email.com"
              className={`${styles.input} ${errors.email ? styles.inputError : ''}`} required
            />
            {errors.email && <p className={styles.errorText}>{errors.email}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="senha" className={styles.label}>Senha</label>
            <input
              id="senha" name="senha" type="password" value={form.senha}
              onChange={handleChange} placeholder="No mínimo 6 caracteres"
              className={`${styles.input} ${errors.senha ? styles.inputError : ''}`} required
            />
            {errors.senha && <p className={styles.errorText}>{errors.senha}</p>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmaSenha" className={styles.label}>Confirme a senha</label>
            <input
              id="confirmaSenha" name="confirmaSenha" type="password" value={form.confirmaSenha}
              onChange={handleChange} placeholder="Repita sua senha"
              className={`${styles.input} ${errors.confirmaSenha ? styles.inputError : ''}`} required
            />
            {errors.confirmaSenha && <p className={styles.errorText}>{errors.confirmaSenha}</p>}
          </div>

          {errors.form && <p className={styles.errorText}>{errors.form}</p>}
          
          <button type="submit" disabled={loading} className={styles.button}>
            {loading ? 'Criando conta...' : 'Criar conta'}
          </button>
        </form>

        <p className={styles.linkWrapper}>
          Já tem conta?{' '}
          {/* Este link já estava aqui, levando para a página de login */}
          <Link href="/sitecriadores/login" className={styles.link}>
            Faça login
          </Link>
        </p>
      </div>

      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} Phandshop. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
}