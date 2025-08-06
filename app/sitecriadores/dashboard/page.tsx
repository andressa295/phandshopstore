'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import styles from "./PainelAfiliado.module.css";
import { 
    FaUserCircle, 
    FaSignOutAlt, 
    FaCopy, 
    FaWhatsapp, 
    FaTwitter, 
    FaCheckCircle, 
    FaExclamationCircle, 
    FaTimesCircle, 
    FaPiggyBank, 
    FaUniversity, 
    FaUsers,
    FaMoneyBillWave,
} from 'react-icons/fa';

// Conexão com o Supabase.
// Certifique-se de que estas variáveis de ambiente estão configuradas no seu projeto Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Afiliado {
    id: string;
    nome: string;
    link_completo: string;
    info_pagamento: { pixTipo?: string, pixChave?: string, banco?: string, agencia?: string, conta?: string } | null;
    total_ganho_vitalicio: number; // Supondo que você armazena isso na tabela afiliados
}

interface Indicacao {
    id: string; // UUID para indicações
    loja: string; 
    data: string; 
    plano: string; 
    plano_preco: number;
    status: 'ativo' | 'inadimplente' | 'cancelado'; 
    comissao: number; 
}

interface Kpi {
    title: string;
    value: string | number;
    icon: React.ReactElement; 
}

