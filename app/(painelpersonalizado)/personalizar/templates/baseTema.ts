// personalizar/templates/baseTema.ts (ATUALIZADO: TODOS OS TIPOS DE MÓDULOS DE HOME PAGE INCLUÍDOS)
import { Tema } from '../components/EditorContext'; // Caminho para a interface Tema

export const baseTema: Tema = {
    cores: {
        primaria: '#007bff',
        secundaria: '#6c757d',
        destaque: '#28a745',
        fundo: '#ffffff',
        texto: '#212529',
        headerBg: '#ffffff',
        headerText: '#212529',
        footerBg: '#343a40',
        footerText: '#ffffff',
        buttonBg: '#007bff',
    },
    tipografia: {
        titulo: 'Poppins, sans-serif',
        tituloPeso: 'bold',
        tituloTamanho: '2rem',
        texto: 'Poppins, sans-serif',
        textoPeso: 'normal',
        textoTamanho: '1rem',
    },
    usarBordasArredondadas: true,
    formatoBotoes: 'redondo',
    logoUrl: 'https://placehold.co/120x40/007bff/FFFFFF/png?text=SUA+LOJA',
    tamanhoLogo: 'medio',
    posicaoLogoMobile: 'centralizado',
    estiloCabecalhoMobile: 'menuBuscadorCarrinho',
    posicaoLogoDesktop: 'centralizado',
    estiloIconesDesktop: 'pequeno',
    mostrarBarraAnuncio: true,
    mensagemBarraAnuncio: 'FRETE GRÁTIS ACIMA DE R$199! COMPRE AGORA!',
    linkBarraAnuncio: '#',
    quantidadeProdutosPorLinha: '1_cel_3_comp',
    compraRapidaAtiva: true,
    mostrarVariacoesCor: true,
    mostrarSegundaFotoHover: true,
    exibirCarrosselFotos: false,
    mostrarParcelasListaProdutos: true,
    detalhesProduto_mostrarCalculadoraFrete: true,
    detalhesProduto_mostrarLojasFisicas: false,
    detalhesProduto_mostrarParcelas: true,
    detalhesProduto_mostrarEconomiaPromocional: true,
    detalhesProduto_descontoPagamentoVisivel: false,
    detalhesProduto_variacoesBotao: true,
    detalhesProduto_variacaoCorFotoBotao: true,
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
    // === HOME PAGE MODULES: DEFININDO UMA BASE PADRÃO COM EXEMPLOS PARA CADA TIPO ===
    // Isso garante que todos os tipos de módulos existam por padrão.
    homePageModules: [
        {
            id: 'default_banner_principal',
            label: 'Banner Principal',
            icon: 'MdImage',
            type: 'banner',
            isVisible: true,
            config: {
                title: 'Coleção Exclusiva',
                bannerLayoutType: 'full_width',
                banners: [{
                    id: 'b1_default',
                    imageUrlDesktop: 'https://placehold.co/1200x300/a32a6a/FFFFFF?text=BANNER+PRINCIPAL+Desktop',
                    imageUrlMobile: 'https://placehold.co/600x200/a32a6a/FFFFFF?text=BANNER+PRINCIPAL+Mobile',
                    linkUrl: '#',
                    altText: 'Banner Principal da Loja',
                    title: 'Nova Coleção',
                    description: 'Descubra peças únicas e sofisticadas!',
                    buttonText: 'Compre Agora'
                }]
            }
        },
        {
            id: 'default_secao_produtos',
            label: 'Seção de Produtos Destacados',
            icon: 'FaBoxOpen', // Usando um ícone FaBoxOpen para o preview
            type: 'product_section',
            isVisible: true,
            config: {
                title: 'Nossos Produtos Mais Vendidos',
                productIds: ['prod1', 'prod2', 'prod3', 'prod4'] // IDs de produtos de exemplo
            }
        },
        {
            id: 'default_grid_categorias',
            label: 'Grid de Categorias',
            icon: 'MdViewCarousel',
            type: 'category_grid',
            isVisible: true,
            config: {
                title: 'Explore Nossas Categorias',
                categoryImages: [
                    { id: 'cat_anel', name: 'Anéis', imageUrl: 'https://placehold.co/150x150/845EC2/FFFFFF?text=Anéis', link: '#' },
                    { id: 'cat_colar', name: 'Colares', imageUrl: 'https://placehold.co/150x150/D65DB1/FFFFFF?text=Colares', link: '#' },
                    { id: 'cat_brinco', name: 'Brincos', imageUrl: 'https://placehold.co/150x150/FFC72C/FFFFFF?text=Brincos', link: '#' },
                    { id: 'cat_pulseira', name: 'Pulseiras', imageUrl: 'https://placehold.co/150x150/B8F2E6/555555?text=Pulseiras', link: '#' },
                ]
            }
        },
        {
            id: 'default_texto_institucional',
            label: 'Texto Institucional',
            icon: 'MdMessage',
            type: 'text',
            isVisible: true,
            config: {
                title: 'Bem-vindo à Sua Loja',
                text: 'Com anos de experiência no mercado, oferecemos joias de alta qualidade e design exclusivo. Nossa paixão é eternizar momentos especiais com peças que contam histórias.'
            }
        },
        {
            id: 'default_newsletter',
            label: 'Newsletter',
            icon: 'MdMail',
            type: 'newsletter',
            isVisible: true,
            config: {
                title: 'Receba Nossas Novidades!',
            }
        },
        {
            id: 'default_info_bar',
            label: 'Barra de Informações',
            icon: 'MdSettingsApplications',
            type: 'info',
            isVisible: true,
            config: {
                title: 'Por Que Comprar Conosco?',
                infoItems: [
                    { id: 'info1', iconType: 'seguranca', title: 'Compra Segura', description: 'Seus dados protegidos por criptografia.', isVisible: true },
                    { id: 'info2', iconType: 'trocasDevolucoes', title: 'Troca Fácil', description: 'Descomplicada em até 7 dias.', isVisible: true },
                    { id: 'info3', iconType: 'entregas', title: 'Entrega Rápida', description: 'Receba em todo Brasil com agilidade.', isVisible: true },
                    { id: 'info4', iconType: 'whatsapp', title: 'Atendimento Personalizado', description: 'Via WhatsApp para todas as suas dúvidas.', isVisible: true },
                ]
            }
        },
        {
            id: 'default_youtube_video',
            label: 'Vídeo do YouTube',
            icon: 'FaYoutube',
            type: 'youtube_video',
            isVisible: true,
            config: {
                title: 'Conheça Nossa Última Coleção',
                videos: [{
                    id: 'v1_default',
                    youtubeId: 'dQw4w9WgXcQ', // Exemplo: Rick Astley - Never Gonna Give You Up
                    title: 'Vídeo de Destaque da Coleção',
                    description: 'Assista ao vídeo da nossa campanha mais recente.',
                    autoplay: false,
                    loop: false
                }]
            }
        },
        {
            id: 'default_testimonials',
            label: 'Depoimentos de Clientes',
            icon: 'FaCommentAlt',
            type: 'testimonials',
            isVisible: true,
            config: {
                title: 'O Que Nossos Clientes Dizem',
                testimonials: [
                    { id: 't1_default', text: 'Adorei a qualidade e o atendimento! Recomendo a todos.', author: 'Maria S.', rating: 5, avatarUrl: 'https://placehold.co/50x50/cccccc/444444?text=MS' },
                    { id: 't2_default', text: 'Peças incríveis e entrega super rápida. Cliente fiel agora!', author: 'João P.', rating: 5, avatarUrl: 'https://placehold.co/50x50/cccccc/444444?text=JP' },
                ]
            }
        },
        // Módulo de Highlight Banners (se você ainda o utiliza) - adicione o componente de renderização no Preview.tsx
        {
            id: 'default_highlight_banners',
            label: 'Banners de Destaque',
            icon: 'MdImage', // Ou um ícone mais específico
            type: 'highlight_banners',
            isVisible: true,
            config: {
                title: 'Promoções Imperdíveis',
                highlightBanners: [ // Propriedade correta para este tipo de módulo
                    { id: 'hb1', imageUrl: 'https://placehold.co/400x200/FF00FF/FFFFFF?text=Destaque+1', link: '#' },
                    { id: 'hb2', imageUrl: 'https://placehold.co/400x200/00FFFF/FFFFFF?text=Destaque+2', link: '#' },
                ]
            }
        },
    ],
};