// app\(painelpersonalizado)\personalizar\components\Preview.tsx
'use client';

import React, { useEffect, isValidElement } from 'react';
import { useEditor, Tema, HomePageModule, BannerItem, TestimonialItem, YoutubeVideoItem, InfoItem } from './EditorContext'; // As interfaces Tema, HomePageModule etc. vêm de EditorContext
import {
    FaShoppingCart, FaUser, FaHeadset, FaSearch, FaBars, FaTshirt, FaGem, FaBox, FaStar, FaShieldAlt, FaTruck, FaExchangeAlt, FaMoneyBillWave, FaCreditCard, FaTags, FaWhatsapp, FaYoutube, FaCommentAlt, FaRegHeart, FaRegStar, FaRegUser, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaGlobe, FaRing
} from 'react-icons/fa';
import { MdImage, MdViewCarousel, MdMail, MdSettingsApplications, MdMessage } from 'react-icons/md';

import type { CSSProperties } from 'react';

// === INTERFACES DEFINIDAS NO ARQUIVO ===
// Embora algumas interfaces venham de EditorContext, estas são específicas ou usadas para props aqui.
// Removidas daqui para evitar duplicidade, pois elas já estão em EditorContext.
// export interface PreviewProps { previewMode: 'desktop' | 'mobile'; } // Já definida abaixo, ou usada como props.
// export interface ModuleProps { module: HomePageModule; tema: Tema; previewMode: 'desktop' | 'mobile'; } // Já definida abaixo

interface PreviewProps {
    previewMode: 'desktop' | 'mobile';
}

interface ModuleProps {
    module: HomePageModule;
    tema: Tema;
    previewMode: 'desktop' | 'mobile';
}

const renderIconFromString = (iconString: string, size: number = 14, color?: string): React.ReactNode => {
    const style = { fontSize: size, color: color };
    switch (iconString) {
        case 'MdImage': return <MdImage style={style} />;
        case 'MdViewCarousel': return <MdViewCarousel style={style} />;
        case 'MdMail': return <MdMail style={style} />;
        case 'MdSettingsApplications': return <MdSettingsApplications style={style} />;
        case 'MdMessage': return <MdMessage style={style} />;
        case 'FaStar': return <FaStar style={style} />;
        case 'FaBoxOpen': return <FaBox style={style} />;
        case 'FaYoutube': return <FaYoutube style={style} />;
        case 'FaCommentAlt': return <FaCommentAlt style={style} />;
        case 'seguranca': return <FaShieldAlt style={style} />;
        case 'trocasDevolucoes': return <FaExchangeAlt style={style} />;
        case 'entregas': return <FaTruck style={style} />;
        case 'dinheiro': return <FaMoneyBillWave style={style} />;
        case 'cartaoCredito': return <FaCreditCard style={style} />;
        case 'promocoes': return <FaTags style={style} />;
        case 'whatsapp': return <FaWhatsapp style={style} />;
        case 'anelSolitario': return <FaRing style={style} />;
        case 'imagemPropria': return null;
        default: return null;
    }
};

const getButtonBorderRadius = (format: Tema['formatoBotoes']) => {
    switch (format) {
        case 'oval': return '9999px';
        case 'redondo': return '8px';
        case 'quadrado': default: return '0px';
    }
};


// --- Componentes dos Módulos da Página Inicial ---
// Estes componentes precisam estar definidos NO ARQUIVO Preview.tsx ou importados corretamente.
// Para evitar o erro "Cannot find name 'BannerModule'", eu os incluí aqui.

