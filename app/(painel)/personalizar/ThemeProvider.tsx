'use client';

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useRef,
  useCallback
} from 'react';

import defaultThemeConfig from './context/defaultThemeConfig';
import { ThemeConfig, ThemeUpdateFn } from './types';

interface ThemeContextType {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  saveThemeConfig: () => Promise<void>;
  selectedTheme: string;
  setSelectedTheme: (themeName: string) => void;
  iframeRef: React.RefObject<HTMLIFrameElement | null>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedTheme, setSelectedTheme] = useState<string>('tema-base-1');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const hasJustSaved = useRef(false);

  const loadThemeConfig = async (themeName: string) => {
    try {
      const response = await fetch(`/api/theme-settings/${themeName}`);
      if (response.ok) {
        const savedConfig = await response.json();
        console.log(`[LOAD] Configurações carregadas para "${themeName}":`, savedConfig);
        setConfig(prev => ({
          ...defaultThemeConfig,
          ...prev,
          ...savedConfig
        }));
      } else {
        console.warn(`[LOAD] Tema "${themeName}" não encontrado. Usando config padrão.`);
        setConfig(defaultThemeConfig);
      }
    } catch (error) {
      console.error('[LOAD] Erro ao carregar configurações do tema:', error);
      setConfig(defaultThemeConfig);
    }
  };

  useEffect(() => {
    if (!hasJustSaved.current && selectedTheme) {
      loadThemeConfig(selectedTheme);
    } else {
      hasJustSaved.current = false;
    }
  }, [selectedTheme]);

  const updateConfig: ThemeUpdateFn = useCallback((newConfig) => {
    setConfig(prevConfig => {
      const merged = { ...prevConfig };
      for (const key in newConfig) {
        if (Object.prototype.hasOwnProperty.call(newConfig, key)) {
          const newValue = (newConfig as any)[key];
          const prevValue = (prevConfig as any)[key];
          if (
            typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue) &&
            typeof prevValue === 'object' && prevValue !== null && !Array.isArray(prevValue)
          ) {
            (merged as any)[key] = { ...prevValue, ...newValue };
          } else {
            (merged as any)[key] = newValue;
          }
        }
      }
      return merged;
    });
  }, []);

  const saveThemeConfig = async () => {
    console.log(`[SAVE] Tentando salvar config do tema "${selectedTheme}":`, config);
    try {
      const response = await fetch(`/api/theme-settings/${selectedTheme}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (response.ok) {
        hasJustSaved.current = true;
        alert('Configurações salvas com sucesso!');
        console.log(`[SAVE] Configurações salvas no backend.`);
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar: ${errorData.message || response.statusText}`);
        console.error('[SAVE] Falha ao salvar:', errorData);
      }
    } catch (error) {
      alert('Erro de rede ao salvar configurações.');
      console.error('[SAVE] Erro na chamada da API:', error);
    }
  };

  // Efeito para enviar a configuração para o iframe (lado do painel)
  useEffect(() => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const iframeWindow = iframeRef.current.contentWindow;
      iframeWindow.postMessage(
        {
          type: 'UPDATE_THEME_CONFIG',
          config,
          previewMode
        },
        '*'
      );
      // Injeção de variáveis CSS no iframe (isso já estava no seu código)
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow.document;
      let styleTag = iframeDoc.getElementById('injected-theme-vars') as HTMLStyleElement;
      if (!styleTag) {
        styleTag = iframeDoc.createElement('style');
        styleTag.id = 'injected-theme-vars';
        iframeDoc.head.appendChild(styleTag);
      }
      styleTag.innerHTML = `
        :root {
          --primary-color: ${config.primaryColor ?? '#8d4edb'};
          --secondary-color: ${config.secondaryColor ?? '#f0f0f0'};
          --text-color: ${config.textColor ?? '#333333'};
          --header-background-color: ${
            config.headerSettings?.useCustomHeaderColors
              ? config.headerSettings.headerBackgroundColor ?? '#ffffff'
              : config.headerBackgroundColor ?? '#ffffff'
          };
          --header-text-color: ${
            config.headerSettings?.useCustomHeaderColors
              ? config.headerSettings.headerTextColor ?? '#333333'
              : config.headerTextColor ?? '#333333'
          };
          --navbar-background-color: ${config.navbarBackgroundColor ?? config.primaryColor ?? '#8d4edb'};
          --navbar-text-color: ${config.navbarTextColor ?? '#ffffff'};
          --search-bar-background-color: ${config.headerSettings?.searchBarBackgroundColor ?? '#ffffff'};
          --footer-background-color: ${config.footer?.footerBackgroundColor ?? '#212529'};
          --footer-text-color: ${config.footer?.footerTextColor ?? '#f8f9fa'};
          --footer-invert-social-icons: ${
            config.footer?.footerTextColor === '#ffffff' || config.footer?.footerTextColor === '#f8f9fa' ? '1' : '0'
          };
          --primary-font: '${config.primaryFont ?? 'Roboto'}', sans-serif;
          --secondary-font: '${config.secondaryFont ?? 'Open Sans'}', sans-serif;
          --title-base-font-size-value: ${
            config.titleBaseFontSize === 'small'
              ? '2em'
              : config.titleBaseFontSize === 'large'
              ? '3em'
              : '2.5em'
          };
          --text-base-font-size-value: ${
            config.textBaseFontSize === 'small'
              ? '0.875em'
              : config.textBaseFontSize === 'large'
              ? '1.125em'
              : '1em'
          };
          --icon-base-size: ${
            config.headerSettings?.iconSize === 'small'
              ? '1em'
              : config.headerSettings?.iconSize === 'large'
              ? '1.5em'
              : '1.2em'
          };
          --button-border-radius: ${
            config.design?.buttonBorderRadius === 'square'
              ? '0'
              : config.design?.buttonBorderRadius === 'rounded'
              ? '8px'
              : config.design?.buttonBorderRadius === 'oval'
              ? '9999px'
              : '8px'
          };
          --image-border-radius: ${
            config.design?.imageBorderRadius === 'square'
              ? '0'
              : config.design?.imageBorderRadius === 'rounded'
              ? '8px'
              : config.design?.imageBorderRadius === 'circle'
              ? '50%'
              : '0'
          };
          --shadow-style: ${
            config.design?.enableShadows && config.design.shadowStyle !== 'none'
              ? config.design.shadowStyle === 'small'
                ? '0 1px 3px rgba(0,0,0,0.1)'
                : config.design.shadowStyle === 'medium'
                ? '0 4px 8px rgba(0,0,0,0.15)'
                : '0 8px 16px rgba(0,0,0,0.2)'
              : 'none'
          };
          --scrollbar-color: ${config.design?.scrollbarColor ?? config.primaryColor};
        }
      `;
    }
  }, [config, previewMode]);

  // Efeito para receber a configuração do painel (lado do preview/loja)
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificação de segurança: checa se o payload e o tipo de mensagem são o que esperamos
      if (event.data && event.data.type === 'UPDATE_THEME_CONFIG' && event.data.config) {
        console.log("Recebido tema do painel:", event.data.config);
        setConfig(event.data.config);
      }
    };
    // Adiciona o ouvinte ao carregar o componente
    window.addEventListener('message', handleMessage);
    // Remove o ouvinte ao desmontar para evitar vazamento de memória
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []); // A dependência é um array vazio, para que o ouvinte seja adicionado apenas uma vez

  return (
    <ThemeContext.Provider
      value={{
        config,
        updateConfig,
        previewMode,
        setPreviewMode,
        saveThemeConfig,
        selectedTheme,
        setSelectedTheme,
        iframeRef
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};