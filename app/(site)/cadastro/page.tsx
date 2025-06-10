'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Poppins } from 'next/font/google';
import styles from './Cadastro.module.css';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});


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
    <line x1="2" x2="22" y1="2" y2="22"></line>
  </svg>
);


function CadastroForm() {
  const searchParams = useSearchParams();
  const [nomeDoPlano, setNomeDoPlano] = useState('');

  const planoNomes: { [key: string]: string } = {
    gratis: 'Plano Grátis',
    essencial: 'Plano Essencial',
    profissional: 'Plano Profissional',
    premium: 'Plano Phand Premium',
  };

  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    confirmSenha: '',
    aceitaTermos: false,
  });

  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [valid, setValid] = useState(false);

  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const formatPhone = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    if (onlyNums.length <= 10) {
      return onlyNums.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
    }
    return onlyNums.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  };

  useEffect(() => {
    const planoQuery = searchParams.get('plano');
    if (planoQuery && planoNomes[planoQuery]) {
      setNomeDoPlano(planoNomes[planoQuery]);
    }
  }, [searchParams, planoNomes]);

  useEffect(() => {
    const isValid =
      form.nome.trim().length >= 2 &&
      validarEmail(form.email) &&
      form.senha.length >= 6 &&
      form.senha === form.confirmSenha &&
      form.aceitaTermos;
    setValid(isValid);
  }, [form]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    if (name === 'telefone') {
      setForm(prev => ({ ...prev, telefone: formatPhone(value) }));
    } else if (type === 'checkbox') {
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (!valid) {
      setError('Preencha todos os campos corretamente e aceite os termos');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Cadastro com o ${nomeDoPlano} realizado com sucesso (mock)!`);
    }, 1500);
  }

  return (
    <main className={`${poppins.className} ${styles.mainContainer}`}>
      <div className={styles.formWrapper}>
        <h1 className={styles.title}>Crie sua conta</h1>

        {nomeDoPlano && (
          <div className={styles.planoSelecionado}>
            <p>Você está se cadastrando para o</p>
            <strong>{nomeDoPlano}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="nome" className={styles.label}>Nome completo</label>
          <input id="nome" name="nome" type="text" value={form.nome} onChange={handleChange} required placeholder="Seu nome" className={`${styles.inputField} ${form.nome.trim().length >= 2 ? styles.inputValid : ''}`} />

          <label htmlFor="email" className={styles.label}>Email</label>
          <input id="email" name="email" type="email" value={form.email} onChange={handleChange} required placeholder="email@exemplo.com" className={`${styles.inputField} ${validarEmail(form.email) ? styles.inputValid : ''}`} />

          <label htmlFor="telefone" className={styles.label}>Telefone</label>
          <input id="telefone" name="telefone" type="tel" value={form.telefone} onChange={handleChange} placeholder="(99) 99999-9999" className={`${styles.inputField} ${form.telefone.length >= 14 ? styles.inputValid : ''}`} />

          <label htmlFor="senha" className={styles.label}>Senha</label>
          <div className={styles.passwordWrapper}>
            <input id="senha" name="senha" type={showSenha ? 'text' : 'password'} value={form.senha} onChange={handleChange} required minLength={6} placeholder="Mínimo 6 caracteres" className={`${styles.inputField} ${form.senha.length >= 6 ? styles.inputValid : ''}`} />
            <button type="button" onClick={() => setShowSenha(!showSenha)} className={styles.togglePasswordButton} aria-label={showSenha ? 'Esconder senha' : 'Mostrar senha'}>
              {showSenha ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>

          <label htmlFor="confirmSenha" className={styles.label}>Confirmar senha</label>
          <input id="confirmSenha" name="confirmSenha" type="password" value={form.confirmSenha} onChange={handleChange} required minLength={6} placeholder="Confirme a senha" className={`${styles.inputField} ${form.confirmSenha === form.senha && form.confirmSenha.length >= 6 ? styles.inputValid : ''}`} />

          <label htmlFor="aceitaTermos" className={styles.termsLabel}>
            <input id="aceitaTermos" name="aceitaTermos" type="checkbox" checked={form.aceitaTermos} onChange={handleChange} required />
            Aceito os&nbsp;<a href="/termos" target="_blank">termos de uso</a>&nbsp;e&nbsp;<a href="/privacidade" target="_blank">política de privacidade</a>
          </label>

          {error && <p className={styles.errorText}>{error}</p>}

          <button type="submit" disabled={!valid || loading} className={styles.submitButton}>
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </button>
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