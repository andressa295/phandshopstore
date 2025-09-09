'use client';

import React, { useRef, useEffect, useState } from 'react';
import styles from '../../page.module.css';

// Dados de exemplo com as suas lojas
const testimonialsData = [
  {
    id: 'mk-joias',
    name: 'MK JOIAS',
    text: 'A Phandshop transformou nossa loja! A personalização de temas é intuitiva e a plataforma é super rápida. Nossos clientes adoraram o novo visual e a navegação fácil!',
    image: '/images/mkjoias.jpeg',
  },
  {
    id: 'angel-aliancas',
    name: 'ANGEL ALIANÇAS',
    text: 'Finalmente uma plataforma que entende de e-commerce de verdade. Com a Phandshop, conseguimos criar uma loja virtual elegante e profissional, refletindo a qualidade dos nossos produtos.',
    image: '/images/angel.jpg',
  },
  {
    id: 'ana-modas',
    name: 'ANA MODAS',
    text: 'Estávamos procurando uma solução que fosse bonita e fácil de usar. A Phandshop superou todas as expectativas. O suporte é incrível e a experiência de customização é um diferencial enorme.',
    image: '/images/ana.png',
  },
  {
    id: 'ghetto-chique',
    name: 'GHETTO CHIQUE',
    text: 'A Phandshop deu vida à nossa marca. O visual dinâmico e o desempenho da loja fizeram toda a diferença nas nossas vendas. Recomendo para qualquer um que queira um e-commerce de alto nível.',
    image: '/images/ghetto.jpg',
  },
];

// Hook personalizado para a animação de "surgir ao rolar"
const useFadeInOnScroll = (
  threshold = 0.3
): [React.RefObject<HTMLDivElement | null>, boolean] => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { root: null, rootMargin: '0px', threshold }
    );

    const currentRef = ref.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [threshold]);

  return [ref, isVisible];
};

const TestimonialCard: React.FC<{ testimonial: typeof testimonialsData[0] }> = ({ testimonial }) => {
  const [ref, isVisible] = useFadeInOnScroll();

  return (
    <div
      ref={ref}
      className={`${styles.testimonialCard} ${styles.fadeIn} ${isVisible ? styles.isVisible : ''}`}
    >
      <div className={styles.testimonialCardHeader}>
        <div className={styles.testimonialCardImageWrapper}>
          <img
            src={testimonial.image}
            alt={`Foto de ${testimonial.name}`}
            className={styles.testimonialCardImage}
          />
        </div>
        <h3 className={styles.testimonialCardTitle}>{testimonial.name}</h3>
      </div>
      <p className={styles.testimonialCardText}>"{testimonial.text}"</p>
    </div>
  );
};

export const TestimonialsSection: React.FC = () => {
  return (
    <section className={styles.testimonialsSection}>
      <div className={styles.container}>
        <div className={styles.sectionHeader}>
          <h2 className="fontPlayfair"> O que nossos lojistas dizem</h2>
          <p className={styles.sectionSubtitle}>
            Veja a experiência real de quem já usa a Phandshop para impulsionar suas vendas.
          </p>
        </div>
        <div className={styles.testimonialsGrid}>
          {testimonialsData.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
