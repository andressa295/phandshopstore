// public/themes/tema-base-1/script.js

// Objeto de configuração padrão do tema (fallback)
// Usado se o painel de edição não injetar suas próprias configurações via postMessage.
// Garante que o tema tenha valores para todas as propriedades essenciais.
const defaultThemeConfig = {
    primaryColor: '#8d4edb', // Roxo padrão
    secondaryColor: '#f0f0f0', // Cinza claro padrão
    textColor: '#333333', // Preto padrão
    headerBackgroundColor: '#ffffff', // Branco padrão
    headerTextColor: '#333333', // Preto padrão
    navbarBackgroundColor: '#8d4edb', // Roxo padrão
    navbarTextColor: '#ffffff', // Branco padrão
    searchBarBackgroundColor: '#ffffff', // Branco padrão para barra de busca
    fixedHeader: false, // Cabeçalho não fixo por padrão
    headerTitle: 'Minha Loja Phandlandia', // Título de fallback
    
    headerSettings: {
        logoUrl: '', // Será preenchido pelo painel se houver uma logo
        desktopSearch: 'bar', // Padrão: barra de busca no desktop
        mobileSearch: 'icon', // Padrão: ícone de busca no mobile
        showAnnouncementBar: false,
        announcementText: '🎉 Frete Grátis para todo Brasil em compras acima de R$199!',
        announcementLink: '/ofertas',
        announcementBackgroundColor: '#4a0a8f',
        announcementTextColor: '#ffffff',
        announcementMarquee: true,
        iconSize: 'medium', // small, medium, large
        logoSize: 'medium', // small, medium, large
        useCustomHeaderColors: false, // Se true, usa cores de headerSettings
        headerBackgroundColor: '#ffffff',
        headerTextColor: '#333333',
        searchBarBackgroundColor: '#f8f8f8',
    },
    
    footer: {
        footerBackgroundColor: '#212529', // Cinza escuro
        footerTextColor: '#f8f9fa', // Branco quase
        showQuickLinks: true,
        quickLinksTitle: 'Institucional',
        quickLinks: [
            { text: 'Quem Somos', url: '/quem-somos' },
            { text: 'Política de Trocas', url: '/trocas-e-devolucoes' },
            { text: 'Política de Privacidade', url: '/politica-privacidade' },
            { text: 'Termos de Uso', url: '/termos-de-uso' }
        ],
        showSocialMediaIcons: true,
        socialMediaTitle: 'Siga-nos nas Redes Sociais',
        socialMediaLinks: [
            { platform: 'instagram', url: 'https://instagram.com/sua_loja_padrao' },
            { platform: 'facebook', url: 'https://facebook.com/sua_loja_padrao' },
            { platform: 'x', url: 'https://x.com/sua_loja_padrao' },
            { platform: 'youtube', url: 'https://www.youtube.com/user/sua_loja_padrao' },
        ],
        showNewsletterSignup: true,
        newsletterTitle: 'Newsletter',
        newsletterSubtitle: 'Inscreva-se e não perca nenhuma novidade!',
        privacyPolicyLink: '/politica-privacidade',
        showContactInfo: true,
        contactAddress: 'Rua da Amostra, 123 - Bairro Teste, Cidade/Estado, CEP',
        contactPhone: '(XX) XXXX-XXXX',
        contactEmail: 'contato@seusite.com.br',
        showPaymentMethods: true,
        paymentMethodsImages: [
            { imageUrl: '/images/payment/visa.png' }, // Exemplo, você precisa ter esses ícones
            { imageUrl: '/images/payment/mastercard.png' },
            { imageUrl: '/images/payment/boleto.png' },
            { imageUrl: '/images/payment/pix.png' }
        ],
        showCopyright: true,
        copyrightText: `© ${new Date().getFullYear()} Sua Loja Padrão. Todos os direitos reservados.`,
        showCnpj: false,
        cnpjText: 'CNPJ: XX.XXX.XXX/XXXX-XX'
    },
    
    primaryFont: 'Roboto', // Fonte principal padrão
    secondaryFont: 'Open Sans', // Fonte secundária padrão
    titleBaseFontSize: 'medium', // small, medium, large
    textBaseFontSize: 'medium', // small, medium, large
    
    design: {
        buttonBorderRadius: 'rounded', // square, rounded, oval
        imageBorderRadius: 'rounded', // square, rounded, circle
        enableShadows: true,
        shadowStyle: 'medium', // small, medium, large, none
        enableCustomScrollbar: true,
        scrollbarColor: '#8d4edb',
        enableHoverEffects: true,
        buttonHoverAnimation: 'scale', // scale, opacity, none
        imageHoverEffect: 'zoom', // grayscale, zoom, none
        cartIcon: 'shopping_bag_outlined', // cart, bag, shopping_cart_outlined, shopping_bag_outlined
        showCartIconText: true,
        cartIconTextColor: '#333333',
    },

    homepage: {
        modules: [
            { 
                type: 'banner', 
                isActive: true, 
                data: { 
                    title: 'Descubra a Nova Coleção!', 
                    subtitle: 'Estilo e qualidade que você merece.', 
                    buttonText: 'Explorar Agora', 
                    buttonLink: '/novidades', 
                    desktopImageUrl: '/images/homepage/default_banner_hero_desktop.jpg',
                    mobileImageUrl: '/images/homepage/default_banner_hero_mobile.jpg',
                    overlayColor: '#000000', 
                    overlayOpacity: 0.3, 
                    textColor: '#ffffff',
                    titleFontSize: '3em',
                    subtitleFontSize: '1.5em',
                    buttonBackgroundColor: '#ff7f50', 
                    buttonTextColor: '#ffffff' 
                } 
            },
            {
                type: 'mini_banners',
                isActive: true,
                data: { 
                    title: 'Por Que Comprar Conosco?', 
                    banners: [
                        { id: '1', imageUrl: 'https://via.placeholder.com/300x150?text=Compra+Segura', link: '#', title: 'Compra Segura', subtitle: 'Seus dados protegidos.' },
                        { id: '2', imageUrl: 'https://via.placeholder.com/300x150?text=Entrega+Rapida', link: '#', title: 'Entrega Rápida', subtitle: 'Receba em poucos dias.' },
                        { id: '3', imageUrl: 'https://via.placeholder.com/300x150?text=Suporte+24/7', link: '#', title: 'Suporte 24/7', subtitle: 'Estamos sempre aqui para você.' }
                    ], 
                    layout: 'grid'
                },
            },
            {
                type: 'product_showcase',
                isActive: true,
                data: { title: 'Mais Vendidos', displayType: 'best_sellers', productIds: [], numberOfProducts: 8 },
            },
            {
                type: 'text_image',
                isActive: true,
                data: { title: 'Sobre Nossa Marca', text: 'Conheça um pouco da nossa história e dos valores que nos movem. Qualidade, paixão e compromisso com você. Somos dedicados a oferecer os melhores produtos e um atendimento excepcional.', imageUrl: `https://via.placeholder.com/600x400?text=Texto+Imagem`, imagePosition: 'left', buttonText: 'Saiba Mais', buttonLink: '/sobre' },
            },
            {
                type: 'newsletter',
                isActive: true,
                data: { title: 'Assine Nossa Newsletter', subtitle: 'Receba ofertas exclusivas e novidades diretamente no seu e-mail!', buttonText: 'Assinar', privacyPolicyLink: '/politica-privacidade' },
            },
            {
                type: 'categories',
                isActive: true,
                data: { title: 'Explore Nossas Categorias', selectedCategories: ['Eletrônicos', 'Moda Feminina', 'Casa & Decoração', 'Beleza & Saúde', 'Esportes'], layout: 'grid' },
            },
            {
                type: 'highlights',
                isActive: true,
                data: { title: 'Por Que Escolher a Gente?', highlightItems: [{ icon: 'fa-solid fa-gem', text: 'Produtos de Alta Qualidade' }, { icon: 'fa-solid fa-truck-fast', text: 'Envio Rápido e Seguro' }, { icon: 'fa-solid fa-credit-card', text: 'Diversas Formas de Pagamento' }, { icon: 'fa-solid fa-headset', text: 'Atendimento Personalizado' }], layout: 'icons-text' },
            },
            {
                type: 'video',
                isActive: true,
                data: { title: 'Assista Nosso Vídeo Institucional', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', autoplay: false, loop: false, controls: true },
            },
        ]
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
        showBreadcrumbs: true, // Adicionado para simulação
        showAddToCartButton: true, // Adicionado para simulação
        showShareButtons: true, // Adicionado para simulação
    },

    productList: {
        layout: 'grid', // 'grid' ou 'list'
        productsPerPage: 12,
        gridColumns: 3, // 2, 3, 4 (para grid)
        enableFilters: true,
        enableSorting: true,
        showProductImage: true,
        showProductName: true,
        showProductPrice: true,
        showProductDescriptionSnippet: false, // Apenas para layout 'list'
        showAddToCartButton: true,
        addToCartButtonColor: '#8d4edb',
        showQuickViewButton: true
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
        showContinueShoppingButton: true, // Adicionado para simulação
        checkoutButtonColor: '#8d4edb', // Adicionado para simulação
    },
    advanced: {
        customCss: `/* Adicione seu CSS personalizado aqui */\n\n/* Exemplo: .meu-elemento { color: red; } */`,
        customJs: `/* Adicione seu JavaScript personalizado aqui */\n\n// Exemplo: console.log('Script personalizado carregado!');`,
        faviconUrl: '/favicon.ico',
        enableLazyLoading: true,
        enableCodeMinification: true,
    },
};

// Variável para armazenar a configuração atual do tema.
// Começa com a configuração padrão até que uma seja recebida via postMessage.
let currentThemeConfig = defaultThemeConfig; 

// --- Funções Auxiliares para Manipulação do DOM ---
function createElement(tag, className = '', textContent = '', attributes = {}) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (textContent) el.textContent = textContent;
    for (const key in attributes) {
        if (attributes.hasOwnProperty(key)) {
            el.setAttribute(key, attributes[key]);
        }
    }
    return el;
}

