'use client';

import React from 'react';
import styles from '../../page.module.css'; 
import { FaGem, FaBolt, FaHeadset } from 'react-icons/fa';

export function DiferenciaisSection() {
  const diferenciais = [
    { icon: <FaGem size={28} />, title: 'Taxa 0% por Venda', description: 'Venda sem se preocupar com comissões sobre suas vendas. Seu lucro é 100% seu.' },
    { icon: <FaBolt size={28} />, title: 'Alta Performance', description: 'Sua loja carrega em um piscar de olhos, garantindo uma experiência rápida e que não perde vendas.' },
    { icon: <FaHeadset size={28} />, title: 'Suporte que Resolve', description: 'Converse com pessoas de verdade, prontas para te ajudar a resolver qualquer problema em tempo recorde.' }
  ];

  return (
    <section className={styles.diferenciaisSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.preTitle}>POR QUE A PHANDSHOP?</span>
          <h2>A plataforma completa para o seu sucesso</h2>
        </div>
        <div className={styles.diferenciaisGrid}>
          {diferenciais.map((item) => (
            <div key={item.title} className={styles.diferencialCard}>
              <div className={styles.iconWrapper}>{item.icon}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}