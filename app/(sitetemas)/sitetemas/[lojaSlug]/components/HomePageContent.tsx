'use client';

import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import BannerSlider from './BannerSlider';
import ProductShowcaseModule from './ProductShowcaseModule';
import TextWithImageSection from './TextWithImageSection';
import BenefitInfoBar from './BenefitInfoBar';
import NewsletterSection from './NewsletterSection';
import ImageGalleryModule from './ImageGalleryModule';
import MiniBannerSection from './MiniBannerSection';
import TestimonialsSection from './TestimonialsSection';
import TopInfoBar from './TopInfoBar';
import { HomepageModuleType } from '../../../../(painel)/personalizar/types';

// Mapeamento dos tipos de módulo para os componentes correspondentes
const componentsMap = {
    'banner': BannerSlider,
    'product_showcase': ProductShowcaseModule,
    'text_image': TextWithImageSection,
    'highlights': BenefitInfoBar,
    'newsletter': NewsletterSection,
    'image_gallery': ImageGalleryModule,
    'mini_banners': MiniBannerSection,
    'testimonials': TestimonialsSection,
    'top_info_bar': TopInfoBar,
};

export default function HomePageContent() {
    const { config } = useTheme();

    if (!config || !config.homepage || !config.homepage.modules || config.homepage.modules.length === 0) {
        return <div className="p-4 text-center">Nenhum módulo de página inicial configurado.</div>;
    }

    const { modules } = config.homepage;

    return (
        <div className="ph-main-content">
            {modules.map((module: HomepageModuleType) => {
                const Component = componentsMap[module.type as keyof typeof componentsMap];
                
                if (Component && (module.data as any)?.isActive) {
                    // CORREÇÃO: Passa as propriedades do objeto 'data' de forma individual
                    return <Component key={module.id} {...(module.data as any)} />;
                }
                
                return null;
            })}
        </div>
    );
}
