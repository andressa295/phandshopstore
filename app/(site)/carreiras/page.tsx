'use client';

import React from 'react';
import Link from 'next/link';
import styles from './TrabalheConosco.module.css'; 
import { FaPalette, FaCode, FaBuilding, FaUsers, FaCoins, FaHeadset } from 'react-icons/fa';

const beneficios = [
  { icon: <FaUsers />, title: 'Alcance Milhares de Lojistas', text: 'Nossa base de clientes é o seu público. Você cria, nós te ajudamos a alcançar.' },
  { icon: <FaCoins />, title: 'Modelo de Receita Justo', text: 'Ganhe com cada venda de tema ou assinatura de app. Oferecemos comissões claras.' },
  { icon: <FaHeadset />, title: 'Suporte Dedicado a Parceiros', text: 'Você não está sozinho. Oferecemos documentação e um canal de suporte exclusivo.' },
];

const vagas = [
  { area: 'Engenharia', titulo: 'Desenvolvedor(a) Full-Stack Pleno (React/Node.js)', local: 'Remoto' },
  { area: 'Suporte', titulo: 'Especialista em Sucesso do Cliente (E-commerce)', local: 'Remoto' },
];

function CarreirasPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <h1>Faça parte do futuro do e-commerce</h1>
          <p className={styles.subtitle}>A Phandshop é um ecossistema aberto para criadores. Se você é designer, desenvolvedor ou busca uma carreira em tecnologia, encontre seu lugar aqui.</p>
          <div className={styles.cardGrid}>
            <Link href="#designers" className={styles.card}>
              <FaPalette className={styles.cardIcon} />
              <h2>Para Designers</h2>
              <p>Crie e venda temas incríveis para milhares de lojistas em nossa Theme Store.</p>
              <span>Saiba Mais &darr;</span>
            </Link>
            <Link href="#desenvolvedores" className={styles.card}>
              <FaCode className={styles.cardIcon} />
              <h2>Para Desenvolvedores</h2>
              <p>Desenvolva aplicativos e integrações para a nossa App Store usando nossa API.</p>
              <span>Saiba Mais &darr;</span>
            </Link>
            <Link href="#vagas" className={styles.card}>
              <FaBuilding className={styles.cardIcon} />
              <h2>Vagas na Equipe</h2>
              <p>Quer nos ajudar a construir a melhor plataforma de e-commerce? Veja nossas vagas.</p>
              <span>Saiba Mais &darr;</span>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Por que ser um Parceiro Phandshop?</h2>
          </div>
          <div className={styles.beneficiosGrid}>
            {beneficios.map(item => (
              <div key={item.title} className={styles.beneficioCard}>
                <div className={styles.beneficioIcon}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="designers" className={`${styles.section} ${styles.detailsSection}`}>
        <div className={styles.contentContainer}>
          <h2>O Caminho para Vender Temas</h2>
          <p className={styles.subtitle}>Transforme sua criatividade em uma fonte de renda contínua.</p>
          <Link href="/parceiros/temas" className={styles.ctaButton}>Ver Diretrizes de Design</Link>
        </div>
      </section>
      
      <section id="desenvolvedores" className={`${styles.section} ${styles.detailsSection} ${styles.darkSection}`}>
        <div className={styles.contentContainer}>
          <h2>Construa Apps para a Nossa App Store</h2>
          <p className={styles.subtitle}>Resolva problemas reais dos lojistas e crie um negócio de sucesso com nossa API.</p>
          <Link href="/desenvolvedores" className={styles.ctaButton}>Acessar Documentação da API</Link>
        </div>
      </section>

      <section id="vagas" className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Carreiras na Phandshop</h2>
            <p className={styles.subtitle}>Estamos construindo uma equipe diversa e apaixonada por e-commerce. Venha crescer com a gente!</p>
          </div>
          <div className={styles.vagasContainer}>
            {vagas.length > 0 ? (
              vagas.map(vaga => (
                <div key={vaga.titulo} className={styles.vagaCard}>
                  <div>
                    <span className={styles.vagaArea}>{vaga.area}</span>
                    <h3>{vaga.titulo}</h3>
                    <p>{vaga.local}</p>
                  </div>
                  <span className={styles.vagaLink}>Ver Detalhes &rarr;</span>
                </div>
              ))
            ) : (
              <p>Não temos vagas abertas no momento, mas estamos sempre de olho em novos talentos. Envie seu currículo para nosso banco!</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default CarreirasPage;