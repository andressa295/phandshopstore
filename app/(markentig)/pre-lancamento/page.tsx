'use client';

import { useState, FormEvent } from 'react';
// Ajuste no caminho do import:
import './styles/styles.css'; 

export default function PreLancamento() {
  const [email, setEmail] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSuccess(true);
  };

  return (
    <>
      <header className="header">
        <div className="logo">Phandshop</div>
      </header>
      <section className="hero">
        <h1>Crie sua loja virtual antes de todo mundo!</h1>
        <p>Seja avisado do lançamento e ganhe benefícios exclusivos.</p>
        <form onSubmit={handleSubmit} className="lead-form">
          {success ? (
            <p>Obrigado! Você entrou na lista VIP. 🎉</p>
          ) : (
            <>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu melhor e-mail"
                required
              />
              <button type="submit">Quero ser avisado</button>
            </>
          )}
        </form>
      </section>
      <section className="info">
        <h2>Por que usar a Phandshop?</h2>
        <ul>
          <li>Plataforma rápida e escalável</li>
          <li>Painel fácil de usar</li>
          <li>Suporte dedicado</li>
          <li>Lançamento exclusivo</li>
        </ul>
      </section>
      <footer className="footer">
        <p>© 2025 Phandshop - Todos os direitos reservados</p>
      </footer>
    </>
  );
}