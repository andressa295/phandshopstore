// app/(site)/parceiros/diretorio/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Diretorio.module.css';
import { FaLaptopCode, FaPaintBrush, FaBullhorn, FaCheckCircle, FaRocket, FaShoppingCart, FaSearch, FaCamera, FaEnvelopeOpenText, FaChartLine, FaBook } from 'react-icons/fa';

const parceirosFicticios = [
  {
    nome: "Andressa Silva",
    foto: "/placeholders/andressa.jpg",
    especialidade: "Designer de Temas",
    descricao: "Especialista em design de UI/UX, criando interfaces elegantes e intuitivas para e-commerce.",
    icon: <FaPaintBrush />,
  },
  {
    nome: "Lucas Pereira",
    foto: "/placeholders/lucas.jpg",
    especialidade: "Desenvolvimento e Integrações",
    descricao: "Desenvolvedor Full Stack focado em integrações de API para conectar sua loja a serviços externos.",
    icon: <FaLaptopCode />,
  },
  {
    nome: "Maria Oliveira",
    foto: "/placeholders/maria.jpg",
    especialidade: "Consultora de SEO",
    descricao: "Consultora experiente em otimizar lojas virtuais para os mecanismos de busca, gerando mais tráfego.",
    icon: <FaBullhorn />,
  },
  {
    nome: "João Victor",
    foto: "/placeholders/joao.jpg",
    especialidade: "Configuração de Loja",
    descricao: "Profissional certificado em configurar lojas na plataforma, deixando tudo pronto para o lançamento.",
    icon: <FaCheckCircle />,
  },
  {
    nome: "Fernanda Costa",
    foto: "/placeholders/fernanda.jpg",
    especialidade: "Especialista em E-mail Marketing",
    descricao: "Criação e gestão de campanhas de e-mail marketing que engajam e aumentam a conversão de vendas.",
    icon: <FaEnvelopeOpenText />,
  },
  {
    nome: "Ricardo Souza",
    foto: "/placeholders/ricardo.jpg",
    especialidade: "Consultor de E-commerce",
    descricao: "Ajuda lojistas a planejar e executar estratégias de crescimento e otimizar processos.",
    icon: <FaChartLine />,
  },
  {
    nome: "Juliana Santos",
    foto: "/placeholders/juliana.jpg",
    especialidade: "Especialista em Anúncios",
    descricao: "Especialista em tráfego pago, criando campanhas de sucesso em Google Ads e Meta Ads para gerar resultados.",
    icon: <FaRocket />,
  },
  {
    nome: "Bruno Almeida",
    foto: "/placeholders/bruno.jpg",
    especialidade: "Auditor de Loja",
    descricao: "Análise completa de usabilidade, design, performance e SEO para identificar oportunidades de melhoria.",
    icon: <FaSearch />,
  },
  {
    nome: "Patrícia Lima",
    foto: "/placeholders/patricia.jpg",
    especialidade: "Desenvolvimento de Apps",
    descricao: "Desenvolvedora de aplicativos que ampliam as funcionalidades da sua loja e melhoram a experiência do cliente.",
    icon: <FaShoppingCart />,
  },
  {
    nome: "Pedro Mendes",
    foto: "/placeholders/pedro.jpg",
    especialidade: "Migração de Loja",
    descricao: "Profissional em migrar lojas de outras plataformas para a Phandshop de forma segura e sem perder dados.",
    icon: <FaCheckCircle />,
  },
  {
    nome: "Camila Rocha",
    foto: "/placeholders/camila.jpg",
    especialidade: "Especialista em Conteúdo",
    descricao: "Criação de artigos e tutoriais que educam e engajam a audiência, fortalecendo a presença online.",
    icon: <FaBook />,
  },
  {
    nome: "Rafael Gomes",
    foto: "/placeholders/rafael.jpg",
    especialidade: "Especialista em UI/UX",
    descricao: "Designer focado em otimização de interface para aumentar a conversão e melhorar a experiência de compra.",
    icon: <FaPaintBrush />,
  },
];

export default function DiretorioParceirosPage() {
  return (
    <main className={styles.pageWrapper}>
      {/* Banner de Boas-Vindas */}
      <section className={`${styles.section} ${styles.bannerSection}`}>
        {/* Espaço para o seu banner */}
        <div className={styles.bannerPlaceholder}>
          {/* Adicione sua imagem de banner para desktop e mobile aqui */}
        </div>
        <div className={styles.bannerContent}>
          <h1 className={styles.bannerTitle}>Diretório de Parceiros</h1>
          <p className={styles.bannerSubtitle}>
            Encontre o especialista ideal para ajudar no crescimento do seu negócio.
          </p>
        </div>
      </section>

      {/* Seção de Parceiros */}
      <section className={styles.partnersSection}>
        <div className={styles.contentContainer}>
          <div className={styles.partnersGrid}>
            {parceirosFicticios.map((parceiro) => (
              <Link key={parceiro.nome} href="#" className={styles.partnerCard}>
                <div className={styles.partnerIcon}>{parceiro.icon}</div>
                <h3 className={styles.partnerName}>{parceiro.nome}</h3>
                <p className={styles.partnerSpecialty}>{parceiro.especialidade}</p>
                <p className={styles.partnerDescription}>{parceiro.descricao}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Seção de CTA */}
      <section className={`${styles.section} ${styles.ctaSection}`}>
          <div className={styles.contentContainer}>
            <h2>Não encontrou o que procurava?</h2>
            <p className={styles.ctaSubtitle}>
              Entre em contato conosco e encontraremos o parceiro ideal para você.
            </p>
            <Link href="/contato" className={styles.ctaButton}>
              Fale conosco
            </Link>
          </div>
      </section>
    </main>
  );
}