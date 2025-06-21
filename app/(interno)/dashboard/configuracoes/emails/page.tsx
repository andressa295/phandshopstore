'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaPaperPlane, FaUser, FaShoppingCart, FaTags, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'; // Ícones
import Image from 'next/image'; // Para logos de integração

// Importa o tipo EmailTemplate
import type { EmailTemplate } from '../../../../../types/EmailTemplate'; // <<< AJUSTE O CAMINHO

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

// Dados para os modelos de e-mail
const emailTemplatesMock: EmailTemplate[] = [
    {
        id: 'ativacao_conta',
        titulo: 'Ativação da Conta',
        assuntoPadrao: 'Ative sua conta na nossa loja!',
        conteudoHtmlPadrao: '<p>Olá {{nome_cliente}}, clique no link para ativar sua conta: <a href="{{link_ativacao}}">Ativar agora</a></p>',
        variaveisDisponiveis: ['{{nome_cliente}}', '{{link_ativacao}}'],
        categoria: 'usuario',
        descricao: 'Convida seus clientes a criarem uma conta em sua loja.',
    },
    {
        id: 'mudanca_senha',
        titulo: 'Mudança de Senha',
        assuntoPadrao: 'Solicitação de mudança de senha',
        conteudoHtmlPadrao: '<p>Olá {{nome_cliente}}, você solicitou uma nova senha. Clique aqui: <a href="{{link_redefinicao}}">Redefinir Senha</a></p>',
        variaveisDisponiveis: ['{{nome_cliente}}', '{{link_redefinicao}}'],
        categoria: 'usuario',
        descricao: 'Ajuda um usuário registrado a recuperar sua senha.',
    },
    {
        id: 'boas_vindas',
        titulo: 'Boas-Vindas',
        assuntoPadrao: 'Bem-vindo(a) à nossa loja!',
        conteudoHtmlPadrao: '<p>Olá {{nome_cliente}}, seja bem-vindo(a)! Sua conta foi criada com sucesso.</p>',
        variaveisDisponiveis: ['{{nome_cliente}}'],
        categoria: 'usuario',
        descricao: 'Confirma que a conta foi criada com sucesso.',
    },
    {
        id: 'cancelamento_compra',
        titulo: 'Cancelamento de Compra',
        assuntoPadrao: 'Seu pedido #{{numero_pedido}} foi cancelado',
        conteudoHtmlPadrao: '<p>Seu pedido número {{numero_pedido}} foi cancelado. Motivo: {{motivo_cancelamento}}</p>',
        variaveisDisponiveis: ['{{nome_cliente}}', '{{numero_pedido}}', '{{motivo_cancelamento}}'],
        categoria: 'vendas',
        descricao: 'Explica o motivo pelo qual uma compra foi cancelada.',
    },
    {
        id: 'confirmacao_pagamento',
        titulo: 'Confirmação de Pagamento',
        assuntoPadrao: 'Pagamento do pedido #{{numero_pedido}} confirmado!',
        conteudoHtmlPadrao: '<p>Olá {{nome_cliente}}, confirmamos o pagamento do seu pedido #{{numero_pedido}}.</p>',
        variaveisDisponiveis: ['{{nome_cliente}}', '{{numero_pedido}}', '{{valor_pago}}'],
        categoria: 'vendas',
        descricao: 'Confirma o pagamento após o recebimento.',
    },
    {
        id: 'confirmacao_compra',
        titulo: 'Confirmação de Compra',
        assuntoPadrao: 'Seu pedido #{{numero_pedido}} foi realizado com sucesso!',
        conteudoHtmlPadrao: '<p>Obrigado por sua compra, {{nome_cliente}}! Seu pedido #{{numero_pedido}} foi confirmado.</p>',
        variaveisDisponiveis: ['{{nome_cliente}}', '{{numero_pedido}}', '{{detalhes_pedido}}'],
        categoria: 'vendas',
        descricao: 'Confirma o pedido quando uma compra for concluída.',
    },
    {
        id: 'confirmacao_envio',
        titulo: 'Confirmação de Envio',
        assuntoPadrao: 'Seu pedido #{{numero_pedido}} foi enviado!',
        conteudoHtmlPadrao: '<p>Seu pedido #{{numero_pedido}} foi despachado! Rastreie aqui: <a href="{{link_rastreamento}}">Rastrear</a></p>',
        variaveisDisponiveis: ['{{nome_cliente}}', '{{numero_pedido}}', '{{link_rastreamento}}'],
        categoria: 'vendas',
        descricao: 'Informa sobre o frete quando o pedido for despachado.',
    },
    {
        id: 'carrinhos_abandonados',
        titulo: 'Carrinhos Abandonados',
        assuntoPadrao: 'Você esqueceu algo no seu carrinho?',
        conteudoHtmlPadrao: '<p>Olá {{nome_cliente}}, notamos que você deixou alguns itens no seu carrinho. Conclua sua compra: <a href="{{link_carrinho}}">Meu Carrinho</a></p>',
        variaveisDisponiveis: ['{{nome_cliente}}', '{{link_carrinho}}'],
        categoria: 'promocao',
        descricao: 'Incentiva seus clientes a concluírem sua compra.',
    },
    {
        id: 'nuvem_marketing',
        titulo: 'Nuvem Marketing (ex: Perfit)',
        assuntoPadrao: 'Integração de Marketing Automatizado',
        conteudoHtmlPadrao: '<p>Este é um modelo de integração para plataformas de automação de marketing como Perfit.</p>',
        variaveisDisponiveis: [],
        categoria: 'promocao',
        descricao: 'Venda mais com a automação de marketing digital e automação de marketing de loja.',
        integracaoExterna: true, // Indica que é um modelo de integração
        instalado: false, // Inicia não instalado
    },
];

