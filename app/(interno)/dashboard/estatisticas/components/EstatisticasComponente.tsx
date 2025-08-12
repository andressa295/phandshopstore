'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import { FaMoneyBillWave, FaUsers, FaBox, FaClock, FaChartLine, FaChartBar, FaPercent } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { EstatisticasData } from '../page';
import '../estatisticas.css';

const colors = {
    primary: '#6b21a8',
    accent: '#7C3AED',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    text: '#333333',
};

interface EstatisticasProps {
    data: EstatisticasData;
    lojaId: string;
}

const EstatisticasComponente: React.FC<EstatisticasProps> = ({ data, lojaId }) => {
    const [periodo, setPeriodo] = useState('mesAtual');
    const [loading, setLoading] = useState(false);
    
    // Removemos a lógica de busca de dados aqui, pois ela é feita na página.
    // O componente agora apenas renderiza os dados que recebe.

    const calculateStats = (data: EstatisticasData) => {
        const totalVendas = data.vendas.length;
        const faturamento = data.vendas.reduce((sum, item) => sum + item.valor_total, 0);
        const visitantes = data.visitas.length;
        const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;
        const taxaConversao = visitantes > 0 ? (totalVendas / visitantes) * 100 : 0;

        const vendasPorDia = data.vendas.reduce((acc, venda) => {
            const day = new Date(venda.created_at).getDate();
            acc[day] = (acc[day] || 0) + venda.valor_total;
            return acc;
        }, {} as Record<number, number>);

        const vendasGraphData = Object.keys(vendasPorDia).map(day => ({
            name: `Dia ${day}`,
            vendas: vendasPorDia[Number(day)]
        }));

        return {
            vendasHoje: data.vendas.length > 0 ? data.vendas.filter(v => new Date(v.created_at).getDate() === new Date().getDate()).reduce((sum, v) => sum + v.valor_total, 0) : 0,
            visitantes,
            estoque: data.estoqueBaixo,
            pedidosPendentes: data.pedidosPendentes,
            faturamento,
            ticketMedio,
            taxaConversao,
            vendasGraphData,
            topProdutosGraphData: data.topProdutos.map(p => ({ name: p.nome_produto, vendas: p.quantidade }))
        };
    };
    
    // O estado `stats` agora é inicializado com a prop `data`
    const dashboardData = calculateStats(data);
    
    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard de Estatísticas</h1>
            <div className="periodo-selector">
                <select value={periodo} onChange={(e) => setPeriodo(e.target.value)} disabled={loading}>
                    <option value="hoje">Hoje</option>
                    <option value="semanaAtual">Semana Atual</option>
                    <option value="mesAtual">Mês Atual</option>
                    <option value="ultimos30dias">Últimos 30 Dias</option>
                </select>
            </div>
            <div className="kpi-cards-grid">
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaMoneyBillWave /> Vendas Hoje</h2>
                    <p className="kpi-card-value">R$ {dashboardData.vendasHoje.toFixed(2).replace('.', ',')}</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaUsers /> Visitantes</h2>
                    <p className="kpi-card-value">{dashboardData.visitantes}</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaBox /> Estoque Baixo</h2>
                    <p className="kpi-card-value" style={{ color: dashboardData.estoque > 0 ? 'red' : 'inherit' }}>{dashboardData.estoque} itens</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaClock /> Pedidos Pendentes</h2>
                    <p className="kpi-card-value" style={{ color: dashboardData.pedidosPendentes > 0 ? 'red' : 'inherit' }}>{dashboardData.pedidosPendentes}</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaChartLine /> Faturamento Total</h2>
                    <p className="kpi-card-value">R$ {dashboardData.faturamento.toFixed(2).replace('.', ',')}</p>
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
            <div className="chart-grid">
                <div className="chart-card">
                    <h2 className="chart-title">Vendas por período</h2>
                    <ResponsiveContainer width="100%" height="calc(100% - 30px)">
                        <LineChart data={dashboardData.vendasGraphData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip formatter={(value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`} />
                            <Line type="monotone" dataKey="vendas" stroke={colors.primary} strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
                <div className="chart-card">
                    <h2 className="chart-title">Produtos Mais Vendidos</h2>
                    <ResponsiveContainer width="100%" height="calc(100% - 30px)">
                        <BarChart data={dashboardData.topProdutosGraphData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <CartesianGrid strokeDasharray="3 3" />
                            <Tooltip formatter={(value: number) => `${value} itens`} />
                            <Bar dataKey="vendas" fill={colors.accent} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EstatisticasComponente;