// app/(interno)/dashboard/menu/historico-faturas/page.tsx
"use client"; // Esta página também precisará de hooks e, portanto, será um Client Component.

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './HistoricoFaturasPage.module.css'; // Vamos criar este CSS Module

// 1. Definindo interfaces para os dados da fatura
interface Invoice {
    id: string;
    invoiceNumber: string;
    issueDate: string; // Formato YYYY-MM-DD
    dueDate: string;   // Formato YYYY-MM-DD
    description: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue' | 'canceled'; // Pago, Pendente, Vencido, Cancelado
    pdfUrl: string; // URL para baixar o PDF da fatura
}

const HistoricoFaturasPage: React.FC = () => {
    // 2. Estados para armazenar os dados e filtros
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [filterYear, setFilterYear] = useState<string>('all');
    const [filterMonth, setFilterMonth] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const itemsPerPage = 10; // Quantidade de faturas por página

    // Dados mockados de exemplo
    const allMockInvoices: Invoice[] = [
        { id: "inv_001", invoiceNumber: "202506-001", issueDate: "2025-06-01", dueDate: "2025-06-10", description: "Assinatura Plano Premium - Junho", amount: 199.90, status: "paid", pdfUrl: "/faturas/202506-001.pdf" },
        { id: "inv_002", invoiceNumber: "202505-002", issueDate: "2025-05-01", dueDate: "2025-05-10", description: "Assinatura Plano Premium - Maio", amount: 199.90, status: "paid", pdfUrl: "/faturas/202505-002.pdf" },
        { id: "inv_003", invoiceNumber: "202504-003", issueDate: "2025-04-01", dueDate: "2025-04-10", description: "Assinatura Plano Premium - Abril", amount: 199.90, status: "paid", pdfUrl: "/faturas/202504-003.pdf" },
        { id: "inv_004", invoiceNumber: "202503-004", issueDate: "2025-03-01", dueDate: "2025-03-10", description: "Assinatura Plano Premium - Março", amount: 199.90, status: "paid", pdfUrl: "/faturas/202503-004.pdf" },
        { id: "inv_005", invoiceNumber: "202502-005", issueDate: "2025-02-01", dueDate: "2025-02-10", description: "Assinatura Plano Premium - Fevereiro", amount: 199.90, status: "paid", pdfUrl: "/faturas/202502-005.pdf" },
        { id: "inv_006", invoiceNumber: "202501-006", issueDate: "2025-01-01", dueDate: "2025-01-10", description: "Assinatura Plano Premium - Janeiro", amount: 199.90, status: "paid", pdfUrl: "/faturas/202501-006.pdf" },
        { id: "inv_007", invoiceNumber: "202412-007", issueDate: "2024-12-01", dueDate: "2024-12-10", description: "Assinatura Plano Premium - Dezembro", amount: 199.90, status: "paid", pdfUrl: "/faturas/202412-007.pdf" },
        { id: "inv_008", invoiceNumber: "202411-008", issueDate: "2024-11-01", dueDate: "2024-11-10", description: "Assinatura Plano Premium - Novembro", amount: 199.90, status: "pending", pdfUrl: "/faturas/202411-008.pdf" },
        { id: "inv_009", invoiceNumber: "202410-009", issueDate: "2024-10-01", dueDate: "2024-10-10", description: "Assinatura Plano Premium - Outubro", amount: 199.90, status: "overdue", pdfUrl: "/faturas/202410-009.pdf" },
        { id: "inv_010", invoiceNumber: "202409-010", issueDate: "2024-09-01", dueDate: "2024-09-10", description: "Assinatura Plano Premium - Setembro", amount: 199.90, status: "paid", pdfUrl: "/faturas/202409-010.pdf" },
        // Adicione mais faturas mockadas para teste de paginação
        { id: "inv_011", invoiceNumber: "202408-011", issueDate: "2024-08-01", dueDate: "2024-08-10", description: "Assinatura Plano Premium - Agosto", amount: 199.90, status: "paid", pdfUrl: "/faturas/202408-011.pdf" },
        { id: "inv_012", invoiceNumber: "202407-012", issueDate: "2024-07-01", dueDate: "2024-07-10", description: "Assinatura Plano Premium - Julho", amount: 199.90, status: "paid", pdfUrl: "/faturas/202407-012.pdf" },
        { id: "inv_013", invoiceNumber: "202406-013", issueDate: "2024-06-01", dueDate: "2024-06-10", description: "Assinatura Plano Premium - Junho", amount: 199.90, status: "paid", pdfUrl: "/faturas/202406-013.pdf" },
        { id: "inv_014", invoiceNumber: "202405-014", issueDate: "2024-05-01", dueDate: "2024-05-10", description: "Assinatura Plano Premium - Maio", amount: 199.90, status: "canceled", pdfUrl: "/faturas/202405-014.pdf" },
    ];


    // 3. Efeito para carregar e filtrar os dados
    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            setError(null);
            try {
                await new Promise(resolve => setTimeout(resolve, 800)); // Simula API call

                let filtered = allMockInvoices;

                // Aplicar filtro por termo de busca
                if (searchTerm) {
                    const lowerCaseSearchTerm = searchTerm.toLowerCase();
                    filtered = filtered.filter(invoice =>
                        invoice.invoiceNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
                        invoice.description.toLowerCase().includes(lowerCaseSearchTerm) ||
                        invoice.amount.toFixed(2).includes(lowerCaseSearchTerm)
                    );
                }

                // Aplicar filtro por ano
                if (filterYear !== 'all') {
                    filtered = filtered.filter(invoice => 
                        new Date(invoice.issueDate).getFullYear().toString() === filterYear
                    );
                }

                // Aplicar filtro por mês
                if (filterMonth !== 'all') {
                    // Mês em JavaScript é 0-11, então precisamos ajustar
                    filtered = filtered.filter(invoice => 
                        (new Date(invoice.issueDate).getMonth() + 1).toString() === filterMonth
                    );
                }

                // Aplicar filtro por status
                if (filterStatus !== 'all') {
                    filtered = filtered.filter(invoice => invoice.status === filterStatus);
                }

                setInvoices(filtered);
                setLoading(false);

            } catch (err) {
                console.error("Erro ao carregar faturas:", err);
                setError("Não foi possível carregar o histórico de faturas.");
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [searchTerm, filterYear, filterMonth, filterStatus]); // Dependências para re-executar o filtro

    // Lógica de Paginação
    const totalPages = Math.ceil(invoices.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentInvoices = invoices.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    const getStatusText = (status: Invoice['status']) => {
        switch (status) {
            case 'paid': return 'Pago';
            case 'pending': return 'Pendente';
            case 'overdue': return 'Vencido';
            case 'canceled': return 'Cancelado';
            default: return status;
        }
    };

    if (loading) {
        return <div className={styles.loadingState}>Carregando histórico de faturas...</div>;
    }

    if (error) {
        return <div className={styles.errorState}>Erro: {error}</div>;
    }

    const availableYears = Array.from(new Set(allMockInvoices.map(inv => new Date(inv.issueDate).getFullYear().toString()))).sort((a, b) => parseInt(b) - parseInt(a));
    const availableMonths = [
        { value: '1', label: 'Janeiro' }, { value: '2', label: 'Fevereiro' }, { value: '3', label: 'Março' },
        { value: '4', label: 'Abril' }, { value: '5', label: 'Maio' }, { value: '6', label: 'Junho' },
        { value: '7', label: 'Julho' }, { value: '8', label: 'Agosto' }, { value: '9', label: 'Setembro' },
        { value: '10', label: 'Outubro' }, { value: '11', label: 'Novembro' }, { value: '12', label: 'Dezembro' },
    ];

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Histórico de Faturas</h1>

            {/* Seção de Filtros */}
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

            {/* Tabela de Faturas */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Faturas</h2>
                {currentInvoices.length > 0 ? (
                    <div className={styles.invoiceTableContainer}>
                        <table className={styles.invoiceTable}>
                            <thead>
                                <tr>
                                    <th>Nº Fatura</th>
                                    <th>Data Emissão</th>
                                    <th>Vencimento</th>
                                    <th>Descrição</th>
                                    <th>Valor</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentInvoices.map(invoice => (
                                    <tr key={invoice.id}>
                                        <td data-label="Nº Fatura">{invoice.invoiceNumber}</td>
                                        <td data-label="Data Emissão">{new Date(invoice.issueDate).toLocaleDateString('pt-BR')}</td>
                                        <td data-label="Vencimento">{new Date(invoice.dueDate).toLocaleDateString('pt-BR')}</td>
                                        <td data-label="Descrição">{invoice.description}</td>
                                        <td data-label="Valor">R$ {invoice.amount.toFixed(2)}</td>
                                        <td data-label="Status">
                                            <span className={`${styles.statusBadge} ${styles[invoice.status]}`}>
                                                {getStatusText(invoice.status)}
                                            </span>
                                        </td>
                                        <td data-label="Ações" className={styles.actionsCell}>
                                            <a href={invoice.pdfUrl} target="_blank" rel="noopener noreferrer" className={styles.actionLink}>Baixar PDF</a>
                                            {invoice.status === 'pending' || invoice.status === 'overdue' ? (
                                                <button className={styles.payButton} onClick={() => alert(`Pagar fatura ${invoice.invoiceNumber}`)}>Pagar Agora</button>
                                            ) : null}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className={styles.noResults}>Nenhuma fatura encontrada com os filtros aplicados.</p>
                )}

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className={styles.pagination}>
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className={styles.paginationButton}
                        >
                            Anterior
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`${styles.paginationButton} ${currentPage === page ? styles.activePage : ''}`}
                            >
                                {page}
                            </button>
                        ))}
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className={styles.paginationButton}
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </section>
        </div>
    );
};

export default HistoricoFaturasPage;