function clearContainer(containerId) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = '';
    }
    return container;
}

function getEmbedVideoUrl(videoUrl, autoplay, loop, controls) {
    let finalUrl = videoUrl;
    const params = [];

    // Adaptação para URLs do YouTube
    if (videoUrl.includes('youtube.com/') || videoUrl.includes('youtu.be/')) {
        const youtubeIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
        const videoId = youtubeIdMatch ? youtubeIdMatch[1] : null; 
        
        if (videoId) {
            finalUrl = `https://www.youtube.com/embed/${videoId}`;
            if (loop) params.push(`playlist=${videoId}`); // YouTube loop requires playlist
            params.push('rel=0'); // Don't show related videos
        } else {
            return null; // Invalid YouTube URL
        }
    } else if (videoUrl.includes('vimeo.com')) {
        const vimeoIdMatch = videoUrl.match(/(?:vimeo\.com\/)(\d+)/);
        const videoId = vimeoIdMatch ? vimeoIdMatch[1] : null;
        if (videoId) {
            finalUrl = `https://player.vimeo.com/video/${videoId}`;
            if (loop) params.push('loop=1');
        } else {
            return null; // Invalid Vimeo URL
        }
    } else {
        // Para outras URLs, tenta usar diretamente (pode não funcionar para todos os tipos)
        // Você pode adicionar mais validações ou tratamento de erro aqui se precisar.
        return videoUrl; 
    }

    if (autoplay) params.push('autoplay=1');
    if (controls) params.push('controls=1');
    
    return `${finalUrl}?${params.join('&')}`;
}

