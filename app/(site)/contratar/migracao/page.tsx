// app/(site)/parceiros/migracao/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Migracao.module.css';
import { FaSyncAlt, FaShieldAlt, FaRocket, FaClock } from 'react-icons/fa';

const beneficios = [
  { 
    icon: <FaShieldAlt />, 
    title: 'Migração Segura e Completa',
    description: 'Nossos parceiros garantem que todos os seus dados, produtos e clientes sejam transferidos sem perdas.',
  },
  { 
    icon: <FaSyncAlt />, 
    title: 'Zero Downtime',
    description: 'Realizamos a migração sem que sua loja saia do ar, garantindo que suas vendas não sejam interrompidas.',
  },
  { 
    icon: <FaRocket />, 
    title: 'Desempenho Otimizado',
    description: 'Sua loja será otimizada na nova plataforma, aproveitando ao máximo a velocidade e as funcionalidades da Phandshop.',
  },
  { 
    icon: <FaClock />, 
    title: 'Processo Rápido e Simples',
    description: 'Deixe a parte técnica conosco e foque no seu negócio. Nossos parceiros cuidam de tudo para você.',
  },
];

function MigracaoPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Migração de Plataforma</span>
          <h1>Mude para a Phandshop sem preocupação</h1>
          <p className={styles.subtitle}>
            Transfira sua loja de qualquer plataforma para a Phandshop com a ajuda
            de especialistas certificados, garantindo um processo suave e seguro.
          </p>
          <Link href="/parceiros/contratar" className={styles.ctaButton}>
            Quero Migrar Minha Loja
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Por que migrar com um parceiro Phandshop?</h2>
            <p>Conheça os principais benefícios de contar com ajuda profissional.</p>
          </div>
          <div className={styles.benefitsGrid}>
            {beneficios.map((beneficio) => (
              <div key={beneficio.title} className={styles.benefitCard}>
                <div className={styles.benefitIcon}>{beneficio.icon}</div>
                <h3>{beneficio.title}</h3>
                <p>{beneficio.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.finalCtaSection}`}>
          <div className={styles.contentContainer}>
            <h2>Pronto para dar o próximo passo?</h2>
            <p className={styles.ctaSubtitle}>
              Comece a aproveitar os recursos e o desempenho da Phandshop agora.
            </p>
            <Link href="/parceiros/contratar" className={styles.ctaButton}>
              Encontrar meu parceiro de migração
            </Link>
          </div>
      </section>
    </main>
  );
}

export default MigracaoPage;