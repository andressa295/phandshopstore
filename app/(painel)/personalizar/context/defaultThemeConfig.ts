// app/(painel)/personalizar/context/defaultThemeConfig.ts
import {
    ThemeConfig,
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
    SingleBannerData,
    SingleProductShowcaseData,
    SelectedCategoryDisplayData,
    SingleHighlightItem,
    SingleTestimonialData,
    SingleImageGalleryData,
    ProductDetailConfig,
    ProductListConfig,
    CartConfig,
    FooterConfig,
    DesignConfig,
    AdvancedConfig,
    HeaderSettingsConfig,
} from '../types';
import { v4 as uuidv4 } from 'uuid';

const generateUniqueId = () => uuidv4();

export const defaultThemeConfig: ThemeConfig = {
    name: 'Tema Padrão',
    primaryColor: '#000000',
    secondaryColor: '#808080',
    textColor: '#333333',
    primaryFont: 'Inter',
    secondaryFont: 'Inter',
    titleBaseFontSize: 'medium',
    textBaseFontSize: 'medium',

    headerTitle: 'Sua Loja Padrão',
    fixedHeader: true,
    headerBackgroundColor: '#ffffff',
    headerTextColor: '#333333',
    navbarBackgroundColor: '#000000',
    navbarTextColor: '#ffffff',
    
    headerSettings: {
        logoUrl: '',
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
                id: generateUniqueId(),
                type: 'banner',
                data: {
                    title: 'Destaque da Página Inicial',
                    subtitle: 'Carrossel de banners personalizáveis.',
                    banners: [
                        {
                            id: uuidv4(),
                            desktopImageUrl: 'https://via.placeholder.com/1200x400/000000/FFFFFF?text=Banner+Desktop',
                            mobileImageUrl: 'https://via.placeholder.com/600x800/000000/FFFFFF?text=Banner+Mobile',
                            title: 'Descubra a Nova Coleção!',
                            subtitle: 'Estilo e qualidade que você merece.',
                            buttonText: 'Explorar Agora',
                            buttonLink: '/novidades',
                            overlayColor: '#000000',
                            overlayOpacity: 0.3,
                            isActive: true
                        },
                        {
                            id: uuidv4(),
                            desktopImageUrl: 'https://via.placeholder.com/1200x400/333333/FFFFFF?text=Banner+2+Desktop',
                            mobileImageUrl: 'https://via.placeholder.com/600x800/333333/FFFFFF?text=Banner+2+Mobile',
                            title: 'Promoções Imperdíveis!',
                            subtitle: 'Não perca nossos descontos especiais.',
                            buttonText: 'Ver Ofertas',
                            buttonLink: '/promocoes',
                            overlayColor: '#000000',
                            overlayOpacity: 0.4,
                            isActive: true,
                        },
                    ],
                    layout: 'carousel',
                    autoplay: true,
                    interval: 5,
                    isActive: true
                },
            },
            {
                id: generateUniqueId(),
                type: 'mini_banners',
                data: {
                    title: 'Por Que Comprar Conosco?',
                    banners: [
                        { id: uuidv4(), imageUrl: 'https://via.placeholder.com/300x150/F0F0F0/333333?text=Compra+Segura', link: '#', title: 'Compra Segura', subtitle: 'Seus dados protegidos.', isActive: true },
                        { id: uuidv4(), imageUrl: 'https://via.placeholder.com/300x150/F0F0F0/333333?text=Entrega+Rapida', link: '#', title: 'Entrega Rápida', subtitle: 'Receba em poucos dias.', isActive: true },
                        { id: uuidv4(), imageUrl: 'https://via.placeholder.com/300x150/F0F0F0/333333?text=Suporte+24/7', link: '#', title: 'Suporte 24/7', subtitle: 'Estamos sempre aqui para você.', isActive: true }
                    ],
                    layout: 'grid',
                    isActive: true,
                },
            },
            {
                id: generateUniqueId(),
                type: 'product_showcase',
                data: {
                    title: 'Nossas Vitrines de Produtos',
                    subtitle: 'Explore nossos produtos.',
                    showcases: [
                        {
                            id: uuidv4(),
                            title: 'Mais Vendidos',
                            displayType: 'best_sellers',
                            categoryId: null,
                            productIds: [],
                            numberOfProducts: 8,
                            isActive: true,
                        },
                        {
                            id: uuidv4(),
                            title: 'Últimas Novidades',
                            displayType: 'latest',
                            categoryId: null,
                            productIds: [],
                            numberOfProducts: 4,
                            isActive: true,
                        },
                    ],
                    isActive: true,
                },
            },
            {
                id: generateUniqueId(),
                type: 'text_image',
                data: { title: 'Sobre Nossa Marca', text: 'Conheça um pouco da nossa história e dos valores que nos movem. Qualidade, paixão e compromisso com você. Somos dedicados a oferecer os melhores produtos e um atendimento excepcional.', imageUrl: `https://via.placeholder.com/600x400/F0F0F0/333333?text=Texto+Imagem`, imagePosition: 'left', buttonText: 'Saiba Mais', buttonLink: '/sobre', isActive: true },
            },
            {
                id: generateUniqueId(),
                type: 'newsletter',
                data: { title: 'Assine Nossa Newsletter', subtitle: 'Receba ofertas exclusivas e novidades diretamente no seu e-mail!', buttonText: 'Assinar', privacyPolicyLink: '/politica-privacidade', isActive: true },
            },
            {
                id: generateUniqueId(),
                type: 'categories',
                data: {
                    title: 'Explore Nossas Categorias',
                    layout: 'grid',
                    isActive: true,
                    categoriesToDisplay: [
                        { id: uuidv4(), nome: 'Eletrônicos', slug: 'eletronicos', imageUrl: 'https://via.placeholder.com/100x100/CCCCCC/000000?text=Eletr.', isActive: true },
                        { id: uuidv4(), nome: 'Moda Feminina', slug: 'moda-feminina', imageUrl: 'https://via.placeholder.com/100x100/CCCCCC/000000?text=Moda', isActive: true },
                    ],
                },
            },
            {
                id: generateUniqueId(),
                type: 'highlights',
                data: {
                    title: 'Por Que Escolher a Gente?',
                    subtitle: 'Conheça nossos diferenciais e benefícios.',
                    isActive: true,
                    highlightItems: [
                        { id: uuidv4(), icon: 'MdLocalShipping', title: 'Frete Rápido', subtitle: 'Em todo o Brasil', isActive: true },
                        { id: generateUniqueId(), icon: 'MdCreditCard', title: 'Pagamento Facilitado', subtitle: 'Em até 12x sem juros', isActive: true },
                        { id: generateUniqueId(), icon: 'MdHeadset', title: 'Suporte Premium', subtitle: 'Atendimento 24/7', isActive: true },
                        { id: generateUniqueId(), icon: 'MdArchive', title: 'Pronta Entrega', subtitle: 'Envio imediato', isActive: true },
                    ],
                    layout: 'icons-text',
                },
            },
            {
                id: generateUniqueId(),
                type: 'video',
                data: { title: 'Assista Nosso Vídeo Institucional', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', autoplay: false, loop: false, controls: true, isActive: true },
            },
            {
                id: generateUniqueId(),
                type: 'testimonials',
                data: {
                    title: 'O Que Nossos Clientes Dizem',
                    subtitle: 'Veja a opinião de quem já comprou!',
                    testimonials: [
                        { id: uuidv4(), text: 'Adorei a qualidade dos produtos e o atendimento rápido!', author: 'Maria S.', imageUrl: 'https://via.placeholder.com/80x80/CCCCCC/000000?text=MS', rating: 5, isActive: true },
                        { id: uuidv4(), text: 'Entrega super rápida e tudo impecável. Recomendo!', author: 'João P.', imageUrl: 'https://via.placeholder.com/80x80/CCCCCC/000000?text=JP', rating: 4, isActive: true },
                    ],
                    layout: 'carousel',
                    isActive: true,
                },
            },
            {
                id: generateUniqueId(),
                type: 'image_gallery',
                data: {
                    title: 'Nossa Galeria de Fotos',
                    subtitle: 'Confira nossos momentos e produtos em destaque.',
                    images: [
                        { id: uuidv4(), imageUrl: 'https://via.placeholder.com/400x300/F0F0F0/333333?text=Galeria+Imagem', title: 'Imagem da Galeria', link: '#', isActive: true },
                        { id: uuidv4(), imageUrl: 'https://via.placeholder.com/400x300/F0F0F0/333333?text=Imagem+2', title: 'Coleção Nova', link: '#', isActive: true },
                    ],
                    layout: 'grid',
                    gridColumns: 3,
                    isActive: true,
                },
            },
        ],
        categoriesData: [],
        productsData: [],
    },
    
    productDetail: { galleryLayout: 'carousel', showPrice: true, showSku: true, showStock: true, enableQuantitySelector: true, showVariations: true, showProductDescription: true, showAdditionalInfoTabs: true, showReviewsSection: true, showRelatedProducts: true, relatedProductsTitle: 'Quem viu este, também gostou:', showTrustBadges: false, trustBadgesImages: [], imagePosition: 'side-gallery' },
    productList: { layout: 'grid', gridColumns: 3, showProductImage: true, showProductName: true, showProductPrice: true, showProductDescriptionSnippet: false, showAddToCartButton: true, showQuickViewButton: true, enableFilters: true, enableSorting: true, productsPerPage: 12, showPagination: true, addToCartButtonColor: '#000000' },
    cart: { enableWholesaleMinOrder: false, minWholesaleOrderValue: null, showShippingEstimator: true, showCouponField: true, showCartNotes: false, showCrossSellProducts: true, crossSellTitle: 'Adicione também:', checkoutButtonText: 'Finalizar Compra' },
    footer: { showQuickLinks: true, quickLinksTitle: 'Institucional', quickLinks: [
      { id: uuidv4(), text: 'Quem Somos', url: '/quem-somos' },
      { id: uuidv4(), text: 'Política de Trocas', url: '/trocas-e-devolucoes' },
      { id: uuidv4(), text: 'Política de Privacidade', url: '/politica-privacidade' },
      { id: generateUniqueId(), text: 'Termos de Uso', url: '/termos-de-uso' },
    ], showSocialMediaIcons: true, socialMediaTitle: 'Siga-nos nas Redes Sociais', socialMediaLinks: [
      { id: generateUniqueId(), platform: 'instagram', url: 'https://instagram.com/sua_loja_padrao' },
      { id: generateUniqueId(), platform: 'facebook', url: 'https://facebook.com/sua_loja_padrao' },
      { id: generateUniqueId(), platform: 'x', url: 'https://x.com/sua_loja_padrao' },
      { id: generateUniqueId(), platform: 'youtube', url: 'https://www.youtube.com/user/sua_loja_padrao' },
    ], showNewsletterSignup: true, newsletterTitle: 'Newsletter', newsletterSubtitle: 'Inscreva-se e não perca nenhuma novidade!', showContactInfo: true, contactAddress: 'Rua da Amostra, 123 - Bairro Teste, Cidade/Estado, CEP', contactPhone: '(XX) XXXX-XXXX', contactEmail: 'contato@seusite.com.br', showPaymentMethods: true, paymentMethodsImages: [
      { id: generateUniqueId(), imageUrl: '/images/payment/visa.png' },
      { id: generateUniqueId(), imageUrl: '/images/payment/mastercard.png' },
      { id: generateUniqueId(), imageUrl: '/images/payment/boleto.png' },
      { id: generateUniqueId(), imageUrl: '/images/payment/pix.png' },
    ], showShippingMethods: true, shippingMethodsImages: [
      { id: generateUniqueId(), imageUrl: '/images/shipping/correios.png' },
      { id: generateUniqueId(), imageUrl: '/images/shipping/sedex.png' },
      { id: generateUniqueId(), imageUrl: '/images/shipping/jadlog.png' },
    ], showCopyright: true, copyrightText: `© ${new Date().getFullYear()} Sua Loja Padrão. Todos os direitos reservados.`, showCnpj: false, cnpjText: 'CNPJ: XX.XXX.XXX/XXXX-XX', footerBackgroundColor: '#212529', footerTextColor: '#f8f9fa' },

    design: {
        buttonBorderRadius: 'rounded',
        buttonHoverAnimation: 'scale',
        buttonVariant: 'filled',
        cartIcon: 'shopping_bag_outlined',
        showCartIconText: true,
        cartIconTextColor: '#333333',
        imageBorderRadius: 'rounded',
        imageHoverEffect: 'zoom',
        enableShadows: true,
        shadowStyle: 'medium',
        enableCustomScrollbar: true,
        scrollbarColor: '#333333',
        enableHoverEffects: true,
        enableClickAnimations: true,
    },

    advanced: {
        customCss: `/* Adicione seu CSS personalizado aqui */\n\n/* Exemplo: .meu-elemento { color: red; } */`,
        customJs: `/* Adicione seu JavaScript personalizado aqui */\n\n// Exemplo: console.log('Script personalizado carregado!');`,
        faviconUrl: '/favicon.ico',
        enableLazyLoading: true,
        enableCodeMinification: true,
    },
};

export default defaultThemeConfig;