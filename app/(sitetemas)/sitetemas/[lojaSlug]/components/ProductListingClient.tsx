'use client';

import React, { FC } from 'react';
import { ThemeProvider } from '../../../../(painel)/personalizar/context/ThemeContext';
import {
    ThemeConfig,
    LojaData,
    ProdutoData,
    CategoryData,
    BannerData,
    InfoBarItem,
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
import ImageGalleryModule from './ImageGalleryModule';
import ProductShowcaseModule from './ProductShowcaseModule';

// Placeholder para componentes que ainda não existem
const PlaceholderComponent: FC = () => null;

// Mapeamento de tipos de módulo para o componente de render
const ModuleRenderers: Record<HomepageModuleType['type'], React.FC<any>> = {
    'banner': BannerSlider,
    'mini_banners': MiniBannerSection,
    'product_showcase': ProductShowcaseModule,
    'text_image': TextWithImageSection,
    'newsletter': NewsletterSection,
    'image_gallery': ImageGalleryModule,
    'highlights': BenefitInfoBar,
    'testimonials': TestimonialsSection,
    // CORREÇÃO: Adicionado os placeholders para evitar o erro
    'categories': PlaceholderComponent,
    'video': PlaceholderComponent,
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
    isIframeHost,
}) => {
    const { homepage } = initialThemeConfig;

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
            <Header />
            <main className="ph-main-content">
                {homepage?.modules && homepage.modules.length > 0 ? (
                    homepage.modules.map((module, index) => {
                        const Renderer = ModuleRenderers[module.type];
                        if (Renderer && module.data?.isActive) {
                            return <Renderer key={index} data={module.data} />;
                        }
                        return null;
                    })
                ) : (
                    <div className="p-4 text-center">Nenhum módulo de página inicial configurado.</div>
                )}
            </main>
            <Footer />
        </ThemeProvider>
    );
};

export default ProductListingClient;
