'use client'; 

import React, { useEffect, isValidElement } from 'react';
import { useEditor, Tema, HomePageModule } from './EditorContext'; 
import { 
    FaShoppingCart, FaUser, FaHeadset, FaSearch, FaBars, FaTshirt, FaGem, FaBox, FaStar, FaShieldAlt, FaTruck, FaExchangeAlt, FaMoneyBillWave, FaCreditCard, FaTags, FaWhatsapp
} from 'react-icons/fa'; 
import { MdImage, MdViewCarousel, MdMail, MdSettingsApplications, MdMessage } from 'react-icons/md';


// Função auxiliar para mapear strings de ícones para componentes React.ReactNode
const renderIconFromString = (iconString: string, size: number = 14, color?: string): React.ReactNode => {
    const style = { fontSize: size, color: color };
    switch (iconString) {
        case 'MdImage': return <MdImage style={style} />;
        case 'FaStar': return <FaStar style={style} />;
        case 'MdViewCarousel': return <MdViewCarousel style={style} />;
        case 'FaBoxOpen': return <FaBox style={style} />; 
        case 'MdMail': return <MdMail style={style} />;
        case 'MdSettingsApplications': return <MdSettingsApplications style={style} />;
        case 'MdMessage': return <MdMessage style={style} />;
        // Ícones para o módulo de Info:
        case 'seguranca': return <FaShieldAlt style={style} />;
        case 'trocasDevolucoes': return <FaExchangeAlt style={style} />;
        case 'entregas': return <FaTruck style={style} />;
        case 'dinheiro': return <FaMoneyBillWave style={style} />;
        case 'cartaoCredito': return <FaCreditCard style={style} />;
        case 'promocoes': return <FaTags style={style} />;
        case 'whatsapp': return <FaWhatsapp style={style} />;
        // Caso 'imagemPropria' não renderiza ícone aqui, pois usa uploadIcone diretamente
        default: return null; 
    }
};

interface PreviewProps {
    previewMode: 'desktop' | 'mobile';
}

// === COMPONENTES MODULARES PARA A PÁGINA INICIAL ===

interface ModuleProps {
    module: HomePageModule;
    tema: Tema;
    previewMode: 'desktop' | 'mobile';
}

const getButtonBorderRadius = (format: Tema['formatoBotoes']) => {
    switch (format) {
        case 'oval': return '9999px';
        case 'redondo': return '8px'; 
        case 'quadrado': default: return '0px';
    }
};

const BannerModule: React.FC<ModuleProps> = ({ module, tema, previewMode }) => {
    const commonModuleContainerStyle = { 
        backgroundColor: tema.cores.fundo,
        color: tema.cores.texto,
        fontFamily: tema.tipografia.texto,
        fontWeight: tema.tipografia.textoPeso,
        fontSize: tema.tipografia.textoTamanho,
    };
    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '20px', 
                color: tema.cores.texto, 
                fontFamily: tema.tipografia.titulo, 
                fontWeight: tema.tipografia.tituloPeso, 
                fontSize: tema.tipografia.tituloTamanho 
            }}>
                {module.config?.title || module.label}
            </h2>
            <div style={{ 
                width: '100%', 
                height: previewMode === 'mobile' ? '150px' : '250px',
                backgroundColor: tema.cores.secundaria, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                color: '#fff', 
                fontSize: '1.5rem', 
                fontFamily: tema.tipografia.texto,
                borderRadius: tema.usarBordasArredondadas ? '8px' : '0px', 
                overflow: 'hidden' 
            }}>
                <img 
                    src={previewMode === 'mobile' ? (tema.bannerMobileUrl || `https://placehold.co/375x150/${tema.cores.secundaria.substring(1)}/FFFFFF/png?text=Banner+Mobile`) : (tema.bannerDesktopUrl || `https://placehold.co/800x250/${tema.cores.secundaria.substring(1)}/FFFFFF/png?text=Banner+Desktop`)} 
                    alt={tema.bannerAltText || module.label} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => (e.currentTarget.src = previewMode === 'mobile' ? 'https://placehold.co/375x150/ccc/fff?text=Banner+Erro' : 'https://placehold.co/800x250/ccc/fff?text=Banner+Erro')}
                />
            </div>
            <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '0.8rem', color: tema.cores.texto, fontFamily: tema.tipografia.texto }}>
                Tamanho recomendado para {previewMode === 'desktop' ? 'Desktop' : 'Mobile'}: {previewMode === 'desktop' ? "1920px (largura) x 600px (altura)" : "640px (largura) x 320px (altura)"}
            </p>
        </div>
    );
};

