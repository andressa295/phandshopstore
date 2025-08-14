'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { MdAttachMoney, MdTrendingUp, MdTrendingDown, MdOutlinePaid, MdOutlineBarChart, MdOutlineInsights, MdPeopleAlt, MdOutlineCancel, MdOutlineChecklist } from 'react-icons/md';
import styles from './Dashboard.module.css'; // Updated import to CSS module
import { getDashboardData, DashboardData } from '@/lib/supabase/dashboard/getDashboardData'; // Import the function to fetch data

// Funções utilitárias
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const getStatusColorClass = (status: string) => {
  return status === 'Operacional' ? styles.statusOperational : styles.statusError;
};

const DashboardPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getDashboardData(); // Call the server-side function
      if (data) {
        setDashboardData(data);
      } else {
        setError('Não foi possível carregar os dados do dashboard.');
      }
      setLoading(false);
    };

    fetchData();
  }, []); // Empty dependency array means it runs once on mount

  if (loading) {
    return <div className={styles.pageContainer}><p>Carregando dados do dashboard...</p></div>;
  }

  if (error || !dashboardData) {
    return (
      <div className={styles.pageContainer}>
        <div className={styles.alertError}>
          {error || 'Erro ao carregar os dados do dashboard.'}
        </div>
      </div>
    );
  }

  // Derived values (calculations)
  const repasse = dashboardData.faturamentoComRepasse * 0.15; // Assuming repasse logic is here
  const lucroLiquido = dashboardData.faturamentoMes - repasse - dashboardData.custosFixos - dashboardData.custosVariaveis; // Assuming these fields exist in DashboardData
  const diferencaPercentual = (((dashboardData.mesAtual - dashboardData.mesAnterior) / dashboardData.mesAnterior) * 100).toFixed(1); // Assuming these fields exist
  const metaAtingida = dashboardData.mesAtual >= dashboardData.metaMensal; // Assuming these fields exist
  const previsaoProximoMes = dashboardData.mesAtual * 1.05; // Assuming mesAtual exists

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>Dashboard de Administração</h2>
        <div className={styles.notificationBellContainer} onClick={() => setShowNotifications(!showNotifications)}>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.bellIcon}>
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          {dashboardData.notificacoesPendentes > 0 && (
            <span className={styles.notificationCounter}>{dashboardData.notificacoesPendentes}</span>
          )}
        </div>
      </div>

      <p className={styles.subtitleText}>
        Bem-vindo ao painel interno da Phandshop. Aqui você pode gerenciar os lojistas, suporte, planos e estatísticas do sistema.
      </p>

      {/* Seção de Métricas Principais em formato de tabela */}
      <div className={styles.kpiGrid}>
        <div className={styles.kpiCard}>
          <div className={`${styles.tableRow} ${styles.borderTopNone}`}>
            <span className={styles.tableTitle}>Faturamento Bruto</span>
            <span className={`${styles.tableValue} ${styles.greenSuccessText}`}>
              {formatCurrency(dashboardData.faturamentoBruto)}
            </span>
          </div>
          <div className={styles.tableRow}>
            <span className={styles.tableTitle}>Faturamento Pendente</span>
            <span className={`${styles.tableValue} ${styles.orangeText}`}>
              {formatCurrency(dashboardData.faturamentoPendente)}
            </span>
          </div>
          <div className={styles.tableRow}>
            <span className={styles.tableTitle}>Total de Lojistas</span>
            <span className={styles.tableValue}>{dashboardData.totalLojistas}</span>
          </div>
          <div className={styles.tableRow}>
            <span className={styles.tableTitle}>Novos Cadastros (7 dias)</span>
            <span className={styles.tableValue}>{dashboardData.novosCadastrosSemana}</span>
          </div>
          <div className={styles.tableRow}>
            <span className={styles.tableTitle}>Tickets Abertos</span>
            <span className={`${styles.tableValue} ${styles.orangeText}`}>{dashboardData.ticketsAbertos}</span>
          </div>
          <div className={styles.tableRow}>
            <span className={styles.tableTitle}>Taxa de Churn</span>
            <span className={`${styles.tableValue} ${styles.redText}`}>{dashboardData.taxaDeChurn}</span>
          </div>
          <div className={`${styles.tableRow} ${styles.borderBottomNone}`}>
            <span className={styles.tableTitle}>Status do Sistema</span>
            <span className={`${styles.tableValue} ${getStatusColor(dashboardData.sistemaStatus)}`}>
              <span className={`${styles.statusIndicator} ${getStatusColor(dashboardData.sistemaStatus)}`}></span>
              {dashboardData.sistemaStatus}
            </span>
          </div>
        </div>
      </div>

      {/* Painel de Notificações Lateral */}
      {showNotifications && (
        <div className={styles.notificationPanel}>
          <h3 className={styles.notificationTitle}>Notificações</h3>
          <p>O conteúdo das notificações será exibido aqui.</p>
          <button className={styles.notificationButton} onClick={() => setShowNotifications(false)}>Fechar</button>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;