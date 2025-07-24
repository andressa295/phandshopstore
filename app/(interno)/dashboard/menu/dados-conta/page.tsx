"use client";

import React, { useState, FormEvent } from 'react';
import styles from './DadosMinhaContaPage.module.css'; // Vamos criar este CSS Module

const DadosMinhaContaPage: React.FC = () => {
    const [exportFormat, setExportFormat] = useState<string>('json'); // Estado para formato de exportação
    const [marketingOptIn, setMarketingOptIn] = useState<boolean>(true); // Estado para opt-in de marketing

    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    // Função para solicitar exportação de dados
    const handleRequestDataExport = async (e: FormEvent) => {
        e.preventDefault();
        setSuccessMessage(null);
        setErrorMessage(null);
        setLoading(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simula API call
            setSuccessMessage(`Sua solicitação de exportação de dados no formato ${exportFormat.toUpperCase()} foi enviada! Você receberá um e-mail com os detalhes.`);
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

        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simula API call
            setSuccessMessage('Suas preferências de comunicação foram atualizadas com sucesso!');
        } catch (err) {
            console.error("Erro ao atualizar preferências:", err);
            setErrorMessage('Não foi possível salvar suas preferências de comunicação. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Função para solicitar exclusão da conta
    const handleDeleteAccount = async () => {
        setSuccessMessage(null);
        setErrorMessage(null);
        if (window.confirm('ATENÇÃO: A exclusão da sua conta é uma ação IRREVERSÍVEL e resultará na perda de todos os seus dados e informações. Tem certeza que deseja continuar?')) {
            setLoading(true);
            try {
                await new Promise(resolve => setTimeout(resolve, 3000)); // Simula API call longa
                // Em um cenário real, você seria redirecionado(a) para uma página de confirmação final
                alert('Sua solicitação de exclusão de conta foi processada. Sua conta será desativada e excluída permanentemente em breve.');
                // Redirecionar para a página inicial ou de login após a exclusão simulada
                window.location.href = '/'; 
            } catch (err) {
                console.error("Erro ao excluir conta:", err);
                setErrorMessage('Não foi possível excluir sua conta. Por favor, entre em contato com o suporte.');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.mainTitle}>Dados da Minha Conta</h1>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

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
                    Solicite uma cópia de todos os seus dados armazenados em nossa plataforma. O arquivo será gerado e enviado para o seu e-mail cadastrado.
                </p>
                <form onSubmit={handleRequestDataExport} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="exportFormat">Formato do Arquivo:</label>
                        <select
                            id="exportFormat"
                            value={exportFormat}
                            onChange={(e) => setExportFormat(e.target.value)}
                            className={styles.selectField}
                        >
                            <option value="json">JSON (para desenvolvedores)</option>
                            <option value="csv">CSV (para planilhas)</option>
                            <option value="pdf">PDF (para visualização)</option>
                        </select>
                    </div>
                    <button type="submit" className={styles.primaryButton} disabled={loading}>
                        {loading ? 'Solicitando...' : 'Solicitar Exportação de Dados'}
                    </button>
                    <p className={styles.noteText}>*A exportação pode levar alguns minutos. Verifique sua caixa de entrada e spam.</p>
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
                            />
                            Desejo receber e-mails sobre promoções, novidades e dicas de uso.
                        </label>
                    </div>
                    <button type="submit" className={styles.primaryButton} disabled={loading}>
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
                    <button onClick={handleDeleteAccount} className={styles.dangerButton} disabled={loading}>
                        {loading ? 'Excluindo...' : 'Excluir Minha Conta'}
                    </button>
                </div>
            </section>
        </div>
    );
};

export default DadosMinhaContaPage;