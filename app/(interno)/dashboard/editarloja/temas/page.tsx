'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useUser } from '../../UserContext';
import styles from './ThemeManagementPage.module.css';
import { ThemeConfig } from '../../../../(painel)/personalizar/types';

interface LojaData {
  id: string;
  nome_loja: string;
  slug: string;
  theme_id: string | null;
  configuracoes_tema_json: ThemeConfig;
}

interface TemaData {
  id: string;
  nome_tema: string;
  descricao: string | null;
  preview_url: string | null;
  is_free: boolean;
  caminho_componente: string;
}

const GerenciarTemaPage: React.FC = () => {
  const supabase = createClientComponentClient();
  const { user, profile, loading: userLoading } = useUser();

  const [loja, setLoja] = useState<LojaData | null>(null);
  const [activeTheme, setActiveTheme] = useState<TemaData | null>(null);
  const [availableThemes, setAvailableThemes] = useState<TemaData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchThemeData = async () => {
      if (!user || !profile?.lojaId) {
        setError("Usuário não autenticado ou loja não encontrada.");
        setLoading(false);
        return;
      }

      try {
        // CORREÇÃO: Usa o profile.lojaId como fonte de verdade
        const { data: lojaData, error: lojaError } = await supabase
          .from('lojas')
          .select(`id, nome_loja, slug, theme_id, configuracoes_tema_json`)
          .eq('id', profile.lojaId)
          .single();

        if (lojaError || !lojaData) {
          throw new Error(lojaError?.message || "Loja não encontrada para o usuário.");
        }
        setLoja(lojaData as LojaData);

        const { data: themesData, error: themesError } = await supabase
          .from('temas')
          .select(`id, nome_tema, descricao, preview_url, is_free, caminho_componente`)
          .order('nome_tema', { ascending: true });

        if (themesError || !themesData) {
          throw new Error(themesError?.message || "Não foi possível carregar os temas disponíveis.");
        }
        setAvailableThemes(themesData as TemaData[]);

        if (lojaData.theme_id) {
          const currentActiveTheme = themesData.find(t => t.id === lojaData.theme_id);
          setActiveTheme(currentActiveTheme || null);
        } else {
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

    if (!userLoading && user && profile?.lojaId) {
      fetchThemeData();
    } else if (!userLoading && (!user || !profile?.lojaId)) {
        setLoading(false);
    }
  }, [user, profile, userLoading, supabase]);

  const handleApplyTheme = useCallback(async (themeId: string) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    setErrorMessage(null);

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

      const newActiveTheme = availableThemes.find(t => t.id === themeId);
      setActiveTheme(newActiveTheme || null);
      setSuccessMessage(`Tema '${newActiveTheme?.nome_tema}' aplicado com sucesso!`);

    } catch (err: any) {
      console.error("Erro ao aplicar tema:", err.message);
      setErrorMessage(`Erro ao aplicar o tema: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [loja, availableThemes, supabase]);

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
      {error && <div className={styles.errorMessage}>{error}</div>}
      {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}

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

export default GerenciarTemaPage;