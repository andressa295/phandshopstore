// app/(site)/parceiros/marketing/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Marketing.module.css';
import { FaBullhorn, FaEnvelopeOpenText, FaAd, FaChartLine } from 'react-icons/fa';

const servicosMarketing = [
  { 
    icon: <FaEnvelopeOpenText />, 
    title: 'E-mail Marketing',
    description: 'Crie campanhas personalizadas para nutrir seus leads, fidelizar clientes e anunciar promoções exclusivas.',
  },
  { 
    icon: <FaAd />, 
    title: 'Anúncios Pagos',
    description: 'Conecte-se com o público certo através de campanhas de anúncios estratégicas no Google e nas redes sociais.',
  },
  { 
    icon: <FaChartLine />, 
    title: 'Otimização de SEO',
    description: 'Nossos parceiros otimizam sua loja para os mecanismos de busca, garantindo que novos clientes te encontrem facilmente.',
  },
  { 
    icon: <FaBullhorn />, 
    title: 'Gestão de Mídias Sociais',
    description: 'Construa uma presença forte nas redes sociais com a ajuda de especialistas em conteúdo e engajamento.',
  },
];

function MarketingPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Marketing Digital</span>
          <h1>Alcance novos clientes e expanda sua marca</h1>
          <p className={styles.subtitle}>
            Aumente o tráfego da sua loja e converta mais vendas com estratégias
            de marketing digital criadas por profissionais certificados.
          </p>
          <Link href="/parceiros/contratar" className={styles.ctaButton}>
            Ver Profissionais
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Do tráfego à conversão</h2>
            <p>Conheça os serviços de marketing digital oferecidos por nossos parceiros.</p>
          </div>
          <div className={styles.servicesGrid}>
            {servicosMarketing.map((servico) => (
              <div key={servico.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{servico.icon}</div>
                <h3>{servico.title}</h3>
                <p>{servico.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.finalCtaSection}`}>
          <div className={styles.contentContainer}>
            <h2>Pronto para ir além?</h2>
            <p className={styles.subtitle}>
              Conecte-se com especialistas e crie o seu próximo grande projeto.
            </p>
            <Link href="/parceiros/contratar" className={styles.ctaButton}>
              Quero contratar um especialista
            </Link>
          </div>
      </section>
    </main>
  );
}

export default MarketingPage;