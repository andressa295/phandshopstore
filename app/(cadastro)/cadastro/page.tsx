'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './Cadastro.module.css';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

function CadastroForm() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [form, setForm] = useState({
    email: '',
    senha: '',
    nomeLoja: '',
    aceitaTermos: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (!form.aceitaTermos) {
      setError('Você precisa aceitar os termos de uso para continuar.');
      return;
    }

    setLoading(true);
    
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }
      
      setSuccessMessage('Verifique seu e-mail para confirmar sua conta!');
      router.push('/verificar-email');

    } catch (err) {
      setError('Erro inesperado. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className={styles.mainContainer}>
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
                alt="Logotipo "
                width={170}
                height={30}
                className={styles.logo}
              />
            </div>

            <div className={styles.header}>
              <h1 className={styles.title}>Crie sua loja grátis</h1>
              
              <Link href="#" className={styles.serviceLink}>
                Estou prestando serviço de criação de loja
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className={styles.linkIcon} viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/>
                  <path fillRule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/>
                </svg>
              </Link>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.inputGroup}>
                <label htmlFor="email" className={styles.label}>E-mail</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={styles.input}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nome@exemplo.com.br"
                  required
                />
              </div>
              
              <div className={styles.inputGroup}>
                <label htmlFor="senha" className={styles.label}>Senha</label>
                <div className={styles.passwordContainer}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="senha"
                    name="senha"
                    className={styles.input}
                    value={form.senha}
                    onChange={handleChange}
                    placeholder="Defina sua senha"
                    required
                  />
                  <span 
                    className={styles.passwordToggleIcon} 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="nomeLoja" className={styles.label}>Nome da sua marca</label>
                <input
                  type="text"
                  id="nomeLoja"
                  name="nomeLoja"
                  className={styles.input}
                  value={form.nomeLoja}
                  onChange={handleChange}
                  placeholder="Exemplo: MK Joias"
                  required
                />
              </div>
              
              <label className={styles.termsLabel}>
                <input
                  type="checkbox"
                  name="aceitaTermos"
                  checked={form.aceitaTermos}
                  onChange={handleChange}
                  required
                />
                Aceito os <a href="/termos" className={styles.termsLink}>Termos e Condições</a> e a <a href="/politica" className={styles.termsLink}>Política de Privacidade</a>
              </label>

              {error && <p className={styles.errorText}>{error}</p>}
              {successMessage && <p className={styles.successMessage}>{successMessage}</p>}

              <button type="submit" disabled={loading} className={styles.submitButton}>
                {loading ? 'Criando...' : 'Criar loja grátis'}
              </button>

              <p className={styles.loginPrompt}>
                Já tem uma conta? <Link href="/login" className={styles.loginLink}>Faça login</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
export default CadastroForm;