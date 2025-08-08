// app/(site)/parceiros/design/page.tsx
'use client'

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Design.module.css';
import { FaPaintBrush, FaLaptopCode, FaCheckCircle, FaStar } from 'react-icons/fa';

const portfolioItems = [
  { src: '/placeholders/portfolio-1.png', alt: 'Portfólio 1' },
  { src: '/placeholders/portfolio-2.png', alt: 'Portfólio 2' },
  { src: '/placeholders/portfolio-3.png', alt: 'Portfólio 3' },
  { src: '/placeholders/portfolio-4.png', alt: 'Portfólio 4' },
];

const services = [
  { 
    title: 'Design de Loja Personalizado',
    description: 'Nossos designers criam temas exclusivos que refletem a identidade da sua marca, garantindo um visual único e profissional.',
    icon: <FaPaintBrush />,
  },
  { 
    title: 'Identidade Visual Completa',
    description: 'Criação de logo, paleta de cores, tipografia e manuais de marca para que sua loja tenha uma presença visual consistente.',
    icon: <FaStar />,
  },
  { 
    title: 'Otimização de UI/UX',
    description: 'Melhore a experiência do usuário e a navegação da sua loja para aumentar as conversões e reduzir o abandono de carrinho.',
    icon: <FaCheckCircle />,
  },
  { 
    title: 'Criação de Banners e Conteúdo',
    description: 'Produção de banners, imagens de produtos e outros elementos visuais para suas campanhas de marketing.',
    icon: <FaLaptopCode />,
  },
];

const howItWorks = [
  {
    title: '1. Descreva seu Projeto',
    description: 'Fale sobre a sua marca, objetivos e o que você precisa para o design da sua loja.',
  },
  {
    title: '2. Receba um Orçamento',
    description: 'Um de nossos parceiros fará uma proposta personalizada com base nas suas necessidades.',
  },
  {
    title: '3. Acompanhe a Criação',
    description: 'Trabalhe lado a lado com o designer, acompanhando o desenvolvimento do seu projeto.',
  },
  {
    title: '4. Sua Loja Top!',
    description: 'Após a aprovação, o novo design é aplicado e sua loja está pronta para vender.',
  },
];

function ParceirosDeDesignPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Design e Criação</span>
          <h1>Transforme a sua loja com design de alta qualidade</h1>
          <p className={styles.subtitle}>
            A identidade visual da sua marca é o seu primeiro contato com o cliente.
            Trabalhe com especialistas para criar uma loja que converte.
          </p>
          <Link href="#portfolio" className={styles.ctaButton}>
            Ver portfólio
          </Link>
        </div>
      </section>

      <section id="portfolio" className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Inspire-se com nosso portfólio</h2>
            <p>Conheça alguns dos trabalhos feitos por nossos parceiros.</p>
          </div>
          <div className={styles.portfolioGrid}>
            {portfolioItems.map((item) => (
              <div key={item.alt} className={styles.portfolioCard}>
                <Image src={item.src} alt={item.alt} width={600} height={400} className={styles.portfolioImage} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.servicesSection}`}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>O que nossos parceiros fazem</h2>
          </div>
          <div className={styles.servicesGrid}>
            {services.map((service) => (
              <div key={service.title} className={styles.serviceCard}>
                <div className={styles.serviceIcon}>{service.icon}</div>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Como funciona a contratação</h2>
            <p>Um processo simples, transparente e focado em resultados.</p>
          </div>
          <div className={styles.howItWorksGrid}>
            {howItWorks.map((step) => (
              <div key={step.title} className={styles.stepCard}>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.finalCtaSection}`}>
          <div className={styles.contentContainer}>
            <h2>Pronto para começar?</h2>
            <p className={styles.ctaSubtitle}>
              Conecte-se com os melhores designers do mercado e construa a loja dos seus sonhos.
            </p>
            <Link href="/parceiros/contratar" className={styles.ctaButton}>
              Quero um orçamento
            </Link>
          </div>
      </section>
    </main>
  );
}

export default ParceirosDeDesignPage;