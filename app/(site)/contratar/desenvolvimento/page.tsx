// app/(site)/parceiros/desenvolvimento/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Desenvolvimento.module.css';
import { FaCode, FaPlug, FaLightbulb, FaTools } from 'react-icons/fa';

const servicosDev = [
  { 
    icon: <FaCode />, 
    title: 'Criação de Apps Personalizados',
    description: 'Desenvolva soluções únicas que se conectam diretamente com a sua loja para automatizar processos e criar experiências exclusivas.',
  },
  { 
    icon: <FaPlug />, 
    title: 'Integração com Sistemas Externos',
    description: 'Conecte sua loja com ERPs, CRMs, ferramentas de marketing e outros softwares para centralizar sua operação.',
  },
  { 
    icon: <FaLightbulb />, 
    title: 'Desenvolvimento de Funcionalidades',
    description: 'Adicione recursos personalizados e funcionalidades sob medida para atender às necessidades específicas do seu negócio.',
  },
  { 
    icon: <FaTools />, 
    title: 'Consultoria Técnica',
    description: 'Receba consultoria de especialistas para planejar a arquitetura e a melhor forma de implementar sua solução na Phandshop.',
  },
];

function DesenvolvimentoPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Desenvolvimento e Integrações</span>
          <h1>Construa o futuro da sua loja</h1>
          <p className={styles.subtitle}>
            Aumente o potencial da sua loja com soluções e integrações personalizadas,
            criadas por nossa rede de desenvolvedores certificados.
          </p>
          <Link href="/parceiros/contratar" className={styles.ctaButton}>
            Ver Profissionais
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Do simples ao complexo, temos a solução</h2>
            <p>Conheça os serviços de desenvolvimento e integração oferecidos por nossos parceiros.</p>
          </div>
          <div className={styles.servicesGrid}>
            {servicosDev.map((servico) => (
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
            <p className={styles.ctaSubtitle}>
              Conecte-se com os melhores desenvolvedores do mercado e crie o seu próximo grande projeto.
            </p>
            <Link href="/parceiros/contratar" className={styles.ctaButton}>
              Quero contratar um desenvolvedor
            </Link>
          </div>
      </section>
    </main>
  );
}

export default DesenvolvimentoPage;