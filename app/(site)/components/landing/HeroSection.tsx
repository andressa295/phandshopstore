'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../../page.module.css';

export function HeroSection() {
  return (
    <section className={styles.heroSection}>
      <div className={styles.contentContainer}>
        <div className={styles.heroGrid}>
          <div>
            <h1 className={styles.heroTitle}>Sua loja online, completa e <div className="fontPlayfair">sem limites.</div></h1>
            <p className={styles.heroSubtitle}>Crie sua loja com temas personalizáveis e ferramentas de marketing. Taxa de comissão por venda: <strong>0%</strong>. Sempre.</p>
            <div className={styles.heroActions}>
              <Link href="/cadastro" className={styles.heroButtonPrimary}>Criar minha loja grátis</Link>
              {/* --- MUDANÇA APLICADA --- */}
              <Link href="/planos" className={styles.heroButtonSecondary}>Ver planos e preços</Link>
            </div>
             {/* --- MUDANÇA APLICADA --- */}
            <p className={styles.heroTrustSignal}>
            </p>
          </div>
          <div className={styles.heroImageWrapper}>
            <Image src="/site4.png" alt="Ilustração Phandshop" width={1200} height={1500} priority className={styles.heroImage}/>
          </div>
        </div>
      </div>
    </section>
  );
}