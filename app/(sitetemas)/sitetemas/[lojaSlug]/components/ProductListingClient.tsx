'use client'; 

import React from 'react';
import { useTheme, ThemeProvider } from '../../../../(painel)/personalizar/context/ThemeContext';
import {
    ThemeConfig,
    LojaData,
    ProdutoData,
    CategoryData,
    BannerData,
    InfoBarItem,
    HighlightsModuleData,
    HomepageModuleType,
} from '../../../../(painel)/personalizar/types';

// Importa todos os componentes de layout e módulos
import TopInfoBar from './TopInfoBar';
import Header from './Header';
import Footer from './Footer';
import BannerSlider from './BannerSlider';
import BenefitInfoBar from './BenefitInfoBar';
import TestimonialsSection from './TestimonialsSection';
import MiniBannerSection from './MiniBannerSection';
import NewsletterSection from './NewsletterSection';
import TextWithImageSection from './TextWithImageSection';
import CategoryListingPage from './CategoryListingPage';
import StaticPage from './StaticPage';
import ImageGalleryModule from './ImageGalleryModule';
import ProductShowcaseModule from './ProductShowcaseModule';

// Mapeamento de tipos de módulo para componente de render
const ModuleRenderers: Record<HomepageModuleType['type'], React.FC<any>> = {
    banner: BannerSlider,
    mini_banners: MiniBannerSection,
    product_showcase: ProductShowcaseModule,
    text_image: TextWithImageSection,
    newsletter: NewsletterSection,
    categories: CategoryListingPage,
    highlights: BenefitInfoBar,
    video: StaticPage,
    testimonials: TestimonialsSection,
    image_gallery: ImageGalleryModule,
};

// Interface para as props que virão do Server Component
interface ProductListingClientProps {
    lojaSlug: string;
    initialThemeConfig: ThemeConfig;
    lojaData: LojaData;
    produtos: ProdutoData[];
    banners: BannerData[];
    categorias: CategoryData[];
    infoBarItems: InfoBarItem[];
    isIframeHost: boolean;
}

const ProductListingClient: React.FC<ProductListingClientProps> = ({
    lojaSlug,
    initialThemeConfig,
    lojaData,
    produtos,
    banners,
    categorias,
    infoBarItems,
    isIframeHost
}) => {
    // CORREÇÃO: Removemos o useTheme daqui e passamos as props diretamente para o ThemeProvider
    // para evitar conflitos.

    const modules = initialThemeConfig.homepage?.modules || [];

    return (
        <ThemeProvider
            lojaSlug={lojaSlug}
            initialThemeConfig={initialThemeConfig}
            lojaData={lojaData}
            produtos={produtos}
            banners={banners}
            categorias={categorias}
            infoBarItems={infoBarItems}
            isIframeHost={isIframeHost}
        >
            <TopInfoBar />
            <Header />
            <main className="ph-main-content">
                {modules.map((module) => {
                    const Renderer = ModuleRenderers[module.type];
                    if (!Renderer) {
                        console.warn(`Componente de renderização para o tipo de módulo '${module.type}' não encontrado.`);
                        return null;
                    }
                    if (module.data.isActive) {
                        return <Renderer key={module.id} data={module.data} />;
                    }
                    return null;
                })}
            </main>
            <Footer />
        </ThemeProvider>
    );
};

export default ProductListingClient;