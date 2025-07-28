'use client';

import React from 'react';
import { useUser } from '../../UserContext'; // Ajuste o caminho conforme a localização real de UserContext
import styles from './Aplicativos.module.css'; // Importa o CSS Module
import Link from 'next/link';
import Image from 'next/image'; // Importar Image para exibir os ícones dos apps
// Ícones para as categorias e botões
import { FaPlusSquare, FaPlug, FaSearch, FaInfoCircle, FaTruck, FaDollarSign, FaChartLine, FaShareAlt, FaHeadset, FaChartPie, FaMoneyBillWave, FaRobot, FaLightbulb } from 'react-icons/fa';


// Definições de cores e tipografia (garantir consistência ou importar de um arquivo de tema)
// Se já definido globalmente ou no layout pai, pode remover daqui
const colors = {
    primary: '#6b21a8',
    secondary: '#820AD1',
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

// Interface para um objeto de aplicativo
interface AppItem {
    id: string;
    name: string;
    description: string;
    icon: string;
    status: 'Instalado' | 'Não Instalado';
    planRequired: 'plano_gratis' | 'plano_basico' | 'plano_essencial' | 'plano_profissional' | 'plano_premium';
    link: string;
    type: string;
    category: string;
}

// Mapeamento de categorias para ícones
const categoryIcons: Record<string, React.ReactNode> = {
    '📦 Logística & Fulfillment': <FaTruck size={24} style={{ marginRight: '10px' }} />,
    '🛒 Checkout & Conversão': <FaDollarSign size={24} style={{ marginRight: '10px' }} />,
    '🎯 Marketing & Performance': <FaChartLine size={24} style={{ marginRight: '10px' }} />,
    '📱 Social e Vendas Multicanal': <FaShareAlt size={24} style={{ marginRight: '10px' }} />,
    '💬 Atendimento & Relacionamento': <FaHeadset size={24} style={{ marginRight: '10px' }} />,
    '📊 Relatórios & BI': <FaChartPie size={24} style={{ marginRight: '10px' }} />,
    '🧾 Financeiro & Fiscal': <FaMoneyBillWave size={24} style={{ marginRight: '10px' }} />,
    '🤖 Automação e IA': <FaRobot size={24} style={{ marginRight: '10px' }} />,
    '🧠 Extras Visionários': <FaLightbulb size={24} style={{ marginRight: '10px' }} />,
};


// Dados mockados de aplicativos, agora com categoria
// ATENÇÃO: Esta array é exportada para ser usada na página de detalhes do app ([appId]/page.tsx)
export const mockApps: AppItem[] = [
    // ---  Logística & Fulfillment ---
    { id: '6', name: 'Melhor Envio', description: 'Compare fretes das principais transportadoras e emita etiquetas com desconto.', icon: '/images/app-icons/melhor-envio.png', status: 'Não Instalado', planRequired: 'plano_basico', link: 'https://melhorenvio.com.br/', type: 'Envios', category: '📦 Logística & Fulfillment' },
    { id: '7', name: 'Frenet', description: 'Alternativa ao Melhor Envio com mais transportadoras e opções de frete.', icon: '/images/app-icons/frenet.png', status: 'Não Instalado', planRequired: 'plano_essencial', link: 'https://frenet.com.br/', type: 'Envios', category: '📦 Logística & Fulfillment' },
    { id: '16', name: 'Intelipost', description: 'Cálculo inteligente de frete e roteirização para lojas de grande volume.', icon: '/images/app-icons/intelipost.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: 'https://intelipost.com.br/', type: 'Envios', category: '📦 Logística & Fulfillment' },

    // ---  Checkout & Conversão ---
    { id: '17', name: 'Recart', description: 'Automação para carrinho abandonado via WhatsApp e Messenger, recuperando vendas.', icon: '/images/app-icons/recart.png', status: 'Não Instalado', planRequired: 'plano_essencial', link: 'https://recart.com/', type: 'Conversão', category: '🛒 Checkout & Conversão' },
    { id: '18', name: 'One Click Upsell', description: 'Ofereça upsells e cross-sells imediatos no checkout para aumentar o ticket médio.', icon: '/images/app-icons/one-click-upsell.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: '/dashboard/marketing/aplicativos/one-click-upsell-config', type: 'Conversão', category: '🛒 Checkout & Conversão' },
    { id: '19', name: 'Checkout Transparente Pagar.me', description: 'Mantenha o cliente dentro da loja durante a compra, otimizando a experiência.', icon: '/images/app-icons/pagarme.png', status: 'Não Instalado', planRequired: 'plano_essencial', link: 'https://pagar.me/', type: 'Pagamento', category: '🛒 Checkout & Conversão' },

    // ---  Marketing & Performance ---
    { id: '1', name: 'Google Analytics', description: 'Monitore o tráfego da sua loja e o comportamento dos visitantes.', icon: '/images/app-icons/google-analytics.png', status: 'Instalado', planRequired: 'plano_gratis', link: 'https://analytics.google.com/', type: 'Analytics', category: '🎯 Marketing & Performance' },
    { id: '2', name: 'Facebook Pixel', description: 'Rastreie eventos e otimize suas campanhas de anúncios no Facebook e Instagram.', icon: '/images/app-icons/facebook-pixel.png', status: 'Não Instalado', planRequired: 'plano_basico', link: 'https://facebook.com/business/help/facebook-pixel', type: 'Advertising', category: '🎯 Marketing & Performance' },
    { id: '3', name: 'Mailchimp', description: 'Automatize suas campanhas de e-mail marketing e newsletters.', icon: '/images/app-icons/mailchimp.png', status: 'Não Instalado', planRequired: 'plano_essencial', link: 'https://mailchimp.com/', type: 'Email Marketing', category: '🎯 Marketing & Performance' },
    { id: '4', name: 'SEO Booster', description: 'Otimize sua loja para motores de busca e melhore seu ranking no Google.', icon: '/images/app-icons/seo-booster.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: '/dashboard/marketing/aplicativos/seo-booster-config', type: 'SEO', category: '🎯 Marketing & Performance' },
    { id: '5', name: 'Google Shopping', description: 'Conecte seus produtos ao Google Shopping para aumentar a visibilidade.', icon: '/images/app-icons/google-shopping.png', status: 'Instalado', planRequired: 'plano_profissional', link: 'https://merchants.google.com/', type: 'Advertising', category: '🎯 Marketing & Performance' },
    { id: '20', name: 'RD Station', description: 'CRM e automação de marketing nacional poderoso para suas estratégias.', icon: '/images/app-icons/rd-station.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: 'https://rdstation.com/', type: 'Automação', category: '🎯 Marketing & Performance' },
    { id: '21', name: 'Hotjar', description: 'Grave sessões de usuários e crie mapas de calor para entender o comportamento na loja.', icon: '/images/app-icons/hotjar.png', status: 'Não Instalado', planRequired: 'plano_premium', link: 'https://www.hotjar.com/', type: 'Analytics', category: '🎯 Marketing & Performance' },
    { id: '22', name: 'PushOwl', description: 'Envie notificações push via navegador para engajar clientes e recuperar vendas.', icon: '/images/app-icons/pushowl.png', status: 'Não Instalado', planRequired: 'plano_essencial', link: 'https://pushowl.com/', type: 'Notificação', category: '🎯 Marketing & Performance' },

    // ---  Social e Vendas Multicanal ---
    { id: '23', name: 'Instagram Shopping', description: 'Conexão direta com seu catálogo de produtos para vendas no Instagram.', icon: '/images/app-icons/instagram-shopping.png', status: 'Não Instalado', planRequired: 'plano_basico', link: 'https://business.facebook.com/instagram/shopping/', type: 'Social Commerce', category: '📱 Social e Vendas Multicanal' },
    { id: '24', name: 'TikTok Ads', description: 'Integração com pixel e otimização de conversões para suas campanhas no TikTok.', icon: '/images/app-icons/tiktok.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: 'https://ads.tiktok.com/', type: 'Publicidade', category: '📱 Social e Vendas Multicanal' },
    { id: '25', name: 'Clube de Afiliados Phandshop', description: 'Sistema próprio para criar e gerenciar seu programa de afiliados, impulsionando vendas.', icon: '/images/app-icons/phandshop-afiliados.png', status: 'Não Instalado', planRequired: 'plano_premium', link: '/dashboard/marketing/aplicativos/afiliados-config', type: 'Afiliados', category: '📱 Social e Vendas Multicanal' },
    { id: '26', name: 'Venda no Mercado Livre', description: 'Integração direta com a API de produtos e pedidos para vender no Mercado Livre.', icon: '/images/app-icons/mercado-livre.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: 'https://developers.mercadolivre.com.br/', type: 'Marketplace', category: '📱 Social e Vendas Multicanal' },

    // ---  Atendimento & Relacionamento ---
    { id: '12', name: 'JivoChat', description: 'Adicione um chat online à sua loja para atendimento em tempo real.', icon: '/images/app-icons/jivochat.png', status: 'Não Instalado', planRequired: 'plano_gratis', link: 'https://www.jivochat.com.br/', type: 'Chat Online', category: '💬 Atendimento & Relacionamento' },
    { id: '13', name: 'WhatsApp Business', description: 'Integre o WhatsApp para atendimento e envio de notificações.', icon: '/images/app-icons/whatsapp.png', status: 'Não Instalado', planRequired: 'plano_basico', link: 'https://business.whatsapp.com/', type: 'Mensagens', category: '💬 Atendimento & Relacionamento' },
    { id: '27', name: 'Zendesk', description: 'Solução completa de chat, ticket e CRM para atendimento profissional ao cliente.', icon: '/images/app-icons/zendesk.png', status: 'Não Instalado', planRequired: 'plano_premium', link: 'https://www.zendesk.com.br/', type: 'CRM/Suporte', category: '💬 Atendimento & Relacionamento' },
    { id: '28', name: 'ChatGPT Assistente Lojista', description: 'IA interna para responder perguntas frequentes dos clientes e automatizar o suporte.', icon: '/images/app-icons/chatgpt.png', status: 'Não Instalado', planRequired: 'plano_premium', link: '/dashboard/marketing/aplicativos/chatgpt-config', type: 'IA/Suporte', category: '💬 Atendimento & Relacionamento' },
    { id: '29', name: 'ReclameAqui', description: 'Responda avaliações e gerencie a reputação da sua loja diretamente do painel.', icon: '/images/app-icons/reclame-aqui.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: 'https://www.reclameaqui.com.br/', type: 'Reputação', category: '💬 Atendimento & Relacionamento' },

    // ---  Relatórios & BI ---
    { id: '30', name: 'Metabase (embed)', description: 'Crie dashboards personalizados e visualize seus dados de forma intuitiva.', icon: '/images/app-icons/metabase.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: 'https://www.metabase.com/', type: 'Business Intelligence', category: '📊 Relatórios & BI' },
    { id: '31', name: 'Google Data Studio Connector', description: 'Conecte seus dados da Phandshop para painéis externos no Google Data Studio.', icon: '/images/app-icons/google-data-studio.png', status: 'Não Instalado', planRequired: 'plano_premium', link: 'https://lookerstudio.google.com/', type: 'Business Intelligence', category: '📊 Relatórios & BI' },

    // ---  Financeiro & Fiscal ---
    { id: '8', name: 'NFe.io', description: 'Automatize a emissão de Notas Fiscais Eletrônicas (NF-e) para produtos e serviços.', icon: '/images/app-icons/nfe-io.png', status: 'Não Instalado', planRequired: 'plano_essencial', link: 'https://nfe.io/', type: 'Nota Fiscal', category: '🧾 Financeiro & Fiscal' },
    { id: '32', name: 'Asaas', description: 'Gestão de cobranças completa com link de pagamento, Pix, boleto e cartão de crédito.', icon: '/images/app-icons/asaas.png', status: 'Não Instalado', planRequired: 'plano_basico', link: 'https://www.asaas.com/', type: 'Gestão Financeira', category: '🧾 Financeiro & Fiscal' },
    { id: '14', name: 'PagSeguro', description: 'Ofereça diversas opções de pagamento, incluindo boleto, Pix e parcelamento.', icon: '/images/app-icons/pagseguro.png', status: 'Não Instalado', planRequired: 'plano_gratis', link: 'https://pagseguro.uol.com.br/', type: 'Pagamento', category: '🧾 Financeiro & Fiscal' },
    { id: '15', name: 'Mercado Pago', description: 'Aceite pagamentos de forma simples e segura com as soluções de checkout do Mercado Pago.', icon: '/images/app-icons/mercado-pago.png', status: 'Não Instalado', planRequired: 'plano_gratis', link: 'https://www.mercadopago.com.br/', type: 'Pagamento', category: '🧾 Financeiro & Fiscal' },

    // ---  Automação e IA ---
    { id: '33', name: 'Zapier/Make', description: 'Crie automações sem código entre a Phandshop e milhares de outras ferramentas.', icon: '/images/app-icons/zapier.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: 'https://zapier.com/', type: 'Automação', category: '🤖 Automação e IA' },
    { id: '34', name: 'IA de Precificação', description: 'Sugestão automática de preço competitivo com base em análise de mercado e IA.', icon: '/images/app-icons/ai-pricing.png', status: 'Não Instalado', planRequired: 'plano_premium', link: '/dashboard/marketing/aplicativos/ai-pricing-config', type: 'Inteligência Artificial', category: '🤖 Automação e IA' },
    { id: '35', name: 'Ferramenta de Prova Social', description: 'Exiba notificações de "Fulano acabou de comprar" para aumentar a urgência e confiança.', icon: '/images/app-icons/social-proof.png', status: 'Não Instalado', planRequired: 'plano_essencial', link: '/dashboard/marketing/aplicativos/social-proof-config', type: 'Conversão', category: '🤖 Automação e IA' },

    // ---  Extras Visionários ---
    { id: '36', name: 'App de Gamificação', description: 'Crie programas de fidelidade com pontos e recompensas para engajar seus clientes.', icon: '/images/app-icons/gamification.png', status: 'Não Instalado', planRequired: 'plano_premium', link: '/dashboard/marketing/aplicativos/gamification-config', type: 'Engajamento', category: '🧠 Extras Visionários' },
    { id: '37', name: 'Agendador de Posts', description: 'Agende posts para suas redes sociais diretamente da dashboard da Phandshop.', icon: '/images/app-icons/post-scheduler.png', status: 'Não Instalado', planRequired: 'plano_profissional', link: 'https://www.post-scheduler-config/', type: 'Conteúdo', category: '🧠 Extras Visionários' }, // Corrigi o link aqui
    { id: '38', name: 'Construtor de Landing Pages', description: 'Crie páginas personalizadas de campanha dentro da Phandshop para suas promoções.', icon: '/images/app-icons/landing-page-builder.png', status: 'Não Instalado', planRequired: 'plano_premium', link: '/dashboard/marketing/aplicativos/landing-page-config', type: 'Web Design', category: '🧠 Extras Visionários' },
    { id: '39', name: 'IA de Geração de Produto', description: 'Use IA para gerar descrições, imagens e otimizar seus produtos automaticamente.', icon: '/images/app-icons/ai-product-gen.png', status: 'Não Instalado', planRequired: 'plano_premium', link: '/dashboard/marketing/aplicativos/ai-product-gen-config', type: 'Inteligência Artificial', category: '🧠 Extras Visionários' },
];


export default function MarketingAplicativosPage() {
    const { user, profile, loading } = useUser();

    // Agrupar os aplicativos por categoria
    const appsByCategory = mockApps.reduce((acc, app) => {
        if (!acc[app.category]) {
            acc[app.category] = [];
        }
        acc[app.category].push(app);
        return acc;
    }, {} as Record<string, AppItem[]>);

    // Ordenar as categorias para exibição consistente
    const categoryOrder = [
        '📦 Logística & Fulfillment',
        '🛒 Checkout & Conversão',
        '🎯 Marketing & Performance',
        '📱 Social e Vendas Multicanal',
        '💬 Atendimento & Relacionamento',
        '📊 Relatórios & BI',
        '🧾 Financeiro & Fiscal',
        '🤖 Automação e IA',
        '🧠 Extras Visionários'
    ];

    const sortedCategories = categoryOrder.filter(cat => appsByCategory[cat]);


    if (loading) {
        return <div className={styles.loadingContainer}>Carregando aplicativos...</div>;
    }

    if (!user) {
        return <div className={styles.accessDenied}>Acesso negado. Por favor, faça login.</div>;
    }

    const currentUserPlan = profile?.plano || 'plano_gratis';

    const isPlanAllowed = (appPlanRequired: string) => {
        const planOrder = ['plano_gratis', 'plano_basico', 'plano_essencial', 'plano_profissional', 'plano_premium'];
        const userPlanIndex = planOrder.indexOf(currentUserPlan);
        const requiredPlanIndex = planOrder.indexOf(appPlanRequired);
        return userPlanIndex >= requiredPlanIndex;
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>
                <FaPlug size={32} className={styles.icon} />
                Aplicativos
            </h1>
            <p className={styles.subtitle}>
                Impulsione suas vendas com as melhores ferramentas e integrações para sua loja.
            </p>

            <div className={styles.searchBar}>
                <FaSearch className={styles.searchIcon} />
                <input type="text" placeholder="Buscar aplicativos..." className={styles.searchInput} />
            </div>

            {sortedCategories.map(category => (
                <div key={category} className={styles.categorySection}>
                    <h2 className={styles.categoryTitle}>{categoryIcons[category]}{category}</h2>
                    <div className={styles.appGrid}>
                        {appsByCategory[category].map(app => (
                            <div key={app.id} className={styles.appCard}>
                                {app.icon && <Image src={app.icon} alt={`${app.name} Icon`} width={60} height={60} className={styles.appIcon} />}
                                <h3 className={styles.appName}>{app.name}</h3>
                                <p className={styles.appDescription}>{app.description}</p>
                                <div className={styles.appStatus}>
                                    <span className={`${styles.statusBadge} ${styles[app.status.replace(/\s/g, '')]}`}>
                                        {app.status}
                                    </span>
                                    <span className={styles.appType}>{app.type}</span>
                                </div>
                                
                                {isPlanAllowed(app.planRequired) ? (
                                    // AQUI: Botão de Instalar/Gerenciar - direciona para a página de detalhes do app
                                    <Link href={`/dashboard/marketing/aplicativos/${app.id}`} className={`${styles.installButton} ${app.status === 'Não Instalado' ? styles.installButtonHighlight : ''}`}>
                                        {app.status === 'Instalado' ? 'Gerenciar' : 'Instalar'}
                                        <FaPlusSquare size={14} style={{ marginLeft: '8px' }} />
                                    </Link>
                                ) : (
                                    <div className={styles.upgradeNotice}>
                                        <FaInfoCircle size={14} style={{ marginRight: '5px' }} />
                                        Requer Plano {app.planRequired.replace('plano_', ' ').replace(/\b\w/g, char => char.toUpperCase())}
                                        <Link href="/planos" className={styles.upgradeLink}>Fazer Upgrade</Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <p className={styles.footerText}>
                Em breve, mais aplicativos para você!
            </p>
        </div>
    );
}