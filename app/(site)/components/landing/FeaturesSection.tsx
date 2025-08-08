// app/(site)/components/landing/FeaturesSection.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../page.module.css';
import { FaCheckCircle } from 'react-icons/fa';

export function FeaturesSection() {
  const funcionalidades = [
    { icon: <FaCheckCircle />, title: "Design Flexível", text: "Personalize temas ou crie o seu do zero para ter uma loja com a sua cara." },
    { icon: <FaCheckCircle />, title: "Checkout Otimizado", text: "Processo de compra rápido e seguro, projetado para não perder vendas." },
    { icon: <FaCheckCircle />, title: "Ferramentas de Marketing", text: "Crie cupons, promoções e integre com as principais redes sociais facilmente." },
    { icon: <FaCheckCircle />, title: "Gestão Simplificada", text: "Controle pedidos, clientes e estoque em um painel intuitivo e poderoso." }
  ];

  const logosIntegracoes = [
    { src: "/logos/mercado-pago.png", alt: "Mercado Pago", width: 140, height: 40 },
    { src: "/logos/correios.png", alt: "Correios", width: 120, height: 40 },
    { src: "/logos/melhor-envio.png", alt: "Melhor Envio", width: 130, height: 40 },
    { src: "/logos/instagram.png", alt: "Instagram", width: 120, height: 40 },
    { src: "/logos/google.png", alt: "Google", width: 100, height: 35 },
  ];

  const [currentLogoIndex, setCurrentLogoIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentLogoIndex((prevIndex) => (prevIndex + 1) % logosIntegracoes.length);
    }, 2000);

    return () => clearInterval(intervalId);
  }, [logosIntegracoes.length]);

  return (
    <section className={styles.featuresSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.preTitle}>FERRAMENTAS</span>
          <h2>Uma plataforma, inúmeras possibilidades</h2>
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
            {logosIntegracoes.map((logo, index) => (
              <div
                key={logo.alt}
                className={`${styles.logoWrapper} ${index === currentLogoIndex ? styles.active : ''}`}
                style={{
                  opacity: index === currentLogoIndex ? 1 : 0,
                  visibility: index === currentLogoIndex ? 'visible' : 'hidden',
                }}
              >
                <Image
                  src={logo.src}
                  alt={logo.alt}
                  width={logo.width}
                  height={logo.height}
                  className={styles.logoImage}
                  style={{ objectFit: 'contain' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}