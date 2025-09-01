'use client';

import { useState, FormEvent } from 'react';
import './styles/styles.css'; 
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';
import Image from 'next/image';

export default function PreLancamento() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [whatsapp, setWhatsapp] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, whatsapp }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess(true);
      setName('');
      setEmail('');
      setWhatsapp('');
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      
      {/* HERO COM VÍDEO */}
      <section className="hero-with-video">
        <video className="hero-background-video" autoPlay loop muted playsInline>
          <source src="/phandshop-hero-desktop.mp4" media="(min-width: 769px)" type="video/mp4" />
          <source src="/phandshop-hero-mobile.mp4" media="(max-width: 768px)" type="video/mp4" />
          Seu navegador não suporta a tag de vídeo.
        </video>
      </section>

      {/* CONTEÚDO ABAIXO DO HERO */}
      <section className="hero-content-below">
      
        <p className="highlight-message">
          O lançamento oficial da nossa plataforma será no dia <b>20 de janeiro</b>. Mas, em <b>dezembro</b>, estamos abrindo uma oportunidade única para você. Garanta sua vaga para ser um dos primeiros a criar e testar sua loja online com acesso gratuito aos recursos completos e suporte VIP, ajudando a moldar a plataforma antes de todo mundo!
        </p>
        <p>Preencha o formulário abaixo:</p>
        
        <form onSubmit={handleSubmit} className="lead-form">
          {success ? (
            <p className="success-message">Obrigado! Você entrou na lista VIP. 🎉</p>
          ) : (
            <>
              <div className="form-fields">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome"
                  required
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  required
                />
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="Seu WhatsApp (com DDD)"
                  required
                />
              </div>
              <button type="submit">Quero ser avisado</button>
            </>
          )}
        </form>
      </section>

      {/* BENEFÍCIOS */}
      <section className="info">
        <h2>Vantagens para quem chegar primeiro!</h2>
        <ul className="info-list">
          <li>
            <h3>Exclusividade</h3>
            <p>Seja um dos primeiros a criar sua loja virtual e saia na frente da concorrência.</p>
          </li>
          <li>
            <h3>Descontos</h3>
            <p>Condições únicas e exclusivas para os primeiros lojistas da Phandshop.</p>
          </li>
          <li>
            <h3>Suporte prioritário VIP</h3>
            <p>Conte com nossa equipe para tirar suas dúvidas e otimizar suas vendas desde o início.</p>
          </li>
          <li>
            <h3>Participe do futuro</h3>
            <p>Ajude a moldar a plataforma com seu feedback e tenha recursos pensados para você.</p>
          </li>
        </ul>
      </section>

      {/* EXEMPLO DE LOJA */}
      <section className="theme-showcase">
        <h2>Seja o próximo a ter uma loja incrível como esta!</h2>
        <div className="theme-image-container">
          <Image
            src="/site.png"
            alt="Exemplo de tema de loja virtual da Phandshop"
            width={1200}
            height={600}
            quality={80}
            priority
            className="store-theme-image"
          />
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="footer">
        <div className="social-icons">
          <a href="https://instagram.com/phandshop" target="_blank" rel="noopener noreferrer">
            <FaInstagram className="icon" />
          </a>
          <a href="https://wa.me/5511949184370" target="_blank" rel="noopener noreferrer">
            <FaWhatsapp className="icon" />
          </a>
        </div>
        <p>© 2025 Phandshop - Todos os direitos reservados</p>
      </footer>
    </>
  );
}
