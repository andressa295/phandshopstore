'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaCheckCircle, FaTimesCircle, FaExclamationTriangle, FaLink, FaExternalLinkAlt, FaTrash, FaStar, FaCogs, FaSearch, FaCertificate } from 'react-icons/fa';

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

// Estilo para títulos de seção dentro dos cards
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

// Estilo para inputs de texto genéricos
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

// Estilo para labels
const labelStyle: React.CSSProperties = {
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: typography.smallSize,
    color: colors.text,
    fontFamily: typography.fontFamily,
    display: 'block',
};


// Interface para um Domínio
type Domain = {
    id: number;
    nome: string;
    principal: boolean;
    statusDominio: 'ativo' | 'inativo' | 'pendente';
    statusSsl: 'ativado' | 'pendente' | 'erro';
    cnameHost?: string;
    cnameValue?: string;
    aRecordIp?: string;
};

// Dados mockados de domínios (para inicializar o localStorage na primeira vez se estiver vazio)
const defaultDominios: Domain[] = [
    { id: 1, nome: 'ghetocchcgrifes.lojavirtualnuvem.com.br', principal: false, statusDominio: 'ativo', statusSsl: 'ativado' },
    { id: 2, nome: 'mkaliancasejoias.store', principal: true, statusDominio: 'ativo', statusSsl: 'ativado', cnameHost: 'www', cnameValue: 'sualoja.minha.lojavirtual.com', aRecordIp: '18.234.123.456' },
    { id: 3, nome: 'www.mkaliancasejoias.store', principal: false, statusDominio: 'ativo', statusSsl: 'ativado' },
    { id: 4, nome: 'novo-dominio.com', principal: false, statusDominio: 'pendente', statusSsl: 'pendente' },
];

