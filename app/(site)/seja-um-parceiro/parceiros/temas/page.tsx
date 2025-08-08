'use client'

import React from 'react'
import Link from 'next/link'
import { FaPaintBrush, FaCode, FaRocket, FaDollarSign } from 'react-icons/fa'
import styles from './Temas.module.css'

const steps = [
  {
    icon: <FaPaintBrush />,
    title: '1. Leia as Diretrizes',
    text: 'Entenda nossos padrões de qualidade e design para criar temas que vendem.'
  },
  {
    icon: <FaCode />,
    title: '2. Desenvolva seu Tema',
    text: 'Use suas habilidades para criar um tema bonito, rápido e responsivo.'
  },
  {
    icon: <FaRocket />,
    title: '3. Envie para Revisão',
    text: 'Submeta seu tema pelo nosso painel de parceiros para avaliação da equipe.'
  },
  {
    icon: <FaDollarSign />,
    title: '4. Comece a Lucrar',
    text: 'Após aprovado, seu tema entra na loja e você ganha a cada venda.'
  }
]

export default function ParceirosDeTemasPage() {
  return (
    <main className={styles.pageWrapper}>
      
      {/* HERO */}
      <section className={`${styles.section} ${styles.heroSection}`}>
        <div className={styles.contentContainer}>
          <span className={styles.preTitle}>Parceiros de Temas</span>
          <h1>Transforme seu talento em uma fonte de renda</h1>
          <p className={styles.subtitle}>
            Crie temas para a Phandshop e coloque seu trabalho na frente de milhares de lojistas
            apaixonados, prontos para comprar.
          </p>
          <Link href="/diretrizes" className={styles.ctaButton}>
            Ver Diretrizes de Design
          </Link>
        </div>
      </section>

      {/* STEPS */}
      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Seu caminho para o sucesso</h2>
            <p>Tornar-se um vendedor de temas na Phandshop é simples e transparente.</p>
          </div>
          <div className={styles.stepsGrid}>
            {steps.map(({ icon, title, text }) => (
              <div key={title} className={styles.stepCard}>
                <div className={styles.stepIcon}>{icon}</div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={`${styles.section} ${styles.finalCtaSection}`}>
        <div className={styles.contentContainer}>
          <h2>Pronto para começar?</h2>
          <p className={styles.subtitle}>
            Junte-se à nossa comunidade de criadores e ajude a moldar a aparência do e-commerce no Brasil.
          </p>
          <Link href="/seja-um-parceiro/parceiros/cadastro" className={styles.ctaButton}>
            Quero ser um parceiro
          </Link>
        </div>
      </section>
      
    </main>
  )
}