const ProductSectionModule: React.FC<ModuleProps> = ({ module, tema, previewMode }) => {
    const productIcons = [<FaTshirt key="tshirt" />, <FaGem key="gem" />, <FaBox key="box" />]; 

    const buttonStyle = {
        backgroundColor: tema.cores.primaria,
        color: tema.cores.footerText, 
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold' as 'bold',
        borderRadius: getButtonBorderRadius(tema.formatoBotoes),
    };
    const commonModuleContainerStyle = { 
        backgroundColor: tema.cores.fundo,
        color: tema.cores.texto,
        fontFamily: tema.tipografia.texto,
        fontWeight: tema.tipografia.textoPeso,
        fontSize: tema.tipografia.textoTamanho,
        padding: '30px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: '20px',
    };

    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '20px', 
                color: tema.cores.texto, 
                fontFamily: tema.tipografia.titulo, 
                fontWeight: tema.tipografia.tituloPeso, 
                fontSize: tema.tipografia.tituloTamanho 
            }}>
                {module.config?.title || module.label}
            </h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: previewMode === 'mobile' ? '1fr 1fr' : (tema.quantidadeProdutosPorLinha === '1_cel_3_comp' ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)'),
                gap: '15px', 
                width: '100%' 
            }}>
                {[0, 1, 2, 3, 4, 5].slice(0, previewMode === 'mobile' ? 4 : (tema.quantidadeProdutosPorLinha === '1_cel_3_comp' ? 3 : 4)).map(item => (
                    <div key={item} style={{ 
                        border: `1px solid ${tema.cores.primaria}`, 
                        borderRadius: tema.usarBordasArredondadas ? '8px' : '0px', 
                        padding: '10px', 
                        textAlign: 'center',
                        backgroundColor: tema.cores.fundo, 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ fontSize: '3rem', color: tema.cores.primaria, marginBottom: '10px' }}>
                            {productIcons[item % productIcons.length]} 
                        </div>
                        <h3 style={{ fontSize: '1rem', color: tema.cores.texto, margin: '10px 0' }}>Produto {item + 1}</h3>
                        <p style={{ color: tema.cores.destaque, fontWeight: 'bold', fontSize: '1.1rem' }}>R$ 99,90</p>
                        <button style={{ ...buttonStyle, width: '100%', marginTop: '10px', padding: '8px 15px' }}>Comprar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryGridModule: React.FC<ModuleProps> = ({ module, tema, previewMode }) => {
    const commonModuleContainerStyle = {
        backgroundColor: tema.cores.fundo,
        color: tema.cores.texto,
        fontFamily: tema.tipografia.texto,
        fontWeight: tema.tipografia.textoPeso,
        fontSize: tema.tipografia.textoTamanho,
        padding: '30px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: '20px',
    };
    const categories: { id: string; name: string; imageUrl: string; link: string; }[] = module.config?.categoryImages || [ 
        { id: 'cat1_default', name: 'Categoria 1', imageUrl: 'https://placehold.co/150x150/e0e0e0/555555/png?text=Cat1', link: '#' },
        { id: 'cat2_default', name: 'Categoria 2', imageUrl: 'https://placehold.co/150x150/e0e0e0/555555/png?text=Cat2', link: '#' },
        { id: 'cat3_default', name: 'Categoria 3', imageUrl: 'https://placehold.co/150x150/e0e0e0/555555/png?text=Cat3', link: '#' },
        { id: 'cat4_default', name: 'Categoria 4', imageUrl: 'https://placehold.co/150x150/e0e0e0/555555/png?text=Cat4', link: '#' },
    ];

    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '20px', 
                color: tema.cores.texto, 
                fontFamily: tema.tipografia.titulo, 
                fontWeight: tema.tipografia.tituloPeso, 
                fontSize: tema.tipografia.tituloTamanho 
            }}>
                {module.config?.title || module.label}
            </h2>
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: previewMode === 'mobile' ? '1fr 1fr' : 'repeat(4, 1fr)', 
                gap: '15px', 
                width: '100%' 
            }}>
                {categories.map((cat: { id: string; name: string; imageUrl: string; link: string; }) => ( 
                    <div key={cat.id} style={{ 
                        border: `1px solid ${tema.cores.secundaria}`, 
                        borderRadius: tema.usarBordasArredondadas ? '8px' : '0px', 
                        padding: '10px', 
                        textAlign: 'center',
                        backgroundColor: tema.cores.headerBg, 
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        overflow: 'hidden'
                    }}>
                        <a href={cat.link} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <img 
                                src={cat.imageUrl} 
                                alt={cat.name} 
                                style={{ 
                                    width: '100%', 
                                    height: '120px', 
                                    objectFit: 'cover', 
                                    borderRadius: tema.usarBordasArredondadas ? '4px' : '0px', 
                                    marginBottom: '10px'
                                }} 
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/120x120/ccc/fff?text=Categoria')}
                            />
                            <h3 style={{ fontSize: '1.1rem', color: tema.cores.texto, margin: '0' }}>{cat.name}</h3>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TextModule: React.FC<ModuleProps> = ({ module, tema }) => {
    const commonModuleContainerStyle = {
        backgroundColor: tema.cores.fundo,
        color: tema.cores.texto,
        fontFamily: tema.tipografia.texto,
        fontWeight: tema.tipografia.textoPeso,
        fontSize: tema.tipografia.textoTamanho,
        padding: '30px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: '20px',
    };
    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '20px', 
                color: tema.cores.texto, 
                fontFamily: tema.tipografia.titulo, 
                fontWeight: tema.tipografia.tituloPeso, 
                fontSize: tema.tipografia.tituloTamanho 
            }}>
                {module.config?.title || module.label}
            </h2>
            <p style={{ textAlign: 'center', color: tema.cores.texto, fontFamily: tema.tipografia.texto, fontSize: tema.tipografia.textoTamanho }}>
                {module.config?.text || "Este é um texto de exemplo para a sua seção de mensagens ou boas vindas. Você pode editá-lo no painel de personalização."}
            </p>
        </div>
    );
};

