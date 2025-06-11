// app/desenvolvedores/page.tsx
import React from 'react';
import Link from 'next/link';
import styles from './Desenvolvedores.module.css';
import { FaPuzzlePiece, FaBook, FaShareAlt, FaRocket } from 'react-icons/fa';

export default function DesenvolvedoresPage() {
  const oQueConstruir = [
    { icon: <FaPuzzlePiece />, title: 'Apps de Marketing', text: 'Crie soluções de pop-ups, banners, e recuperação de carrinho.' },
    { icon: <FaShareAlt />, title: 'Novos Canais de Venda', text: 'Integre a Phandshop com marketplaces e redes sociais emergentes.' },
    { icon: <FaRocket />, title: 'Ferramentas de Nicho', text: 'Desenvolva soluções para agendamentos, ingressos, ou produtos digitais.' },
  ];

  return (
    <main className={styles.pageWrapper}>
      {/* Hero Section */}
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Desenvolvedores</span>
          <h1>Inove com a API da Phandshop</h1>
          <p className={styles.subtitle}>Use nossa API RESTful e webhooks para criar aplicativos públicos para nossa App Store ou soluções privadas para clientes específicos.</p>
          <div className={styles.heroActions}>
            <Link href="/desenvolvedores/api" className={styles.ctaButtonPrimary}>Acessar Documentação da API</Link>
            <Link href="/parceiros/cadastro" className={styles.ctaButtonSecondary}>Criar Conta de Parceiro</Link>
          </div>
        </div>
      </section>

      {/* O que construir */}
      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>O que você pode construir?</h2>
            <p>As possibilidades são infinitas. Nossos lojistas precisam de soluções criativas para vender mais.</p>
          </div>
          <div className={styles.grid}>
            {oQueConstruir.map(item => (
              <div key={item.title} className={styles.card}>
                <div className={styles.cardIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documentação */}
      <section className={`${styles.section} ${styles.docSection}`}>
         <div className={styles.contentContainer}>
            <div className={styles.docBox}>
                <FaBook />
                <h2>Documentação Completa e Interativa</h2>
                <p>Nossa documentação possui exemplos de código, guias e um ambiente de testes para você começar a desenvolver em minutos.</p>
                <Link href="/desenvolvedores/api" className={styles.ctaButtonPrimary}>Explorar Documentação</Link>
            </div>
         </div>
      </section>
    </main>
  );
}
