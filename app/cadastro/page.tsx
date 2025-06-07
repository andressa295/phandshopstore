'use client';

import { useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
});

function formatPhone(value: string) {
  const onlyNums = value.replace(/\D/g, '');
  if (onlyNums.length <= 10) {
    return onlyNums
      .replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3')
      .replace(/-$/, '');
  } else {
    return onlyNums
      .replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
      .replace(/-$/, '');
  }
}

export default function CadastroPage() {
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

  useEffect(() => {
    const isValid =
      form.nome.trim().length >= 2 &&
      validarEmail(form.email) &&
      form.telefone.length >= 14 &&
      form.senha.length >= 6 &&
      form.senha === form.confirmSenha &&
      form.aceitaTermos;
    setValid(isValid);
  }, [form]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'telefone'
          ? formatPhone(value)
          : type === 'checkbox'
          ? checked
          : value,
    }));
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
      alert('Cadastro realizado com sucesso (mock)!');
      setForm({
        nome: '',
        email: '',
        telefone: '',
        senha: '',
        confirmSenha: '',
        aceitaTermos: false,
      });
    }, 1500);
  }

  return (
    <main
      className={poppins.className}
      style={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#f9f7fd',
        padding: '1rem',
      }}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          width: '100%',
          maxWidth: '450px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            color: '#6b21a8',
            fontWeight: 600,
            marginBottom: '0.5rem',
            fontSize: '1.5rem',
          }}
        >
          Seja bem-vinda(o)!
        </h2>
        <h1
          style={{
            marginBottom: '1.5rem',
            color: '#6b21a8',
            fontSize: '2rem',
            fontWeight: 700,
          }}
        >
          Criar Conta
        </h1>

        {/* Nome */}
        <label htmlFor="nome" style={labelStyle}>
          Nome completo
        </label>
        <input
          id="nome"
          name="nome"
          type="text"
          value={form.nome}
          onChange={handleChange}
          required
          placeholder="Seu nome"
          style={{
            ...inputStyle,
            border: form.nome.trim().length >= 2 ? successBorder : defaultBorder,
          }}
        />

        {/* Email */}
        <label htmlFor="email" style={labelStyle}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="email@exemplo.com"
          style={{
            ...inputStyle,
            border: validarEmail(form.email) ? successBorder : defaultBorder,
          }}
        />

        {/* Telefone */}
        <label htmlFor="telefone" style={labelStyle}>
          Telefone
        </label>
        <input
          id="telefone"
          name="telefone"
          type="tel"
          value={form.telefone}
          onChange={handleChange}
          placeholder="(99) 99999-9999"
          style={{
            ...inputStyle,
            border: form.telefone.length >= 14 ? successBorder : defaultBorder,
          }}
        />

        {/* Senha */}
        <label htmlFor="senha" style={labelStyle}>
          Senha
        </label>
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <input
            id="senha"
            name="senha"
            type={showSenha ? 'text' : 'password'}
            value={form.senha}
            onChange={handleChange}
            required
            minLength={6}
            placeholder="Mínimo 6 caracteres"
            style={{
              ...inputStyle,
              border: form.senha.length >= 6 ? successBorder : defaultBorder,
            }}
          />
          <button
            type="button"
            onClick={() => setShowSenha(!showSenha)}
            style={toggleSenhaButton}
            aria-label={showSenha ? 'Esconder senha' : 'Mostrar senha'}
          >
            {showSenha ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Confirmar Senha */}
        <label htmlFor="confirmSenha" style={labelStyle}>
          Confirmar Senha
        </label>
        <input
          id="confirmSenha"
          name="confirmSenha"
          type="password"
          value={form.confirmSenha}
          onChange={handleChange}
          required
          placeholder="Repita a senha"
          style={{
            ...inputStyle,
            border:
              form.confirmSenha === form.senha && form.confirmSenha !== ''
                ? successBorder
                : defaultBorder,
          }}
        />

        {/* Aceitar Termos */}
        <div style={{ textAlign: 'left', margin: '1rem 0' }}>
          <label>
            <input
              name="aceitaTermos"
              type="checkbox"
              checked={form.aceitaTermos}
              onChange={handleChange}
              required
              style={{ marginRight: '0.5rem' }}
            />
            Aceito os{' '}
            <a href="#" style={{ color: '#6b21a8', fontWeight: 600 }}>
              termos e condições
            </a>
          </label>
        </div>

        {/* Erro */}
        {error && (
          <div style={{ color: '#dc2626', marginBottom: '1rem', fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={loading}
          style={{
            background: loading ? '#a855f7' : '#6b21a8',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            width: '100%',
            transition: 'background 0.3s ease',
          }}
        >
          {loading ? 'Criando conta...' : 'Criar conta'}
        </button>
      </form>
    </main>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: 600,
  textAlign: 'left',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.75rem',
  marginBottom: '1rem',
  borderRadius: '0.5rem',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const defaultBorder = '1px solid #ddd';
const successBorder = '1px solid #4ade80';

const toggleSenhaButton: React.CSSProperties = {
  position: 'absolute',
  right: '0.75rem',
  top: '50%',
  transform: 'translateY(-50%)',
  background: 'transparent',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 600,
  color: '#6b21a8',
};
