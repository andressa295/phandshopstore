// app/(site)/components/landing/TemasSection.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from '../../page.module.css';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Link from 'next/link';

const themeImages = [
  { src: '/teste1.png', alt: 'Tema de Loja 1' },
  { src: '/teste2.png', alt: 'Tema de Loja 2' },
  { src: '/teste3.png', alt: 'Tema de Loja 3' },
  { src: '/teste4.png', alt: 'Tema de Loja 4' },
];

export function TemasSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const totalSlides = themeImages.length;
  const autoSlideInterval = 5000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, autoSlideInterval);
    return () => clearInterval(interval);
  }, [totalSlides]);

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  return (
    <section className={styles.temasSection}>
      <div className={styles.contentContainer}>
        <div className="fontPlayfair" style={{ color: 'white' }}>
        <h2 className={styles.galleryTitle}>Seu sucesso, sua vitrine</h2></div>
        <p className={styles.gallerySubtitle}>
          Escolha entre dezenas de temas modernos e responsivos,
          ou personalize um para refletir a sua marca.
        </p>

        <div className={styles.carouselWrapper}>
          <button className={`${styles.navButton} ${styles.left}`} onClick={goToPrevSlide}>
            <FaChevronLeft />
          </button>
          <div className={styles.carousel}>
            {themeImages.map((image, index) => {
              let positionClass = '';
              if (index === currentSlide) {
                positionClass = styles.activeSlide;
              } else if (index === (currentSlide + 1) % totalSlides) {
                positionClass = styles.nextSlide;
              } else if (index === (currentSlide - 1 + totalSlides) % totalSlides) {
                positionClass = styles.prevSlide;
              } else {
                positionClass = styles.hiddenSlide;
              }

              return (
                <div key={image.alt} className={`${styles.slide} ${positionClass}`}>
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={800}
                    height={600}
                    quality={100}
                    className={styles.themeImage}
                  />
                </div>
              );
            })}
          </div>
          <button className={`${styles.navButton} ${styles.right}`} onClick={goToNextSlide}>
            <FaChevronRight />
          </button>
        </div>

        <Link href="#" className={styles.ctaButton}>
          Ver a loja de temas
        </Link>
      </div>
    </section>
  );
}