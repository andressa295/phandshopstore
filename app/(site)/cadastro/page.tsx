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
  plano?: string; 
  recorrencia?: string; 
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
      form.telefone.trim().length >= 10 && 
      form.senha.length >= 6 &&
      form.senha === form.confirmSenha &&
      form.aceitaTermos;
    setValid(isValid);
    
  }, [form]); 

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
      console.log("Iniciando processo de cadastro para:", form.email);
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
      });

      if (signUpError) {
        console.error("Erro no signUp do Supabase:", signUpError.message, signUpError.name, signUpError.status);
        
        if (signUpError.message === 'User already registered' || signUpError.status === 422) {
          setError('Este e-mail já está cadastrado. Por favor, faça login.');
          router.push('/login'); 
        } else {
          setError('Erro ao criar conta: ' + signUpError.message);
        }
        setLoading(false);
        return;
      }

      if (!signUpData?.user) {
        setError('Cadastro falhou: Usuário não retornado após signup.');
        setLoading(false);
        return;
      }
      console.log("Usuário cadastrado com sucesso:", signUpData.user.id);

      if (signUpData.session) {
        console.log("Sessão Supabase definida para o novo usuário.");
        await supabase.auth.setSession(signUpData.session);
      } else {
        console.warn("Nenhuma sessão retornada após signUp. Usuário pode precisar confirmar e-mail.");
        setSuccessMessage("Verifique seu e-mail para confirmar sua conta e fazer login!");
        setLoading(false);
        router.push('/verificar-email'); 
        return; 
      }

      const { data: { user }, error: getUserError } = await supabase.auth.getUser();

      if (getUserError || !user) {
          console.error("Erro ao obter usuário após signUp e setSession:", getUserError?.message || "Usuário não encontrado.");
          setError('Erro de autenticação após cadastro. Tente novamente.');
          setLoading(false);
          return;
      }
      console.log("Usuário autenticado e obtido com sucesso:", user.id);

      const userDataToInsert: {
        id: string;
        nome_completo: string; 
        email: string;
        telefone: string;
        
      } = {
        id: user.id, 
        nome_completo: form.nome, 
        email: form.email,
        telefone: form.telefone,
        
      };
      console.log("Tentando inserir dados na tabela 'usuarios':", userDataToInsert);

      const { error: insertUserError } = await supabase.from('usuarios').insert(userDataToInsert);

      if (insertUserError) {
        const supabaseError = insertUserError as PostgrestError; 
        console.error("Erro ao inserir dados na tabela 'usuarios':", supabaseError.message); 
        console.error("Detalhes do erro de inserção:", supabaseError?.details || 'Sem detalhes', supabaseError?.hint || 'Sem hint', supabaseError?.code || 'Sem código');
        
        if (supabaseError.code === '23505') { 
          setError('Este e-mail já está cadastrado ou já existe um usuário com este ID. Por favor, faça login ou use outro e-mail.');
        } else {
          setError('Erro ao salvar dados do usuário: ' + (supabaseError?.message || 'Erro desconhecido.'));
        }
        setLoading(false);
        return;
      }
      console.log("Dados do usuário inseridos com sucesso na tabela 'usuarios'.");

      const proposedSubdomain = `${form.nome.toLowerCase().replace(/\s/g, '')}-loja-${Math.random().toString(36).substring(2, 7)}`;
      console.log("Tentando criar loja com subdomínio:", proposedSubdomain);

      const { error: insertStoreError } = await supabase.from('lojas').insert({
        owner_id: user.id, 
        nome: `${form.nome}'s Loja`,
        subdominio: proposedSubdomain,
      });

      if (insertStoreError) {
        const supabaseError = insertStoreError as PostgrestError;
        console.error("Erro ao criar loja para o usuário:", supabaseError.message); 
        console.error("Detalhes do erro de criação de loja:", supabaseError?.details || 'Sem detalhes', supabaseError?.hint || 'Sem hint', supabaseError?.code || 'Sem código');
        
        if (supabaseError.code === '23505' && supabaseError.message.includes('subdominio')) {
          setError('Cadastro realizado, mas o subdomínio da loja já existe. Tente novamente ou entre em contato.');
        } else {
          setError('Cadastro realizado, mas houve um erro ao criar sua loja: ' + (supabaseError?.message || 'Erro desconhecido. Tente novamente ou entre em contato.'));
        }
        setLoading(false);
        return;
      }
      console.log("Loja criada com sucesso para o usuário:", user.id);


            if (nomeDoPlano === 'Plano Grátis') {
        const { error: insertSubscriptionError } = await supabase.from('subscriptions').upsert({
          user_id: user.id,
          plano: nomeDoPlano, 
          status: 'active',
          data_inicio: new Date().toISOString(),
        }, { onConflict: 'user_id' }); 

        if (insertSubscriptionError) {
          console.error("Erro ao registrar plano grátis na tabela 'subscriptions':", insertSubscriptionError.message);
          setError('Cadastro realizado, mas houve um erro ao registrar seu plano gratuito.');
          setLoading(false);
          return;
        }
        console.log("Plano grátis registrado em 'subscriptions'.");
      }


      console.log("Enviando e-mail de boas-vindas...");
      await fetch('/api/email/boasvindas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: form.nome, email: form.email, plano: nomeDoPlano, recorrencia: recorrenciaDoPlano }),
      });
      console.log("E-mail de boas-vindas enviado (ou tentativa de envio).");


      if (nomeDoPlano !== 'Plano Grátis') {
        const stripePriceIds: Record<string, Record<string, string>> = {
          'Plano Básico': {
            'mensal': 'price_1Rp0azK7GLhCiTF0MTeciHgh',
            'anual': 'price_1RpigWK7GLhCiTF0nw2zjXMk',
          },
          'Plano Essencial': {
            'mensal': 'price_1Rp0brK7GLhCiTF0OeTdh8vJ',
            'anual': 'price_1RpifQK7GLhCiTF0nzZF0WiR',
          },
          'Plano Profissional': {
            'mensal': 'price_1Rp0cfK7GLhCiTF0VSO36ysl',
            'anual': 'price_1Rpie2K7GLhCiTF0BYgs0Gp5',
          },
          'Plano Premium': {
            'mensal': 'price_1Rp0dDK7GLhCiTF0cDcu7cay',
            'anual': 'price_1Rpid4K7GLhCiTF08Tcs9F4g',
          },
        };

        const selectedPriceId = stripePriceIds[nomeDoPlano]?.[recorrenciaDoPlano];

        if (!selectedPriceId) {
          console.error("Erro: priceId do Stripe não encontrado para o plano selecionado:", nomeDoPlano, recorrenciaDoPlano);
          setError('Erro ao processar o plano de pagamento. Entre em contato.');
          setLoading(false);
          return;
        }

        console.log("Iniciando checkout do Stripe para priceId:", selectedPriceId);
        const stripeResponse = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            priceId: selectedPriceId,
            planName: nomeDoPlano, 
            isAnnual: recorrenciaDoPlano === 'anual',
            supabaseUserId: user.id
          }),
        });

        const stripeData = await stripeResponse.json();

        if (stripeData.url) {
          console.log("Redirecionando para o Stripe Checkout:", stripeData.url);
          window.location.href = stripeData.url; 
          return; 
        } else if (stripeData.error) {
          console.error("Erro retornado da API do Stripe:", stripeData.error);
          setError('Erro ao iniciar o processo de pagamento: ' + stripeData.error);
          setLoading(false);
          return;
        }
      }

      setLoading(false);
      setSuccessMessage(`Cadastro realizado com sucesso no ${nomeDoPlano} (${recorrenciaDoPlano})! Redirecionando...`);
      router.push('/dashboard'); 
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error('Erro inesperado no handleSubmit:', err.message, err.stack);
        setError('Erro inesperado: ' + err.message);
      } else {
        console.error('Erro inesperado no handleSubmit (não-Error object):', err);
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