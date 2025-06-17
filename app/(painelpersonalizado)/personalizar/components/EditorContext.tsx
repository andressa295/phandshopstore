'use client'; 

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Interfaces de Tema
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

export interface HomePageModule {
    id: string;
    label: string;
    fullLabel?: string; 
    icon: string; // <-- AGORA É STRING (para referenciar o ícone, ex: 'MdImage', 'FaStar')
    type: 'banner' | 'product_list' | 'text' | 'social' | 'newsletter' | 'info' | 'product_section' | 'category_grid'; // Adicionado 'category_grid'
    isVisible: boolean; 
    config?: {
        title?: string; // Título do módulo agora opcional
        layout?: 'grid' | 'carousel';
        productIds?: string[];
        categoryImages?: {id: string; name: string; imageUrl: string; link: string}[]; // Para category_grid
        text?: string; // Para módulos de texto (ex: Mensagem de Boas Vindas)
    }
}

export interface Tema {
    cores: CoresTema;
    tipografia: TipografiaTema;
    layoutTipo?: 'grid' | 'carrossel';
    produtosPorLinha?: number;
    cardBorda?: string;
    cardSombra?: string;
    bannerDesktopUrl?: string;
    bannerMobileUrl?: string; 
    bannerLink?: string;
    bannerTitulo?: string;
    bannerAltText?: string;
    depoimentos?: { texto: string; nome: string; avatar: string }[];
    newsletterTexto?: string;
    newsletterPlaceholder?: string;
    newsletterSucesso?: string;
    redesSociaisLinks?: { instagram?: string; whatsapp?: string; facebook?: string };
    rodapeTextoFinal?: string;
    
    // PROPRIEDADES DE DESIGN GERAIS
    usarBordasArredondadas?: boolean;
    formatoBotoes?: 'quadrado' | 'oval' | 'redondo'; 
    
    // PROPRIEDADES DE LOGO E CABEÇALHO
    logoUrl?: string;
    tamanhoLogo?: 'pequeno' | 'medio' | 'grande';
    posicaoLogoMobile?: 'esquerda' | 'centralizado';
    estiloCabecalhoMobile?: 'menuBuscadorCarrinho' | 'barraHorizontalCategorias' | 'barraPesquisaGrande';
    posicaoLogoDesktop?: 'esquerda' | 'centralizado';
    estiloIconesDesktop?: 'grande' | 'pequeno';

    // PROPRIEDADES DA BARRA DE ANÚNCIO
    mostrarBarraAnuncio?: boolean;
    mensagemBarraAnuncio?: string;
    linkBarraAnuncio?: string;

    // PROPRIEDADES PARA "LISTA DE PRODUTOS"
    quantidadeProdutosPorLinha?: '1_cel_3_comp' | '2_cel_4_comp';
    compraRapidaAtiva?: boolean;
    mostrarVariacoesCor?: boolean;
    mostrarSegundaFotoHover?: boolean;
    exibirCarrosselFotos?: boolean;
    mostrarParcelasListaProdutos?: boolean;

    // NOVAS PROPRIEDADES PARA "DETALHE DO PRODUTO"
    detalhesProduto_mostrarCalculadoraFrete?: boolean;
    detalhesProduto_mostrarLojasFisicas?: boolean;
    detalhesProduto_mostrarParcelas?: boolean;
    detalhesProduto_mostrarEconomiaPromocional?: boolean;
    detalhesProduto_descontoPagamentoVisivel?: boolean;
    detalhesProduto_variacoesBotao?: boolean;
    detalhesProduto_variacaoCorFotoBotao?: boolean;
    detalhesProduto_linkGuiaMedida?: string;
    detalhesProduto_mostrarEstoque?: boolean;
    detalhesProduto_mostrarUltimasUnidades?: boolean;
    detalhesProduto_limiteUltimasUnidades?: number;
    detalhesProduto_mensagemUltimaUnidade?: string;
    detalhesProduto_tituloProdutosRelacionados?: string;
    detalhesProduto_tituloProdutosComplementares?: string;

    // NOVAS PROPRIEDADES PARA "CARRINHO DE COMPRAS"
    carrinho_mostrarBotaoVerMaisProdutos?: boolean;
    carrinho_valorMinimoCompra?: number;
    carrinho_compraRapidaAtiva?: boolean;
    carrinho_sugerirProdutosComplementares?: boolean;
    carrinho_mostrarCalculadoraFrete?: boolean;
    carrinho_mostrarLojasFisicas?: boolean;

    // NOVAS PROPRIEDADES PARA "RODAPÉ DA PÁGINA"
    rodape_usarCoresPersonalizadas?: boolean;
    rodape_fundo?: string;
    rodape_textoIcones?: string;
    rodape_exibirMenu?: boolean;
    rodape_mostrarDadosContato?: boolean;
    rodape_tituloDadosContato?: string;
    rodape_tituloRedesSociais?: string;
    rodape_mostrarOpcoesFrete?: boolean;
    rodape_mostrarOpcoesPagamento?: boolean;
    rodape_seloImagemUrl?: string;
    rodape_seloHtmlCode?: string;

