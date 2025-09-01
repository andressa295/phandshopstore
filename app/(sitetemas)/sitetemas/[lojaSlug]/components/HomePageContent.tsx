// app/(sitetemas)/sitetemas/[lojaSlug]/components/HomePageContent.tsx
'use client';

import React from 'react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { HomepageModuleType } from '../../../../(painel)/personalizar/types';

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
import ProductCard from './ProductCard'; // Mantive caso você use em algum lugar

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

const HomePageContent: React.FC = () => {
    // CORRIGIDO: Usa o hook useTheme para pegar todos os dados necessários
    const { config, lojaData, produtos } = useTheme();
    const modules = config.homepage?.modules || [];

    if (!lojaData) {
        // Esta verificação pode ser redundante se o componente pai Page() já lidar com isso
        return <div>Carregando dados da loja...</div>;
    }

    return (
        <div className="ph-loja-container">
            <TopInfoBar />
            <Header />
            <main className="ph-main-content">
                {modules.map((module) => {
                    const Renderer = ModuleRenderers[module.type];
                    if (!Renderer) return null;

                    if (!module.data.isActive) return null;

                    // O switch case para passar as props está correto
                    switch (module.type) {
                      // ... (seu código original aqui, está perfeito)
                      case 'banner':
                          return <Renderer key={module.id} data={module.data} />;
                      case 'mini_banners':
                          return <Renderer key={module.id} data={module.data} />;
                      case 'product_showcase':
                          return (
                              <Renderer
                                key={module.id}
                                data={module.data}
                                allProducts={produtos}
                                lojaNome={lojaData.nome_loja}
                              />
                          );
                      case 'text_image':
                          return <Renderer key={module.id} data={module.data} />;
                      case 'newsletter':
                          return <Renderer key={module.id} data={module.data} />;
                      case 'categories':
                          return (
                              <Renderer
                                key={module.id}
                                data={module.data}
                                allProducts={produtos}
                                lojaNome={lojaData.nome_loja}
                              />
                          );
                      case 'highlights':
                          return <Renderer key={module.id} data={module.data} />;
                      case 'video':
                          return <Renderer key={module.id} data={module.data} />;
                      case 'testimonials':
                          return <Renderer key={module.id} data={module.data} />;
                      case 'image_gallery':
                          return <Renderer key={module.id} data={module.data} />;
                      default:
                          return null;
                    }
                })}
            </main>
            <Footer />
        </div>
    );
};

export default HomePageContent;