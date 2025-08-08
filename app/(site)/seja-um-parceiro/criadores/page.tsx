'use client';

import React from "react";
import { motion } from "framer-motion";
import Link from 'next/link'; 
import styles from './ParceirosDev.module.css';
import { FaRocket, FaMoneyBillAlt, FaChartBar, FaGift, FaBook, FaHandshake, FaTrophy } from 'react-icons/fa';

export default function ParceirosDevPage() {
  return (
    <main className={styles.mainContainer}>
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.pageTitle}
      >
        Programa de Parceiros para Desenvolvedores <FaRocket className={styles.titleIcon} />
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={styles.pageSubtitle}
      >
        Crie lojas virtuais para seus clientes usando a Phandshop e ganhe comissão recorrente todo mês. 
        Uma oportunidade real para monetizar sua expertise enquanto entrega uma plataforma robusta para quem confia no seu trabalho.
      </motion.p>

      <section className={styles.featuresGrid}>
        {[
          {
            title: "Comissão Recorrente",
            description:
              "Receba 15% de comissão mensal por cada cliente ativo que contratar um plano a partir de R$150. Quanto mais lojas você cria, maior seu ganho recorrente!",
            icon: <FaMoneyBillAlt />,
          },
          {
            title: "Painel exclusivo de parceiros",
            description:
              "Acompanhe todas as suas lojas criadas, comissões ativas e status dos clientes em um painel feito especialmente para desenvolvedores.",
            icon: <FaChartBar />,
          },
          {
            title: "Descontos e upgrades",
            description:
              "Tenha acesso a benefícios exclusivos, descontos para seus clientes e upgrades de recursos como brinde para parceiros ativos.",
            icon: <FaGift />,
          },
          {
            title: "Material de apoio",
            description:
              "Receba manuais, vídeos tutoriais e suporte especializado para acelerar seu onboarding com a plataforma.",
            icon: <FaBook />,
          },
          {
            title: "Suporte dedicado",
            description:
              "Canal exclusivo para parceiros com atendimento rápido, direto com o time da Phandshop.",
            icon: <FaHandshake />,
          },
          {
            title: "Reconhecimento oficial",
            description:
              "Se destaque no nosso diretório de criadores certificados e receba indicações de clientes que buscam especialistas.",
            icon: <FaTrophy />,
          },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className={styles.featureCard}
          >
            <div className={styles.cardIcon}>{item.icon}</div>
            <h2 className={styles.cardTitle}>{item.title}</h2>
            <p className={styles.cardDescription}>{item.description}</p>
          </motion.div>
        ))}
      </section>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={styles.ctaSection}
      >
        <Link
          href="/sitecriadores/afiliado"
          className={styles.ctaButton}
        >
          Quero ser parceiro
        </Link>
      </motion.div>
    </main>
  );
}
