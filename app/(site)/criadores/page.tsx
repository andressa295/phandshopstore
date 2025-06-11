'use client';

import React from "react";
import { motion } from "framer-motion";
import Link from 'next/link'; 

export default function ParceirosDevPage() {
  return (
    <main style={{ padding: "40px 20px", maxWidth: 1200, margin: "0 auto" }}>
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ fontSize: 36, fontWeight: "bold", marginBottom: 20 }}
      >
        Programa de Parceiros para Desenvolvedores 🚀
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{ fontSize: 18, marginBottom: 40 }}
      >
        Crie lojas virtuais para seus clientes usando a Phandshop e ganhe comissão recorrente
        todo mês. Uma oportunidade real para monetizar sua expertise enquanto entrega uma
        plataforma robusta para quem confia no seu trabalho.
      </motion.p>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: 24,
        }}
      >
        {[
          {
            title: "Comissão Recorrente",
            description:
              "Receba 15% de comissão mensal por cada cliente ativo que contratar um plano a partir de R$150. Quanto mais lojas você cria, maior seu ganho recorrente!",
            emoji: "💸",
          },
          {
            title: "Painel exclusivo de parceiros",
            description:
              "Acompanhe todas as suas lojas criadas, comissões ativas e status dos clientes em um painel feito especialmente para desenvolvedores.",
            emoji: "📊",
          },
          {
            title: "Descontos e upgrades",
            description:
              "Tenha acesso a benefícios exclusivos, descontos para seus clientes e upgrades de recursos como brinde para parceiros ativos.",
            emoji: "🎁",
          },
          {
            title: "Material de apoio",
            description:
              "Receba manuais, vídeos tutoriais e suporte especializado para acelerar seu onboarding com a plataforma.",
            emoji: "📚",
          },
          {
            title: "Suporte dedicado",
            description:
              "Canal exclusivo para parceiros com atendimento rápido, direto com o time da Phandshop.",
            emoji: "🤝",
          },
          {
            title: "Reconhecimento oficial",
            description:
              "Se destaque no nosso diretório de criadores certificados e receba indicações de clientes que buscam especialistas.",
            emoji: "🏆",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            style={{
              background: "#f9f9f9",
              borderRadius: 12,
              padding: 20,
              boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 28 }}>{item.emoji}</div>
            <h2 style={{ fontSize: 20, margin: "12px 0 8px" }}>{item.title}</h2>
            <p style={{ fontSize: 16, color: "#555" }}>{item.description}</p>
          </motion.div>
        ))}
      </section>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: 60,
          textAlign: "center",
        }}
      >
        <Link
  href="/sitecriadores/afiliado"
  style={{
    marginTop: 12,
    alignSelf: 'flex-start',
    background: '#5b21b6',
    color: '#fff',
    padding: '10px 20px',
    borderRadius: 8,
    fontWeight: 'bold',
    textDecoration: 'none',
    border: 'none',
    display: 'inline-block',
    cursor: 'pointer'
  }}
>
  Quero ser parceiro
</Link>
      </motion.div>
    </main>
  );
}
