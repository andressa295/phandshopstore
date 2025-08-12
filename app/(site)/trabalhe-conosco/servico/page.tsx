// app/(site)/servico/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Servico.module.css';

export default function CandidaturaPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={styles.section}>
        <div className={styles.contentContainer}>
          <h1 className={styles.heroTitle}>Envie sua Candidatura</h1>
          <p className={styles.heroSubtitle}>
            Preencha seus dados e anexe seu currículo para se candidatar às nossas vagas.
          </p>

          <form className={styles.candidaturaForm}>
            <div className={styles.formGroup}>
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" name="nome" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" name="email" required />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefone">Telefone (com DDD)</label>
              <input type="tel" id="telefone" name="telefone" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="vaga">Vaga de Interesse (Opcional)</label>
              <input type="text" id="vaga" name="vaga" placeholder="Ex: Desenvolvedor(a) Full Stack" />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="curriculo">Anexar Currículo</label>
              <input type="file" id="curriculo" name="curriculo" accept=".pdf,.doc,.docx" required />
            </div>

            <button type="submit" className={styles.submitButton}>
              Enviar Candidatura
            </button>
          </form>

          <Link href="/" className={styles.backLink}>
            Voltar para a Página Inicial
          </Link>
        </div>
      </section>
    </main>
  );
}