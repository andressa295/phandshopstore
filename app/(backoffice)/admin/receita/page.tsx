'use client';

import React, { useState, useEffect } from 'react';
import {
  MdAttachMoney,
  MdTrendingUp,
  MdTrendingDown,
  MdOutlinePaid,
  MdOutlineBarChart,
  MdOutlineInsights,
  MdPeopleAlt,
  MdOutlineCancel,
  MdOutlineChecklist,
} from 'react-icons/md';
import styles from './Receita.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PostgrestError } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

// Interfaces para os dados
interface DashboardData {
  mesAtual: number;
  mesAnterior: number;
  totalAnual: number;
  metaMensal: number;
  faturamentoComRepasse: number;
  usuariosPagantes: number;
  cancelamentos: number;
  planos: { [key: string]: number };
  custosFixos: number;
  custosVariaveis: number;
  ticketMedio: number;
  taxaConversao: string;
  detalhes: { mes: string; valor: number }[];
  sistemaStatus: string;
  notificacoesPendentes: number;
}

// Funções utilitárias
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const getStatusColor = (status: string) => {
  return status === 'Operacional' ? styles.statusOperational : styles.statusError;
};

const ReceitaPage: React.FC = () => {
  const supabase = createClientComponentClient();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [periodo, setPeriodo] = useState<'mes' | 'ano'>('mes');

  useEffect(() => {
    const fetchReceita = async () => {
      setLoading(true);
      const { data, error } = await supabase.from('receita_historico').select('*');

      if (error) {
        console.error("Erro ao buscar dados de receita:", error);
        setError('Erro ao carregar dados de receita.');
      } else {
        // Lógica de simulação de dados do dashboard
        const faturamentoMes = data.reduce((sum, item) => sum + item.valor_venda, 0);
        const faturamentoAnterior = data.slice(0, -1).reduce((sum, item) => sum + item.valor_venda, 0);

        setDashboardData({
            mesAtual: faturamentoMes,
            mesAnterior: faturamentoAnterior,
            totalAnual: 1450000,
            metaMensal: 150000,
            faturamentoComRepasse: faturamentoMes * 0.85,
            usuariosPagantes: 320,
            cancelamentos: 20,
            planos: {
              gratuito: 5000,
              basico: 40000,
              master: 60000,
              plus: 20000,
            },
            custosFixos: 30000,
            custosVariaveis: 15000,
            ticketMedio: faturamentoMes > 0 ? faturamentoMes / data.length : 0,
            taxaConversao: '3.5%',
            detalhes: [
              { mes: 'Jan', valor: 110000 },
              { mes: 'Fev', valor: 115000 },
              { mes: 'Mar', valor: 120000 },
              { mes: 'Abr', valor: 125000 },
              { mes: 'Mai', valor: 130000 },
              { mes: 'Jun', valor: 135000 },
              { mes: 'Jul', valor: 120000 },
            ],
            sistemaStatus: 'Operacional',
            notificacoesPendentes: 3,
        });
      }
      setLoading(false);
    };

    fetchReceita();
  }, [supabase]);

  if (loading) return <div>Carregando...</div>;
  if (error || !dashboardData) return <div>Erro ao carregar dados.</div>;
  
  const repasse = dashboardData.faturamentoComRepasse * 0.15;
  const lucroLiquido = dashboardData.mesAtual - repasse - dashboardData.custosFixos - dashboardData.custosVariaveis;
  const diferencaPercentual = (((dashboardData.mesAtual - dashboardData.mesAnterior) / dashboardData.mesAnterior) * 100).toFixed(1);
  const metaAtingida = dashboardData.mesAtual >= dashboardData.metaMensal;
  const previsaoProximoMes = dashboardData.mesAtual * 1.05;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Painel de Receita</h2>
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
      <p className={styles.subtitle}>Visão estratégica da receita da plataforma.</p>

      {/* METRICS */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <p><MdAttachMoney className={styles.icon} /> Receita Mês Atual</p>
          <strong>{formatCurrency(dashboardData.mesAtual)}</strong>
          <p className={styles.cardInfo}>
            {parseFloat(diferencaPercentual) >= 0 ? <MdTrendingUp className={styles.icon} /> : <MdTrendingDown className={styles.icon} />}
            {diferencaPercentual}% vs mês anterior
          </p>
        </div>
        <div className={styles.card}>
          <p><MdOutlinePaid className={styles.icon} /> Lucro Líquido</p>
          <strong>{formatCurrency(lucroLiquido)}</strong>
        </div>
        <div className={styles.card}>
          <p><MdOutlineChecklist className={styles.icon} /> Meta Mensal</p>
          <strong className={metaAtingida ? styles.statusSuccess : styles.statusWarning}>
            {metaAtingida ? 'Atingida' : 'Não atingida'}
          </strong>
          <p className={styles.cardInfo}>
            {formatCurrency(dashboardData.metaMensal)}
          </p>
        </div>
        <div className={styles.card}>
          <p>Ticket Médio</p>
          <strong>{formatCurrency(dashboardData.ticketMedio)}</strong>
        </div>
        <div className={styles.card}>
          <p>Taxa de Conversão</p>
          <strong>{dashboardData.taxaConversao}</strong>
        </div>
        <div className={styles.card}>
          <p>Previsão Próximo Mês</p>
          <strong>{formatCurrency(previsaoProximoMes)}</strong>
        </div>
      </div>

      {/* RECEITA POR PLANO */}
      <div className={styles.card}>
        <h3><MdOutlineBarChart className={styles.icon} /> Receita por Plano</h3>
        {Object.entries(dashboardData.planos).map(([nome, valor]) => (
          <div key={nome} className={styles.planoItem}>
            <span style={{ textTransform: 'capitalize' }}>{nome}</span>
            <strong>{formatCurrency(valor)}</strong>
          </div>
        ))}
      </div>

      {/* MINI DRE */}
      <div className={styles.card}>
        <h3><MdAttachMoney className={styles.icon} /> Resumo Financeiro</h3>
        <div className={styles.resumoFinanceiro}>
          <p>Receita bruta: {formatCurrency(dashboardData.mesAtual)}</p>
          <p>Repasse (15%): -{formatCurrency(repasse)}</p>
          <p>Custos fixos: -{formatCurrency(dashboardData.custosFixos)}</p>
          <p>Custos variáveis: -{formatCurrency(dashboardData.custosVariaveis)}</p>
          <p><strong>Lucro líquido: {formatCurrency(lucroLiquido)}</strong></p>
        </div>
      </div>

      {/* GRÁFICO */}
      <div className={styles.card}>
        <h3><MdOutlineBarChart className={styles.icon} /> Histórico Mensal</h3>
        <div className={styles.graficoContainer}>
          {dashboardData.detalhes.map((item, idx) => {
            const altura = (item.valor / dashboardData.mesAtual) * 100;
            return (
              <div key={idx} className={styles.graficoBarra}>
                <div style={{ height: `${altura}%` }} className={styles.graficoValor} />
                <span className={styles.graficoMes}>{item.mes}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* USUÁRIOS PAGANTES E CHURN */}
      <div className={styles.grid}>
        <div className={styles.card}>
          <p><MdPeopleAlt className={styles.icon} /> Usuários Pagantes</p>
          <strong>{dashboardData.usuariosPagantes}</strong>
        </div>
        <div className={styles.card}>
          <p><MdOutlineCancel className={styles.icon} /> Cancelamentos</p>
          <strong className={styles.statusError}>{dashboardData.cancelamentos}</strong>
        </div>
      </div>

      {/* INSIGHTS */}
      <div className={styles.card}>
        <h3><MdOutlineInsights className={styles.icon} /> Insights Automáticos</h3>
        <ul className={styles.insightsList}>
          <li className={styles.insightsItem}>
            <MdAttachMoney className={`${styles.icon} ${styles.statusSuccess}`} />
            Plano Master teve o maior faturamento do mês.
          </li>
          <li className={styles.insightsItem}>
            <MdOutlineCancel className={`${styles.icon} ${styles.statusError}`} />
            Cancelamentos aumentaram 25% vs mês anterior.
          </li>
          <li className={styles.insightsItem}>
            <MdTrendingUp className={`${styles.icon} ${styles.statusSuccess}`} />
            Crescimento médio mensal: 4,5%.
          </li>
          <li className={styles.insightsItem}>
            <MdAttachMoney className={styles.icon} />
            Projeção: {formatCurrency(previsaoProximoMes)} no próximo mês.
          </li>
        </ul>
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

export default ReceitaPage;