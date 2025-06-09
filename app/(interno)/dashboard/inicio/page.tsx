'use client';

import React from 'react';

const cardStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  minWidth: 220
};

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>
        👋 Bem-vindo de volta!
      </h1>
      <p style={{ marginBottom: 32 }}>
        Aqui está um resumo do desempenho da sua loja.
      </p>

      {/* Cards de métricas */}
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Vendas Hoje</h2>
          <p style={{ fontSize: 20, fontWeight: 600 }}>R$ 1.230,00</p>
        </div>
        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Visitantes</h2>
          <p style={{ fontSize: 20, fontWeight: 600 }}>342</p>
        </div>
        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Produtos em Estoque</h2>
          <p style={{ fontSize: 20, fontWeight: 600 }}>128</p>
        </div>
        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, marginBottom: 8 }}>Pedidos Pendentes</h2>
          <p style={{ fontSize: 20, fontWeight: 600 }}>7</p>
        </div>
      </div>

      {/* Placeholder gráfico */}
      <div style={{
        marginTop: 40,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 24,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: 300
      }}>
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>📈 Gráfico de Vendas (em breve)</h2>
        <p style={{ color: '#888' }}>Aqui vai um gráfico bonito mostrando seu progresso.</p>
      </div>

      {/* Ações rápidas */}
      <div style={{ marginTop: 40 }}>
        <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>🚀 Ações rápidas</h2>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <button style={quickActionBtn}>+ Adicionar Produto</button>
          <button style={quickActionBtn}>Criar Cupom</button>
          <button style={quickActionBtn}>Ver Pedidos</button>
          <button style={quickActionBtn}>Abrir Loja Online</button>
        </div>
      </div>
    </div>
  );
}

const quickActionBtn: React.CSSProperties = {
  backgroundColor: '#5b21b6',
  color: '#fff',
  border: 'none',
  padding: '12px 18px',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: 14
};