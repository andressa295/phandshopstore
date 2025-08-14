// LoginPage.tsx
import React, { useState, FormEvent } from 'react';
import styles from './Backoffice.module.css';

interface User {
  email: string;
  role: string;
}

interface LoginPageProps {
  onLogin: (user: User) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (email === 'admin@phandshop.com' && password === 'admin123') {
      const user: User = { email: email, role: 'admin' };
      onLogin(user);
    } else {
      setError('Credenciais inválidas. Use "admin@phandshop.com" e "admin123"');
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form onSubmit={handleLogin} className={styles.loginForm}>
        <h2 className={styles.loginTitle}>Login do Backoffice</h2>
        {error && <p className={styles.loginError}>{error}</p>}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className={styles.loginInput}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.loginInput}
        />
        <button type="submit" className={`${styles.loginButton} ${styles.botaoOval}`}>
          Entrar
        </button>
      </form>
    </div>
  );
};

export default LoginPage;