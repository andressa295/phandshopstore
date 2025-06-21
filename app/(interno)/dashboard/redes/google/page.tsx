'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaSyncAlt, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';

// Definindo cores e fontes
const colors = {
    primary: '#4285F4', // Cor do Google
    secondary: '#34A853',
    accent: '#FBBC05',
    text: '#333333',
    lightText: '#666666',
    border: '#e0e0e0',
    background: '#f8f9fa',
    white: '#ffffff',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
};

const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
    bodySize: '0.95rem',
    smallSize: '0.8rem',
};

// Estilo base para os cards
const baseCardStyle: React.CSSProperties = {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    fontFamily: typography.fontFamily,
};

// Interface para as Configurações do Google Shopping
type GoogleShoppingConfig = {
    integracaoAtiva: boolean;
    conectadoGoogle: boolean;
    merchantId: string;
    merchantName: string;
    feedId: string;
    feedName: string;
    sincronizacaoAutomatica: boolean;
    ultimaSincronizacao: string;
    statusUltimaSincronizacao: 'sucesso' | 'falha' | 'pendente' | 'nunca';
    totalProdutosAprovados: number;
};

// Dados mockados ou carregados do localStorage
const getGoogleShoppingConfigInicial = (): GoogleShoppingConfig => {
    if (typeof window !== 'undefined') {
        const storedConfig = localStorage.getItem('googleShoppingConfig');
        return storedConfig ? JSON.parse(storedConfig) : {
            integracaoAtiva: false,
            conectadoGoogle: false,
            merchantId: '', merchantName: '',
            feedId: '', feedName: '',
            sincronizacaoAutomatica: true,
            ultimaSincronizacao: 'N/A',
            statusUltimaSincronizacao: 'nunca',
            totalProdutosAprovados: 0,
        };
    }
    return {} as GoogleShoppingConfig;
};

// Dados mockados para simular seletores do Google API
const mockGoogleMerchants = [
    { id: '1234567890', name: 'Minha Loja no Google' },
    { id: '9876543210', name: 'Minha Marca Oficial' },
];
const mockGoogleFeeds = [
    { id: 'FEED_PHANDSHOP_1', name: 'Feed Principal de Produtos' },
    { id: 'FEED_PROMO_VERAO', name: 'Feed Promo Verão 2025' },
];


