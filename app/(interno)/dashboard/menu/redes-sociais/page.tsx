// app/(interno)/dashboard/menu/redes-sociais/page.tsx
"use client"; // Mantenha esta diretiva aqui!

import React, { useState, useEffect } from 'react'; // Importe React, useState, useEffect
import styles from './RedesSociaisPage.module.css';

// SEUS IMPORTES DOS ÍCONES DA BIBLIOTECA REACT-ICONS
import { FaFacebook, FaInstagram, FaTiktok, FaPinterestP } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6"; // Importe específico para o ícone "X" (Twitter atual)

// 1. Interface para a integração de Rede Social
interface SocialMediaIntegration {
    id: string;
    name: string;
    isConnected: boolean;
    connectedAccount?: string; // Nome da página/conta conectada
    lastConnected?: string; // Data da última conexão
    benefits: string; // Breve descrição dos benefícios
}

// DECLARAÇÃO DO SEU COMPONENTE REACT. GARANTA QUE TUDO ESTÁ AQUI DENTRO.
const RedesSociaisPage: React.FC = () => {
    // 2. ESTADOS: Essas linhas precisam estar AQUI dentro do componente
    const [integrations, setIntegrations] = useState<SocialMediaIntegration[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Dados mockados de integrações
    // ESTE BLOCO DE DADOS PODE ESTAR AQUI DENTRO OU FORA DO COMPONENTE (se for constante)
    const allSocialMediaIntegrations: SocialMediaIntegration[] = [
        {
            id: 'facebook',
            name: 'Facebook',
            isConnected: true,
            connectedAccount: 'MK Alianças & Joias - Página Oficial',
            lastConnected: '2025-06-20T10:00:00Z',
            benefits: 'Conecte sua página para sincronizar produtos, gerenciar mensagens e criar anúncios.',
        },
        {
            id: 'instagram',
            name: 'Instagram',
            isConnected: false,
            benefits: 'Vincule seu perfil profissional para exibir seu feed na loja e marcar produtos.',
        },
        {
            id: 'tiktok',
            name: 'TikTok',
            isConnected: false,
            benefits: 'Aumente seu alcance com a integração TikTok Shop e vídeos de produtos.',
        },
        {
            id: 'pinterest',
            name: 'Pinterest',
            isConnected: true,
            connectedAccount: 'MK Joias Oficial',
            lastConnected: '2025-05-15T14:00:00Z',
            benefits: 'Crie Pins de produtos para direcionar tráfego para sua loja.',
        },
        {
            id: 'x-twitter', // O ID da integração para Twitter (X)
            name: 'Twitter (X)',
            isConnected: false,
            benefits: 'Publique atualizações sobre novos produtos e promoções diretamente do painel.',
        },
    ];

    // 3. EFEITO: Precisa estar AQUI dentro do componente
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                setIntegrations(allSocialMediaIntegrations);
                setLoading(false);
            } catch (err) {
                console.error("Erro ao carregar integrações de redes sociais:", err);
                setErrorMessage("Não foi possível carregar as informações das redes sociais.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // FUNÇÕES DE MANIPULAÇÃO: Precisam estar AQUI dentro do componente
    const handleConnect = async (integrationId: string) => {
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setIntegrations(prev => prev.map(integration =>
                integration.id === integrationId ? { ...integration, isConnected: true, connectedAccount: `Conta Simulada ${integration.name}`, lastConnected: new Date().toISOString() } : integration
            ));
            setSuccessMessage(`${integrations.find(i => i.id === integrationId)?.name} conectado com sucesso!`);
        } catch (err) {
            setErrorMessage(`Erro ao conectar ${integrations.find(i => i.id === integrationId)?.name}.`);
        } finally {
            setLoading(false);
        }
    };

    const handleDisconnect = async (integrationId: string) => {
        setSuccessMessage(null);
        setErrorMessage(null);
        if (window.confirm(`Tem certeza que deseja desconectar o ${integrations.find(i => i.id === integrationId)?.name}?`)) {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                setIntegrations(prev => prev.map(integration =>
                    integration.id === integrationId ? { ...integration, isConnected: false, connectedAccount: undefined, lastConnected: undefined } : integration
                ));
                setSuccessMessage(`${integrations.find(i => i.id === integrationId)?.name} desconectado com sucesso.`);
            } catch (err) {
                setErrorMessage(`Erro ao desconectar ${integrations.find(i => i.id === integrationId)?.name}.`);
            } finally {
                setLoading(false);
            }
        }
    };

    // Função para renderizar o ícone com base no ID da integração
    const getSocialIcon = (id: string) => {
        switch (id) {
            case 'facebook': return <FaFacebook className={styles.socialIcon} />;
            case 'instagram': return <FaInstagram className={styles.socialIcon} />;
            case 'tiktok': return <FaTiktok className={styles.socialIcon} />;
            case 'pinterest': return <FaPinterestP className={styles.socialIcon} />;
            case 'x-twitter': return <FaXTwitter className={styles.socialIcon} />;
            default: return <div className={styles.socialIconPlaceholder}>?</div>;
        }
    };

    // A renderização do JSX precisa estar AQUI
    if (loading) {
        return <div className={styles.loadingState}>Carregando integrações de redes sociais...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Redes Sociais</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Conecte e Amplifique seu Negócio</h2>
                <p className={styles.sectionDescription}>
                    Integre suas redes sociais para expandir o alcance da sua loja, automatizar publicações, exibir produtos e interagir melhor com seus clientes.
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Gerenciar Conexões</h2>
                <div className={styles.integrationsGrid}>
                    {integrations.map((integration: SocialMediaIntegration) => (
                        <div key={integration.id} className={`${styles.integrationCard} ${integration.isConnected ? styles.connectedCard : ''}`}>
                            <div className={styles.cardHeader}>
                                {getSocialIcon(integration.id)}
                                
                                <h3>{integration.name}</h3>
                            </div>
                            <div className={styles.cardContent}>
                                {integration.benefits && <p className={styles.benefitsText}>{integration.benefits}</p>}
                                {integration.isConnected ? (
                                    <>
                                        <p className={styles.connectedInfo}>Conectado como: <strong>{integration.connectedAccount}</strong></p>
                                        <p className={styles.connectedInfo}>Última conexão: {integration.lastConnected ? new Date(integration.lastConnected).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                        <div className={styles.cardActions}>
                                            <button 
                                                onClick={() => handleDisconnect(integration.id)} 
                                                className={styles.dangerButton}
                                                disabled={loading}
                                            >
                                                Desconectar
                                            </button>
                                            <button 
                                                onClick={() => alert(`Configurar ${integration.name} (funcionalidade em desenvolvimento)`)} 
                                                className={styles.secondaryButton}
                                                disabled={loading}
                                            >
                                                Configurar
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className={styles.cardActions}>
                                        <button 
                                            onClick={() => handleConnect(integration.id)} 
                                            className={styles.primaryButton}
                                            disabled={loading}
                                        >
                                            Conectar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default RedesSociaisPage;