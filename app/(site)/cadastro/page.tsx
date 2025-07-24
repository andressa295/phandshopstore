'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import styles from './Cadastro.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

type PlanosKeys = 'gratis' | 'essencial' | 'profissional' | 'premium';

const planoNomes: Record<PlanosKeys, string> = {
  gratis: 'Plano Grátis',
  essencial: 'Plano Essencial',
  profissional: 'Plano Profissional',
  premium: 'Plano Phand Premium',
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
    if (planoQuery && planoNomes[planoQuery]) {
      setNomeDoPlano(planoNomes[planoQuery]);
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

      if (signUpError || !signUpData?.user) {
        setError('Erro ao criar usuário: ' + (signUpError?.message || 'Erro desconhecido.'));
        setLoading(false);
        return;
      }

      const { error: insertError } = await supabase.from('usuarios').insert({
        id: signUpData.user.id,
        nome: form.nome,
        email: form.email,
        telefone: form.telefone,
        plano: nomeDoPlano || 'Gratuito',
      });

      if (insertError) {
        console.error("Erro ao inserir dados na tabela 'usuarios':", insertError);
        setError('Erro ao salvar dados do usuário: ' + insertError.message);
        setLoading(false);
        return;
      }

      await fetch('/api/email/boasvindas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: form.nome, email: form.email, plano: nomeDoPlano || 'Gratuito' }),
      });

      setLoading(false);
      setSuccessMessage(`Cadastro realizado com sucesso no ${nomeDoPlano || 'Plano Grátis'}! Redirecionando...`);
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
      <form onSubmit={handleSubmit} noValidate>
        <h1>Cadastro {nomeDoPlano}</h1>

        <label htmlFor="nome">Nome</label>
        <input id="nome" name="nome" type="text" value={form.nome} onChange={handleChange} required minLength={2} />

        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />

        <label htmlFor="telefone">Telefone</label>
        <input id="telefone" name="telefone" type="tel" value={form.telefone} onChange={handleChange} />

        <label htmlFor="senha">Senha</label>
        <div style={{ position: 'relative' }}>
          <input
            id="senha"
            name="senha"
            type={showSenha ? 'text' : 'password'}
            value={form.senha}
            onChange={handleChange}
            required
            minLength={6}
          />
          <button
            type="button"
            onClick={() => setShowSenha(!showSenha)}
            style={{ position: 'absolute', right: 8, top: 8, background: 'none', border: 'none', cursor: 'pointer' }}
            aria-label={showSenha ? 'Esconder senha' : 'Mostrar senha'}
          >
            {showSenha ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>

        <label htmlFor="confirmSenha">Confirmar Senha</label>
        <input
          id="confirmSenha"
          name="confirmSenha"
          type={showSenha ? 'text' : 'password'}
          value={form.confirmSenha}
          onChange={handleChange}
          required
          minLength={6}
        />

        <label>
          <input
            type="checkbox"
            name="aceitaTermos"
            checked={form.aceitaTermos}
            onChange={handleChange}
            required
          />
          Aceito os termos de uso
        </label>

        {error && <p style={{ color: 'red' }}>{error}</p>}
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
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
