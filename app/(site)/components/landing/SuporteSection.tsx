'use client';

import React from 'react';
import styles from '../../page.module.css';

export function SuporteSection() {
  return (
    <section className={styles.suporteSection}>
      <div className={styles.contentContainer}>
        <div className={styles.suporteContainer}>
          <div className={styles.suporteLeft}>
            <h2 className={styles.suporteTitle}>Suporte e Mentoria Phandshop</h2>
            <p className={styles.suporteText}>
              Na Phandshop, você conta com suporte rápido, mentorias ao vivo e acompanhamento especializado em cada etapa. Nosso sucesso é o seu sucesso. Com 97% de avaliações positivas, nosso suporte responde em até 1 minuto e nossas mentorias te ajudam a dominar sua loja virtual.
            </p>
          </div>
          <div className={styles.suporteRight}>
            <div className={styles.suporteBox}>
              <h3 className={styles.suporteBoxTitle}>Horário de Atendimento</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className={styles.suporteBoxItem}>
                  <span>Segunda à Sexta</span>
                  <span style={{ color: '#6D28D9', fontWeight: 600 }}>09h às 20h</span>
                </div>
                <div className={styles.suporteBoxItem}>
                  <span>Finais de Semana e Feriados</span>
                  <span style={{ color: '#6D28D9', fontWeight: 600 }}>10h às 15h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}