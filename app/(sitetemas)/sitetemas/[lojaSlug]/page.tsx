// app/(sitetemas)/sitetemas/[lojaSlug]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams } from 'next/navigation';
import {
    ThemeConfig,
    LojaData,
    ProdutoData,
    CategoryData,
    BannerData,
    InfoBarItem,
    HighlightsModuleData,
    HomepageModuleType,
    SingleHighlightItem,
} from '../../../(painel)/personalizar/types';
import { themes } from '../../../(painel)/personalizar/themes';
import { Padrao } from '../../../(painel)/personalizar/themes/Padrao';
import { ThemeProvider, useTheme } from '../../../(painel)/personalizar/context/ThemeContext';

// Importa todos os componentes de layout e módulos
import TopInfoBar from './components/TopInfoBar';
import Header from './components/Header';
import Footer from './components/Footer';
import BannerSlider from './components/BannerSlider';
import BenefitInfoBar from './components/BenefitInfoBar';
import TestimonialsSection from './components/TestimonialsSection';
import MiniBannerSection from './components/MiniBannerSection';
import TextWithImageSection from './components/TextWithImageSection';
import CategoryListingPage from './components/CategoryListingPage';
import StaticPage from './components/StaticPage';
import ImageGalleryModule from './components/ImageGalleryModule';
import ProductShowcaseModule from './components/ProductShowcaseModule';
import NewsletterSection from './components/NewsletterSection';


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

    if (!config || !config.homepage) {
        console.warn("HomePageContent: Configuração do tema ou homepage não disponível.");
        return <div className="p-4 text-center">Configuração do tema não encontrada.</div>;
    }

    const modules = config.homepage.modules || [];

    return (
        <>
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
                        try {
                            return <Renderer key={module.id} data={module.data} />;
                        } catch (error) {
                            console.error(`ERRO: O módulo do tipo '${module.type}' falhou ao renderizar.`, error);
                            return <div key={module.id} className="p-4 bg-red-100 text-red-700">Erro ao carregar o módulo: {module.type}</div>;
                        }
                    }
                    return null;
                })}
            </main>
            <Footer />
        </>
    );
};


export default function Page() {
    const params = useParams();
    const lojaSlug = params.lojaSlug as string;
    const [themeData, setThemeData] = useState({
        initialThemeConfig: Padrao as ThemeConfig,
        lojaData: null as LojaData | null,
        produtos: [] as ProdutoData[],
        banners: [] as BannerData[],
        categorias: [] as CategoryData[],
        infoBarItems: [] as InfoBarItem[],
        isLoading: true,
        error: null as string | null,
    });
    
    const supabase = createClientComponentClient();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, error } = await supabase
                    .from('lojas')
                    .select(`*, temas (caminho_componente)`)
                    .eq('slug', lojaSlug)
                    .single();

                if (error || !data) {
                    throw new Error('Loja não encontrada ou erro na busca.');
                }

                const loja = data as any;
                const temaNome = (loja.temas?.caminho_componente || 'Padrao') as keyof typeof themes;
                const temaConfig = (loja.configuracoes_tema_json as ThemeConfig) || themes[temaNome] || themes.Padrao;

                const [produtosResult, bannersResult, categoriasResult] = await Promise.all([
                    supabase.from('produtos').select(`id, nome, descricao, preco, estoque, imagem_url, categoria_id`),
                    supabase.from('banners').select(`id, imagem_url, link_url, titulo, subtitulo, ordem`),
                    supabase.from('categorias').select(`id, nome, slug, imagem_url`),
                ]);

                const highlightsModule = temaConfig.homepage?.modules?.find((m): m is { type: 'highlights'; data: HighlightsModuleData; id: string } => m.type === 'highlights');
                const infoBarItems = highlightsModule?.data.highlightItems?.map((item: SingleHighlightItem) => ({
                    id: item.id,
                    icone: item.icon,
                    titulo: item.title,
                    descricao: item.subtitle,
                })) || [];

                setThemeData({
                    initialThemeConfig: temaConfig,
                    lojaData: loja,
                    produtos: (produtosResult.data || []) as ProdutoData[],
                    banners: (bannersResult.data || []) as BannerData[],
                    categorias: (categoriasResult.data || []) as CategoryData[],
                    infoBarItems: infoBarItems,
                    isLoading: false,
                    error: null,
                });
            } catch (err: any) {
                setThemeData(prev => ({ ...prev, isLoading: false, error: err.message }));
            }
        };

        if (lojaSlug) {
            fetchData();
        } else {
            setThemeData(prev => ({ ...prev, isLoading: false, error: 'Slug da loja não encontrado.' }));
        }
    }, [lojaSlug, supabase]);

    if (themeData.isLoading) {
        return <div className="p-4 text-center">Carregando loja...</div>;
    }

    if (themeData.error) {
        return <div className="p-4 text-center text-red-500">Erro: {themeData.error}</div>;
    }

    if (!themeData.lojaData) {
        return <div className="p-4 text-center">Loja não encontrada.</div>;
    }
    
    return (
        <ThemeProvider
            lojaSlug={lojaSlug}
            initialThemeConfig={themeData.initialThemeConfig}
            lojaData={themeData.lojaData}
            produtos={themeData.produtos}
            banners={themeData.banners}
            categorias={themeData.categorias}
            infoBarItems={themeData.infoBarItems}
            isIframeHost={false}
        >
            <HomePageContent />
        </ThemeProvider>
    );
}