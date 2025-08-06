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

const EstatisticasComponente: React.FC<EstatisticasProps> = ({ data: initialData, lojaId }) => {
    const supabase = createClientComponentClient();
    const [periodo, setPeriodo] = useState('mesAtual');
    const [stats, setStats] = useState(initialData);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async (selectedPeriod: string) => {
        setLoading(true);
        let firstDay, lastDay;
        const today = new Date();

        switch (selectedPeriod) {
            case 'hoje':
                firstDay = new Date(today.getFullYear(), today.getMonth(), today.getDate()).toISOString();
                lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59).toISOString();
                break;
            case 'semanaAtual':
                const dayOfWeek = today.getDay();
                const startOfWeek = new Date(today.setDate(today.getDate() - dayOfWeek));
                firstDay = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate()).toISOString();
                lastDay = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6, 23, 59, 59).toISOString();
                break;
            case 'mesAtual':
            case 'ultimos30dias':
            default:
                firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
                lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();
                break;
        }

        // CORREÇÃO: Buscando dados de vendas da tabela 'vendas'
        const { data: vendasData, error: vendasError } = await supabase
            .from('vendas')
            .select('id, valor_total, created_at')
            .eq('loja_id', lojaId)
            .gte('created_at', firstDay)
            .lte('created_at', lastDay)
            .order('created_at', { ascending: true });

        // CORREÇÃO: Buscando dados de visitas da tabela 'historico_acessos'
        const { data: visitasData, error: visitasError } = await supabase
            .from('historico_acessos')
            .select('id, data_acesso')
            .eq('loja_id', lojaId)
            .gte('data_acesso', firstDay)
            .lte('data_acesso', lastDay);

        // CORREÇÃO: Buscando os produtos mais vendidos da tabela 'itens_venda'
        const { data: topProdutosData, error: produtosError } = await supabase
            .from('itens_venda')
            .select(`
                quantidade,
                preco_unitario,
                nome_produto
            `)
            .eq('loja_id', lojaId)
            .order('quantidade', { ascending: false })
            .limit(5);

        // CORREÇÃO: Buscando a contagem de produtos com estoque baixo
        const { count: estoqueBaixo, error: estoqueError } = await supabase
            .from('produtos')
            .select('estoque', { count: 'exact' })
            .eq('loja_id', lojaId)
            .lt('estoque', 50);

        // CORREÇÃO: Buscando a contagem de pedidos pendentes da tabela 'vendas'
        const { count: pedidosPendentes, error: pedidosError } = await supabase
            .from('vendas')
            .select('status', { count: 'exact' })
            .eq('loja_id', lojaId)
            .eq('status', 'pendente');


        if (vendasError || visitasError || produtosError || estoqueError || pedidosError) {
            console.error('Erro ao buscar dados dinâmicos:', vendasError || visitasError || produtosError || estoqueError || pedidosError);
        } else {
            setStats({
                vendas: vendasData || [],
                visitas: (visitasData || []).map(v => ({ id: v.id, created_at: v.data_acesso as string })),
                topProdutos: topProdutosData || [],
                estoqueBaixo: estoqueBaixo || 0,
                pedidosPendentes: pedidosPendentes || 0,
            });
        }
        setLoading(false);
    }, [lojaId, supabase]);

    useEffect(() => {
        fetchData(periodo);
    }, [periodo, fetchData]);

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

    const dashboardData = calculateStats(stats);
    
    if (loading) return <div className="loading">Carregando estatísticas...</div>;

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