// --- Funções de Renderização dos Módulos da Homepage ---
function renderHomepageModules(config) {
    const container = clearContainer('homepage-modules-container');
    if (!container) return;

    const homepageModules = config.homepage?.modules;
    if (!homepageModules || !Array.isArray(homepageModules) || homepageModules.length === 0) {
        console.warn('Configuração de módulos da homepage inválida ou vazia.');
        container.innerHTML = `
            <div class="theme-module" style="text-align: center; padding: 50px;">
                <h2 style="color: ${config.primaryColor};">Configure sua Página Inicial!</h2>
                <p style="color: ${config.textColor};">Adicione banners, vitrines de produtos e outras seções pelo painel de edição.</p>
                <img src="https://via.placeholder.com/600x200?text=Sua+Homepage+Aqui" alt="Placeholder Homepage" style="max-width: 100%; margin-top: 20px;">
            </div>
        `;
        return;
    }

    homepageModules.forEach(module => {
        let moduleElement = null;

        // Verifica se o módulo está ativo. Se a propriedade isActive não estiver definida, assume como true.
        const isActive = module.data?.isActive !== undefined ? module.data.isActive : module.isActive;
        if (!isActive) return;

        switch (module.type) {
            case 'banner':
                const bannerData = module.data;
                moduleElement = createElement('div', 'theme-module theme-banner-module');
                const imageUrl = (window.innerWidth >= 768 && bannerData.desktopImageUrl) ? bannerData.desktopImageUrl : (bannerData.mobileImageUrl || bannerData.imageUrl);
                
                moduleElement.style.backgroundImage = `url(${imageUrl || 'https://via.placeholder.com/1200x400?text=Banner+Principal'})`;
                moduleElement.innerHTML = `
                    <div class="banner-overlay" style="background-color: ${bannerData.overlayColor || '#000000'}; opacity: ${bannerData.overlayOpacity || 0.4};"></div>
                    <div class="banner-content">
                        <h2 style="color: ${bannerData.textColor || '#ffffff'}; font-size: ${bannerData.titleFontSize || '3em'};">${bannerData.title || 'Título do Banner'}</h2>
                        <p style="color: ${bannerData.textColor || '#ffffff'}; font-size: ${bannerData.subtitleFontSize || '1.5em'};">${bannerData.subtitle || 'Subtítulo do Banner'}</p>
                        <a href="${bannerData.buttonLink || '#'}" class="theme-button" 
                            style="background-color: ${bannerData.buttonBackgroundColor || config.primaryColor}; color: ${bannerData.buttonTextColor || '#ffffff'};">
                            ${bannerData.buttonText || 'Comprar'}
                        </a>
                    </div>
                `;
                break;
            case 'mini_banners':
                const miniBannerData = module.data;
                moduleElement = createElement('section', 'theme-module theme-mini-banners-module');
                moduleElement.innerHTML = `<h3 class="module-title">${miniBannerData.title || 'Mini Banners'}</h3>`;
                
                const miniBannersContainer = createElement('div', `mini-banners-${miniBannerData.layout || 'grid'}-grid`);
                if (miniBannerData.banners && miniBannerData.banners.length > 0) {
                    miniBannerData.banners.forEach(banner => {
                        miniBannersContainer.innerHTML += `
                            <a href="${banner.link || '#'}" class="mini-banner-item theme-card">
                                <img src="${banner.imageUrl || 'https://via.placeholder.com/300x150?text=MiniBanner'}" alt="${banner.title || 'Mini Banner'}">
                                <h4>${banner.title || 'Título'}</h4>
                                <p>${banner.subtitle || 'Subtítulo'}</p>
                            </a>
                        `;
                    });
                } else {
                    miniBannersContainer.innerHTML = '<p style="text-align:center; color:#999;">Adicione mini banners nas configurações do painel.</p>';
                }
                moduleElement.appendChild(miniBannersContainer);
                break;
            case 'product_showcase':
                const productShowcaseData = module.data;
                moduleElement = createElement('section', 'theme-module theme-product-showcase-module');
                moduleElement.innerHTML = `<h3 class="module-title">${productShowcaseData.title || 'Produtos em Destaque'}</h3>`;
                
                const productsGrid = createElement('div', 'theme-product-grid-container theme-product-list-grid');
                const numProducts = productShowcaseData.numberOfProducts || 4; 
                if (numProducts > 0) {
                    for (let i = 0; i < numProducts; i++) {
                        productsGrid.innerHTML += `
                            <div class="theme-product-item theme-card">
                                <img src="https://via.placeholder.com/200x200?text=Produto+${i+1}" alt="Produto ${i+1}" class="product-image">
                                <h4 class="product-title">Produto de Exemplo ${i+1}</h4>
                                <p class="product-price">R$ ${(50 + i * 5).toFixed(2).replace('.', ',')}</p>
                                <button class="theme-button" style="background-color: ${config.productList?.addToCartButtonColor ?? config.primaryColor};">Adicionar ao Carrinho</button>
                            </div>
                        `;
                    }
                } else {
                    productsGrid.innerHTML = '<p style="text-align:center; color:#999;">Nenhum produto para mostrar.</p>';
                }
                moduleElement.appendChild(productsGrid);
                break;
            case 'text_image':
                const textImageData = module.data;
                moduleElement = createElement('section', 'theme-module theme-text-image-module');
                moduleElement.classList.add(`image-${textImageData.imagePosition || 'left'}`);
                moduleElement.innerHTML = `
                    <div class="text-content">
                        <h3 class="module-title">${textImageData.title || 'Título da Seção'}</h3>
                        <p>${textImageData.text || 'Texto descritivo da seção. Use esta área para falar sobre sua marca, uma promoção específica ou qualquer informação relevante.'}</p>
                        <a href="${textImageData.buttonLink || '#'}" class="theme-button" style="background-color: ${config.primaryColor}; color: #ffffff;">${textImageData.buttonText || 'Saiba Mais'}</a>
                    </div>
                    <div class="image-content">
                        <img src="${textImageData.imageUrl || 'https://via.placeholder.com/600x400?text=Imagem+Aqui'}" alt="${textImageData.title || 'Imagem'}">
                    </div>
                `;
                break;
            case 'newsletter':
                const newsletterData = module.data;
                moduleElement = createElement('section', 'theme-module theme-newsletter-module');
                moduleElement.innerHTML = `
                    <h3 class="module-title">${newsletterData.title || 'Assine Nossa Newsletter'}</h3>
                    <p>${newsletterData.subtitle || 'Receba ofertas exclusivas e novidades diretamente no seu e-mail!'}</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="Seu e-mail" required>
                        <button type="submit" class="theme-button" style="background-color: ${config.primaryColor}; color: #ffffff;">${newsletterData.buttonText || 'Assinar'}</button>
                    </form>
                    <p class="privacy-link"><a href="${newsletterData.privacyPolicyLink || '#'}">Política de Privacidade</a></p>
                `;
                break;
            case 'categories':
                const categoriesData = module.data;
                moduleElement = createElement('section', 'theme-module theme-categories-module');
                moduleElement.innerHTML = `<h3 class="module-title">${categoriesData.title || 'Explore Nossas Categorias'}</h3>`;
                
                const categoriesContainer = createElement('div', `categories-${categoriesData.layout || 'grid'}-grid`);
                const categoriesToDisplay = categoriesData.selectedCategories && categoriesData.selectedCategories.length > 0
                    ? categoriesData.selectedCategories
                    : ['Categoria 1', 'Categoria 2', 'Categoria 3', 'Categoria 4']; // Fallback
                
                categoriesToDisplay.forEach(cat => {
                    categoriesContainer.innerHTML += `
                        <a href="/categorias/${typeof cat === 'string' ? cat.toLowerCase().replace(/\s/g, '-') : 'categoria-exemplo'}" class="category-item theme-card">
                            <img src="https://via.placeholder.com/100x100?text=${typeof cat === 'string' ? cat : 'Cat'}" alt="${typeof cat === 'string' ? cat : 'Categoria'}">
                            <h4>${typeof cat === 'string' ? cat : 'Nome Categoria'}</h4>
                        </a>
                    `;
                });
                moduleElement.appendChild(categoriesContainer);
                break;
            case 'highlights':
                const highlightsData = module.data;
                moduleElement = createElement('section', 'theme-module theme-highlights-module');
                moduleElement.innerHTML = `<h3 class="module-title">${highlightsData.title || 'Destaques'}</h3>`;
                
                const highlightsContainer = createElement('div', `highlights-${highlightsData.layout || 'icons-text'}-container`);
                if (highlightsData.highlightItems && highlightsData.highlightItems.length > 0) {
                    highlightsData.highlightItems.forEach(item => {
                        const iconHtml = item.icon?.startsWith('fa-') ? `<i class="${item.icon}"></i>` : (item.icon || '✨'); // Fallback icon
                        highlightsContainer.innerHTML += `
                            <div class="highlight-item theme-card">
                                <span class="highlight-icon" style="color: ${config.primaryColor};">${iconHtml}</span>
                                <p class="highlight-text">${item.text || 'Destaque importante'}</p>
                            </div>
                        `;
                    });
                } else {
                    highlightsContainer.innerHTML = '<p style="text-align:center; color:#999;">Adicione itens de destaque nas configurações.</p>';
                }
                moduleElement.appendChild(highlightsContainer);
                break;
            case 'video':
                const videoData = module.data;
                moduleElement = createElement('section', 'theme-module theme-video-module');
                
                const embedUrl = getEmbedVideoUrl(videoData.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', videoData.autoplay, videoData.loop, videoData.controls); 
                
                if (embedUrl) {
                    moduleElement.innerHTML = `
                        <h3 class="module-title">${videoData.title || 'Assista Nosso Vídeo'}</h3>
                        <div class="video-wrapper">
                            <iframe 
                                src="${embedUrl}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen
                            ></iframe>
                        </div>
                    `;
                } else {
                    moduleElement.innerHTML = `<p style="text-align:center; color:#999;">URL de vídeo inválida ou não suportada para pré-visualização.</p>`;
                }
                break;
            default:
                console.warn('Tipo de módulo desconhecido:', module.type);
        }

        if (moduleElement) {
            container.appendChild(moduleElement);
        }
    });
}

// --- Funções para Aplicar Configurações Gerais (Header, Footer, Design) ---
function applyGeneralConfig(config) {
    const headerSettings = config.headerSettings || {};
    const themeHeader = document.querySelector('.theme-header');
    const headerTitleEl = document.getElementById('theme-header-title');
    const headerLogoImg = document.getElementById('theme-header-logo');
    const announcementBarContainer = clearContainer('theme-announcement-bar-container');
    const searchBarContainerDesktop = clearContainer('theme-search-bar-container-desktop');
    const searchBarContainerMobile = clearContainer('theme-search-bar-container-mobile');

    // Aplica variáveis CSS dinamicamente ao :root do documento do IFRAME
    const root = document.documentElement;
    root.style.setProperty('--primary-color', config.primaryColor ?? defaultThemeConfig.primaryColor);
    root.style.setProperty('--secondary-color', config.secondaryColor ?? defaultThemeConfig.secondaryColor);
    root.style.setProperty('--text-color', config.textColor ?? defaultThemeConfig.textColor);

    // Cores do Header
    root.style.setProperty('--header-background-color', headerSettings.useCustomHeaderColors ? (headerSettings.headerBackgroundColor ?? defaultThemeConfig.headerSettings.headerBackgroundColor) : (config.headerBackgroundColor ?? defaultThemeConfig.headerBackgroundColor));
    root.style.setProperty('--header-text-color', headerSettings.useCustomHeaderColors ? (headerSettings.headerTextColor ?? defaultThemeConfig.headerSettings.headerTextColor) : (config.headerTextColor ?? defaultThemeConfig.headerTextColor));
    root.style.setProperty('--navbar-background-color', config.navbarBackgroundColor ?? defaultThemeConfig.navbarBackgroundColor);
    root.style.setProperty('--navbar-text-color', config.navbarTextColor ?? defaultThemeConfig.navbarTextColor);
    root.style.setProperty('--search-bar-background-color', headerSettings.searchBarBackgroundColor ?? defaultThemeConfig.headerSettings.searchBarBackgroundColor);
    root.style.setProperty('--search-bar-text-color', config.textColor ?? defaultThemeConfig.textColor); // Usa a cor de texto geral para o input de busca
    root.style.setProperty('--search-icon-color', config.textColor ?? defaultThemeConfig.textColor); // Usa a cor de texto geral para o ícone de busca


    // Cores do Footer
    root.style.setProperty('--footer-background-color', config.footer?.footerBackgroundColor ?? defaultThemeConfig.footer.footerBackgroundColor);
    root.style.setProperty('--footer-text-color', config.footer?.footerTextColor ?? defaultThemeConfig.footer.footerTextColor);
    // Inverte ícones sociais se o texto do footer for claro (assumindo ícones svg escuros por padrão)
    root.style.setProperty('--footer-invert-social-icons', (config.footer?.footerTextColor === '#ffffff' || config.footer?.footerTextColor === '#f8f9fa') ? '1' : '0'); 

    // Fontes
    root.style.setProperty('--primary-font', `'${config.primaryFont ?? defaultThemeConfig.primaryFont}', sans-serif`);
    root.style.setProperty('--secondary-font', `'${config.secondaryFont ?? defaultThemeConfig.secondaryFont}', sans-serif`);

    const baseFontSizeMap = { 'small': '0.875em', 'medium': '1em', 'large': '1.125em' };
    const titleFontSizeMap = { 'small': '2em', 'medium': '2.5em', 'large': '3em' };

    root.style.setProperty('--title-base-font-size-value', titleFontSizeMap[config.titleBaseFontSize || 'medium']);
    root.style.setProperty('--text-base-font-size-value', baseFontSizeMap[config.textBaseFontSize || 'medium']);
    root.style.setProperty('--icon-base-size', config.headerSettings?.iconSize === 'small' ? '1em' : config.headerSettings?.iconSize === 'large' ? '1.5em' : '1.2em');

    // Design
    root.style.setProperty('--button-border-radius', 
        config.design?.buttonBorderRadius === 'square' ? '0' : 
        config.design?.buttonBorderRadius === 'rounded' ? '8px' : 
        config.design?.buttonBorderRadius === 'oval' ? '9999px' : '8px' 
    );
    root.style.setProperty('--image-border-radius',
        config.design?.imageBorderRadius === 'square' ? '0' :
        config.design?.imageBorderRadius === 'rounded' ? '8px' :
        config.design?.imageBorderRadius === 'circle' ? '50%' : '0'
    );
    root.style.setProperty('--shadow-style', config.design?.enableShadows && config.design.shadowStyle !== 'none' ?
        (config.design.shadowStyle === 'small' ? '0 1px 3px rgba(0,0,0,0.1)' :
         config.design.shadowStyle === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
         '0 8px 16px rgba(0,0,0,0.2)') : 'none');
    
    // Custom Scrollbar
    if (config.design?.enableCustomScrollbar) {
        root.style.setProperty('--scrollbar-color', config.design?.scrollbarColor ?? config.primaryColor);
        // Adiciona classe para ativar o CSS customizado do scrollbar (se você tiver)
        document.body.classList.add('custom-scrollbar-enabled'); 
    } else {
        document.body.classList.remove('custom-scrollbar-enabled');
    }

    // ANNOUNCEMENT BAR
    if (announcementBarContainer && (headerSettings.showAnnouncementBar ?? false)) {
        const announcementBar = createElement('div', 'theme-announcement-bar');
        announcementBar.style.backgroundColor = headerSettings.announcementBackgroundColor ?? defaultThemeConfig.headerSettings.announcementBackgroundColor;
        announcementBar.style.color = headerSettings.announcementTextColor ?? defaultThemeConfig.headerSettings.announcementTextColor;

        if (headerSettings.announcementMarquee) {
            announcementBar.classList.add('marquee');
            announcementBar.innerHTML = `<a href="${headerSettings.announcementLink || '#'}" class="announcement-content">${headerSettings.announcementText || ''}</a>`;
        } else {
            announcementBar.innerHTML = `<a href="${headerSettings.announcementLink || '#'}">${headerSettings.announcementText || ''}</a>`;
        }
        announcementBarContainer.appendChild(announcementBar);
    } else if (announcementBarContainer) { 
        announcementBarContainer.innerHTML = ''; // Limpa se estiver desativada
    }

    // HEADER - LOGO AND TITLE
    if (headerLogoImg && headerTitleEl) {
        if (headerSettings.logoUrl) {
            headerLogoImg.src = headerSettings.logoUrl;
            headerLogoImg.style.display = 'block';
            // Ajusta o tamanho da logo com base na configuração
            const logoSizes = { 'small': '40px', 'medium': '60px', 'large': '80px' };
            headerLogoImg.style.maxHeight = logoSizes[config.headerSettings?.logoSize || 'medium']; 
            headerTitleEl.style.display = 'none';
        } else {
            headerLogoImg.style.display = 'none';
            headerTitleEl.textContent = config.headerTitle || defaultThemeConfig.headerTitle; 
            headerTitleEl.style.display = 'block'; 
        }
    }

    // HEADER - SEARCH BAR (Desktop and Mobile)
    const renderSearchBar = (container, isDesktop) => {
        const searchSetting = isDesktop ? headerSettings.desktopSearch : headerSettings.mobileSearch;
        
        // Remove listeners antigos para evitar duplicação antes de limpar
        const oldSearchIcon = container.querySelector('.theme-search-icon');
        if (oldSearchIcon) {
            oldSearchIcon.removeEventListener('click', toggleSearchBarInput);
        }
        container.innerHTML = ''; // Limpa o container

        if (searchSetting === 'bar') {
            container.innerHTML = `
                <input type="search" placeholder="Buscar produtos..." class="theme-search-bar">
                <button class="theme-search-button" aria-label="Buscar"><i class="fa-solid fa-search"></i></button>
            `;
        } else if (searchSetting === 'icon') {
            container.innerHTML = `<span class="theme-search-icon"><i class="fa-solid fa-search"></i></span>`;
            // Adiciona o listener para o ícone que abre/fecha a barra de busca
            const newSearchIcon = container.querySelector('.theme-search-icon');
            if (newSearchIcon) {
                newSearchIcon.addEventListener('click', toggleSearchBarInput);
            }
        } else { // 'none'
            // Container já está limpo
        }
    };

    function toggleSearchBarInput(event) {
        const searchIconContainer = event.currentTarget.parentNode;
        const searchInput = searchIconContainer.querySelector('.theme-search-bar');
        
        if (searchInput) {
            searchInput.classList.toggle('active');
            if (searchInput.classList.contains('active')) {
                searchInput.focus();
            }
        }
    }

    renderSearchBar(searchBarContainerDesktop, true);
    renderSearchBar(searchBarContainerMobile, false);

    // Fixed Header
    if (config.fixedHeader) {
        themeHeader.classList.add('fixed-header');
    } else {
        themeHeader.classList.remove('fixed-header');
    }

    // Update cart and tracking icons based on design config
    const cartLink = document.querySelector('.header-user-actions .cart-link');
    const trackingLink = document.querySelector('a[href="/rastreamento"]');

    if (cartLink) {
        const cartIconElement = cartLink.querySelector('i');
        if (cartIconElement && config.design?.cartIcon) {
            cartIconElement.className = ''; 
            const iconMapping = {
                'cart': ['fa-solid', 'fa-shopping-cart'],
                'bag': ['fa-solid', 'fa-shopping-bag'],
                'shopping_cart_outlined': ['fa-regular', 'fa-cart-shopping'],
                'shopping_bag_outlined': ['fa-regular', 'fa-bag-shopping'],
            };
            const classesToAdd = iconMapping[config.design.cartIcon] || iconMapping['cart'];
            cartIconElement.classList.add(...classesToAdd);
        }
        // Exibe/oculta o texto "Meu Carrinho" ao lado do ícone
        const cartTextSpan = cartLink.querySelector('.cart-link .cart-text');
        if (!cartTextSpan) { // Se o span de texto não existir, cria
            const textEl = createElement('span', 'cart-text', 'Meu Carrinho');
            cartLink.insertBefore(textEl, cartLink.querySelector('.cart-count'));
        }
        // Ajusta a visibilidade do texto "Meu Carrinho"
        const finalCartTextSpan = cartLink.querySelector('.cart-link .cart-text');
        if (finalCartTextSpan) {
            finalCartTextSpan.style.display = (config.design?.showCartIconText ?? true) ? 'inline' : 'none';
        }
        cartLink.style.color = config.design?.cartIconTextColor ?? 'inherit';
    }
    
    // Simulação do ícone de rastreamento (o themeConfig não tem essa propriedade, adicionei no default para fins de demonstração)
    if (trackingLink) {
        const trackingIconElement = trackingLink.querySelector('i');
        if (trackingIconElement && config.design?.trackingIcon) {
            trackingIconElement.className = ''; 
            const iconMapping = {
                'box': ['fa-solid', 'fa-box'],
                'truck': ['fa-solid', 'fa-truck'],
                'box_open_outlined': ['fa-regular', 'fa-box-open'],
                'truck_fast_outlined': ['fa-regular', 'fa-truck-fast'],
            };
            const classesToAdd = iconMapping[config.design.trackingIcon] || iconMapping['truck'];
            trackingIconElement.classList.add(...classesToAdd);
        }
    }

    // FOOTER - Renderização detalhada
    const footerContentContainer = clearContainer('footer-content-container');
    if (footerContentContainer && config.footer) {
        let footerHtml = '';

        if (config.footer.showQuickLinks && config.footer.quickLinks?.length > 0) {
            footerHtml += `
                <div class="footer-section quick-links">
                    <h4>${config.footer.quickLinksTitle || defaultThemeConfig.footer.quickLinksTitle}</h4>
                    <ul>
                        ${config.footer.quickLinks.map(link => `<li><a href="${link.url || '#'}">${link.text || 'Link'}</a></li>`).join('')}
                    </ul>
                </div>
            `;
        }
        if (config.footer.showSocialMediaIcons && config.footer.socialMediaLinks?.length > 0) {
            footerHtml += `
                <div class="footer-section social-media">
                    <h4>${config.footer.socialMediaTitle || defaultThemeConfig.footer.socialMediaTitle}</h4>
                    <div class="social-icons">
                        ${config.footer.socialMediaLinks.map(link => `
                            <a href="${link.url || '#'}" target="_blank" aria-label="${link.platform || 'social media'}">
                                <img src="/icons/${link.platform}.svg" onerror="this.src='https://via.placeholder.com/24?text=${link.platform.substring(0,2).toUpperCase()}'" alt="${link.platform} icon" width="24" height="24">
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        if (config.footer.showNewsletterSignup) {
            footerHtml += `
                <div class="footer-section newsletter-signup">
                    <h4>${config.footer.newsletterTitle || defaultThemeConfig.footer.newsletterTitle}</h4>
                    <p>${config.footer.newsletterSubtitle || defaultThemeConfig.footer.newsletterSubtitle}</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="Seu e-mail" required>
                        <button type="submit" class="theme-button" style="background-color: ${config.primaryColor}; color: #ffffff;">${config.footer.buttonText || 'Assinar'}</button>
                    </form>
                    <p class="privacy-link"><a href="${config.footer.privacyPolicyLink || '#'}">Política de Privacidade</a></p>
                </div>
            `;
        }
        if (config.footer.showContactInfo) {
            footerHtml += `
                <div class="footer-section contact-info">
                    <h4>Contato</h4>
                    <p>${config.footer.contactAddress || defaultThemeConfig.footer.contactAddress}</p>
                    <p>Telefone: <a href="tel:${config.footer.contactPhone}">${config.footer.contactPhone || defaultThemeConfig.footer.contactPhone}</a></p>
                    <p>Email: <a href="mailto:${config.footer.contactEmail}">${config.footer.contactEmail || defaultThemeConfig.footer.contactEmail}</a></p>
                </div>
            `;
        }
        if (config.footer.showPaymentMethods && config.footer.paymentMethodsImages?.length > 0) {
            footerHtml += `
                <div class="footer-section payment-methods">
                    <h4>Formas de Pagamento</h4>
                    <div class="payment-icons">
                        ${config.footer.paymentMethodsImages.map(img => `<img src="${img.imageUrl || 'https://via.placeholder.com/50x30?text=Pag'}" alt="Forma de Pagamento">`).join('')}
                    </div>
                </div>
            `;
        }
        
        if (config.footer.showCopyright || config.footer.showCnpj) {
             footerHtml += `
                <div class="footer-bottom-info">
                    ${config.footer.showCopyright ? `<p class="footer-copyright">${config.footer.copyrightText || defaultThemeConfig.footer.copyrightText}</p>` : ''}
                    ${config.footer.showCnpj ? `<p class="footer-cnpj">${config.footer.cnpjText || defaultThemeConfig.footer.cnpjText}</p>` : ''}
                </div>
              `;
        }
        
        footerContentContainer.innerHTML = footerHtml;
    }

    // Aplica classes de design para efeitos de hover
    document.querySelectorAll('.theme-card, .theme-product-item, .theme-button').forEach(el => {
        el.classList.remove('theme-hover-scale', 'theme-hover-opacity'); 
        if (config.design?.enableHoverEffects) {
            if (config.design.buttonHoverAnimation === 'scale') {
                el.classList.add('theme-hover-scale');
            } else if (config.design.buttonHoverAnimation === 'opacity') {
                el.classList.add('theme-hover-opacity');
            }
        }
    });
    // Efeitos de hover em imagens
    document.querySelectorAll('.product-image').forEach(imgEl => {
        imgEl.classList.remove('theme-hover-grayscale', 'theme-hover-image-zoom'); 
        if (config.design?.enableHoverEffects) {
            if (config.design?.imageHoverEffect === 'grayscale') {
                imgEl.classList.add('theme-hover-grayscale');
            } else if (config.design?.imageHoverEffect === 'zoom') {
                imgEl.classList.add('theme-hover-image-zoom');
            }
        }
    });


    // Product List Mock (dynamic rendering based on config.productList)
    const productListMock = clearContainer('product-list-mock');
    if (productListMock && config.productList) {
        let productsListHtml = `
            <section class="theme-module product-list-mock">
                <h3 class="module-title">Página de Lista de Produtos (Simulado - Layout ${config.productList.layout === 'list' ? 'Lista' : 'Grade'})</h3>
        `;
        
        if (config.productList.enableFilters) {
            productsListHtml += `<div class="product-filters" style="background-color: #f0f0f0; padding: 10px; margin-bottom: 20px; border-radius: 5px; text-align: center;">Filtros (simulado)</div>`;
        }
        if (config.productList.enableSorting) {
            productsListHtml += `<div class="product-sorting" style="background-color: #f0f0f0; padding: 10px; margin-bottom: 20px; border-radius: 5px; text-align: center;">Ordenação (simulado)</div>`;
        }

        if (config.productList.layout === 'list') {
            productsListHtml += `<div class="product-list-items">`;
            for (let i = 0; i < (config.productList.productsPerPage || 4); i++) {
                productsListHtml += `
                    <div class="theme-product-item theme-card theme-list-item">
                        ${config.productList.showProductImage ? `<img src="https://via.placeholder.com/100x100?text=ProdL${i+1}" alt="Produto Lista ${i+1}" class="product-image">` : ''}
                        <div class="list-item-details">
                            ${config.productList.showProductName ? `<h4 class="product-title">Produto da Lista ${i+1}</h4>` : ''}
                            ${config.productList.showProductPrice ? `<p class="product-price">R$ ${(80 + i * 10).toFixed(2).replace('.', ',')}</p>` : ''}
                            ${config.productList.showProductDescriptionSnippet ? '<p class="product-description-snippet">Esta é uma breve descrição para o layout de lista.</p>' : ''}
                            ${config.productList.showAddToCartButton ? `<button class="theme-button" style="background-color: ${config.productList.addToCartButtonColor ?? config.primaryColor};">Adicionar</button>` : ''}
                            ${config.productList.showQuickViewButton ? `<button class="theme-button" style="background-color: #ccc; color: #333; margin-left: 10px;">Visualizar</button>` : ''}
                        </div>
                    </div>
                `;
            }
            productsListHtml += `</div>`;
        } else { // Grid layout
            productsListHtml += `<div class="theme-product-grid-container" style="grid-template-columns: repeat(${config.productList.gridColumns || 3}, 1fr);">`;
            for (let i = 0; i < (config.productList.productsPerPage || 6); i++) {
                productsListHtml += `
                    <div class="theme-product-item theme-card">
                        ${config.productList.showProductImage ? `<img src="https://via.placeholder.com/200x200?text=ProdG${i+1}" alt="Produto Grade ${i+1}" class="product-image">` : ''}
                        ${config.productList.showProductName ? `<h4 class="product-title">Produto da Grade ${i+1}</h4>` : ''}
                        ${config.productList.showProductPrice ? `<p class="product-price">R$ ${(50 + i * 5).toFixed(2).replace('.', ',')}</p>` : ''}
                        ${config.productList.showAddToCartButton ? `<button class="theme-button" style="background-color: ${config.productList.addToCartButtonColor ?? config.primaryColor};">Adicionar ao Carrinho</button>` : ''}
                        ${config.productList.showQuickViewButton ? `<button class="theme-button" style="background-color: #ccc; color: #333; margin-top: 10px;">Visualizar</button>` : ''}
                    </div>
                `;
            }
            productsListHtml += `</div>`;
        }
        productsListHtml += `</section>`;
        productListMock.innerHTML = productsListHtml;
    }


    // Product Detail Mock
    const productDetailMock = clearContainer('product-detail-mock');
    if (productDetailMock && config.productDetail) {
        let detailHtml = `
            <section class="theme-module product-detail-mock">
                <h3 class="module-title">Página de Detalhe de Produto (Simulado)</h3>
                <div class="product-detail-layout">
                    <div class="product-images">
                        <img src="https://via.placeholder.com/400x400?text=Produto+Detalhe" alt="Produto Detalhe" class="main-product-image">
                        <div class="thumbnail-gallery">
                            <img src="https://via.placeholder.com/100x100?text=Thumb1" alt="Thumbnail 1">
                            <img src="https://via.placeholder.com/100x100?text=Thumb2" alt="Thumbnail 2">
                        </div>
                    </div>
                    <div class="product-info">
                        ${config.productDetail.showBreadcrumbs ? `<div class="breadcrumbs">Home > Categoria > Produto</div>` : ''}
                        ${config.productDetail.showProductName ? `<h1 class="product-title">${config.productDetail.productName || 'Nome do Produto em Destaque'}</h1>` : ''}
                        ${config.productDetail.showProductPrice ? `<p class="product-price-detail">R$ ${config.productDetail.productPrice?.toFixed(2).replace('.', ',') || '199,90'}</p>` : ''}
                        ${config.productDetail.showProductDescription ? `<div class="product-description">${config.productDetail.productDescription || '<p>Descrição detalhada do produto. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>'}</div>` : ''}
                        
                        <div class="product-actions">
                            ${config.productDetail.enableQuantitySelector ? `
                                <div class="quantity-selector">
                                    <label for="quantity">Quantidade:</label>
                                    <input type="number" id="quantity" value="1" min="1">
                                </div>` : ''}
                            ${config.productDetail.showAddToCartButton ? `<button class="theme-button add-to-cart-button" style="background-color: ${config.productDetail.addToCartButtonColor ?? config.primaryColor};">Adicionar ao Carrinho</button>` : ''}
                        </div>
                        
                        ${config.productDetail.showShareButtons ? `
                            <div class="share-buttons">
                                Compartilhe: 
                                <a href="#" class="share-icon"><i class="fa-brands fa-facebook"></i></a>
                                <a href="#" class="share-icon"><i class="fa-brands fa-whatsapp"></i></a>
                            </div>` : ''}

                        ${config.productDetail.showRelatedProducts ? `
                            <div class="related-products">
                                <h3>${config.productDetail.relatedProductsTitle || 'Produtos Relacionados'}</h3>
                                <div class="theme-product-grid-container" style="grid-template-columns: repeat(3, 1fr);">
                                    <div class="theme-product-item theme-card"><img src="https://via.placeholder.com/150x150?text=Relac1"><h4>Relacionado 1</h4></div>
                                    <div class="theme-product-item theme-card"><img src="https://via.placeholder.com/150x150?text=Relac2"><h4>Relacionado 2</h4></div>
                                    <div class="theme-product-item theme-card"><img src="https://via.placeholder.com/150x150?text=Relac3"><h4>Relacionado 3</h4></div>
                                </div>
                            </div>` : ''}
                    </div>
                </div>
            </section>
        `;
        productDetailMock.innerHTML = detailHtml;
    }

    // Cart Mock
    const cartMock = clearContainer('cart-mock');
    if (cartMock && config.cart) {
        let cartHtml = `
            <section class="theme-module cart-mock">
                <h3 class="module-title">Página do Carrinho (Simulado)</h3>
                <div class="cart-items">
                    <div class="cart-item theme-card">
                        <img src="https://via.placeholder.com/80x80?text=Item1" alt="Item do Carrinho 1" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4>Produto no Carrinho 1</h4>
                            <p>R$ 100,00</p>
                            <p>Quantidade: 1</p>
                            <button class="remove-item-button">Remover</button>
                        </div>
                    </div>
                    <div class="cart-item theme-card">
                        <img src="https://via.placeholder.com/80x80?text=Item2" alt="Item do Carrinho 2" class="cart-item-image">
                        <div class="cart-item-details">
                            <h4>Produto no Carrinho 2</h4>
                            <p>R$ 50,00</p>
                            <p>Quantidade: 2</p>
                            <button class="remove-item-button">Remover</button>
                        </div>
                    </div>
                </div>
                <div class="cart-summary theme-card" style="background-color: ${config.secondaryColor};">
                    ${config.cart.enableWholesaleMinOrder ? `<p class="wholesale-notice">Valor mínimo de pedido para atacado: R$ ${config.cart.minWholesaleOrderValue?.toFixed(2).replace('.', ',') || '500,00'}</p>` : ''}
                    ${config.cart.showShippingEstimator ? `<p class="shipping-estimator">Calculador de Frete (simulado)</p>` : ''}
                    ${config.cart.showCouponField ? `<p class="coupon-field">Campo de Cupom (simulado)</p>` : ''}
                    ${config.cart.showCartNotes ? `<p class="cart-notes">Notas do Carrinho (simulado)</p>` : ''}

                    <p>Subtotal: <span>R$ 200,00</span></p>
                    <p>Frete: <span>R$ 20,00</span></p>
                    <h3>Total: <span>R$ 220,00</span></h3>
                    <button class="theme-button checkout-button" style="background-color: ${config.cart.checkoutButtonColor ?? config.primaryColor};">${config.cart.checkoutButtonText || 'Finalizar Compra'}</button>
                    ${config.cart.showCrossSellProducts ? `
                        <div class="cross-sell-products">
                            <h3>${config.cart.crossSellTitle || 'Adicione também:'}</h3>
                            <div class="theme-product-grid-container" style="grid-template-columns: repeat(3, 1fr);">
                                <div class="theme-product-item theme-card"><img src="https://via.placeholder.com/100x100?text=Cross1"><h4>Item Extra 1</h4></div>
                                <div class="theme-product-item theme-card"><img src="https://via.placeholder.com/100x100?text=Cross2"><h4>Item Extra 2</h4></div>
                                <div class="theme-product-item theme-card"><img src="https://via.placeholder.com/100x100?text=Cross3"><h4>Item Extra 3</h4></div>
                            </div>
                        </div>` : ''}
                    ${config.cart.showContinueShoppingButton ? `<button class="theme-button continue-shopping-button" style="background-color: #ccc; color: #333; margin-top: 10px;">Continuar Comprando</button>` : ''}
                </div>
            </section>
        `;
        cartMock.innerHTML = cartHtml;
    }
}


// --- Função Centralizada para Aplicar a Configuração ao DOM ---
function applyThemeConfigToDOM() {
    console.log('[script.js]: Aplicando configuração ao DOM:', currentThemeConfig);
    renderHomepageModules(currentThemeConfig);
    applyGeneralConfig(currentThemeConfig);
    // Chame aqui outras funções de renderização para mockar outras páginas
    // renderProductDetailMock(currentThemeConfig);
    // renderProductListMock(currentThemeConfig);
    // renderCartMock(currentThemeConfig);
}

// --- Inicialização do Tema ---
function initializeTheme() {
    // 1. LISTENER CRUCIAL: Recebe mensagens do painel (ThemeProvider)
    window.addEventListener('message', (event) => {
        // Por segurança, sempre verifique a origem da mensagem em um ambiente de produção
        // if (event.origin !== 'http://localhost:3000') { // Substitua pelo domínio do seu painel
        //     console.warn('Mensagem de origem desconhecida ignorada:', event.origin);
        //     return;
        // }

        if (event.data && event.data.type === 'UPDATE_THEME_CONFIG') {
            console.log('[script.js]: Configuração recebida do painel via postMessage!', event.data.config);
            currentThemeConfig = event.data.config; 
            applyThemeConfigToDOM();
        }
    });

    // 2. Executa a aplicação inicial da configuração quando o DOM estiver pronto
    // Isso garante que o tema carregue com as configurações padrão (ou injetadas no HTML inicial)
    // até que uma atualização via postMessage chegue.
    applyThemeConfigToDOM();

    // 3. Adiciona event listeners para o menu mobile
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mainNav = document.querySelector('.header-main-nav');

    if (mobileMenuToggle && mainNav) {
        mobileMenuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); 
        });
    }

    // 4. Fecha o menu mobile ao clicar fora dele
    document.addEventListener('click', (event) => {
        if (mainNav && mobileMenuToggle && mainNav.classList.contains('active')) {
            if (!mainNav.contains(event.target) && !mobileMenuToggle.contains(event.target)) {
                mainNav.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        }
    });

    // 5. Fechar barras de pesquisa quando clicar fora (se estiverem abertas via ícone)
    document.addEventListener('click', (event) => {
        const desktopSearchBarContainer = document.getElementById('theme-search-bar-container-desktop');
        const mobileSearchBarContainer = document.getElementById('theme-search-bar-container-mobile');

        if (desktopSearchBarContainer && desktopSearchBarContainer.querySelector('.theme-search-icon') && !desktopSearchBarContainer.contains(event.target)) {
            const input = desktopSearchBarContainer.querySelector('.theme-search-bar');
            if (input && input.classList.contains('active')) {
                input.classList.remove('active');
            }
        }
        if (mobileSearchBarContainer && mobileSearchBarContainer.querySelector('.theme-search-icon') && !mobileSearchBarContainer.contains(event.target)) {
            const input = mobileSearchBarContainer.querySelector('.theme-search-bar');
            if (input && input.classList.contains('active')) {
                input.classList.remove('active');
            }
        }
    });
}

// Executa a inicialização do tema quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', initializeTheme);

// Re-aplica configurações em redimensionamento (para banners responsivos e outros elementos)
// Adiciona um debounce para evitar chamadas excessivas em redimensionamentos rápidos
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // Re-aplica a *configuração ATUAL* para ajustar layouts responsivos
        document.body.classList.add('resizing'); 
        applyThemeConfigToDOM(); 
        setTimeout(() => {
            document.body.classList.remove('resizing');
        }, 100); 
    }, 250); 
});