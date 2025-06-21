// app\(interno)\dashboard\contato\page.tsx (CORRIGIDO: REMOVIDO INSCRIÇÃO ESTADUAL, AJUSTADO REDES SOCIAIS)
'use client';

import React, { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Para mostrar/esconder senha, se aplicável (reutilizado)

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

// Estilo base para os cards (reutilizado)
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

// Interface para as Configurações de Contato
type ContactConfig = {
    nomeEmpresa: string;
    cnpj: string;
    // inscricaoEstadual?: string; // REMOVIDO
    telefoneGeral: string;
    emailGeral: string;
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    instagramUrl?: string;
    facebookUrl?: string;
    whatsappNumero?: string; // Apenas o número, sem prefixo
    linkedinUrl?: string;
    youtubeUrl?: string;
    horarioAtendimento?: string;
    mapaUrl?: string;
    
    // Configurações da página "Entre em Contato"
    mostrarPaginaContato: boolean;
    tituloPaginaContato: string;
    mensagemPaginaContato: string;
    mostrarFormularioNaPagina: boolean;
};

// Dados mockados ou carregados do localStorage
const getContactConfigInicial = (): ContactConfig => {
    if (typeof window !== 'undefined') {
        const storedConfig = localStorage.getItem('contactConfig');
        return storedConfig ? JSON.parse(storedConfig) : {
            nomeEmpresa: 'Phandshop Online Ltda.',
            cnpj: '00.000.000/0001-00',
            // inscricaoEstadual: 'ISENTO', // REMOVIDO
            telefoneGeral: '(11) 9999-8888',
            emailGeral: 'contato@phandshop.com.br',
            cep: '01000-000',
            rua: 'Rua da Loja',
            numero: '123',
            complemento: 'Sala 101',
            bairro: 'Centro',
            cidade: 'São Paulo',
            estado: 'SP',
            instagramUrl: 'https://instagram.com/phandshop',
            facebookUrl: 'https://facebook.com/phandshop',
            whatsappNumero: '5511999999999', // Apenas o número
            linkedinUrl: '',
            youtubeUrl: '',
            horarioAtendimento: 'Seg-Sex: 9h-18h | Sáb: 9h-13h',
            mapaUrl: 'https://maps.app.goo.gl/seu_endereco', // Exemplo de URL de mapa
            
            mostrarPaginaContato: true,
            tituloPaginaContato: 'Fale Conosco',
            mensagemPaginaContato: 'Use os canais abaixo para entrar em contato ou preencha o formulário.',
            mostrarFormularioNaPagina: true,
        };
    }
    return {} as ContactConfig; // Fallback para SSR
};

export default function ContatoSettingsPage() {
    const [config, setConfig] = useState<ContactConfig>(getContactConfigInicial());
    const [isClient, setIsClient] = useState(false); // Para hidratação

    useEffect(() => {
        setIsClient(true);
        const storedConfig = localStorage.getItem('contactConfig');
        if (storedConfig) {
            setConfig(JSON.parse(storedConfig));
        }
    }, []);

    useEffect(() => {
        if (isClient) {
            localStorage.setItem('contactConfig', JSON.stringify(config));
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
            localStorage.setItem('contactConfig', JSON.stringify(config));
            alert('Informações de Contato salvas com sucesso!');
        }
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
                Informações de Contato
            </h1>

            {/* Seção de Configurações */}
            <div style={{
                ...baseCardStyle,
                minWidth: 'auto', flex: 'none',
                maxWidth: '800px', margin: '0 auto 40px auto',
                padding: '30px',
            }}>
                <h2 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '20px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
                    Dados da Empresa
                </h2>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="nomeEmpresa" style={labelStyle}>Nome da Empresa / Razão Social:</label>
                    <input type="text" id="nomeEmpresa" name="nomeEmpresa" value={config.nomeEmpresa} onChange={handleChange} style={inputStyleMinimal} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="cnpj" style={labelStyle}>CNPJ:</label>
                    <input type="text" id="cnpj" name="cnpj" value={config.cnpj} onChange={handleChange} style={inputStyleMinimal} placeholder="00.000.000/0001-00" />
                </div>
                {/* <div style={{ marginBottom: '15px' }}> */}
                {/* <label htmlFor="inscricaoEstadual" style={labelStyle}>Inscrição Estadual (Opcional):</label> */}
                {/* <input type="text" id="inscricaoEstadual" name="inscricaoEstadual" value={config.inscricaoEstadual || ''} onChange={handleChange} style={inputStyleMinimal} placeholder="Isento ou Nº da Inscrição" /> */}
                {/* </div> */}

                <h2 style={sectionTitleStyle}>Contatos Principais</h2>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="telefoneGeral" style={labelStyle}>Telefone de Contato Geral:</label>
                    <input type="text" id="telefoneGeral" name="telefoneGeral" value={config.telefoneGeral} onChange={handleChange} style={inputStyleMinimal} placeholder="(DD) 99999-9999" />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="emailGeral" style={labelStyle}>E-mail de Contato Geral:</label>
                    <input type="email" id="emailGeral" name="emailGeral" value={config.emailGeral} onChange={handleChange} style={inputStyleMinimal} placeholder="contato@suaempresa.com" />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="horarioAtendimento" style={labelStyle}>Horário de Atendimento:</label>
                    <input type="text" id="horarioAtendimento" name="horarioAtendimento" value={config.horarioAtendimento || ''} onChange={handleChange} style={inputStyleMinimal} placeholder="Seg-Sex: 9h-18h | Sáb: 9h-13h" />
                </div>

                <h2 style={sectionTitleStyle}>Endereço Físico</h2>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="cep" style={labelStyle}>CEP:</label>
                    <input type="text" id="cep" name="cep" value={config.cep} onChange={handleChange} style={inputStyleMinimal} placeholder="00000-000" />
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ flex: 3 }}>
                        <label htmlFor="rua" style={labelStyle}>Rua:</label>
                        <input type="text" id="rua" name="rua" value={config.rua} onChange={handleChange} style={inputStyleMinimal} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="numero" style={labelStyle}>Número:</label>
                        <input type="text" id="numero" name="numero" value={config.numero} onChange={handleChange} style={inputStyleMinimal} />
                    </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="complemento" style={labelStyle}>Complemento (Opcional):</label>
                    <input type="text" id="complemento" name="complemento" value={config.complemento || ''} onChange={handleChange} style={inputStyleMinimal} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="bairro" style={labelStyle}>Bairro:</label>
                    <input type="text" id="bairro" name="bairro" value={config.bairro} onChange={handleChange} style={inputStyleMinimal} />
                </div>
                <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="cidade" style={labelStyle}>Cidade:</label>
                        <input type="text" id="cidade" name="cidade" value={config.cidade} onChange={handleChange} style={inputStyleMinimal} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label htmlFor="estado" style={labelStyle}>Estado (UF):</label>
                        <input type="text" id="estado" name="estado" value={config.estado} onChange={handleChange} style={inputStyleMinimal} maxLength={2} />
                    </div>
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="mapaUrl" style={labelStyle}>URL do Mapa (Google Maps, Waze, etc.):</label>
                    <input type="url" id="mapaUrl" name="mapaUrl" value={config.mapaUrl || ''} onChange={handleChange} style={inputStyleMinimal} placeholder="https://maps.app.goo.gl/seu_link" />
                </div>

                <h2 style={sectionTitleStyle}>Redes Sociais e Outros Links</h2>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="instagramUrl" style={labelStyle}>Instagram URL:</label>
                    <input type="url" id="instagramUrl" name="instagramUrl" value={config.instagramUrl || ''} onChange={handleChange} style={inputStyleMinimal} placeholder="https://instagram.com/sua_loja" />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="facebookUrl" style={labelStyle}>Facebook URL:</label>
                    <input type="url" id="facebookUrl" name="facebookUrl" value={config.facebookUrl || ''} onChange={handleChange} style={inputStyleMinimal} placeholder="https://facebook.com/sua_loja" />
                </div>
                 {/* WhatsApp: Apenas o número, sem prefixo. O link será construído no componente do rodapé. */}
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="whatsappNumero" style={labelStyle}>WhatsApp (Apenas o número, com DDI, ex: 5511999999999):</label>
                    <input type="text" id="whatsappNumero" name="whatsappNumero" value={config.whatsappNumero || ''} onChange={handleChange} style={inputStyleMinimal} placeholder="5511999999999" />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="linkedinUrl" style={labelStyle}>LinkedIn URL (Opcional):</label>
                    <input type="url" id="linkedinUrl" name="linkedinUrl" value={config.linkedinUrl || ''} onChange={handleChange} style={inputStyleMinimal} />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="youtubeUrl" style={labelStyle}>YouTube URL (Opcional):</label>
                    <input type="url" id="youtubeUrl" name="youtubeUrl" value={config.youtubeUrl || ''} onChange={handleChange} style={inputStyleMinimal} />
                </div>
                
                <h2 style={sectionTitleStyle}>Página "Entre em Contato"</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                    <input
                        type="checkbox"
                        id="mostrarPaginaContato"
                        name="mostrarPaginaContato"
                        checked={config.mostrarPaginaContato}
                        onChange={handleChange}
                        style={{ transform: 'scale(1.2)' }}
                    />
                    <label htmlFor="mostrarPaginaContato" style={labelStyle}>Mostrar Página "Fale Conosco" no Site</label>
                </div>

                {config.mostrarPaginaContato && (
                    <div style={{ marginLeft: '25px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="tituloPaginaContato" style={labelStyle}>Título da Página "Fale Conosco":</label>
                            <input type="text" id="tituloPaginaContato" name="tituloPaginaContato" value={config.tituloPaginaContato} onChange={handleChange} style={inputStyleMinimal} placeholder="Fale Conosco ou Contato" />
                        </div>
                        <div style={{ marginBottom: '15px' }}>
                            <label htmlFor="mensagemPaginaContato" style={labelStyle}>Mensagem da Página "Fale Conosco":</label>
                            <textarea id="mensagemPaginaContato" name="mensagemPaginaContato" value={config.mensagemPaginaContato} onChange={handleChange} rows={4} style={{ ...inputStyleMinimal, resize: 'vertical' }} placeholder="Use os canais abaixo para entrar em contato ou preencha o formulário." />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                            <input
                                type="checkbox"
                                id="mostrarFormularioNaPagina"
                                name="mostrarFormularioNaPagina"
                                checked={config.mostrarFormularioNaPagina}
                                onChange={handleChange}
                                style={{ transform: 'scale(1.2)' }}
                            />
                            <label htmlFor="mostrarFormularioNaPagina" style={labelStyle}>Incluir Formulário de Contato Básico na Página</label>
                        </div>
                    </div>
                )}
                
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
                    Salvar Informações de Contato
                </button>
            </div>
        </div>
    );
}