    // NOVA PROPRIEDADE PARA "EDIÇÃO DE CSS AVANÇADA"
    advancedCss?: string;

    // Informações sobre a compra (até 3 tipos)
    detalhesProduto_infoCompra_mostrar1?: boolean;
    detalhesProduto_infoCompra_tipoIcone1?: 'imagemPropria' | 'seguranca' | 'trocasDevolucoes' | 'entregas' | 'dinheiro' | 'cartaoCredito' | 'promocoes' | 'whatsapp';
    detalhesProduto_infoCompra_uploadIcone1?: string; 
    detalhesProduto_infoCompra_titulo1?: string; 
    detalhesProduto_infoCompra_descricao1?: string; 
    detalhesProduto_infoCompra_mostrar2?: boolean;
    detalhesProduto_infoCompra_tipoIcone2?: 'imagemPropria' | 'seguranca' | 'trocasDevolucoes' | 'entregas' | 'dinheiro' | 'cartaoCredito' | 'promocoes' | 'whatsapp';
    detalhesProduto_infoCompra_uploadIcone2?: string;
    detalhesProduto_infoCompra_titulo2?: string; 
    detalhesProduto_infoCompra_descricao2?: string; 
    detalhesProduto_infoCompra_mostrar3?: boolean;
    detalhesProduto_infoCompra_tipoIcone3?: 'imagemPropria' | 'seguranca' | 'trocasDevolucoes' | 'entregas' | 'dinheiro' | 'cartaoCredito' | 'promocoes' | 'whatsapp';
    detalhesProduto_infoCompra_uploadIcone3?: string;
    detalhesProduto_infoCompra_titulo3?: string; 
    detalhesProduto_infoCompra_descricao3?: string; 

    // Propriedade para controlar módulos da homepage (AGORA É OBRIGATÓRIA E INICIALIZADA)
    homePageModules: HomePageModule[];
}

