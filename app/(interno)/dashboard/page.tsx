'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend } from 'recharts';
import Link from 'next/link';
import { FaBoxes, FaClipboardList, FaChartLine, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaPlus, FaTags, FaShippingFast, FaExternalLinkAlt } from 'react-icons/fa';
import { useUser } from './UserContext';


const colors = {
    primary: '#6b21a8', secondary: '#a21caf', accent: '#7C3AED', text: '#333333', lightText: '#666666', border: '#e0e0e0', background: '#f8f9fa', white: '#ffffff', success: '#28a745', danger: '#dc3545', warning: '#ffc107', info: '#17a2b8',
};
const typography = {
    fontFamily: 'Poppins, sans-serif', headingSize: '1.8rem', subHeadingSize: '1.2rem', bodySize: '0.95rem', smallSize: '0.8rem',
};

const kpiCardStyle: React.CSSProperties = { backgroundColor: colors.white, borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flex: '1 1 200px', minWidth: '200px', boxSizing: 'border-box', fontFamily: typography.fontFamily, };
const alertCardStyle: React.CSSProperties = { backgroundColor: colors.white, borderRadius: 12, padding: 24, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', flex: '1 1 300px', minWidth: '300px', boxSizing: 'border-box', fontFamily: typography.fontFamily, };
const quickActionBtnStyle: React.CSSProperties = { backgroundColor: colors.primary, color: colors.white, border: 'none', padding: '12px 18px', borderRadius: 8, cursor: 'pointer', fontWeight: 500, fontSize: typography.bodySize, transition: 'background-color 0.2s ease, transform 0.1s ease', flexShrink: 0, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', textDecoration: 'none', };

const dashboardData = { vendasHoje: 1230.50, visitantesHoje: 342, produtosEmEstoque: 128, pedidosPendentes: 7, faturamentoMes: 45000.75, taxaConversao: 2.3, ticketMedio: 150.25, estoqueBaixoAlert: 5, vendasSemanaisGrafico: [{ name: 'Dom', vendas: 800 }, { name: 'Seg', vendas: 1500 }, { name: 'Ter', vendas: 2000 }, { name: 'Qua', vendas: 1800 }, { name: 'Qui', vendas: 2500 }, { name: 'Sex', vendas: 3000 }, { name: 'Sáb', vendas: 1200 }, ], };


export default function DashboardPage() {
    // AGORA CONSUME OS DADOS DO CONTEXTO DE USUÁRIO
    const { user, profile, loading } = useUser();

    // Extrai o nome, plano e recorrência do perfil - CORREÇÃO AQUI
    const userFullName = profile?.nome_completo || (user?.email ? user.email.split('@')[0] : 'Usuário');
    const userPlan = profile?.plano;
    const userRecorrencia = profile?.recorrencia;

    // Estado de carregamento do usuário (vem do contexto)
    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: typography.fontFamily, color: colors.text }}>
                <h1 style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.primary }}>
                    Carregando sua Dashboard...
                </h1>
                <p style={{ fontSize: typography.bodySize, color: colors.lightText, marginTop: '16px' }}>
                    Por favor, aguarde enquanto carregamos seus dados.
                </p>
            </div>
        );
    }

    // Se o usuário não for carregado (e o UserProvider já teria redirecionado para /login)
    // Este caso é mais um fallback, pois o UserProvider já faria o redirecionamento.
    if (!user) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', fontFamily: typography.fontFamily, color: colors.danger }}>
                <h1 style={{ fontSize: typography.headingSize, fontWeight: 'bold' }}>Acesso Negado!</h1>
                <p style={{ fontSize: typography.bodySize, color: colors.lightText, marginTop: '16px' }}>
                    Você precisa estar logado para acessar esta página.
                </p>
                <Link href="/login" style={{ marginTop: '20px', display: 'inline-block', color: colors.accent, textDecoration: 'underline' }}>
                    Ir para o Login
                </Link>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: typography.fontFamily, color: colors.text }}>
            <h1 style={{ fontSize: typography.headingSize, fontWeight: 'bold', marginBottom: '8px', color: colors.primary }}>
                Bem-vindo de volta, {userFullName}!
            </h1>
            <p style={{ fontSize: typography.bodySize, color: colors.lightText, marginBottom: '32px' }}>
                Aqui está um resumo do desempenho da sua loja.
            </p>

            {userPlan && (
                <div style={{
                    marginTop: '20px', padding: '15px', borderRadius: '8px',
                    backgroundColor: '#e0f7fa', border: '1px solid #00bcd4',
                    color: '#00796b', marginBottom: '32px'
                }}>
                    <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Seu plano atual:</p>
                    <h2 style={{ margin: '0', fontSize: '24px', color: '#00838f' }}>
                        {userPlan.replace('plano_', 'Plano ').replace(/\b\w/g, (char: string) => char.toUpperCase())}
                        <span style={{ fontSize: '16px', color: '#333' }}> ({userRecorrencia})</span>
                    </h2>
                </div>
            )}

            {/* Cards de Métricas (KPIs) */}
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
                <div style={kpiCardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: '8px', color: colors.primary }}>Vendas Hoje</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>R$ {dashboardData.vendasHoje.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style={kpiCardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: '8px', color: colors.primary }}>Visitantes Hoje</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>{dashboardData.visitantesHoje}</p>
                </div>
                <div style={kpiCardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: '8px', color: colors.primary }}>Faturamento Mês</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>R$ {dashboardData.faturamentoMes.toFixed(2).replace('.', ',')}</p>
                </div>
                <div style={kpiCardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: '8px', color: colors.primary }}>Taxa de Conversão</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>{dashboardData.taxaConversao}%</p>
                </div>
                <div style={kpiCardStyle}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: '8px', color: colors.primary }}>Ticket Médio</h2>
                    <p style={{ fontSize: typography.headingSize, fontWeight: 'bold', color: colors.text }}>R$ {dashboardData.ticketMedio.toFixed(2).replace('.', ',')}</p>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '40px' }}>
                <div style={{ ...alertCardStyle, borderColor: (dashboardData.pedidosPendentes > 0 || dashboardData.estoqueBaixoAlert > 0) ? colors.warning : colors.border }}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: '16px', color: colors.primary }}>🔔 Alertas Importantes</h2>
                    
                    {dashboardData.pedidosPendentes > 0 ? (
                        <Link href="/dashboard/vendas/lista" style={{ textDecoration: 'none', display: 'block', marginBottom: '8px' }}>
                            <button
                                style={{
                                    ...quickActionBtnStyle,
                                    backgroundColor: colors.danger,
                                    width: '100%',
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#c82333'}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.danger}
                            >
                                <FaClipboardList size={18} /> {dashboardData.pedidosPendentes} Pedidos Pendentes!
                            </button>
                        </Link>
                    ) : (
                        <p style={{ fontSize: typography.bodySize, color: colors.success, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCheckCircle size={18} /> Nenhum pedido pendente.
                        </p>
                    )}
                    
                    {dashboardData.produtosEmEstoque < 50 || dashboardData.estoqueBaixoAlert > 0 ? (
                        <Link href="/dashboard/produtos/lista" style={{ textDecoration: 'none', display: 'block' }}>
                            <button
                                style={{
                                    ...quickActionBtnStyle,
                                    backgroundColor: colors.danger,
                                    width: '100%',
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#c82333'}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.danger}
                            >
                                <FaBoxes size={18} /> {dashboardData.estoqueBaixoAlert} Produtos com Estoque Baixo!
                            </button>
                        </Link>
                    ) : (
                        <p style={{ fontSize: typography.bodySize, color: colors.success, display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FaCheckCircle size={18} /> Estoque OK.
                        </p>
                    )}
                </div>

                <div style={{ ...kpiCardStyle, flex: '2 1 500px', minWidth: '500px', height: '350px' }}>
                    <h2 style={{ fontSize: typography.subHeadingSize, marginBottom: '16px', color: colors.primary }}>📈 Vendas na Última Semana</h2>
                    <ResponsiveContainer width="100%" height="calc(100% - 30px)">
                        <LineChart data={dashboardData.vendasSemanaisGrafico} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                            <XAxis dataKey="name" stroke={colors.lightText} fontSize={typography.smallSize} />
                            <YAxis stroke={colors.lightText} fontSize={typography.smallSize} tickFormatter={(value: number) => `R$ ${value.toFixed(0)}`} />
                            <CartesianGrid stroke={colors.border} strokeDasharray="5 5" />
                            <Tooltip
                                contentStyle={{ backgroundColor: colors.white, border: `1px solid ${colors.border}`, borderRadius: '4px', fontSize: typography.smallSize }}
                                labelStyle={{ color: colors.primary, fontWeight: 'bold' }}
                                itemStyle={{ color: colors.text }}
                                formatter={(value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`}
                            />
                            <Line type="monotone" dataKey="vendas" stroke={colors.accent} strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6, stroke: colors.primary, fill: colors.white }} name="Vendas" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Ações Rápidas - MAIS VISUAIS */}
            <div style={{ marginBottom: '40px' }}>
                <h2 style={{ fontSize: typography.subHeadingSize, fontWeight: 'bold', marginBottom: '16px', color: colors.primary }}>🚀 Ações rápidas</h2>
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                    <Link href="/dashboard/produtos/novo" style={{ textDecoration: 'none' }}>
                        <button style={{ ...quickActionBtnStyle, backgroundColor: colors.accent }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                        >
                            <FaPlus size={14} /> Adicionar Produto
                        </button>
                    </Link>
                    <Link href="/dashboard/descontos/cupons" style={{ textDecoration: 'none' }}>
                        <button style={{ ...quickActionBtnStyle, backgroundColor: colors.secondary }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.secondary}
                        >
                            <FaTags size={14} /> Criar Cupom
                        </button>
                    </Link>
                    <Link href="/dashboard/vendas/lista" style={{ textDecoration: 'none' }}>
                        <button style={{ ...quickActionBtnStyle, backgroundColor: colors.info }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.info}
                        >
                            <FaClipboardList size={14} /> Ver Pedidos
                        </button>
                    </Link>
                    <Link href="https://sua-loja-real.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                        <button style={{ ...quickActionBtnStyle, backgroundColor: colors.success }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.success}
                        >
                            <FaExternalLinkAlt size={14} /> Abrir Loja Online
                        </button>
                    </Link>
                </div>
            </div>
            {/* --- Lógica para Mostrar/Ocultar Funcionalidades por Plano --- */}
            <h3 style={{ marginTop: '40px', fontSize: '20px', color: colors.primary }}>Funcionalidades Exclusivas do seu Plano:</h3>
            <ul style={{ listStyleType: 'none', padding: '0', color: colors.lightText }}>
                {userPlan === 'plano_basico' && (
                    <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                        ✅ Domínio Próprio
                    </li>
                )}

                {(userPlan === 'plano_essencial' || userPlan === 'plano_profissional' || userPlan === 'plano_premium') && (
                    <>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            ✅ Acesso a Todos os Temas
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            ✅ Tarifa por Venda de 0%
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            ✅ Produtos, Visitas e Usuários Ilimitados
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            ✅ Sacolinha do Instagram
                        </li>
                    </>
                )}

                {(userPlan === 'plano_profissional' || userPlan === 'plano_premium') && (
                    <>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            ⭐ Temas Profissionais
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            ⭐ Compre Junto
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            ⭐ Brindes no Carrinho
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            ⭐ Relatórios Avançados
                        </li>
                    </>
                )}

                {userPlan === 'plano_premium' && (
                    <>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            👑 Relatórios Complexos
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            👑 Atendimento Prioritário
                        </li>
                        <li style={{ marginBottom: '10px', fontSize: typography.bodySize, color: colors.text, fontWeight: 'bold' }}>
                            👑 Acesso Antecipado a Novas Funcionalidades
                        </li>
                    </>
                )}

                {userPlan === 'plano_gratis' && (
                    <li style={{ color: colors.danger, fontWeight: 'bold', marginTop: '20px', padding: '10px', backgroundColor: '#FFEBEE', borderRadius: '5px' }}>
                        Você está no Plano Grátis (2.5% de tarifa por venda).
                        <br />
                        <Link href="/planos" style={{ color: colors.accent, textDecoration: 'underline', fontWeight: 'normal' }}>
                            Faça upgrade para ter Tarifa Zero e mais recursos!
                        </Link>
                    </li>
                )}
            </ul>
        </div>
    );
}