export default function GoogleShoppingIntegrationPage() {
    const [config, setConfig] = useState<GoogleShoppingConfig>(getGoogleShoppingConfigInicial());
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        const storedConfig = localStorage.getItem('googleShoppingConfig');
        if (storedConfig) {
            setConfig(JSON.parse(storedConfig));
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('googleShoppingConfig', JSON.stringify(config));
        }
    }, [config, isClient]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('googleShoppingConfig', JSON.stringify(config));
            alert('Configurações de Integração com Google Shopping salvas com sucesso!');
        }
    };

    // SIMULAÇÃO: Conectar à conta do Google
    const handleConectarGoogle = () => {
        alert('Simulando conexão com Google Shopping... (Em um ambiente real, um pop-up de OAuth abriria aqui)');
        setTimeout(() => {
            setConfig(prev => ({
                ...prev,
                conectadoGoogle: true,
                integracaoAtiva: true,
                merchantId: mockGoogleMerchants[0].id,
                merchantName: mockGoogleMerchants[0].name,
                feedId: mockGoogleFeeds[0].id,
                feedName: mockGoogleFeeds[0].name,
                statusUltimaSincronizacao: 'sucesso',
                ultimaSincronizacao: new Date().toLocaleString(),
                totalProdutosAprovados: 100,
            }));
            alert('Conexão e vinculação de ativos Google Shopping simulada com sucesso!');
        }, 2000);
    };

    const handleDesconectarGoogle = () => {
        if (window.confirm('Tem certeza que deseja desconectar a integração com o Google Shopping?')) {
            setConfig(prev => ({
                ...prev,
                conectadoGoogle: false,
                integracaoAtiva: false,
                merchantId: '', merchantName: '',
                feedId: '', feedName: '',
                statusUltimaSincronizacao: 'nunca',
                ultimaSincronizacao: 'N/A',
                totalProdutosAprovados: 0,
            }));
            alert('Integração com Google Shopping desconectada.');
        }
    };

    const handleSincronizarAgora = () => {
        alert('Sincronização do feed iniciada! (Simulado)');
        setConfig(prev => ({
            ...prev,
            statusUltimaSincronizacao: 'pendente',
            ultimaSincronizacao: new Date().toLocaleString(),
        }));
        setTimeout(() => {
            setConfig(prev => ({
                ...prev,
                statusUltimaSincronizacao: 'sucesso',
                totalProdutosAprovados: Math.floor(Math.random() * 500) + 100,
            }));
            alert('Feed sincronizado com sucesso! (Simulado)');
        }, 3000);
    };

    const inputStyleMinimal: React.CSSProperties = {
        padding: '10px 12px',
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        fontSize: typography.bodySize,
        fontFamily: typography.fontFamily,
        color: colors.text,
        backgroundColor: colors.white,
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease',
    };

    const labelStyle: React.CSSProperties = {
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: typography.smallSize,
        color: colors.text,
        fontFamily: typography.fontFamily,
        display: 'block',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: typography.subHeadingSize,
        color: colors.primary,
        fontWeight: 'bold',
        marginBottom: '15px',
        marginTop: '30px',
        borderBottom: `2px solid ${colors.primary}`,
        paddingBottom: '5px',
        width: '100%',
        fontFamily: typography.fontFamily,
    };

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
                Integração com Google Shopping
            </h1>

            {/* Seção de Conexão e Status */}
            <div style={{
                ...baseCardStyle,
                minWidth: 'auto', flex: 'none',
                maxWidth: '800px', margin: '0 auto 40px auto',
                padding: '30px',
            }}>
                <h2 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '20px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
                    Conexão com a Conta Google
                </h2>

                {!config.conectadoGoogle ? (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: typography.bodySize, marginBottom: '20px' }}>
                            Conecte sua conta do Google para exibir seus produtos no Google Shopping.
                        </p>
                        <button
                            onClick={handleConectarGoogle}
                            style={{
                                padding: '12px 25px',
                                backgroundColor: colors.primary, // Cor do Google
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: typography.bodySize,
                                transition: 'background-color 0.2s ease',
                                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                                display: 'inline-flex', alignItems: 'center', gap: '10px',
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#1A73E8'} // Cor mais clara do Google
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                        >
                            <FaGoogle size={20} /> Conectar com Google Shopping
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: typography.bodySize, color: colors.success, fontWeight: 'bold', marginBottom: '10px' }}>
                            <FaCheckCircle size={20} style={{ marginRight: '10px' }} /> Conectado à Conta Google!
                        </p>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText }}>
                            Última atualização da conexão: {new Date().toLocaleString()}
                        </p>
                        <button
                            onClick={handleDesconectarGoogle}
                            style={{
                                padding: '8px 15px',
                                backgroundColor: colors.danger,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: typography.smallSize,
                                transition: 'background-color 0.2s ease',
                                marginTop: '20px',
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#c82333'}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.danger}
                        >
                            Desconectar Conta Google
                        </button>
                    </div>
                )}
            </div>

            {config.conectadoGoogle && ( // Somente mostra o resto se estiver conectado
                <div style={{
                    ...baseCardStyle,
                    minWidth: 'auto', flex: 'none',
                    maxWidth: '800px', margin: '0 auto 40px auto',
                    padding: '30px',
                }}>
                    <h2 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '20px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
                        Configurações do Google Shopping
                    </h2>
                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginBottom: '20px' }}>
                        Selecione sua conta do Google Merchant Center e o feed de produtos.
                    </p>

                    {/* Seleção do Merchant Center */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="merchantId" style={labelStyle}>Conta do Google Merchant Center:</label>
                        <select
                            id="merchantId"
                            name="merchantId"
                            value={config.merchantId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selectedMerchant = mockGoogleMerchants.find(m => m.id === e.target.value);
                                setConfig(prev => ({ ...prev, merchantId: e.target.value, merchantName: selectedMerchant?.name || '' }));
                            }}
                            style={{ ...inputStyleMinimal, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
                        >
                            <option value="">Selecione uma conta</option>
                            {mockGoogleMerchants.map(merchant => (
                                <option key={merchant.id} value={merchant.id}>{merchant.name}</option>
                            ))}
                        </select>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>
                            Conta selecionada: <strong>{config.merchantName || 'Nenhuma'}</strong>
                        </p>
                    </div>

                    {/* Seleção do Feed de Produtos */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="feedId" style={labelStyle}>Feed de Produtos:</label>
                        <select
                            id="feedId"
                            name="feedId"
                            value={config.feedId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selectedFeed = mockGoogleFeeds.find(f => f.id === e.target.value);
                                setConfig(prev => ({ ...prev, feedId: e.target.value, feedName: selectedFeed?.name || '' }));
                            }}
                            style={{ ...inputStyleMinimal, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
                        >
                            <option value="">Selecione um feed</option>
                            {mockGoogleFeeds.map(feed => (
                                <option key={feed.id} value={feed.id}>{feed.name}</option>
                            ))}
                        </select>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>
                            Feed selecionado: <strong>{config.feedName || 'Nenhum'}</strong>
                        </p>
                    </div>

                    <h2 style={sectionTitleStyle}>Sincronização do Feed</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <label htmlFor="sincronizacaoAutomatica" style={labelStyle}>Sincronizar Feed Automaticamente:</label>
                        <label style={{
                            position: 'relative',
                            display: 'inline-block',
                            width: '44px',
                            height: '24px',
                            margin: '0 10px',
                        }}>
                            <input
                                type="checkbox"
                                id="sincronizacaoAutomatica"
                                name="sincronizacaoAutomatica"
                                checked={config.sincronizacaoAutomatica}
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                            <span style={{
                                position: 'absolute',
                                cursor: 'pointer',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: config.sincronizacaoAutomatica ? colors.success : colors.lightText,
                                transition: '.4s',
                                borderRadius: '24px',
                            }}>
                                <span style={{
                                    position: 'absolute',
                                    content: '""',
                                    height: '16px',
                                    width: '16px',
                                    left: '4px',
                                    bottom: '4px',
                                    backgroundColor: colors.white,
                                    transition: '.4s',
                                    borderRadius: '50%',
                                    transform: config.sincronizacaoAutomatica ? 'translateX(20px)' : 'translateX(0)',
                                }}></span>
                            </span>
                        </label>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <p style={labelStyle}>Última Sincronização:</p>
                        <span style={{ fontSize: typography.bodySize, color: colors.text }}>
                            {config.ultimaSincronizacao}
                        </span>
                        <span style={{ marginLeft: '10px', fontWeight: 'bold', color: config.statusUltimaSincronizacao === 'sucesso' ? colors.success : (config.statusUltimaSincronizacao === 'falha' ? colors.danger : colors.lightText) }}>
                            {config.statusUltimaSincronizacao === 'sucesso' && <FaCheckCircle size={14} style={{ marginRight: '5px' }} />}
                            {config.statusUltimaSincronizacao === 'falha' && <FaTimesCircle size={14} style={{ marginRight: '5px' }} />}
                            {config.statusUltimaSincronizacao === 'pendente' && <FaSyncAlt size={14} style={{ marginRight: '5px', animation: 'spin 1s linear infinite' }} />}
                            {config.statusUltimaSincronizacao === 'nunca' && <FaExclamationTriangle size={14} style={{ marginRight: '5px', color: colors.warning }} />}
                            {config.statusUltimaSincronizacao.toUpperCase()}
                        </span>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>
                            Total de produtos aprovados: {config.totalProdutosAprovados}
                        </p>
                    </div>

                    <button
                        onClick={handleSincronizarAgora}
                        disabled={config.statusUltimaSincronizacao === 'pendente'}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: colors.primary,
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: config.statusUltimaSincronizacao === 'pendente' ? 'not-allowed' : 'pointer',
                            fontWeight: 'bold',
                            fontSize: typography.bodySize,
                            transition: 'background-color 0.2s ease, transform 0.1s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            marginTop: '20px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            opacity: config.statusUltimaSincronizacao === 'pendente' ? 0.7 : 1,
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { if (config.statusUltimaSincronizacao !== 'pendente') e.currentTarget.style.backgroundColor = '#1A73E8'; }} // Cor mais clara do Google
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { if (config.statusUltimaSincronizacao !== 'pendente') e.currentTarget.style.backgroundColor = colors.primary; }}
                        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => { if (config.statusUltimaSincronizacao !== 'pendente') e.currentTarget.style.transform = 'translateY(1px)'; }}
                        onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => { if (config.statusUltimaSincronizacao !== 'pendente') e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <FaSyncAlt size={14} /> Sincronizar Feed Agora
                    </button>
                    <style jsx>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                    `}</style>

                    <button
                        onClick={handleSave}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: colors.secondary, // Cor secundária
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: typography.bodySize,
                            transition: 'background-color 0.2s ease, transform 0.1s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            marginTop: '20px',
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#0F9D58'} // Cor secundária mais clara
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.secondary}
                        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'translateY(1px)'}
                        onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Salvar Configurações
                    </button>
                </div>
            )}
        </div>
    );
};