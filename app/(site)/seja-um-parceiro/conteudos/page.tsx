// app/(site)/parceiros/conteudos/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import styles from './Conteudo.module.css';
import { FaBullhorn, FaLink, FaStar, FaDollarSign } from 'react-icons/fa';

const comoFunciona = [
  { icon: <FaBullhorn />, title: '1. Junte-se ao Programa', text: 'Inscreva-se e seja aprovado em nossa rede de parceiros de conteúdo.' },
  { icon: <FaLink />, title: '2. Crie Conteúdo', text: 'Crie artigos, vídeos ou tutoriais sobre a Phandshop e o e-commerce em geral.' },
  { icon: <FaStar />, title: '3. Divulgue sua Marca', text: 'Compartilhe seus links e o seu conteúdo para seus seguidores e audiência.' },
  { icon: <FaDollarSign />, title: '4. Ganhe Comissões', text: 'Receba comissões por cada novo cliente que vier através dos seus links.' },
];

function ParceirosDeConteudoPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Parceiros de Conteúdo</span>
          <h1>Monetize seu conteúdo e ajude a comunidade</h1>
          <p className={styles.subtitle}>
            Se você é um blogueiro, criador de conteúdo ou influenciador, junte-se à nossa rede e
            ganhe comissões por cada novo lojista que você trouxer para a plataforma.
          </p>
          <Link href="/seja-um-parceiro/parceiros/cadastro" className={styles.ctaButton}>
            Quero ser um parceiro
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Como funciona</h2>
            <p>Seja pago para falar sobre o que você já ama fazer.</p>
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

export default ParceirosDeConteudoPage;