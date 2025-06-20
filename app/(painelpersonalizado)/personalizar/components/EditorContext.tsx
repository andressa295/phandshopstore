// app\(painelpersonalizado)\personalizar\components\EditorContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { TEMPLATES } from '../../personalizar/templates';

export interface CoresTema {
    primaria: string;
    secundaria: string;
    destaque: string;
    fundo: string;
    texto: string;
    headerBg: string;
    headerText: string;
    footerBg: string;
    footerText: string;
    buttonBg?: string;
}

export interface TipografiaTema {
    titulo: string;
    tituloPeso: string;
    tituloTamanho: string;
    texto: string;
    textoPeso: string;
    textoTamanho: string;
}

export interface BannerItem {
    id: string;
    imageUrlDesktop: string | null;
    imageUrlMobile: string | null;
    linkUrl: string;
    altText: string;
    title?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
}

export interface TestimonialItem {
    id: string;
    text: string;
    author: string;
    avatarUrl?: string | null;
    rating?: number;
}

export interface YoutubeVideoItem {
    id: string;
    youtubeId: string;
    title?: string;
    description?: string;
    autoplay?: boolean;
    loop?: boolean;
}

export interface InfoItem {
    id: string;
    iconType: 'imagemPropria' | 'seguranca' | 'trocasDevolucoes' | 'entregas' | 'dinheiro' | 'cartaoCredito' | 'promocoes' | 'whatsapp' | 'anelSolitario';
    imageUrl?: string | null;
    title: string;
    description: string;
    link?: string;
    isVisible: boolean;
}

export interface HomePageModuleConfig {
    title?: string;
    layout?: 'grid' | 'carousel';
    productIds?: string[];
    categoryImages?: {id: string; name: string; imageUrl: string; link: string}[];
    text?: string;
    banners?: BannerItem[];
    bannerLayoutType?: 'carousel' | 'grid_2x1' | 'grid_3x1' | 'diagonal_left' | 'diagonal_right' | 'full_width';
    videos?: YoutubeVideoItem[];
    testimonials?: TestimonialItem[];
    infoItems?: InfoItem[];
    highlightBanners?: { id: string; imageUrl: string; link: string; title?: string; description?: string; }[];
}

export interface HomePageModule {
    id: string;
    label: string;
    fullLabel?: string;
    icon: string;
    type: 'banner' | 'product_list' | 'text' | 'social' | 'newsletter' | 'info' | 'product_section' | 'category_grid' | 'highlight_banners' | 'youtube_video' | 'testimonials';
    isVisible: boolean;
    config?: HomePageModuleConfig
}

// ** INTERFACE TEMA COMPLETA (Crucial para que 'Velvete' seja um tema válido) **
export interface Tema {
    cores: CoresTema;
    tipografia: TipografiaTema;
    layoutTipo?: 'grid' | 'carrossel';
    produtosPorLinha?: number;
    cardBorda?: string;
    cardSombra?: string;
    depoimentos?: { texto: string; nome: string; avatar: string }[];
    newsletterTexto?: string;
    newsletterPlaceholder?: string;
    newsletterSucesso?: string;
    redesSociaisLinks?: { instagram?: string; whatsapp?: string; facebook?: string };
    rodapeTextoFinal?: string;
    usarBordasArredondadas?: boolean;
    formatoBotoes?: 'quadrado' | 'oval' | 'redondo';
    logoUrl?: string;
    tamanhoLogo?: 'pequeno' | 'medio' | 'grande';
    posicaoLogoMobile?: 'esquerda' | 'centralizado';
    estiloCabecalhoMobile?: 'menuBuscadorCarrinho' | 'barraHorizontalCategorias' | 'barraPesquisaGrande';
    posicaoLogoDesktop?: 'esquerda' | 'centralizado';
    estiloIconesDesktop?: 'grande' | 'pequeno';
    mostrarBarraAnuncio?: boolean;
    mensagemBarraAnuncio?: string;
    linkBarraAnuncio?: string;
    quantidadeProdutosPorLinha?: '1_cel_3_comp' | '2_cel_4_comp';
    compraRapidaAtiva?: boolean;
    mostrarVariacoesCor?: boolean;
    mostrarSegundaFotoHover?: boolean;
    exibirCarrosselFotos?: boolean;
    mostrarParcelasListaProdutos?: boolean;
    detalhesProduto_mostrarCalculadoraFrete: boolean;
    detalhesProduto_mostrarLojasFisicas: boolean;
    detalhesProduto_mostrarParcelas: boolean;
    detalhesProduto_mostrarEconomiaPromocional: boolean;
    detalhesProduto_descontoPagamentoVisivel: boolean;
    detalhesProduto_variacoesBotao: boolean;
    detalhesProduto_variacaoCorFotoBotao: boolean;
    detalhesProduto_linkGuiaMedida: string;
    detalhesProduto_mostrarEstoque: boolean;
    detalhesProduto_mostrarUltimasUnidades: boolean;
    detalhesProduto_limiteUltimasUnidades: number;
    detalhesProduto_mensagemUltimaUnidade: string;
    detalhesProduto_tituloProdutosRelacionados: string;
    detalhesProduto_tituloProdutosComplementares: string;
    carrinho_mostrarBotaoVerMaisProdutos: boolean;
    carrinho_valorMinimoCompra: number;
    carrinho_compraRapidaAtiva: boolean;
    carrinho_sugerirProdutosComplementares: boolean;
    carrinho_mostrarCalculadoraFrete: boolean;
    carrinho_mostrarLojasFisicas: boolean;
    rodape_usarCoresPersonalizadas: boolean;
    rodape_fundo: string;
    rodape_textoIcones: string;
    rodape_exibirMenu: boolean;
    rodape_mostrarDadosContato: boolean;
    rodape_tituloDadosContato: string;
    rodape_tituloRedesSociais: string;
    rodape_mostrarOpcoesFrete: boolean;
    rodape_mostrarOpcoesPagamento: boolean;
    rodape_seloImagemUrl: string;
    rodape_seloHtmlCode: string;
    advancedCss: string;
    homePageModules: HomePageModule[];
}

interface EditorContextType {
    tema: Tema;
    setTema: React.Dispatch<React.SetStateAction<Tema>>;
    saveTheme: (theme: Tema) => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

interface EditorProviderProps {
    children: ReactNode;
}

export const EditorProvider: React.FC<EditorProviderProps> = ({ children }) => {
    // É CRUCIAL que TEMPLATES['Velvete'] exista e não seja undefined.
    // O erro geralmente vem daqui se o arquivo de TEMPLATES não está correto.
    const [tema, setTema] = useState<Tema>(TEMPLATES['Velvete']);

    const saveTheme = (theme: Tema) => {
        console.log("Tema salvo:", theme);
        alert("Tema salvo com sucesso! (Simulado)");
        setTema(theme); // Atualiza o estado do tema após salvar
    };

    return (
        <EditorContext.Provider value={{ tema, setTema, saveTheme }}>
            {children}
        </EditorContext.Provider>
    );
};

export const useEditor = () => {
    const context = useContext(EditorContext);
    if (!context) {
        throw new Error('useEditor must be used within an EditorProvider');
    }
    return context;
};