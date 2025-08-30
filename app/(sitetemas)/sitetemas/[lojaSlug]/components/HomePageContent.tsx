'use client';

import React from 'react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import {
  HomepageModuleType,
  BannerModuleData,
  MiniBannerModuleData,
  ProductShowcaseModuleData,
  TextImageModuleData,
  NewsletterModuleData,
  CategoriesModuleData,
  HighlightsModuleData,
  VideoModuleData,
  TestimonialsModuleData,
  ImageGalleryModuleData,
  ProdutoData,
} from '../../../../(painel)/personalizar/types';

// Importa os componentes de módulos
import ProductCard from './ProductCard';
import BannerSlider from './BannerSlider';
import BenefitInfoBar from './BenefitInfoBar';
import TestimonialsSection from './TestimonialsSection';
import MiniBannerSection from './MiniBannerSection';
import NewsletterSection from './NewsletterSection';
import TextWithImageSection from './TextWithImageSection';
import CategoryListingPage from './CategoryListingPage';
import StaticPage from './StaticPage';
import Header from './Header';
import Footer from './Footer';
import ImageGalleryModule from './ImageGalleryModule';
import TopInfoBar from './TopInfoBar';
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

const HomePageContent: React.FC = () => {
  const { config, lojaData, produtos } = useTheme();
  const modules = config.homepage?.modules || [];

  if (!lojaData) {
    return <div>Carregando dados da loja...</div>;
  }

  return (
    <div className="ph-loja-container">
      {/* TopInfoBar e Header agora não recebem props */}
      <TopInfoBar />
      <Header />

      <main className="ph-main-content">
        {modules.map((module) => {
          const Renderer = ModuleRenderers[module.type];
          if (!Renderer) return null;

          if (!module.data.isActive) return null;

          switch (module.type) {
            case 'banner':
              return <Renderer key={module.id} data={module.data as BannerModuleData} />;
            case 'mini_banners':
              return <Renderer key={module.id} data={module.data as MiniBannerModuleData} />;
            case 'product_showcase':
              return (
                <Renderer
                  key={module.id}
                  data={module.data as ProductShowcaseModuleData}
                  allProducts={produtos}
                  lojaNome={lojaData.nome_loja}
                />
              );
            case 'text_image':
              return <Renderer key={module.id} data={module.data as TextImageModuleData} />;
            case 'newsletter':
              return <Renderer key={module.id} data={module.data as NewsletterModuleData} />;
            case 'categories':
              return (
                <Renderer
                  key={module.id}
                  data={module.data as CategoriesModuleData}
                  allProducts={produtos}
                  lojaNome={lojaData.nome_loja}
                />
              );
            case 'highlights':
              return <Renderer key={module.id} data={module.data as HighlightsModuleData} />;
            case 'video':
              return <Renderer key={module.id} data={module.data as VideoModuleData} />;
            case 'testimonials':
              return <Renderer key={module.id} data={module.data as TestimonialsModuleData} />;
            case 'image_gallery':
              return <Renderer key={module.id} data={module.data as ImageGalleryModuleData} />;
            default:
              return null;
          }
        })}
      </main>

      {/* Footer também não recebe props */}
      <Footer />
    </div>
  );
};

export default HomePageContent;
