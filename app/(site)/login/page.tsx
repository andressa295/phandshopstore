'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Poppins } from 'next/font/google';
import { PostgrestError } from '@supabase/supabase-js';

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

// Componente simples para exibir mensagens de feedback
const MessageModal = ({ message, onClose }: { message: string; onClose: () => void }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#fff',
        padding: '2rem',
        borderRadius: '0.5rem',
        boxShadow: '0 4px 12px rgba(8,8,8,0.1)',
        textAlign: 'center',
        maxWidth: '90%',
      }}>
        <p>{message}</p>
        <button onClick={onClose} style={{
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#6b21a8',
          color: '#fff',
          borderRadius: '9999px',
          border: 'none',
          cursor: 'pointer',
        }}>Fechar</button>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const validarEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!validarEmail(email)) {
      setError('Email inválido.');
      return;
    }
    if (senha.length < 6) {
      setError('Senha muito curta.');
      return;
    }

    setLoading(true);

    try {
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: senha,
      });

      if (signInError) {
        console.error("Falha no login:", signInError);
        setError('Falha no login. Verifique seu e-mail e senha.');
        setLoading(false);
        return;
      }

      if (data.user) {
        console.log("Login bem-sucedido. Verificando perfil do usuário...");
        
        const { data: profileData, error: profileError } = await supabase
          .from('usuarios')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (profileError && (profileError as PostgrestError).code === 'PGRST116') {
          console.warn("Perfil do usuário não encontrado. Criando um novo perfil básico.");
          
          const { error: insertProfileError } = await supabase.from('usuarios').insert({
            id: data.user.id,
            email: data.user.email,
            nome_completo: data.user.email?.split('@')[0] || '',
            telefone: null,
            documento: null,
          });

          if (insertProfileError) {
            console.error("Erro ao criar perfil de usuário:", insertProfileError);
          } else {
            console.log("Perfil do usuário criado com sucesso.");
          }
        } else if (profileError) {
          console.error("Erro inesperado ao buscar o perfil do usuário:", profileError);
        }

        const { error: logError } = await supabase.from('historico_acessos').insert({
          usuario_id: data.user.id,
          dispositivo: navigator.userAgent,
          // O IP foi removido daqui pois deve ser obtido no lado do servidor
        });

        if (logError) {
          console.error("Erro ao registrar acesso:", logError.message);
        }
      }

      setLoading(false);
      router.push('/dashboard');
    } catch (err) {
      console.error("Erro inesperado durante o login:", err);
      setError('Ocorreu um erro inesperado. Tente novamente.');
      setLoading(false);
    }
  };

  return (
    <main className={`${poppins.className}`} style={{
      height: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#f9f7fd',
      padding: '1rem',
    }}>
      <form
        onSubmit={handleSubmit}
        style={{
          background: '#fff',
          padding: '2rem',
          borderRadius: '1rem',
          boxShadow: '0 4px 12px rgba(8, 8, 8, 0.1)',
          width: '100%',
          maxWidth: '400px',
          boxSizing: 'border-box',
          textAlign: 'center',
        }}
        noValidate
      >
        <h2
          style={{
            color: '#6b21a8',
            fontWeight: 600,
            marginBottom: '0.5rem',
            fontSize: '1.5rem',
          }}
        >
          Bem-vinda(o) de volta!
        </h2>
        <h1
          style={{
            marginBottom: '1.5rem',
            color: '#6b21a8',
            fontSize: '2rem',
            fontWeight: 700,
          }}
        >
          Fazer Login
        </h1>

        <label
          htmlFor="email"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            textAlign: 'left',
          }}
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '1.25rem',
            borderRadius: '0.5rem',
            border: '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />

        <label
          htmlFor="senha"
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontWeight: 600,
            textAlign: 'left',
          }}
        >
          Senha
        </label>
        <input
          id="senha"
          type="password"
          value={senha}
          onChange={e => setSenha(e.target.value)}
          required
          minLength={6}
          style={{
            width: '100%',
            padding: '0.75rem',
            marginBottom: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid #ddd',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />

        <a
          href="#"
          style={{
            display: 'block',
            textAlign: 'right',
            color: '#6b21a8',
            fontWeight: 600,
            textDecoration: 'none',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
          onClick={e => {
            e.preventDefault();
            setMessage('Funcionalidade de recuperação de senha ainda não implementada.');
          }}
        >
          Esqueci a senha
        </a>

        {error && (
          <p
            style={{
              color: '#dc2626',
              marginBottom: '1rem',
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            backgroundColor: '#6b21a8',
            color: '#fff',
            padding: '0.75rem',
            borderRadius: '9999px',
            fontWeight: 700,
            fontSize: '1.1rem',
            border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'background-color 0.3s',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      {message && <MessageModal message={message} onClose={() => setMessage('')} />}
    </main>
  );
}