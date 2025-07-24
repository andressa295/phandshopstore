'use client';

import React from 'react';
import Image from 'next/image';
import styles from '../../page.module.css';
import { FaQuoteLeft } from 'react-icons/fa';

export function DepoimentosSection() {
  const depoimentos = [
    { 
      texto: "A plataforma é incrivelmente fácil de usar e o suporte é o mais rápido que já vi. Minhas vendas aumentaram 30%!", 
      autor: "Ana Souza", 
      loja: "Ana Acessórios",
      // --- MUDANÇA APLICADA (adicione a imagem nesta pasta) ---
      avatar: "/avatares/ana-souza.jpg" 
    },
    { 
      texto: "Finalmente encontrei uma plataforma sem comissão por venda. A liberdade e a economia fizeram toda a diferença.", 
      autor: "Bruno Carvalho", 
      loja: "Geek Point",
      // --- MUDANÇA APLICADA (adicione a imagem nesta pasta) ---
      avatar: "/avatares/bruno-carvalho.jpg"
    },
  ];

  return (
    <section className={styles.depoimentosSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.preTitle}>NOSSOS CLIENTES</span>
          <h2>Lojas que confiam e crescem com a gente</h2>
        </div>
        <div className={styles.depoimentosGrid}>
          {depoimentos.map((item, index) => (
            <div key={index} className={styles.depoimentoCard}>
              {/* --- MUDANÇA APLICADA --- */}
              <Image src={item.avatar} alt={`Foto de ${item.autor}`} width={60} height={60} className={styles.depoimentoAvatar} />
              <FaQuoteLeft className={styles.quoteIcon} />
              <p className={styles.depoimentoTexto}>"{item.texto}"</p>
              <p className={styles.depoimentoAutor}>{item.autor}, <span>{item.loja}</span></p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}