const NewsletterModule: React.FC<ModuleProps> = ({ module, tema }) => {
    const commonModuleContainerStyle = {
        backgroundColor: tema.cores.fundo,
        color: tema.cores.texto,
        fontFamily: tema.tipografia.texto,
        fontWeight: tema.tipografia.textoPeso,
        fontSize: tema.tipografia.textoTamanho,
        padding: '30px',
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: '15px',
    };
    const getButtonBorderRadius = (format: Tema['formatoBotoes']) => {
        switch (format) {
            case 'oval': return '9999px';
            case 'redondo': return '8px';
            case 'quadrado': default: return '0px';
        }
    };
    const buttonStyle = {
        backgroundColor: tema.cores.primaria,
        color: tema.cores.footerText, 
        padding: '10px 20px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold' as 'bold',
        borderRadius: getButtonBorderRadius(tema.formatoBotoes),
    };
    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px', backgroundColor: tema.cores.secundaria, color: tema.cores.footerText }}>
            <h3 style={{ margin: 0, color: tema.cores.footerText, fontFamily: tema.tipografia.titulo, fontWeight: tema.tipografia.tituloPeso }}>
                {tema.newsletterTexto || module.config?.title || "Assine nossa Newsletter!"}
            </h3>
            <div style={{ display: 'flex', gap: '10px', width: '80%', maxWidth: '400px' }}>
                <input 
                    type="email" 
                    placeholder={tema.newsletterPlaceholder || "Seu e-mail"} 
                    style={{ 
                        flexGrow: 1, 
                        padding: '10px', 
                        borderRadius: '5px', 
                        border: '1px solid #ccc',
                        fontFamily: tema.tipografia.texto, fontSize: tema.tipografia.textoTamanho
                    }} 
                />
                <button style={buttonStyle}>Assinar</button>
            </div>
        </div>
    );
};

