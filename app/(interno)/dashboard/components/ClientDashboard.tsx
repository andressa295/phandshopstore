'use client';
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import Link from 'next/link';
import {
  FaBoxes,
  FaClipboardList,
  FaCheck,
  FaExternalLinkAlt,
  FaPlus,
  FaTags,
  FaChartLine,
  FaChartBar,
  FaPercent,
  FaMoneyBillWave,
  FaUsers
} from 'react-icons/fa';

import { DashboardData } from '@/lib/supabase/dashboard/getDashboardData';
import { UserProfile } from '../UserContext';
import '../inicio/dashboard.css';

interface ClientDashboardProps {
  dashboardData: DashboardData | null;
  userProfile: UserProfile | null;
  userEmail: string | undefined;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const ClientDashboard: React.FC<ClientDashboardProps> = ({
  dashboardData,
  userProfile,
  userEmail
}) => {
  const userFullName =
    userProfile?.nome_completo || (userEmail ? userEmail.split('@')[0] : 'Usuário');
  const lojaUrl = userProfile?.lojaSlug
    ? `https://${userProfile.lojaSlug}.seusite.com.br`
    : '#';

  if (!dashboardData || !userProfile) {
    return (
      <div className="dashboardContainerFull">
        <div className="alertError">Erro ao carregar os dados do dashboard.</div>
      </div>
    );
  }

  return (
    <div className="dashboardContainerFull">
      <h1 className="dashboardTitle">Bem-vindo de volta, {userFullName}!</h1>
      <p className="dashboardSubtitle">Aqui está um resumo do desempenho da sua loja.</p>

      {/* ====== KPI Cards ====== */}
      <div className="kpiCardsGrid">
        <div className="kpiCard">
          <h2 className="kpiCardTitle"><FaMoneyBillWave /> Vendas Hoje</h2>
          <p className="kpiCardValue">{formatCurrency(dashboardData.vendasHoje)}</p>
        </div>
        <div className="kpiCard">
          <h2 className="kpiCardTitle"><FaUsers /> Visitantes Hoje</h2>
          <p className="kpiCardValue">{dashboardData.visitantesHoje}</p>
        </div>
        <div className="kpiCard">
          <h2 className="kpiCardTitle"><FaChartLine /> Faturamento Mês</h2>
          <p className="kpiCardValue">{formatCurrency(dashboardData.faturamentoMes)}</p>
        </div>
        <div className="kpiCard">
          <h2 className="kpiCardTitle"><FaChartBar /> Ticket Médio</h2>
          <p className="kpiCardValue">{formatCurrency(dashboardData.ticketMedio)}</p>
        </div>
        <div className="kpiCard">
          <h2 className="kpiCardTitle"><FaPercent /> Taxa de Conversão</h2>
          <p className="kpiCardValue">{dashboardData.taxaConversao.toFixed(1).replace('.', ',')}%</p>
        </div>
      </div>

      {/* ====== Alertas & Chart ====== */}
      <div className="alertsAndChartGrid">
        <div className="alertsCard">
          <h2 className="alertsCardTitle">Alertas Importantes</h2>

          {dashboardData.pedidosPendentes > 0 ? (
            <Link href="/dashboard/vendas/lista" className="alertBtn danger">
              <FaClipboardList size={18} /> {dashboardData.pedidosPendentes} Pedidos Pendentes!
            </Link>
          ) : (
            <div className="alert-status success">
              <span className="alertArrow">✔</span> Nenhum pedido pendente.
            </div>
          )}

          {dashboardData.estoqueBaixoAlert > 0 ? (
            <Link href="/dashboard/produtos/lista" className="alertBtn danger">
              <FaBoxes size={18} /> {dashboardData.estoqueBaixoAlert} Produtos com Estoque Baixo!
            </Link>
          ) : (
            <div className="alert-status success">
              <span className="alertArrow">✔</span> Estoque OK.
            </div>
          )}
        </div>

        <div className="chartCard">
          <h2 className="chartCardTitle">Vendas na Última Semana</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={dashboardData.vendasSemanaisGrafico}
              margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip
                formatter={(value: number) =>
                  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
                }
              />
              <Line type="monotone" dataKey="vendas" stroke="#7C3AED" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ====== Quick Actions ====== */}
      <div className="quickActionsSection">
        <h2 className="quickActionsTitle">Ações rápidas</h2>
        <div className="quickActionsGrid neutralBg">
          <Link href="/dashboard/produtos/novo" className="quickActionBtn neutral">
            <FaPlus size={14} /> Adicionar Produto
          </Link>
          <Link href="/dashboard/descontos/cupons" className="quickActionBtn neutral">
            <FaTags size={14} /> Criar Cupom
          </Link>
          <Link href="/dashboard/vendas/lista" className="quickActionBtn neutral">
            <FaClipboardList size={14} /> Ver Pedidos
          </Link>
          <Link
            href={lojaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="quickActionBtn neutral"
          >
            <FaExternalLinkAlt size={14} /> Abrir Loja Online
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
