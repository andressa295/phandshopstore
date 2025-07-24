"use client";

import React, { useState, useEffect, FormEvent } from 'react';
import styles from './UsuariosNotificacoesPage.module.css'; // Vamos criar este CSS Module

// 1. Interfaces para os dados
interface UserAccount {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer'; // Nível de acesso
    status: 'active' | 'pending' | 'suspended';
}

interface NotificationSetting {
    id: string;
    name: string;
    description: string;
    emailEnabled: boolean;
    inAppEnabled: boolean; // Notificação dentro da plataforma/app
    smsEnabled: boolean; // Se aplicável
}

const UsuariosNotificacoesPage: React.FC = () => {
    // 2. Estados para gerenciar usuários e notificações
    const [users, setUsers] = useState<UserAccount[]>([]);
    const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);

    const [newUserEmail, setNewUserEmail] = useState<string>('');
    const [newUserRole, setNewUserRole] = useState<'editor' | 'viewer'>('editor'); // Padrão para novo usuário

    const [loading, setLoading] = useState<boolean>(true);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // 3. Efeito para carregar os dados
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API call

                const mockUsers: UserAccount[] = [
                    { id: 'u1', name: 'Usuário Principal', email: 'principal@email.com', role: 'admin', status: 'active' },
                    { id: 'u2', name: 'Colaborador Vendas', email: 'vendas@email.com', role: 'editor', status: 'active' },
                    { id: 'u3', name: 'Analista Marketing', email: 'marketing@email.com', role: 'viewer', status: 'pending' },
                ];

                const mockNotificationSettings: NotificationSetting[] = [
                    { id: 'n1', name: 'Novas Vendas', description: 'Receber alerta quando uma nova venda é realizada.', emailEnabled: true, inAppEnabled: true, smsEnabled: false },
                    { id: 'n2', name: 'Pagamento Aprovado', description: 'Notificação sobre pagamentos aprovados.', emailEnabled: true, inAppEnabled: true, smsEnabled: false },
                    { id: 'n3', name: 'Novas Mensagens de Clientes', description: 'Receber avisos sobre novas mensagens na central de atendimento.', emailEnabled: true, inAppEnabled: false, smsEnabled: false },
                    { id: 'n4', name: 'Atualizações da Plataforma', description: 'Informações sobre novos recursos e melhorias.', emailEnabled: true, inAppEnabled: true, smsEnabled: false },
                    { id: 'n5', name: 'Alertas de Segurança', description: 'Notificações importantes sobre a segurança da sua conta.', emailEnabled: true, inAppEnabled: true, smsEnabled: true },
                ];

                setUsers(mockUsers);
                setNotificationSettings(mockNotificationSettings);
                setLoading(false);

            } catch (err) {
                console.error("Erro ao carregar dados:", err);
                setErrorMessage("Não foi possível carregar as informações de usuários e notificações.");
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Funções de Manipulação de Usuários
    const handleInviteUser = async (e: FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);

        // Validação básica
        if (!newUserEmail || !newUserEmail.includes('@')) {
            setErrorMessage('Por favor, insira um e-mail válido.');
            setLoading(false);
            return;
        }

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            const newId = `u${users.length + 1}`;
            const newUser: UserAccount = {
                id: newId,
                name: newUserEmail.split('@')[0], // Nome simples baseado no e-mail
                email: newUserEmail,
                role: newUserRole,
                status: 'pending', // Convite pendente até o aceite
            };
            setUsers(prev => [...prev, newUser]);
            setNewUserEmail('');
            setSuccessMessage(`Convite enviado para ${newUser.name} (${newUser.email}) com sucesso!`);
        } catch (err) {
            setErrorMessage('Erro ao enviar convite. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveUser = async (userId: string, userName: string) => {
        setSuccessMessage(null);
        setErrorMessage(null);
        if (window.confirm(`Tem certeza que deseja remover o usuário ${userName}?`)) {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 800));
                setUsers(prev => prev.filter(user => user.id !== userId));
                setSuccessMessage(`Usuário ${userName} removido com sucesso.`);
            } catch (err) {
                setErrorMessage('Erro ao remover usuário.');
            } finally {
                setLoading(false);
            }
        }
    };

    // Funções de Manipulação de Notificações
    const handleNotificationChange = (id: string, channel: 'emailEnabled' | 'inAppEnabled' | 'smsEnabled', value: boolean) => {
        setNotificationSettings(prev =>
            prev.map(setting =>
                setting.id === id ? { ...setting, [channel]: value } : setting
            )
        );
        // Em uma aplicação real, você enviaria esta mudança para a API
        // setSuccessMessage('Preferência de notificação atualizada!');
    };

    const handleSaveChangesNotification = async () => {
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            // Enviar `notificationSettings` atualizado para a API
            setSuccessMessage('Preferências de notificação salvas com sucesso!');
        } catch (err) {
            setErrorMessage('Erro ao salvar preferências de notificação.');
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className={styles.loadingState}>Carregando configurações...</div>;
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Usuários e Notificações</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            {/* Seção Gerenciamento de Usuários */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Gerenciamento de Usuários</h2>
                <p className={styles.sectionDescription}>
                    Gerencie quem tem acesso à sua conta e quais permissões cada um possui.
                    <br/>
                    <span className={styles.noteText}>*Funcionalidade disponível a partir do Plano Essencial.</span> {/* Exemplo de nota para planos */}
                </p>
                {/* Simulação de visibilidade baseada no plano - adaptar para sua lógica real */}
                {/* Se fosse um plano pago, você mostraria a lista e o formulário */}
                {users.length > 0 ? ( // Simula que se já tem usuários, a funcionalidade está ativa ou é admin
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
                                                <span className={`${styles.statusBadge} ${styles[user.status]}`}>{user.status}</span>
                                            </td>
                                            <td data-label="Ações" className={styles.actionsCell}>
                                                <button className={styles.actionButton}>Editar</button>
                                                {user.role !== 'admin' && ( // Não permite remover o admin principal
                                                    <button 
                                                        onClick={() => handleRemoveUser(user.id, user.name)} 
                                                        className={styles.actionButtonAlt}
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
                            <h3>{setting.name}</h3>
                            <p className={styles.notificationDescription}>{setting.description}</p>
                            <div className={styles.notificationChannels}>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={setting.emailEnabled}
                                        onChange={(e) => handleNotificationChange(setting.id, 'emailEnabled', e.target.checked)}
                                    /> E-mail
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={setting.inAppEnabled}
                                        onChange={(e) => handleNotificationChange(setting.id, 'inAppEnabled', e.target.checked)}
                                    /> Na Plataforma
                                </label>
                                {setting.smsEnabled && ( // Somente mostra se a notificação suporta SMS
                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={setting.smsEnabled}
                                            onChange={(e) => handleNotificationChange(setting.id, 'smsEnabled', e.target.checked)}
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