'use client'; 

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import defaultThemeConfig from './defaultThemeConfig'; // Importa a config padrão
import { ThemeConfig, ThemeUpdateFn, HomepageModuleType } from '../types'; 

// 2. Tipagem para o contexto (o que será provido)
interface ThemeContextType {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
  previewMode: 'desktop' | 'mobile';
  setPreviewMode: (mode: 'desktop' | 'mobile') => void;
  saveThemeConfig: () => Promise<void>;
  selectedTheme: string;
  setSelectedTheme: (themeName: string) => void;
}

// 4. Criação do Contexto
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 5. Provedor do Contexto
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<ThemeConfig>(defaultThemeConfig); // Usa a config padrão
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [selectedTheme, setSelectedTheme] = useState<string>('tema-base-1'); 

  // Função para atualizar partes da configuração (merge profundo para objetos aninhados)
  const updateConfig: ThemeUpdateFn = (newConfig) => {
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
  };

  // Função para salvar as configurações no backend (placeholder)
  const saveThemeConfig = async () => {
    console.log("Salvando configurações do tema:", config);
    // TODO: Implementar chamada à API para salvar 'config'
    // Ex: await fetch('/api/save-theme-config', { method: 'POST', body: JSON.stringify(config) });
    alert('Configurações salvas (simulado)! Veja o console.');
  };

  // Efeito para aplicar as variáveis CSS globais no documento (para o tema no iframe)
  useEffect(() => {
    // Isso é para o DOM do PARENT (onde o Preview.tsx está). O Preview.tsx já injeta esses estilos no IFRAME.
    // Você pode remover essa parte do ThemeContext se ela não for necessária no DOM principal do painel.
    const root = document.documentElement; 
    
    // Core Colors
    root.style.setProperty('--primary-color', config.primaryColor ?? '#5b21b6'); 
    root.style.setProperty('--secondary-color', config.secondaryColor ?? '#6c757d');
    root.style.setProperty('--text-color', config.textColor ?? '#343a40'); 

    // Header Colors
    root.style.setProperty('--header-background-color', config.headerBackgroundColor ?? '#ffffff');
    root.style.setProperty('--header-text-color', config.headerTextColor ?? '#343a40');

    // Footer Colors
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
        'small': '2em', // H1 (ou outro base)
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
    root.style.setProperty('--shadow-style', config.design?.enableShadows && config.design.shadowStyle !== 'none' ?
        (config.design.shadowStyle === 'small' ? '0 1px 3px rgba(0,0,0,0.1)' :
         config.design.shadowStyle === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
         '0 8px 16px rgba(0,0,0,0.2)') : 'none');

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