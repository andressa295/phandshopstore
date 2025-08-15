'use client';

import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar } from 'recharts';
import { FaMoneyBillWave, FaUsers, FaBox, FaClock, FaChartLine, FaChartBar, FaPercent } from 'react-icons/fa';
import { EstatisticasData } from '../page';
import '../estatisticas.css';

interface EstatisticasProps {
    data: EstatisticasData;
    lojaId: string;
}

const EstatisticasComponente: React.FC<EstatisticasProps> = ({ data, lojaId }) => {
    const [periodo, setPeriodo] = useState('mesAtual');

    const dashboardData = useMemo(() => {
        const calculateStats = (statsData: EstatisticasData) => {
            const today = new Date();
            const todayDay = today.getDate();
            const totalVendas = statsData.vendas.length;
            const faturamento = statsData.vendas.reduce((sum, item) => sum + item.valor_total, 0);
            const visitantes = statsData.visitas.length;
            const ticketMedio = totalVendas > 0 ? faturamento / totalVendas : 0;
            const taxaConversao = visitantes > 0 ? (totalVendas / visitantes) * 100 : 0;

            const vendasGraphData = statsData.vendas.reduce((acc, venda) => {
                const day = new Date(venda.created_at).getDate();
                const existingDay = acc.find(item => item.name === `Dia ${day}`);
                if (existingDay) {
                    existingDay.vendas += venda.valor_total;
                } else {
                    acc.push({ name: `Dia ${day}`, vendas: venda.valor_total });
                }
                return acc;
            }, [] as { name: string, vendas: number }[]);

            return {
                vendasHoje: statsData.vendas.filter(v => new Date(v.created_at).getDate() === todayDay).reduce((sum, v) => sum + v.valor_total, 0),
                visitantes,
                estoque: statsData.estoqueBaixo,
                pedidosPendentes: statsData.pedidosPendentes,
                faturamento,
                ticketMedio,
                taxaConversao,
                vendasGraphData,
                topProdutosGraphData: statsData.topProdutos.map(p => ({ name: p.nome_produto, vendas: p.quantidade }))
            };
        };

        return calculateStats(data);
    }, [data]);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard de Estatísticas</h1>

            <div className="periodo-selector">
                <select value={periodo} onChange={(e) => setPeriodo(e.target.value)}>
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
                    <p className={`kpi-card-value ${dashboardData.estoque > 0 ? 'danger-color' : ''}`}>{dashboardData.estoque} itens</p>
                </div>
                <div className="kpi-card">
                    <h2 className="kpi-card-title"><FaClock /> Pedidos Pendentes</h2>
                    <p className={`kpi-card-value ${dashboardData.pedidosPendentes > 0 ? 'danger-color' : ''}`}>{dashboardData.pedidosPendentes}</p>
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
                            <Line type="monotone" dataKey="vendas" stroke="var(--primary-color)" strokeWidth={3} />
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
                            <Bar dataKey="vendas" fill="var(--accent-color)" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default EstatisticasComponente;
