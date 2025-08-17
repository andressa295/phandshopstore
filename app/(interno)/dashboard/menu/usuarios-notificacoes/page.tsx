"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './UsuariosNotificacoesPage.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '../../UserContext'; // Para pegar o ID da loja

// 1. Interfaces para os dados (ajustadas para o Supabase)
interface UserAccount {
    id: string;
    user_id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'pending' | 'suspended';
}

interface NotificationSetting {
    id: string;
    notification_type: string;
    description: string;
    email_enabled: boolean;
    in_app_enabled: boolean;
    sms_enabled: boolean;
}

const UsuariosNotificacoesPage: React.FC = () => {
    const supabase = createClientComponentClient();
    const { profile, loading: userProfileLoading } = useUser();
    
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);

    const [newUserEmail, setNewUserEmail] = useState<string>('');
    const [newUserRole, setNewUserRole] = useState<'editor' | 'viewer'>('editor');

    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const notificationTypesMap = {
        'new_sale': 'Novas Vendas',
        'payment_approved': 'Pagamento Aprovado',
        'new_client_message': 'Novas Mensagens de Clientes',
        'platform_updates': 'Atualizações da Plataforma',
        'security_alerts': 'Alertas de Segurança',
    };

    useEffect(() => {
        const fetchData = async () => {
            if (!profile?.lojaId) {
                setErrorMessage("ID da loja não encontrado. Recarregue a página ou faça login novamente.");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const { data: usersData, error: usersError } = await supabase
                    .from('user_accounts')
                    .select('*')
                    .eq('loja_id', profile.lojaId);
                
                if (usersError) throw usersError;
                setUsers(usersData as UserAccount[]);

                const { data: settingsData, error: settingsError } = await supabase
                    .from('notification_preferences')
                    .select('*')
                    .eq('loja_id', profile.lojaId);
                
                if (settingsError) throw settingsError;
                setNotificationSettings(settingsData.map(s => ({
                    id: s.id,
                    notification_type: s.notification_type,
                    description: notificationTypesMap[s.notification_type as keyof typeof notificationTypesMap] || s.notification_type,
                    email_enabled: s.email_enabled,
                    in_app_enabled: s.in_app_enabled,
                    sms_enabled: s.sms_enabled,
                })) as NotificationSetting[]);
                
                setLoading(false);

            } catch (err: any) {
                console.error("Erro ao carregar dados:", err);
                setErrorMessage("Não foi possível carregar as informações de usuários e notificações.");
                setLoading(false);
            }
        };

        if (!userProfileLoading && profile?.lojaId) {
            fetchData();
        }
    }, [profile, userProfileLoading]);

    const handleInviteUser = async (e: FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);

        if (!newUserEmail || !newUserEmail.includes('@')) {
            setErrorMessage('Por favor, insira um e-mail válido.');
            setLoading(false);
            return;
        }
        if (!profile?.lojaId) {
            setErrorMessage("ID da loja não encontrado para convidar usuário.");
            setLoading(false);
            return;
        }

        try {
            const { data: inviteData, error: inviteError } = await supabase.auth.admin.inviteUserByEmail(newUserEmail, {
                data: { role: newUserRole, loja_id: profile.lojaId },
            });

            if (inviteError) throw inviteError;

            const { error: dbError } = await supabase
                .from('user_accounts')
                .insert({
                    user_id: inviteData.user.id,
                    loja_id: profile.lojaId,
                    email: newUserEmail,
                    nome_completo: newUserEmail.split('@')[0],
                    role: newUserRole,
                    status: 'pending',
                });
            
            if (dbError) throw dbError;

            setUsers(prev => [...prev, {
                id: inviteData.user.id,
                user_id: inviteData.user.id,
                name: newUserEmail.split('@')[0],
                email: newUserEmail,
                role: newUserRole,
                status: 'pending',
            }]);
            setNewUserEmail('');
            setSuccessMessage(`Convite enviado para ${newUserEmail} com sucesso!`);
        } catch (err: any) {
            console.error("Erro ao enviar convite:", err);
            setErrorMessage('Erro ao enviar convite: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUser = async (userId: string, userName: string) => {
        setSuccessMessage(null);
        setErrorMessage(null);
        if (window.confirm(`Tem certeza que deseja remover o usuário ${userName}? Esta ação é irreversível.`)) {
            setLoading(true);
            try {
                const { error: dbError } = await supabase
                    .from('user_accounts')
                    .delete()
                    .eq('user_id', userId);
                if (dbError) throw dbError;

                setUsers(prev => prev.filter(user => user.user_id !== userId));
                setSuccessMessage(`Usuário ${userName} removido com sucesso.`);
            } catch (err: any) {
                setErrorMessage('Erro ao remover usuário: ' + err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleNotificationChange = (id: string, channel: 'email_enabled' | 'in_app_enabled' | 'sms_enabled', value: boolean) => {
        setNotificationSettings(prev =>
            prev.map(setting =>
                setting.id === id ? { ...setting, [channel]: value } : setting
            )
        );
    };

    const handleSaveChangesNotification = async () => {
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);
        if (!profile?.lojaId) {
            setErrorMessage("ID da loja não encontrado para salvar notificações.");
            setLoading(false);
            return;
        }
        try {
            const updates = notificationSettings.map(setting => ({
                id: setting.id,
                email_enabled: setting.email_enabled,
                in_app_enabled: setting.in_app_enabled,
                sms_enabled: setting.sms_enabled,
            }));
            
            const { error: dbError } = await supabase
                .from('notification_preferences')
                .upsert(updates, { onConflict: 'id' });

            if (dbError) throw dbError;

            setSuccessMessage('Preferências de notificação salvas com sucesso!');
        } catch (err: any) {
            setErrorMessage('Erro ao salvar preferências de notificação: ' + err.message);
        } finally {
            setLoading(false);
        }
    };


    if (userProfileLoading || loading) {
        return <div className={styles.loadingState}>Carregando configurações...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Usuários e Notificações</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Gerenciamento de Usuários</h2>
                <p className={styles.sectionDescription}>
                    Gerencie quem tem acesso à sua conta e quais permissões cada um possui.
                    <br/>
                    <span className={styles.noteText}>*Funcionalidade disponível a partir do Plano Essencial.</span>
                </p>
                {profile?.plano !== 'Plano Grátis' ? (
                    <>
                        <div className={styles.tableContainer}>
                            <table className={styles.dataTable}>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>E-mail</th>
                                        <th>Permissão</th>
                                        <th>Status</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(user => (
                                        <tr key={user.id}>
                                            <td data-label="Nome">{user.name}</td>
                                            <td data-label="E-mail">{user.email}</td>
                                            <td data-label="Permissão" className={styles.roleText}>{user.role}</td>
                                            <td data-label="Status">
                                                <span className={`${styles.statusBadge} ${styles[user.status]}`}>
                                                    {user.status}
                                                </span>
                                            </td>
                                            <td data-label="Ações" className={styles.actionsCell}>
                                                <button className={styles.actionButton}>Editar</button>
                                                {user.role !== 'admin' && (
                                                    <button 
                                                        onClick={() => handleRemoveUser(user.user_id, user.name)} 
                                                        className={styles.actionButtonAlt}
                                                        disabled={loading}
                                                    >
                                                        Remover
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <h3 className={styles.subSectionTitle}>Convidar Novo Usuário</h3>
                        <form onSubmit={handleInviteUser} className={styles.inviteForm}>
                            <div className={styles.formGroup}>
                                <label htmlFor="newUserEmail">E-mail do novo usuário:</label>
                                <input
                                    type="email"
                                    id="newUserEmail"
                                    value={newUserEmail}
                                    onChange={(e) => setNewUserEmail(e.target.value)}
                                    className={styles.inputField}
                                    placeholder="exemplo@dominio.com"
                                    required
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="newUserRole">Nível de Acesso:</label>
                                <select
                                    id="newUserRole"
                                    value={newUserRole}
                                    onChange={(e) => setNewUserRole(e.target.value as 'editor' | 'viewer')}
                                    className={styles.selectField}
                                >
                                    <option value="editor">Editor (Gerenciar Vendas, Produtos)</option>
                                    <option value="viewer">Visualizador (Apenas relatórios)</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.primaryButton} disabled={loading}>Enviar Convite</button>
                        </form>
                    </>
                ) : (
                    <p className={styles.noData}>Faça upgrade para um plano superior para adicionar e gerenciar outros usuários.</p>
                )}
            </section>

            {/* Seção Configurações de Notificações */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Configurações de Notificações</h2>
                <p className={styles.sectionDescription}>
                    Personalize como você recebe as notificações importantes da plataforma.
                </p>
                <div className={styles.notificationSettingsGrid}>
                    {notificationSettings.map(setting => (
                        <div key={setting.id} className={styles.notificationItem}>
                            <h3>{setting.notification_type}</h3>
                            <p className={styles.notificationDescription}>{setting.description}</p>
                            <div className={styles.notificationChannels}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={setting.email_enabled}
                                        onChange={(e) => handleNotificationChange(setting.id, 'email_enabled', e.target.checked)}
                                    /> E-mail
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={setting.in_app_enabled}
                                        onChange={(e) => handleNotificationChange(setting.id, 'in_app_enabled', e.target.checked)}
                                    /> Na Plataforma
                                </label>
                                {setting.sms_enabled && (
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={setting.sms_enabled}
                                            onChange={(e) => handleNotificationChange(setting.id, 'sms_enabled', e.target.checked)}
                                        /> SMS
                                    </label>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className={styles.buttonGroup}>
                    <button onClick={handleSaveChangesNotification} className={styles.primaryButton} disabled={loading}>Salvar Preferências</button>
                </div>
            </section>
        </div>
    );
};

export default UsuariosNotificacoesPage;