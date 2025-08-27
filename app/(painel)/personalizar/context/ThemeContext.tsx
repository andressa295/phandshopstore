// app/(painel)/personalizar/context/ThemeContext.tsx
'use client'; 

import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from 'react';
import defaultThemeConfig from './defaultThemeConfig'; // Importa a config padrão
import { ThemeConfig, ThemeUpdateFn, HomepageModuleType, AdvancedConfig } from '../types'; // Importa AdvancedConfig
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; 

interface ThemeContextType {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  saveThemeConfig: () => Promise<void>;
  selectedTheme: string;
  setSelectedTheme: (themeName: string) => void;
  isLoading: boolean; 
  isSaving: boolean; 
  error: string | null; 
  iframeRef: React.RefObject<HTMLIFrameElement | null>; 
}

// 4. Criação do Contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const supabase = createClientComponentClient();


// 5. Provedor do Contexto
export const ThemeProvider: React.FC<{ children: ReactNode; lojaSlug: string; initialThemeConfig?: ThemeConfig }> = ({ children, lojaSlug, initialThemeConfig }) => {
  const [config, setConfig] = useState<ThemeConfig>(initialThemeConfig || defaultThemeConfig);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedTheme, setSelectedTheme] = useState<string>('tema-base-1'); // Pode ser carregado do Supabase também
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null); // Movido para o ThemeProvider

  const hasJustSaved = useRef(false); // Para controlar o carregamento após salvar

  // Função para atualizar partes da configuração (merge profundo para objetos aninhados)
  const updateConfig: ThemeUpdateFn = useCallback((newConfig) => {
    setConfig(prevConfig => {
      const mergedConfig = { ...prevConfig };

      for (const key in newConfig) {
        if (newConfig.hasOwnProperty(key)) {
          const newValue = (newConfig as any)[key];
          const prevValue = (prevConfig as any)[key];

          // Se a nova propriedade é um objeto e a antiga também, faz merge profundo
          if (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue) &&
              typeof prevValue === 'object' && prevValue !== null && !Array.isArray(prevValue)) {
            (mergedConfig as any)[key] = { ...prevValue, ...newValue };
          } else {
            // Caso contrário, substitui (para arrays, strings, booleans, numbers)
            (mergedConfig as any)[key] = newValue;
          }
        }
      }
      return mergedConfig;
    });
  }, []); // Sem dependências, pois setConfig já garante a atualização

  // --- FUNÇÃO PARA SALVAR AS CONFIGURAÇÕES NO SUPABASE ---
  const saveThemeConfig = useCallback(async () => {
    setIsSaving(true);
    setError(null);
    try {
      // Adiciona um timestamp de atualização para controle
      const configToSave: ThemeConfig = JSON.parse(JSON.stringify(config)); // Faz uma cópia profunda para não modificar o estado diretamente
      if (configToSave.advanced) {
        configToSave.advanced.lastUpdatedEditor = new Date().toISOString();
      } else {
        configToSave.advanced = { lastUpdatedEditor: new Date().toISOString() };
      }

      const { data, error: updateError } = await supabase
        .from('lojas')
        .update({ configuracoes_tema_json: configToSave })
        .eq('slug', lojaSlug)
        .select(); // Adicionamos .select() para garantir o retorno dos dados

      if (updateError) {
        console.error("Erro ao salvar configurações do tema:", updateError);
        setError(`Falha ao salvar: ${updateError.message}`);
        alert(`Erro ao salvar configurações: ${updateError.message}`); // Usar um modal customizado em prod
      } else if (data && data.length > 0) {
        console.log("Configurações do tema salvas com sucesso:", data[0].configuracoes_tema_json);
        alert('Configurações salvas com sucesso!'); // Usar um modal customizado em prod
        hasJustSaved.current = true; // Marca que acabou de salvar
        // Opcional: Atualizar o estado 'config' com os dados retornados pelo Supabase
        setConfig(data[0].configuracoes_tema_json as ThemeConfig); 
      } else {
        setError("Nenhuma linha afetada ao salvar. Verifique se a loja existe.");
        alert("Nenhuma alteração foi salva. Verifique se a loja existe."); // Usar um modal customizado em prod
      }
    } catch (err: any) {
      console.error("Erro inesperado ao salvar configurações:", err);
      setError(`Erro inesperado: ${err.message}`);
      alert(`Erro inesperado ao salvar: ${err.message}`); // Usar um modal customizado em prod
    } finally {
      setIsSaving(false);
    }
  }, [config, lojaSlug]); // Re-cria a função se 'config' ou 'lojaSlug' mudar

  // --- EFEITO PARA CARREGAR A CONFIGURAÇÃO INICIAL DO SUPABASE ---
  useEffect(() => {
    async function fetchInitialConfig() {
      setIsLoading(true);
      setError(null);
      try {
        const { data: loja, error: fetchError } = await supabase
          .from('lojas')
          .select('configuracoes_tema_json, theme_id') // Também buscamos o theme_id
          .eq('slug', lojaSlug)
          .single();

        if (fetchError) {
          console.error("Erro ao carregar configurações iniciais do tema:", fetchError);
          setError(`Falha ao carregar tema: ${fetchError.message}`);
          setConfig(defaultThemeConfig); 
        } else if (loja && loja.configuracoes_tema_json) {
          let loadedConfig: ThemeConfig;
          try {
            // Garante que o JSON é parseado se for string
            loadedConfig = typeof loja.configuracoes_tema_json === 'string'
              ? JSON.parse(loja.configuracoes_tema_json)
              : loja.configuracoes_tema_json;
          } catch (parseError) {
            console.error("Erro ao parsear JSON do tema do Supabase:", parseError);
            setError("Erro ao processar as configurações do tema. Carregando padrão.");
            loadedConfig = defaultThemeConfig;
          }
          setConfig(loadedConfig);
          if (loja.theme_id) { // Se a loja tiver um theme_id, podemos usá-lo para selectedTheme
            // TODO: Buscar o nome do tema da tabela 'temas' usando loja.theme_id
            // Por enquanto, vamos usar um valor padrão ou o que já está em selectedTheme
            // setSelectedTheme(nomeDoTemaBaseadoNoId);
          }
        } else {
          // Se a loja não tiver configuracoes_tema_json, usa a config padrão
          setConfig(defaultThemeConfig);
          setError("Nenhuma configuração de tema encontrada para esta loja. Carregando padrão.");
        }
      } catch (err: any) {
        console.error("Erro inesperado ao carregar configurações iniciais:", err);
        setError(`Erro inesperado ao carregar: ${err.message}`);
        setConfig(defaultThemeConfig); // Em caso de erro inesperado, usa o padrão
      } finally {
        setIsLoading(false);
      }
    }

    // Só busca se tiver um slug e se não acabou de salvar
    if (lojaSlug && !hasJustSaved.current) { 
      fetchInitialConfig();
    } else if (!lojaSlug) {
      setIsLoading(false); // Se não tiver slug, não está carregando nada
    }

    // Resetar hasJustSaved após o carregamento inicial ou se o slug mudar
    if (hasJustSaved.current && lojaSlug) {
      hasJustSaved.current = false;
    }

  }, [lojaSlug, initialThemeConfig]); // Depende de lojaSlug e initialThemeConfig

  // Efeito para aplicar as variáveis CSS globais no documento (para o tema no iframe)
  // Este useEffect é para estilizar o DOM do PAINEL (onde o Preview.tsx está).
  // O Preview.tsx já injeta esses estilos no IFRAME.
  useEffect(() => {
    const root = document.documentElement; 
    
    // Cores
    root.style.setProperty('--primary-color', config.primaryColor ?? '#5b21b6'); 
    root.style.setProperty('--secondary-color', config.secondaryColor ?? '#6c757d');
    root.style.setProperty('--text-color', config.textColor ?? '#343a40'); 

    // Header
    root.style.setProperty('--header-background-color', config.headerBackgroundColor ?? '#ffffff');
    root.style.setProperty('--header-text-color', config.headerTextColor ?? '#343a40');

    // Footer
    root.style.setProperty('--footer-background-color', config.footer?.footerBackgroundColor ?? '#343a40');
    root.style.setProperty('--footer-text-color', config.footer?.footerTextColor ?? '#ffffff');

    // Fonts
    root.style.setProperty('--primary-font', `'${config.primaryFont ?? 'sans-serif'}', sans-serif`); 
    root.style.setProperty('--secondary-font', `'${config.secondaryFont ?? 'sans-serif'}', sans-serif`); 

    // Tamanhos de fonte base (para usar no CSS do tema)
    const baseFontSizeMap = {
        'small': '0.875em',
        'medium': '1em',
        'large': '1.125em'
    };
    const titleFontSizeMap = {
        'small': '2em',
        'medium': '2.5em',
        'large': '3em'
    };

    root.style.setProperty('--title-base-font-size-value', titleFontSizeMap[config.titleBaseFontSize || 'medium']);
    root.style.setProperty('--text-base-font-size-value', baseFontSizeMap[config.textBaseFontSize || 'medium']);


    // Design configs
    root.style.setProperty('--button-border-radius', 
        config.design?.buttonBorderRadius === 'square' ? '0' : 
        config.design?.buttonBorderRadius === 'rounded' ? '8px' : 
        config.design?.buttonBorderRadius === 'oval' ? '9999px' : '8px' 
    );
    root.style.setProperty('--image-border-radius',
        config.design?.imageBorderRadius === 'square' ? '0' :
        config.design?.imageBorderRadius === 'rounded' ? '8px' :
        config.design?.imageBorderRadius === 'circle' ? '50%' : '0'
    );
    root.style.setProperty('--scrollbar-color', config.design?.scrollbarColor ?? '#007bff');
    
    // --- Lógica Corrigida para --shadow-style ---
    let shadowStyleValue = 'none';
    if (config.design?.enableShadows && config.design.shadowStyle && config.design.shadowStyle !== 'none') {
        switch (config.design.shadowStyle) {
            case 'small':
                shadowStyleValue = '0 1px 3px rgba(0,0,0,0.1)';
                break;
            case 'medium':
                shadowStyleValue = '0 4px 8px rgba(0,0,0,0.15)';
                break;
            case 'large': 
                shadowStyleValue = '0 8px 16px rgba(0,0,0,0.2)';
                break;
            default:
                shadowStyleValue = 'none'; 
        }
    }
    root.style.setProperty('--shadow-style', shadowStyleValue);
    // --- Fim da Lógica Corrigida ---

    // Apply custom CSS (if this styleTag affects the main app, not just iframe)
    if (config.advanced?.customCss) {
        let styleTag = document.getElementById('custom-css-theme-style') as HTMLStyleElement;
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'custom-css-theme-style';
            document.head.appendChild(styleTag);
        }
        styleTag.innerHTML = config.advanced.customCss;
    } else {
        const styleTag = document.getElementById('custom-css-theme-style');
        if (styleTag) styleTag.remove();
    }
    
  }, [config]); 

  return (
    <ThemeContext.Provider value={{
      config,
      updateConfig,
      previewMode,
      setPreviewMode,
      saveThemeConfig,
      selectedTheme,
      setSelectedTheme,
      isLoading,
      isSaving,
      error,
      iframeRef, // Passa o iframeRef para o contexto
    }}>
      {children}
    </ThemeContext.Provider>
  );
};

// 6. Hook personalizado para usar o contexto
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};