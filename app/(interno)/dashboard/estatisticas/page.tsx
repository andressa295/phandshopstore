// app\(interno)\dashboard\estatisticas\page.tsx (EXPANDIDO COM MAIS KPIS E SELETOR DE PERÍODO)
'use client';

import React, { useState } from 'react'; // Adicionado useState
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';

// Definindo as cores e fontes principais para um estilo consistente
const colors = {
    primary: '#6b21a8', // Roxo principal
    secondary: '#a21caf', // Roxo secundário/destaque
    accent: '#7C3AED', // Roxo de acento, para botões e links
    text: '#333333',
    lightText: '#666666',
    border: '#e0e0e0',
    background: '#f8f9fa',
    white: '#ffffff',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
};

const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
    bodySize: '0.95rem',
    smallSize: '0.8rem',
};

const cardStyle: React.CSSProperties = {
    flex: '1 1 280px', // Flex-grow, flex-shrink, flex-basis. Garante que se expande, mas não menos que 280px
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    minWidth: 280, // Aumentado para melhor visualização
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
};

const dataVendasMensais = [ // Dados para o gráfico mensal
    { name: 'Jan', vendas: 4000 }, { name: 'Fev', vendas: 3000 }, { name: 'Mar', vendas: 5000 },
    { name: 'Abr', vendas: 4000 }, { name: 'Mai', vendas: 6000 }, { name: 'Jun', vendas: 7000 },
    { name: 'Jul', vendas: 6500 }, { name: 'Ago', vendas: 7500 }, { name: 'Set', vendas: 8000 },
    { name: 'Out', vendas: 7200 }, { name: 'Nov', vendas: 9000 }, { name: 'Dez', vendas: 10000 },
];

const dataVendasSemanais = [ // Novos dados mockados para gráfico semanal
    { name: 'Sem 1', vendas: 1000 }, { name: 'Sem 2', vendas: 1200 },
    { name: 'Sem 3', vendas: 800 }, { name: 'Sem 4', vendas: 1500 },
];

const dataProdutosVisitados = [
    { name: 'Camiseta', visitas: 1200 },
    { name: 'Tênis', visitas: 980 },
    { name: 'Caneca', visitas: 700 },
    { name: 'Smartwatch', visitas: 550 },
    { name: 'Aliança', visitas: 400 },
];


