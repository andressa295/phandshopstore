'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const cardStyle: React.CSSProperties = {
  flex: 1,
  backgroundColor: '#fff',
  borderRadius: 12,
  padding: 24,
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  minWidth: 220,
};

const dataVendas = [
  { name: 'Jan', vendas: 4000 },
  { name: 'Feb', vendas: 3000 },
  { name: 'Mar', vendas: 5000 },
  { name: 'Apr', vendas: 4000 },
  { name: 'May', vendas: 6000 },
  { name: 'Jun', vendas: 7000 },
];

export default function EstatisticasPage() {
  const stats = {
    vendasHoje: 1230,
    visitantes: 342,
    estoque: 128,
    pedidosPendentes: 7,
    faturamentoMes: 45000,
    ticketMedio: 150,
    taxaConversao: 2.3,
  };

  return (
   

      <div
        style={{
          marginTop: 40,
          backgroundColor: '#fff',
          borderRadius: 12,
          padding: 24,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          height: 400,
        }}
      >
        <h2 style={{ fontSize: 16, marginBottom: 16 }}>📈 Vendas Mensais</h2>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={dataVendas} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <Tooltip />
            <Line type="monotone" dataKey="vendas" stroke="#5b21b6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    
  );
}