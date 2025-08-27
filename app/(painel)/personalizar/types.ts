// Tipos de Módulos da Homepage
// --- INTERFACE PARA UM BANNER INDIVIDUAL ---
export interface SingleBannerData {
  id: string;
  desktopImageUrl?: string;
  mobileImageUrl?: string;
  title?: string; // Título do banner individual
  subtitle?: string; // Subtítulo do banner individual
  buttonText?: string;
  buttonLink?: string;
  overlayColor?: string; // Cor do overlay (mantido)
  overlayOpacity?: number; // Opacidade do overlay (mantido)
  textColor?: string;
  titleFontSize?: string;
  subtitleFontSize?: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  isActive?: boolean; // <<-- isActive está aqui
}

// --- INTERFACE PARA O MÓDULO BANNER ROTATIVO COMPLETO ---
export interface BannerModuleData {
  title?: string; // Título GERAL do módulo (ex: "Nossos Banners Promocionais")
  subtitle?: string; // Subtítulo GERAL do módulo
  
  banners: SingleBannerData[]; // Array de banners individuais
  
  layout?: 'carousel' | 'fade'; // Tipo de transição do carrossel
  autoplay?: boolean; // Se o carrossel deve reproduzir automaticamente
  interval?: number; // Intervalo de tempo entre os slides (em segundos)
  
  isActive: boolean; // <<-- isActive está aqui
}

export interface SingleMiniBannerData {
  id: string;
  imageUrl?: string;
  title?: string;
  subtitle?: string;
  link?: string;
  isActive?: boolean; // <<-- isActive está aqui
}

export interface MiniBannerModuleData {
  title?: string;
  layout?: 'grid' | 'carousel'; // <<-- layout aqui aceita 'grid' ou 'carousel'
  banners: SingleMiniBannerData[];
  isActive: boolean; // <<-- isActive está aqui
}

// --- NOVA INTERFACE PARA UMA VITRINE DE PRODUTOS INDIVIDUAL ---
export interface SingleProductShowcaseData {
  id: string;
  title?: string; // Título desta vitrine específica (ex: "Calças em Destaque")
  displayType?: 'latest' | 'best_sellers' | 'featured' | 'selected';
  categoryId?: string | null; // ID da categoria para filtrar produtos
  productIds?: string[]; // IDs de produtos selecionados manualmente (se displayType for 'selected')
  numberOfProducts?: number;
  isActive?: boolean; // <<-- isActive está aqui
}

export interface ProductShowcaseModuleData {
  title?: string; // Título GERAL do módulo (ex: "Seções de Produtos")
  subtitle?: string; // Subtítulo GERAL do módulo
  
  showcases: SingleProductShowcaseData[]; // Array de vitrines individuais
  
  isActive: boolean; // <<-- isActive está aqui
}

export interface TextImageModuleData {
  title?: string;
  text?: string;
  imageUrl?: string;
  imagePosition?: 'left' | 'right';
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean; // <<-- isActive está aqui
}

export interface NewsletterModuleData {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  privacyPolicyLink?: string;
  isActive: boolean; // <<-- isActive está aqui
}

export interface CategoryData { // <--- INTERFACE CategoryData (para categorias do Supabase)
  id: string;
  nome: string;
  slug: string;
  imagem_url?: string | null;
}

// --- NOVA INTERFACE PARA UMA CATEGORIA SELECIONADA PARA EXIBIÇÃO ---
export interface SelectedCategoryDisplayData {
  id: string; // ID da categoria (do Supabase)
  nome: string; // Nome da categoria (para display no painel)
  slug: string; // Slug da categoria
  imageUrl?: string; // URL da imagem customizada para esta categoria
  isActive?: boolean; // <<-- isActive está aqui
}

export interface CategoriesModuleData {
  title?: string;
  categoriesToDisplay?: SelectedCategoryDisplayData[]; // <--- AGORA É UM ARRAY DE OBJETOS
  layout?: 'grid' | 'carousel';
  isActive: boolean; // <<-- isActive está aqui
}

