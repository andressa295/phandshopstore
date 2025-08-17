// app/(interno)/dashboard/menu/medidas-seguranca/page.tsx
"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './MedidasSegurancaPage.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// 1. Interfaces para os dados (ajustadas para o Supabase)
interface LoginActivity {
    id: string;
    timestamp: string;
    device: string;
    location: string;
    ipAddress: string;
    status: 'success' | 'failed';
}

interface ConnectedDevice {
    id: string;
    type: string;
    browser: string;
    os: string;
    lastAccess: string;
    location: string;
    isCurrent: boolean;
}

const MedidasSegurancaPage: React.FC = () => {
    const supabase = createClientComponentClient();
    const [is2faEnabled, setIs2faEnabled] = useState<boolean>(false);
    const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);
    const [connectedDevices, setConnectedDevices] = useState<ConnectedDevice[]>([]);

    const [currentPassword, setCurrentPassword] = useState<string>('');
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>('');

    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    setErrorMessage("Usuário não autenticado.");
                    setLoading(false);
                    return;
                }

                // Busca atividades de login
                const { data: activitiesData, error: activitiesError } = await supabase
                    .from('login_activities')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('timestamp', { ascending: false });
                
                if (activitiesError) throw activitiesError;
                setLoginActivities(activitiesData.map(a => ({
                    id: a.id,
                    timestamp: a.timestamp,
                    device: a.device || 'N/A',
                    location: a.location || 'N/A',
                    ipAddress: a.ip_address || 'N/A',
                    status: a.status as 'success' | 'failed',
                })));

                // Busca dispositivos conectados
                const { data: devicesData, error: devicesError } = await supabase
                    .from('connected_devices')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('last_access', { ascending: false });
                
                if (devicesError) throw devicesError;
                setConnectedDevices(devicesData.map(d => ({
                    id: d.id,
                    type: d.type || 'N/A',
                    browser: d.browser || 'N/A',
                    os: d.os || 'N/A',
                    lastAccess: d.last_access,
                    location: d.location || 'N/A',
                    isCurrent: d.is_current || false,
                })));

                // Simula status 2FA (em um cenário real, buscaria do perfil do usuário)
                setIs2faEnabled(true); 
                
                setLoading(false);

            } catch (err: any) {
                console.error("Erro ao carregar medidas de segurança:", err);
                setErrorMessage("Não foi possível carregar as configurações de segurança.");
                setLoading(false);
            }
        };

        fetchData();
    }, [supabase]);

    const handleToggle2FA = async () => {
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);
        try {
            // Lógica real para ativar/desativar 2FA no Supabase
            // Isso geralmente envolve chamar uma função de backend ou API do Supabase Auth
            await new Promise(resolve => setTimeout(resolve, 800)); // Simula API call
            setIs2faEnabled(prev => !prev);
            setSuccessMessage(`Autenticação de Dois Fatores foi ${is2faEnabled ? 'desativada' : 'ativada'} com sucesso!`);
        } catch (err) {
            setErrorMessage("Erro ao alterar o status do 2FA.");
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e: FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);

        if (newPassword !== confirmNewPassword) {
            setErrorMessage('A nova senha e a confirmação não coincidem.');
            setLoading(false);
            return;
        }
        if (newPassword.length < 8) {
            setErrorMessage('A nova senha deve ter no mínimo 8 caracteres.');
            setLoading(false);
            return;
        }

        try {
            // Lógica real para alterar a senha no Supabase
            const { data, error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;

            setSuccessMessage('Senha alterada com sucesso!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        } catch (err: any) {
            setErrorMessage('Erro ao alterar a senha: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEndSession = async (deviceId: string) => {
        setSuccessMessage(null);
        setErrorMessage(null);
        if (window.confirm('Tem certeza que deseja encerrar esta sessão?')) {
            setLoading(true);
            try {
                // Lógica real para encerrar a sessão no Supabase
                // Isso geralmente envolve chamar uma API para invalidar a sessão
                await new Promise(resolve => setTimeout(resolve, 800)); // Simula API call
                setConnectedDevices(prev => prev.filter(device => device.id !== deviceId));
                setSuccessMessage('Sessão encerrada com sucesso!');
            } catch (err) {
                setErrorMessage('Erro ao encerrar a sessão.');
            } finally {
                setLoading(false);
            }
        }
    };

    if (loading) {
        return <div className={styles.loadingState}>Carregando configurações de segurança...</div>;
    }

    if (errorMessage) {
        return <div className={styles.errorState}>Erro: {errorMessage}</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Medidas de Segurança</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            
            {/* Seção de Autenticação de Dois Fatores */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Autenticação de Dois Fatores (2FA)</h2>
                <div className={styles.toggleGroup}>
                    <p>Status: <span className={is2faEnabled ? styles.statusEnabled : styles.statusDisabled}>{is2faEnabled ? 'Ativado' : 'Desativado'}</span></p>
                    <button 
                        onClick={handleToggle2FA} 
                        className={is2faEnabled ? styles.dangerButton : styles.primaryButton}
                        disabled={loading}
                    >
                        {is2faEnabled ? 'Desativar 2FA' : 'Ativar 2FA'}
                    </button>
                </div>
                <p className={styles.sectionDescription}>O 2FA adiciona uma camada extra de segurança, exigindo um código do seu celular além da senha.</p>
                {is2faEnabled && (
                    <div className={styles.recoveryCodes}>
                        <p><strong>Códigos de Recuperação:</strong></p>
                        <p className={styles.recoveryCodeText}>Guarde estes códigos em um local seguro. Eles permitem que você acesse sua conta caso perca seu dispositivo 2FA.</p>
                        <button className={styles.secondaryButton}>Gerar Novos Códigos de Recuperação</button>
                    </div>
                )}
            </section>

            {/* Seção Alterar Senha */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Alterar Senha</h2>
                <form onSubmit={handleChangePassword} className={styles.passwordForm}>
                    <div className={styles.formGroup}>
                        <label htmlFor="currentPassword">Senha Atual:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className={styles.inputField}
                            required
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="newPassword">Nova Senha:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={styles.inputField}
                            required
                        />
                        <p className={styles.passwordRequirements}>Mínimo de 8 caracteres, incluindo letras, números e símbolos.</p>
                    </div>
                    <div className={styles.formGroup}>
                        <label htmlFor="confirmNewPassword">Confirmar Nova Senha:</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            className={styles.inputField}
                            required
                        />
                    </div>
                    <button type="submit" className={styles.primaryButton} disabled={loading}>Alterar Senha</button>
                </form>
            </section>

            {/* Seção Histórico de Atividade */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Histórico de Atividade</h2>
                {loginActivities.length > 0 ? (
                    <div className={styles.tableContainer}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Data e Hora</th>
                                    <th>Dispositivo/Navegador</th>
                                    <th>Localização Estimada</th>
                                    <th>Endereço IP</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loginActivities.map(activity => (
                                    <tr key={activity.id}>
                                        <td data-label="Data e Hora">{new Date(activity.timestamp).toLocaleString('pt-BR')}</td>
                                        <td data-label="Dispositivo/Navegador">{activity.device}</td>
                                        <td data-label="Localização Estimada">{activity.location}</td>
                                        <td data-label="Endereço IP">{activity.ipAddress}</td>
                                        <td data-label="Status">
                                            <span className={`${styles.statusBadge} ${styles[activity.status]}`}>
                                                {activity.status === 'success' ? 'Sucesso' : 'Falha'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className={styles.noData}>Nenhuma atividade de login recente.</p>
                )}
                <div className={styles.buttonGroup}>
                    <button className={styles.secondaryButton}>Ver Histórico Completo</button>
                </div>
            </section>

            {/* Seção Dispositivos Conectados */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Dispositivos Conectados</h2>
                {connectedDevices.length > 0 ? (
                    <div className={styles.tableContainer}>
                        <table className={styles.dataTable}>
                            <thead>
                                <tr>
                                    <th>Dispositivo</th>
                                    <th>Último Acesso</th>
                                    <th>Localização</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {connectedDevices.map(device => (
                                    <tr key={device.id}>
                                        <td data-label="Dispositivo">{device.type} ({device.os} - {device.browser}) {device.isCurrent && '(Atual)'}</td>
                                        <td data-label="Último Acesso">{new Date(device.lastAccess).toLocaleString('pt-BR')}</td>
                                        <td data-label="Localização">{device.location}</td>
                                        <td data-label="Ações">
                                            {!device.isCurrent && (
                                                <button 
                                                    onClick={() => handleEndSession(device.id)} 
                                                    className={styles.actionButton}
                                                    disabled={loading}
                                                >
                                                    Desconectar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className={styles.noData}>Nenhum dispositivo conectado no momento.</p>
                )}
                <div className={styles.buttonGroup}>
                    <button className={styles.dangerButton} onClick={() => alert('Funcionalidade de desconectar todos os dispositivos em desenvolvimento.')}>Desconectar Todos</button>
                </div>
            </section>
        </div>
    );
};

export default MedidasSegurancaPage;