// app/(painel)/personalizar/types.ts

// Tipos de Módulos da Homepage
// --- INTERFACE PARA UM BANNER INDIVIDUAL ---
export interface SingleBannerData {
  id: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
  overlayColor?: string;
  overlayOpacity?: number;
  textColor?: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  isActive?: boolean;
}

// --- INTERFACE PARA O MÓDULO BANNER ROTATIVO COMPLETO ---
export interface BannerModuleData {
  title?: string;
  subtitle?: string;
  banners: SingleBannerData[];
  layout?: 'carousel' | 'fade';
  autoplay?: boolean;
  interval?: number;
  isActive: boolean;
}

export interface SingleMiniBannerData {
  id: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  isActive?: boolean;
}

export interface MiniBannerModuleData {
  title?: string;
  layout?: 'grid' | 'carousel';
  banners: SingleMiniBannerData[];
  isActive: boolean;
}

// --- NOVA INTERFACE PARA UMA VITRINE DE PRODUTOS INDIVIDUAL ---
export interface SingleProductShowcaseData {
  id: string;
  title?: string;
  displayType?: 'latest' | 'best_sellers' | 'featured' | 'selected' | 'all_products';
  categoryId?: string | null;
  productIds?: string[];
  numberOfProducts?: number;
  isActive?: boolean;
}

export interface ProductShowcaseModuleData {
  title?: string;
  subtitle?: string;
  showcases: SingleProductShowcaseData[];
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

export interface CategoryData {
  id: string;
  nome: string;
  slug: string;
  imagem_url?: string | null;
}

// --- NOVA INTERFACE PARA UMA CATEGORIA SELECIONADA PARA EXIBIÇÃO ---
export interface SelectedCategoryDisplayData {
  id: string;
  nome: string;
  slug: string;
  imageUrl?: string;
  isActive?: boolean;
}

export interface CategoriesModuleData {
  title?: string;
  categoriesToDisplay?: SelectedCategoryDisplayData[];
  layout?: 'grid' | 'carousel';
  isActive: boolean;
}

// --- NOVA INTERFACE PARA UM ITEM DE DESTAQUE INDIVIDUAL ---
export interface SingleHighlightItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  isActive?: boolean;
}

export interface HighlightsModuleData {
  title?: string;
  subtitle?: string;
  highlightItems?: SingleHighlightItem[];
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

// --- NOVA INTERFACE PARA UM DEPOIMENTO INDIVIDUAL ---
export interface SingleTestimonialData {
  id: string;
  text: string;
  author: string;
  imageUrl?: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  isActive?: boolean;
}

export interface TestimonialsModuleData {
  title?: string;
  subtitle?: string;
  testimonials: SingleTestimonialData[];
  layout?: 'carousel' | 'grid';
  isActive: boolean;
}

// --- NOVAS INTERFACES PARA O MÓDULO DE GALERIA DE IMAGENS ---
export interface SingleImageGalleryData {
  id: string;
  imageUrl?: string;
  title?: string;
  link?: string;
  isActive?: boolean;
}

export interface ImageGalleryModuleData {
  title?: string;
  subtitle?: string;
  images: SingleImageGalleryData[];
  layout?: 'grid' | 'carousel';
  gridColumns?: 2 | 3 | 4;
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
  showCrossSellProducts?: boolean;
  crossSellTitle?: string;
  checkoutButtonText?: string;
}

export interface FooterConfig {
  showQuickLinks?: boolean;
  quickLinksTitle?: string;
  quickLinks?: Array<{ id: string; text: string; url: string }>;

  showMenu?: boolean;
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

  showShippingMethods?: boolean;
  shippingMethodsImages?: Array<{ id: string; imageUrl: string; }>;

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
  lastUpdatedScript?: string;
  lastUpdatedEditor?: string;
}

export interface HeaderSettingsConfig {
  logoUrl?: string;
  logoSize?: 'small' | 'medium' | 'large';
  iconSize?: 'small' | 'medium' | 'large';
  desktopSearch?: 'icon' | 'bar' | 'none';
  mobileSearch?: 'icon' | 'bar' | 'none';
  showAnnouncementBar?: boolean;
  announcementText?: string;
  announcementLink?: string;
  announcementMarquee?: boolean;
  useCustomHeaderColors?: boolean;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  announcementBackgroundColor?: string;
  announcementTextColor?: string;
  searchBarBackgroundColor?: string;
  trackOrderLinkActive?: boolean;
  supportLinkActive?: boolean;
  headerTitle?: string;
  fixedHeader?: boolean;
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
  | { id: string; type: 'video'; data: VideoModuleData }
  | { id: string; type: 'testimonials'; data: TestimonialsModuleData }
  | { id: string; type: 'image_gallery'; data: ImageGalleryModuleData };

// Interface da Configuração Geral do Tema
export interface ThemeConfig {
  name?: string;
  primaryColor?: string;
  secondaryColor?: string;
  textColor?: string;
  primaryFont?: string;
  secondaryFont?: string;
  titleBaseFontSize?: 'small' | 'medium' | 'large';
  textBaseFontSize?: 'small' | 'medium' | 'large';
  headerTitle?: string;
  fixedHeader?: boolean;
  headerBackgroundColor?: string;
  headerTextColor?: string;
  navbarBackgroundColor?: string;
  navbarTextColor?: string;
  headerSettings?: HeaderSettingsConfig;
  homepage?: {
    modules: HomepageModuleType[];
    categoriesData?: CategoryData[];
    productsData?: any[];
  };
  productDetail?: ProductDetailConfig;
  productList?: ProductListConfig;
  cart?: CartConfig;
  footer?: FooterConfig;
  design?: DesignConfig;
  advanced?: AdvancedConfig;
}

// Funções para dados do site que não são parte do painel de personalização
export interface ProdutoData {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  imagem_url: string | null;
  categoria_id: string | null;
  imagens_galeria?: string[];
  variacoes?: { tipo: string; opcoes: string[]; }[];
}

export interface BannerData {
  id: string;
  imagem_url: string;
  link_url: string | null;
  titulo: string | null;
  subtitulo: string | null;
  ordem: number;
}

export interface InfoBarItem {
  id: string;
  icone: string;
  titulo: string;
  descricao: string;
}

export interface LojaData {
  id: string;
  nome_loja: string;
  slug: string;
  owner_id: string | null;
  theme_id: string | null;
  configuracoes_tema_json: ThemeConfig | null;
  top_info_bar_text: string | null;
  top_info_bar_link: string | null;
  top_info_bar_active: boolean;
  trackOrderLinkActive: boolean;
  supportLinkActive: boolean;
  lojaLogoUrl?: string | null;
  temas?: { caminho_componente: string; } | null;
}

export interface PlanoSupabase {
  nome_plano: string | null;
  preco_mensal: number | null;
  preco_anual: number | null;
}

export interface AssinaturaSupabase {
  status: string | null;
  periodo_atual_fim: string | null;
  planos: PlanoSupabase[];
}

export interface LojaDataSupabase {
  id: string;
  nome_loja: string;
  slug: string;
  owner_id: string;
  assinaturas: AssinaturaSupabase[];
}

export interface UserProfile {
  id: string;
  email: string | null;
  nome_completo: string | null;
  lojaId: string | null;
  lojaNome: string | null;
  lojaSlug: string | null;
  plano: string | null;
  recorrencia: 'mensal' | 'anual' | null;
  preco_mensal?: number | null;
  preco_anual?: number | null;
}

export type ThemeUpdateFn = (updates: Partial<ThemeConfig>) => void;