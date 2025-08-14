'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Poppins } from 'next/font/google';
import styles from './Cadastro.module.css';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// Configuração do Supabase a partir das variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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

export default function CadastroParceiroPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senha: '',
    confirmaSenha: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const slugify = (text: string) => {
    return text
      .toString()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/--+/g, '-');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
    if (!form.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = 'E-mail inválido.';
    if (form.senha.length < 6) newErrors.senha = 'A senha precisa ter pelo menos 6 caracteres.';
    if (form.senha !== form.confirmaSenha) newErrors.confirmaSenha = 'As senhas não conferem.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setMessage('');
    setErrors({});

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.senha,
    });

    if (authError) {
      setLoading(false);
      const errorMessage = authError.message.includes('User already registered')
        ? 'Este e-mail já está cadastrado.'
        : `Erro ao criar conta: ${authError.message}`;
      setErrors({ form: errorMessage });
      return;
    }

    if (authData.user) {
      const linkRef = slugify(form.nome);
      const linkCompleto = `${window.location.origin}/r/${linkRef}`; 

      const { error: dbError } = await supabase
        .from('afiliados')
        .insert({
          user_id: authData.user.id,
          nome: form.nome,
          email: form.email,
          link_ref: linkRef,
          link_completo: linkCompleto,
        });

      if (dbError) {
        console.error('Erro ao inserir afiliado:', dbError); 
        setErrors({ form: `Erro ao registrar como afiliado: ${dbError.message}. Tente novamente.` });
        setLoading(false);
        return;
      }
    }

    setLoading(false);
    setMessage('Cadastro realizado com sucesso! 🎉 Verifique seu e-mail para confirmar a conta.');
    setForm({ nome: '', email: '', senha: '', confirmaSenha: '' });
  };

  return (
    <main className={`${styles.mainContainer} ${poppins.className}`}>
      <div className={styles.contentGrid}>
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
              <h1 className={styles.title}>Crie sua conta de Parceiro</h1>
              <p className={styles.subtitle}>Registre-se para começar a criar links e ganhar comissões.</p>
            </div>
            
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
                <div className={styles.passwordContainer}>
                  <input
                    id="senha" name="senha" 
                    type={showPassword ? 'text' : 'password'} 
                    value={form.senha}
                    onChange={handleChange} placeholder="No mínimo 6 caracteres"
                    className={`${styles.input} ${errors.senha ? styles.inputError : ''}`} required
                  />
                  <span 
                    className={styles.passwordToggleIcon} 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </span>
                </div>
                {errors.senha && <p className={styles.errorText}>{errors.senha}</p>}
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="confirmaSenha" className={styles.label}>Confirme a senha</label>
                <input
                  id="confirmaSenha" name="confirmaSenha" type={showPassword ? 'text' : 'password'}
                  onChange={handleChange} placeholder="Repita sua senha"
                  className={`${styles.input} ${errors.confirmaSenha ? styles.inputError : ''}`} required
                />
                {errors.confirmaSenha && <p className={styles.errorText}>{errors.confirmaSenha}</p>}
              </div>

              {errors.form && <p className={styles.errorText}>{errors.form}</p>}

              <button type="submit" disabled={loading} className={styles.submitButton}>
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
        </div>
      </div>
      {message && <MessageModal message={message} onClose={() => setMessage('')} />}
    </main>
  );
}