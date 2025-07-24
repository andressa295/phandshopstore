'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../../page.module.css';

export function PlanosSection() {
  return (
    <section className={styles.planosSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2 style={{ color: 'white' }}>Um plano completo e sem surpresas</h2>
          <p className={styles.planosSubtitle}>Acesse todas as ferramentas para escalar seu negócio com um preço justo e transparente.</p>
          <Link href="/planos" className={styles.planosBotao}>
            Conheça Nossos Planos
          </Link>
        </div>
      </div>
    </section>
  );
}