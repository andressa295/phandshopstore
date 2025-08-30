'use client';

import React, { useEffect, ReactNode } from 'react';
import { useTheme } from '../../../../../(painel)/personalizar/context/ThemeContext';
import './TemaPadrao.css';

interface TemaPadraoProps {
  children: ReactNode;
}

const TemaPadrao: React.FC<TemaPadraoProps> = ({ children }) => {
  const { config } = useTheme();

  useEffect(() => {
    if (!config) return;
    const root = document.documentElement;

    root.style.setProperty('--primary-color', config.primaryColor ?? '#5b21b6');
    root.style.setProperty('--secondary-color', config.secondaryColor ?? '#6c757d');
    root.style.setProperty('--text-color', config.textColor ?? '#343a40');

    root.style.setProperty('--header-background-color', config.headerBackgroundColor ?? '#ffffff');
    root.style.setProperty('--header-text-color', config.headerTextColor ?? '#343a40');
    
    root.style.setProperty('--primary-font', `'${config.primaryFont ?? 'sans-serif'}', sans-serif`);
    root.style.setProperty('--secondary-font', `'${config.secondaryFont ?? 'sans-serif'}', sans-serif`);

    let shadowStyleValue = 'none';
    if (config.design?.enableShadows && config.design.shadowStyle && config.design.shadowStyle !== 'none') {
      switch (config.design.shadowStyle) {
        case 'small': shadowStyleValue = '0 1px 3px rgba(0,0,0,0.1)'; break;
        case 'medium': shadowStyleValue = '0 4px 8px rgba(0,0,0,0.15)'; break;
        case 'large': shadowStyleValue = '0 8px 16px rgba(0,0,0,0.2)'; break;
        default: shadowStyleValue = 'none';
      }
    }
    root.style.setProperty('--shadow-style', shadowStyleValue);

  }, [config]);

  return (
    <div className="ph-tema-padrao-wrapper">
      {children}
    </div>
  );
};

export default TemaPadrao;