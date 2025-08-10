// app/(site)/components/landing/FeaturesSection.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../../page.module.css';
import { FaPaintBrush, FaCreditCard, FaBullhorn, FaTools } from 'react-icons/fa';

export function FeaturesSection() {
  const funcionalidades = [
    { icon: <FaPaintBrush />, title: "Design Flexível", text: "Personalize temas ou crie o seu do zero para ter uma loja com a sua cara." },
    { icon: <FaCreditCard />, title: "Checkout Otimizado", text: "Processo de compra rápido e seguro, projetado para não perder vendas." },
    { icon: <FaBullhorn />, title: "Ferramentas de Marketing", text: "Crie cupons, promoções e integre com as principais redes sociais facilmente." },
    { icon: <FaTools />, title: "Gestão Simplificada", text: "Controle pedidos, clientes e estoque em um painel intuitivo e poderoso." }
  ];

  const logosIntegracoes = [
    { src: "/logos/mercado-pago.png", alt: "Mercado Pago", width: 140, height: 40 },
    { src: "/logos/correios.png", alt: "Correios", width: 120, height: 40 },
    { src: "/logos/melhor-envio.png", alt: "Melhor Envio", width: 130, height: 40 },
    { src: "/logos/instagram.png", alt: "Instagram", width: 120, height: 40 },
    { src: "/logos/google.png", alt: "Google", width: 100, height: 35 },
    
  ];
  
  // Duplicando os logos para garantir a animação de letreiro infinita
  const infiniteLogos = [...logosIntegracoes, ...logosIntegracoes];

  return (
    <section className={styles.featuresSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.preTitle}>FERRAMENTAS</span>
          <h2>Uma plataforma, <div className="fontPlayfair">inúmeras possibilidades</div></h2>
        </div>
        <div className={styles.featuresGrid}>
          {funcionalidades.map((item) => (
            <div key={item.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>{item.icon}</div>
              <div>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.integrationsWrapper}>
          <h4 className={styles.integrationsTitle}>Integre com as ferramentas que você já ama</h4>
          <div className={styles.logosContainer}>
            <div className={styles.logosMarquee}>
              {infiniteLogos.map((logo, index) => (
                <Image
                  key={index} // Usamos o index pois temos logos duplicados
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={styles.logoImage}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}