// app/(painel)/personalizar/themes/Padrao.ts
import { ThemeConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = () => uuidv4();

export const Padrao: ThemeConfig = {
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
        announcementText: '🎉 Frete Grátis para todo Brasil em compras acima de R$199!',
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
                        { id: uuidv4(), desktopImageUrl: 'https://via.placeholder.com/1920x600?text=Banner+Padr%C3%A3o', mobileImageUrl: 'https://via.placeholder.com/600x800?text=Banner+Padr%C3%A3o+Mobile', title: 'Descubra a Nova Coleção!', subtitle: 'Estilo e qualidade que você merece.', buttonText: 'Explorar Agora', buttonLink: '/novidades', overlayColor: '#000000', overlayOpacity: 0.3, isActive: true },
                    ],
                },
            },
            {
                id: uuidv4(),
                type: 'product_showcase',
                data: {
                    title: 'Produtos em Destaque',
                    subtitle: 'Seções de produtos personalizadas.',
                    isActive: true,
                    showcases: [{ id: uuidv4(), title: 'Mais Vendidos', displayType: 'best_sellers', numberOfProducts: 8, isActive: true }],
                },
            },
            {
                id: uuidv4(),
                type: 'text_image',
                data: { title: 'Sobre Nossa Marca', text: 'Conheça um pouco da nossa história e dos valores que nos movem.', imageUrl: 'https://via.placeholder.com/600x400?text=Texto+Imagem', imagePosition: 'left', buttonText: 'Saiba Mais', buttonLink: '/sobre', isActive: true },
            },
            {
                id: uuidv4(),
                type: 'highlights',
                data: {
                    title: 'Por que Escolher a gente?',
                    subtitle: 'Conheça nossos diferenciais e benefícios.',
                    isActive: true,
                    highlightItems: [
                        { id: uuidv4(), icon: 'MdLocalShipping', title: 'Frete Rápido', subtitle: 'Em todo o Brasil', isActive: true },
                    ],
                    layout: 'icons-text',
                },
            },
        ],
        categoriesData: [],
        productsData: [],
    },

    productDetail: { galleryLayout: 'carousel', showPrice: true, showSku: true, showStock: true, enableQuantitySelector: true, showVariations: true, showProductDescription: true, showAdditionalInfoTabs: true, showReviewsSection: true, showRelatedProducts: true, relatedProductsTitle: 'Quem viu este, também gostou:', showTrustBadges: false, trustBadgesImages: [], imagePosition: 'side-gallery' },
    productList: { layout: 'grid', gridColumns: 3, showProductImage: true, showProductName: true, showProductPrice: true, showProductDescriptionSnippet: false, showAddToCartButton: true, showQuickViewButton: true, enableFilters: true, enableSorting: true, productsPerPage: 12, showPagination: true, addToCartButtonColor: '#333333' },
    cart: { enableWholesaleMinOrder: false, minWholesaleOrderValue: null, showShippingEstimator: true, showCouponField: true, showCartNotes: false, showCrossSellProducts: true, crossSellTitle: 'Adicione também:', checkoutButtonText: 'Finalizar Compra' },
    footer: { showQuickLinks: true, quickLinksTitle: 'Institucional', quickLinks: [], showSocialMediaIcons: true, socialMediaTitle: 'Siga-nos nas Redes Sociais', socialMediaLinks: [], showNewsletterSignup: true, newsletterTitle: 'Newsletter', newsletterSubtitle: 'Inscreva-se!', showContactInfo: true, contactAddress: 'Rua da Amostra, 123', contactPhone: '(XX) XXXX-XXXX', contactEmail: 'contato@seusite.com.br', showPaymentMethods: true, paymentMethodsImages: [], showCopyright: true, copyrightText: `© ${new Date().getFullYear()} Sua Loja Padrão.`, showCnpj: false, cnpjText: 'CNPJ: XX.XXX.XXX/XXXX-XX', footerBackgroundColor: '#212529', footerTextColor: '#f8f9fa' },
    design: { buttonBorderRadius: 'rounded', buttonHoverAnimation: 'scale', buttonVariant: 'filled', cartIcon: 'shopping_bag_outlined', showCartIconText: true, cartIconTextColor: '#333333', imageBorderRadius: 'rounded', imageHoverEffect: 'zoom', enableShadows: true, shadowStyle: 'medium', enableCustomScrollbar: true, scrollbarColor: '#333333', enableHoverEffects: true, enableClickAnimations: true },
    advanced: { customCss: `/* Adicione seu CSS personalizado aqui */`, customJs: `/* Adicione seu JavaScript personalizado aqui */`, faviconUrl: '/favicon.ico', enableLazyLoading: true, enableCodeMinification: true },
};

export default Padrao;