// app/(site)/parceiros/seja-um-parceiro/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaMoneyBillAlt, FaHandshake, FaBullhorn, FaCode, FaPaintBrush, FaCheckCircle, FaStar, FaBook, FaArrowRight } from 'react-icons/fa';
import styles from './Parceiros.module.css';

export default function SejaParceiroPage() {
  const partnerTypes = [
    {
      title: "Parceiro Designer",
      description: "Crie temas e layouts únicos para nossos lojistas, com acesso a ferramentas exclusivas.",
      icon: <FaPaintBrush />,
      path: "/seja-um-parceiro/parceiros/temas",
    },
    {
      title: "Parceiro Tecnológico",
      description: "Desenvolva aplicativos e integrações para nossa plataforma, alcançando milhares de lojistas.",
      icon: <FaCode />,
      path: "/seja-um-parceiro/tecnologicos",
    },
    {
      title: "Parceiro Afiliado",
      description: "Divulgue a Phandshop e ganhe comissões recorrentes por cada nova loja ativa.",
      icon: <FaBullhorn />,
      path: "/seja-um-parceiro/criadores",
    },
    {
      title: "Parceiro de Conteúdo",
      description: "Crie conteúdo e tutoriais, ajudando a nossa comunidade a crescer.",
      icon: <FaBook />,
      path: "/seja-um-parceiro/conteudos",
    }
  ];

  return (
    <div className={styles.container}>
      {/* Banner de Boas-Vindas */}
      <section className={styles.heroSection}>
        {/* Espaço para o seu banner */}
        <div className={styles.heroImagePlaceholder}>
          <Image
            src="/placeholder-banner-desktop.jpg"
            alt="Seja um Parceiro Phandshop"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className={styles.desktopBanner}
          />
          <Image
            src="/placeholder-banner-mobile.jpg"
            alt="Seja um Parceiro Phandshop Mobile"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className={styles.mobileBanner}
          />
        </div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Seja um Parceiro Phandshop</h1>
          <p className={styles.heroSubtitle}>
            Aumente sua renda, ajude empreendedores e faça parte da nossa comunidade.
          </p>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className={styles.benefitsSection}>
        <div className={styles.sectionHeader}>
          <FaCheckCircle size={40} className={styles.headerIcon} />
          <h2 className={styles.headerTitle}>Por que ser um Parceiro Phandshop?</h2>
        </div>
        <div className={styles.benefitsGrid}>
          <div className={styles.benefitCard}>
            <FaMoneyBillAlt size={30} className={styles.benefitIcon} />
            <h3 className={styles.benefitTitle}>Ganhos Recorrentes</h3>
            <p className={styles.benefitText}>
              Receba comissões mensais por cada cliente que você trouxer para a plataforma.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <FaStar size={30} className={styles.benefitIcon} />
            <h3 className={styles.benefitTitle}>Visibilidade e Reconhecimento</h3>
            <p className={styles.benefitText}>
              Destaque-se no nosso diretório e receba indicações de clientes em busca de especialistas.
            </p>
          </div>
          <div className={styles.benefitCard}>
            <FaHandshake size={30} className={styles.benefitIcon} />
            <h3 className={styles.benefitTitle}>Suporte e Ferramentas</h3>
            <p className={styles.benefitText}>
              Conte com um time de suporte dedicado e acesse ferramentas exclusivas para parceiros.
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Tipos de Parceria */}
      <section className={styles.partnerTypesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.headerTitle}>Encontre a parceria ideal para você</h2>
          <p className={styles.headerSubtitle}>
            Temos uma comunidade diversa de parceiros. Qual delas é a sua cara?
          </p>
        </div>
        <div className={styles.typesGrid}>
          {partnerTypes.map((type) => (
            <Link key={type.title} href={type.path} className={styles.typeCard}>
              <div className={styles.typeIcon}>{type.icon}</div>
              <h3 className={styles.typeTitle}>{type.title}</h3>
              <p className={styles.typeDescription}>{type.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Seção de CTA */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Pronta para se juntar à nossa comunidade?</h2>
        <p className={styles.ctaSubtitle}>
          Cadastre-se hoje e comece a criar e monetizar com a Phandshop.
        </p>
        <Link href="#" className={styles.ctaButton}>
          Quero ser parceiro <FaArrowRight />
        </Link>
      </section>
    </div>
  );
}