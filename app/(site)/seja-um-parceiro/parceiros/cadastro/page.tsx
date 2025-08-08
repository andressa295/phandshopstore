'use client';

import React, { useState } from 'react';
import styles from './Cadastro.module.css';
import { FaUser, FaEnvelope, FaLink, FaTools } from 'react-icons/fa';

export default function ParceiroCadastroPage() {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    tipoParceiro: 'designer',
    portfolio: '',
    mensagem: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Dados do formulário enviados:', formData);
    // Aqui você integraria a lógica de envio (ex: para uma API, um serviço de e-mail, etc.)
    alert('Formulário enviado com sucesso!');
    // Resetar o formulário após o envio
    setFormData({
      nome: '',
      email: '',
      tipoParceiro: 'designer',
      portfolio: '',
      mensagem: '',
    });
  };

  return (
    <main className={styles.pageWrapper}>
      <section className={styles.formSection}>
        <div className={styles.header}>
          <h1>Formulário de Cadastro de Parceiros</h1>
          <p>Preencha os campos abaixo para se candidatar a uma de nossas parcerias. Entraremos em contato em breve!</p>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="nome" className={styles.label}>
              <FaUser className={styles.icon} />
              Nome Completo
            </label>
            <input
              type="text"
              id="nome"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              className={styles.input}
              placeholder="Seu nome"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              <FaEnvelope className={styles.icon} />
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={styles.input}
              placeholder="seu.email@exemplo.com"
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="tipoParceiro" className={styles.label}>
              <FaTools className={styles.icon} />
              Área de Interesse
            </label>
            <select
              id="tipoParceiro"
              name="tipoParceiro"
              value={formData.tipoParceiro}
              onChange={handleChange}
              className={styles.select}
              required
            >
              <option value="designer">Parceiro Designer</option>
              <option value="tecnologico">Parceiro Tecnológico</option>
              <option value="afiliado">Parceiro Afiliado</option>
              <option value="conteudo">Parceiro de Conteúdo</option>
            </select>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="portfolio" className={styles.label}>
              <FaLink className={styles.icon} />
              Link do Portfólio ou Site
            </label>
            <input
              type="url"
              id="portfolio"
              name="portfolio"
              value={formData.portfolio}
              onChange={handleChange}
              className={styles.input}
              placeholder="https://exemplo.com/portfolio"
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="mensagem" className={styles.label}>
              <FaUser className={styles.icon} />
              Fale um pouco sobre você
            </label>
            <textarea
              id="mensagem"
              name="mensagem"
              value={formData.mensagem}
              onChange={handleChange}
              className={styles.textarea}
              rows={4}
              placeholder="Descreva sua experiência, projetos e por que você quer ser um parceiro."
            />
          </div>
          <button type="submit" className={styles.submitButton}>
            Enviar Candidatura
          </button>
        </form>
      </section>
    </main>
  );
}