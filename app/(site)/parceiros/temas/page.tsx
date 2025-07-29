'use client'

import React from 'react';
import Link from 'next/link';
import styles from './Temas.module.css';
import { FaPaintBrush, FaCode, FaRocket, FaDollarSign } from 'react-icons/fa';

const comoFunciona = [
  { icon: <FaPaintBrush />, title: '1. Leia as Diretrizes', text: 'Entenda nossos padrões de qualidade e design para criar temas que vendem.' },
  { icon: <FaCode />, title: '2. Desenvolva seu Tema', text: 'Use suas habilidades para criar um tema lindo, rápido e responsivo.' },
  { icon: <FaRocket />, title: '3. Envie para Revisão', text: 'Submeta seu tema através do nosso painel de parceiros para nossa equipe avaliar.' },
  { icon: <FaDollarSign />, title: '4. Comece a Lucrar', text: 'Após a aprovação, seu tema entra na loja e você ganha a cada venda.' },
];

function ParceirosDeTemasPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Parceiros de Temas</span>
          <h1>Transforme seu talento em uma fonte de renda</h1>
          <p className={styles.subtitle}>Crie temas para a Phandshop e coloque seu trabalho na frente de milhares de lojistas apaixonados, prontos para comprar.</p>
          <Link href="/parceiros/temas/documentacao" className={styles.ctaButton}>Ver Diretrizes de Design</Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Seu caminho para o sucesso</h2>
            <p>Tornar-se um vendedor de temas na Phandshop é um processo simples e transparente.</p>
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
            <p className={styles.subtitle}>Junte-se à nossa comunidade de criadores e ajude a moldar a aparência do e-commerce no Brasil.</p>
           
            <Link href="/parceiros/cadastro" className={styles.ctaButton}>Quero ser um parceiro</Link>
         </div>
      </section>
    </main>
  );
}

export default ParceirosDeTemasPage;