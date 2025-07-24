// app/(painel)/personalizar/defaultThemeConfig.ts

import {
  ThemeConfig,
  HomepageModuleType,
  ProductDetailConfig,
  ProductListConfig,
  CartConfig,
  FooterConfig,
  DesignConfig,
  AdvancedConfig,
  BannerModuleData,
  MiniBannerModuleData,
  ProductShowcaseModuleData,
  TextImageModuleData,
  NewsletterModuleData,
  CategoriesModuleData,
  HighlightsModuleData,
  VideoModuleData,
  HeaderSettingsConfig,
} from '../types'; 

const generateUniqueId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export const defaultThemeConfig: ThemeConfig = {
  primaryColor: '#333333', // <-- MUDAR AQUI: De '#8d4edb' para '#333333' (preto)
  secondaryColor: '#A8A8A8', // <-- Sugestão: Mudar para um cinza claro ou cor neutra
  textColor: '#444444', // <-- Sugestão: Mudar para um cinza escuro para o texto padrão

  primaryFont: 'Roboto',
  secondaryFont: 'Open Sans',
  titleBaseFontSize: 'large',
  textBaseFontSize: 'medium',

  headerTitle: 'Sua Loja Padrão',
  fixedHeader: true,
  headerBackgroundColor: '#ffffff', 
  headerTextColor: '#333333', 

  navbarBackgroundColor: '#333333', // <-- MUDAR AQUI: De '#8d4edb' para '#333333'
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
    announcementBackgroundColor: '#444444', // <-- Sugestão: Mudar para um cinza escuro
    announcementTextColor: '#ffffff', 
    searchBarBackgroundColor: '#f8f8f8', 
  },

  homepage: {
    modules: [
      {
        id: generateUniqueId(),
        type: 'banner',
        data: {
          desktopImageUrl: '/images/homepage/default_banner_hero_desktop.jpg',
          mobileImageUrl: '/images/homepage/default_banner_hero_mobile.jpg',
          title: 'Descubra a Nova Coleção!',
          subtitle: 'Estilo e qualidade que você merece.',
          buttonText: 'Explorar Agora',
          buttonLink: '/novidades',
          isActive: true,
          overlayColor: '#000000',
          overlayOpacity: 0.3,
          textColor: '#ffffff',
          titleFontSize: '3em',
          subtitleFontSize: '1.5em',
          buttonBackgroundColor: '#333333', // <-- Sugestão: Mudar para preto
          buttonTextColor: '#ffffff',
        },
      },
      {
        id: generateUniqueId(),
        type: 'mini_banners',
        data: { 
          title: 'Por Que Comprar Conosco?', 
          banners: [
            { id: generateUniqueId(), imageUrl: 'https://via.placeholder.com/300x150?text=Compra+Segura', link: '#', title: 'Compra Segura', subtitle: 'Seus dados protegidos.' },
            { id: generateUniqueId(), imageUrl: 'https://via.placeholder.com/300x150?text=Entrega+Rapida', link: '#', title: 'Entrega Rápida', subtitle: 'Receba em poucos dias.' },
            { id: generateUniqueId(), imageUrl: 'https://via.placeholder.com/300x150?text=Suporte+24/7', link: '#', title: 'Suporte 24/7', subtitle: 'Estamos sempre aqui para você.' }
          ], 
          layout: 'grid', 
          isActive: true 
        },
      },
      {
        id: generateUniqueId(),
        type: 'product_showcase',
        data: { title: 'Mais Vendidos', displayType: 'best_sellers', productIds: [], numberOfProducts: 8, isActive: true },
      },
      {
        id: generateUniqueId(),
        type: 'text_image',
        data: { title: 'Sobre Nossa Marca', text: 'Conheça um pouco da nossa história e dos valores que nos movem. Qualidade, paixão e compromisso com você. Somos dedicados a oferecer os melhores produtos e um atendimento excepcional.', imageUrl: `https://via.placeholder.com/600x400?text=Texto+Imagem ${generateUniqueId().substring(0,4)}`, imagePosition: 'left', buttonText: 'Saiba Mais', buttonLink: '/sobre', isActive: true },
      },
      {
        id: generateUniqueId(),
        type: 'newsletter',
        data: { title: 'Assine Nossa Newsletter', subtitle: 'Receba ofertas exclusivas e novidades diretamente no seu e-mail!', buttonText: 'Assinar', privacyPolicyLink: '/politica-privacidade', isActive: true },
      },
      {
        id: generateUniqueId(),
        type: 'categories',
        data: { title: 'Explore Nossas Categorias', selectedCategories: ['Eletrônicos', 'Moda Feminina', 'Casa & Decoração', 'Beleza & Saúde', 'Esportes'], layout: 'grid', isActive: true },
      },
      {
        id: generateUniqueId(),
        type: 'highlights',
        data: { title: 'Por Que Escolher a Gente?', highlightItems: [{ icon: 'fa-solid fa-gem', text: 'Produtos de Alta Qualidade' }, { icon: 'fa-solid fa-truck-fast', text: 'Envio Rápido e Seguro' }, { icon: 'fa-solid fa-credit-card', text: 'Diversas Formas de Pagamento' }, { icon: 'fa-solid fa-headset', text: 'Atendimento Personalizado' }], layout: 'icons-text', isActive: true },
      },
      {
        id: generateUniqueId(),
        type: 'video',
        data: { title: 'Assista Nosso Vídeo Institucional', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', autoplay: false, loop: false, controls: true, isActive: true },
      },
    ],
  },

  productDetail: {
    galleryLayout: 'carousel',
    showPrice: true,
    showSku: true,
    showStock: true,
    enableQuantitySelector: true,
    showVariations: true,
    showProductDescription: true,
    showAdditionalInfoTabs: true,
    showReviewsSection: true,
    showRelatedProducts: true,
    relatedProductsTitle: 'Quem viu este, também gostou:',
    showTrustBadges: true,
    trustBadgesImages: [
      '/images/badges/secure_payment.png',
      '/images/badges/ssl_secured.png',
      '/images/badges/fast_delivery.png',
    ],
    imagePosition: 'side-gallery',
  },

  productList: {
    layout: 'grid',
    gridColumns: 3,
    showProductImage: true,
    showProductName: true,
    showProductPrice: true,
    showProductDescriptionSnippet: false,
    showAddToCartButton: true,
    showQuickViewButton: true,
    enableFilters: true,
    enableSorting: true,
    productsPerPage: 12,
    showPagination: true,
    addToCartButtonColor: '#333333', // <-- Sugestão: Mudar para preto
  },

  cart: {
    enableWholesaleMinOrder: false,
    minWholesaleOrderValue: null,
    showShippingEstimator: true,
    showCouponField: true,
    showCartNotes: false,
    checkoutButtonText: 'Finalizar Compra',
    showCrossSellProducts: true,
    crossSellTitle: 'Adicione também:',
  },

  footer: {
    showQuickLinks: true,
    quickLinksTitle: 'Institucional',
    quickLinks: [
      { id: generateUniqueId(), text: 'Quem Somos', url: '/quem-somos' },
      { id: generateUniqueId(), text: 'Política de Trocas', url: '/trocas-e-devolucoes' },
      { id: generateUniqueId(), text: 'Política de Privacidade', url: '/politica-privacidade' },
      { id: generateUniqueId(), text: 'Termos de Uso', url: '/termos-de-uso' },
    ],
    showSocialMediaIcons: true,
    socialMediaTitle: 'Siga-nos nas Redes Sociais',
    socialMediaLinks: [
      { id: generateUniqueId(), platform: 'instagram', url: 'https://instagram.com/sua_loja_padrao' },
      { id: generateUniqueId(), platform: 'facebook', url: 'https://facebook.com/sua_loja_padrao' },
      { id: generateUniqueId(), platform: 'x', url: 'https://x.com/sua_loja_padrao' },
      { id: generateUniqueId(), platform: 'youtube', url: 'https://www.youtube.com/user/sua_loja_padrao' },
    ],
    showNewsletterSignup: true,
    newsletterTitle: 'Newsletter',
    newsletterSubtitle: 'Inscreva-se e não perca nenhuma novidade!',
    showContactInfo: true,
    contactAddress: 'Rua da Amostra, 123 - Bairro Teste, Cidade/Estado, CEP',
    contactPhone: '(XX) XXXX-XXXX',
    contactEmail: 'contato@seusite.com.br',
    showPaymentMethods: true,
    paymentMethodsImages: [
      { id: generateUniqueId(), imageUrl: '/images/payment/visa.png' },
      { id: generateUniqueId(), imageUrl: '/images/payment/mastercard.png' },
      { id: generateUniqueId(), imageUrl: '/images/payment/boleto.png' },
      { id: generateUniqueId(), imageUrl: '/images/payment/pix.png' },
    ],
    showCopyright: true,
    copyrightText: `© ${new Date().getFullYear()} Sua Loja Padrão. Todos os direitos reservados.`,
    showCnpj: false,
    cnpjText: 'CNPJ: XX.XXX.XXX/XXXX-XX',
    footerBackgroundColor: '#212529',
    footerTextColor: '#f8f9fa',
  },

  design: {
    buttonBorderRadius: 'rounded',
    buttonHoverAnimation: 'scale',
    buttonVariant: 'filled', 
    cartIcon: 'shopping_bag_outlined',
    showCartIconText: true,
    cartIconTextColor: '#333333', // <-- Sugestão: Mudar para preto
    imageBorderRadius: 'rounded',
    imageHoverEffect: 'zoom',
    enableShadows: true,
    shadowStyle: 'medium',
    enableCustomScrollbar: true,
    scrollbarColor: '#333333', // <-- Sugestão: Mudar para preto
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