// app/(interno)/dashboard/menu/gerenciar-tema/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '../../UserContext'; // Ajuste o caminho conforme sua estrutura
import styles from './ThemeManagementPage.module.css'; // Importa o CSS Module específico desta página

// Interfaces para os dados do tema e loja (simplificadas para este componente)
interface LojaData {
    id: string;
    nome_loja: string;
    slug: string;
    theme_id: string | null;
    configuracoes_tema_json: any;
}

interface TemaData {
    id: string;
    nome_tema: string;
    descricao: string | null;
    preview_url: string | null;
    is_free: boolean; // Adicionado is_free para consistência com a tabela temas
    caminho_componente: string;
}

const GerenciarTemaPage: React.FC = () => { // Renomeado para GerenciarTemaPage
    const supabase = createClientComponentClient();
    const { user, profile, loading: userLoading } = useUser();

    const [loja, setLoja] = useState<LojaData | null>(null);
    const [activeTheme, setActiveTheme] = useState<TemaData | null>(null);
    const [availableThemes, setAvailableThemes] = useState<TemaData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null); // CORREÇÃO: Adicionado o estado 'errorMessage'

    useEffect(() => {
        const fetchThemeData = async () => {
            if (!user || !profile?.lojaId) {
                setError("Usuário não autenticado ou loja não encontrada.");
                setLoading(false);
                return;
            }

            try {
                // 1. Buscar dados da loja do usuário
                const { data: lojaData, error: lojaError } = await supabase
                    .from('lojas')
                    .select(`id, nome_loja, slug, theme_id, configuracoes_tema_json`)
                    .eq('owner_id', user.id)
                    .single();

                if (lojaError || !lojaData) {
                    throw new Error(lojaError?.message || "Loja não encontrada para o usuário.");
                }
                setLoja(lojaData);

                // 2. Buscar todos os temas disponíveis
                const { data: themesData, error: themesError } = await supabase
                    .from('temas')
                    .select(`id, nome_tema, descricao, preview_url, is_free, caminho_componente`) // Incluído is_free
                    .order('nome_tema', { ascending: true });

                if (themesError || !themesData) {
                    throw new Error(themesError?.message || "Não foi possível carregar os temas disponíveis.");
                }
                setAvailableThemes(themesData);

                // 3. Identificar o tema ativo da loja
                if (lojaData.theme_id) {
                    const currentActiveTheme = themesData.find(t => t.id === lojaData.theme_id);
                    setActiveTheme(currentActiveTheme || null);
                } else {
                    // Se não tiver theme_id, tentar encontrar o "Tema Padrão"
                    const defaultTheme = themesData.find(t => t.nome_tema === 'Tema Padrão');
                    setActiveTheme(defaultTheme || null);
                }

            } catch (err: any) {
                console.error("Erro ao carregar dados do tema:", err.message);
                setError(`Erro ao carregar informações do tema: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };

        if (!userLoading && user) {
            fetchThemeData();
        }
    }, [user, profile, userLoading, supabase]);

    const handleApplyTheme = async (themeId: string) => {
        setLoading(true);
        setError(null);
        setSuccessMessage(null);
        setErrorMessage(null); // Limpa mensagens de erro anteriores

        if (!loja?.id) {
            setError("Loja não identificada para aplicar o tema.");
            setLoading(false);
            return;
        }

        try {
            const { error: updateError } = await supabase
                .from('lojas')
                .update({ theme_id: themeId })
                .eq('id', loja.id);

            if (updateError) {
                throw new Error(updateError.message);
            }

            // Atualiza o estado local para refletir o novo tema ativo
            const newActiveTheme = availableThemes.find(t => t.id === themeId);
            setActiveTheme(newActiveTheme || null);
            setSuccessMessage(`Tema '${newActiveTheme?.nome_tema}' aplicado com sucesso!`);

        } catch (err: any) {
            console.error("Erro ao aplicar tema:", err.message);
            setErrorMessage(`Erro ao aplicar o tema: ${err.message}`); // Usando setErrorMessage
        } finally {
            setLoading(false);
        }
    };

    if (userLoading || loading) {
        return <div className={styles.loadingState}>Carregando gerenciamento de temas...</div>;
    }

    if (error) {
        return <div className={styles.errorState}>Erro: {error}</div>;
    }

    if (!user || !profile?.lojaId) {
        return <div className={styles.unauthenticatedState}>Por favor, faça login para gerenciar seus temas.</div>;
    }

    return (
        <div className={styles.themeManagementContainer}>
            <h1 className={styles.mainTitle}>Gerenciar Temas da Loja</h1>
            <p className={styles.description}>
                Aqui você pode visualizar e aplicar temas à sua loja. Escolha um tema abaixo para ver como sua loja pode ficar!
            </p>

            {successMessage && <div className={styles.successMessage}>{successMessage}</div>}
            {error && <div className={styles.errorMessage}>{error}</div>} {/* Exibe o erro geral */}
            {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>} {/* Exibe o errorMessage específico da ação */}


            <section className={styles.currentThemeSection}>
                <h2 className={styles.sectionTitle}>Tema Atual: {activeTheme?.nome_tema || 'Nenhum Tema Selecionado'}</h2>
                {activeTheme?.preview_url && (
                    <div className={styles.currentThemePreview}>
                        <img src={activeTheme.preview_url} alt={`Preview do Tema ${activeTheme.nome_tema}`} />
                    </div>
                )}
                {activeTheme && <p className={styles.sectionDescription}>{activeTheme.descricao}</p>}
                {!activeTheme && <p className={styles.sectionDescription}>Sua loja ainda não tem um tema ativo. Selecione um abaixo.</p>}
            </section>

            <section className={styles.availableThemesSection}>
                <h2 className={styles.sectionTitle}>Temas Disponíveis</h2>
                <div className={styles.themesGrid}>
                    {availableThemes.map(theme => (
                        <div key={theme.id} className={`${styles.themeCard} ${activeTheme?.id === theme.id ? styles.activeTheme : ''}`}>
                            <h3 className={styles.themeCardTitle}>{theme.nome_tema} {theme.is_free ? '(Grátis)' : ''}</h3>
                            {theme.preview_url && (
                                <div className={styles.themeCardPreview}>
                                    <img src={theme.preview_url} alt={`Preview do Tema ${theme.nome_tema}`} />
                                </div>
                            )}
                            <p className={styles.themeCardDescription}>{theme.descricao}</p>
                            <button 
                                onClick={() => handleApplyTheme(theme.id)} 
                                className={styles.applyThemeButton} 
                                disabled={loading || activeTheme?.id === theme.id}
                            >
                                {activeTheme?.id === theme.id ? 'Tema Ativo' : (loading ? 'Aplicando...' : 'Aplicar Tema')}
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default GerenciarTemaPage; // Exporta o componente renomeado
