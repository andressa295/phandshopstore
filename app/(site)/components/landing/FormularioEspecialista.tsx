'use client';

import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone } from 'react-icons/fa';
import styles from '../../page.module.css';

export function FormularioEspecialista() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados do formulário enviados:', formData);
    alert('Formulário enviado com sucesso!');
    setFormData({ nome: '', email: '', telefone: '' });
  };

  return (
    <div className={styles.formContainer}>
      {/* Removei o overlay rosado, agora só a sua imagem */}
      <div className={styles.formBlock}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            Conheça nossa plataforma com a ajuda de um especialista
          </h2>
          <p className={styles.subtitle}>
            Preencha o formulário abaixo para agendar uma reunião com
            um especialista da Phandshop.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <FaUser className={styles.inputIcon} />
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={styles.input}
              placeholder="Digite seu nome*"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FaEnvelope className={styles.inputIcon} />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="Digite seu e-mail*"
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <FaPhone className={styles.inputIcon} />
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className={styles.input}
              placeholder="Digite seu telefone*"
              required
            />
          </div>

          <button type="submit" className={styles.button}>
            Quero conferir o painel
          </button>
        </form>
      </div>
    </div>
  );
}
