'use client';

import React, { CSSProperties, useEffect, useState } from 'react';
import Image from 'next/image';
import Planos from './components/Planos'; // Certifique-se que o caminho está correto

const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#1F2937',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#fff',
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    padding: '4rem 1.5rem',
    alignItems: 'center',
    backgroundColor: '#F5F3FF',
  },
  heroGridMd: { // Para desktop, este vira 2 colunas
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  heroTitle: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#5B21B6',
    marginBottom: '1.5rem',
    lineHeight: 1.2,
  },
  heroParagraph: {
    fontSize: '1.125rem',
    marginBottom: '1.5rem',
    color: '#4B5563',
  },
  heroStrong: {
    fontWeight: 700,
    color: '#6D28D9',
  },
  suporteSection: {
    width: '100%',
    padding: '3rem 1rem',
    backgroundColor: '#fff',
  },
  suporteContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem',
    justifyContent: 'space-between',
  },
  suporteGridLg: { // Para desktop, este vira row
    flexDirection: 'row',
  },
  suporteLeft: {
    width: '100%',
    maxWidth: '600px',
  },
  suporteTitle: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#6B21A8',
    marginBottom: '1rem',
  },
  suporteText: {
    fontSize: '1.125rem',
    color: '#4B5563',
  },
  suporteRight: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    justifyContent: 'center',
  },
  suporteBox: {
    border: '1px solid #6B21A8',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    width: '100%',
    maxWidth: '320px',
    backgroundColor: '#fff',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  suporteBoxTitle: {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: '#6B21A8',
    marginBottom: '1rem',
  },
  suporteBoxItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    fontWeight: 500,
  },
  beneficioSection: {
    padding: '4rem 1.5rem',
    backgroundColor: '#F9FAFB',
    textAlign: 'center',
  },
  beneficioTitle: {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '3rem',
    maxWidth: '48rem',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  beneficioGrid: {
    maxWidth: '80rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)', // Ajuste para 1 coluna em mobile se necessário via media query no objeto ou classe CSS
    gap: '1.5rem',
  },
  beneficioCard: {
    width: '100%',
    height: '10rem',
    borderRadius: '0.75rem',
    backgroundColor: '#fff',
    color: '#6B21A8',
    border: '1px solid #D8B4FE',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  },
  beneficioPercent: {
    width: '3rem',
    height: '3rem',
    borderRadius: '9999px',
    backgroundColor: '#DDD6FE',
    color: '#6B21A8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.25rem',
  },
  beneficioLabel: {
    marginTop: '0.5rem',
    fontSize: '1rem',
    fontWeight: 500,
  },
  planosSection: {
    width: '100%',
    padding: '4rem 1rem',
    backgroundColor: '#fff',
  },
  planosTitle: {
    textAlign: 'center',
    fontSize: '1.875rem',
    fontWeight: 700,
    color: '#6D28D9',
    marginBottom: '2.5rem',
  },
  planosCarrosselMobile: { // Container para o carrossel mobile
    overflowX: 'auto' as const,
    whiteSpace: 'nowrap' as const, // Impede que o conteúdo do Planos quebre linha
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitOverflowScrolling: 'touch', // Para iOS
  },
  planosCarrosselMobileContent: { // Conteúdo interno do carrossel
    display: 'flex', // Necessário para que os planos fiquem em linha
    flexDirection: 'row',
    gap: '1rem', // Espaçamento entre os cards no carrossel (se Planos renderizar múltiplos itens diretamente)
    // Se o .planos-container do globals.css já faz o display:flex pros cards, este pode não precisar de display:flex
    // mas sim de padding para o scroll não colar nas bordas.
    // padding: '0 1rem', // Exemplo de padding para o scroll do carrossel
  },
  // ***** ESTA É A ALTERAÇÃO PRINCIPAL *****
  planosGridMd: { // Container para os planos em desktop
    width: '100%', // Permite que o .planos-container interno (do globals.css) se centralize
    // As propriedades de grid display, gridTemplateColumns e gap foram removidas daqui.
  },
};

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Verifica no mount inicial
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Adapta o estilo do heroSection e suporteContainer baseado em isMobile
  const heroSectionStyle = isMobile ? styles.heroSection : { ...styles.heroSection, ...styles.heroGridMd };
  const suporteContainerStyle = isMobile ? styles.suporteContainer : { ...styles.suporteContainer, ...styles.suporteGridLg };
  // Adapta o estilo do beneficioGrid para mobile (ex: 1 coluna)
  // Você pode adicionar uma lógica similar se quiser que beneficioGrid mude em mobile
  // Ex: const beneficioGridStyle = isMobile ? {...styles.beneficioGrid, gridTemplateColumns: '1fr'} : styles.beneficioGrid;
  // E usar beneficioGridStyle no JSX.

  return (
    <div style={styles.container}>
    
      {/* Hero */}
      <section style={heroSectionStyle}>
        <div>
          <h1 style={styles.heroTitle}>
            Ter sua loja online é mais simples do que você imagina.
          </h1>
          <p style={styles.heroParagraph}>
            Venda 24 horas por dia com a cara da sua marca, temas personalizados e tudo o que você precisa para começar.
            Cobramos apenas <span style={styles.heroStrong}>1% por venda</span>, a menor taxa do mercado.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Adicionado alignItems para centralizar verticalmente se a altura permitir */}
          <Image src="/logo.png" alt="Ilustração Phandshop" width={300} height={300} style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      </section>

      {/* Suporte */}
      <section style={styles.suporteSection}>
        <div style={suporteContainerStyle}>
          <div style={styles.suporteLeft}>
            <h2 style={styles.suporteTitle}>Suporte e Mentoria Phandshop</h2>
            <p style={styles.suporteText}>
              Na Phandshop, você conta com suporte rápido, mentorias ao vivo e acompanhamento especializado em cada etapa.
              Nosso sucesso é o seu sucesso — estamos prontos para te orientar e garantir que você tenha segurança para focar apenas em vender.
              Com 97% de avaliações positivas, nosso suporte responde em até 1 minuto e nossas mentorias te ajudam a dominar sua loja virtual.
            </p>
          </div>
          <div style={styles.suporteRight}>
            <div style={styles.suporteBox}>
              <h3 style={styles.suporteBoxTitle}>Horário de Atendimento</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.875rem' }}>
                <div style={styles.suporteBoxItem}>
                  <span>Segunda à Sexta</span>
                  <span style={{ color: '#6D28D9', fontWeight: 600 }}>09h às 20h</span>
                </div>
                <div style={styles.suporteBoxItem}>
                  <span>Finais de Semana e Feriados</span>
                  <span style={{ color: '#6D28D9', fontWeight: 600 }}>10h às 15h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      

      {/* Planos */}
      <section style={styles.planosSection}>
        <h2 style={styles.planosTitle}>Escolha o plano ideal</h2>
        {isMobile ? (
          <div style={styles.planosCarrosselMobile}>
            <div style={styles.planosCarrosselMobileContent}>
              {/* O componente Planos renderizará o .planos-container que no mobile é flex e scrollable */}
              <Planos />
            </div>
          </div>
        ) : (
          // Em desktop, este div agora é um container simples,
          // e o .planos-container DENTRO de <Planos /> fará o grid de 4 colunas.
          <div style={styles.planosGridMd}>
            <Planos />
          </div>
        )}
      </section>
    </div>
  );
}