'use client';

import React, { useState, useEffect } from 'react';
import styles from './PlanosPage.module.css';

// 1. Definindo interfaces para os planos e recursos (mantidas)
interface PlanFeature {
    name: string;
    available: boolean; // true para checkmark, false para X
}

interface Plan {
    id: string;
    name: string;
    price: number; // 0 para gratuito
    priceDescription: string; // Ex: "Grátis", "R$ 49/mês", "R$ 499/ano"
    annualPriceDescription?: string; // Novo: para o preço anual
    billingCycle: 'monthly' | 'annual' | 'free'; // Ciclo de cobrança
    salesFee: string; // Ex: "2.5%", "0%", "Customizado"
    features: PlanFeature[]; // Alterado para PlanFeature[]
    isPopular?: boolean; // Novo: para marcar o plano mais popular
}

const PlanosPage: React.FC = () => {
    const [userCurrentPlanId, setUserCurrentPlanId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Dados mockados de planos - ATUALIZADOS COM SEUS VALORES E NOMES
    const availablePlans: Plan[] = [
        {
            id: 'free',
            name: 'Plano Grátis',
            price: 0,
            priceDescription: 'R$ 0,00',
            billingCycle: 'free',
            salesFee: '2.5% sobre vendas', // Como discutido, 2.5% aqui
            features: [
                { name: 'Até 50 produtos cadastrados', available: true },
                { name: 'Tema Padrão para sua loja (Layout único)', available: true },
                { name: 'Integração com meios de pagamento', available: true },
                { name: 'Integração com transportadoras (Envios)', available: true },
                { name: 'Atendimento via WhatsApp para seus clientes', available: true },
                { name: 'Certificado de Segurança SSL Gratuito', available: true },
                { name: 'Aviso-me quando chegar', available: true },
                { name: 'Guias de Tamanho', available: true },
                // Abaixo, itens que podem estar implicitamente AUSENTES ou em planos superiores
                { name: 'Acesso a todos os Temas', available: false },
                { name: 'Produtos, visitas e usuários ilimitados', available: false },
                { name: 'Domínio próprio', available: false },
                { name: 'Sacolinha do Instagram', available: false },
                { name: 'Ferramentas de Personalização Avançada', available: false },
                { name: 'Relatórios Complexos', available: false },
                { name: 'Atendimento Prioritário', available: false },
                { name: 'Acesso Antecipado a novas funcionalidades', available: false },
                { name: 'Compre Junto', available: false },
                { name: 'Brindes no Carrinho', available: false },
                { name: 'Relatórios Avançados', available: false },
                { name: 'Gerenciador de Estoque Avançado', available: false },
                { name: 'Integrações Avançadas', available: false },
                { name: 'Consultoria Estratégica', available: false },
                { name: 'Marketing Digital Exclusivo', available: false },
                { name: 'Desenvolvimento Personalizado', available: false },
                { name: 'Suporte Exclusivo com Gerente de Conta', available: false },
                { name: 'Relatórios Gerenciais Personalizados', available: false },
                { name: 'SLA de Atendimento Garantido', available: false },
            ],
        },
        {
            id: 'essential',
            name: 'Plano Essencial',
            price: 79.90,
            priceDescription: 'R$ 79,90 /mês',
            annualPriceDescription: 'ou R$ 49,90/mês no plano anual',
            billingCycle: 'monthly',
            salesFee: '0% sobre vendas',
            features: [
                { name: 'Tudo do Plano Grátis, e mais:', available: true }, // Marcador
                { name: 'Acesso a todos os Temas para personalizar sua loja', available: true },
                { name: 'Tarifa por venda de 0%', available: true },
                { name: 'Produtos, visitas e usuários ilimitados', available: true },
                { name: 'Domínio próprio', available: true },
                { name: 'Sacolinha do Instagram', available: true },
                { name: 'Ferramentas de Personalização Avançada', available: true },
                // Abaixo, itens do Plano Profissional/Premium que NÃO estão neste plano
                { name: 'Acesso a Temas Profissionais', available: false },
                { name: 'Compre Junto', available: false },
                { name: 'Brindes no Carrinho', available: false },
                { name: 'Relatórios Avançados', available: false },
                { name: 'Relatórios Complexos', available: false },
                { name: 'Atendimento Prioritário', available: false },
                { name: 'Acesso Antecipado a novas funcionalidades', available: false },
                { name: 'Gerenciador de Estoque Avançado', available: false },
                { name: 'Integrações Avançadas', available: false },
                { name: 'Consultoria Estratégica', available: false },
                { name: 'Marketing Digital Exclusivo', available: false },
                { name: 'Desenvolvimento Personalizado', available: false },
                { name: 'Suporte Exclusivo com Gerente de Conta', available: false },
                { name: 'Relatórios Gerenciais Personalizados', available: false },
                { name: 'SLA de Atendimento Garantido', available: false },
            ],
        },
        {
            id: 'professional',
            name: 'Plano Profissional',
            price: 149.90,
            priceDescription: 'R$ 149,90 /mês',
            annualPriceDescription: 'ou R$ 119,90/mês no plano anual',
            billingCycle: 'monthly',
            salesFee: '0% sobre vendas',
            isPopular: true, // Marcado como "Mais Popular"
            features: [
                { name: 'Tudo do Plano Essencial, e mais:', available: true }, // Marcador
                { name: 'Acesso a Temas Profissionais', available: true },
                { name: 'Compre Junto', available: true },
                { name: 'Brindes no Carrinho', available: true },
                { name: 'Relatórios Avançados', available: true },
                // Abaixo, itens do Plano Phand Premium que NÃO estão neste plano
                { name: 'Relatórios Complexos', available: false },
                { name: 'Atendimento Prioritário', available: false },
                { name: 'Acesso Antecipado a novas funcionalidades', available: false },
                { name: 'Consultoria Estratégica', available: false },
                { name: 'Marketing Digital Exclusivo', available: false },
                { name: 'Desenvolvimento Personalizado', available: false },
                { name: 'Suporte Exclusivo com Gerente de Conta', available: false },
                { name: 'Relatórios Gerenciais Personalizados', available: false },
                { name: 'SLA de Atendimento Garantido', available: false },
            ],
        },
        {
            id: 'premium',
            name: 'Plano Phand Premium',
            price: 299.90,
            priceDescription: 'R$ 299,90 /mês',
            annualPriceDescription: 'ou R$ 249,90/mês no plano anual',
            billingCycle: 'monthly',
            salesFee: '0% sobre vendas',
            features: [
                { name: 'Tudo do plano Profissional, e mais:', available: true }, // Marcador
                { name: 'Relatórios Complexos', available: true },
                { name: 'Atendimento Prioritário', available: true },
                { name: 'Acesso Antecipado a novas funcionalidades', available: true },
                // Você pode adicionar mais features que são exclusivas do Premium aqui
                { name: 'Consultoria Estratégica', available: true },
                { name: 'Marketing Digital Exclusivo', available: true },
                { name: 'Desenvolvimento Personalizado', available: true },
                { name: 'Suporte Exclusivo com Gerente de Conta', available: true },
                { name: 'Relatórios Gerenciais Personalizados', available: true },
                { name: 'SLA de Atendimento Garantido', available: true },
            ],
        },
    ];

    // Restante do código (useEffect, handlePlanChange, renderização) permanece o mesmo
    // ... (o código abaixo é o mesmo da versão anterior, apenas para completar o arquivo) ...

    useEffect(() => {
        const fetchUserPlan = async () => {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 800));
            setUserCurrentPlanId('free'); // Definindo um plano inicial para simulação
            // Para testar outros planos, descomente um dos abaixo:
            // setUserCurrentPlanId('essential');
            // setUserCurrentPlanId('professional');
            // setUserCurrentPlanId('premium');
            setLoading(false);
        };
        fetchUserPlan();
    }, []);

    const handlePlanChange = async (planId: string) => {
        if (planId === userCurrentPlanId) {
            setErrorMessage('Você já está neste plano.');
            setSuccessMessage(null);
            return;
        }

        const selectedPlan = availablePlans.find(p => p.id === planId);
        if (!selectedPlan) {
            setErrorMessage('Plano não encontrado.');
            return;
        }

        if (window.confirm(`Tem certeza que deseja mudar para o "${selectedPlan.name}"?`)) {
            setLoading(true);
            setSuccessMessage(null);
            setErrorMessage(null);
            try {
                // Simula chamada de API para mudar o plano
                await new Promise(resolve => setTimeout(resolve, 1500));
                setUserCurrentPlanId(planId);
                setSuccessMessage(`Seu plano foi alterado com sucesso para "${selectedPlan.name}"!`);
            } catch (err) {
                console.error("Erro ao mudar plano:", err);
                setErrorMessage("Não foi possível alterar seu plano. Tente novamente.");
            } finally {
                setLoading(false);
            }
        }
    };

    const currentUserPlan = availablePlans.find(plan => plan.id === userCurrentPlanId);

    if (loading) {
        return <div className={styles.loadingState}>Carregando planos...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Nossos Planos</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <section className={styles.currentPlanSection}>
                <h2 className={styles.sectionTitle}>Seu Plano Atual: <span className={styles.currentPlanName}>{currentUserPlan?.name || 'Nenhum'}</span></h2>
                {currentUserPlan ? (
                    <div className={styles.currentPlanDetails}>
                        <p>Aproveite os benefícios do seu plano para impulsionar suas vendas.</p>
                        {currentUserPlan.salesFee !== '0% sobre vendas' && (
                            <p className={styles.currentPlanInfo}>
                                **Sua tarifa sobre vendas: **<span className={styles.currentPlanFee}>{currentUserPlan.salesFee}</span>
                            </p>
                        )}
                        <p className={styles.currentPlanInfo}>
                            Próxima cobrança: Consulte <a href="/dashboard/pagamentos-assinaturas" className={styles.actionLink}>Pagamentos e Assinaturas</a>.
                        </p>
                    </div>
                ) : (
                    <p>Você não possui um plano ativo. Escolha um abaixo para começar!</p>
                )}
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Escolha o Plano Ideal para Você</h2>
                <div className={styles.plansGrid}>
                    {availablePlans.map(plan => (
                        <div key={plan.id} className={`${styles.planCard} ${plan.id === userCurrentPlanId ? styles.currentPlanCard : ''} ${plan.isPopular ? styles.popularPlanCard : ''}`}>
                            {plan.id === userCurrentPlanId && <span className={styles.badge}>Seu Plano Atual</span>}
                            {plan.isPopular && <span className={styles.popularBadge}>Mais Popular</span>} {/* Badge "Mais Popular" */}
                            
                            <div className={styles.planIcon}>
                                {/* Aqui você pode adicionar um ícone SVG ou imagem para cada plano */}
                                {plan.id === 'free' && <img src="/icons/free-icon.svg" alt="Grátis" />} {/* Exemplo: Caminho para seus ícones */}
                                {plan.id === 'essential' && <img src="/icons/diamond-icon.svg" alt="Essencial" />}
                                {plan.id === 'professional' && <img src="/icons/rocket-icon.svg" alt="Profissional" />}
                                {plan.id === 'premium' && <img src="/icons/crown-icon.svg" alt="Premium" />}
                            </div>

                            <h3 className={styles.planName}>{plan.name}</h3>
                            <div className={styles.planPrice}>
                                {plan.priceDescription}
                                {plan.annualPriceDescription && <span className={styles.annualPrice}>{plan.annualPriceDescription}</span>}
                            </div>
                            <div className={styles.salesFeeDisplay}>
                                Tarifa de Vendas: <span className={plan.salesFee === '0% sobre vendas' ? styles.salesFeeZero : styles.salesFeeValue}>{plan.salesFee}</span>
                            </div>
                            <ul className={styles.featureList}>
                                {plan.features.map((feature, idx) => (
                                    <li key={idx} className={styles.featureItem}>
                                        {feature.available ? (
                                            <span className={styles.featureIconTrue}>&#10003;</span> // Checkmark
                                        ) : (
                                            <span className={styles.featureIconFalse}>&#10006;</span> // X mark
                                        )}
                                        {feature.name}
                                    </li>
                                ))}
                            </ul>
                            <div className={styles.planCardActions}>
                                {plan.id === userCurrentPlanId ? (
                                    <button className={styles.currentPlanButton} disabled>Plano Atual</button>
                                ) : (
                                    <button 
                                        className={plan.price > 0 ? styles.primaryButton : styles.secondaryButton} 
                                        onClick={() => handlePlanChange(plan.id)}
                                        disabled={loading}
                                    >
                                        {plan.price > 0 ? 'Fazer Upgrade' : 'Escolher Plano'}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default PlanosPage;