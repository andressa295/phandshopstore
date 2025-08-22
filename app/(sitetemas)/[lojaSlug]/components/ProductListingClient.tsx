// app/(sitetemas)/[lojaSlug]/components/ProductListingClient.tsx
'use client';

import React, { useEffect } from 'react';
import ProductCard from './ProductCard';
import Header from './Header';
import Footer from './Footer';
import BannerSlider from './BannerSlider';
import TopInfoBar from './TopInfoBar';
import BenefitInfoBar from './BenefitInfoBar';
import TestimonialsSection from './TestimonialsSection'; // Importar TestimonialsSection
import MiniBannerSection from './MiniBannerSection';     // Importar MiniBannerSection
import NewsletterSection from './NewsletterSection';     // Importar NewsletterSection
import TextWithImageSection from './TextWithImageSection'; // Importar TextWithImageSection


// Interfaces para as props recebidas do Server Component
interface LojaData {
    id: string;
    nome_loja: string;
    slug: string;
    theme_id: string | null;
    configuracoes_tema_json: {
        cores?: {
            primaria?: string;
            secundaria?: string;
            texto?: string;
            fundo?: string;
        };
        fontes?: {
            principal?: string;
            titulos?: string;
        };
        botoes?: {
            arredondamento?: string;
            sombra?: boolean;
        };
        info_bar_items?: any[]; // Propriedade que vem do JSONB
        // Adicione outras seções configuráveis aqui, se necessário
        testimonials_data?: any[];
        mini_banners_data?: any[];
        newsletter_data?: { title?: string; subtitle?: string; };
        text_with_image_data?: { 
            title?: string; 
            subtitle?: string; 
            contentHtml: string; 
            images: any[]; 
            imagePosition?: 'left' | 'right' | 'top' | 'bottom'; 
            callToActionText?: string; 
            callToActionLink?: string; 
        };
    };
    top_info_bar_text: string | null;
    top_info_bar_link: string | null;
    top_info_bar_active: boolean;
    track_order_link_active: boolean;
    support_link_active: boolean;
    lojaLogoUrl?: string | null; // Adicionado para passar para o Header
}

interface ProdutoData {
    id: string;
    nome: string;
    descricao: string | null;
    preco: number;
    estoque: number;
    imagem_url: string | null;
}

interface BannerData {
    id: string;
    imagem_url: string;
    link_url: string | null;
    titulo: string | null;
    subtitulo: string | null;
    ordem: number;
}

interface InfoBarItem {
    id: string;
    icone: string;
    titulo: string;
    descricao: string;
}

interface ProductListingClientProps {
    loja: LojaData;
    produtos: ProdutoData[];
    temaConfig: LojaData['configuracoes_tema_json']; // Recebe as configurações do tema, mas não as aplica diretamente aqui
    banners: BannerData[];
    infoBarItems: InfoBarItem[];
}

const ProductListingClient: React.FC<ProductListingClientProps> = ({
    loja,
    produtos,
    temaConfig, // Recebe as configurações do tema, mas não as aplica diretamente aqui
    banners,
    infoBarItems,
}) => {
    return (
        <div className="ph-loja-container">
            <TopInfoBar text={loja.top_info_bar_text} link={loja.top_info_bar_link} isActive={loja.top_info_bar_active} />

            <Header
                lojaNome={loja.nome_loja}
                topInfoBarText={loja.top_info_bar_text}
                topInfoBarLink={loja.top_info_bar_link}
                topInfoBarActive={loja.top_info_bar_active}
                trackOrderLinkActive={loja.track_order_link_active}
                supportLinkActive={loja.support_link_active}
                lojaLogoUrl={loja.lojaLogoUrl}
            />

            <main className="ph-main-content">
                <BannerSlider banners={banners} />
                <BenefitInfoBar items={infoBarItems} />

                {/* Seções adicionais para a página inicial - INTEGRADAS AQUI */}

                {temaConfig.mini_banners_data && temaConfig.mini_banners_data.length > 0 && (
                    <MiniBannerSection banners={temaConfig.mini_banners_data} sectionTitle="Nossas Categorias em Destaque" />
                )}

                <h1 className="ph-page-title">Produtos da {loja.nome_loja}</h1>
                <p className="ph-page-subtitle">Descubra nossos itens mais recentes e populares.</p>

                {produtos.length === 0 ? (
                    <p className="ph-no-products-message">Nenhum produto encontrado nesta loja.</p>
                ) : (
                    <div className="ph-products-grid">
                        {produtos.map((produto) => (
                            <ProductCard key={produto.id} produto={produto} />
                        ))}
                    </div>
                )}

                {temaConfig.testimonials_data && temaConfig.testimonials_data.length > 0 && (
                    <TestimonialsSection testimonials={temaConfig.testimonials_data} sectionTitle="O que nossos clientes dizem" />
                )}

                {temaConfig.text_with_image_data && (
                    <TextWithImageSection 
                        title={temaConfig.text_with_image_data.title || undefined}
                        subtitle={temaConfig.text_with_image_data.subtitle || undefined}
                        contentHtml={temaConfig.text_with_image_data.contentHtml}
                        images={temaConfig.text_with_image_data.images || []}
                        imagePosition={temaConfig.text_with_image_data.imagePosition || undefined}
                        callToActionText={temaConfig.text_with_image_data.callToActionText || undefined}
                        callToActionLink={temaConfig.text_with_image_data.callToActionLink || undefined}
                    />
                )}
                
                {temaConfig.newsletter_data && (
                    <NewsletterSection 
                        sectionTitle={temaConfig.newsletter_data.title || undefined} 
                        sectionSubtitle={temaConfig.newsletter_data.subtitle || undefined} 
                    />
                )}
            </main>

            <Footer lojaNome={loja.nome_loja} />
        </div>
    );
};

export default ProductListingClient;
