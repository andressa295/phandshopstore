// app/(painel)/personalizar/themes/BaseTheme.ts
import { ThemeConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = () => uuidv4();

export const BaseTheme: ThemeConfig = {
    // --- Configurações Visuais Gerais ---
    name: 'Tema Padrão',
    primaryColor: '#333333',
    secondaryColor: '#A8A8A8',
    textColor: '#444444',
    primaryFont: 'Roboto',
    secondaryFont: 'Open Sans',
    titleBaseFontSize: 'medium',
    textBaseFontSize: 'medium',

    headerTitle: 'Sua Loja Padrão',
    fixedHeader: true,
    headerBackgroundColor: '#ffffff',
    headerTextColor: '#333333',
    navbarBackgroundColor: '#000000',
    navbarTextColor: '#ffffff',

    headerSettings: {
        logoUrl: 'https://via.placeholder.com/150x50?text=Minha+Loja',
        logoSize: 'medium',
        iconSize: 'medium',
        desktopSearch: 'bar',
        mobileSearch: 'icon',
        showAnnouncementBar: true,
        announcementText: ' Frete Grátis para todo Brasil em compras acima de R$199!',
        announcementLink: '/ofertas',
        announcementMarquee: true,
        useCustomHeaderColors: false,
        announcementBackgroundColor: '#444444',
        announcementTextColor: '#ffffff',
        searchBarBackgroundColor: '#f8f8f8',
        trackOrderLinkActive: true,
        supportLinkActive: true,
    },

    homepage: {
        modules: [
            // Módulo de Banner
            {
                id: generateUniqueId(),
                type: 'banner',
                data: {
                    title: 'Destaque da Página Inicial',
                    subtitle: 'Carrossel de banners personalizáveis.',
                    banners: [
                        { id: uuidv4(), desktopImageUrl: 'https://via.placeholder.com/1920x600?text=Banner+Padrao', mobileImageUrl: 'https://via.placeholder.com/600x800?text=Banner+Padrao+Mobile', title: 'Descubra a Nova Colecao!' },
                    ],
                    layout: 'carousel',
                    autoplay: true,
                    isActive: true,
                },
            },
            // Módulo de Mini-Banners
            {
                id: uuidv4(),
                type: 'mini_banners',
                data: {
                    isActive: true,
                    banners: [
                        { id: uuidv4(), imageUrl: 'https://via.placeholder.com/600x300?text=Mini+Banner+1', link: '/oferta-1' },
                        { id: uuidv4(), imageUrl: 'https://via.placeholder.com/600x300?text=Mini+Banner+2', link: '/oferta-2' },
                    ]
                }
            },
            // Módulo de Vitrine de Produtos
            {
                id: uuidv4(),
                type: 'product_showcase',
                data: {
                    title: 'Produtos em Destaque',
                    isActive: true,
                    showcases: [{ id: uuidv4(), title: 'Mais Vendidos', displayType: 'best_sellers', numberOfProducts: 8 }],
                },
            },
            // Módulo de Texto com Imagem
            {
                id: uuidv4(),
                type: 'text_image',
                data: {
                    title: 'Sobre Nossa Marca',
                    text: 'Conheça um pouco da nossa história e dos valores que nos movem.',
                    imageUrl: 'https://via.placeholder.com/600x400?text=Texto+Imagem',
                    imagePosition: 'left',
                    buttonText: 'Saiba Mais',
                    buttonLink: '/sobre',
                    isActive: true
                }
            },
            // Módulo de Destaques/InfoBar
            {
                id: uuidv4(),
                type: 'highlights',
                data: {
                    title: 'Por que Escolher a gente?',
                    subtitle: 'Conheça nossos diferenciais e benefícios.',
                    isActive: true,
                    highlightItems: [
                        { id: uuidv4(), icon: 'MdLocalShipping', title: 'Frete Rápido', subtitle: 'Em todo o Brasil', isActive: true },
                        { id: uuidv4(), icon: 'MdCreditCard', title: 'Até 12x Sem Juros', subtitle: 'Pague com tranquilidade', isActive: true },
                    ],
                    layout: 'icons-text',
                }
            },
            // Módulo de Newsletter
            {
                id: uuidv4(),
                type: 'newsletter',
                data: {
                    isActive: true,
                    title: 'Assine nossa Newsletter!',
                    subtitle: 'Receba ofertas e novidades exclusivas.',
                    buttonText: 'Inscrever-se'
                }
            },
        ],
    },

    productDetail: { galleryLayout: 'carousel', showPrice: true, showSku: true, showStock: true, enableQuantitySelector: true, showVariations: true, showProductDescription: true, showAdditionalInfoTabs: true, showReviewsSection: true, showRelatedProducts: true, relatedProductsTitle: 'Quem viu este, também gostou:', showTrustBadges: false, trustBadgesImages: [], imagePosition: 'side-gallery' },
    productList: { layout: 'grid', gridColumns: 3, showProductImage: true, showProductName: true, showProductPrice: true, showProductDescriptionSnippet: false, showAddToCartButton: true, showQuickViewButton: true, enableFilters: true, enableSorting: true, productsPerPage: 12, showPagination: true, addToCartButtonColor: '#333333' },
    cart: { enableWholesaleMinOrder: false, minWholesaleOrderValue: null, showShippingEstimator: true, showCouponField: true, showCartNotes: false, showCrossSellProducts: true, crossSellTitle: 'Adicione tambem:', checkoutButtonText: 'Finalizar Compra' },
    footer: { showQuickLinks: true, quickLinksTitle: 'Institucional', quickLinks: [], showSocialMediaIcons: true, socialMediaTitle: 'Siga-nos', socialMediaLinks: [], showNewsletterSignup: true, newsletterTitle: 'Newsletter', newsletterSubtitle: 'Inscreva-se!', showContactInfo: true, contactAddress: 'Rua da Amostra, 123', contactPhone: '(XX) XXXX-XXXX', contactEmail: 'contato@seusite.com.br', showPaymentMethods: true, paymentMethodsImages: [], showCopyright: true, copyrightText: `© ${new Date().getFullYear()} Sua Loja.`, showCnpj: false, cnpjText: 'CNPJ: XX.XXX.XXX/XXXX-XX', footerBackgroundColor: '#212529', footerTextColor: '#f8f9fa' },
    design: { buttonBorderRadius: 'rounded', buttonHoverAnimation: 'scale', buttonVariant: 'filled', cartIcon: 'shopping_bag_outlined', showCartIconText: true, cartIconTextColor: '#333333', imageBorderRadius: 'rounded', imageHoverEffect: 'zoom', enableShadows: true, shadowStyle: 'medium', enableCustomScrollbar: true, scrollbarColor: '#333333', enableHoverEffects: true, enableClickAnimations: true },
    advanced: { customCss: `/* Adicione seu CSS */`, customJs: `/* Adicione seu JS */`, faviconUrl: '/favicon.ico', enableLazyLoading: true, enableCodeMinification: true },
};

export default BaseTheme;