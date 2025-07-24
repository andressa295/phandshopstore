"use client"; 

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './PagamentosAssinaturasPage.module.css'; // Vamos criar este CSS Module

// 1. Definindo interfaces para os dados
interface PaymentMethod {
    id: string;
    type: 'credit_card' | 'debit_card' | 'pix' | 'boleto';
    brand?: string; // Para cartões (Visa, Mastercard)
    last4Digits?: string; // Para cartões
    expiryDate?: string; // Para cartões (MM/AA)
    isDefault: boolean;
}

interface SubscriptionInfo {
    planName: string;
    status: 'active' | 'pending' | 'canceled';
    nextBillingDate: string; // Formato YYYY-MM-DD
    nextBillingAmount: number;
    renewalDate: string; // Formato YYYY-MM-DD
}

interface Transaction {
    id: string;
    date: string; // Formato YYYY-MM-DD
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    invoiceUrl?: string; // URL para baixar a fatura
}

const PagamentosAssinaturasPage: React.FC = () => {
    // 2. Estados para armazenar os dados
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // 3. Efeito para carregar os dados
    useEffect(() => {
        const fetchData = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simula API call

                // Dados mockados
                const mockSubscription: SubscriptionInfo = {
                    planName: "Plano Premium Anual",
                    status: "active",
                    nextBillingDate: "2025-07-23",
                    nextBillingAmount: 199.90,
                    renewalDate: "2026-06-23",
                };

                const mockPaymentMethods: PaymentMethod[] = [
                    { id: "pm_123", type: "credit_card", brand: "Visa", last4Digits: "1234", expiryDate: "12/26", isDefault: true },
                    { id: "pm_456", type: "pix", isDefault: false },
                    { id: "pm_789", type: "boleto", isDefault: false },
                ];

                const mockTransactions: Transaction[] = [
                    { id: "tx_001", date: "2025-06-23", description: "Assinatura Mensal - Junho", amount: 19.90, status: "paid", invoiceUrl: "/faturas/fatura-001.pdf" },
                    { id: "tx_002", date: "2025-05-23", description: "Assinatura Mensal - Maio", amount: 19.90, status: "paid", invoiceUrl: "/faturas/fatura-002.pdf" },
                    { id: "tx_003", date: "2025-04-23", description: "Assinatura Mensal - Abril", amount: 19.90, status: "paid", invoiceUrl: "/faturas/fatura-003.pdf" },
                ];

                setSubscription(mockSubscription);
                setPaymentMethods(mockPaymentMethods);
                setRecentTransactions(mockTransactions);
                setLoading(false);

            } catch (err) {
                console.error("Erro ao carregar dados de pagamentos:", err);
                setError("Não foi possível carregar as informações de pagamentos e assinaturas.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleSetDefaultPaymentMethod = (id: string) => {
        setSuccessMessage(null);
        setError(null);
        // Simula a lógica de API
        setPaymentMethods(prevMethods => 
            prevMethods.map(method => ({
                ...method,
                isDefault: method.id === id,
            }))
        );
        setSuccessMessage("Método de pagamento padrão atualizado!");
    };

    const handleRemovePaymentMethod = (id: string) => {
        setSuccessMessage(null);
        setError(null);
        if (window.confirm("Tem certeza que deseja remover este método de pagamento?")) {
            // Simula a lógica de API
            setPaymentMethods(prevMethods => prevMethods.filter(method => method.id !== id));
            setSuccessMessage("Método de pagamento removido com sucesso!");
        }
    };

    const handleCancelSubscription = () => {
        setSuccessMessage(null);
        setError(null);
        if (window.confirm("Tem certeza que deseja cancelar sua assinatura?")) {
            // Simula a lógica de API
            setSubscription(prevSub => prevSub ? { ...prevSub, status: 'canceled' } : null);
            setSuccessMessage("Assinatura cancelada com sucesso.");
        }
    };

    if (loading) {
        return <div className={styles.loadingState}>Carregando informações de pagamento...</div>;
    }

    if (error) {
        return <div className={styles.errorState}>Erro: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Pagamentos e Assinaturas</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>}

            {/* Seção de Assinatura Atual */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Sua Assinatura Atual</h2>
                {subscription ? (
                    <div className={styles.subscriptionCard}>
                        <p><strong>Plano:</strong> {subscription.planName}</p>
                        <p><strong>Status:</strong> <span className={`${styles.statusBadge} ${styles[subscription.status]}`}>{subscription.status === 'active' ? 'Ativo' : subscription.status === 'pending' ? 'Pendente' : 'Cancelado'}</span></p>
                        <p><strong>Próxima Cobrança:</strong> {new Date(subscription.nextBillingDate).toLocaleDateString('pt-BR')} (R$ {subscription.nextBillingAmount.toFixed(2)})</p>
                        <p><strong>Renovação:</strong> {new Date(subscription.renewalDate).toLocaleDateString('pt-BR')}</p>
                        <div className={styles.buttonGroup}>
                            <button className={styles.secondaryButton}>Mudar Plano</button> {/* Link ou modal para mudar plano */}
                            {subscription.status === 'active' && (
                                <button className={styles.dangerButton} onClick={handleCancelSubscription}>Cancelar Assinatura</button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Você não possui uma assinatura ativa no momento.</p>
                )}
            </section>

            {/* Seção de Métodos de Pagamento */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Métodos de Pagamento</h2>
                <div className={styles.paymentMethodsGrid}>
                    {paymentMethods.length > 0 ? (
                        paymentMethods.map(method => (
                            <div key={method.id} className={`${styles.paymentMethodCard} ${method.isDefault ? styles.defaultMethod : ''}`}>
                                {method.type === 'credit_card' && (
                                    <>
                                        <p><strong>Cartão de Crédito</strong> ({method.brand})</p>
                                        <p>Final: **** {method.last4Digits}</p>
                                        <p>Validade: {method.expiryDate}</p>
                                    </>
                                )}
                                {method.type === 'pix' && (
                                    <p><strong>Pix</strong></p>
                                )}
                                {method.type === 'boleto' && (
                                    <p><strong>Boleto Bancário</strong></p>
                                )}
                                {method.isDefault && <span className={styles.defaultBadge}>Padrão</span>}
                                <div className={styles.cardActions}>
                                    {!method.isDefault && (
                                        <button className={styles.actionButton} onClick={() => handleSetDefaultPaymentMethod(method.id)}>Definir como Padrão</button>
                                    )}
                                    <button className={styles.actionButton} onClick={() => handleRemovePaymentMethod(method.id)}>Remover</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum método de pagamento cadastrado.</p>
                    )}
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.primaryButton}>Adicionar Novo Método</button> {/* Abre modal/form */}
                </div>
            </section>

            {/* Seção de Histórico de Transações Recentes */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Transações Recentes</h2>
                {recentTransactions.length > 0 ? (
                    <div className={styles.transactionTableContainer}>
                        <table className={styles.transactionTable}>
                            <thead>
                                <tr>
                                    <th>Data</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTransactions.map(tx => (
                                    <tr key={tx.id}>
                                        <td>{new Date(tx.date).toLocaleDateString('pt-BR')}</td>
                                        <td>{tx.description}</td>
                                        <td>R$ {tx.amount.toFixed(2)}</td>
                                        <td><span className={`${styles.statusBadge} ${styles[tx.status]}`}>{tx.status}</span></td>
                                        <td>
                                            {tx.invoiceUrl && (
                                                <a href={tx.invoiceUrl} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>Baixar Fatura</a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Nenhuma transação recente.</p>
                )}
                <div className={styles.buttonGroup}>
                    <button className={styles.secondaryButton}>Ver Histórico Completo</button> {/* Link para a página de histórico de faturas */}
                </div>
            </section>
        </div>
    );
};

export default PagamentosAssinaturasPage;