const InfoModule: React.FC<ModuleProps> = ({ module, tema }) => {
    const commonModuleContainerStyle = {
        backgroundColor: tema.cores.fundo,
        color: tema.cores.texto,
        fontFamily: tema.tipografia.texto,
        fontWeight: tema.tipografia.textoPeso,
        fontSize: tema.tipografia.textoTamanho,
        padding: '30px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: '20px',
    };

    const infoItems = [
        tema.detalhesProduto_infoCompra_mostrar1 && tema.detalhesProduto_infoCompra_titulo1 ? {
            iconType: tema.detalhesProduto_infoCompra_tipoIcone1,
            imageUrl: tema.detalhesProduto_infoCompra_uploadIcone1,
            title: tema.detalhesProduto_infoCompra_titulo1,
            description: tema.detalhesProduto_infoCompra_descricao1
        } : null,
        tema.detalhesProduto_infoCompra_mostrar2 && tema.detalhesProduto_infoCompra_titulo2 ? {
            iconType: tema.detalhesProduto_infoCompra_tipoIcone2,
            imageUrl: tema.detalhesProduto_infoCompra_uploadIcone2,
            title: tema.detalhesProduto_infoCompra_titulo2,
            description: tema.detalhesProduto_infoCompra_descricao2
        } : null,
        tema.detalhesProduto_infoCompra_mostrar3 && tema.detalhesProduto_infoCompra_titulo3 ? {
            iconType: tema.detalhesProduto_infoCompra_tipoIcone3,
            imageUrl: tema.detalhesProduto_infoCompra_uploadIcone3,
            title: tema.detalhesProduto_infoCompra_titulo3,
            description: tema.detalhesProduto_infoCompra_descricao3
        } : null,
    ].filter(Boolean); 

    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '20px', 
                color: tema.cores.texto, 
                fontFamily: tema.tipografia.titulo, 
                fontWeight: tema.tipografia.tituloPeso, 
                fontSize: tema.tipografia.tituloTamanho 
            }}>
                {module.config?.title || module.label}
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '20px', width: '100%' }}>
                {infoItems.length > 0 ? (
                    infoItems.map((item, index) => (
                        <div key={index} style={{ flex: '1 1 250px', maxWidth: '300px', padding: '15px', border: `1px solid ${tema.cores.secundaria}`, borderRadius: tema.usarBordasArredondadas ? '8px' : '0px', textAlign: 'center', backgroundColor: tema.cores.fundo }}>
                            {item?.iconType === 'imagemPropria' && item?.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} style={{ maxHeight: '50px', marginBottom: '10px' }} onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50/ccc/fff?text=Icone')} />
                            ) : (
                                <div style={{ fontSize: '3rem', color: tema.cores.primaria, marginBottom: '10px' }}>
                                    {renderIconFromString(item?.iconType || '', 48, tema.cores.primaria)}
                                </div>
                            )}
                            <h3 style={{ fontSize: '1.1rem', color: tema.cores.texto, margin: '10px 0' }}>{item?.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: tema.cores.texto }}>{item?.description}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: tema.cores.texto, opacity: '0.7' }}>Nenhuma informação configurada para este módulo.</p>
                )}
            </div>
        </div>
    );
};

