// app/(site)/cadastro/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import styles from './Cadastro.module.css'; // Importa seu CSS Module
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

type PlanosKeys = 'plano_gratis' | 'plano_basico' | 'plano_essencial' | 'plano_profissional' | 'plano_premium';

const planoNomes: Record<PlanosKeys, string> = {
  plano_gratis: 'Plano Grátis',
  plano_basico: 'Plano Básico',
  plano_essencial: 'Plano Essencial',
  plano_profissional: 'Plano Profissional',
  plano_premium: 'Plano Premium',
};

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
    <line x1="2" y1="2" x2="22" y2="22"></line>
  </svg>
);

interface FormState {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  confirmSenha: string;
  aceitaTermos: boolean;
}

function CadastroForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [nomeDoPlano, setNomeDoPlano] = useState<string>('');
  const [recorrenciaDoPlano, setRecorrenciaDoPlano] = useState<string>('');

  const [form, setForm] = useState<FormState>({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmSenha: '',
    aceitaTermos: false,
  });

  const [showSenha, setShowSenha] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [valid, setValid] = useState<boolean>(false);

  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const formatPhone = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length <= 10) {
      return onlyNums.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    return onlyNums.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  };

  useEffect(() => {
    const planoQuery = searchParams.get('plano') as PlanosKeys | null;
    const recorrenciaQuery = searchParams.get('recorrencia');

    if (planoQuery && planoNomes[planoQuery]) {
      setNomeDoPlano(planoNomes[planoQuery]);
    } else {
      setNomeDoPlano(planoNomes.plano_gratis);
    }

    if (recorrenciaQuery) {
      setRecorrenciaDoPlano(recorrenciaQuery === 'anual' ? 'anual' : 'mensal');
    } else {
      setRecorrenciaDoPlano('mensal');
    }
  }, [searchParams]);

  useEffect(() => {
    const isValid =
      form.nome.trim().length >= 2 &&
      validarEmail(form.email) &&
      form.senha.length >= 6 &&
      form.senha === form.confirmSenha &&
      form.aceitaTermos;
    setValid(isValid);
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  }, [form, error, successMessage]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    if (!valid) {
      setError('Preencha todos os campos corretamente e aceite os termos de uso.');
      return;
    }
    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
      });

      if (signUpError) {
        console.error("Erro no signUp do Supabase:", signUpError.message);
        setError('Erro ao criar conta: ' + signUpError.message);
        setLoading(false);
        return;
      }

      if (!signUpData?.user) {
        setError('Cadastro falhou: Usuário não retornado após signup.');
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('usuarios').insert({
        id: signUpData.user.id,
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        plano: nomeDoPlano,
        recorrencia: recorrenciaDoPlano,
      });

      if (insertError) {
        console.error("Erro ao inserir dados na tabela 'usuarios':", insertError);
        setError('Erro ao salvar dados do usuário: ' + (insertError.message || 'Verifique se o e-mail já está cadastrado ou dados inválidos.'));
        setLoading(false);
        return;
      }

      await fetch('/api/email/boasvindas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: form.nome, email: form.email, plano: nomeDoPlano, recorrencia: recorrenciaDoPlano }),
      });

      setLoading(false);
      setSuccessMessage(`Cadastro realizado com sucesso no ${nomeDoPlano} (${recorrenciaDoPlano})! Redirecionando...`);
      router.push('/dashboard');
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError('Erro inesperado: ' + err.message);
      } else {
        setError('Erro inesperado: Tente novamente.');
      }
      setLoading(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'tel' ? formatPhone(value) : value,
    }));
  }

  return (
    <main className={`${poppins.className} ${styles.mainContainer}`}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Crie sua conta</h1>

        {nomeDoPlano && (
          <div className={styles.planoSelecionado}>
            <p>Você escolheu o:</p>
            <strong>
              {nomeDoPlano} ({recorrenciaDoPlano === 'mensal' ? 'mensal' : 'anual'})
            </strong>
          </div>
        )}

        <p className={styles.subtitle}>Preencha seus dados para começar a vender online!</p>

        <form onSubmit={handleSubmit} noValidate className={styles.cadastroForm}> {/* <-- CORREÇÃO AQUI */}
          <label htmlFor="nome" className={styles.label}>Nome</label>
          <input id="nome" name="nome" type="text" value={form.nome} onChange={handleChange} required minLength={2} className={styles.inputField} />

          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className={styles.inputField} />

          <label htmlFor="telefone" className={styles.label}>Telefone (opcional)</label>
          <input id="telefone" name="telefone" type="tel" value={form.telefone} onChange={handleChange} className={styles.inputField} />

          <label htmlFor="senha" className={styles.label}>Senha</label>
          <div className={styles.passwordWrapper}>
            <input
              id="senha"
              name="senha"
              type={showSenha ? 'text' : 'password'}
              value={form.senha}
              onChange={handleChange}
              required
              minLength={6}
              className={styles.inputField}
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className={styles.togglePasswordButton}
              aria-label={showSenha ? 'Esconder senha' : 'Mostrar senha'}
            >
              {showSenha ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <label htmlFor="confirmSenha" className={styles.label}>Confirmar Senha</label>
          <input
            id="confirmSenha"
            name="confirmSenha"
            type={showSenha ? 'text' : 'password'}
            value={form.confirmSenha}
            onChange={handleChange}
            required
            minLength={6}
            className={styles.inputField}
          />

          <label className={styles.termsLabel}>
            <input
              type="checkbox"
              name="aceitaTermos"
              checked={form.aceitaTermos}
              onChange={handleChange}
              required
            />
            Aceito os <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer" className={styles.termsLink}>termos de uso</a>
          </label>

          {error && <p className={styles.errorText}>{error}</p>}
          {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

          <button type="submit" disabled={loading || !valid} className={styles.submitButton}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </button>

          <p className={styles.loginPrompt}>Já tem uma conta? <a href="/login" className={styles.loginLink}>Faça login</a></p>
        </form>
      </div>
    </main>
  );
}

export default function PaginaDeCadastro() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <CadastroForm />
    </Suspense>
  );
}