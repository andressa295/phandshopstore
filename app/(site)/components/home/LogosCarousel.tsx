'use client';
import React from 'react';
import Image from 'next/image';
// Imports do Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
// Importe os estilos do Swiper e do nosso módulo
import 'swiper/css';
import 'swiper/css/pagination';
import styles from './LogosCarousel.module.css';

const logosIntegracoes = [
  { src: "/logos/mercado-pago.svg", alt: "Mercado Pago", width: 140, height: 40 },
  { src: "/logos/correios.svg", alt: "Correios", width: 120, height: 40 },
  { src: "/logos/melhor-envio.svg", alt: "Melhor Envio", width: 150, height: 40 },
  { src: "/logos/instagram.svg", alt: "Instagram", width: 110, height: 40 },
  { src: "/logos/google.svg", alt: "Google", width: 100, height: 40 },
  // Adicione mais logos aqui se precisar
];

export function LogosCarousel() {
  return (
    <div className={styles.carouselWrapper}>
      <Swiper
        modules={[Pagination]}
        spaceBetween={50} // Espaço entre os slides
        slidesPerView={2} // Quantos logos aparecem de uma vez no mobile
        pagination={{ 
          clickable: true,
          el: `.${styles.paginationContainer}`, // Usa nosso container customizado para os pontinhos
        }}
        breakpoints={{
          // Em telas com 768px ou mais
          768: {
            slidesPerView: 3,
            spaceBetween: 60,
          },
          // Em telas com 1024px ou mais
          1024: {
            slidesPerView: 5,
            spaceBetween: 80,
          },
        }}
      >
        {logosIntegracoes.map((logo) => (
          <SwiperSlide key={logo.alt} className={styles.slide}>
            <Image
              src={logo.src}
              alt={logo.alt}
              width={logo.width}
              height={logo.height}
              className={styles.logoImage}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Container customizado para os pontinhos, para podermos estilizá-los */}
      <div className={styles.paginationContainer}></div>
    </div>
  );
}