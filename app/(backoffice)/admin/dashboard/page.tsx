'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import '@/app/globals.css';

// Dados simulados para a dashboard. Em um ambiente real,
// estes dados seriam buscados do seu banco de dados (Supabase).
const dashboardData = {
  totalLojistas: 124,
  ticketsAbertos: 8,
  faturamentoBruto: 350000,
  faturamentoPendente: 15000,
  sistemaStatus: 'Operacional',
  notificacoesPendentes: 3,
  novosCadastrosSemana: 12,
  taxaDeChurn: '2.5%',
};

// Funções utilitárias
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const getStatusColor = (status: string) => {
  return status === 'Operacional' ? 'var(--green-success)' : 'red';
};

const DashboardPage: React.FC = () => {
  const [showNotifications, setShowNotifications] = useState(false);

  // Estilo para o ícone de sino e o contador
  const notificationBellContainerStyle = {
    position: 'relative' as 'relative',
    cursor: 'pointer',
    color: 'var(--gray-dark-text)',
    fontSize: '2rem',
  };

  const notificationCounterStyle = {
    position: 'absolute' as 'absolute',
    top: '0',
    right: '0',
    background: 'red',
    color: 'white',
    borderRadius: '50%',
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    transform: 'translate(50%, -50%)',
  };

  const cardContainerStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '2rem',
    marginBottom: '2rem',
  };

  const cardStyle = {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  };

  const tableRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid var(--gray-medium)',
    alignItems: 'center',
  };

  const tableTitleStyle = {
    color: 'var(--gray-text)',
    fontSize: '1rem',
  };

  const tableValueStyle = {
    color: 'var(--gray-dark-text)',
    fontSize: '1.25rem',
    fontWeight: 'bold',
  };
  
  const statusIndicatorStyle = {
    display: 'inline-block',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    marginRight: '0.5rem',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--purple-main)', fontSize: '2rem' }}>Dashboard de Administração</h2>
        {/* Ícone de sino de notificação em SVG */}
        <div style={notificationBellContainerStyle} onClick={() => setShowNotifications(!showNotifications)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {dashboardData.notificacoesPendentes > 0 && (
            <span style={notificationCounterStyle}>{dashboardData.notificacoesPendentes}</span>
          )}
        </div>
      </div>

      <p style={{ color: 'var(--gray-dark-text)', marginBottom: '2rem' }}>
        Bem-vindo ao painel interno da Phandshop. Aqui você pode gerenciar os lojistas, suporte, planos e estatísticas do sistema.
      </p>

      {/* Seção de Métricas Principais em formato de tabela */}
      <div style={cardContainerStyle}>
        <div style={cardStyle}>
          <div style={{ ...tableRowStyle, borderTop: 'none' }}>
            <span style={tableTitleStyle}>Faturamento Bruto</span>
            <span style={{ ...tableValueStyle, color: 'var(--green-success)' }}>
              {formatCurrency(dashboardData.faturamentoBruto)}
            </span>
          </div>
          <div style={tableRowStyle}>
            <span style={tableTitleStyle}>Faturamento Pendente</span>
            <span style={{ ...tableValueStyle, color: 'orange' }}>
              {formatCurrency(dashboardData.faturamentoPendente)}
            </span>
          </div>
          <div style={tableRowStyle}>
            <span style={tableTitleStyle}>Total de Lojistas</span>
            <span style={tableValueStyle}>{dashboardData.totalLojistas}</span>
          </div>
          <div style={tableRowStyle}>
            <span style={tableTitleStyle}>Novos Cadastros (7 dias)</span>
            <span style={tableValueStyle}>{dashboardData.novosCadastrosSemana}</span>
          </div>
          <div style={tableRowStyle}>
            <span style={tableTitleStyle}>Tickets Abertos</span>
            <span style={{ ...tableValueStyle, color: 'orange' }}>{dashboardData.ticketsAbertos}</span>
          </div>
          <div style={tableRowStyle}>
            <span style={tableTitleStyle}>Taxa de Churn</span>
            <span style={{ ...tableValueStyle, color: 'red' }}>{dashboardData.taxaDeChurn}</span>
          </div>
          <div style={{...tableRowStyle, borderBottom: 'none'}}>
            <span style={tableTitleStyle}>Status do Sistema</span>
            <span style={{...tableValueStyle, color: getStatusColor(dashboardData.sistemaStatus)}}>
              <span style={{...statusIndicatorStyle, background: getStatusColor(dashboardData.sistemaStatus)}}></span>
              {dashboardData.sistemaStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Painel de Notificações Lateral */}
      {showNotifications && (
        <div style={{ position: 'fixed', top: '0', right: '0', height: '100%', width: '300px', background: 'white', boxShadow: '-2px 0 5px rgba(0,0,0,0.2)', padding: '2rem', transition: 'transform 0.3s ease-in-out', transform: 'translateX(0)' }}>
          <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Notificações</h3>
          <p>O conteúdo das notificações será exibido aqui.</p>
          <button style={{ background: 'var(--purple-main)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', border: 'none', cursor: 'pointer', marginTop: '1rem' }} onClick={() => setShowNotifications(false)}>Fechar</button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
