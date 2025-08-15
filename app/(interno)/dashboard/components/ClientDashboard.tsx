'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Link from 'next/link';
import { FaBoxes, FaClipboardList, FaCheckCircle, FaExternalLinkAlt, FaPlus, FaTags, FaChartLine, FaChartBar, FaPercent, FaMoneyBillWave, FaUsers } from 'react-icons/fa';

import { StoreDashboardData } from '@/lib/supabase/dashboard/getStoreDashboardData';
import { UserProfile } from '../UserContext'; // Ajuste o caminho se necessário
import styles from '../inicio/dashboard.module.css'; // Importa o CSS Module

interface ClientDashboardProps {
    dashboardData: StoreDashboardData | null;
    userProfile: UserProfile | null;
    userEmail: string | undefined;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const getStatusColor = (status: string) => {
  return status === 'Operacional' ? 'var(--green-success)' : 'red';
};

const ClientDashboard: React.FC<ClientDashboardProps> = ({ dashboardData, userProfile, userEmail }) => {
    const userFullName = userProfile?.nome_completo || (userEmail ? userEmail.split('@')[0] : 'Usuário');
    const lojaUrl = userProfile?.lojaSlug ? `https://${userProfile.lojaSlug}.seusite.com.br` : '#';

    if (!dashboardData || !userProfile) {
        return (
            <div className={styles.dashboardContainerFull}>
                <div className={styles.alertError}>
                    Erro ao carregar os dados do dashboard.
                </div>
            </div>
        );
    }
    
    // CORRIGIDO: Agora as métricas são calculadas aqui
    const repasse = dashboardData.faturamentoComRepasse * 0.15;
    const lucroLiquido = dashboardData.mesAtual - repasse - dashboardData.custosFixos - dashboardData.custosVariaveis;
    const diferencaPercentual = (((dashboardData.mesAtual - dashboardData.mesAnterior) / dashboardData.mesAnterior) * 100).toFixed(1);
    const metaAtingida = dashboardData.mesAtual >= dashboardData.metaMensal;

    return (
        <div className="dashboard-container-full">
            <h1 className="dashboard-title">
                👋 Bem-vindo de volta, {userFullName}!
            </h1>
            <p className="dashboard-subtitle">
                Aqui está um resumo do desempenho da sua loja.
            </p>

            {/* Cards de Métricas (KPIs) */}
            <div className="kpi-cards-grid">
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaMoneyBillWave /> Vendas Hoje</h2>
                    <p className="kpi-card-value">R$ {dashboardData.vendasHoje.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaUsers /> Visitantes Hoje</h2>
                    <p className="kpi-card-value">{dashboardData.visitantesHoje}</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaChartLine /> Faturamento Mês</h2>
                    <p className="kpi-card-value">R$ {dashboardData.faturamentoMes.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaChartBar /> Ticket Médio</h2>
                    <p className="kpi-card-value">R$ {dashboardData.ticketMedio.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaPercent /> Taxa de Conversão</h2>
                    <p className="kpi-card-value">{dashboardData.taxaConversao.toFixed(1).replace('.', ',')}%</p>
                </div>
            </div>

            {/* Seção de Alertas e Gráfico */}
            <div className="alerts-and-chart-grid">
                <div className="alerts-card">
                    <h2 className="alerts-card-title">🔔 Alertas Importantes</h2>
                    {dashboardData.pedidosPendentes > 0 ? (
                        <Link href="/dashboard/vendas/lista" className="alert-btn danger">
                            <FaClipboardList size={18} /> {dashboardData.pedidosPendentes} Pedidos Pendentes!
                        </Link>
                    ) : (
                        <div className="alert-status success">
                            <FaCheckCircle size={18} /> Nenhum pedido pendente.
                        </div>
                    )}
                    {dashboardData.estoqueBaixoAlert > 0 ? (
                        <Link href="/dashboard/produtos/lista" className="alert-btn danger">
                            <FaBoxes size={18} /> {dashboardData.estoqueBaixoAlert} Produtos com Estoque Baixo!
                        </Link>
                    ) : (
                        <div className="alert-status success">
                            <FaCheckCircle size={18} /> Estoque OK.
                        </div>
                    )}
                </div>
                
                <div className="chart-card">
                    <h2 className="chart-card-title">Vendas na Última Semana</h2>
                    <ResponsiveContainer width="100%" height="calc(100% - 30px)">
                        <LineChart data={dashboardData.vendasSemanaisGrafico} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`} />
                            <Line type="monotone" dataKey="vendas" stroke="#7C3AED" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Ações Rápidas */}
            <div className="quick-actions-section">
                <h2 className="quick-actions-title">🚀 Ações rápidas</h2>
                <div className="quick-actions-grid">
                    <Link href="/dashboard/produtos/novo" className="quick-action-btn primary">
                        <FaPlus size={14} /> Adicionar Produto
                    </Link>
                    <Link href="/dashboard/descontos/cupons" className="quick-action-btn secondary">
                        <FaTags size={14} /> Criar Cupom
                    </Link>
                    <Link href="/dashboard/vendas/lista" className="quick-action-btn info">
                        <FaClipboardList size={14} /> Ver Pedidos
                    </Link>
                    <Link href={lojaUrl} target="_blank" rel="noopener noreferrer" className="quick-action-btn success">
                        <FaExternalLinkAlt size={14} /> Abrir Loja Online
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;