const BannerModule: React.FC<ModuleProps> = ({ module, tema, previewMode }) => {
    const moduleHorizontalPadding = '20px';
    const commonModuleContainerStyle: CSSProperties = {
        backgroundColor: tema.cores.fundo,
        color: tema.cores.texto,
        fontFamily: tema.tipografia.texto,
        fontWeight: tema.tipografia.textoPeso,
        fontSize: tema.tipografia.textoTamanho,
        padding: `0 ${moduleHorizontalPadding}`,
        boxSizing: 'border-box',
        width: '100%',
        marginBottom: '15px',
    };

    const banners: BannerItem[] = (module.config?.banners as BannerItem[]) || [];
    const bannerLayoutType = module.config?.bannerLayoutType || 'full_width';

    if (banners.length === 0) {
        return (
            <div style={{ ...commonModuleContainerStyle, padding: '20px', textAlign: 'center', minHeight: '150px' } as CSSProperties}>
                <h2 style={{ color: tema.cores.texto, fontFamily: tema.tipografia.titulo }}>{module.config?.title || module.label}</h2>
                <p style={{ color: tema.cores.texto, opacity: 0.7 }}>Nenhum banner configurado. Adicione banners no painel.</p>
            </div>
        );
    }

    const renderSingleBannerContent = (banner: BannerItem, customHeight?: string, customWidth?: string) => {
        const bannerImageSrc = previewMode === 'mobile'
            ? (banner.imageUrlMobile || `https://placehold.co/375x150/${tema.cores.secundaria.substring(1)}/FFFFFF/png?text=Banner+Mobile`)
            : (banner.imageUrlDesktop || `https://placehold.co/800x250/${tema.cores.secundaria.substring(1)}/FFFFFF/png?text=Banner+Desktop`);

        const bannerAltText = banner.altText || module.label;
        const bannerLink = banner.linkUrl || '#';
        const borderRadiusStyle = tema.usarBordasArredondadas ? '8px' : '0px';

        return (
            <div style={{
                width: customWidth || '100%',
                height: customHeight || (previewMode === 'mobile' ? '120px' : '200px'),
                backgroundColor: tema.cores.secundaria,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: '1.5rem',
                fontFamily: tema.tipografia.texto,
                borderRadius: borderRadiusStyle,
                overflow: 'hidden',
                position: 'relative',
                boxSizing: 'border-box' as 'border-box',
            } as CSSProperties}>
                <a href={bannerLink} target="_blank" rel="noopener noreferrer" style={{ display: 'block', width: '100%', height: '100%' }}>
                    <img
                        src={bannerImageSrc}
                        alt={bannerAltText}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => (e.currentTarget.src = previewMode === 'mobile' ? 'https://placehold.co/375x120/ccc/fff?text=Banner+Erro' : 'https://placehold.co/800x200/ccc/fff?text=Banner+Erro')}
                    />
                </a>
                {(banner.title || banner.description || banner.buttonText) && (
                    <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff',
                        textAlign: 'center',
                        zIndex: 10,
                        maxWidth: '90%',
                        textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                        boxSizing: 'border-box' as 'border-box',
                    } as CSSProperties}>
                        {banner.title && <h3 style={{ margin: '0 0 5px 0', fontSize: previewMode === 'mobile' ? '1rem' : '1.5rem', wordBreak: 'break-word' }}>{banner.title}</h3>}
                        {banner.description && <p style={{ margin: '0 0 10px 0', fontSize: previewMode === 'mobile' ? '0.7rem' : '0.9rem', wordBreak: 'break-word' }}>{banner.description}</p>}
                        {banner.buttonText && (
                            <a
                                href={banner.buttonLink || bannerLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                    backgroundColor: tema.cores.primaria,
                                    color: tema.cores.footerText,
                                    padding: '6px 12px',
                                    borderRadius: getButtonBorderRadius(tema.formatoBotoes),
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                    fontSize: previewMode === 'mobile' ? '0.7rem' : '0.9rem',
                                    display: 'inline-block',
                                    marginTop: '10px',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {banner.buttonText}
                            </a>
                        )}
                    </div>
                )}
            </div>
        );
    };

    switch (bannerLayoutType) {
        case 'carousel':
        case 'full_width':
            return (
                <div style={{ ...commonModuleContainerStyle, paddingBottom: '0' } as CSSProperties}>
                    {module.config?.title && (
                        <h2 style={{
                            textAlign: 'center',
                            padding: '20px 0',
                            marginBottom: '0px',
                            color: tema.cores.texto,
                            fontFamily: tema.tipografia.titulo,
                            fontWeight: tema.tipografia.tituloPeso,
                            fontSize: tema.tipografia.tituloTamanho
                        }}>
                            {module.config.title}
                        </h2>
                    )}
                    {banners[0] && renderSingleBannerContent(banners[0])}
                </div>
            );
        case 'grid_2x1':
            return (
                <div style={{ ...commonModuleContainerStyle, padding: '20px' } as CSSProperties}>
                    {module.config?.title && (
                        <h2 style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            color: tema.cores.texto,
                            fontFamily: tema.tipografia.titulo,
                            fontWeight: tema.tipografia.tituloPeso,
                            fontSize: tema.tipografia.tituloTamanho
                        }}>
                            {module.config.title}
                        </h2>
                    )}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: previewMode === 'mobile' ? '1fr' : '1fr 1fr',
                        gap: '15px',
                        width: '100%',
                        boxSizing: 'border-box' as 'border-box',
                    } as CSSProperties}>
                        {banners.slice(0, previewMode === 'mobile' ? 2 : 2).map((banner) => (
                            <div key={banner.id} style={{ borderRadius: tema.usarBordasArredondadas ? '8px' : '0px', overflow: 'hidden' }}>
                                {renderSingleBannerContent(banner, previewMode === 'mobile' ? '100px' : '180px')}
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'grid_3x1':
            return (
                <div style={{ ...commonModuleContainerStyle, padding: '20px' } as CSSProperties}>
                    {module.config?.title && (
                        <h2 style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            color: tema.cores.texto,
                            fontFamily: tema.tipografia.titulo,
                            fontWeight: tema.tipografia.tituloPeso,
                            fontSize: tema.tipografia.tituloTamanho
                        }}>
                            {module.config.title}
                        </h2>
                    )}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: previewMode === 'mobile' ? '1fr' : '1fr 1fr 1fr',
                        gap: '15px',
                        width: '100%',
                        boxSizing: 'border-box' as 'border-box',
                    } as CSSProperties}>
                        {banners.slice(0, previewMode === 'mobile' ? 3 : 3).map((banner) => (
                            <div key={banner.id} style={{ borderRadius: tema.usarBordasArredondadas ? '8px' : '0px', overflow: 'hidden' }}>
                                {renderSingleBannerContent(banner, previewMode === 'mobile' ? '80px' : '150px')}
                            </div>
                        ))}
                    </div>
                </div>
            );
        case 'diagonal_left':
        case 'diagonal_right':
            const diagonalBanner = banners[0];
            if (!diagonalBanner) {
                return (
                    <div style={{ ...commonModuleContainerStyle, padding: '20px', textAlign: 'center', minHeight: '150px' } as CSSProperties}>
                        <h2 style={{ color: tema.cores.texto, fontFamily: tema.tipografia.titulo }}>{module.config?.title || module.label}</h2>
                        <p style={{ color: tema.cores.texto, opacity: 0.7 }}>Nenhum banner configurado para layout diagonal.</p>
                    </div>
                );
            }
            return (
                <div style={{ ...commonModuleContainerStyle, padding: '20px', position: 'relative' } as CSSProperties}>
                    {module.config?.title && (
                        <h2 style={{ textAlign: 'center', padding: '0 0 20px 0', color: tema.cores.texto, fontFamily: tema.tipografia.titulo, fontWeight: tema.tipografia.tituloPeso, fontSize: tema.tipografia.tituloTamanho }}>
                            {module.config.title}
                        </h2>
                    )}
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
                        overflow: 'hidden',
                        position: 'relative',
                        boxSizing: 'border-box' as 'border-box',
                        clipPath: bannerLayoutType === 'diagonal_left' ? 'polygon(0 0, 100% 0, 100% 80%, 0% 100%)' : 'polygon(0 0, 100% 0, 100% 100%, 0% 80%)',
                    } as CSSProperties}>
                        <img
                            src={previewMode === 'mobile' ? (diagonalBanner.imageUrlMobile || `https://placehold.co/375x150/${tema.cores.secundaria.substring(1)}}/FFFFFF/png?text=Banner+Diagonal+Mobile`) : (diagonalBanner.imageUrlDesktop || `https://placehold.co/800x250/${tema.cores.secundaria.substring(1)}/FFFFFF/png?text=Banner+Diagonal+Desktop`)}
                            alt={diagonalBanner.altText || module.label}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => (e.currentTarget.src = 'https://placehold.co/800x250/ccc/fff?text=Erro+Diagonal')}
                        />
                        {(diagonalBanner.title || diagonalBanner.description || diagonalBanner.buttonText) && (
                            <div style={{
                                position: 'absolute',
                                top: '50%',
                                left: bannerLayoutType === 'diagonal_left' ? (previewMode === 'mobile' ? '65%' : '70%') : (previewMode === 'mobile' ? '35%' : '30%'),
                                transform: 'translate(-50%, -50%)',
                                color: '#fff',
                                textAlign: 'center',
                                zIndex: 10,
                                maxWidth: previewMode === 'mobile' ? '60%' : '40%',
                                textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
                                boxSizing: 'border-box' as 'border-box',
                                padding: '5px',
                            } as CSSProperties}>
                                {diagonalBanner.title && <h3 style={{ margin: '0 0 5px 0', fontSize: previewMode === 'mobile' ? '0.9rem' : '1.2rem', wordBreak: 'break-word' }}>{diagonalBanner.title}</h3>}
                                {diagonalBanner.description && <p style={{ margin: '0 0 10px 0', fontSize: previewMode === 'mobile' ? '0.65rem' : '0.8rem', wordBreak: 'break-word' }}>{diagonalBanner.description}</p>}
                                {diagonalBanner.buttonText && (
                                    <a
                                        href={diagonalBanner.buttonLink || diagonalBanner.linkUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            backgroundColor: tema.cores.primaria,
                                            color: tema.cores.footerText,
                                            padding: '4px 10px',
                                            borderRadius: getButtonBorderRadius(tema.formatoBotoes),
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                            fontSize: previewMode === 'mobile' ? '0.65rem' : '0.8rem',
                                            display: 'inline-block',
                                            marginTop: '5px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {diagonalBanner.buttonText}
                                    </a>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            );
        default:
            return (
                <div style={{ ...commonModuleContainerStyle, padding: '20px' } as CSSProperties}>
                    <p style={{ color: tema.cores.texto, opacity: 0.7 }}>Layout de banner '{bannerLayoutType}' não implementado no preview.</p>
                    {banners.length > 0 && renderSingleBannerContent(banners[0])}
                </div>
            );
    }
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
    const commonModuleContainerStyle: CSSProperties = {
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
        boxSizing: 'border-box',
        marginBottom: '15px',
    };

    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' } as CSSProperties}>
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
                width: '100%',
                boxSizing: 'border-box',
            } as CSSProperties}>
                {[0, 1, 2, 3, 4, 5].slice(0, previewMode === 'mobile' ? 4 : (tema.quantidadeProdutosPorLinha === '1_cel_3_comp' ? 3 : 4)).map(item => (
                    <div key={item} style={{
                        border: `1px solid ${tema.cores.primaria}`,
                        borderRadius: tema.usarBordasArredondadas ? '8px' : '0px',
                        padding: '10px',
                        textAlign: 'center',
                        backgroundColor: tema.cores.fundo,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        boxSizing: 'border-box' as 'border-box',
                    } as CSSProperties}>
                        <div style={{ fontSize: '3rem', color: tema.cores.primaria, marginBottom: '10px' }}>
                            {productIcons[item % productIcons.length]}
                        </div>
                        <h3 style={{ fontSize: '1rem', color: tema.cores.texto, margin: '10px 0', wordBreak: 'break-word' }}>Produto {item + 1}</h3>
                        <p style={{ color: tema.cores.destaque, fontWeight: 'bold', fontSize: '1.1rem', wordBreak: 'break-word' }}>R$ 99,90</p>
                        <button style={{ ...buttonStyle, width: '100%', marginTop: '10px', padding: '8px 15px' }}>Comprar</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

const CategoryGridModule: React.FC<ModuleProps> = ({ module, tema, previewMode }) => {
    const commonModuleContainerStyle: CSSProperties = {
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
        boxSizing: 'border-box',
        marginBottom: '15px',
    };
    const categories: { id: string; name: string; imageUrl: string; link: string; }[] = (module.config?.categoryImages as any) || [
        { id: 'cat1_default', name: 'Categoria 1', imageUrl: 'https://placehold.co/150x150/e0e0e0/555555/png?text=Cat1', link: '#' },
        { id: 'cat2_default', name: 'Categoria 2', imageUrl: 'https://placehold.co/150x150/e0e0e0/555555/png?text=Cat2', link: '#' },
        { id: 'cat3_default', name: 'Categoria 3', imageUrl: 'https://placehold.co/150x150/e0e0e0/555555/png?text=Cat3', link: '#' },
        { id: 'cat4_default', name: 'Categoria 4', imageUrl: 'https://placehold.co/150x150/e0e0e0/555555/png?text=Cat4', link: '#' },
    ];

    const buttonStyle = {
        backgroundColor: tema.cores.primaria,
        color: tema.cores.footerText,
        padding: '8px 15px',
        border: 'none',
        cursor: 'pointer',
        fontSize: '0.9rem',
        fontWeight: 'bold' as 'bold',
        borderRadius: getButtonBorderRadius(tema.formatoBotoes),
        marginTop: '10px'
    };

    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' } as CSSProperties}>
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
                width: '100%',
                boxSizing: 'border-box' as 'border-box',
            } as CSSProperties}>
                {categories.map((cat: { id: string; name: string; imageUrl: string; link: string; }) => (
                    <div key={cat.id} style={{
                        border: `1px solid ${tema.cores.secundaria}`,
                        borderRadius: tema.usarBordasArredondadas ? '8px' : '0px',
                        padding: '10px',
                        textAlign: 'center',
                        backgroundColor: tema.cores.headerBg,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        boxSizing: 'border-box' as 'border-box',
                    } as CSSProperties}>
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
                            <h3 style={{ fontSize: '1.1rem', color: tema.cores.texto, margin: '0', wordBreak: 'break-word' }}>{cat.name}</h3>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

const TextModule: React.FC<ModuleProps> = ({ module, tema }) => {
    const commonModuleContainerStyle: CSSProperties = {
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
        boxSizing: 'border-box',
        marginBottom: '15px',
    };
    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' } as CSSProperties}>
            <h2 style={{
                textAlign: 'center',
                marginBottom: '15px',
                color: tema.cores.texto,
                fontFamily: tema.tipografia.titulo,
                fontWeight: 'bold',
                fontSize: '1.8rem',
                wordBreak: 'break-word',
            }}>
                {module.config?.title || module.label}
            </h2>
            <p style={{
                textAlign: 'center',
                color: tema.cores.texto,
                fontFamily: tema.tipografia.texto,
                fontSize: '1rem',
                lineHeight: '1.6',
                maxWidth: '700px',
                wordBreak: 'break-word',
                boxSizing: 'border-box' as 'border-box',
            } as CSSProperties}>
                {module.config?.text || "Este é um texto de exemplo para a sua seção de mensagens ou boas vindas. Você pode editá-lo no painel de personalização."}
            </p>
        </div>
    );
};

const NewsletterModule: React.FC<ModuleProps> = ({ module, tema }) => {
    const commonModuleContainerStyle: CSSProperties = {
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
        boxSizing: 'border-box',
        marginBottom: '15px',
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
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    };
    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px', backgroundColor: tema.cores.secundaria, color: tema.cores.footerText } as CSSProperties}>
            <h3 style={{ margin: 0, color: tema.cores.footerText, fontFamily: tema.tipografia.titulo, fontWeight: tema.tipografia.tituloPeso, wordBreak: 'break-word' }}>
                {tema.newsletterTexto || module.config?.title || "Assine nossa Newsletter!"}
            </h3>
            <div style={{ display: 'flex', gap: '10px', width: '80%', maxWidth: '400px', boxSizing: 'border-box' as 'border-box' } as CSSProperties}>
                <input
                    type="email"
                    placeholder={tema.newsletterPlaceholder || "Seu e-mail"}
                    style={{
                        flexGrow: 1,
                        padding: '10px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        backgroundColor: 'transparent',
                        color: tema.cores.footerText,
                        fontFamily: tema.tipografia.texto, fontSize: tema.tipografia.textoTamanho,
                        boxSizing: 'border-box' as 'border-box',
                        minWidth: '0',
                    } as CSSProperties}
                />
                <button style={buttonStyle}>Assinar</button>
            </div>
        </div>
    );
};


const InfoModule: React.FC<ModuleProps> = ({ module, tema }) => {
    const commonModuleContainerStyle: CSSProperties = {
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
        boxSizing: 'border-box',
        marginBottom: '15px',
    };

    const infoItems: InfoItem[] = (module.config?.infoItems as InfoItem[]) || [];

    if (infoItems.length === 0) {
        return (
            <div style={{ ...commonModuleContainerStyle, padding: '20px', textAlign: 'center', minHeight: '150px' } as CSSProperties}>
                <h2 style={{ color: tema.cores.texto, fontFamily: tema.tipografia.titulo }}>{module.config?.title || module.label}</h2>
                <p style={{ color: tema.cores.texto, opacity: 0.7 }}>Nenhum item de informação configurado. Adicione itens no painel.</p>
            </div>
        );
    }

    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' } as CSSProperties}>
            {module.config?.title && (
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: tema.cores.texto,
                    fontFamily: tema.tipografia.titulo,
                    fontWeight: tema.tipografia.tituloPeso,
                    fontSize: tema.tipografia.tituloTamanho,
                    wordBreak: 'break-word',
                }}>
                    {module.config.title}
                </h2>
            )}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px',
                width: '100%',
                boxSizing: 'border-box' as 'border-box',
            } as CSSProperties}>
                {infoItems.filter(item => item.isVisible).map((item, index) => (
                    <div key={item.id} style={{
                        flex: '1 1 250px',
                        maxWidth: '300px',
                        padding: '15px',
                        border: `1px solid ${tema.cores.secundaria}`,
                        borderRadius: tema.usarBordasArredondadas ? '8px' : '0px',
                        textAlign: 'center',
                        backgroundColor: tema.cores.fundo,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        overflow: 'hidden',
                        boxSizing: 'border-box' as 'border-box',
                    } as CSSProperties}>
                        {item?.iconType === 'imagemPropria' && item?.imageUrl ? (
                            <img src={item.imageUrl} alt={item.title} style={{ maxHeight: '50px', marginBottom: '10px', maxWidth: '100%', height: 'auto' }} onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50/ccc/fff?text=Icone')} />
                        ) : (
                            <div style={{ fontSize: '3rem', color: tema.cores.primaria, marginBottom: '10px' }}>
                                {renderIconFromString(item?.iconType || '', 48, tema.cores.primaria)}
                            </div>
                        )}
                        <h3 style={{ fontSize: '1.1rem', color: tema.cores.texto, margin: '10px 0', wordBreak: 'break-word' }}>{item?.title}</h3>
                        <p style={{ fontSize: '0.9rem', color: tema.cores.texto, wordBreak: 'break-word' }}>{item?.description}</p>
                        {item.link && (
                            <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                                display: 'inline-block',
                                marginTop: '10px',
                                color: tema.cores.primaria,
                                textDecoration: 'underline',
                                fontSize: '0.85rem',
                                wordBreak: 'break-word',
                            }}>Saiba Mais</a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const YoutubeVideoModule: React.FC<ModuleProps> = ({ module, tema, previewMode }) => {
    const videos: YoutubeVideoItem[] = (module.config?.videos as YoutubeVideoItem[]) || [];

    const commonModuleContainerStyle: CSSProperties = {
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
        boxSizing: 'border-box',
        marginBottom: '15px',
    };

    if (videos.length === 0) {
        return (
            <div style={{ ...commonModuleContainerStyle, padding: '20px', textAlign: 'center', minHeight: '150px' } as CSSProperties}>
                <h2 style={{ color: tema.cores.texto, fontFamily: tema.tipografia.titulo }}>{module.config?.title || module.label}</h2>
                <p style={{ color: tema.cores.texto, opacity: 0.7 }}>Nenhum vídeo configurado. Adicione vídeos do YouTube no painel.</p>
            </div>
        );
    }

    const displayVideo = videos[0];

    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' } as CSSProperties}>
            {module.config?.title && (
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: tema.cores.texto,
                    fontFamily: tema.tipografia.titulo,
                    fontWeight: tema.tipografia.tituloPeso,
                    fontSize: tema.tipografia.tituloTamanho,
                    wordBreak: 'break-word',
                }}>
                    {module.config.title}
                </h2>
            )}
            <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                width: '100%',
                maxWidth: previewMode === 'mobile' ? '350px' : '800px',
                backgroundColor: '#000',
                borderRadius: tema.usarBordasArredondadas ? '8px' : '0px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                boxSizing: 'border-box' as 'border-box',
            } as CSSProperties}>
                <iframe
                    src={`http://www.youtube.com/embed/${displayVideo.youtubeId}?controls=1&autoplay=${displayVideo.autoplay ? 1 : 0}&loop=${displayVideo.loop ? 1 : 0}&playlist=${displayVideo.loop ? displayVideo.youtubeId : ''}`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={displayVideo.title || "Vídeo do YouTube"}
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%'
                    }}
                ></iframe>
            </div>
            {displayVideo.title && <p style={{ fontSize: '0.9rem', color: tema.cores.texto, marginTop: '10px', wordBreak: 'break-word' }}>{displayVideo.title}</p>}
            {displayVideo.description && <p style={{ fontSize: '0.8rem', color: tema.cores.texto, opacity: 0.8, wordBreak: 'break-word' }}>{displayVideo.description}</p>}
        </div>
    );
};

