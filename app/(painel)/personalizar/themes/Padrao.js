"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Padrao = void 0;
var uuid_1 = require("uuid");
var generateUniqueId = function () { return (0, uuid_1.v4)(); };
exports.Padrao = {
    // --- Configurações Visuais Gerais ---
    primaryColor: '#333333',
    secondaryColor: '#A8A8A8',
    textColor: '#444444',
    primaryFont: 'Roboto',
    secondaryFont: 'Open Sans',
    titleBaseFontSize: 'large',
    textBaseFontSize: 'medium',
    // --- Configurações do Cabeçalho ---
    headerTitle: 'Sua Loja Padrão',
    fixedHeader: true,
    headerBackgroundColor: '#ffffff',
    headerTextColor: '#333333',
    headerSettings: {
        logoUrl: 'https://via.placeholder.com/150x50?text=Minha+Loja',
        logoSize: 'medium',
        iconSize: 'medium',
        desktopSearch: 'bar',
        mobileSearch: 'icon',
        showAnnouncementBar: true,
        announcementText: 'Frete Grátis para todo Brasil em compras acima de R$199!',
        announcementLink: '/ofertas',
        announcementMarquee: true,
        useCustomHeaderColors: false,
        announcementBackgroundColor: '#444444',
        announcementTextColor: '#ffffff',
        searchBarBackgroundColor: '#f8f8f8',
        trackOrderLinkActive: true,
        supportLinkActive: true,
    },
    // --- Módulos da Homepage (Layout Padrão) ---
    homepage: {
        modules: [
            // Módulo de Banner
            {
                id: generateUniqueId(),
                type: 'banner',
                data: {
                    title: 'Destaque da Página Inicial',
                    subtitle: 'Carrossel de banners personalizáveis.',
                    layout: 'carousel',
                    autoplay: true,
                    interval: 5,
                    isActive: true,
                    banners: [
                        { id: (0, uuid_1.v4)(), desktopImageUrl: 'https://via.placeholder.com/1920x600?text=Banner+Padr%C3%A3o', mobileImageUrl: 'https://via.placeholder.co/600x800?text=Banner+Padr%C3%A3o+Mobile', title: 'Descubra a Nova Coleção!', subtitle: 'Estilo e qualidade que você merece.', buttonText: 'Explorar Agora', buttonLink: '/novidades', overlayColor: '#000000', overlayOpacity: 0.3, isActive: true },
                    ],
                },
            },
            // Módulo de Mini-Banners
            {
                id: generateUniqueId(),
                type: 'mini_banners',
                data: {
                    isActive: true,
                    banners: [
                        { id: (0, uuid_1.v4)(), imageUrl: 'https://via.placeholder.com/600x300?text=Mini+Banner+1', link: '/oferta-1' },
                        { id: (0, uuid_1.v4)(), imageUrl: 'https://via.placeholder.com/600x300?text=Mini+Banner+2', link: '/oferta-2' },
                    ]
                }
            },
            // Módulo de Vitrine de Produtos
            {
                id: generateUniqueId(),
                type: 'product_showcase',
                data: {
                    title: 'Produtos em Destaque',
                    subtitle: 'Seções de produtos personalizadas.',
                    isActive: true,
                    showcases: [{ id: (0, uuid_1.v4)(), title: 'Mais Vendidos', displayType: 'best_sellers', numberOfProducts: 8, isActive: true }],
                },
            },
            // Módulo de Texto com Imagem
            {
                id: generateUniqueId(),
                type: 'text_image',
                data: { title: 'Sobre Nossa Marca', text: 'Conheça um pouco da nossa história e dos valores que nos movem.', imageUrl: 'https://via.placeholder.com/600x400?text=Texto+Imagem', imagePosition: 'left', buttonText: 'Saiba Mais', buttonLink: '/sobre', isActive: true },
            },
            // Módulo de Destaques/InfoBar
            {
                id: generateUniqueId(),
                type: 'highlights',
                data: {
                    title: 'Por que Escolher a gente?',
                    subtitle: 'Conheça nossos diferenciais e benefícios.',
                    isActive: true,
                    highlightItems: [
                        { id: (0, uuid_1.v4)(), icon: 'MdLocalShipping', title: 'Frete Rápido', subtitle: 'Em todo o Brasil', isActive: true },
                        { id: (0, uuid_1.v4)(), icon: 'MdCreditCard', title: 'Até 12x Sem Juros', subtitle: 'Pague com tranquilidade', isActive: true },
                        { id: (0, uuid_1.v4)(), icon: 'MdSecurity', title: 'Compra Segura', subtitle: 'Seus dados protegidos', isActive: true },
                    ],
                    layout: 'icons-text',
                },
            },
            // Módulo de Newsletter
            {
                id: generateUniqueId(),
                type: 'newsletter',
                data: {
                    isActive: true,
                    title: 'Assine nossa Newsletter!',
                    subtitle: 'Receba ofertas e novidades exclusivas.',
                    buttonText: 'Inscrever-se'
                }
            }
        ],
        categoriesData: [],
        productsData: [],
    },
    productDetail: { galleryLayout: 'carousel', showPrice: true, showSku: true, showStock: true, enableQuantitySelector: true, showVariations: true, showProductDescription: true, showAdditionalInfoTabs: true, showReviewsSection: true, showRelatedProducts: true, relatedProductsTitle: 'Quem viu este, também gostou:', showTrustBadges: false, trustBadgesImages: [], imagePosition: 'side-gallery' },
    productList: { layout: 'grid', gridColumns: 3, showProductImage: true, showProductName: true, showProductPrice: true, showProductDescriptionSnippet: false, showAddToCartButton: true, showQuickViewButton: true, enableFilters: true, enableSorting: true, productsPerPage: 12, showPagination: true, addToCartButtonColor: '#333333' },
    cart: { enableWholesaleMinOrder: false, minWholesaleOrderValue: null, showShippingEstimator: true, showCouponField: true, showCartNotes: false, showCrossSellProducts: true, crossSellTitle: 'Adicione também:', checkoutButtonText: 'Finalizar Compra' },
    footer: { showQuickLinks: true, quickLinksTitle: 'Institucional', quickLinks: [], showSocialMediaIcons: true, socialMediaTitle: 'Siga-nos nas Redes Sociais', socialMediaLinks: [], showNewsletterSignup: true, newsletterTitle: 'Newsletter', newsletterSubtitle: 'Inscreva-se!', showContactInfo: true, contactAddress: 'Rua da Amostra, 123', contactPhone: '(XX) XXXX-XXXX', contactEmail: 'contato@seusite.com.br', showPaymentMethods: true, paymentMethodsImages: [], showCopyright: true, copyrightText: "\u00A9 ".concat(new Date().getFullYear(), " Sua Loja Padr\u00E3o."), showCnpj: false, cnpjText: 'CNPJ: XX.XXX.XXX/XXXX-XX', footerBackgroundColor: '#212529', footerTextColor: '#f8f9fa' },
    design: { buttonBorderRadius: 'rounded', buttonHoverAnimation: 'scale', buttonVariant: 'filled', cartIcon: 'shopping_bag_outlined', showCartIconText: true, cartIconTextColor: '#333333', imageBorderRadius: 'rounded', imageHoverEffect: 'zoom', enableShadows: true, shadowStyle: 'medium', enableCustomScrollbar: true, scrollbarColor: '#333333', enableHoverEffects: true, enableClickAnimations: true },
    advanced: { customCss: "/* Adicione seu CSS personalizado aqui */", customJs: "/* Adicione seu JavaScript personalizado aqui */", faviconUrl: '/favicon.ico', enableLazyLoading: true, enableCodeMinification: true },
};
exports.default = exports.Padrao;
