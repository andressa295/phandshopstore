"use client"; 

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './PagamentosAssinaturasPage.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '../../UserContext';

// 1. Definindo interfaces para os dados
interface PaymentMethod {
    id: string;
    type: 'credit_card' | 'debit_card' | 'pix' | 'boleto';
    brand?: string;
    last4Digits?: string;
    expiryDate?: string;
    isDefault: boolean;
}

interface SubscriptionInfo {
    planName: string;
    status: 'active' | 'pending' | 'canceled';
    nextBillingDate: string;
    nextBillingAmount: number;
    renewalDate: string;
}

interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'failed';
    invoiceUrl?: string;
}

const PagamentosAssinaturasPage: React.FC = () => {
    const supabase = createClientComponentClient();
    const { profile, loading: userLoading } = useUser();
    
    const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
    const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const fetchData = async () => {
        if (!profile?.lojaId) {
            setError("ID da loja não encontrado.");
            setLoading(false);
            return;
        }

        try {
            // Busca a assinatura
            const { data: assinaturaData, error: assinaturaError } = await supabase
                .from('assinaturas')
                .select(`
                    status,
                    periodo_atual_fim,
                    periodo_atual_inicio,
                    planos(nome_plano, preco_mensal, preco_anual)
                `)
                .eq('loja_id', profile.lojaId)
                .single();
            
            if (assinaturaError) throw assinaturaError;

            // Mapeia a assinatura para o formato do componente
            const plan = assinaturaData.planos?.[0];
            const nextBillingAmount = (assinaturaData.status === 'active') 
                ? (plan?.preco_anual && profile?.recorrencia === 'anual' ? plan.preco_anual : plan?.preco_mensal)
                : 0;
            
            setSubscription({
                planName: plan?.nome_plano || 'Plano Grátis',
                status: assinaturaData.status as 'active',
                nextBillingDate: assinaturaData.periodo_atual_fim,
                nextBillingAmount: nextBillingAmount,
                renewalDate: assinaturaData.periodo_atual_fim,
            });

            // Busca os métodos de pagamento
            const { data: pmData, error: pmError } = await supabase
                .from('payment_methods')
                .select('*')
                .eq('loja_id', profile.lojaId);

            if (pmError) throw pmError;
            setPaymentMethods(pmData as PaymentMethod[]);

            // Busca as transações
            const { data: transactionsData, error: txError } = await supabase
                .from('transactions')
                .select('*')
                .eq('loja_id', profile.lojaId)
                .order('created_at', { ascending: false });
            
            if (txError) throw txError;
            setRecentTransactions(transactionsData as Transaction[]);

            setLoading(false);
        } catch (err: any) {
            console.error("Erro ao carregar dados de pagamentos:", err);
            setError("Não foi possível carregar as informações de pagamentos e assinaturas.");
            setLoading(false);
        }
    };

    useEffect(() => {
        if (profile) {
            fetchData();
        }
    }, [profile]);

    const handleSetDefaultPaymentMethod = (id: string) => {
        setSuccessMessage("Método de pagamento padrão atualizado com sucesso!");
    };

    const handleRemovePaymentMethod = (id: string) => {
        if (window.confirm("Tem certeza que deseja remover este método de pagamento?")) {
            setSuccessMessage("Método de pagamento removido com sucesso!");
        }
    };

    const handleCancelSubscription = () => {
        if (window.confirm("Tem certeza que deseja cancelar sua assinatura?")) {
            setSuccessMessage("Assinatura cancelada com sucesso.");
        }
    };

    if (userLoading || loading) {
        return <div className={styles.loadingState}>Carregando informações de pagamento...</div>;
    }

    if (error) {
        return <div className={styles.errorState}>Erro: {error}</div>;
    }

    return (
        <div className={styles.container}>
            

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>}

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Sua Assinatura Atual</h2>
                {subscription ? (
                    <div className={styles.subscriptionCard}>
                        <p><strong>Plano:</strong> {subscription.planName}</p>
                        <p><strong>Status:</strong> <span className={`${styles.statusBadge} ${styles[subscription.status]}`}>{subscription.status === 'active' ? 'Ativo' : subscription.status === 'pending' ? 'Pendente' : 'Cancelado'}</span></p>
                        <p><strong>Próxima Cobrança:</strong> {new Date(subscription.nextBillingDate).toLocaleDateString('pt-BR')} (R$ {subscription.nextBillingAmount.toFixed(2)})</p>
                        <p><strong>Renovação:</strong> {new Date(subscription.renewalDate).toLocaleDateString('pt-BR')}</p>
                        <div className={styles.buttonGroup}>
                            <button className={`${styles.secondaryButton} ${styles.smallButton}`}>Mudar Plano</button>
                            {subscription.status === 'active' && (
                                <button className={`${styles.dangerButton} ${styles.smallButton}`} onClick={handleCancelSubscription}>Cancelar Assinatura</button>
                            )}
                        </div>
                    </div>
                ) : (
                    <p>Você não possui uma assinatura ativa no momento.</p>
                )}
            </section>

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
                                {method.type === 'pix' && (<p><strong>Pix</strong></p>)}
                                {method.type === 'boleto' && (<p><strong>Boleto Bancário</strong></p>)}
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
                    <button className={styles.primaryButton}>Adicionar Novo Método</button>
                </div>
            </section>

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
                    <button className={styles.secondaryButton}>Ver Histórico Completo</button>
                </div>
            </section>
        </div>
    );
};

export default PagamentosAssinaturasPage;