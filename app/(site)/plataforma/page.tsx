// app/(site)/plataforma/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Plataforma.module.css';
import { FaChartLine, FaRobot, FaSyncAlt, FaArrowRight } from 'react-icons/fa';

export default function PlataformaPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <h1 className={styles.heroTitle}>Uma Plataforma Completa para o seu E-commerce</h1>
          <p className={styles.heroSubtitle}>
            Conheça as ferramentas e funcionalidades da Phandshop que impulsionam suas vendas e otimizam sua operação.
          </p>
        </div>
      </section>

      <section className={styles.featuresSection}>
        <div className={styles.contentContainer}>
          <h2 className={styles.sectionTitle}>Nossas Principais Soluções</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <FaSyncAlt size={50} className={styles.featureIcon} />
              <h3 className={styles.cardTitle}>Conversão</h3>
              <p className={styles.cardDescription}>
                Recursos para transformar visitantes em clientes, como recuperação de carrinho e checkout otimizado.
              </p>
              <Link href="/plataforma/conversao" className={styles.verMaisLink}>
                Ver mais <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>

            <div className={styles.featureCard}>
              <FaRobot size={50} className={styles.featureIcon} />
              <h3 className={styles.cardTitle}>Automação</h3>
              <p className={styles.cardDescription}>
                Ferramentas para automatizar o seu dia a dia, desde e-mails até fluxos de venda.
              </p>
              <Link href="/plataforma/automacao" className={styles.verMaisLink}>
                Ver mais <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>

            <div className={styles.featureCard}>
              <FaChartLine size={50} className={styles.featureIcon} />
              <h3 className={styles.cardTitle}>Análises</h3>
              <p className={styles.cardDescription}>
                Relatórios e dashboards para que você tome as melhores decisões para o seu negócio.
              </p>
              <Link href="/plataforma/analises" className={styles.verMaisLink}>
                Ver mais <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}