export default function EstatisticasPage() {
    const [periodo, setPeriodo] = useState('mesAtual'); // Estado para o período
    
    // Dados simulados que mudam com o período (apenas para demonstração)
    const getStats = (currentPeriod: string) => {
        switch(currentPeriod) {
            case 'hoje':
                return {
                    vendasHoje: 1230.50,
                    visitantes: 342,
                    estoque: 128,
                    pedidosPendentes: 7,
                    faturamentoMes: 1230.50, // Apenas o faturamento de hoje
                    ticketMedio: 175.50,
                    taxaConversao: 3.1,
                };
            case 'semanaAtual':
                return {
                    vendasHoje: 5120.00,
                    visitantes: 2100,
                    estoque: 110,
                    pedidosPendentes: 15,
                    faturamentoMes: 5120.00, // Apenas o da semana
                    ticketMedio: 160.00,
                    taxaConversao: 2.8,
                };
            case 'mesAtual': // Default
                return {
                    vendasHoje: 1230.50, // Continua sendo de hoje
                    visitantes: 12500,
                    estoque: 128,
                    pedidosPendentes: 7,
                    faturamentoMes: 45000.75,
                    ticketMedio: 150.25,
                    taxaConversao: 2.3,
                };
            case 'ultimos30dias':
                return {
                    vendasHoje: 1230.50,
                    visitantes: 15000,
                    estoque: 90,
                    pedidosPendentes: 10,
                    faturamentoMes: 52000.00,
                    ticketMedio: 165.00,
                    taxaConversao: 2.5,
                };
            default: return getStats('mesAtual');
        }
    };

    const stats = getStats(periodo);

    // Seleciona os dados do gráfico de vendas com base no período
    const currentVendasData = periodo === 'semanaAtual' ? dataVendasSemanais : dataVendasMensais;

    return (
        <div style={{
            padding: '20px',
            fontFamily: typography.fontFamily,
            color: colors.text,
            backgroundColor: colors.background,
            minHeight: 'calc(100vh - 100px)',
            boxSizing: 'border-box',
        }}>
            <h1 style={{
                marginBottom: '25px',
                fontSize: typography.headingSize,
                color: colors.primary,
                textAlign: 'center',
                fontWeight: 'bold',
                margin: 0, padding: 0,
            }}>
                Dashboard de Estatísticas
            </h1>

            {/* Seletor de Período */}
            <div style={{ marginBottom: '30px', textAlign: 'center' }}>
                <select
                    value={periodo}
                    onChange={(e) => setPeriodo(e.target.value)}
                    style={{
                        padding: '8px 15px',
                        borderRadius: '6px',
                        border: `1px solid ${colors.border}`,
                        fontSize: typography.bodySize,
                        fontFamily: typography.fontFamily,
                        backgroundColor: colors.white,
                        color: colors.text,
                        outline: 'none',
                        cursor: 'pointer',
                        appearance: 'none', // Remove a seta padrão do select
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 10px center',
                        backgroundSize: '16px',
                    }}
                >
                    <option value="hoje">Hoje</option>
                    <option value="semanaAtual">Semana Atual</option>
                    <option value="mesAtual">Mês Atual</option>
                    <option value="ultimos30dias">Últimos 30 Dias</option>
                    {/* Futuramente: opções de período personalizado */}
                </select>
            </div>

            {/* Seção de Cards de KPIs */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'center',
                marginBottom: '40px',
            }}>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: 12, color: colors.primary }}>💰 Vendas Hoje</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>R$ {stats.vendasHoje.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: 12, color: colors.primary }}>👥 Visitantes</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>{stats.visitantes}</p>
                </div>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: 12, color: colors.primary }}>📦 Estoque Baixo</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: stats.estoque < 50 ? colors.warning : colors.text }}>{stats.estoque} itens</p>
                </div>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: 12, color: colors.primary }}>⏳ Pedidos Pendentes</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: stats.pedidosPendentes > 0 ? colors.danger : colors.text }}>{stats.pedidosPendentes}</p>
                </div>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: 12, color: colors.primary }}>💸 Faturamento Total</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>R$ {stats.faturamentoMes.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: 12, color: colors.primary }}>📈 Ticket Médio</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>R$ {stats.ticketMedio.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style={cardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: 12, color: colors.primary }}>✨ Taxa de Conversão</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>{stats.taxaConversao.toFixed(1).replace('.', ',')}%</p>
                </div>
            </div>

            {/* Seção de Gráficos */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'center',
            }}>
                {/* Gráfico de Vendas Mensais/Semanais */}
                <div style={{
                    flex: '1 1 45%',
                    minWidth: '400px',
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    height: 400,
                    boxSizing: 'border-box',
                }}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: 16, color: colors.primary }}>📈 Vendas {periodo === 'semanaAtual' ? 'Semanais' : 'Mensais'}</h2>
                    <ResponsiveContainer width="100%" height="calc(100% - 30px)">
                        {/* AQUI ESTÁ A CORREÇÃO: Passando o LineChart DIRETAMENTE como único filho */}
                        <LineChart data={currentVendasData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <XAxis dataKey="name" stroke={colors.lightText} fontSize={typography.smallSize} />
                            <YAxis stroke={colors.lightText} fontSize={typography.smallSize} />
                            <CartesianGrid stroke={colors.border} strokeDasharray="5 5" />
                            <Tooltip
                                contentStyle={{ backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderRadius: '4px', fontSize: typography.smallSize }}
                                labelStyle={{ color: colors.primary, fontWeight: 'bold' }}
                                itemStyle={{ color: colors.text }}
                                formatter={(value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`}
                            />
                            <Line type="monotone" dataKey="vendas" stroke={colors.primary} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6, stroke: colors.accent, fill: colors.white }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Gráfico de Produtos Mais Visitados */}
                <div style={{
                    flex: '1 1 45%',
                    minWidth: '400px',
                    backgroundColor: colors.white,
                    borderRadius: 12,
                    padding: 24,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                    height: 400,
                    boxSizing: 'border-box',
                }}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: 16, color: colors.primary }}>📊 Produtos Mais Visitados</h2>
                    <ResponsiveContainer width="100%" height="calc(100% - 30px)">
                        {/* AQUI ESTÁ A CORREÇÃO: Passando o BarChart DIRETAMENTE como único filho */}
                        <BarChart data={dataProdutosVisitados} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <XAxis dataKey="name" stroke={colors.lightText} fontSize={typography.smallSize} />
                            <YAxis stroke={colors.lightText} fontSize={typography.smallSize} />
                            <CartesianGrid stroke={colors.border} strokeDasharray="5 5" />
                            <Tooltip
                                contentStyle={{ backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderRadius: '4px', fontSize: typography.smallSize }}
                                labelStyle={{ color: colors.primary, fontWeight: 'bold' }}
                                itemStyle={{ color: colors.text }}
                                formatter={(value: number) => `${value} visitas`}
                            />
                            <Bar dataKey="visitas" fill={colors.accent} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}