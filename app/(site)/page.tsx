'use client';

import React, { CSSProperties, useEffect, useState } from 'react';
import Image from 'next/image';

const styles: { [key: string]: CSSProperties } = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    color: '#1F2937',
    fontFamily: "'Poppins', sans-serif",
    backgroundColor: '#F9FAFB',
  },
  heroSection: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2.5rem',
    padding: '5rem 1.5rem',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
  },
  heroGridMd: {
    gridTemplateColumns: 'repeat(2, 1fr)',
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 800,
    color: '#7C3AED',
    marginBottom: '2rem',
    lineHeight: 1.2,
  },
  heroParagraph: {
    fontSize: '1.25rem',
    marginBottom: '2rem',
    color: '#374151',
  },
  heroStrong: {
    fontWeight: 700,
    color: '#7C3AED',
  },
  suporteSection: {
    width: '100%',
    padding: '4rem 1rem',
    backgroundColor: '#fff',
  },
  suporteContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '3rem',
    justifyContent: 'space-between',
  },
  suporteGridLg: {
    flexDirection: 'row',
  },
  suporteLeft: {
    width: '100%',
    maxWidth: '600px',
  },
  suporteTitle: {
    fontSize: '2rem',
    fontWeight: 700,
    color: '#6D28D9',
    marginBottom: '1.25rem',
  },
  suporteText: {
    fontSize: '1.125rem',
    color: '#4B5563',
    lineHeight: 1.6,
  },
  suporteRight: {
    width: '100%',
    maxWidth: '400px',
    display: 'flex',
    justifyContent: 'center',
  },
  suporteBox: {
    border: '1px solid #A78BFA',
    borderRadius: '0.75rem',
    padding: '2rem',
    width: '100%',
    maxWidth: '320px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
  },
  suporteBoxTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#7C3AED',
    marginBottom: '1.25rem',
  },
  suporteBoxItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '1rem',
    marginBottom: '1rem',
    fontWeight: 500,
    color: '#374151',
  },
  beneficioSection: {
    padding: '5rem 1.5rem',
    backgroundColor: '#F3F4F6',
    textAlign: 'center',
  },
  beneficioTitle: {
    fontSize: '2.25rem',
    fontWeight: 700,
    color: '#1F2937',
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
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '2rem',
  },
  beneficioCard: {
    height: '11rem',
    borderRadius: '1rem',
    backgroundColor: '#fff',
    color: '#7C3AED',
    border: '1px solid #DDD6FE',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
  },
  beneficioPercent: {
    width: '3.25rem',
    height: '3.25rem',
    borderRadius: '9999px',
    backgroundColor: '#DDD6FE',
    color: '#6D28D9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '1.375rem',
  },
  beneficioLabel: {
    marginTop: '0.5rem',
    fontSize: '1.125rem',
    fontWeight: 500,
  },
  planosSection: {
    width: '100%',
    padding: '5rem 1rem',
    backgroundColor: '#fff',
  },
  planosTitle: {
    textAlign: 'center',
    fontSize: '2.25rem',
    fontWeight: 800,
    color: '#7C3AED',
    marginBottom: '3rem',
  },
  planosCarrosselMobile: {
    overflowX: 'auto' as const,
    whiteSpace: 'nowrap' as const,
    scrollbarWidth: 'none' as const,
    msOverflowStyle: 'none' as const,
    WebkitOverflowScrolling: 'touch',
  },
  planosCarrosselMobileContent: {
    display: 'flex',
    flexDirection: 'row',
    gap: '1.5rem',
  },
  planosGridMd: {
    width: '100%',
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '2rem',
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

  const heroSectionStyle = isMobile ? styles.heroSection : { ...styles.heroSection, ...styles.heroGridMd };
  const suporteContainerStyle = isMobile ? styles.suporteContainer : { ...styles.suporteContainer, ...styles.suporteGridLg };

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
            Taxa por venda <span style={styles.heroStrong}>0% </span>, a melhor taxa do mercado.
          </p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}> {/* Adicionado alignItems para centralizar verticalmente se a altura permitir */}
          <Image src="/site.png" alt="Ilustração Phandshop" width={900} height={900} style={{ maxWidth: '100%', height: 'auto' }} />
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
    </div>
  );
}