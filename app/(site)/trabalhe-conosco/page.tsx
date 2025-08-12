// app/(site)/trabalhe-conosco/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './TrabalheConosco.module.css';
import { FaLaptopCode, FaBriefcase, FaUsers, FaArrowRight } from 'react-icons/fa';

const vagas = [
  {
    id: 'desenvolvedor-fullstack',
    title: 'Desenvolvedor(a) Full Stack',
    area: 'Tecnologia',
    descricao: 'Procuramos um(a) Desenvolvedor(a) Full Stack para atuar na construção e manutenção da nossa plataforma de e-commerce.',
  },
  {
    id: 'ux-ui-designer',
    title: 'UX/UI Designer',
    area: 'Produto',
    descricao: 'Buscamos um designer para criar interfaces intuitivas e elegantes, focando na experiência do usuário de nossos lojistas e clientes.',
  },
  {
    id: 'especialista-marketing',
    title: 'Especialista em Marketing',
    area: 'Marketing',
    descricao: 'Profissional de marketing para planejar e executar campanhas, gerenciar mídias sociais e analisar resultados para expandir nossa marca.',
  },
];

export default function TrabalheConoscoPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Junte-se ao time</span>
          <h1 className={styles.heroTitle}>Sua próxima grande carreira começa aqui</h1>
          <p className={styles.heroSubtitle}>
            A Phandshop é mais do que uma plataforma; é uma comunidade de pessoas apaixonadas por e-commerce.
            Trabalhe com a gente para criar a melhor solução do mercado.
          </p>
          <Link href="#vagas" className={styles.ctaButton}>
            Ver vagas em aberto
          </Link>
        </div>
      </section>

      <section id="vagas" className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Vagas em aberto</h2>
            <p>Conheça as oportunidades para fazer parte do nosso time de tecnologia.</p>
          </div>
          <div className={styles.vagasGrid}>
            {vagas.map((vaga) => (
              <div key={vaga.title} className={styles.vagaCard}>
                <div className={styles.vagaHeader}>
                  <h3>{vaga.title}</h3>
                  <span className={styles.vagaArea}>{vaga.area}</span>
                </div>
                <p className={styles.vagaDescricao}>{vaga.descricao}</p>
                <Link href="/trabalhe-conosco/servico" className={styles.ctaButton}>
                  Candidatar-se agora <FaArrowRight />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <section className={`${styles.section} ${styles.valoresSection}`}>
          <div className={styles.contentContainer}>
            <div className={styles.sectionHeader}>
              <h2>Nossa cultura e valores</h2>
            </div>
            <div className={styles.valoresGrid}>
              <div className={styles.valorCard}>
                <FaBriefcase size={40} className={styles.valorIcon} />
                <h3>Profissionalismo</h3>
                <p>Valorizamos a excelência e a dedicação em cada projeto.</p>
              </div>
              <div className={styles.valorCard}>
                <FaUsers size={40} className={styles.valorIcon} />
                <h3>Colaboração</h3>
                <p>Trabalhamos juntos para resolver problemas e inovar.</p>
              </div>
              <div className={styles.valorCard}>
                <FaLaptopCode size={40} className={styles.valorIcon} />
                <h3>Inovação</h3>
                <p>Estamos sempre buscando novas tecnologias e soluções criativas.</p>
              </div>
            </div>
          </div>
      </section>
    </main>
  );
}