// Funções de formatação
const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export default function PainelAfiliado() {
    const router = useRouter();
    const [afiliado, setAfiliado] = useState<Afiliado | null>(null);
    const [indicacoes, setIndicacoes] = useState<Indicacao[]>([]);
    const [graficoData, setGraficoData] = useState<{ mes: string, clientes: number }[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<'pix' | 'banco'>('pix');
    const [copied, setCopied] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState({
        pixTipo: 'CPF',
        pixChave: '',
        banco: '',
        agencia: '',
        conta: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error', message: string } | null>(null);
    const [kpis, setKpis] = useState<Kpi[]>([ 
        { title: "Comissão a Receber", value: "R$ 0,00", icon: <FaPiggyBank /> },
        { title: "Total Ganho (Vitalício)", value: "R$ 0,00", icon: <FaMoneyBillWave /> },
        { title: "Lojas Ativas", value: 0, icon: <FaCheckCircle /> },
        { title: "Total de Indicações", value: 0, icon: <FaUsers /> },
    ]);

    // Função para calcular a comissão de uma indicação
    const calcularComissao = (planoPreco: number, statusPagamento: Indicacao['status']): number => {
        if (statusPagamento !== 'ativo') return 0; 
        if (planoPreco >= 149.90) {
            return planoPreco * 0.15; 
        }
        return 0; 
    };

    useEffect(() => {
        async function fetchAfiliadoData() {
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (userError || !user) {
                router.push('/sitecriadores/login'); 
                return;
            }

            // 1. Buscar dados do afiliado
            const { data: afiliadoData, error: afiliadoError } = await supabase
                .from('afiliados')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (afiliadoError) {
                console.error('Erro ao buscar dados do afiliado:', afiliadoError);
                setFeedbackMessage({ type: 'error', message: `Erro ao carregar dados do afiliado: ${afiliadoError.message}` });
                return;
            }
            setAfiliado(afiliadoData);
            console.log('Dados do afiliado carregados:', afiliadoData); 

            // Preencher informações de pagamento se existirem
            if (afiliadoData.info_pagamento) {
                if (afiliadoData.info_pagamento.pixChave) {
                    setPaymentMethod('pix');
                    setPaymentInfo({
                        pixTipo: afiliadoData.info_pagamento.pixTipo || 'CPF',
                        pixChave: afiliadoData.info_pagamento.pixChave,
                        banco: '', agencia: '', conta: ''
                    });
                } else if (afiliadoData.info_pagamento.banco) {
                    setPaymentMethod('banco');
                    setPaymentInfo({
                        pixTipo: 'CPF', pixChave: '',
                        banco: afiliadoData.info_pagamento.banco.banco,
                        agencia: afiliadoData.info_pagamento.banco.agencia,
                        conta: afiliadoData.info_pagamento.banco.conta
                    });
                }
            }

            // 2. Buscar indicações do afiliado
            const { data: indicacoesData, error: indicacoesError } = await supabase
                .from('indicacoes_afiliados')
                .select(`
                    *,
                    planos ( nome, preco_mensal )
                `)
                .eq('afiliado_id', afiliadoData.id);

            if (indicacoesError) {
                console.error('Erro ao buscar indicações:', indicacoesError);
                setFeedbackMessage({ type: 'error', message: `Erro ao carregar indicações: ${indicacoesError.message}` });
                return;
            }

            // Processar indicações para calcular comissões e preparar para o gráfico
            const processedIndicacoes: Indicacao[] = indicacoesData.map((ind: any) => ({
                id: ind.id,
                loja: ind.loja_nome, 
                data: new Date(ind.data_adesao).toLocaleDateString('pt-BR'), 
                plano: ind.planos?.nome || 'N/A', 
                plano_preco: ind.planos?.preco_mensal || 0,
                status: ind.status_pagamento, 
                comissao: calcularComissao(ind.planos?.preco_mensal || 0, ind.status_pagamento),
            }));
            setIndicacoes(processedIndicacoes);

            // 3. Calcular KPIs
            const totalIndicacoes = processedIndicacoes.length;
            const lojasAtivas = processedIndicacoes.filter(i => i.status === 'ativo').length;
            const comissaoAReceber = processedIndicacoes
                .filter(i => i.status === 'ativo') 
                .reduce((sum, i) => sum + i.comissao, 0);

            setKpis([
                { title: "Comissão a Receber", value: formatCurrency(comissaoAReceber), icon: <FaPiggyBank /> },
                { title: "Total Ganho (Vitalício)", value: formatCurrency(afiliadoData.total_ganho_vitalicio || 0), icon: <FaMoneyBillWave /> },
                { title: "Lojas Ativas", value: lojasAtivas, icon: <FaCheckCircle /> },
                { title: "Total de Indicações", value: totalIndicacoes, icon: <FaUsers /> },
            ]);

            // 4. Preparar dados para o gráfico
            const monthlyClients: { [key: string]: number } = {};
            processedIndicacoes.forEach(ind => {
                const month = new Date(ind.data).toLocaleString('pt-BR', { month: 'short' }); 
                monthlyClients[month] = (monthlyClients[month] || 0) + 1;
            });
            const sortedMonths = Object.keys(monthlyClients).sort((a, b) => {
                const monthOrder = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
                return monthOrder.indexOf(a.toLowerCase()) - monthOrder.indexOf(b.toLowerCase());
            });
            setGraficoData(sortedMonths.map(mes => ({ mes, clientes: monthlyClients[mes] })));

        }
        fetchAfiliadoData();
    }, [router]); 

    const handleCopy = () => {
        if (afiliado?.link_completo) {
            navigator.clipboard.writeText(afiliado.link_completo);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handlePaymentInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPaymentInfo(prev => ({ ...prev, [name]: value }));
    };

    const handleSavePaymentInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setFeedbackMessage(null);
        if (!afiliado) return;

        const infoToSave = paymentMethod === 'pix' ? 
            { pixTipo: paymentInfo.pixTipo, pixChave: paymentInfo.pixChave, banco: null, agencia: null, conta: null } :
            { pixTipo: null, pixChave: null, banco: paymentInfo.banco, agencia: paymentInfo.agencia, conta: paymentInfo.conta };
        
        const { error } = await supabase
            .from('afiliados')
            .update({ info_pagamento: infoToSave })
            .eq('id', afiliado.id);
        
        setIsSaving(false);

        if (error) {
            console.error('Erro ao salvar informações de pagamento:', error);
            setFeedbackMessage({ type: 'error', message: 'Erro ao salvar informações. Tente novamente.' });
        } else {
            setFeedbackMessage({ type: 'success', message: 'Informações de pagamento salvas com sucesso!' });
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            <header className={styles.header}>
                <Image src="/logo.png" alt="Phandshop Logo" width={150} height={40} />
                <div className={styles.userMenu}>
                    <FaUserCircle />
                    <span>Olá, {afiliado?.nome || 'Parceiro'}!</span>
                    <Link href="/sitecriadores/login" className={styles.logoutButton}>
                        <FaSignOutAlt /> Sair
                    </Link>
                </div>
            </header>

            <main className={styles.mainContent}>
                {feedbackMessage && (
                    <div className={`${styles.feedbackMessage} ${styles[feedbackMessage.type]}`}>
                        {feedbackMessage.message}
                    </div>
                )}
                <section className={styles.kpiGrid}>
                    {kpis.map((kpi, index) => (
                        <div key={kpi.title} className={`${styles.card} ${styles.kpiCard} ${index === 0 ? styles.primary : ''}`}>
                            <div className={styles.kpiIcon}>{kpi.icon}</div>
                            <div className={styles.kpiInfo}>
                                <p>{kpi.title}</p>
                                <span>{typeof kpi.value === 'number' ? kpi.value : kpi.value}</span>
                            </div>
                        </div>
                    ))}
                </section>

                <div className={styles.mainGrid}>
                    <div className={styles.leftColumn}>
                        <div className={styles.card}>
                            <h2>Sua Ferramenta de Divulgação</h2>
                            <p className={styles.cardSubtitle}>Use seu link mágico para indicar a Phandshop e ganhar comissões.</p>
                            <div className={styles.linkWrapper}>
                                <input type="text" readOnly value={afiliado?.link_completo || ''} />
                                <button onClick={handleCopy}>{copied ? "Copiado!" : "Copiar"}</button>
                            </div>
                            <div className={styles.shareButtons}>
                                <span>Compartilhar em:</span>
                                <FaWhatsapp className={styles.shareIcon} />
                                <FaTwitter className={styles.shareIcon} />
                            </div>
                        </div>

                        <div className={styles.card}>
                            <h2>Suas Indicações</h2>
                            {indicacoes.length > 0 ? (
                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Loja Indicada</th>
                                                <th>Data</th>
                                                <th>Plano</th>
                                                <th>Status</th>
                                                <th>Sua Comissão/Mês</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {indicacoes.map(ind => (
                                                <tr key={ind.id}>
                                                    <td>{ind.loja}</td>
                                                    <td>{ind.data}</td>
                                                    <td>{ind.plano}</td>
                                                    <td>
                                                        <span className={`${styles.statusBadge} ${styles['status' + ind.status]}`}>
                                                            {ind.status === 'ativo' && <FaCheckCircle />}
                                                            {ind.status === 'inadimplente' && <FaExclamationCircle />}
                                                            {ind.status === 'cancelado' && <FaTimesCircle />}
                                                            {ind.status}
                                                        </span>
                                                    </td>
                                                    <td>{formatCurrency(ind.comissao)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className={styles.emptyState}>
                                    <FaUsers />
                                    <h3>Nenhuma indicação ainda</h3>
                                    <p>Compartilhe seu link mágico para começar a ganhar comissões!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.rightColumn}>
                        <div className={styles.card}>
                            <form onSubmit={handleSavePaymentInfo}>
                                <h2>Informações para Recebimento</h2>
                                <p className={styles.cardSubtitle}>Mantenha seus dados atualizados para receber suas comissões em dia.</p>
                                
                                <div className={styles.tabs}>
                                    <button type="button" onClick={() => setPaymentMethod('pix')} className={paymentMethod === 'pix' ? styles.activeTab : ''}><FaPiggyBank /> PIX</button>
                                    <button type="button" onClick={() => setPaymentMethod('banco')} className={paymentMethod === 'banco' ? styles.activeTab : ''}><FaUniversity /> Conta Bancária</button>
                                </div>

                                {paymentMethod === 'pix' ? (
                                    <div className={styles.formContent}>
                                        <label htmlFor="pixTipo">Tipo de Chave PIX</label>
                                        <select id="pixTipo" name="pixTipo" value={paymentInfo.pixTipo} onChange={handlePaymentInfoChange}>
                                            <option value="CPF">CPF</option>
                                            <option value="CNPJ">CNPJ</option>
                                            <option value="EMAIL">E-mail</option>
                                            <option value="CELULAR">Celular</option>
                                            <option value="ALEATORIA">Chave Aleatória</option>
                                        </select>
                                        <label htmlFor="pixChave">Chave PIX</label>
                                        <input id="pixChave" name="pixChave" type="text" placeholder="Sua chave PIX" value={paymentInfo.pixChave} onChange={handlePaymentInfoChange} />
                                    </div>
                                ) : (
                                    <div className={styles.formContent}>
                                        <label htmlFor="banco">Banco</label>
                                        <input id="banco" name="banco" type="text" placeholder="Ex: 260 - Nu Pagamentos S.A." value={paymentInfo.banco} onChange={handlePaymentInfoChange} />
                                        <label htmlFor="agencia">Agência</label>
                                        <input id="agencia" name="agencia" type="text" placeholder="0001" value={paymentInfo.agencia} onChange={handlePaymentInfoChange} />
                                        <label htmlFor="conta">Conta com dígito</label>
                                        <input id="conta" name="conta" type="text" placeholder="123456-7" value={paymentInfo.conta} onChange={handlePaymentInfoChange} />
                                    </div>
                                )}
                                <button type="submit" className={styles.saveButton} disabled={isSaving}>
                                    {isSaving ? 'Salvando...' : 'Salvar Informações'}
                                </button>
                            </form>
                        </div>
                        <div className={styles.card}>
                            <h2>Novos Clientes Indicados</h2>
                            <div className={styles.graficoWrapper}>
                                <svg viewBox="0 0 300 120" aria-label="Gráfico de clientes últimos meses" role="img">
                                    {[...Array(5)].map((_, i) => <line key={i} x1="0" y1={i * 25} x2="300" y2={i * 25} stroke="#e9e9f2" strokeWidth="1"/>)}
                                    <polyline fill="none" stroke="var(--brand-purple)" strokeWidth="2"
                                        points={graficoData.map((d, i) => `${(i * 50) + 25},${100 - d.clientes * 6}`).join(' ')}
                                    />
                                    {graficoData.map((d, i) => (
                                        <g key={d.mes}>
                                            <circle cx={(i * 50) + 25} cy={100 - d.clientes * 6} r="3" fill="var(--brand-purple)" />
                                            <text x={(i * 50) + 25} y="115" className={styles.chartLabel}>{d.mes}</text>
                                        </g>
                                    ))}
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className={styles.footer}>
                <p>© {new Date().getFullYear()} Phandshop. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}
