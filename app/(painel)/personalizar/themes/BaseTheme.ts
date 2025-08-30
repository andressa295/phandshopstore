// app/(painel)/personalizar/themes/BaseTheme.ts
import { ThemeConfig } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const BaseTheme: ThemeConfig = {
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

    homepage: {
        modules: [
            {
                id: uuidv4(),
                type: 'banner',
                data: {
                    title: 'Destaque da Página Inicial',
                    subtitle: 'Carrossel de banners personalizáveis.',
                    banners: [
                        { id: uuidv4(), desktopImageUrl: 'https://via.placeholder.com/1920x600?text=Banner+Padrao', mobileImageUrl: 'https://via.placeholder.com/600x800?text=Banner+Padrao+Mobile', title: 'Descubra a Nova Colecao!' } as any
                    ],
                    layout: 'carousel',
                    autoplay: true,
                    isActive: true,
                },
            },
            {
                id: uuidv4(),
                type: 'product_showcase',
                data: {
                    title: 'Produtos em Destaque',
                    isActive: true,
                    showcases: [{ id: uuidv4(), title: 'Mais Vendidos', displayType: 'best_sellers', numberOfProducts: 8 } as any]
                },
            }
        ],
    },

    productDetail: { galleryLayout: 'carousel', showPrice: true, showSku: true, showStock: true, enableQuantitySelector: true, showVariations: true, showProductDescription: true, showAdditionalInfoTabs: true, showReviewsSection: true, showRelatedProducts: true, relatedProductsTitle: 'Quem viu este, também gostou:', showTrustBadges: false, trustBadgesImages: [], imagePosition: 'side-gallery' },
    productList: { layout: 'grid', gridColumns: 3, showProductImage: true, showProductName: true, showProductPrice: true, showProductDescriptionSnippet: false, showAddToCartButton: true, showQuickViewButton: true, enableFilters: true, enableSorting: true, productsPerPage: 12, showPagination: true, addToCartButtonColor: '#333333' },
    cart: { enableWholesaleMinOrder: false, minWholesaleOrderValue: null, showShippingEstimator: true, showCouponField: true, showCartNotes: false, showCrossSellProducts: true, crossSellTitle: 'Adicione tambem:', checkoutButtonText: 'Finalizar Compra' },
    footer: { showQuickLinks: true, quickLinksTitle: 'Institucional', quickLinks: [], showSocialMediaIcons: true, socialMediaTitle: 'Siga-nos', socialMediaLinks: [], showNewsletterSignup: true, newsletterTitle: 'Newsletter', newsletterSubtitle: 'Inscreva-se!', showContactInfo: true, contactAddress: 'Rua da Amostra, 123', contactPhone: '(XX) XXXX-XXXX', contactEmail: 'contato@seusite.com.br', showPaymentMethods: true, paymentMethodsImages: [], showCopyright: true, copyrightText: `© ${new Date().getFullYear()} Sua Loja.`, showCnpj: false, cnpjText: 'CNPJ: XX.XXX.XXX/XXXX-XX', footerBackgroundColor: '#212529', footerTextColor: '#f8f9fa' },
    design: { buttonBorderRadius: 'rounded', buttonHoverAnimation: 'scale', buttonVariant: 'filled', cartIcon: 'shopping_bag_outlined', showCartIconText: true, cartIconTextColor: '#333333', imageBorderRadius: 'rounded', imageHoverEffect: 'zoom', enableShadows: true, shadowStyle: 'medium', enableCustomScrollbar: true, scrollbarColor: '#333333', enableHoverEffects: true, enableClickAnimations: true },
    advanced: { customCss: `/* Adicione seu CSS */`, customJs: `/* Adicione seu JS */`, faviconUrl: '/favicon.ico', enableLazyLoading: true, enableCodeMinification: true },
};