// NOVO MÓDULO: Banners de Destaque (Highlight Banners)
const HighlightBannersModule: React.FC<ModuleProps> = ({ module, tema, previewMode }) => {
    const commonModuleContainerStyle = {
        backgroundColor: tema.cores.fundo,
        color: tema.cores.texto,
        fontFamily: tema.tipografia.texto,
        fontWeight: tema.tipografia.textoPeso,
        fontSize: tema.tipografia.textoTamanho,
        padding: '20px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: '20px',
    };

    const banners = module.config?.highlightBanners || [
        { id: 'default_hb1', imageUrl: `https://placehold.co/300x120/${tema.cores.primaria.substring(1)}/FFFFFF/png?text=MiniBanner+1`, link: '#', title: 'Destaque 1' },
        { id: 'default_hb2', imageUrl: `https://placehold.co/300x120/${tema.cores.secundaria.substring(1)}/FFFFFF/png?text=MiniBanner+2`, link: '#', title: 'Destaque 2' },
        { id: 'default_hb3', imageUrl: `https://placehold.co/300x120/${tema.cores.destaque.substring(1)}/FFFFFF/png?text=MiniBanner+3`, link: '#', title: 'Destaque 3' },
    ];

    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' }}>
            <h2 style={{ 
                textAlign: 'center', 
                marginBottom: '20px', 
                color: tema.cores.texto, 
                fontFamily: tema.tipografia.titulo, 
                fontWeight: tema.tipografia.tituloPeso, 
                fontSize: tema.tipografia.tituloTamanho 
            }}>
                {module.config?.title || module.label}
            </h2>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', // Permite quebrar linha
                justifyContent: 'center', 
                gap: '15px', 
                width: '100%' 
            }}>
                {banners.map(banner => (
                    <a key={banner.id} href={banner.link} style={{ 
                        flex: '1 1 280px', // Cresce e diminui, com base de 280px
                        maxWidth: previewMode === 'mobile' ? '100%' : '32%', // Ocupa 100% no mobile, ~1/3 no desktop
                        display: 'block', 
                        textDecoration: 'none',
                        color: 'inherit',
                        borderRadius: tema.usarBordasArredondadas ? '8px' : '0px',
                        overflow: 'hidden',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                        transition: 'transform 0.2s ease-in-out',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        <img 
                            src={banner.imageUrl} 
                            alt={banner.title || 'Mini Banner'} 
                            style={{ width: '100%', height: '120px', objectFit: 'cover', display: 'block' }}
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/300x120/ccc/fff?text=Erro+Banner')}
                        />
                        {banner.title && (
                            <div style={{ padding: '10px', backgroundColor: tema.cores.fundo, textAlign: 'center' }}>
                                <h3 style={{ margin: '0', fontSize: '1rem', color: tema.cores.texto, fontFamily: tema.tipografia.titulo, fontWeight: tema.tipografia.tituloPeso }}>
                                    {banner.title}
                                </h3>
                                {banner.description && (
                                    <p style={{ margin: '5px 0 0', fontSize: '0.8rem', color: tema.cores.texto, opacity: '0.8', fontFamily: tema.tipografia.texto }}>
                                        {banner.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </a>
                ))}
            </div>
        </div>
    );
};


export default function Preview({ previewMode }: PreviewProps) {
    const { tema } = useEditor(); 
    
    console.log("Módulos no Preview:", tema.homePageModules); 

    const headerStyle = {
        backgroundColor: tema.cores.headerBg,
        color: tema.cores.headerText,
        fontFamily: tema.tipografia.titulo,
        fontWeight: tema.tipografia.tituloPeso,
        fontSize: tema.tipografia.tituloTamanho,
        padding: '0 20px',
        borderRadius: tema.usarBordasArredondadas ? '10px 10px 0 0' : '0' 
    };

    const commonPageSectionStyle = { 
        backgroundColor: tema.cores.fundo,
        color: tema.cores.texto,
        fontFamily: tema.tipografia.texto,
        fontWeight: tema.tipografia.textoPeso,
        fontSize: tema.tipografia.textoTamanho,
        padding: '30px',
        minHeight: '200px',
        display: 'flex',
        flexDirection: 'column' as 'column',
        alignItems: 'center' as 'center',
        justifyContent: 'center' as 'center',
        gap: '20px',
        borderRadius: tema.usarBordasArredondadas ? '0 0 10px 10px' : '0',
        marginTop: '0px' 
    };

    const iconStyle = {
        fontSize: tema.estiloIconesDesktop === 'grande' ? '1.5rem' : '1.2rem',
        color: tema.cores.headerText,
        cursor: 'pointer',
    };

    useEffect(() => {
        let styleTag = document.getElementById('advanced-css-style') as HTMLStyleElement;
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'advanced-css-style';
            document.head.appendChild(styleTag);
        }
        styleTag.textContent = tema.advancedCss || '';
    }, [tema.advancedCss]);

    const previewContainerStyle = {
        maxWidth: previewMode === 'mobile' ? '375px' : '800px',
        margin: '20px auto',
        border: '1px solid #e0e0e0',
        borderRadius: '8px', 
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'max-width 0.3s ease-in-out',
    };

    const MobileHeaderContent = () => {
        const mobileIconStyle = { 
            fontSize: tema.estiloIconesDesktop === 'grande' ? '1.8rem' : '1.5rem', 
            color: tema.cores.headerText,
            cursor: 'pointer',
        };

        const mobileLogo = (
            <div style={{ flexGrow: 1, display: 'flex', justifyContent: tema.posicaoLogoMobile === 'centralizado' ? 'center' : 'flex-start', alignItems: 'center' }}>
                <img 
                    src={tema.logoUrl} 
                    alt="Logo da Loja" 
                    style={{ 
                        maxWidth: '120px',
                        height: 'auto',
                        display: 'block'
                    }} 
                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/100x35/ccc/fff?text=Logo+Erro')}
                />
            </div>
        );

        const fullSearchBar = (
            <div style={{ width: '100%', marginTop: '15px', paddingBottom: '15px' }}>
                <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    border: `1px solid ${tema.cores.secundaria}`, 
                    borderRadius: '25px', 
                    padding: '5px 15px', 
                    backgroundColor: tema.cores.fundo 
                }}>
                    <input 
                        type="text" 
                        placeholder="Buscar..."
                        style={{ 
                            border: 'none', 
                            outline: 'none', 
                            flexGrow: 1, 
                            backgroundColor: 'transparent', 
                            padding: '8px 0',
                            fontFamily: tema.tipografia.texto, 
                            fontSize: tema.tipografia.textoTamanho,
                            color: tema.cores.texto
                        }} 
                    />
                    <FaSearch style={{ color: tema.cores.secundaria, cursor: 'pointer' }} />
                </div>
            </div>
        );

        const mobileMenuHorizontal = (
            <nav style={{ width: '100%', textAlign: 'center', paddingBottom: '15px' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', flexDirection: 'row' }}>
                    <li><a href="#" style={{ color: tema.cores.headerText, textDecoration: 'none', fontWeight: tema.tipografia.textoPeso, fontSize: tema.tipografia.textoTamanho, fontFamily: tema.tipografia.texto }}>Início</a></li>
                    <li><a href="#" style={{ color: tema.cores.headerText, textDecoration: 'none', fontWeight: tema.tipografia.textoPeso, fontSize: tema.tipografia.textoTamanho, fontFamily: tema.tipografia.texto }}>Produtos</a></li>
                    <li><a href="#" style={{ color: tema.cores.headerText, textDecoration: 'none', fontWeight: tema.tipografia.textoPeso, fontSize: tema.tipografia.textoTamanho, fontFamily: tema.tipografia.texto }}>Contato</a></li>
                </ul>
            </nav>
        );

        const hr = <hr style={{ width: '100%', border: 'none', borderTop: `1px solid ${tema.cores.secundaria}`, margin: '15px 0' }} />;

        switch (tema.estiloCabecalhoMobile) {
            case 'menuBuscadorCarrinho':
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: '15px' }}>
                            <FaBars style={mobileIconStyle} title="Menu" />
                            {mobileLogo}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <FaSearch style={mobileIconStyle} title="Buscar" />
                                <FaShoppingCart style={mobileIconStyle} title="Carrinho" />
                            </div>
                        </div>
                    </>
                );
            case 'barraHorizontalCategorias':
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: '15px' }}>
                            <FaBars style={mobileIconStyle} title="Menu" />
                            {mobileLogo}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <FaSearch style={mobileIconStyle} title="Buscar" />
                                <FaShoppingCart style={mobileIconStyle} title="Carrinho" />
                            </div>
                        </div>
                        {hr}
                        {mobileMenuHorizontal}
                    </>
                );
            case 'barraPesquisaGrande':
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: '15px' }}>
                            <FaBars style={mobileIconStyle} title="Menu" />
                            {mobileLogo}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <FaShoppingCart style={mobileIconStyle} title="Carrinho" />
                            </div>
                        </div>
                        {hr}
                        {fullSearchBar}
                    </>
                );
            default: 
                return (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: '15px' }}>
                            <FaBars style={mobileIconStyle} title="Menu" />
                            {mobileLogo}
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <FaSearch style={mobileIconStyle} title="Buscar" />
                                <FaShoppingCart style={mobileIconStyle} title="Carrinho" />
                            </div>
                        </div>
                        {fullSearchBar} 
                    </>
                );
        }
    };


    return (
        <div style={previewContainerStyle}>
            {tema.mostrarBarraAnuncio && (
                <div style={{ 
                    backgroundColor: tema.cores.secundaria, 
                    color: tema.cores.footerText, 
                    padding: '8px 15px', 
                    textAlign: 'center',
                    fontSize: '0.85rem',
                    fontFamily: tema.tipografia.texto
                }}>
                    {tema.linkBarraAnuncio ? (
                        <a href={tema.linkBarraAnuncio} target="_blank" rel="noopener noreferrer" style={{ color: tema.cores.footerText, textDecoration: 'underline' }}>
                            {tema.mensagemBarraAnuncio}
                        </a>
                    ) : (
                        tema.mensagemBarraAnuncio
                    )}
                </div>
            )}

            {/* CABEÇALHO PRINCIPAL DA LOJA */}
            <header style={{ ...headerStyle, paddingBottom: '15px' }}>
                {previewMode === 'desktop' ? (
                    <>
                        {/* Linha da Logo e Ícones (Desktop) */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: '15px' }}>
                            {/* Logo */}
                            <div style={{ flexGrow: 1, display: 'flex', justifyContent: tema.posicaoLogoDesktop === 'centralizado' ? 'center' : 'flex-start', alignItems: 'center' }}>
                                <img 
                                    src={tema.logoUrl} 
                                    alt="Logo da Loja" 
                                    style={{ 
                                        maxWidth: tema.tamanhoLogo === 'pequeno' ? '100px' : tema.tamanhoLogo === 'grande' ? '180px' : '140px',
                                        height: 'auto',
                                        display: 'block'
                                    }} 
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/120x40/ccc/fff?text=Logo+Erro')}
                                />
                            </div>
                            {/* Ícones */}
                            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                                <FaUser style={iconStyle} title="Minha Conta" />
                                <FaShoppingCart style={iconStyle} title="Meu Carrinho" />
                                <FaHeadset style={iconStyle} title="Atendimento" />
                            </div>
                        </div>

                        {/* Área de Busca (Desktop) - ABAIXO DA LOGO/ÍCONES */}
                        <div style={{ width: '100%', maxWidth: '500px', margin: '15px auto 0 auto' }}> {/* AJUSTE AQUI: max-width e centralização */}
                            <div style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                border: `1px solid ${tema.cores.secundaria}`, 
                                borderRadius: '25px', 
                                padding: '5px 15px', 
                                backgroundColor: tema.cores.fundo 
                            }}>
                                <input 
                                    type="text" 
                                    placeholder="O que você está buscando?" 
                                    style={{ 
                                        border: 'none', 
                                        outline: 'none', 
                                        flexGrow: 1, 
                                        backgroundColor: 'transparent', 
                                        padding: '8px 0',
                                        fontFamily: tema.tipografia.texto, 
                                        fontSize: tema.tipografia.textoTamanho,
                                        color: tema.cores.texto
                                    }} 
                                />
                                <FaSearch style={{ color: tema.cores.secundaria, cursor: 'pointer' }} />
                            </div>
                        </div>

                        {/* Risco Divisor - ABAIXO DA BUSCA E ACIMA DO MENU */}
                        <hr style={{ width: '100%', border: 'none', borderTop: `1px solid ${tema.cores.secundaria}`, margin: '15px 0' }} />

                        {/* Menu de Navegação Principal (Desktop) - ABAIXO DO RISCO */}
                        <nav style={{ width: '100%', textAlign: 'center', paddingBottom: '15px' }}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
                                {/* Itens do menu básicos, sem ícones */}
                                {['Início', 'Produtos', 'Rastreie seu pedido', 'Contato', 'Trocas e Devoluções', 'Guia de Medidas', 'Cuidados e Garantias'].map(label => (
                                    <li key={label}>
                                        <a href="#" style={{ 
                                            color: tema.cores.headerText, 
                                            textDecoration: 'none', 
                                            fontWeight: tema.tipografia.textoPeso, 
                                            fontSize: tema.tipografia.textoTamanho, 
                                            fontFamily: tema.tipografia.texto,
                                            display: 'flex', 
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </>
                ) : (
                    <MobileHeaderContent /> 
                )}
            </header>

            {/* Renderização dos Módulos da Página Inicial */}
            {Array.isArray(tema.homePageModules) && tema.homePageModules.filter(m => m.isVisible).map(module => {
                switch (module.type) {
                    case 'banner':
                        return <BannerModule key={module.id} module={module} tema={tema} previewMode={previewMode} />;
                    case 'product_section':
                        return <ProductSectionModule key={module.id} module={module} tema={tema} previewMode={previewMode} />;
                    case 'category_grid': 
                        return <CategoryGridModule key={module.id} module={module} tema={tema} previewMode={previewMode} />;
                    case 'text':
                        return <TextModule key={module.id} module={module} tema={tema} previewMode={previewMode} />;
                    case 'newsletter':
                        return <NewsletterModule key={module.id} module={module} tema={tema} previewMode={previewMode} />;
                    case 'info': 
                        return <InfoModule key={module.id} module={module} tema={tema} previewMode={previewMode} />;
                    case 'highlight_banners': // <-- NOVO CASE AQUI!
                        return <HighlightBannersModule key={module.id} module={module} tema={tema} previewMode={previewMode} />;
                    default:
                        return (
                            <div key={module.id} style={{ ...commonPageSectionStyle, padding: '20px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb' }}>
                                <h3 style={{ margin: 0 }}>Módulo "{module.label}" - Tipo desconhecido ou não renderizado no preview.</h3>
                                <p style={{ fontSize: '0.8rem', opacity: '0.9' }}>Verifique o tipo do módulo em EditorContext ou adicione um componente para ele no Preview.tsx.</p>
                            </div>
                        );
                }
            })}

            {/* Rodapé (Completo com informações fake) */}
            <footer style={{ 
                backgroundColor: tema.rodape_usarCoresPersonalizadas ? tema.rodape_fundo : tema.cores.footerBg,
                color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText,
                padding: '20px',
                textAlign: 'center',
                fontFamily: tema.tipografia.texto,
                fontSize: '0.9rem',
                borderRadius: tema.usarBordasArredondadas ? '0 0 8px 8px' : '0' 
            }}>
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    justifyContent: 'space-around', 
                    gap: '20px', 
                    marginBottom: '20px',
                    textAlign: previewMode === 'mobile' ? 'center' : 'left', 
                    flexDirection: previewMode === 'mobile' ? 'column' : 'row' 
                }}>
                    {/* Seção Fale Conosco/Atendimento/Informações */}
                    <div style={{ flex: '1 1 250px' }}> 
                        <h4 style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, fontSize: '1rem', marginBottom: '10px' }}>Atendimento</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '5px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none' }}>Central de Ajuda</a></li>
                            <li style={{ marginBottom: '5px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none' }}>Trocas e Devoluções</a></li>
                            <li style={{ marginBottom: '5px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none' }}>Política de Privacidade</a></li>
                            <li style={{ marginBottom: '5px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none' }}>Termos de Serviço</a></li>
                            <li style={{ marginBottom: '5px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none' }}>Sobre Nós</a></li>
                        </ul>
                    </div>
                    
                    {/* Seção Formas de Pagamento */}
                    <div style={{ flex: '1 1 180px' }}> 
                        <h4 style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, fontSize: '1rem', marginBottom: '10px' }}>Pagamento</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: previewMode === 'mobile' ? 'center' : 'flex-start' }}> 
                            <img src="https://placehold.co/50x30/f0f0f0/666666/png?text=Visa" alt="Visa" style={{ borderRadius: '3px' }} />
                            <img src="https://placehold.co/50x30/f0f0f0/666666/png?text=Master" alt="Mastercard" style={{ borderRadius: '3px' }} />
                            <img src="https://placehold.co/50x30/f0f0f0/666666/png?text=Boleto" alt="Boleto" style={{ borderRadius: '3px' }} />
                            <img src="https://placehold.co/50x30/f0f0f0/666666/png?text=Pix" alt="Pix" style={{ borderRadius: '3px' }} />
                            <img src="https://placehold.co/50x30/f0f0f0/666666/png?text=Amex" alt="American Express" style={{ borderRadius: '3px' }} />
                            <img src="https://placehold.co/50x30/f0f0f0/666666/png?text=Elo" alt="Elo" style={{ borderRadius: '3px' }} />
                        </div>
                    </div>

                    {/* Seção Formas de Envio */}
                    <div style={{ flex: '1 1 180px' }}> 
                        <h4 style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, fontSize: '1rem', marginBottom: '10px' }}>Envio</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: previewMode === 'mobile' ? 'center' : 'flex-start' }}> 
                            <img src="https://placehold.co/50x30/f0f0f0/666666/png?text=Correios" alt="Correios" style={{ borderRadius: '3px' }} />
                            <img src="https://placehold.co/50x30/f0f0f0/666666/png?text=Transportadora" alt="Transportadora" style={{ borderRadius: '3px' }} />
                            <img src="https://placehold.co/50x30/f0f0f0/666666/png?text=Retira" alt="Retirada Local" style={{ borderRadius: '3px' }} />
                        </div>
                    </div>
                </div>

                {/* Informações da Empresa (CNPJ, Endereço) - DISCRETAS */}
                <div style={{ 
                    marginTop: '20px', 
                    borderTop: `1px solid ${tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones + '33' : tema.cores.footerText + '33'}`, 
                    paddingTop: '15px',
                    fontSize: '0.75rem', 
                    color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText,
                    textAlign: 'center'
                }}>
                    <p style={{ margin: '3px 0' }}>**Sua Loja Genérica E-commerce Ltda.**</p>
                    <p style={{ margin: '3px 0' }}>CNPJ: 00.000.000/0001-00 | Rua Exemplo, 123 - Bairro - Cidade, Estado - CEP: 00000-000</p>
                    <p style={{ margin: '3px 0' }}>Email: contato@sua-loja.com</p>
                </div>

                {/* Selos de Segurança / Direitos Reservados */}
                <div style={{ 
                    marginTop: '15px', 
                    display: 'flex', 
                    flexDirection: previewMode === 'mobile' ? 'column' : 'row',
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '10px' 
                }}>
                    {tema.rodape_seloImagemUrl && (
                        <img src={tema.rodape_seloImagemUrl} alt="Selo Personalizado" style={{ maxHeight: '40px', margin: '5px' }} />
                    )}
                    {tema.rodape_seloHtmlCode && (
                        <div dangerouslySetInnerHTML={{ __html: tema.rodape_seloHtmlCode }} />
                    )}
                    <p style={{ margin: '0', fontSize: '0.8rem', opacity: '0.8' }}>{tema.rodapeTextoFinal || 'Direitos Reservados © 2025 Sua Loja Genérica'}</p>
                </div>
            </footer>
        </div>
    );
}