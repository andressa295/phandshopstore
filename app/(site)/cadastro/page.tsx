'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Poppins } from 'next/font/google';
import styles from './Cadastro.module.css';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { PostgrestError } from '@supabase/supabase-js';

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
  <svg xmlns="http://www.w3d.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  documento: string;
  senha: string;
  confirmSenha: string;
  storeName: string;
  aceitaTermos: boolean;
  plano?: string; 
  recorrencia?: string; 
}

function CadastroForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [form, setForm] = useState<FormState>({
    nome: '',
    email: '',
    telefone: '', 
    documento: '',
    senha: '',
    confirmSenha: '',
    storeName: '',
    aceitaTermos: false,
  });

  const [nomeDoPlano, setNomeDoPlano] = useState<string>('');
  const [recorrenciaDoPlano, setRecorrenciaDoPlano] = useState<string>('');
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

  const formatDocumento = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length <= 11) {
      // CPF
      return onlyNums
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    } else {
      // CNPJ
      return onlyNums
        .replace(/^(\d{2})(\d)/, '$1.$2')
        .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        .replace(/\.(\d{3})(\d)/, '.$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
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
      form.telefone.replace(/\D/g, '').length >= 10 &&
      form.documento.replace(/\D/g, '').length >= 11 &&
      form.senha.length >= 8 &&
      form.senha === form.confirmSenha &&
      form.storeName.trim().length > 0 &&
      form.aceitaTermos;
    setValid(isValid);
  }, [form]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(''); 
    setSuccessMessage(''); 
    
    if (form.senha !== form.confirmSenha) {
      setError('A senha e a confirmação de senha não são iguais.');
      return;
    }

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
        if (signUpError.message.includes('11 seconds')) {
            setError('Por segurança, aguarde alguns segundos antes de tentar novamente.');
            setTimeout(() => setLoading(false), 12000);
        } else {
            setError('Erro ao criar conta: ' + signUpError.message);
            setLoading(false);
        }
        return;
      }

      if (!signUpData?.user) {
        setError('Cadastro falhou.');
        setLoading(false);
        return;
      }
      
      const user = signUpData.user;
      
      if (signUpData.session) {
          await supabase.auth.setSession(signUpData.session);
      }
      
      const { error: insertUserError } = await supabase.from('usuarios').insert({
        id: user.id, 
        nome_completo: form.nome, 
        email: form.email,
        telefone: form.telefone,
        documento: form.documento,
      });

      if (insertUserError) {
        setError('Erro ao salvar dados do usuário: ' + insertUserError.message);
        setLoading(false);
        return;
      }
      
      const slug = form.storeName.toLowerCase().replace(/\s/g, '-');
      const { data: storeData, error: insertStoreError } = await supabase.from('lojas').insert({
        usuario_id: user.id,
        nome_loja: form.storeName,
        slug: slug,
      }).select().single();

      if (insertStoreError) {
        setError('Erro ao criar a loja: ' + insertStoreError.message);
        setLoading(false);
        return;
      }
      
      const lojaId = storeData?.id;
      
      if (nomeDoPlano && nomeDoPlano !== 'Plano Grátis' && lojaId) {
        const { data: planosData, error: planosError } = await supabase
            .from('planos')
            .select('id')
            .eq('nome', nomeDoPlano)
            .single();
        
        if (planosError) {
            console.error('Erro ao buscar ID do plano:', planosError.message);
        } else if (planosData) {
            await supabase.from('assinaturas').insert({
                loja_id: lojaId,
                plano_id: planosData.id,
                status: 'ativa',
                recorrencia: recorrenciaDoPlano,
            });
        }
      }

      setLoading(false);
      setSuccessMessage('Cadastro completo e loja criada! Redirecionando...');
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
      [name]: type === 'checkbox' ? checked : name === 'documento' ? formatDocumento(value) : type === 'tel' ? formatPhone(value) : value,
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

        <form onSubmit={handleSubmit} noValidate className={styles.cadastroForm}>
          <label htmlFor="nome" className={styles.label}>Nome</label>
          <input id="nome" name="nome" type="text" value={form.nome} onChange={handleChange} required minLength={2} className={styles.inputField} />

          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className={styles.inputField} />

          <label htmlFor="telefone" className={styles.label}>Telefone</label>
          <input id="telefone" name="telefone" type="tel" value={form.telefone} onChange={handleChange} required minLength={10} className={styles.inputField} />

          <label htmlFor="senha" className={styles.label}>Senha</label>
          <div className={styles.passwordWrapper}>
            <input
              id="senha"
              name="senha"
              type={showSenha ? 'text' : 'password'}
              value={form.senha}
              onChange={handleChange}
              required
              minLength={8}
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
            minLength={8}
            className={styles.inputField}
          />

          <label htmlFor="documento" className={styles.label}>Documento (CPF/CNPJ)</label>
          <input id="documento" name="documento" type="text" value={form.documento} onChange={handleChange} required className={styles.inputField} />
          
          <label htmlFor="storeName" className={styles.label}>Nome da Loja</label>
          <input id="storeName" name="storeName" type="text" value={form.storeName} onChange={handleChange} required className={styles.inputField} />

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