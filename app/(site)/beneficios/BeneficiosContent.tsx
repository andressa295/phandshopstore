"use client";
import { motion } from 'framer-motion';
import { FaRocket, FaMoneyBillWave, FaLock, FaCode, FaChartLine, FaSearch } from 'react-icons/fa';
import React from 'react';

const recursos = [
  {
    icon: <FaRocket size={24} />, title: 'Lançamento instantâneo',
    desc: 'Crie e publique sua loja em minutos com nossa infraestrutura turbinada.'
  },
  {
    icon: <FaLock size={24} />, title: 'Segurança robusta',
    desc: 'Hospedagem com SSL, proteção DDoS e backups automáticos incluídos.'
  },
  {
    icon: <FaMoneyBillWave size={24} />, title: 'Pagamento sem taxas',
    desc: 'O plano é o único custo. Nada de porcentagem nas suas vendas.'
  },
  {
    icon: <FaCode size={24} />, title: 'Editor 100% customizável',
    desc: 'Código aberto para você deixar a loja com a sua cara.'
  },
  {
    icon: <FaSearch size={24} />, title: 'SEO poderoso de verdade',
    desc: 'Apareça no Google como um foguete. Sem plugins, sem dor de cabeça.'
  },
  {
    icon: <FaChartLine size={24} />, title: 'Sem taxas escondidas',
    desc: 'Transparência total. Pague só pelo plano e mais nada.'
  }
];

export default function RecursosPage() {
  return (
    <div style={{ padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginBottom: 40 }}
      >
        Benefícios e recursos da Phandshop
      </motion.h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        {recursos.map((r, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            style={{ background: '#f5f5f5', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}
          >
            <div style={{ marginBottom: 12, color: '#6c63ff' }}>{r.icon}</div>
            <h2 style={{ fontSize: 20, marginBottom: 8 }}>{r.title}</h2>
            <p style={{ fontSize: 14, color: '#444' }}>{r.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* Seção extra para criadores de site */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        style={{ marginTop: 60, padding: 30, borderRadius: 16, background: '#6c63ff', color: 'white', display: 'flex', flexDirection: 'column', gap: 16 }}
      >
        <h2 style={{ fontSize: 28 }}>💼 Ganhe criando lojas com a Phandshop</h2>
        <p style={{ fontSize: 16 }}>
          Você é designer, dev ou freelancer e cria lojas para clientes? Agora você ganha também!
          A cada pagamento mensal de uma loja criada por você, receba 15% de comissão automática.
        </p>
        <div style={{ background: 'white', color: '#6c63ff', padding: 20, borderRadius: 12, fontSize: 14 }}>
          Exemplo: Plano Profissional R$149/mês → Você recebe R$22,35 por mês enquanto o cliente estiver ativo.
        </div>
        <button style={{ marginTop: 12, alignSelf: 'flex-start', background: 'white', color: '#6c63ff', padding: '10px 20px', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer', border: 'none' }}>
          Quero ser parceiro
        </button>
      </motion.div>
    </div>
  );
}
