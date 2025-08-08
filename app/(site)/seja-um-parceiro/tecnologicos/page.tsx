// app/(site)/parceiros/tecnologicos/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import styles from './Tecnologicos.module.css';
import { FaCode, FaLaptopCode, FaDollarSign, FaRocket } from 'react-icons/fa';

const comoFunciona = [
  { icon: <FaCode />, title: '1. Acesse a Documentação', text: 'Entenda nossa API, padrões de segurança e como nossa plataforma funciona por baixo dos panos.' },
  { icon: <FaLaptopCode />, title: '2. Desenvolva seu App', text: 'Crie integrações poderosas que resolvam problemas reais para os nossos lojistas.' },
  { icon: <FaRocket />, title: '3. Publique na App Store', text: 'Submeta seu app para nossa equipe revisar e comece a alcançar milhares de lojas.' },
  { icon: <FaDollarSign />, title: '4. Comece a Lucrar', text: 'Receba uma porcentagem a cada venda do seu app na nossa loja de aplicativos.' },
];

function ParceirosTecnologicosPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Parceiros Tecnológicos</span>
          <h1>Construa o próximo grande aplicativo para o e-commerce</h1>
          <p className={styles.subtitle}>
            Desenvolva integrações poderosas e ferramentas que transformam o e-commerce brasileiro.
            Monetize suas soluções e alcance uma base de clientes em rápido crescimento.
          </p>
          <Link href="/docs-api" className={styles.ctaButton}>
            Ver Documentação da API
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Do código ao lançamento, em poucos passos</h2>
            <p>Seja um desenvolvedor parceiro da Phandshop e transforme suas ideias em lucro.</p>
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
            <p className={styles.subtitle}>Junte-se à nossa comunidade de criadores e ajude a moldar o futuro do e-commerce.</p>
            
            <Link href="/seja-um-parceiro/parceiros/cadastro" className={styles.ctaButton}>Quero ser um parceiro</Link>
          </div>
      </section>
    </main>
  );
}

export default ParceirosTecnologicosPage;