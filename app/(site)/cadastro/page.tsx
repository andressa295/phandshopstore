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
    return onlyNums.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
  } else {
    return onlyNums.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').replace(/-$/, '');
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
        <h2 style={{ color: '#6b21a8', fontWeight: 600, marginBottom: '0.5rem', fontSize: '1.5rem' }}>
          Seja bem-vinda(o)!
        </h2>
        <h1 style={{ marginBottom: '1.5rem', color: '#6b21a8', fontSize: '2rem', fontWeight: 700 }}>
          Criar Conta
        </h1>

        {/* Nome */}
        <label htmlFor="nome" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, textAlign: 'left' }}>
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
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            borderRadius: '0.5rem',
            border: form.nome.trim().length >= 2 ? '1px solid #4ade80' : '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />

        {/* Email */}
        <label htmlFor="email" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, textAlign: 'left' }}>
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
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            borderRadius: '0.5rem',
            border: validarEmail(form.email) ? '1px solid #4ade80' : '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />

        {/* Telefone */}
        <label htmlFor="telefone" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, textAlign: 'left' }}>
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
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1rem',
            borderRadius: '0.5rem',
            border: form.telefone.length >= 14 ? '1px solid #4ade80' : '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />

        {/* Senha */}
        <label htmlFor="senha" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, textAlign: 'left' }}>
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
              width: '100%',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              border: form.senha.length >= 6 ? '1px solid #4ade80' : '1px solid #ddd',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShowSenha(!showSenha)}
            style={{
              position: 'absolute',
              right: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 600,
              color: '#6b21a8',
            }}
            aria-label={showSenha ? 'Esconder senha' : 'Mostrar senha'}
          >
            {showSenha ? '🙈' : '👁️'}
          </button>
        </div>

        {/* Confirmar senha */}
        <label htmlFor="confirmSenha" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600, textAlign: 'left' }}>
          Confirmar senha
        </label>
        <input
          id="confirmSenha"
          name="confirmSenha"
          type="password"
          value={form.confirmSenha}
          onChange={handleChange}
          required
          minLength={6}
          placeholder="Confirme a senha"
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1.5rem',
            borderRadius: '0.5rem',
            border: form.confirmSenha === form.senha && form.confirmSenha.length >= 6 ? '1px solid #4ade80' : '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />

        {/* Aceita termos */}
        <label
          htmlFor="aceitaTermos"
          style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '1rem',
            fontWeight: 600,
            fontSize: '0.9rem',
            cursor: 'pointer',
            color: '#6b21a8',
          }}
        >
          <input
            id="aceitaTermos"
            name="aceitaTermos"
            type="checkbox"
            checked={form.aceitaTermos}
            onChange={handleChange}
            required
            style={{ marginRight: '0.5rem' }}
          />
          Aceito os&nbsp;
          <a href="/termos" target="_blank" style={{ color: '#7c3aed', textDecoration: 'underline' }}>
            termos de uso
          </a>
          &nbsp;e&nbsp;
          <a href="/privacidade" target="_blank" style={{ color: '#7c3aed', textDecoration: 'underline' }}>
            política de privacidade
          </a>
        </label>

        {/* Erro */}
        {error && (
          <p style={{ color: '#dc2626', marginBottom: '1rem', fontWeight: 600 }}>{error}</p>
        )}

        {/* Botão */}
        <button
          type="submit"
          disabled={!valid || loading}
          style={{
            width: '100%',
            backgroundColor: valid && !loading ? '#6b21a8' : '#a78bfa',
            color: '#fff',
            padding: '0.75rem',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '1.1rem',
            border: 'none',
            cursor: valid && !loading ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={e => {
            if (valid && !loading) (e.currentTarget.style.backgroundColor = '#7c3aed');
          }}
          onMouseLeave={e => {
            if (valid && !loading) (e.currentTarget.style.backgroundColor = '#6b21a8');
          }}
        >
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </button>
      </form>
    </main>
  );
}