// --- NOVA INTERFACE PARA UM ITEM DE DESTAQUE INDIVIDUAL ---
export interface SingleHighlightItem { // <--- NOVA INTERFACE EXPORTADA
  id: string; // ID único do item
  icon: string; // Nome do ícone (ex: 'MdStar', 'MdCreditCard') ou emoji
  title: string; // Título do destaque (ex: "Frete Grátis")
  subtitle: string; // Subtítulo do destaque (ex: "Em compras acima de R$199")
  isActive?: boolean; // <<-- isActive está aqui
}

export interface HighlightsModuleData {
  title?: string;
  subtitle?: string; // Adicionado subtítulo geral para o módulo
  highlightItems?: SingleHighlightItem[]; // Array de itens de destaque
  layout?: 'icons-text' | 'cards';
  isActive: boolean; // <<-- isActive está aqui
}

export interface VideoModuleData {
  title?: string;
  videoUrl?: string;
  autoplay?: boolean;
  loop?: boolean;
  controls?: boolean;
  isActive: boolean; // <<-- isActive está aqui
}

// --- NOVA INTERFACE PARA UM DEPOIMENTO INDIVIDUAL ---
export interface SingleTestimonialData { // <--- NOVA INTERFACE EXPORTADA
  id: string;
  text: string; // Texto do depoimento
  author: string; // Nome do autor
  imageUrl?: string; // Imagem do cliente (opcional)
  rating?: 1 | 2 | 3 | 4 | 5; // Avaliação em estrelas (opcional)
  isActive?: boolean; // Se este depoimento individual está ativo
}

export interface TestimonialsModuleData { // <--- NOVA INTERFACE EXPORTADA
  title?: string; // Título geral do módulo (ex: "O que nossos clientes dizem")
  subtitle?: string; // Subtítulo geral do módulo
  testimonials: SingleTestimonialData[]; // Array de depoimentos
  layout?: 'carousel' | 'grid'; // Layout dos depoimentos
  isActive: boolean; // Se o módulo como um todo está ativo
}

// --- NOVAS INTERFACES PARA O MÓDULO DE GALERIA DE IMAGENS ---
export interface SingleImageGalleryData { // <--- NOVA INTERFACE EXPORTADA
  id: string;
  imageUrl?: string; // URL da imagem da galeria
  title?: string; // Título da imagem (opcional)
  link?: string; // Link ao clicar na imagem (opcional)
  isActive?: boolean; // Se esta imagem individual está ativa
}

export interface ImageGalleryModuleData { // <--- NOVA INTERFACE EXPORTADA
  title?: string; // Título geral do módulo (ex: "Nossa Galeria")
  subtitle?: string; // Subtítulo geral do módulo
  images: SingleImageGalleryData[]; // Array de imagens da galeria
  layout?: 'grid' | 'carousel'; // Layout da galeria
  gridColumns?: 2 | 3 | 4; // Número de colunas se o layout for grid
  isActive: boolean; // Se o módulo como um todo está ativo
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
  showQuickLinks?: boolean; // Propriedade de links rápidos foi substituída, se for o caso
  quickLinksTitle?: string;
  quickLinks?: Array<{ id: string; text: string; url: string }>;

  

  showMenu?: boolean; // Adicione esta linha
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

  // ADD THE MISSING PROPERTIES HERE
  showShippingMethods?: boolean; // New property for the checkbox
  shippingMethodsImages?: Array<{ id: string; imageUrl: string; }>; // New property for the array of images

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
}

// Tipo Union para Módulos da Homepage
// A propriedade 'data' agora é 'any' para simplificar a inferência no HomepageEditor
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
  | { id: string; type: 'image_gallery'; data: ImageGalleryModuleData }; // <--- ADICIONADO AQUI

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
  fixedHeader?: boolean;
  headerBackgroundColor?: string;
  headerTextColor?: string;

  navbarBackgroundColor?: string;
  navbarTextColor?: string;

  headerSettings?: HeaderSettingsConfig;

  homepage?: {
    modules: HomepageModuleType[];
    categoriesData?: CategoryData[]; // <--- Adicionado para passar categorias disponíveis
    productsData?: any[]; // <--- Adicionado para passar produtos disponíveis (para seleção)
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