// Valores iniciais do tema padrão NEUTRO e PROFISSIONAL
export const initialTema: Tema = {
    // Cores: Neutras e Profissionais
    cores: {
        primaria: '#007bff',       // Azul padrão para ações
        secundaria: '#6c757d',     // Cinza médio para elementos secundários
        destaque: '#28a745',       // Verde para promoções/sucesso
        fundo: '#ffffff',          // Branco puro para o fundo
        texto: '#212529',          // Preto suave para texto
        headerBg: '#ffffff',       // Branco para fundo do cabeçalho
        headerText: '#212529',     // Texto escuro para cabeçalho
        footerBg: '#343a40',       // Cinza escuro para fundo do rodapé
        footerText: '#ffffff',     // Texto branco para rodapé
    },
    // Tipografia: Poppins como fonte principal para tudo
    tipografia: {
        titulo: 'Poppins, sans-serif',
        tituloPeso: 'bold',
        tituloTamanho: '2rem', 
        texto: 'Poppins, sans-serif',
        textoPeso: 'normal',
        textoTamanho: '1rem', 
    },
    // Propriedades de design gerais (AJUSTADAS PARA UM VISUAL MAIS MODERNO E AMIGÁVEL)
    usarBordasArredondadas: true, // <-- Alterado para true para um visual mais suave
    formatoBotoes: 'redondo',    // <-- Alterado para 'redondo' para botões com bordas arredondadas (8px)
    
    // PROPRIEDADES DE LOGO E CABEÇALHO
    logoUrl: 'https://placehold.co/120x40/007bff/FFFFFF/png?text=SUA+LOJA', // Logo padrão com cor primária de fundo
    tamanhoLogo: 'medio',
    posicaoLogoMobile: 'centralizado',
    estiloCabecalhoMobile: 'menuBuscadorCarrinho',
    posicaoLogoDesktop: 'centralizado',
    estiloIconesDesktop: 'pequeno', 

    // PROPRIEDADES DA BARRA DE ANÚNCIO
    mostrarBarraAnuncio: false,
    mensagemBarraAnuncio: 'Frete Grátis acima de R$199!',
    linkBarraAnuncio: '#',
    
    // VALORES INICIAIS PARA "LISTA DE PRODUTOS"
    quantidadeProdutosPorLinha: '1_cel_3_comp', // <-- Alterado para 3 produtos por linha no desktop (mais clean)
    compraRapidaAtiva: true,
    mostrarVariacoesCor: true,
    mostrarSegundaFotoHover: true,
    exibirCarrosselFotos: false,
    mostrarParcelasListaProdutos: true,

    // NOVOS VALORES INICIAIS PARA "DETALHE DO PRODUTO"
    detalhesProduto_mostrarCalculadoraFrete: true,
    detalhesProduto_mostrarLojasFisicas: false,
    detalhesProduto_mostrarParcelas: true,
    detalhesProduto_mostrarEconomiaPromocional: true,
    detalhesProduto_descontoPagamentoVisivel: false,
    detalhesProduto_variacoesBotao: true,
    detalhesProduto_variacaoCorFotoBotao: false,
    detalhesProduto_linkGuiaMedida: '',
    detalhesProduto_mostrarEstoque: true,
    detalhesProduto_mostrarUltimasUnidades: true,
    detalhesProduto_limiteUltimasUnidades: 5,
    detalhesProduto_mensagemUltimaUnidade: 'Atenção: Última peça!',
    detalhesProduto_tituloProdutosRelacionados: 'Produtos Similares',
    detalhesProduto_tituloProdutosComplementares: 'Compre com este produto',

    carrinho_mostrarBotaoVerMaisProdutos: true,
    carrinho_valorMinimoCompra: 0,
    carrinho_compraRapidaAtiva: true,
    carrinho_sugerirProdutosComplementares: true,
    carrinho_mostrarCalculadoraFrete: true,
    carrinho_mostrarLojasFisicas: false,

    rodape_usarCoresPersonalizadas: false, 
    rodape_fundo: '#343a40', 
    rodape_textoIcones: '#ffffff',
    rodape_exibirMenu: true,
    rodape_mostrarDadosContato: true,
    rodape_tituloDadosContato: 'Fale Conosco',
    rodape_tituloRedesSociais: 'Siga-nos',
    rodape_mostrarOpcoesFrete: true,
    rodape_mostrarOpcoesPagamento: true,
    rodape_seloImagemUrl: '', 
    rodape_seloHtmlCode: '',

    advancedCss: '',

    detalhesProduto_infoCompra_mostrar1: true,
    detalhesProduto_infoCompra_tipoIcone1: 'seguranca',
    detalhesProduto_infoCompra_uploadIcone1: '',
    detalhesProduto_infoCompra_titulo1: 'Pagamento Seguro', 
    detalhesProduto_infoCompra_descricao1: 'Transações seguras com criptografia de ponta.', 
    detalhesProduto_infoCompra_mostrar2: true,
    detalhesProduto_infoCompra_tipoIcone2: 'trocasDevolucoes',
    detalhesProduto_infoCompra_uploadIcone2: '',
    detalhesProduto_infoCompra_titulo2: 'Trocas e Devoluções', 
    detalhesProduto_infoCompra_descricao2: 'Fácil troca em até 30 dias para sua satisfação.', 
    detalhesProduto_infoCompra_mostrar3: false, 
    detalhesProduto_infoCompra_tipoIcone3: 'entregas',
    detalhesProduto_infoCompra_uploadIcone3: '',
    detalhesProduto_infoCompra_titulo3: '', 
    detalhesProduto_infoCompra_descricao3: '', 

    // Módulos da homepage padrão
    homePageModules: [
        { id: 'banners_rotativos', label: 'Banners Rotativos', icon: 'MdImage', type: 'banner', isVisible: true, config: { title: 'Destaque Principal' } },
        { id: 'produtos_destaque_1', label: 'Produtos em Destaque', icon: 'FaStar', type: 'product_section', isVisible: true, config: { title: 'Nossos Produtos em Destaque', layout: 'grid', productIds: [] } },
        { id: 'categorias_grid', label: 'Compre por Categoria', icon: 'MdViewCarousel', type: 'category_grid', isVisible: true, config: { title: 'Explore Nossas Categorias', categoryImages: [
            { id: 'cat1', name: 'Roupas', imageUrl: 'https://placehold.co/150x150/e0e0e0/666666/png?text=Roupas', link: '#' },
            { id: 'cat2', name: 'Acessórios', imageUrl: 'https://placehold.co/150x150/e0e0e0/666666/png?text=Acessórios', link: '#' }, 
            { id: 'cat3', name: 'Calçados', imageUrl: 'https://placehold.co/150x150/e0e0e0/666666/png?text=Calçados', link: '#' }, 
            { id: 'cat4', name: 'Eletrônicos', imageUrl: 'https://placehold.co/150x150/e0e0e0/666666/png?text=Eletrônicos', link: '#' } 
        ]} },
        { id: 'produtos_novos', label: 'Últimos Lançamentos', icon: 'FaBoxOpen', type: 'product_section', isVisible: true, config: { title: 'Novidades na Loja', layout: 'carousel', productIds: [] } },
        { id: 'mensagem_boas_vindas', label: 'Mensagem de Boas Vindas', icon: 'MdMessage', type: 'text', isVisible: true, config: { title: 'Bem-vindo(a) à nossa loja!', text: 'Descubra a melhor experiência de compra online.' } },
        { id: 'newsletter_module', label: 'Newsletter', icon: 'MdMail', type: 'newsletter', isVisible: true, config: { title: 'Assine nossa Newsletter!' } }, 
        { id: 'info_frete_pag_seg', label: 'Informações da Loja', icon: 'MdSettingsApplications', type: 'info', isVisible: true, config: { title: 'Informações Importantes' } },
    ],
};

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
    const [tema, setTema] = useState<Tema>(initialTema);

    const saveTheme = (theme: Tema) => {
        console.log("Tema salvo:", theme);
        alert("Tema salvo com sucesso! (Simulado)"); 
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