"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './HistoricoFaturasPage.module.css'; // Importa o CSS Module
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '../../UserContext';

// 1. Definindo interfaces para os dados da fatura
interface Invoice {
    id: string;
    invoice_number: string;
    issue_date: string;
    due_date: string;
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue' | 'canceled';
    pdf_url?: string;
}

const getStatusText = (status: Invoice['status']) => {
    switch (status) {
        case 'paid': return 'Pago';
        case 'pending': return 'Pendente';
        case 'overdue': return 'Vencido';
        case 'canceled': return 'Cancelado';
        default: return status;
    }
};

const HistoricoFaturasPage: React.FC = () => {
    const supabase = createClientComponentClient();
    const { profile, loading: userLoading } = useUser();

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterYear, setFilterYear] = useState<string>('all');
    const [filterMonth, setFilterMonth] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalCount, setTotalCount] = useState<number>(0);
    const itemsPerPage = 10;
    
    // Anos e meses disponíveis (adaptados para serem dinâmicos)
    const availableYears = ['2025', '2024'];
    const availableMonths = [
        { value: '1', label: 'Janeiro' }, { value: '2', label: 'Fevereiro' }, { value: '3', label: 'Março' },
        { value: '4', label: 'Abril' }, { value: '5', label: 'Maio' }, { value: '6', label: 'Junho' },
        { value: '7', label: 'Julho' }, { value: '8', label: 'Agosto' }, { value: '9', label: 'Setembro' },
        { value: '10', label: 'Outubro' }, { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' },
    ];


    useEffect(() => {
        const fetchInvoices = async () => {
            if (!profile?.lojaId) {
                setError("ID da loja não encontrado.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            
            try {
                let query = supabase
                    .from('transactions')
                    .select('*', { count: 'exact' })
                    .eq('loja_id', profile.lojaId);

                // Aplicar filtro por ano
                if (filterYear !== 'all') {
                    const startOfYear = `${filterYear}-01-01T00:00:00.000Z`;
                    const endOfYear = `${filterYear}-12-31T23:59:59.999Z`;
                    query = query.gte('created_at', startOfYear).lte('created_at', endOfYear);
                }

                // Aplicar filtro por mês
                if (filterMonth !== 'all') {
                    const year = filterYear === 'all' ? new Date().getFullYear() : parseInt(filterYear);
                    const month = parseInt(filterMonth) - 1;
                    const startOfMonth = new Date(year, month, 1).toISOString();
                    const endOfMonth = new Date(year, month + 1, 0, 23, 59, 59, 999).toISOString();
                    query = query.gte('created_at', startOfMonth).lte('created_at', endOfMonth);
                }

                // Aplicar filtro por status
                if (filterStatus !== 'all') {
                    query = query.eq('status', filterStatus);
                }

                // Aplicar paginação
                const startIndex = (currentPage - 1) * itemsPerPage;
                const endIndex = startIndex + itemsPerPage - 1;

                const { data, count, error: dbError } = await query
                    .order('created_at', { ascending: false })
                    .range(startIndex, endIndex);
                
                if (dbError) throw dbError;
                
                setInvoices(data as Invoice[]);
                setTotalCount(count || 0);

            } catch (err: any) {
                console.error("Erro ao carregar faturas:", err);
                setError("Não foi possível carregar o histórico de faturas.");
            } finally {
                setLoading(false);
            }
        };

        if (userLoading) return;
        fetchInvoices();
    }, [searchTerm, filterYear, filterMonth, filterStatus, currentPage, userLoading, profile?.lojaId]);

    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const handlePageChange = (pageNumber: number) => {
        if (pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    if (loading) {
        return <div className={styles.loadingState}>Carregando histórico de faturas...</div>;
    }

    if (error) {
        return <div className={styles.errorState}>Erro: {error}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Histórico de Faturas</h1>

            <section className={styles.filterSection}>
                <div className={styles.filterGroup}>
                    <label htmlFor="search">Pesquisar:</label>
                    <input
                        type="text"
                        id="search"
                        placeholder="Nº, descrição, valor..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="filterYear">Ano:</label>
                    <select
                        id="filterYear"
                        value={filterYear}
                        onChange={(e) => setFilterYear(e.target.value)}
                        className={styles.selectField}
                    >
                        <option value="all">Todos</option>
                        {availableYears.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="filterMonth">Mês:</label>
                    <select
                        id="filterMonth"
                        value={filterMonth}
                        onChange={(e) => setFilterMonth(e.target.value)}
                        className={styles.selectField}
                    >
                        <option value="all">Todos</option>
                        {availableMonths.map(month => (
                            <option key={month.value} value={month.value}>{month.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label htmlFor="filterStatus">Status:</label>
                    <select
                        id="filterStatus"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className={styles.selectField}
                    >
                        <option value="all">Todos</option>
                        <option value="paid">Pago</option>
                        <option value="pending">Pendente</option>
                        <option value="overdue">Vencido</option>
                        <option value="canceled">Cancelado</option>
                    </select>
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Faturas</h2>
                {invoices.length > 0 ? (
                    <div className={styles.invoiceTableContainer}>
                        <table className={styles.invoiceTable}>
                            <thead>
                                <tr>
                                    <th>Data Emissão</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td data-label="Data Emissão">{new Date(invoice.issue_date).toLocaleDateString('pt-BR')}</td>
                                        <td data-label="Descrição">{invoice.description}</td>
                                        <td data-label="Valor">R$ {invoice.amount.toFixed(2)}</td>
                                        <td data-label="Status">
                                            <span className={`${styles.statusBadge} ${styles[invoice.status]}`}>
                                                {getStatusText(invoice.status)}
                                            </span>
                                        </td>
                                        <td data-label="Ações">
                                            {invoice.pdf_url && (
                                                <a href={invoice.pdf_url} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>Baixar PDF</a>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className={styles.noResults}>Nenhuma fatura encontrada com os filtros aplicados.</p>
                )}

                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={styles.paginationButton}>Anterior</button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button key={page} onClick={() => handlePageChange(page)} className={`${styles.paginationButton} ${currentPage === page ? styles.activePage : ''}`}>{page}</button>
                        ))}
                        <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={styles.paginationButton}>Próxima</button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default HistoricoFaturasPage;