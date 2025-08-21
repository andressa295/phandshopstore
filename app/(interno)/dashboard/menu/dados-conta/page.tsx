'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '@/app/(interno)/dashboard/UserContext'; // Ajuste o caminho conforme sua estrutura
import styles from './DadosMinhaContaPage.module.css';

// Componente de Modal de Confirmação (reutilizável)
interface ConfirmationModalProps {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
    isLoading: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ message, onConfirm, onCancel, isLoading }) => (
    <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
            <p>{message}</p>
            <div className={styles.modalActions}>
                <button onClick={onCancel} className={styles.modalCancelButton} disabled={isLoading}>
                    Cancelar
                </button>
                <button onClick={onConfirm} className={styles.modalConfirmButton} disabled={isLoading}>
                    {isLoading ? 'Confirmando...' : 'Confirmar'}
                </button>
            </div>
        </div>
    </div>
);

const DadosMinhaContaPage: React.FC = () => {
    const supabase = createClientComponentClient();
    const { user, profile, loading: userLoading } = useUser(); // Usa o hook useUser para obter os dados do usuário e perfil

    const [exportFormat, setExportFormat] = useState<string>('json');
    const [marketingOptIn, setMarketingOptIn] = useState<boolean>(true); // Estado inicial
    
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<boolean>(false);

    useEffect(() => {
        // Carrega as preferências de marketing quando o perfil do usuário estiver disponível
        const loadMarketingPreferences = async () => {
            if (profile && profile.lojaId) {
                setLoading(true);
                const { data, error } = await supabase
                    .from('notification_preferences')
                    .select('email_enabled')
                    .eq('loja_id', profile.lojaId)
                    .eq('notification_type', 'marketing_email') // Tipo específico para marketing
                    .single();

                if (error && error.code !== 'PGRST116') { // PGRST116 = No rows found (isso é normal se não houver preferência ainda)
                    console.error("Erro ao carregar preferências de marketing:", error);
                    setErrorMessage('Erro ao carregar suas preferências de comunicação.');
                } else if (data) {
                    setMarketingOptIn(data.email_enabled);
                }
                setLoading(false);
            }
        };
        if (!userLoading) {
            loadMarketingPreferences();
        }
    }, [profile, userLoading, supabase]);

    // Função para solicitar exportação de dados
    const handleRequestDataExport = async (e: FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);

        if (!user || !profile) {
            setErrorMessage('Usuário não autenticado ou perfil não carregado.');
            setLoading(false);
            return;
        }

        try {
            // Exemplo simples: exportar dados da tabela 'usuarios' e 'lojas'
            const { data: userData, error: userError } = await supabase
                .from('usuarios')
                .select('*')
                .eq('id', user.id)
                .single();

            // CORREÇÃO: Usando 'owner_id' para buscar a loja
            const { data: lojaData, error: lojaError } = await supabase
                .from('lojas')
                .select('*')
                .eq('owner_id', user.id) // ✅ CORRIGIDO AQUI!
                .single();

            if (userError && userError.code !== 'PGRST116') {
                throw userError;
            }
            if (lojaError && lojaError.code !== 'PGRST116') {
                throw lojaError;
            }

            const exportData = {
                user_profile: userData || 'Nenhum perfil encontrado.',
                loja_data: lojaData || 'Nenhuma loja encontrada.',
                // Adicione outros dados conforme necessário, de outras tabelas se o RLS permitir
            };

            const filename = `meus_dados.${exportFormat}`;
            let fileContent: string;
            let mimeType: string;

            if (exportFormat === 'json') {
                fileContent = JSON.stringify(exportData, null, 2);
                mimeType = 'application/json';
            } else if (exportFormat === 'csv') {
                // Implementação simplificada de CSV. Para dados complexos, usar uma lib ou backend.
                const headers = ['Campo', 'Valor'];
                const rows = Object.entries(exportData).flatMap(([key, value]) => {
                    if (typeof value === 'object' && value !== null) {
                        return Object.entries(value).map(([subKey, subValue]) => [`${key}.${subKey}`, String(subValue)]);
                    }
                    return [[key, String(value)]];
                });
                fileContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
                mimeType = 'text/csv';
            } else { // PDF (simulado, pois requer biblioteca ou backend)
                setErrorMessage('Formato PDF não suportado para exportação direta pelo navegador. Tente JSON ou CSV.');
                setLoading(false);
                return;
            }

            const blob = new Blob([fileContent], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            setSuccessMessage(`Seus dados foram exportados no formato ${exportFormat.toUpperCase()}.`);

        } catch (err) {
            console.error("Erro ao solicitar exportação:", err);
            setErrorMessage('Não foi possível processar sua solicitação de exportação de dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Função para gerenciar preferências de marketing
    const handleUpdateMarketingPreferences = async (e: FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);

        if (!profile || !profile.lojaId) {
            setErrorMessage('Dados da loja não disponíveis para atualizar preferências.');
            setLoading(false);
            return;
        }

        try {
            // Primeiro, tenta buscar a preferência existente
            const { data: existingPreference, error: fetchError } = await supabase
                .from('notification_preferences')
                .select('id')
                .eq('loja_id', profile.lojaId)
                .eq('notification_type', 'marketing_email')
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = No rows found
                throw fetchError;
            }

            if (existingPreference) {
                // Se existir, atualiza
                const { error: updateError } = await supabase
                    .from('notification_preferences')
                    .update({ email_enabled: marketingOptIn })
                    .eq('id', existingPreference.id);
                if (updateError) throw updateError;
            } else {
                // Se não existir, insere
                const { error: insertError } = await supabase
                    .from('notification_preferences')
                    .insert({ 
                        loja_id: profile.lojaId,
                        notification_type: 'marketing_email',
                        email_enabled: marketingOptIn,
                        in_app_enabled: true, // Ou defina um valor padrão
                        sms_enabled: false // Ou defina um valor padrão
                    });
                if (insertError) throw insertError;
            }
            
            setSuccessMessage('Suas preferências de comunicação foram atualizadas com sucesso!');
        } catch (err) {
            console.error("Erro ao atualizar preferências:", err);
            setErrorMessage('Não foi possível salvar suas preferências de comunicação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Função para iniciar a exclusão da conta (mostra o modal)
    const handleInitiateDeleteAccount = () => {
        setSuccessMessage(null);
        setErrorMessage(null);
        setShowDeleteConfirmation(true);
    };

    // Função para confirmar a exclusão da conta
    const handleDeleteAccountConfirmed = async () => {
        setLoading(true);
        try {
            // Em um cenário real, você faria uma chamada para uma função de backend segura
            // (ex: Supabase Edge Function, Next.js API Route) para deletar o usuário
            // e todos os seus dados relacionados do banco de dados (loja, assinaturas, etc.).
            // Supabase client-side Auth só permite sign out, não delete.
            
            // Simulação de exclusão: apenas faz logout do usuário
            const { error: signOutError } = await supabase.auth.signOut();

            if (signOutError) {
                throw signOutError;
            }

            setSuccessMessage('Sua conta foi desativada e você será redirecionado. Para exclusão permanente, verifique seu e-mail ou entre em contato com o suporte.');
            // Redirecionar para a página inicial ou de login após o logout
            setTimeout(() => {
                window.location.href = '/'; 
            }, 2000); // Dá um tempo para o usuário ler a mensagem
            
        } catch (err) {
            console.error("Erro ao excluir conta:", err);
            setErrorMessage('Não foi possível processar sua solicitação de exclusão. Por favor, entre em contato com o suporte.');
        } finally {
            setLoading(false);
            setShowDeleteConfirmation(false); // Esconde o modal
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteConfirmation(false);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Dados da Minha Conta</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

            {userLoading ? (
                <div className={styles.loadingMessage}>Carregando dados do usuário...</div>
            ) : (
                <>
                    {/* Seção Visão Geral da Privacidade */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Sua Privacidade é Importante</h2>
                        <p className={styles.sectionDescription}>
                            Valorizamos a sua privacidade e estamos comprometidos em proteger os seus dados pessoais. Aqui você pode gerenciar suas informações e entender como elas são utilizadas.
                        </p>
                        <p className={styles.sectionDescription}>
                            Para mais detalhes, consulte nossa <a href="/politica-privacidade" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>Política de Privacidade</a> e nossos <a href="/termos-de-uso" target="_blank" rel="noopener noreferrer" className={styles.actionLink}>Termos de Uso</a>.
                        </p>
                    </section>

                    {/* Seção Exportar Meus Dados */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Exportar Meus Dados</h2>
                        <p className={styles.sectionDescription}>
                            Solicite uma cópia de todos os seus dados armazenados em nossa plataforma. O arquivo será gerado e enviado para o seu navegador.
                        </p>
                        <form onSubmit={handleRequestDataExport} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label htmlFor="exportFormat">Formato do Arquivo:</label>
                                <select
                                    id="exportFormat"
                                    value={exportFormat}
                                    onChange={(e) => setExportFormat(e.target.value)}
                                    className={styles.selectField}
                                    disabled={loading}
                                >
                                    <option value="json">JSON (para desenvolvedores)</option>
                                    <option value="csv">CSV (para planilhas)</option>
                                    <option value="pdf">PDF (requer um serviço de backend)</option>
                                </select>
                            </div>
                            <button type="submit" className={styles.primaryButton} disabled={loading || !user || !profile}>
                                {loading ? 'Solicitando...' : 'Solicitar Exportação de Dados'}
                            </button>
                            <p className={styles.noteText}>*A exportação pode levar alguns segundos dependendo da quantidade de dados.</p>
                        </form>
                    </section>

                    {/* Seção Preferências de Marketing/Comunicação */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>Preferências de Comunicação</h2>
                        <p className={styles.sectionDescription}>
                            Controle quais tipos de comunicação de marketing você deseja receber de nós.
                        </p>
                        <form onSubmit={handleUpdateMarketingPreferences} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label className={styles.checkboxLabel}>
                                    <input
                                        type="checkbox"
                                        checked={marketingOptIn}
                                        onChange={(e) => setMarketingOptIn(e.target.checked)}
                                        disabled={loading || !user || !profile?.lojaId}
                                    />
                                    Desejo receber e-mails sobre promoções, novidades e dicas de uso.
                                </label>
                            </div>
                            <button type="submit" className={styles.primaryButton} disabled={loading || !user || !profile?.lojaId}>
                                {loading ? 'Salvando...' : 'Salvar Preferências'}
                            </button>
                        </form>
                    </section>

                    {/* Seção Excluir Minha Conta */}
                    <section className={`${styles.section} ${styles.dangerZone}`}>
                        <h2 className={styles.sectionTitle}>Excluir Minha Conta</h2>
                        <p className={`${styles.sectionDescription} ${styles.dangerText}`}>
                            **Cuidado!** Excluir sua conta é uma ação **permanente e irreversível**. Todos os seus dados, configurações e histórico serão removidos de nossa plataforma. Esta ação não pode ser desfeita.
                        </p>
                        <div className={styles.buttonGroup}>
                            <button onClick={handleInitiateDeleteAccount} className={styles.dangerButton} disabled={loading || !user}>
                                {loading ? 'Excluindo...' : 'Excluir Minha Conta'}
                            </button>
                        </div>
                    </section>
                </>
            )}

            {showDeleteConfirmation && (
                <ConfirmationModal
                    message="ATENÇÃO: A exclusão da sua conta é uma ação IRREVERSÍVEL e resultará na perda de todos os seus dados e informações. Tem certeza que deseja continuar? Para a exclusão completa de todos os seus dados do banco de dados, é necessário um processo de backend. Esta ação irá apenas desativar sua sessão."
                    onConfirm={handleDeleteAccountConfirmed}
                    onCancel={handleCancelDelete}
                    isLoading={loading}
                />
            )}
        </div>
    );
};

export default DadosMinhaContaPage;
