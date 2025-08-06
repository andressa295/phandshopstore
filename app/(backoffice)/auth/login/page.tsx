'use client';

import React, { useState, useEffect, ReactNode, FormEvent } from 'react';

// Define o tipo para o objeto de usuário que será retornado no login.
interface User {
  email: string;
  role: string;
}

// Define os tipos para as props do componente LoginPage.
interface LoginPageProps {
  onLogin: (user: User) => void;
}

// Componente para a página de login exclusiva para a equipe da Phandshop.
const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    // Simulação de autenticação com uma conta de staff.
    if (email === 'admin@phandshop.com' && password === 'admin123') {
      const user: User = {
        email: email,
        role: 'admin',
      };
      onLogin(user);
    } else {
      setError('Credenciais inválidas. Use "admin@phandshop.com" e "admin123"');
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'var(--purple-light)'
    }}>
      <form onSubmit={handleLogin} style={{
        background: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 6px 12px rgba(107, 33, 168, 0.2)',
        maxWidth: '400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        color: 'var(--gray-dark-text)'
      }}>
        <h2 style={{ textAlign: 'center', color: 'var(--purple-main)' }}>Login do Backoffice</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--gray-medium)',
            color: 'var(--gray-dark-text)'
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '0.75rem',
            borderRadius: '8px',
            border: '1px solid var(--gray-medium)',
            color: 'var(--gray-dark-text)'
          }}
        />
        <button type="submit" className="botao-oval" style={{ width: '100%' }}>
          Entrar
        </button>
      </form>
    </div>
  );
};

// Define os tipos para as props do componente Sidebar.
interface SidebarProps {
  onLogout: () => void;
}

// Componente de navegação lateral para o backoffice.
const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { name: 'Dashboard', path: 'dashboard' },
    { name: 'Lojistas', path: 'usuarios' },
    { name: 'Suporte', path: 'suporte' },
    { name: 'Planos', path: 'planos' },
    { name: 'Sair', path: 'logout', action: onLogout }
  ];

  return (
    <aside style={{
      width: '240px',
      background: 'var(--purple-dark)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '2rem 1rem',
      gap: '1rem',
      height: '100vh',
      position: 'fixed',
      left: 0,
      top: 0
    }}>
      <h1 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '2rem', fontWeight: 'bold' }}>
        Phandshop Backoffice
      </h1>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {navItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '0.75rem' }}>
              {item.action ? (
                <button
                  onClick={item.action}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    fontSize: '1rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'none'}
                >
                  {item.name}
                </button>
              ) : (
                <a
                  href={`#${item.path}`}
                  style={{
                    color: 'white',
                    padding: '0.75rem 1rem',
                    display: 'block',
                    borderRadius: '8px',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'none'}
                >
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

// Componente para a página principal da dashboard.
const DashboardPage: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--purple-main)', fontSize: '2rem', marginBottom: '1rem' }}>Dashboard de Administração</h2>
      <p style={{ color: 'var(--gray-dark-text)' }}>
        Bem-vindo ao painel interno da Phandshop. Aqui você pode gerenciar os lojistas, suporte, planos e estatísticas do sistema.
      </p>
    </div>
  );
};

// Define os tipos para as props do componente BackofficeLayout.
interface BackofficeLayoutProps {
  children: ReactNode;
  onLogout: () => void;
}

// Layout principal do backoffice (com a navegação lateral).
const BackofficeLayout: React.FC<BackofficeLayoutProps> = ({ children, onLogout }) => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onLogout={onLogout} />
      <main style={{
        flexGrow: 1,
        marginLeft: '240px', // Corresponde à largura da sidebar
        padding: '2rem'
      }}>
        {children}
      </main>
    </div>
  );
};

// Componente principal que simula as rotas e o estado de autenticação.
export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');

  useEffect(() => {
    // Escuta mudanças na hash da URL para simular navegação.
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        setCurrentPage(hash);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Seta a página inicial
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (authenticatedUser: User) => {
    setUser(authenticatedUser);
    window.location.hash = 'dashboard';
  };

  const handleLogout = () => {
    setUser(null);
    window.location.hash = '';
  };

  const renderContent = () => {
    if (!user) {
      return <LoginPage onLogin={handleLogin} />;
    }

    // Renderiza a página correspondente à rota simulada.
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'usuarios':
        return <div style={{ padding: '2rem' }}><h2>Gerenciamento de Lojistas</h2><p>Aqui você pode ver e gerenciar os dados dos lojistas.</p></div>;
      case 'suporte':
        return <div style={{ padding: '2rem' }}><h2>Central de Suporte</h2><p>Tickets e mensagens dos clientes.</p></div>;
      case 'planos':
        return <div style={{ padding: '2rem' }}><h2>Gestão de Planos</h2><p>Gerencie assinaturas e pagamentos.</p></div>;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap');

          :root {
            --purple-main: #6b21a8; /* Roxo principal */
            --purple-dark: #4b0082; /* Roxo escuro para o plano Master/sidebar */
            --purple-accent: #a259ff; /* Roxo mais claro para preços, borda do card */
            --purple-light: #f0e6ff; /* Lilás leve para o card base (cor do .card) */
            --gray-light: #f3f4f6; /* Cinza claro para o toggle */
            --gray-medium: #e5e7eb; /* Cinza médio para bordas */
            --gray-dark-text: #374151; /* Cinza escuro para texto */
            --gray-text: #6b7280; /* Cinza para texto secundário */
            --green-success: #10b981; /* Verde para ícones de sucesso */

            /* Espaçamentos */
            --spacing-xxs: 4px;
            --spacing-xs: 8px;
            --spacing-sm: 12px;
            --spacing-md: 16px; /* 1rem */
            --spacing-lg: 24px;
            --spacing-xl: 32px; /* 2rem */
            --spacing-xxl: 40px;
          }

          * {
            box-sizing: border-box;
            padding: 0;
            margin: 0;
            font-family: 'Poppins', sans-serif;
          }

          html, body {
            height: 100%;
            width: 100%;
            color: var(--gray-dark-text);
            background-color: var(--background);
          }

          a {
            color: inherit;
            text-decoration: none;
          }

          .botao-oval {
            background-color: var(--purple-main);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            font-weight: 600;
            border: none;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
          }

          .botao-oval:hover {
            background-color: var(--purple-dark);
          }

          @media (max-width: 768px) {
            .planos-container, .card, .phand-marquee-container {
              // Estilos para mobile - mantidos como exemplo, mas não usados neste layout específico.
            }
          }
        `}
      </style>
      
      {user ? (
        <BackofficeLayout onLogout={handleLogout}>
          {renderContent()}
        </BackofficeLayout>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </>
  );
}
