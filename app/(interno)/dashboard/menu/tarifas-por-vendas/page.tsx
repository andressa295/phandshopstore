// app/(interno)/dashboard/menu/tarifas-por-vendas/page.tsx
"use client";

import React, { useState, FormEvent, useEffect } from 'react'; // Adicionado useEffect para simular carga do plano
import styles from './TarifasPorVendasPage.module.css';

// 1. Definindo interfaces (simplificadas com base na nova regra)
interface TariffDetail {
    name: string;
    description: string;
    rate: string;
}

const TarifasPorVendasPage: React.FC = () => {
    // 2. Estado para a calculadora de tarifas
    const [saleAmount, setSaleAmount] = useState<number | ''>('');
    const [calculatedFee, setCalculatedFee] = useState<number | null>(null);
    const [netAmount, setNetAmount] = useState<number | null>(null);
    
    // Novo estado para simular o plano do usuário
    // Em um cenário real, você buscaria isso da API do usuário logado
    const [userPlan, setUserPlan] = useState<'gratuito' | 'premium' | 'outro' | null>(null);
    const [loadingPlan, setLoadingPlan] = useState<boolean>(true);


    // Efeito para carregar o plano do usuário (simulação)
    useEffect(() => {
        const fetchUserPlan = async () => {
            setLoadingPlan(true);
            // Simula uma chamada de API para obter o plano do usuário
            await new Promise(resolve => setTimeout(resolve, 500));
            // Exemplo: usuário no plano gratuito
            setUserPlan('gratuito'); // Ou 'premium' ou 'outro'
            setLoadingPlan(false);
        };
        fetchUserPlan();
    }, []);

    // Apenas uma tarifa agora: a nossa por venda no plano gratuito
    const tariffs: TariffDetail[] = [
        { 
            name: "Tarifa sobre Vendas (Plano Gratuito)", 
            description: "Esta é a nossa tarifa de plataforma, aplicada apenas a usuários no plano gratuito. Garante acesso contínuo aos recursos essenciais da plataforma sem mensalidades.", 
            rate: "2.5% por venda" 
        },
        // Você pode adicionar mais itens se houver outras tarifas MUITO específicas e pequenas,
        // mas com a regra de "demais planos tarifa 0", não haveria tarifa de plataforma aqui.
    ];

    // Lógica da calculadora de tarifas
    const OUR_PLATFORM_FEE_RATE = 0.025; // 2.5%

    const calculateFees = (amount: number) => {
        if (userPlan === 'gratuito') {
            const fee = amount * OUR_PLATFORM_FEE_RATE;
            const finalAmount = amount - fee;
            setCalculatedFee(fee);
            setNetAmount(finalAmount);
        } else {
            // Para planos pagos, a tarifa é 0%
            setCalculatedFee(0);
            setNetAmount(amount);
        }
    };

    const handleCalculate = (e: FormEvent) => {
        e.preventDefault();
        if (saleAmount === '' || isNaN(Number(saleAmount)) || Number(saleAmount) <= 0) {
            alert('Por favor, insira um valor de venda válido.');
            setCalculatedFee(null);
            setNetAmount(null);
            return;
        }
        calculateFees(Number(saleAmount));
    };

    if (loadingPlan) {
        return <div className={styles.loadingState}>Carregando informações de tarifas...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Tarifas por Vendas</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Visão Geral e Política de Tarifas</h2>
                <p className={styles.paragraph}>
                    Nossa política de tarifas é desenhada para oferecer flexibilidade e clareza.
                    Compreendemos a importância de otimizar seus ganhos.
                </p>
                {userPlan === 'gratuito' ? (
                    <p className={`${styles.paragraph} ${styles.highlightedText}`}>
                        **Como usuário do Plano Gratuito, uma tarifa de **<span className={styles.emphasis}>2,5%</span>** é aplicada sobre o valor de cada venda realizada através da plataforma.** Essa taxa nos permite manter a infraestrutura e os recursos essenciais do plano gratuito.
                    </p>
                ) : (
                    <p className={`${styles.paragraph} ${styles.highlightedText}`}>
                        **Excelente notícia! Como usuário do seu plano atual ({userPlan ? userPlan.toUpperCase() : 'Plano Pago'}), você possui **<span className={styles.emphasis}>Tarifa 0%</span>** sobre as vendas!** Aproveite para maximizar seus lucros.
                    </p>
                )}
                <p className={styles.paragraph}>
                    Para conhecer os benefícios dos nossos planos e talvez **eliminar suas tarifas de venda**, visite a página de <a href="/dashboard/planos" className={styles.actionLink}>Planos</a>.
                </p>
            </section>

            {userPlan === 'gratuito' && (
                <>
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Detalhes da Tarifa</h2>
                        <div className={styles.tariffGrid}>
                            {tariffs.map((tariff, index) => (
                                <div key={index} className={styles.tariffCard}>
                                    <h3>{tariff.name}</h3>
                                    <p className={styles.tariffDescription}>{tariff.description}</p>
                                    <p className={styles.tariffRate}><strong>{tariff.rate}</strong></p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Calculadora de Tarifas</h2>
                        <p className={styles.paragraph}>
                            Insira o valor da sua venda para calcular o valor da tarifa e o valor líquido que você receberá.
                        </p>
                        <form onSubmit={handleCalculate} className={styles.calculatorForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="saleAmount">Valor da Venda (R$):</label>
                                <input
                                    type="number"
                                    id="saleAmount"
                                    name="saleAmount"
                                    value={saleAmount}
                                    onChange={(e) => setSaleAmount(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    step="0.01"
                                    min="0"
                                    placeholder="Ex: 100.00"
                                    className={styles.inputField}
                                    required
                                />
                            </div>
                            {/* Removido o seletor de método de pagamento, pois a tarifa é única para o plano gratuito */}
                            <button type="submit" className={styles.primaryButton}>Calcular</button>
                        </form>

                        {calculatedFee !== null && netAmount !== null && (
                            <div className={styles.calculationResults}>
                                <p><strong>Tarifa Total:</strong> <span className={styles.feeAmount}>R$ {calculatedFee.toFixed(2)}</span></p>
                                <p><strong>Valor Líquido Recebido:</strong> <span className={styles.netAmount}>R$ {netAmount.toFixed(2)}</span></p>
                            </div>
                        )}
                    </section>
                </>
            )}

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Precisa de Ajuda?</h2>
                <p className={styles.paragraph}>
                    Se você tiver dúvidas sobre nossas tarifas ou precisar de mais informações, consulte nossa seção de <a href="/faq/tarifas" className={styles.actionLink}>Perguntas Frequentes sobre Tarifas</a> ou entre em contato com o nosso <a href="/suporte" className={styles.actionLink}>Suporte ao Cliente</a>.
                </p>
            </section>
        </div>
    );
};

export default TarifasPorVendasPage;