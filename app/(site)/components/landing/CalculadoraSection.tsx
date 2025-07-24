'use client';

import React from 'react';
import styles from '../../page.module.css';

export function CalculadoraSection() {
  const [faturamento, setFaturamento] = React.useState('10000');
  const [taxaConcorrente, setTaxaConcorrente] = React.useState(2.99);
  
  const economiaAnual = (parseFloat(faturamento || '0') * (taxaConcorrente / 100)) * 12;

  const formatCurrency = (value: number) => {
    if (isNaN(value)) return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <section className={styles.calculadoraSection}>
      <div className={styles.contentContainer}>
        <div className={styles.sectionHeader}>
          <span className={styles.preTitle}>Taxa Zero na Prática</span>
          <h2>Pare de deixar dinheiro na mesa</h2>
          <p>Veja o quanto você economizaria por ano conosco, sem pagar comissão por venda.</p>
        </div>
        <div className={styles.calculadoraBox}>
          <div className={styles.calculadoraInputGroup}>
            <div>
              <label htmlFor="faturamento">Seu faturamento mensal (R$)</label>
              <input id="faturamento" type="number" value={faturamento} onChange={e => setFaturamento(e.target.value)} placeholder="Ex: 10000" />
            </div>
            <div>
              {/* --- MUDANÇA APLICADA --- */}
              <label htmlFor="taxa">Taxa de comissão que você paga hoje (%)</label>
              <input 
                id="taxa" 
                type="number" 
                value={taxaConcorrente} 
                onChange={e => setTaxaConcorrente(parseFloat(e.target.value))} 
                placeholder="Ex: 2.99"
                step="0.01"
              />
            </div>
          </div>
          <div className={styles.calculadoraResultado}>
            <p>Sua economia anual na Phandshop seria de:</p>
            <span className={styles.economiaValor}>{formatCurrency(economiaAnual)}</span>
            <p className={styles.economiaDetalhe}>Dinheiro que volta para o seu bolso.</p>
          </div>
        </div>
      </div>
    </section>
  );
}