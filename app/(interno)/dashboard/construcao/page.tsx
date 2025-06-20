// app\(interno)\dashboard\construcao\page.tsx (CORRIGIDO: ERRO DE HIDRATAÇÃO ROBUSTO)
'use client'; // ESSENCIAL: DEVE SER A PRIMEIRA LINHA

import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
};

const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
    bodySize: '0.95rem',
    smallSize: '0.8rem',
};

// Estilo base para todos os cards
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

// Interface para as configurações da Página em Construção
type ConstructionPageConfig = {
    ativa: boolean;
    tituloAviso: string;
    mensagemDetalhada: string;
    senhaAcesso?: string;
};

// Dados padrões para inicialização no SERVIDOR (não usam localStorage)
const defaultConstructionConfig: ConstructionPageConfig = {
    ativa: false,
    tituloAviso: 'Estamos em Construção!',
    mensagemDetalhada: 'Em breve, sua nova experiência de compra estará no ar. Agradecemos a sua paciência!',
    senhaAcesso: '',
};

export default function PaginaEmConstrucaoSettings() {
    // CORREÇÃO: Inicializa o estado com os valores padrão/fallback, que são os mesmos no servidor e cliente.
    const [config, setConfig] = useState<ConstructionPageConfig>(defaultConstructionConfig);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [showPassword, setShowPassword] = useState(false);
    const [hasHydrated, setHasHydrated] = useState(false); // NOVO: Flag para controle de hidratação

    useEffect(() => {
        // Isso só roda no cliente, após a primeira renderização (hidratação)
        setHasHydrated(true); // Marca que a hidratação ocorreu
        const storedConfig = localStorage.getItem('constructionPageConfig');
        if (storedConfig) {
            setConfig(JSON.parse(storedConfig));
        }
    }, []); // Array de dependências vazio: executa apenas UMA VEZ no cliente

    useEffect(() => {
        // Salva no localStorage SOMENTE se a hidratação já ocorreu E as configurações mudarem
        if (hasHydrated) {
            localStorage.setItem('constructionPageConfig', JSON.stringify(config));
            console.log('Status do Site:', config.ativa ? 'EM CONSTRUÇÃO' : 'ONLINE');
        }
    }, [config, hasHydrated]); // Depende de config e hasHydrated


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSave = () => {
        if (typeof window !== 'undefined') { // Garante que está no cliente para o alert
            localStorage.setItem('constructionPageConfig', JSON.stringify(config));
            alert('Configurações da Página em Construção salvas com sucesso!');
        }
    };

    const previewContainerStyle: React.CSSProperties = {
        maxWidth: previewMode === 'mobile' ? '375px' : '100%',
        width: '100%',
        minHeight: '400px',
        margin: '0 auto',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        overflowY: 'auto',
        overflowX: 'hidden',
        transition: 'max-width 0.3s ease-in-out',
        backgroundColor: colors.white,
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
    };

    const previewContentStyle: React.CSSProperties = {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '90%',
        margin: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
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
        backgroundColor: config.ativa ? colors.danger : colors.success,
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
        transform: config.ativa ? 'translateX(20px)' : 'translateX(0)',
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
                Página "Site em Construção"
            </h1>

            {/* Seção de Configurações */}
            <div style={{
                ...baseCardStyle,
                minWidth: 'auto', flex: 'none',
                maxWidth: '800px', margin: '0 auto 40px auto',
                padding: '30px',
            }}>
                <h2 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '20px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
                    Configurações
                </h2>

                {/* Toggle LIGA/DESLIGA - AGORA FUNCIONAL */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
                    <label htmlFor="toggleAtiva" style={{ fontSize: typography.bodySize, fontWeight: 'bold' }}>
                        {config.ativa ? 'SITE OFFLINE (EM CONSTRUÇÃO)' : 'SITE ONLINE'}
                    </label>
                    <label style={toggleSwitchStyle}>
                        <input
                            type="checkbox"
                            id="toggleAtiva"
                            name="ativa"
                            checked={config.ativa}
                            onChange={handleChange}
                            style={{ opacity: 0, width: 0, height: 0 }} // Esconde o checkbox real mantendo-o funcional
                        />
                        <span style={toggleSliderStyle}>
                            <span style={toggleSliderBeforeStyle}></span>
                        </span>
                    </label>
                </div>

                <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginBottom: '20px', textAlign: 'center' }}>
                    Ao ativar o "Site em Construção", seus clientes verão uma página de aviso e não conseguirão acessar sua loja.
                </p>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="tituloAviso" style={{ fontSize: typography.bodySize, fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Título do Aviso:</label>
                    <input
                        type="text"
                        id="tituloAviso"
                        name="tituloAviso"
                        value={config.tituloAviso}
                        onChange={handleChange}
                        style={inputStyleMinimal}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="mensagemDetalhada" style={{ fontSize: typography.bodySize, fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Mensagem Detalhada:</label>
                    <textarea
                        id="mensagemDetalhada"
                        name="mensagemDetalhada"
                        value={config.mensagemDetalhada}
                        onChange={handleChange}
                        rows={5}
                        style={{ ...inputStyleMinimal, resize: 'vertical' }}
                    />
                </div>

                {/* Senha de Acesso */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="senhaAcesso" style={{ fontSize: typography.bodySize, fontWeight: 'bold', marginBottom: '5px', display: 'block' }}>Senha para Visualização (Opcional):</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="senhaAcesso"
                            name="senhaAcesso"
                            value={config.senhaAcesso || ''}
                            onChange={handleChange}
                            placeholder="Defina uma senha para acessar o site em construção"
                            style={{ ...inputStyleMinimal, flexGrow: 1 }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ padding: '8px', backgroundColor: colors.lightText, color: colors.white, border: 'none', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>
                        Se definida, esta senha será pedida para quem tentar acessar a loja enquanto ela estiver em construção.
                    </p>
                </div>
                
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

            {/* Seção de Preview da Página em Construção */}
            <div style={{
                ...baseCardStyle,
                minWidth: 'auto', flex: 'none',
                maxWidth: '800px', margin: '0 auto',
                padding: '30px',
            }}>
                <h2 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '20px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
                    Pré-visualização
                </h2>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' }}>
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        style={{ padding: '8px 15px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: previewMode === 'desktop' ? colors.primary : colors.white, color: previewMode === 'desktop' ? colors.white : colors.text, cursor: 'pointer' }}
                    >
                        Desktop
                    </button>
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        style={{ padding: '8px 15px', borderRadius: '6px', border: `1px solid ${colors.border}`, backgroundColor: previewMode === 'mobile' ? colors.primary : colors.white, color: previewMode === 'mobile' ? colors.white : colors.text, cursor: 'pointer' }}
                    >
                        Mobile
                    </button>
                </div>
                <div style={previewContainerStyle}>
                    {/* Placeholder para Cabeçalho da Loja do Cliente - Textos mais descritivos */}
                    <div style={{ width: '100%', padding: '10px 20px', backgroundColor: '#f0f0f0', borderBottom: `1px solid ${colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: colors.lightText, fontSize: typography.smallSize }}>
                        [CABEÇALHO DA LOJA DO CLIENTE]
                    </div>

                    <div style={previewContentStyle}>
                        <h1 style={{ fontSize: previewMode === 'mobile' ? '1.8rem' : '2.5rem', color: colors.primary, marginBottom: '10px', textShadow: '1px 1px 2px rgba(0,0,0,0.1)' }}>
                            {config.tituloAviso}
                        </h1>
                        <p style={{ fontSize: previewMode === 'mobile' ? '0.9rem' : '1.1rem', color: colors.text, maxWidth: '600px', lineHeight: '1.6', marginBottom: '20px' }}>
                            {config.mensagemDetalhada}
                        </p>
                    </div>

                    {/* Placeholder para Rodapé da Loja do Cliente - Textos mais descritivos */}
                    <div style={{ width: '100%', padding: '10px 20px', backgroundColor: '#f0f0f0', borderTop: `1px solid ${colors.border}`, marginTop: 'auto', fontSize: typography.smallSize, color: colors.lightText }}>
                        [RODAPÉ DA LOJA DO CLIENTE]
                    </div>
                </div>
                {/* SIMULAÇÃO DE ACESSO COM SENHA NO PREVIEW */}
                {config.ativa && config.senhaAcesso && (
                    <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', color: colors.white, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', zIndex: 10 }}>
                        <p style={{ marginBottom: '10px', fontSize: typography.bodySize }}>Para ver o site, digite a senha:</p>
                        <input
                            type="password"
                            placeholder="Senha de acesso"
                            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                                if (e.key === 'Enter' && (e.target as HTMLInputElement).value === config.senhaAcesso) {
                                    alert('Senha correta! (Simulado: você veria o site principal)');
                                    (e.target as HTMLInputElement).value = '';
                                } else if (e.key === 'Enter') {
                                    alert('Senha incorreta.');
                                }
                            }}
                            style={{ padding: '8px', borderRadius: '4px', border: 'none', width: '180px', textAlign: 'center', color: colors.text, fontFamily: typography.fontFamily }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}