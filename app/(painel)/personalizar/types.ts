// Tipos de Módulos da Homepage
export interface BannerModuleData {
  desktopImageUrl?: string; // Tornando opcional, pode ter apenas um imageUrl
  mobileImageUrl?: string;  // Tornando opcional
  imageUrl?: string;        // Adicionado para caso de imagem única
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  overlayColor?: string; // Cor do overlay
  overlayOpacity?: number; // Opacidade do overlay
  textColor?: string;    // Cor do texto do banner
  titleFontSize?: string; // Tamanho da fonte do título
  subtitleFontSize?: string; // Tamanho da fonte do subtítulo
  buttonBackgroundColor?: string; // Cor de fundo do botão
  buttonTextColor?: string;     // Cor do texto do botão
  isActive: boolean; // Controla se o módulo está ativo
}

export interface SingleMiniBannerData {
  id: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  link?: string;
}

export interface MiniBannerModuleData {
  title?: string;
  layout?: 'grid' | 'carousel';
  banners: SingleMiniBannerData[];
  isActive: boolean;
}

export interface ProductShowcaseModuleData {
  title?: string;
  displayType?: 'latest' | 'best_sellers' | 'featured' | 'selected';
  productIds?: string[];
  numberOfProducts?: number;
  isActive: boolean;
}

export interface TextImageModuleData {
  title?: string;
  text?: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
}

export interface NewsletterModuleData {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  privacyPolicyLink?: string;
  isActive: boolean;
}

export interface CategoriesModuleData {
  title?: string;
  selectedCategories?: string[]; 
  layout?: 'grid' | 'carousel';
  isActive: boolean;
}

export interface HighlightsModuleData {
  title?: string;
  highlightItems?: Array<{ icon: string; text: string }>;
  layout?: 'icons-text' | 'cards';
  isActive: boolean;
}

export interface VideoModuleData {
  title?: string;
  videoUrl?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  isActive: boolean;
}

export interface ProductDetailConfig {
  galleryLayout?: 'carousel' | 'grid';
  showPrice?: boolean;
  showSku?: boolean;
  showStock?: boolean;
  enableQuantitySelector?: boolean;
  showVariations?: boolean;
  showProductDescription?: boolean;
  showAdditionalInfoTabs?: boolean;
  showReviewsSection?: boolean;
  showRelatedProducts?: boolean;
  relatedProductsTitle?: string;
  showTrustBadges?: boolean;
  trustBadgesImages?: string[];
  imagePosition?: 'left' | 'right' | 'top-gallery' | 'side-gallery';
}

export interface ProductListConfig {
  layout?: 'grid' | 'list';
  gridColumns?: 2 | 3 | 4;
  showProductImage?: boolean;
  showProductName?: boolean;
  showProductPrice?: boolean;
  showProductDescriptionSnippet?: boolean;
  showAddToCartButton?: boolean;
  showQuickViewButton?: boolean;
  enableFilters?: boolean;
  enableSorting?: boolean;
  productsPerPage?: number;
  showPagination?: boolean;
  addToCartButtonColor?: string; 
}

export interface CartConfig {
  enableWholesaleMinOrder?: boolean;
  minWholesaleOrderValue?: number | null;
  showShippingEstimator?: boolean;
  showCouponField?: boolean;
  showCartNotes?: boolean;
  checkoutButtonText?: string;
  showCrossSellProducts?: boolean;
  crossSellTitle?: string;
}

export interface FooterConfig {
  showQuickLinks?: boolean;
  quickLinksTitle?: string;
  quickLinks?: Array<{ id: string; text: string; url: string }>;
  
  showSocialMediaIcons?: boolean;
  socialMediaTitle?: string;
  socialMediaLinks?: Array<{ id: string; platform: 'facebook' | 'instagram' | 'x' | 'youtube' | 'linkedin' | 'pinterest' | 'tiktok'; url: string }>;

  showNewsletterSignup?: boolean;
  newsletterTitle?: string;
  newsletterSubtitle?: string;
  privacyPolicyLink?: string;

  showContactInfo?: boolean;
  contactAddress?: string;
  contactPhone?: string;
  contactEmail?: string;

  showPaymentMethods?: boolean;
  paymentMethodsImages?: Array<{ id: string; imageUrl: string; }>;

  showCopyright?: boolean;
  copyrightText?: string;
  showCnpj?: boolean;
  cnpjText?: string;

