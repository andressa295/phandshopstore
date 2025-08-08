// app/(site)/parceiros/configuracao/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import styles from './Configuracao.module.css';
import { FaStore, FaTools, FaWrench, FaCogs } from 'react-icons/fa';

const comoFunciona = [
  { icon: <FaTools />, title: '1. Descreva sua Loja', text: 'Informe as necessidades do seu negócio, nicho e produtos.' },
  { icon: <FaWrench />, title: '2. Receba um Orçamento', text: 'Um parceiro especializado fará uma proposta personalizada para a configuração.' },
  { icon: <FaCogs />, title: '3. Acompanhe a Configuração', text: 'O parceiro cuida de todos os detalhes técnicos, da importação de produtos ao layout.' },
  { icon: <FaStore />, title: '4. Sua Loja Pronta!', text: 'Sua loja é entregue configurada e pronta para a sua primeira venda.' },
];

function ConfiguracaoLojaPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Configuração de Loja</span>
          <h1>Lançar sua loja nunca foi tão fácil</h1>
          <p className={styles.subtitle}>
            Conte com profissionais certificados para configurar sua loja do zero,
            garantindo que tudo esteja perfeito para o seu lançamento.
          </p>
          <Link href="/parceiros/contratar" className={styles.ctaButton}>
            Ver Profissionais
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Do zero à sua primeira venda em poucos dias</h2>
            <p>Deixe o trabalho técnico com a gente e foque no seu negócio.</p>
          </div>
          <div className={styles.stepsGrid}>
            {comoFunciona.map(step => (
              <div key={step.title} className={styles.stepCard}>
                <div className={styles.stepIcon}>{step.icon}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.finalCtaSection}`}>
          <div className={styles.contentContainer}>
            <h2>Pronto para começar?</h2>
            <p className={styles.subtitle}>
              Conecte-se com especialistas e lance sua loja com segurança e rapidez.
            </p>
            <Link href="/parceiros/contratar" className={styles.ctaButton}>
              Quero contratar um profissional
            </Link>
          </div>
      </section>
    </main>
  );
}

export default ConfiguracaoLojaPage;