// Dados Mockados para as configurações gerais de e-mail
type EmailSettingsConfig = {
    emailRemetente: string;
    nomeRemetente: string;
    emailReenvio: string;
};

const getEmailSettingsInicial = (): EmailSettingsConfig => {
    if (typeof window !== 'undefined') {
        const storedConfig = localStorage.getItem('emailSettingsConfig');
        return storedConfig ? JSON.parse(storedConfig) : {
            emailRemetente: 'contato@sua_loja.com',
            nomeRemetente: 'Sua Loja Online',
            emailReenvio: 'seuteste@gmail.com',
        };
    }
    return {} as EmailSettingsConfig; // Fallback para SSR
};

export default function EmailSettingsPage() {
    const [emailSettings, setEmailSettings] = useState<EmailSettingsConfig>(getEmailSettingsInicial());
    const [templates, setTemplates] = useState<EmailTemplate[]>(emailTemplatesMock);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('emailSettingsConfig', JSON.stringify(emailSettings));
        }
    }, [emailSettings]);

    // Função para simular instalação de integração (para "Nuvem Marketing")
    const handleInstallIntegration = (templateId: string) => {
        setTemplates(prev => prev.map(t =>
            t.id === templateId ? { ...t, instalado: !t.instalado } : t
        ));
        alert(templates.find(t => t.id === templateId)?.instalado ? 'Integração Desinstalada!' : 'Integração Instalada! (Simulado)');
    };

    const handleEmailSettingsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEmailSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveEmailSettings = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('emailSettingsConfig', JSON.stringify(emailSettings));
            alert('Configurações de Remetente salvas com sucesso!');
        }
    };

    // Estilos comuns para inputs e botões
    const inputStyle: React.CSSProperties = {
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

    const editButtonStyle: React.CSSProperties = {
        padding: '8px 15px',
        backgroundColor: colors.primary,
        color: colors.white,
        border: 'none',
        borderRadius: '9999px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: typography.smallSize,
        transition: 'background-color 0.2s ease',
        minWidth: '80px',
    };
    const installButtonStyle: React.CSSProperties = {
        padding: '8px 15px',
        backgroundColor: colors.info,
        color: colors.white,
        border: 'none',
        borderRadius: '9999px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: typography.smallSize,
        transition: 'background-color 0.2s ease',
        minWidth: '80px',
    };
    const uninstallButtonStyle: React.CSSProperties = {
        padding: '8px 15px',
        backgroundColor: colors.danger,
        color: colors.white,
        border: 'none',
        borderRadius: '9999px',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: typography.smallSize,
        transition: 'background-color 0.2s ease',
        minWidth: '80px',
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
                Configurações de E-mails Automáticos
            </h1>

            {/* Configuração de Remetente */}
            <div style={{
                ...baseCardStyle,
                maxWidth: '800px', margin: '0 auto 40px auto',
                padding: '30px',
            }}>
                <h2 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '20px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
                    Remetente dos E-mails
                </h2>
                <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginBottom: '20px' }}>
                    Todos os e-mails automáticos serão enviados com estas informações.
                </p>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="emailRemetente" style={labelStyle}>E-mail do Remetente:</label>
                    <input type="email" id="emailRemetente" name="emailRemetente" value={emailSettings.emailRemetente} onChange={handleEmailSettingsChange} style={inputStyle} placeholder="ex: contato@sua_loja.com" />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="nomeRemetente" style={labelStyle}>Nome do Remetente:</label>
                    <input type="text" id="nomeRemetente" name="nomeRemetente" value={emailSettings.nomeRemetente} onChange={handleEmailSettingsChange} style={inputStyle} placeholder="ex: Sua Loja Online" />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="emailReenvio" style={labelStyle}>E-mail de Reenvio (para testes/cópias):</label>
                    <input type="email" id="emailReenvio" name="emailReenvio" value={emailSettings.emailReenvio} onChange={handleEmailSettingsChange} style={inputStyle} placeholder="ex: seu_email_pessoal@gmail.com" />
                </div>

                <button
                    onClick={handleSaveEmailSettings}
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
                        marginTop: '20px',
                    }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    Salvar Remetente
                </button>
            </div>

            {/* Modelos de E-mail */}
            <div style={{
                ...baseCardStyle,
                maxWidth: '1200px', margin: '0 auto', // Mais largo para os cards de email
                padding: '30px',
            }}>
                <h2 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '20px', textAlign: 'center', borderBottom: `1px solid ${colors.border}`, paddingBottom: '10px' }}>
                    Modelos de E-mails Automáticos
                </h2>

                {/* Seção: Conta de Usuários */}
                <h3 style={sectionTitleStyle}><FaUser size={18} style={{ marginRight: '10px', color: colors.secondary }} /> E-mails de Conta de Usuários</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                    {templates.filter(t => t.categoria === 'usuario').map(template => (
                        <div key={template.id} style={{ ...baseCardStyle, flex: '1 1 280px', minHeight: '180px', padding: '20px' }}>
                            <h4 style={{ fontSize: typography.bodySize, fontWeight: 'bold', color: colors.text, marginBottom: '10px' }}>{template.titulo}</h4>
                            <p style={{ fontSize: typography.smallSize, color: colors.lightText, flexGrow: 1 }}>{template.descricao}</p>
                            <button
                                onClick={() => router.push(`/dashboard/emails/editar/${template.id}`)}
                                style={{ ...editButtonStyle, marginTop: 'auto' }}
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                            >
                                Editar Conteúdo
                            </button>
                        </div>
                    ))}
                </div>

                {/* Seção: Vendas */}
                <h3 style={sectionTitleStyle}><FaShoppingCart size={18} style={{ marginRight: '10px', color: colors.secondary }} /> E-mails de Vendas</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                    {templates.filter(t => t.categoria === 'vendas').map(template => (
                        <div key={template.id} style={{ ...baseCardStyle, flex: '1 1 280px', minHeight: '180px', padding: '20px' }}>
                            <h4 style={{ fontSize: typography.bodySize, fontWeight: 'bold', color: colors.text, marginBottom: '10px' }}>{template.titulo}</h4>
                            <p style={{ fontSize: typography.smallSize, color: colors.lightText, flexGrow: 1 }}>{template.descricao}</p>
                            <button
                                onClick={() => router.push(`/dashboard/emails/editar/${template.id}`)}
                                style={{ ...editButtonStyle, marginTop: 'auto' }}
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                            >
                                Editar Conteúdo
                            </button>
                        </div>
                    ))}
                </div>

                {/* Seção: Promoções e Marketing */}
                <h3 style={sectionTitleStyle}><FaTags size={18} style={{ marginRight: '10px', color: colors.secondary }} /> E-mails de Promoções e Marketing</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px', justifyContent: 'center' }}>
                    {templates.filter(t => t.categoria === 'promocao').map(template => (
                        <div key={template.id} style={{ ...baseCardStyle, flex: '1 1 280px', minHeight: '180px', padding: '20px' }}>
                            <h4 style={{ fontSize: typography.bodySize, fontWeight: 'bold', color: colors.text, marginBottom: '10px' }}>{template.titulo}</h4>
                            <p style={{ fontSize: typography.smallSize, color: colors.lightText, flexGrow: 1 }}>{template.descricao}</p>
                            
                            {template.integracaoExterna ? (
                                <button
                                    onClick={() => handleInstallIntegration(template.id)}
                                    style={template.instalado ? uninstallButtonStyle : installButtonStyle}
                                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = template.instalado ? colors.danger : colors.primary}
                                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = template.instalado ? colors.danger : colors.info}
                                >
                                    {template.instalado ? <FaTimesCircle size={14} style={{ marginRight: '5px' }} /> : <FaCheckCircle size={14} style={{ marginRight: '5px' }} />}
                                    {template.instalado ? 'Desinstalar' : 'Instalar'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => router.push(`/dashboard/emails/editar/${template.id}`)}
                                    style={{ ...editButtonStyle, marginTop: 'auto' }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                                >
                                    Editar Conteúdo
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}