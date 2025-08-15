// app/(interno)/dashboard/components/DashboardClient.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { FaPlus, FaTag, FaClipboardList, FaStore } from 'react-icons/fa';
import './dashboard.css';

interface DashboardClientProps {
    data: {
        vendasHoje: number;
        visitantesHoje: number;
        estoqueBaixo: number;
        pedidosPendentes: number;
    };
}

const DashboardClient: React.FC<DashboardClientProps> = ({ data }) => {
    return (
        <div className="dashboard-container-full">
            <h1 className="dashboard-title">
                👋 Bem-vindo de volta!
            </h1>
            <p className="dashboard-subtitle">
                Aqui está um resumo do desempenho da sua loja.
            </p>

            {/* Cards de métricas */}
            <div className="kpi-cards-grid">
                <div className="kpi-card">
                    <h2 className="kpi-card-title">Vendas Hoje</h2>
                    <p className="kpi-card-value">R$ {data.vendasHoje.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title">Visitantes Hoje</h2>
                    <p className="kpi-card-value">{data.visitantesHoje}</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title">Produtos em Estoque</h2>
                    <p className={`kpi-card-value ${data.estoqueBaixo > 0 ? 'alert-danger' : ''}`}>
                        {data.estoqueBaixo}
                    </p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title">Pedidos Pendentes</h2>
                    <p className={`kpi-card-value ${data.pedidosPendentes > 0 ? 'alert-warning' : ''}`}>
                        {data.pedidosPendentes}
                    </p>
                </div>
            </div>

            {/* Ações rápidas */}
            <div className="quick-actions-section">
                <h2 className="quick-actions-title">🚀 Ações rápidas</h2>
                <div className="quick-actions-grid">
                    <Link href="/dashboard/produtos/novo" className="quick-action-btn primary">
                        <FaPlus /> Adicionar Produto
                    </Link>
                    <Link href="/dashboard/cupons/novo" className="quick-action-btn secondary">
                        <FaTag /> Criar Cupom
                    </Link>
                    <Link href="/dashboard/vendas/lista" className="quick-action-btn info">
                        <FaClipboardList /> Ver Pedidos
                    </Link>
                    <Link href="/" className="quick-action-btn success">
                        <FaStore /> Abrir Loja Online
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default DashboardClient;