export default function DominiosPage() {
    // CORREÇÃO: Inicializa o estado com um array vazio, e carrega depois da hidratação.
    const [dominios, setDominios] = useState<Domain[]>([]);
    const [busca, setBusca] = useState('');
    const [modalConfigDominioAberto, setModalConfigDominioAberto] = useState(false);
    const [dominioEmConfiguracao, setDominioEmConfiguracao] = useState<Domain | null>(null);
    const [hasHydrated, setHasHydrated] = useState(false); // NOVO: Flag para controle de hidratação
    const router = useRouter();

    useEffect(() => {
        // Isso só roda no cliente, após a primeira renderização (hidratação)
        setHasHydrated(true); // Marca que a hidratação ocorreu
        const storedDominios = localStorage.getItem('dominiosMock');
        if (storedDominios) {
            setDominios(JSON.parse(storedDominios));
        } else {
            // Se não houver nada no localStorage, preenche com os mocks padrão apenas UMA VEZ
            // E salva no localStorage para futuras cargas
            setDominios(defaultDominios);
            localStorage.setItem('dominiosMock', JSON.stringify(defaultDominios));
        }
    }, []); // Array de dependências vazio: executa apenas UMA VEZ no cliente

    useEffect(() => {
        // Salva no localStorage SOMENTE se a hidratação já ocorreu E se os domínios mudarem
        if (hasHydrated) { // Garante que não tenta salvar durante a renderização do servidor
            localStorage.setItem('dominiosMock', JSON.stringify(dominios));
        }
    }, [dominios, hasHydrated]);


    const dominiosFiltrados = dominios.filter(d =>
        d.nome.toLowerCase().includes(busca.toLowerCase())
    );

    // --- Funções de Ação ---

    const handleAdicionarDominio = () => {
        setDominioEmConfiguracao(null);
        setModalConfigDominioAberto(true);
    };

    const handleDefinirPrincipal = (id: number) => {
        setDominios(prev =>
            prev.map(d => ({
                ...d,
                principal: d.id === id,
            }))
        );
        alert('Domínio principal atualizado! (Simulado)');
    };

    const handleExcluirDominio = (id: number, nome: string) => {
        if (window.confirm(`Tem certeza que deseja excluir o domínio "${nome}"?`)) {
            setDominios(prev => prev.filter(d => d.id !== id));
            alert(`Domínio "${nome}" excluído com sucesso!`);
        }
    };

    const handleConfigurarDominio = (dominio: Domain) => {
        setDominioEmConfiguracao(dominio);
        setModalConfigDominioAberto(true);
    };

    const handleSalvarConfigDominio = (updatedDomain: Domain) => {
        const updateDominiosTree = (currentDominios: Domain[]): Domain[] => {
            if (updatedDomain.id === 0) {
                const novoId = Math.max(...currentDominios.map(d => d.id), 0) + 1;
                return [...currentDominios, { ...updatedDomain, id: novoId }];
            } else {
                return currentDominios.map(d => (d.id === updatedDomain.id ? updatedDomain : d));
            }
        };

        setDominios(prev => updateDominiosTree(prev));
        setModalConfigDominioAberto(false);
        setDominioEmConfiguracao(null);
        alert(`Configurações para "${updatedDomain.nome}" salvas!`);
    };

    const handleCancelarConfigDominio = () => {
        setModalConfigDominioAberto(false);
        setDominioEmConfiguracao(null);
    };

    const handleVerificarConfiguracao = (id: number, nome: string) => {
        alert(`Verificando configurações de DNS para "${nome}"... (Simulado)`);
        setDominios(prev =>
            prev.map(d => (d.id === id ? { ...d, statusDominio: 'ativo', statusSsl: 'ativado' } : d))
        );
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
                Domínios
            </h1>

            <p style={{ fontSize: typography.bodySize, color: colors.lightText, textAlign: 'center', marginBottom: '30px' }}>
                O domínio é o endereço da sua loja na Internet. Você pode ter mais de um e gerenciá-los aqui.
            </p>

            {/* Barra de Busca e Botão Adicionar Domínio */}
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                backgroundColor: colors.white,
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                border: `1px solid ${colors.border}`,
            }}>
                <input
                    type="text"
                    placeholder="Buscar domínio..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    style={{
                        padding: '10px 12px',
                        flex: 1,
                        borderRadius: '6px',
                        border: `1px solid ${colors.border}`,
                        fontSize: typography.bodySize,
                        fontFamily: typography.fontFamily,
                        color: colors.text,
                        backgroundColor: colors.white,
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors.accent}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
                />
                <button
                    onClick={handleAdicionarDominio}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: colors.accent,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: typography.bodySize,
                        transition: 'background-color 0.2s ease, transform 0.1s ease',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'translateY(1px)'}
                    onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    <FaPlus size={14} style={{ marginRight: '8px' }} /> Adicionar Domínio
                </button>
            </div>

            {/* Tabela de Domínios */}
            <div style={{
                backgroundColor: colors.white,
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                border: `1px solid ${colors.border}`,
                overflowX: 'auto',
                marginBottom: '40px',
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '900px',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: colors.primary, color: colors.white }}>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Domínio</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Status do Domínio</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Status do Certificado SSL</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {hasHydrated && dominiosFiltrados.length === 0 ? ( // CORREÇÃO: Condição para "nenhum domínio"
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: colors.lightText, fontSize: typography.bodySize }}>
                                    Nenhum domínio encontrado. Adicione seu primeiro domínio!
                                </td>
                            </tr>
                        ) : !hasHydrated ? ( // CORREÇÃO: Condição para "carregando"
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: colors.lightText, fontSize: typography.bodySize }}>
                                    Carregando domínios...
                                </td>
                            </tr>
                        ) : ( // CORREÇÃO: Renderiza domínios quando tem e está hidratado
                            dominiosFiltrados.map((dominio: Domain) => (
                                <tr key={dominio.id} style={{ borderBottom: `1px solid ${colors.border}`, transition: 'background-color 0.2s ease' }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) => e.currentTarget.style.backgroundColor = colors.background}
                                    onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) => e.currentTarget.style.backgroundColor = colors.white}>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontWeight: 'bold', fontSize: typography.bodySize }}>
                                        {dominio.nome} {dominio.principal && <span style={{ backgroundColor: colors.accent, color: colors.white, padding: '3px 8px', borderRadius: '9999px', fontSize: typography.smallSize, marginLeft: '10px' }}>Principal</span>}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize, color: colors.lightText }}>
                                        {dominio.statusDominio === 'ativo' && <FaCheckCircle size={14} style={{ color: colors.success, marginRight: '5px' }} />}
                                        {dominio.statusDominio === 'pendente' && <FaExclamationTriangle size={14} style={{ color: colors.warning, marginRight: '5px' }} />}
                                        {dominio.statusDominio === 'inativo' && <FaTimesCircle size={14} style={{ color: colors.danger, marginRight: '5px' }} />}
                                        {dominio.statusDominio.charAt(0).toUpperCase() + dominio.statusDominio.slice(1)}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize, color: colors.lightText }}>
                                        {dominio.statusSsl === 'ativado' && <FaCheckCircle size={14} style={{ color: colors.success, marginRight: '5px' }} />}
                                        {dominio.statusSsl === 'pendente' && <FaExclamationTriangle size={14} style={{ color: colors.warning, marginRight: '5px' }} />}
                                        {dominio.statusSsl === 'erro' && <FaTimesCircle size={14} style={{ color: colors.danger, marginRight: '5px' }} />}
                                        {dominio.statusSsl.toUpperCase()}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'center', justifyContent: 'center' }}>
                                        {!dominio.principal && (
                                            <button
                                                onClick={() => handleDefinirPrincipal(dominio.id)}
                                                style={{
                                                    padding: '8px 15px',
                                                    cursor: 'pointer',
                                                    backgroundColor: colors.accent,
                                                    color: colors.white,
                                                    border: 'none',
                                                    borderRadius: '9999px',
                                                    fontSize: typography.smallSize,
                                                    fontWeight: 'bold',
                                                    transition: 'background-color 0.2s ease',
                                                }}
                                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                                            >
                                                <FaStar size={12} style={{ marginRight: '5px' }} /> Principal
                                            </button>
                                        )}
                                        {/* Removido o botão "Configurar" daqui */}
                                        {dominio.statusDominio === 'pendente' && (
                                            <button
                                                onClick={() => handleVerificarConfiguracao(dominio.id, dominio.nome)}
                                                style={{
                                                    padding: '8px 15px',
                                                    cursor: 'pointer',
                                                    backgroundColor: colors.info,
                                                    color: colors.white,
                                                    border: 'none',
                                                    borderRadius: '9999px',
                                                    fontSize: typography.smallSize,
                                                    fontWeight: 'bold',
                                                    transition: 'background-color 0.2s ease',
                                                }}
                                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#138cb3'}
                                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.info}
                                            >
                                                <FaSearch size={12} style={{ marginRight: '5px' }} /> Verificar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleExcluirDominio(dominio.id, dominio.nome)}
                                            style={{
                                                padding: '8px 15px',
                                                cursor: 'pointer',
                                                backgroundColor: colors.danger,
                                                color: colors.white,
                                                border: 'none',
                                                borderRadius: '9999px',
                                                fontSize: typography.smallSize,
                                                fontWeight: 'bold',
                                                transition: 'background-color 0.2s ease',
                                            }}
                                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#c82333'}
                                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.danger}
                                        >
                                            <FaTrash size={12} /> Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Seção "Aprenda Mais" */}
            <h2 style={{ ...sectionTitleStyle, textAlign: 'center' }}>Aprenda Mais</h2>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '20px',
                justifyContent: 'center',
            }}>
                <div style={{ ...baseCardStyle, flex: '1 1 300px', minHeight: 'auto', padding: '20px' }}>
                    <h3 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '10px' }}>Configure seu domínio</h3>
                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, flexGrow: 1, marginBottom: '15px' }}>
                        Use um domínio próprio para destacar a identidade da sua marca.
                    </p>
                    <a href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: typography.smallSize, color: colors.accent, textDecoration: 'none', fontWeight: 'bold' }}>
                        Ver tutorial <FaLink size={10} style={{ marginLeft: '5px' }} />
                    </a>
                </div>
                <div style={{ ...baseCardStyle, flex: '1 1 300px', minHeight: 'auto', padding: '20px' }}>
                    <h3 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '10px' }}>Verifique a configuração</h3>
                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, flexGrow: 1, marginBottom: '15px' }}>
                        Siga estes passos para revisar se seu domínio ficou corretamente vinculado.
                    </p>
                    <a href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: typography.smallSize, color: colors.accent, textDecoration: 'none', fontWeight: 'bold' }}>
                        Ver tutorial <FaLink size={10} style={{ marginLeft: '5px' }} />
                    </a>
                </div>
                <div style={{ ...baseCardStyle, flex: '1 1 300px', minHeight: 'auto', padding: '20px' }}>
                    <h3 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '10px' }}>Consulte o vencimento</h3>
                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, flexGrow: 1, marginBottom: '15px' }}>
                        Identifique se o registro do seu domínio deve ser renovado em breve.
                    </p>
                    <a href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: typography.smallSize, color: colors.accent, textDecoration: 'none', fontWeight: 'bold' }}>
                        Ver tutorial <FaLink size={10} style={{ marginLeft: '5px' }} />
                    </a>
                </div>
                <div style={{ ...baseCardStyle, flex: '1 1 300px', minHeight: 'auto', padding: '20px' }}>
                    <h3 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '10px' }}>Certificado de segurança</h3>
                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, flexGrow: 1, marginBottom: '15px' }}>
                        Saiba se seu certificado de segurança está ativo.
                    </p>
                    <a href="#" target="_blank" rel="noopener noreferrer" style={{ fontSize: typography.smallSize, color: colors.accent, textDecoration: 'none', fontWeight: 'bold' }}>
                        Ver tutorial <FaLink size={10} style={{ marginLeft: '5px' }} />
                    </a>
                </div>
            </div>
            <p style={{ fontSize: typography.smallSize, color: colors.lightText, textAlign: 'center', marginTop: '20px' }}>
                <a href="#" target="_blank" rel="noopener noreferrer" style={{ color: colors.accent, textDecoration: 'none', fontWeight: 'bold' }}>
                    Mais sobre domínios <FaLink size={10} style={{ marginLeft: '5px' }} />
                </a>
            </p>

            {/* Modal de Configuração de Domínio (NOVO) */}
            {modalConfigDominioAberto && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        boxSizing: 'border-box',
                        backdropFilter: 'blur(5px)',
                    }}
                    onClick={handleCancelarConfigDominio}
                >
                    <div
                        style={{
                            backgroundColor: colors.white,
                            padding: '30px',
                            borderRadius: '10px',
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                        }}
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <h2 style={sectionTitleStyle}>
                            {dominioEmConfiguracao && dominioEmConfiguracao.id !== 0 ? `Configurar Domínio: ${dominioEmConfiguracao.nome}` : 'Adicionar Novo Domínio'}
                        </h2>

                        {/* Seção "Já tem um domínio?" */}
                        <p style={{ fontSize: typography.bodySize, color: colors.text, marginBottom: '10px' }}>
                            Já possui um domínio? Digite-o abaixo e configuraremos para você:
                        </p>
                        <label style={labelStyle}>Nome do Domínio:</label>
                        <input
                            type="text"
                            value={dominioEmConfiguracao?.nome || ''}
                            onChange={(e) => setDominioEmConfiguracao(prev => prev ? { ...prev, nome: e.target.value } : { id: 0, nome: e.target.value, principal: false, statusDominio: 'pendente', statusSsl: 'pendente' })}
                            style={inputStyleMinimal}
                            placeholder="Ex: www.minhaloja.com.br"
                            disabled={!!dominioEmConfiguracao && dominioEmConfiguracao.id !== 0}
                        />

                        {/* NOVO: Seção "Não tem um domínio?" com link de indicação */}
                        <div style={{ borderTop: `1px solid ${colors.border}`, paddingTop: '15px', marginTop: '15px', textAlign: 'center' }}>
                            <p style={{ fontSize: typography.bodySize, color: colors.text, marginBottom: '15px' }}>
                                Não tem um domínio ainda? Compre o seu aqui e registre em poucos passos!
                            </p>
                            <a 
                                href="https://hostinger.com.br?REFERRALCODE=phandshop" // SEU LINK DE INDICAÇÃO
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: colors.accent,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: typography.bodySize,
                                    textDecoration: 'none',
                                    transition: 'background-color 0.2s ease',
                                    display: 'inline-flex', alignItems: 'center', gap: '8px',
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                            >
                                <FaLink size={14} /> Comprar domínio na Hostinger
                            </a>
                        </div>


                        <h3 style={{ fontSize: typography.bodySize, color: colors.primary, marginTop: '20px', marginBottom: '10px' }}>Passos para Configuração de DNS:</h3>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginBottom: '10px' }}>
                            Acesse o painel de controle do seu provedor de domínio (Hostinger, Registro.br, GoDaddy, etc.) e adicione os seguintes registros DNS:
                        </p>

                        <div style={{ backgroundColor: colors.background, padding: '15px', borderRadius: '8px', border: `1px dashed ${colors.border}` }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: typography.smallSize }}>Registro CNAME:</p>
                            <label style={labelStyle}>Host/Nome:</label>
                            <input type="text" value={dominioEmConfiguracao?.cnameHost || 'www'} style={inputStyleMinimal} readOnly />
                            <label style={labelStyle}>Valor/Aponta para:</label>
                            <input type="text" value={dominioEmConfiguracao?.cnameValue || 'sualoja.minha.lojavirtual.com'} style={inputStyleMinimal} readOnly />
                            <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '10px' }}>
                                Este CNAME é essencial para que o "www" do seu domínio aponte para sua loja.
                            </p>
                        </div>
                        <div style={{ backgroundColor: colors.background, padding: '15px', borderRadius: '8px', border: `1px dashed ${colors.border}` }}>
                            <p style={{ fontWeight: 'bold', marginBottom: '5px', fontSize: typography.smallSize }}>Registro A:</p>
                            <label style={labelStyle}>Host/Nome:</label>
                            <input type="text" value={dominioEmConfiguracao?.aRecordIp || '@' } style={inputStyleMinimal} readOnly />
                            <label style={labelStyle}>Valor/Aponta para:</label>
                            <input type="text" value={dominioEmConfiguracao?.aRecordIp || '18.234.123.456'} style={inputStyleMinimal} readOnly />
                            <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '10px' }}>
                                Este Registro A garante que seu domínio sem "www" (apenas sualoja.com) também aponte para sua loja.
                            </p>
                        </div>

                        <h3 style={{ fontSize: typography.bodySize, color: colors.primary, marginTop: '20px', marginBottom: '10px' }}>Ativação do Certificado SSL:</h3>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginBottom: '10px' }}>
                            Após configurar os registros DNS, o certificado SSL será ativado automaticamente. Isso pode levar algumas horas.
                        </p>
                        <p style={{ fontSize: typography.smallSize, color: colors.info, fontWeight: 'bold', textAlign: 'center' }}>
                            <FaCertificate size={14} style={{ marginRight: '5px' }} /> O SSL garante a segurança da sua loja (https://).
                        </p>

                        <button
                            onClick={() => handleVerificarConfiguracao(dominioEmConfiguracao?.id || 0, dominioEmConfiguracao?.nome || '')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: colors.info,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: typography.bodySize,
                                transition: 'background-color 0.2s ease',
                                marginTop: '20px',
                            }}
                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#138cb3'}
                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.info}
                        >
                            <FaSearch size={14} style={{ marginRight: '5px' }} /> Verificar Configuração Agora
                        </button>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                            <button
                                type="button"
                                onClick={handleCancelarConfigDominio}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: colors.lightText,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: typography.bodySize,
                                    transition: 'background-color 0.2s ease',
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#888'}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.lightText}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                onClick={() => handleSalvarConfigDominio(dominioEmConfiguracao || { id: 0, nome: '', principal: false, statusDominio: 'pendente', statusSsl: 'pendente' })}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: colors.primary,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: typography.bodySize,
                                    transition: 'background-color 0.2s ease',
                                }}
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                            >
                                Salvar e Fechar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}