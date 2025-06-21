// app\(interno)\dashboard\integracoes\facebook-meta\page.tsx (CORRIGIDO: REMOVIDO EXPORT DEFAULT DUPLICADO)
'use client'; // ESSENCIAL: DEVE SER A PRIMEIRA LINHA

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaFacebookF, FaSyncAlt, FaToggleOn, FaToggleOff, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaPlug } from 'react-icons/fa';

// Definindo cores e fontes
const colors = {
    primary: '#6b21a8',
    secondary: '#a21caf',
    accent: '#7C3AED',
    text: '#333333',
    lightText: '#666666',
    border: '#e0e0e0',
    background: '#f8f9fa',
    white: '#ffffff',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
    facebookBlue: '#1877F2',
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

// Interface para as Configurações do Facebook/Meta
type FacebookMetaConfig = {
    integracaoAtiva: boolean;
    conectadoMeta: boolean;
    facebookPageId: string;
    facebookPageName: string;
    instagramBusinessAccountId: string;
    instagramBusinessAccountName: string;
    catalogId: string;
    catalogName: string;
    pixelId: string;
    pixelName: string;
    sincronizacaoAutomatica: boolean;
    ultimaSincronizacao: string;
    statusUltimaSincronizacao: 'sucesso' | 'falha' | 'pendente' | 'nunca';
    totalProdutosSincronizados: number;
};

// Dados mockados ou carregados do localStorage
const getFacebookMetaConfigInicial = (): FacebookMetaConfig => {
    if (typeof window !== 'undefined') {
        const storedConfig = localStorage.getItem('facebookMetaConfig');
        return storedConfig ? JSON.parse(storedConfig) : {
            integracaoAtiva: false,
            conectadoMeta: false,
            facebookPageId: '', facebookPageName: '',
            instagramBusinessAccountId: '', instagramBusinessAccountName: '',
            catalogId: '', catalogName: '',
            pixelId: '', pixelName: '',
            sincronizacaoAutomatica: true,
            ultimaSincronizacao: 'N/A',
            statusUltimaSincronizacao: 'nunca',
            totalProdutosSincronizados: 0,
        };
    }
    return {} as FacebookMetaConfig;
};

const mockMetaPages = [
    { id: '1234567890', name: 'Minha Loja no Facebook' },
    { id: '1122334455', name: 'Minha Marca Oficial' },
];
const mockMetaInstagramAccounts = [
    { id: '0987654321', name: 'minhaloja_oficial' },
    { id: '5544332211', name: 'minhamarca_br' },
];
const mockMetaCatalogs = [
    { id: 'CAT_PHANDSHOP_1', name: 'Catálogo Principal de Produtos' },
    { id: 'CAT_PROMO_VERAO', name: 'Catálogo Promo Verão 2025' },
];
const mockMetaPixels = [
    { id: 'PIXEL_PHAND_1', name: 'Pixel Principal da Loja' },
    { id: 'PIXEL_CAMPANHA_A', name: 'Pixel Campanha A' },
];


// CORREÇÃO: Removido 'export default' daqui para ter apenas um no final
const FacebookMetaIntegrationPage: React.FC = () => {
    const [config, setConfig] = useState<FacebookMetaConfig>(getFacebookMetaConfigInicial());
    const [isClient, setIsClient] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setIsClient(true);
        const storedConfig = localStorage.getItem('facebookMetaConfig');
        if (storedConfig) {
            setConfig(JSON.parse(storedConfig));
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('facebookMetaConfig', JSON.stringify(config));
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
            localStorage.setItem('facebookMetaConfig', JSON.stringify(config));
            alert('Configurações de Integração com Facebook/Meta salvas com sucesso!');
        }
    };

    // SIMULAÇÃO: Conectar à conta do Meta
    const handleConectarMeta = () => {
        alert('Simulando conexão com Facebook/Meta... (Em um ambiente real, um pop-up de OAuth abriria aqui)');
        setTimeout(() => {
            setConfig(prev => ({
                ...prev,
                conectadoMeta: true,
                integracaoAtiva: true,
                facebookPageId: mockMetaPages[0].id,
                facebookPageName: mockMetaPages[0].name,
                instagramBusinessAccountId: mockMetaInstagramAccounts[0].id,
                instagramBusinessAccountName: mockMetaInstagramAccounts[0].name,
                catalogId: mockMetaCatalogs[0].id,
                catalogName: mockMetaCatalogs[0].name,
                pixelId: mockMetaPixels[0].id,
                pixelName: mockMetaPixels[0].name,
                statusUltimaSincronizacao: 'sucesso',
                ultimaSincronizacao: new Date().toLocaleString(),
                totalProdutosSincronizados: 100,
            }));
            alert('Conexão e vinculação de ativos Meta simulada com sucesso!');
        }, 2000);
    };

    const handleDesconectarMeta = () => {
        if (window.confirm('Tem certeza que deseja desconectar a integração com o Facebook/Meta?')) {
            setConfig(prev => ({
                ...prev,
                conectadoMeta: false,
                integracaoAtiva: false,
                facebookPageId: '', facebookPageName: '',
                instagramBusinessAccountId: '', instagramBusinessAccountName: '',
                catalogId: '', catalogName: '',
                pixelId: '', pixelName: '',
                statusUltimaSincronizacao: 'nunca',
                ultimaSincronizacao: 'N/A',
                totalProdutosSincronizados: 0,
            }));
            alert('Integração com Facebook/Meta desconectada.');
        }
    };

    const handleSincronizarAgora = () => {
        alert('Sincronização do catálogo iniciada! (Simulado)');
        setConfig(prev => ({
            ...prev,
            statusUltimaSincronizacao: 'pendente',
            ultimaSincronizacao: new Date().toLocaleString(),
        }));
        setTimeout(() => {
            setConfig(prev => ({
                ...prev,
                statusUltimaSincronizacao: 'sucesso',
                totalProdutosSincronizados: Math.floor(Math.random() * 500) + 100,
            }));
            alert('Catálogo sincronizado com sucesso! (Simulado)');
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

    const toggleSwitchStyle: React.CSSProperties = {
        position: 'relative',
        display: 'inline-block',
        width: '44px',
        height: '24px',
        margin: '0 10px',
    };

    const toggleSliderStyle: React.CSSProperties = {
        position: 'absolute',
        cursor: 'pointer',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: config.integracaoAtiva ? colors.success : colors.lightText,
        transition: '.4s',
        borderRadius: '24px',
    };

    const toggleSliderBeforeStyle: React.CSSProperties = {
        position: 'absolute',
        content: '""',
        height: '16px',
        width: '16px',
        left: '4px',
        bottom: '4px',
        backgroundColor: colors.white,
        transition: '.4s',
        borderRadius: '50%',
        transform: config.integracaoAtiva ? 'translateX(20px)' : 'translateX(0)',
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
                Integração com Facebook / Meta
            </h1>

            {/* Seção de Conexão e Status */}
            <div style={{
                ...baseCardStyle,
                minWidth: 'auto', flex: 'none',
                maxWidth: '800px', margin: '0 auto 40px auto',
                padding: '30px',
            }}>
                <h2 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '20px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
                    Conexão com a Conta Meta
                </h2>

                {!config.conectadoMeta ? (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: typography.bodySize, marginBottom: '20px' }}>
                            Conecte sua conta do Facebook/Meta para sincronizar seus produtos e ativar o Instagram Shopping.
                        </p>
                        <button
                            onClick={handleConectarMeta}
                            style={{
                                padding: '12px 25px',
                                backgroundColor: colors.facebookBlue,
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
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#0e62d4'}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.facebookBlue}
                        >
                            <FaFacebookF size={20} /> Conectar com Facebook / Meta
                        </button>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ fontSize: typography.bodySize, color: colors.success, fontWeight: 'bold', marginBottom: '10px' }}>
                            <FaCheckCircle size={20} style={{ marginRight: '10px' }} /> Conectado à Conta Meta!
                        </p>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText }}>
                            Última atualização da conexão: {new Date().toLocaleString()}
                        </p>
                        <button
                            onClick={handleDesconectarMeta}
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
                            Desconectar Conta Meta
                        </button>
                    </div>
                )}
            </div>

            {config.conectadoMeta && ( // Somente mostra o resto se estiver conectado
                <div style={{
                    ...baseCardStyle,
                    minWidth: 'auto', flex: 'none',
                    maxWidth: '800px', margin: '0 auto 40px auto',
                    padding: '30px',
                }}>
                    <h2 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '20px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
                        Configurações de Ativos Meta
                    </h2>
                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginBottom: '20px' }}>
                        Selecione as contas e ativos que você deseja vincular à sua loja.
                    </p>

                    {/* Seleção de Página do Facebook */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="facebookPageId" style={labelStyle}>Página do Facebook Vinculada:</label>
                        <select
                            id="facebookPageId"
                            name="facebookPageId"
                            value={config.facebookPageId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selectedPage = mockMetaPages.find(p => p.id === e.target.value);
                                setConfig(prev => ({ ...prev, facebookPageId: e.target.value, facebookPageName: selectedPage?.name || '' }));
                            }}
                            style={{ ...inputStyleMinimal, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
                        >
                            <option value="">Selecione uma página</option>
                            {mockMetaPages.map(page => (
                                <option key={page.id} value={page.id}>{page.name}</option>
                            ))}
                        </select>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>
                            Página selecionada: <strong>{config.facebookPageName || 'Nenhuma'}</strong>
                        </p>
                    </div>

                    {/* Seleção de Conta Comercial do Instagram */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="instagramBusinessAccountId" style={labelStyle}>Conta Comercial do Instagram:</label>
                        <select
                            id="instagramBusinessAccountId"
                            name="instagramBusinessAccountId"
                            value={config.instagramBusinessAccountId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selectedAccount = mockMetaInstagramAccounts.find(a => a.id === e.target.value);
                                setConfig(prev => ({ ...prev, instagramBusinessAccountId: e.target.value, instagramBusinessAccountName: selectedAccount?.name || '' }));
                            }}
                            style={{ ...inputStyleMinimal, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
                        >
                            <option value="">Selecione uma conta Instagram</option>
                            {mockMetaInstagramAccounts.map(account => (
                                <option key={account.id} value={account.id}>{account.name}</option>
                            ))}
                        </select>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>
                            Conta Instagram selecionada: <strong>{config.instagramBusinessAccountName || 'Nenhuma'}</strong>
                        </p>
                    </div>

                    {/* Seleção de Catálogo de Produtos */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="catalogId" style={labelStyle}>Catálogo de Produtos:</label>
                        <select
                            id="catalogId"
                            name="catalogId"
                            value={config.catalogId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selectedCatalog = mockMetaCatalogs.find(c => c.id === e.target.value);
                                setConfig(prev => ({ ...prev, catalogId: e.target.value, catalogName: selectedCatalog?.name || '' }));
                            }}
                            style={{ ...inputStyleMinimal, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
                        >
                            <option value="">Selecione um catálogo</option>
                            {mockMetaCatalogs.map(catalog => (
                                <option key={catalog.id} value={catalog.id}>{catalog.name}</option>
                            ))}
                        </select>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>
                            Catálogo selecionado: <strong>{config.catalogName || 'Nenhum'}</strong>
                        </p>
                    </div>

                    {/* Seleção de Pixel do Facebook */}
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="pixelId" style={labelStyle}>Pixel do Facebook:</label>
                        <select
                            id="pixelId"
                            name="pixelId"
                            value={config.pixelId}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                const selectedPixel = mockMetaPixels.find(p => p.id === e.target.value);
                                setConfig(prev => ({ ...prev, pixelId: e.target.value, pixelName: selectedPixel?.name || '' }));
                            }}
                            style={{ ...inputStyleMinimal, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
                        >
                            <option value="">Selecione um pixel</option>
                            {mockMetaPixels.map(pixel => (
                                <option key={pixel.id} value={pixel.id}>{pixel.name}</option>
                            ))}
                        </select>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>
                            Pixel selecionado: <strong>{config.pixelName || 'Nenhum'}</strong>
                        </p>
                    </div>

                    <h2 style={sectionTitleStyle}>Sincronização de Catálogo</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                        <label htmlFor="sincronizacaoAutomatica" style={labelStyle}>Sincronizar Catálogo Automaticamente:</label>
                        <label style={toggleSwitchStyle}>
                            <input
                                type="checkbox"
                                id="sincronizacaoAutomatica"
                                name="sincronizacaoAutomatica"
                                checked={config.sincronizacaoAutomatica}
                                onChange={handleChange}
                                style={{ display: 'none' }}
                            />
                            <span style={toggleSliderStyle}>
                                <span style={toggleSliderBeforeStyle}></span>
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
                            Total de produtos sincronizados: {config.totalProdutosSincronizados}
                        </p>
                    </div>

                    <button
                        onClick={handleSincronizarAgora}
                        disabled={config.statusUltimaSincronizacao === 'pendente'}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: colors.facebookBlue,
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
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => { if (config.statusUltimaSincronizacao !== 'pendente') e.currentTarget.style.backgroundColor = '#0e62d4'; }}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => { if (config.statusUltimaSincronizacao !== 'pendente') e.currentTarget.style.backgroundColor = colors.facebookBlue; }}
                        onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => { if (config.statusUltimaSincronizacao !== 'pendente') e.currentTarget.style.transform = 'translateY(1px)'; }}
                        onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => { if (config.statusUltimaSincronizacao !== 'pendente') e.currentTarget.style.transform = 'translateY(0)'; }}
                    >
                        <FaSyncAlt size={14} /> Sincronizar Catálogo Agora
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
                            backgroundColor: colors.primary,
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
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
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

export default FacebookMetaIntegrationPage;