  footerBackgroundColor?: string;
  footerTextColor?: string;
}

export interface DesignConfig {
  buttonBorderRadius?: 'square' | 'rounded' | 'oval';
  buttonHoverAnimation?: 'none' | 'scale' | 'opacity' | 'slide';
  buttonVariant?: 'filled' | 'bordered'; 

  cartIcon?: 'cart' | 'bag' | 'shopping_cart_outlined' | 'shopping_bag_outlined';
  showCartIconText?: boolean;
  cartIconTextColor?: string;

  imageBorderRadius?: 'square' | 'rounded' | 'circle';
  imageHoverEffect?: 'none' | 'zoom' | 'grayscale' | 'overlay';

  enableShadows?: boolean;
  shadowStyle?: 'none' | 'small' | 'medium' | 'large';

  enableCustomScrollbar?: boolean;
  scrollbarColor?: string;

  enableHoverEffects?: boolean;
  enableClickAnimations?: boolean;
}

export interface AdvancedConfig {
  customCss?: string;
  customJs?: string;
  faviconUrl?: string;
  enableLazyLoading?: boolean;
  enableCodeMinification?: boolean;
}

export interface HeaderSettingsConfig {
  logoUrl?: string; 
  logoSize?: 'small' | 'medium' | 'large';
  iconSize?: 'small' | 'medium' | 'large';
  desktopSearch?: 'icon' | 'bar' | 'none'; // Adicionado 'none'
  mobileSearch?: 'icon' | 'bar' | 'none';  // Adicionado 'none'
  showAnnouncementBar?: boolean;
  announcementText?: string;
  announcementLink?: string;
  announcementMarquee?: boolean;
  useCustomHeaderColors?: boolean; 
  headerBackgroundColor?: string; // Cor de fundo do cabeçalho, se useCustomHeaderColors for true
  headerTextColor?: string;     // Cor do texto do cabeçalho, se useCustomHeaderColors for true
  announcementBackgroundColor?: string; // Cor de fundo da barra de anúncio
  announcementTextColor?: string;     // Cor do texto da barra de anúncio
  searchBarBackgroundColor?: string; // Cor de fundo da barra de pesquisa no header
}

// Tipo Union para Módulos da Homepage
export type HomepageModuleType =
  | { id: string; type: 'banner'; data: BannerModuleData }
  | { id: string; type: 'mini_banners'; data: MiniBannerModuleData }
  | { id: string; type: 'product_showcase'; data: ProductShowcaseModuleData }
  | { id: string; type: 'text_image'; data: TextImageModuleData }
  | { id: string; type: 'newsletter'; data: NewsletterModuleData }
  | { id: string; type: 'categories'; data: CategoriesModuleData }
  | { id: string; type: 'highlights'; data: HighlightsModuleData }
  | { id: string; type: 'video'; data: VideoModuleData };

// Interface da Configuração Geral do Tema
export interface ThemeConfig {
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string; 

  primaryFont?: string;
  secondaryFont?: string;
  titleBaseFontSize?: 'small' | 'medium' | 'large';
  textBaseFontSize?: 'small' | 'medium' | 'large';

  headerTitle?: string;
  // showSearchBar?: boolean; // Esta propriedade é redundante com headerSettings.desktopSearch/mobileSearch, pode ser removida se quiser
  fixedHeader?: boolean;
  headerBackgroundColor?: string; // Cor de fundo do cabeçalho (pode ser sobrescrita por headerSettings)
  headerTextColor?: string;     // Cor do texto do cabeçalho (pode ser sobrescrita por headerSettings)
  
  // Novas propriedades adicionadas para a barra de navegação principal (menu)
  navbarBackgroundColor?: string; // Cor de fundo da barra de navegação
  navbarTextColor?: string;       // Cor do texto da barra de navegação

  headerSettings?: HeaderSettingsConfig; // Objeto de configurações específicas do cabeçalho

  homepage?: {
    modules: HomepageModuleType[];
  };
  productDetail?: ProductDetailConfig;
  productList?: ProductListConfig;
  cart?: CartConfig;
  footer?: FooterConfig;
  design?: DesignConfig;
  advanced?: AdvancedConfig;
}

// Função de atualização do tema (para useTheme)
export type ThemeUpdateFn = (updates: Partial<ThemeConfig>) => void;