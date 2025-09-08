'use client';

import React, { useState, useEffect } from 'react';
import { Mail } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { NewsletterModuleData } from '../../../../(painel)/personalizar/types';

// O componente agora recebe as props diretamente, não mais como um objeto 'data'
const NewsletterSection: React.FC<NewsletterModuleData> = ({ isActive, title, subtitle, buttonText }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Se o módulo não estiver ativo, não renderiza nada
  if (!isActive) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    setIsSuccess(false);

    if (!email || !email.includes('@') || !email.includes('.')) {
      setMessage('Por favor, insira um e-mail válido.');
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setMessage('Obrigado por se inscrever! Em breve você receberá nossas novidades.');
      setIsSuccess(true);
      setEmail('');
    } catch (err) {
      console.error('Erro ao se inscrever:', err);
      setError('Ocorreu um erro ao se inscrever. Tente novamente mais tarde.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="ph-newsletter-section">
      <h2 className="ph-newsletter-title">{title || "Receba nossas novidades e ofertas!"}</h2>
      <p className="ph-newsletter-subtitle">{subtitle || "Inscreva-se e fique por dentro de tudo o que acontece na nossa loja."}</p>
      
      <form onSubmit={handleSubmit} className="ph-newsletter-form">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu melhor e-mail"
          className="ph-newsletter-input"
          required
          disabled={loading}
        />
        <button type="submit" className="ph-newsletter-button" disabled={loading}>
          {loading ? 'Enviando...' : (buttonText || 'Inscrever-se')}
        </button>
      </form>

      {message && (
        <p className={`ph-newsletter-message ${isSuccess ? 'ph-success' : 'ph-error'}`}>
          {message}
        </p>
      )}
      {error && (
        <p className="ph-newsletter-message ph-error">
          {error}
        </p>
      )}
    </section>
  );
};

export default NewsletterSection;