'use client';

import React, { ReactNode } from 'react';
import { ThemeProvider } from '../../../../(painel)/personalizar/context/ThemeContext';
import { ThemeConfig } from '../../../../(painel)/personalizar/types';

interface ThemeFetcherProps {
  lojaSlug: string;
  children: ReactNode;
  initialThemeConfig: ThemeConfig;
  lojaData: any;
  produtos: any[];
  banners: any[];
  categorias: any[];
  infoBarItems: any[];
}

const ThemeFetcher: React.FC<ThemeFetcherProps> = ({
  lojaSlug,
  children,
  initialThemeConfig,
  lojaData,
  produtos,
  banners,
  categorias,
  infoBarItems,
}) => {
  console.log("ThemeFetcher: Componente renderizado.");

  return (
    <ThemeProvider
      lojaSlug={lojaSlug}
      initialThemeConfig={initialThemeConfig} // Passa a prop diretamente
      lojaData={lojaData}
      produtos={produtos}
      banners={banners}
      categorias={categorias}
      infoBarItems={infoBarItems}
      isIframeHost={false} // IMPORTANTE: Confirma que este ThemeProvider NÃO é o host
    >
      {children}
    </ThemeProvider>
  );
};

export default ThemeFetcher;