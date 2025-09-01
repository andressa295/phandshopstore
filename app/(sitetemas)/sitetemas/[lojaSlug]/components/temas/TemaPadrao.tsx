'use client';

import React, { useEffect, ReactNode } from 'react';
import { useTheme } from '../../../../../(painel)/personalizar/context/ThemeContext';
import './TemaPadrao.css'; // Importa o arquivo CSS

interface TemaPadraoProps {
  children: ReactNode;
}

const TemaPadrao: React.FC<TemaPadraoProps> = ({ children }) => {
  const { config } = useTheme();

  useEffect(() => {
    if (!config) return;

    const root = document.documentElement;

    root.style.setProperty('--primary-color', config.primaryColor ?? '#000000');
    root.style.setProperty('--secondary-color', config.secondaryColor ?? '#808080');
    root.style.setProperty('--text-color', config.textColor ?? '#333333');
    root.style.setProperty('--header-background-color', config.headerBackgroundColor ?? '#ffffff');
    root.style.setProperty('--header-text-color', config.headerTextColor ?? '#333333');
    root.style.setProperty('--footer-background-color', config.footer?.footerBackgroundColor ?? '#212529');
    root.style.setProperty('--footer-text-color', config.footer?.footerTextColor ?? '#f8f9fa');
    root.style.setProperty('--primary-font', `'${config.primaryFont ?? 'Inter'}', sans-serif`);
    root.style.setProperty('--secondary-font', `'${config.secondaryFont ?? 'Inter'}', sans-serif`);
    root.style.setProperty('--button-border-radius', config.design?.buttonBorderRadius === 'rounded' ? '8px' : '0');
    root.style.setProperty('--image-border-radius', config.design?.imageBorderRadius === 'rounded' ? '8px' : '0');
    root.style.setProperty('--shadow-style', config.design?.enableShadows ? '0 4px 8px rgba(0,0,0,0.15)' : 'none');

    // A lógica de injeção de CSS global foi removida, agora o arquivo CSS cuida disso.

    return () => {
      // Limpa as variáveis de CSS quando o componente é desmontado
      root.style.removeProperty('--primary-color');
      root.style.removeProperty('--secondary-color');
      root.style.removeProperty('--text-color');
      // ... (remover todas as outras propriedades)
    };
  }, [config]);

  return (
    <div className="ph-tema-padrao-wrapper">
      {children}
    </div>
  );
};

export default TemaPadrao;
