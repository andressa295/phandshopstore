"use client";

import React, { useState, useEffect } from 'react';
import styles from './SessoesDispositivosPage.module.css'; // Vamos criar este CSS Module

// 1. Interface para a sessão/dispositivo
interface UserSession {
    id: string;
    type: string;      // Ex: "Desktop", "Mobile", "Tablet"
    browser: string;   // Ex: "Chrome", "Firefox", "Safari"
    os: string;        // Ex: "Windows 10", "Android", "iOS"
    ipAddress: string; // Endereço IP
    location: string;  // Ex: "São Paulo, Brasil"
    loginTime: string; // Data e hora do login
    lastActivity: string; // Última atividade
    isCurrent: boolean; // Se é a sessão que o usuário está usando agora
}

const SessoesDispositivosPage: React.FC = () => {
    // 2. Estado para armazenar as sessões
    const [sessions, setSessions] = useState<UserSession[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 3. Efeito para carregar as sessões
    useEffect(() => {
        const fetchSessions = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API call

                const mockSessions: UserSession[] = [
                    {
                        id: 's1',
                        type: 'Desktop',
                        browser: 'Chrome',
                        os: 'Windows 10',
                        ipAddress: '189.100.1.1',
                        location: 'São Paulo, Brasil',
                        loginTime: '2025-06-23T10:00:00Z',
                        lastActivity: '2025-06-23T16:00:00Z',
                        isCurrent: true,
                    },
                    {
                        id: 's2',
                        type: 'Mobile',
                        browser: 'Safari',
                        os: 'iOS 17',
                        ipAddress: '200.50.2.10',
                        location: 'Rio de Janeiro, Brasil',
                        loginTime: '2025-06-22T08:00:00Z',
                        lastActivity: '2025-06-22T19:30:00Z',
                        isCurrent: false,
                    },
                    {
                        id: 's3',
                        type: 'Tablet',
                        browser: 'Firefox',
                        os: 'Android 12',
                        ipAddress: '177.30.5.20',
                        location: 'Belo Horizonte, Brasil',
                        loginTime: '2025-06-20T14:15:00Z',
                        lastActivity: '2025-06-20T16:00:00Z',
                        isCurrent: false,
                    },
                ];

                setSessions(mockSessions);
                setLoading(false);

            } catch (err) {
                console.error("Erro ao carregar sessões:", err);
                setErrorMessage("Não foi possível carregar as informações de sessões e dispositivos.");
                setLoading(false);
            }
        };

        fetchSessions();
    }, []);

    // Função para encerrar uma sessão específica
    const handleEndSession = async (sessionId: string, isCurrentSession: boolean) => {
        if (isCurrentSession) {
            setErrorMessage('Não é possível encerrar a sua sessão atual por aqui. Por favor, faça logout.');
            setSuccessMessage(null);
            return;
        }

        setSuccessMessage(null);
        setErrorMessage(null);
        if (window.confirm('Tem certeza que deseja encerrar esta sessão? O usuário precisará fazer login novamente neste dispositivo.')) {
            setLoading(true);
            try {
                // Simula API call para encerrar a sessão
                await new Promise(resolve => setTimeout(resolve, 800));
                setSessions(prev => prev.filter(session => session.id !== sessionId));
                setSuccessMessage('Sessão encerrada com sucesso!');
            } catch (err) {
                setErrorMessage('Erro ao encerrar a sessão. Tente novamente.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Função para encerrar todas as outras sessões
    const handleEndAllOtherSessions = async () => {
        setSuccessMessage(null);
        setErrorMessage(null);
        if (window.confirm('Tem certeza que deseja encerrar TODAS as outras sessões? Você permanecerá logado(a) apenas neste dispositivo.')) {
            setLoading(true);
            try {
                // Simula API call para encerrar todas as outras sessões
                await new Promise(resolve => setTimeout(resolve, 1500));
                setSessions(prev => prev.filter(session => session.isCurrent)); // Remove todas, exceto a atual
                setSuccessMessage('Todas as outras sessões foram encerradas com sucesso!');
            } catch (err) {
                setErrorMessage('Erro ao encerrar todas as sessões. Tente novamente.');
            } finally {
                setLoading(false);
            }
        }
    };

    const currentSession = sessions.find(s => s.isCurrent);
    const otherSessions = sessions.filter(s => !s.isCurrent);

    if (loading) {
        return <div className={styles.loadingState}>Carregando sessões e dispositivos...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Sessões e Dispositivos</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            {/* Seção da Sessão Atual */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Sessão Atual</h2>
                {currentSession ? (
                    <div className={styles.currentSessionCard}>
                        <p><strong>Dispositivo:</strong> {currentSession.type} ({currentSession.os} - {currentSession.browser})</p>
                        <p><strong>Endereço IP:</strong> {currentSession.ipAddress}</p>
                        <p><strong>Localização Estimada:</strong> {currentSession.location}</p>
                        <p><strong>Login em:</strong> {new Date(currentSession.loginTime).toLocaleString('pt-BR')}</p>
                        <p><strong>Última Atividade:</strong> {new Date(currentSession.lastActivity).toLocaleString('pt-BR')}</p>
                        <p className={styles.currentSessionBadge}>Você está aqui</p>
                    </div>
                ) : (
                    <p className={styles.noData}>Não foi possível carregar a sessão atual.</p>
                )}
            </section>

            {/* Seção de Outras Sessões Ativas */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Outras Sessões Ativas</h2>
                {otherSessions.length > 0 ? (
                    <div className={styles.tableContainer}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Dispositivo</th>
                                    <th>Localização</th>
                                    <th>Login em</th>
                                    <th>Última Atividade</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {otherSessions.map(session => (
                                    <tr key={session.id}>
                                        <td data-label="Dispositivo">{session.type} ({session.os} - {session.browser})</td>
                                        <td data-label="Localização">{session.location}</td>
                                        <td data-label="Login em">{new Date(session.loginTime).toLocaleString('pt-BR')}</td>
                                        <td data-label="Última Atividade">{new Date(session.lastActivity).toLocaleString('pt-BR')}</td>
                                        <td data-label="Ações">
                                            <button 
                                                onClick={() => handleEndSession(session.id, session.isCurrent)} 
                                                className={styles.actionButton}
                                                disabled={loading}
                                            >
                                                Desconectar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className={styles.noData}>Nenhuma outra sessão ativa encontrada.</p>
                )}
                <div className={styles.buttonGroup}>
                    {otherSessions.length > 0 && (
                        <button 
                            onClick={handleEndAllOtherSessions} 
                            className={styles.dangerButton}
                            disabled={loading}
                        >
                            Encerrar Todas as Outras Sessões
                        </button>
                    )}
                    <a href="/dashboard/medidas-seguranca" className={styles.secondaryButton}>Gerenciar Segurança da Conta</a>
                </div>
            </section>
        </div>
    );
};

export default SessoesDispositivosPage;