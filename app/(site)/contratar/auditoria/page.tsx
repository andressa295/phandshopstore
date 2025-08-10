// app/(site)/parceiros/auditoria/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Auditoria.module.css';
import { FaSearch, FaLightbulb, FaChartBar, FaUserCheck } from 'react-icons/fa';

const servicosAuditoria = [
  { 
    icon: <FaSearch />, 
    title: 'Análise de Desempenho',
    description: 'Identifique gargalos de velocidade e otimize o carregamento da sua loja para melhorar a experiência do cliente e o seu SEO.',
  },
  { 
    icon: <FaLightbulb />, 
    title: 'Otimização de SEO',
    description: 'Receba um relatório completo sobre a performance da sua loja nos mecanismos de busca e um plano de ação para melhorar seu ranking.',
  },
  { 
    icon: <FaChartBar />, 
    title: 'Análise de Conversão',
    description: 'Entenda o comportamento dos seus visitantes e descubra como aumentar a taxa de conversão do seu e-commerce.',
  },
  { 
    icon: <FaUserCheck />, 
    title: 'Usabilidade e Experiência do Usuário',
    description: 'Nossos parceiros avaliam a facilidade de navegação e o design da sua loja, sugerindo melhorias para uma jornada de compra mais fluida.',
  },
];

function AuditoriaPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Auditoria de Loja</span>
          <h1>Otimize sua loja e venda mais</h1>
          <p className={styles.subtitle}>
            Receba uma análise detalhada da sua loja e um plano de ação completo para
            melhorar a performance, SEO, usabilidade e a experiência do cliente.
          </p>
          <Link href="/parceiros/contratar" className={styles.ctaButton}>
            Quero uma Auditoria
          </Link>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Do diagnóstico à solução, um passo de cada vez</h2>
            <p>Conheça os serviços de auditoria e otimização oferecidos por nossos parceiros.</p>
          </div>
          <div className={styles.servicesGrid}>
            {servicosAuditoria.map((servico) => (
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
            <h2>Pronto para otimizar sua loja?</h2>
            <p className={styles.subtitle}>
              Conecte-se com especialistas e leve sua loja para o próximo nível.
            </p>
            <Link href="/parceiros/contratar" className={styles.ctaButton}>
              Encontrar meu especialista em otimização
            </Link>
          </div>
      </section>
    </main>
  );
}

export default AuditoriaPage;