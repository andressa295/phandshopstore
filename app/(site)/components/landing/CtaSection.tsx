'use client';

import React from 'react';
import Link from 'next/link';
import styles from '../../page.module.css';

export function CtaSection() {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <h2>Pronto para vender para todo o Brasil?</h2>
          <p>Crie sua loja virtual em poucos minutos. Sem cartão de crédito e sem compromisso.</p>
          <Link href="/cadastro" className={styles.heroButtonPrimary}>Começar gratuitamente agora</Link>
        </div>
      </div>
    </section>
  );
}