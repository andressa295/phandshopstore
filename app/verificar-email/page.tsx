'use client';

import React from 'react';
import styles from './verificar-email.module.css'; // Importando o CSS Module

export default function VerificarEmailPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Verifique seu E-mail!</h1>
        <p className={styles.message}>
          Enviamos um link de confirmação para o seu endereço de e-mail.
          Por favor, clique no link para ativar sua conta.
        </p>
      </div>
    </div>
  );
}