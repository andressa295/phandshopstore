'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Verifica se esse caminho tá correto
import Image from 'next/image';
import Link from 'next/link';
import styles from './Cadastro.module.css';

export default function CadastroParceiroPage() {
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

  async function enviarEmailBoasVindas(nome: string, email: string) {
    try {
      const res = await fetch('/api/enviar-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome, email }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erro desconhecido no envio de e-mail');
      }
      // Pode opcionalmente exibir um console.log ou toast aqui: email enviado
    } catch (error: any) {
      console.error('Falha ao enviar e-mail de boas-vindas:', error.message);
      // Se quiser, pode mostrar um erro amigável no UI, mas não bloqueia o fluxo
    }
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

    if (error) {
      setLoading(false);
      if (error.message.includes('User already registered')) {
        setErrors({ email: 'Este e-mail já está cadastrado.' });
      } else {
        setErrors({ form: 'Erro ao criar conta: ' + error.message });
      }
      return;
    }

    enviarEmailBoasVindas(form.nome, form.email);

    setLoading(false);
    alert('Cadastro realizado com sucesso! 🎉 Verifique seu e-mail para confirmar a conta.');
    setForm({ nome: '', email: '', senha: '', confirmaSenha: '' });
  }

  return (
    <main className={styles.container}>
      <header className={styles.header}>
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