const TestimonialsModule: React.FC<ModuleProps> = ({ module, tema, previewMode }) => {
    const testimonials: TestimonialItem[] = (module.config?.testimonials as TestimonialItem[]) || [];

    const commonModuleContainerStyle: CSSProperties = {
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
        boxSizing: 'border-box',
        marginBottom: '15px',
    };

    if (testimonials.length === 0) {
        return (
            <div style={{ ...commonModuleContainerStyle, padding: '20px', textAlign: 'center', minHeight: '150px' } as CSSProperties}>
                <h2 style={{ color: tema.cores.texto, fontFamily: tema.tipografia.titulo }}>{module.config?.title || module.label}</h2>
                <p style={{ color: tema.cores.texto, opacity: 0.7 }}>Nenhum depoimento configurado. Adicione depoimentos no painel.</p>
            </div>
        );
    }

    return (
        <div style={{ ...commonModuleContainerStyle, padding: '20px' } as CSSProperties}>
            {module.config?.title && (
                <h2 style={{
                    textAlign: 'center',
                    marginBottom: '20px',
                    color: tema.cores.texto,
                    fontFamily: tema.tipografia.titulo,
                    fontWeight: tema.tipografia.tituloPeso,
                    fontSize: tema.tipografia.tituloTamanho,
                    wordBreak: 'break-word',
                }}>
                    {module.config.title}
                </h2>
            )}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px',
                width: '100%',
                boxSizing: 'border-box' as 'border-box',
            } as CSSProperties}>
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} style={{
                        flex: '1 1 280px',
                        maxWidth: '350px',
                        padding: '20px',
                        border: `1px solid ${tema.cores.secundaria}`,
                        borderRadius: tema.usarBordasArredondadas ? '8px' : '0px',
                        backgroundColor: tema.cores.headerBg,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        textAlign: 'left',
                        overflow: 'hidden',
                        boxSizing: 'border-box' as 'border-box',
                    } as CSSProperties}>
                        {testimonial.avatarUrl && (
                            <img
                                src={testimonial.avatarUrl}
                                alt={testimonial.author}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginBottom: '10px',
                                    float: 'left',
                                    marginRight: '10px',
                                    flexShrink: 0,
                                }}
                                onError={(e) => (e.currentTarget.src = 'https://placehold.co/50x50/ccc/fff?text=Avatar')}
                            />
                        )}
                        <p style={{
                            fontSize: '0.95rem',
                            fontStyle: 'italic',
                            color: tema.cores.texto,
                            marginBottom: '10px',
                            minHeight: '60px',
                            wordBreak: 'break-word',
                        }}>
                            "{testimonial.text}"
                        </p>
                        <p style={{
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            color: tema.cores.destaque,
                            textAlign: 'right',
                            wordBreak: 'break-word',
                        }}>
                            - {testimonial.author}
                        </p>
                        {testimonial.rating && (
                            <div style={{ textAlign: 'right', color: tema.cores.destaque }}>
                                {'★'.repeat(testimonial.rating) + '☆'.repeat(5 - testimonial.rating)}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Componente Principal Preview ---

export default function Preview({ previewMode }: PreviewProps) {
    const { tema } = useEditor();

    const headerStyle: CSSProperties = {
        backgroundColor: tema.cores.headerBg,
        color: tema.cores.headerText,
        fontFamily: tema.tipografia.titulo,
        fontWeight: tema.tipografia.tituloPeso,
        fontSize: tema.tipografia.tituloTamanho,
        padding: '8px 20px',
        borderRadius: tema.usarBordasArredondadas ? '10px 10px 0 0' : '0',
        boxSizing: 'border-box',
        flexShrink: 0, // Garante que o cabeçalho do TEMA não encolha
    };

    const commonPageSectionStyle: CSSProperties = {
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
        borderRadius: tema.usarBordasArredondadas ? '0 0 10px 10px' : '0',
        marginTop: '0px',
        boxSizing: 'border-box',
    };

    const iconStyle = {
        fontSize: tema.estiloIconesDesktop === 'grande' ? '1.5rem' : '1.2rem',
        color: tema.cores.headerText,
        cursor: 'pointer',
        flexShrink: 0,
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

    // *** Estilo do CONTAINER PRINCIPAL DO PREVIEW ***
    const previewContainerStyle: CSSProperties = {
        maxWidth: previewMode === 'mobile' ? '375px' : '100%',
        width: '100%',
        height: '100%', // <<--- CRÍTICO: Ocupa 100% da altura do seu PAI (`div` em layout.tsx com flex: 1)
        margin: '0 auto',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflowY: 'auto', // <<--- CRÍTICO: ESTE É O ELEMENTO QUE VAI TER A BARRA DE ROLAGEM para o conteúdo do tema
        overflowX: 'hidden', // Sem rolagem horizontal no preview
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        transition: 'max-width 0.3s ease-in-out',
        backgroundColor: tema.cores.fundo,
        display: 'flex',
        flexDirection: 'column' as 'column', // Organiza header do tema, módulos e footer do tema em coluna
        boxSizing: 'border-box',
    };

    const MobileHeaderContent = () => {
        const mobileIconStyle = {
            fontSize: tema.estiloIconesDesktop === 'grande' ? '1.8rem' : '1.5rem',
            color: tema.cores.headerText,
            cursor: 'pointer',
            flexShrink: 0,
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
                <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${tema.cores.secundaria}`, borderRadius: '25px', padding: '5px 15px', backgroundColor: tema.cores.fundo }}>
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
                            color: tema.cores.texto,
                            minWidth: '0',
                        }}
                    />
                    <FaSearch style={{ color: tema.cores.secundaria, cursor: 'pointer', flexShrink: 0 }} />
                </div>
            </div>
        );

        const mobileMenuHorizontal = (
            <nav style={{ width: '100%', textAlign: 'center', paddingBottom: '15px', boxSizing: 'border-box', overflow: 'hidden' } as CSSProperties}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', flexDirection: 'row' }}>
                    <li><a href="#" style={{ color: tema.cores.headerText, textDecoration: 'none', fontWeight: tema.tipografia.textoPeso, fontSize: tema.tipografia.textoTamanho, fontFamily: tema.tipografia.texto, flexShrink: 0, whiteSpace: 'nowrap' }}>Início</a></li>
                    <li><a href="#" style={{ color: tema.cores.headerText, textDecoration: 'none', fontWeight: tema.tipografia.textoPeso, fontSize: tema.tipografia.textoTamanho, fontFamily: tema.tipografia.texto, flexShrink: 0, whiteSpace: 'nowrap' }}>Produtos</a></li>
                    <li><a href="#" style={{ color: tema.cores.headerText, textDecoration: 'none', fontWeight: tema.tipografia.textoPeso, fontSize: tema.tipografia.textoTamanho, fontFamily: tema.tipografia.texto, flexShrink: 0, whiteSpace: 'nowrap' }}>Contato</a></li>
                    <li><a href="#" style={{ color: tema.cores.headerText, textDecoration: 'none', fontWeight: tema.tipografia.textoPeso, fontSize: tema.tipografia.textoTamanho, fontFamily: tema.tipografia.texto, flexShrink: 0, whiteSpace: 'nowrap' }}>Categorias Grandes</a></li>
                    <li><a href="#" style={{ color: tema.cores.headerText, textDecoration: 'none', fontWeight: tema.tipografia.textoPeso, fontSize: tema.tipografia.textoTamanho, fontFamily: tema.tipografia.texto, flexShrink: 0, whiteSpace: 'nowrap' }}>Ofertas do Dia</a></li>
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
            default: // Fallback para qualquer caso não mapeado, pode ser o barraPesquisaGrande
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
            {/* Barra de Anúncio Superior (do TEMA) */}
            {tema.mostrarBarraAnuncio && (
                <div style={{
                    backgroundColor: tema.cores.secundaria,
                    color: tema.cores.footerText,
                    padding: '3px 15px',
                    textAlign: 'center',
                    fontSize: '0.8rem',
                    fontFamily: tema.tipografia.texto,
                    flexShrink: 0,
                    boxSizing: 'border-box' as 'border-box',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                } as CSSProperties}>
                    {tema.linkBarraAnuncio ? (
                        <a href={tema.linkBarraAnuncio} target="_blank" rel="noopener noreferrer" style={{ color: tema.cores.footerText, textDecoration: 'underline' }}>
                            {tema.mensagemBarraAnuncio}
                        </a>
                    ) : (
                        tema.mensagemBarraAnuncio
                    )}
                </div>
            )}

            {/* CABEÇALHO PRINCIPAL DA LOJA (do TEMA) */}
            <header style={{ ...headerStyle, paddingBottom: '5px', flexShrink: 0 } as CSSProperties}>
                {previewMode === 'desktop' ? (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', paddingTop: '5px' }}>
                            <div style={{ flexGrow: 1, display: 'flex', justifyContent: tema.posicaoLogoDesktop === 'centralizado' ? 'center' : 'flex-start', alignItems: 'center' }}>
                                <img
                                    src={tema.logoUrl}
                                    alt="Logo da Loja"
                                    style={{
                                        maxWidth: tema.tamanhoLogo === 'pequeno' ? '90px' : tema.tamanhoLogo === 'grande' ? '160px' : '120px',
                                        height: 'auto',
                                        display: 'block'
                                    }}
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/120x40/ccc/fff?text=Logo+Erro')}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexShrink: 0 }}>
                                <FaUser style={{ ...iconStyle, fontSize: tema.estiloIconesDesktop === 'grande' ? '1.4rem' : '1.1rem' }} title="Minha Conta" />
                                <FaShoppingCart style={{ ...iconStyle, fontSize: tema.estiloIconesDesktop === 'grande' ? '1.4rem' : '1.1rem' }} title="Meu Carrinho" />
                                <FaHeadset style={{ ...iconStyle, fontSize: tema.estiloIconesDesktop === 'grande' ? '1.4rem' : '1.1rem' }} title="Atendimento" />
                            </div>
                        </div>
                        <div style={{ width: '100%', marginTop: '5px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: `1px solid ${tema.cores.secundaria}`, borderRadius: '25px', padding: '4px 12px', backgroundColor: tema.cores.fundo }}>
                                <input
                                    type="text"
                                    placeholder="O que você está buscando?"
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        flexGrow: 1,
                                        backgroundColor: 'transparent',
                                        padding: '6px 0',
                                        fontFamily: tema.tipografia.texto,
                                        fontSize: '0.85rem',
                                        color: tema.cores.texto,
                                        minWidth: '0',
                                    }}
                                />
                                <FaSearch style={{ color: tema.cores.secundaria, cursor: 'pointer', flexShrink: 0, fontSize: '1.1rem' }} />
                            </div>
                        </div>
                        <hr style={{ width: '100%', border: 'none', borderTop: `1px solid ${tema.cores.secundaria}`, margin: '8px 0' }} />
                        <nav style={{ width: '100%', textAlign: 'center', paddingBottom: '8px', boxSizing: 'border-box', overflow: 'hidden' } as CSSProperties}>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px' }}>
                                {['Início', 'Produtos', 'Rastreie seu pedido', 'Contato', 'Trocas e Devoluções', 'Guia de Medidas', 'Cuidados e Garantias', 'Blog', 'Promoções', 'Novidades'].map(label => (
                                    <li key={label} style={{ flexShrink: 0 }}>
                                        <a href="#" style={{
                                            color: tema.cores.headerText,
                                            textDecoration: 'none',
                                            fontWeight: tema.tipografia.textoPeso,
                                            fontSize: '0.8rem',
                                            fontFamily: tema.tipografia.texto,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            whiteSpace: 'nowrap',
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

            {/* Container para os Módulos da Página Inicial (conteúdo principal do preview) */}
            {/* Este div flexGrow: 1 e overflowY: 'auto' é crucial para a rolagem dos módulos */}
            <div style={{ flexGrow: 1, overflowY: 'auto', overflowX: 'hidden', boxSizing: 'border-box' as 'border-box', display: 'flex', flexDirection: 'column' } as CSSProperties}>
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
                        case 'youtube_video':
                            return <YoutubeVideoModule key={module.id} module={module} tema={tema} previewMode={previewMode} />;
                        case 'testimonials':
                            return <TestimonialsModule key={module.id} module={module} tema={tema} previewMode={previewMode} />;
                        case 'highlight_banners':
                            return (
                                <div key={module.id} style={{ ...commonPageSectionStyle, padding: '15px', backgroundColor: '#add8e6', color: '#005f7a', border: '1px solid #87ceeb', marginBottom: '10px' } as CSSProperties}>
                                    <h3 style={{ margin: 0, fontSize: '0.9rem' }}>Módulo "{module.label}" - Antigo Destaque/Banner (Configuração Pendente)</h3>
                                    <p style={{ fontSize: '0.7rem', opacity: '0.9' }}>Este módulo ainda precisa de um componente de visualização (`HighlightBannersModule`) no Preview.tsx ou ser substituído por um módulo 'banner' com layout de grade.</p>
                                </div>
                            );
                        default:
                            return (
                                <div key={module.id} style={{ ...commonPageSectionStyle, padding: '15px', backgroundColor: '#f8d7da', color: '#721c24', border: '1px solid #f5c6cb', marginBottom: '10px' } as CSSProperties}>
                                    <h3 style={{ margin: 0, fontSize: '0.9rem' }}>Módulo "{module.label}" - Tipo desconhecido ou não renderizado no preview.</h3>
                                    <p style={{ fontSize: '0.8rem', opacity: '0.9' }}>Verifique o tipo do módulo em EditorContext ou adicione um componente para ele no Preview.tsx.</p>
                                </div>
                            );
                    }
                })}
            </div>

            {/* Rodapé (Completo com informações fake) */}
            <footer style={{
                backgroundColor: tema.rodape_usarCoresPersonalizadas ? tema.rodape_fundo : tema.cores.footerBg,
                color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText,
                padding: '10px 20px',
                textAlign: 'center',
                fontFamily: tema.tipografia.texto,
                fontSize: '0.8rem',
                flexShrink: 0,
                boxSizing: 'border-box' as 'border-box',
                marginTop: 'auto', // Fixa o rodapé do tema na parte inferior do Preview, empurrando o conteúdo para cima
            } as CSSProperties}>
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'space-around',
                    gap: '10px',
                    marginBottom: '10px',
                    textAlign: previewMode === 'mobile' ? 'center' : 'left',
                    flexDirection: previewMode === 'mobile' ? 'column' : 'row'
                } as CSSProperties}>
                    <div style={{ flex: '1 1 180px', minWidth: '120px', boxSizing: 'border-box' as 'border-box' } as CSSProperties}>
                        <h4 style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, fontSize: '0.8rem', marginBottom: '6px' }}>Atendimento</h4>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            <li style={{ marginBottom: '2px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none', wordBreak: 'break-word', fontSize: '0.75rem' }}>Central de Ajuda</a></li>
                            <li style={{ marginBottom: '2px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none', wordBreak: 'break-word', fontSize: '0.75rem' }}>Trocas e Devoluções</a></li>
                            <li style={{ marginBottom: '2px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none', wordBreak: 'break-word', fontSize: '0.75rem' }}>Política de Privacidade</a></li>
                            <li style={{ marginBottom: '2px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none', wordBreak: 'break-word', fontSize: '0.75rem' }}>Termos de Serviço</a></li>
                            <li style={{ marginBottom: '2px' }}><a href="#" style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, textDecoration: 'none', wordBreak: 'break-word', fontSize: '0.75rem' }}>Sobre Nós</a></li>
                        </ul>
                    </div>

                    <div style={{ flex: '1 1 120px', minWidth: '80px', boxSizing: 'border-box' as 'border-box' } as CSSProperties}>
                        <h4 style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, fontSize: '0.8rem', marginBottom: '6px' }}>Pagamento</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <img src="https://placehold.co/40x25/f0f0f0/666666/png?text=Visa" alt="Visa" style={{ borderRadius: '3px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                            <img src="https://placehold.co/40x25/f0f0f0/666666/png?text=Master" alt="Mastercard" style={{ borderRadius: '3px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                            <img src="https://placehold.co/40x25/f0f0f0/666666/png?text=Boleto" alt="Boleto" style={{ borderRadius: '3px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                            <img src="https://placehold.co/40x25/f0f0f0/666666/png?text=Pix" alt="Pix" style={{ borderRadius: '3px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                            <img src="https://placehold.co/40x25/f0f0f0/666666/png?text=Amex" alt="American Express" style={{ borderRadius: '3px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                            <img src="https://placehold.co/40x25/f0f0f0/666666/png?text=Elo" alt="Elo" style={{ borderRadius: '3px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                        </div>
                    </div>

                    <div style={{ flex: '1 1 120px', minWidth: '80px', boxSizing: 'border-box' as 'border-box' } as CSSProperties}>
                        <h4 style={{ color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText, fontSize: '0.9rem', marginBottom: '8px' }}>Envio</h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <img src="https://placehold.co/40x25/f0f0f0/666666/png?text=Correios" alt="Correios" style={{ borderRadius: '3px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                            <img src="https://placehold.co/40x25/f0f0f0/666666/png?text=Transportadora" alt="Transportadora" style={{ borderRadius: '3px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                            <img src="https://placehold.co/40x25/f0f0f0/666666/png?text=Retira" alt="Retirada Local" style={{ borderRadius: '3px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                        </div>
                    </div>
                </div>

                <div style={{
                    marginTop: '10px',
                    borderTop: `1px solid ${tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones + '33' : tema.cores.footerText + '33'}`,
                    paddingTop: '8px',
                    fontSize: '0.65rem',
                    color: tema.rodape_usarCoresPersonalizadas ? tema.rodape_textoIcones : tema.cores.footerText,
                    textAlign: 'center',
                    wordBreak: 'break-word',
                }}>
                    <p style={{ margin: '1px 0' }}>**Sua Loja Genérica E-commerce Ltda.**</p>
                    <p style={{ margin: '1px 0' }}>CNPJ: 00.000.000/0001-00 | Rua Exemplo, 123 - Bairro - Cidade, Estado - CEP: 00000-000</p>
                    <p style={{ margin: '1px 0' }}>Email: contato@sua-loja.com</p>
                </div>

                <div style={{
                    marginTop: '8px',
                    display: 'flex',
                    flexDirection: previewMode === 'mobile' ? 'column' : 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '5px',
                    boxSizing: 'border-box' as 'border-box',
                } as CSSProperties}>
                    {tema.rodape_seloImagemUrl && (
                        <img src={tema.rodape_seloImagemUrl} alt="Selo Personalizado" style={{ maxHeight: '30px', margin: '2px', maxWidth: '100%', height: 'auto', flexShrink: 0 }} />
                    )}
                    {tema.rodape_seloHtmlCode && (
                        <div dangerouslySetInnerHTML={{ __html: tema.rodape_seloHtmlCode }} style={{ wordBreak: 'break-word' }} />
                    )}
                    <p style={{ margin: '0', fontSize: '0.6rem', opacity: '0.8', wordBreak: 'break-word' }}>{tema.rodapeTextoFinal || 'Direitos Reservados © 2025 Sua Loja Genérica'}</p>
                </div>
            </footer>
        </div>
    );
}