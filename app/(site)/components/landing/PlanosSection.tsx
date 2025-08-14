'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import styles from '../../page.module.css';
import { FaFreeCodeCamp, FaDollarSign, FaStar, FaRocket, FaCrown } from 'react-icons/fa';

const planosData = [
  {
    nome: "Grátis",
    icone: <FaFreeCodeCamp />,
    preco: "R$ 0,00",
    descricao: "Para quem quer começar a testar sua ideia sem custo.",
    tagline: "Para quem está começando",
    cta: "Começar agora",
    planoKey: 'plano_gratis',
    destaque: false,
    precos: { mensal: "R$ 0,00", anual: "R$ 0,00" },
    precosPorMesAnual: "R$ 0,00",
  },
  {
    nome: "Básico",
    icone: <FaDollarSign />,
    preco: "R$ 69,90",
    descricao: "O essencial para quem quer crescer e vender mais.",
    tagline: "Para quem está decolando",
    cta: "Assinar",
    planoKey: 'plano_basico',
    destaque: false,
    precos: { mensal: "R$ 69,90", anual: "R$ 699,00" },
    precosPorMesAnual: "R$ 58,25",
  },
  {
    nome: "Essencial",
    icone: <FaStar />,
    preco: "R$ 99,90",
    descricao: "Para quem já tem um negócio e precisa de mais ferramentas.",
    tagline: "Para negócios em crescimento",
    cta: "Assinar",
    planoKey: 'plano_essencial',
    destaque: true,
    precos: { mensal: "R$ 99,90", anual: "R$ 999,00" },
    precosPorMesAnual: "R$ 83,25",
  },
  {
    nome: "Profissional",
    icone: <FaRocket />,
    preco: "R$ 149,90",
    descricao: "Para quem busca alta performance.",
    tagline: "Para quem já é grande",
    cta: "Assinar",
    planoKey: 'plano_profissional',
    destaque: false,
    precos: { mensal: "R$ 149,90", anual: "R$ 1.499,00" },
    precosPorMesAnual: "R$ 124,92",
  },
  {
    nome: "Premium",
    icone: <FaCrown />,
    preco: "R$ 249,90",
    descricao: "Para grandes volumes de venda.",
    tagline: "O máximo do e-commerce",
    cta: "Assinar",
    planoKey: 'plano_premium',
    destaque: false,
    precos: { mensal: "R$ 249,90", anual: "R$ 2.499,00" },
    precosPorMesAnual: "R$ 208,25",
  },
];

export function PlanosSection() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isAnnual, setIsAnnual] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);

  const handleScroll = () => {
    if (carouselRef.current) {
      const scrollPosition = carouselRef.current.scrollLeft;
      const cardWidth = carouselRef.current.children[0].clientWidth + 16;
      const newActiveSlide = Math.round(scrollPosition / cardWidth);
      setActiveSlide(newActiveSlide);
    }
  };

  useEffect(() => {
    const element = carouselRef.current;
    if (element) {
      element.addEventListener('scroll', handleScroll);
      return () => {
        element.removeEventListener('scroll', handleScroll);
      };
    }
  }, []);

  return (
    <section className={styles.pricingSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionHeader}style={{ color: 'white' }}>Um plano completo e sem surpresas</h2>
          
        </div>
        
        <div className={styles.toggleWrapper}>
          <div className={styles.pricingToggle}>
            <button
              onClick={() => setIsAnnual(false)}
              className={`${styles.toggleButton} ${!isAnnual ? styles.activeToggle : ''}`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`${styles.toggleButton} ${isAnnual ? styles.activeToggle : ''}`}
            >
              Anual <span className={styles.badge}>16% OFF</span>
            </button>
          </div>
        </div>

        {/* Desktop: Grid de Cards */}
        <div className={styles.plansGrid}>
          {planosData.map((plano) => (
            <div key={plano.nome} className={`${styles.planCard} ${plano.destaque ? styles.recommendedCard : ''}`}>
              {plano.destaque && <span className={styles.recommendedBadge}>Recomendado</span>}
              <div className={styles.cardHeader}>
                <div className={styles.cardIcon}>{plano.icone}</div>
                <h3 className={styles.cardTitle}>{plano.nome}</h3>
              </div>
              <p className={styles.cardTagline}>{plano.tagline}</p>
              <div className={styles.cardPricing}>
                <div className={styles.priceContainer}>
                  <span className={styles.price}>
                    {isAnnual && plano.precosPorMesAnual ? plano.precosPorMesAnual : plano.precos.mensal}
                  </span>
                  <span className={styles.periodo}>/mês</span>
                </div>
                {isAnnual && (
                  <div className={styles.yearlyInfo}>
                    <span className={styles.yearlyPrice}>{plano.precos.anual}</span>
                    <span className={styles.yearlyPeriodo}>por ano</span>
                  </div>
                )}
              </div>
              <p className={styles.cardDescription}>{plano.descricao}</p>
              <Link href={`/cadastro?plano=${plano.planoKey}&recorrencia=${isAnnual ? 'anual' : 'mensal'}`} className={styles.ctaButton}>
                {plano.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Mobile: Carrossel de Cards */}
        <div className={styles.plansCarouselWrapper}>
          <div className={styles.plansCarousel} ref={carouselRef}>
            {planosData.map((plano) => (
              <div key={plano.nome} className={`${styles.planCard} ${plano.destaque ? styles.recommendedCard : ''}`}>
                {plano.destaque && <span className={styles.recommendedBadge}>Recomendado</span>}
                <div className={styles.cardHeader}>
                  <div className={styles.cardIcon}>{plano.icone}</div>
                  <h3 className={styles.cardTitle}>{plano.nome}</h3>
                </div>
                <p className={styles.cardTagline}>{plano.tagline}</p>
                <div className={styles.cardPricing}>
                  <div className={styles.priceContainer}>
                    <span className={styles.price}>
                      {isAnnual && plano.precosPorMesAnual ? plano.precosPorMesAnual : plano.precos.mensal}
                    </span>
                    <span className={styles.periodo}>/mês</span>
                  </div>
                  {isAnnual && (
                    <div className={styles.yearlyInfo}>
                      <span className={styles.yearlyPrice}>{plano.precos.anual}</span>
                      <span className={styles.yearlyPeriodo}>por ano</span>
                    </div>
                  )}
                </div>
                <p className={styles.cardDescription}>{plano.descricao}</p>
                <Link href={`/cadastro?plano=${plano.planoKey}&recorrencia=${isAnnual ? 'anual' : 'mensal'}`} className={styles.ctaButton}>
                  {plano.cta}
                </Link>
              </div>
            ))}
          </div>
          <div className={styles.carouselPagination}>
            {planosData.map((_, index) => (
              <span
                key={index}
                className={`${styles.paginationDot} ${index === activeSlide ? styles.activeDot : ''}`}
                onClick={() => {
                  if (carouselRef.current) {
                    const cardWidth = carouselRef.current.children[0].clientWidth + 16;
                    carouselRef.current.scrollTo({ left: cardWidth * index, behavior: 'smooth' });
                  }
                }}
              ></span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}