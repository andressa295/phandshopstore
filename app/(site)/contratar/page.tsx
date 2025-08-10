// app/(site)/parceiros/contratar/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import styles from './Contratar.module.css';
import { FaPaintBrush, FaStore, FaTools, FaLaptopCode, FaBullhorn, FaClipboardList } from 'react-icons/fa';

const services = [
  {
    title: 'Design e Criação',
    description: 'Deixe a sua loja com a cara da sua marca. Parceiros especialistas em design criam temas personalizados e identidades visuais exclusivas.',
    icon: <FaPaintBrush />,
    link: '/contratar/design'
  },
  {
    title: 'Configuração da Loja',
    description: 'Precisa de ajuda para começar? Profissionais certificados configuram sua loja do zero, importam produtos e deixam tudo pronto para a sua primeira venda.',
    icon: <FaStore />,
    link: '/contratar/configuracao'
  },
  {
    title: 'Migração de Plataforma',
    description: 'Traga sua loja para a Phandshop sem dores de cabeça. Nossos parceiros cuidam de toda a migração de produtos, clientes e dados com segurança.',
    icon: <FaTools />,
    link: '/contratar/migracao'
  },
  {
    title: 'Desenvolvimento e Integrações',
    description: 'Para soluções mais complexas, contrate desenvolvedores para criar funcionalidades personalizadas e integrar a sua loja com outros sistemas.',
    icon: <FaLaptopCode />,
    link: '/contratar/desenvolvimento'
  },
  {
    title: 'Marketing Digital',
    description: 'Conecte sua loja com o público certo. Contrate especialistas para criar e gerenciar campanhas de e-mail marketing e anúncios pagos.',
    icon: <FaBullhorn />,
    link: '/contratar/marketing'
  },
  {
    title: 'Auditoria de Loja',
    description: 'Receba uma análise completa da sua loja. Os parceiros identificam pontos de melhoria no design, performance, usabilidade e conversão.',
    icon: <FaClipboardList />,
    link: '/contratar/auditoria'
  },
];

function ContratarParceiroPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.bannerSection}`}>
        <div className={styles.contentContainer}>
          {/* Você adicionará a imagem e o conteúdo do banner aqui */}
        </div>
      </section>

      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Contrate um Parceiro</span>
          <h1>Encontre o especialista ideal para a sua loja</h1>
          <p className={styles.subtitle}>
            Acelere o crescimento do seu negócio com a ajuda de profissionais certificados.
            Nossos parceiros estão prontos para transformar suas ideias em realidade.
          </p>
          <Link href="#servicos" className={styles.ctaButton}>
            Ver Serviços
          </Link>
        </div>
      </section>

      <section id="servicos" className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Nossos serviços em destaque</h2>
            <p>Selecione o serviço que você precisa e encontre o profissional certo para a tarefa.</p>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <div key={service.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href={service.link} className={styles.cardLink}>
                  Ver detalhes
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.finalCtaSection}`}>
          <div className={styles.contentContainer}>
            <h2>Pronto para começar?</h2>
            <p className={styles.subtitle}>
              Conecte-se com os melhores talentos do mercado e construa a loja dos seus sonhos.
            </p>
            <Link href="/contratar/diretorio" className={styles.ctaButton}>
              Ver Diretório de Parceiros
            </Link>
          </div>
      </section>
    </main>
  );
}

export default ContratarParceiroPage;