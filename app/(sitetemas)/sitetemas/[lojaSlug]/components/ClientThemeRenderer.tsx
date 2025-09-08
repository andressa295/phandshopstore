// app/(sitetemas)/sitetemas/[lojaSlug]/components/ClientThemeRenderer.tsx
'use client';

import React from 'react';
import { ThemeProvider } from '../../../../(painel)/personalizar/context/ThemeContext';
import TemaPadrao from './temas/TemaPadrao';
import HomePageContent from './HomePageContent';
import Header from './Header';
import Footer from './Footer';

interface ClientThemeRendererProps {
    lojaSlug: string;
    initialThemeConfig: any;
    lojaData: any;
    produtos: any[];
    banners: any[];
    categorias: any[];
    infoBarItems: any[];
}

export default function ClientThemeRenderer({
    lojaSlug,
    initialThemeConfig,
    lojaData,
    produtos,
    banners,
    categorias,
    infoBarItems,
}: ClientThemeRendererProps) {
    return (
        <ThemeProvider
            lojaSlug={lojaSlug}
            initialThemeConfig={initialThemeConfig}
            lojaData={lojaData}
            produtos={produtos}
            banners={banners}
            categorias={categorias}
            infoBarItems={infoBarItems}
            isIframeHost={false}
        >
            <TemaPadrao>
                <Header />
                <HomePageContent />
                <Footer />
            </TemaPadrao>
        </ThemeProvider>
    );
}