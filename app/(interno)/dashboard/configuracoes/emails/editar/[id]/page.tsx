// app\(interno)\dashboard\configuracoes\emails\editar\[id]\page.tsx (CORRIGIDO: TYPO EM CONTEUDOHTMLPADRAO)
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormularioEmail from '../../components/FormularioEmail'; // Caminho para o FormularioEmail
import type { EmailTemplate } from '../../../../../../../types/EmailTemplate'; // <<< AJUSTE O CAMINHO

// Definindo cores e fontes (repetido para auto-suficiência da página)
const colors = {
    primary: '#6b21a8',
    background: '#f8f9fa',
    white: '#ffffff',
    text: '#333333',
    danger: '#dc3545',
};
const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
};

// Dados mockados de templates (precisam ser os mesmos do page.tsx para consistência)
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
        conteudoHtmlPadrao: '<p>Este é um modelo de integração para plataformas de automação de marketing como Perfit.</p>', // CORREÇÃO AQUI: 'conteudoHtmlPadhao' para 'conteudoHtmlPadrao'
        variaveisDisponiveis: [],
        categoria: 'promocao',
        descricao: 'Venda mais com a automação de marketing digital e automação de marketing de loja.',
        integracaoExterna: true,
        instalado: false,
    },
];

export default function EditarEmailTemplatePage() {
    const router = useRouter();
    const params = useParams();
    const templateId = params.id as string;

    const [allTemplates, setAllTemplates] = useState<EmailTemplate[]>([]);
    const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const foundTemplate = emailTemplatesMock.find(t => t.id === templateId);
        if (foundTemplate) {
            setCurrentTemplate(foundTemplate);
            const storedTemplateContent = localStorage.getItem(`emailTemplate_${templateId}_content`);
            if (storedTemplateContent) {
                setCurrentTemplate(prev => ({ ...prev!, conteudoHtmlPadrao: storedTemplateContent }));
            }
        } else {
            alert('Modelo de e-mail não encontrado!');
            router.push('/dashboard/emails');
        }
        setLoading(false);
    }, [templateId, router]);

    const handleSave = (updatedTemplate: EmailTemplate) => {
        localStorage.setItem(`emailTemplate_${updatedTemplate.id}_content`, updatedTemplate.conteudoHtmlPadrao);
        alert('Conteúdo do e-mail salvo com sucesso!');
        router.push('/dashboard/emails');
    };

    const handleCancel = () => {
        router.push('/dashboard/emails');
    };

    if (loading) {
        return (
            <div style={{
                padding: '20px',
                fontFamily: typography.fontFamily,
                color: colors.text,
                backgroundColor: colors.background,
                minHeight: 'calc(100vh - 100px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Carregando modelo de e-mail...
            </div>
        );
    }

    if (!currentTemplate) {
        return (
            <div style={{
                padding: '20px',
                fontFamily: typography.fontFamily,
                color: colors.text,
                backgroundColor: colors.background,
                minHeight: 'calc(100vh - 100px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Modelo de e-mail não encontrado.
            </div>
        );
    }

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
                Editar E-mail: {currentTemplate.titulo}
            </h1>
            <div style={{
                backgroundColor: colors.white,
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                maxWidth: '900px',
                margin: '20px auto',
                boxSizing: 'border-box',
            }}>
                <FormularioEmail
                    emailTemplateInicial={currentTemplate}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}