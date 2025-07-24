'use client';

import React, { useRef, useEffect, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './Preview.module.css';

import { ThemeConfig } from '../types'; 

const Preview: React.FC = () => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const { config, previewMode, selectedTheme } = useTheme();

    const loadGoogleFontInIframe = (fontName: string, doc: Document) => {
        if (!fontName || fontName === 'sans-serif' || fontName === 'serif' || fontName === 'monospace') return;
        const formattedFontName = fontName.replace(/\s/g, '+');
        const fontUrl = `https://fonts.googleapis.com/css2?family=${formattedFontName}:wght@300;400;500;600;700&display=swap`;

        const existingLink = doc.querySelector(`link[href*="family=${formattedFontName}"]`);
        if (existingLink) {
            return;
        }

        const link = doc.createElement('link');
        link.rel = 'stylesheet';
        link.href = fontUrl;
        doc.head.appendChild(link);
    };

    // Função para enviar a configuração para o iframe (memorizada com useCallback)
    const sendConfigToIframe = useCallback(() => {
        const iframe = iframeRef.current;
        if (iframe && iframe.contentWindow) {
            // Enviamos a configuração completa para o iframe
            iframe.contentWindow.postMessage({ type: 'UPDATE_THEME_CONFIG', config: config }, '*'); // Use '*' para dev, especifique a origem em prod
        }
    }, [config]); // Re-cria a função apenas se 'config' mudar

    const injectStylesIntoIframe = useCallback(() => { // Envolvido em useCallback
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentDocument) return;

        const doc = iframe.contentDocument;

        // Remove estilos dinâmicos existentes para evitar duplicação
        const oldDynamicStyle = doc.getElementById('dynamic-theme-styles');
        if (oldDynamicStyle) oldDynamicStyle.remove();

        const style = doc.createElement('style');
        style.id = 'dynamic-theme-styles';
        style.type = 'text/css';

        // Carrega fontes no head do iframe
        if (config.primaryFont) {
            loadGoogleFontInIframe(config.primaryFont, doc);
        }
        if (config.secondaryFont && config.secondaryFont !== config.primaryFont) {
            loadGoogleFontInIframe(config.secondaryFont, doc);
        }

        // Mapeamento para tamanhos de fonte base (para o tema)
        const baseFontSizeMap = {
            'small': '0.875em', // ~14px se o base for 16px
            'medium': '1em',    // ~16px
            'large': '1.125em'  // ~18px
        };
        const titleFontSizeMap = { // Exemplo de mapeamento diferente para títulos, se quiser mais controle
            'small': '2em', // H1 (ou outro base) para títulos grandes
            'medium': '2.5em',
            'large': '3em'
        };


        // --- Variáveis CSS globais baseadas em ThemeConfig ---
        let cssVariables = `:root {`;

        // Cores
        cssVariables += `--primary-color: ${config.primaryColor ?? '#5b21b6'};`;
        cssVariables += `--secondary-color: ${config.secondaryColor ?? '#6c757d'};`;
        cssVariables += `--text-color: ${config.textColor ?? '#343a40'};`; 

        // Header
        cssVariables += `--header-background-color: ${config.headerBackgroundColor ?? '#ffffff'};`;
        cssVariables += `--header-text-color: ${config.headerTextColor ?? '#343a40'};`;

        // Footer
        cssVariables += `--footer-background-color: ${config.footer?.footerBackgroundColor ?? '#343a40'};`;
        cssVariables += `--footer-text-color: ${config.footer?.footerTextColor ?? '#ffffff'};`;

        // Fonts
        cssVariables += `--primary-font: '${config.primaryFont ?? 'sans-serif'}', sans-serif;`; 
        cssVariables += `--secondary-font: '${config.secondaryFont ?? 'sans-serif'}', sans-serif;`; 
        cssVariables += `--title-base-font-size-value: ${titleFontSizeMap[config.titleBaseFontSize || 'medium']};`; // Nova var
        cssVariables += `--text-base-font-size-value: ${baseFontSizeMap[config.textBaseFontSize || 'medium']};`;   // Nova var

        // Design
        if (config.design) {
            cssVariables += `--button-border-radius: ${config.design.buttonBorderRadius === 'square' ? '0' : config.design.buttonBorderRadius === 'rounded' ? '8px' : config.design.buttonBorderRadius === 'oval' ? '9999px' : '8px'};`;
            cssVariables += `--image-border-radius: ${config.design.imageBorderRadius === 'square' ? '0' : config.design.imageBorderRadius === 'rounded' ? '8px' : config.design.imageBorderRadius === 'circle' ? '50%' : '0'};`;
            cssVariables += `--scrollbar-color: ${config.design.scrollbarColor ?? '#007bff'};`;
            cssVariables += `--shadow-style: ${config.design.enableShadows && config.design.shadowStyle !== 'none' ?
                                (config.design.shadowStyle === 'small' ? '0 1px 3px rgba(0,0,0,0.1)' :
                                 config.design.shadowStyle === 'medium' ? '0 4px 8px rgba(0,0,0,0.15)' :
                                 '0 8px 16px rgba(0,0,0,0.2)') : 'none'};`; 
        }

        cssVariables += `}`; // Fecha :root

        // --- Regras CSS Dinâmicas baseadas em ThemeConfig ---
        const headerSettings = config.headerSettings || {}; // Acesso seguro
        let dynamicStyles = `
            /* Tamanhos de fonte aplicados globalmente */
            html {
                font-size: var(--text-base-font-size-value);
            }
            h1, h2, h3, h4, h5, h6 {
                font-size: var(--title-base-font-size-value); /* Ajuste para ter uma base e depois variar */
            }
            h1 { font-size: calc(var(--title-base-font-size-value) * 1.2); } /* Exemplo de hierarquia */
            h2 { font-size: calc(var(--title-base-font-size-value) * 1); }
            p { font-size: var(--text-base-font-size-value); }


            /* Header */
            .theme-header {
                ${config.fixedHeader ? 'position: sticky; top: 0; z-index: 1000;' : ''}
            }
            /* Lógica para a logo no header */
            .theme-header-logo {
                max-height: ${headerSettings.logoSize === 'small' ? '30px' : headerSettings.logoSize === 'large' ? '60px' : '40px'};
                width: auto;
            }
            /* Lógica para iconSize (ex: carrinho, lupa) */
            .theme-header .icon {
                font-size: ${headerSettings.iconSize === 'small' ? '18px' : headerSettings.iconSize === 'large' ? '28px' : '24px'};
            }
            /* Lógica para a barra de pesquisa */
            #theme-search-bar-container {
                ${headerSettings.desktopSearch === 'icon' && previewMode === 'desktop' ? 'display: none;' : ''}
                ${headerSettings.mobileSearch === 'icon' && previewMode === 'mobile' ? 'display: none;' : ''}
                ${headerSettings.desktopSearch === 'bar' && previewMode === 'desktop' ? 'display: block;' : ''}
                ${headerSettings.mobileSearch === 'bar' && previewMode === 'mobile' ? 'display: block;' : ''}
            }


            /* Barra de anúncio */
            .theme-announcement-bar {
                background-color: ${config.primaryColor ?? '#5b21b6'};
                color: white;
                padding: 8px 15px;
                text-align: center;
                font-size: 0.9em;
                ${!(headerSettings.showAnnouncementBar ?? false) ? 'display: none;' : ''}
            }
            .theme-announcement-bar a {
                color: inherit;
                text-decoration: none;
            }
            .theme-announcement-bar.marquee {
                overflow: hidden;
                white-space: nowrap;
                position: relative;
            }
            .theme-announcement-bar.marquee .announcement-content { /* Conteúdo para animar */
                display: inline-block;
                padding-left: 100%;
                animation: marquee ${headerSettings.announcementText?.length && headerSettings.announcementText.length > 50 ? '20s' : '10s'} linear infinite; 
            }
            @keyframes marquee {
                0%   { transform: translate(0, 0); }
                100% { transform: translate(-100%, 0); }
            }


            /* Buttons */
            .btn, button, .theme-button {
                /* As cores e bordas são baseadas no buttonVariant */
            }
            ${config.design?.buttonVariant === 'bordered' ? `
                .btn, button, .theme-button {
                    border: 1px solid ${config.primaryColor ?? '#5b21b6'};
                    background-color: transparent;
                    color: ${config.primaryColor ?? '#5b21b6'};
                }
                .btn:hover, button:hover, .theme-button:hover {
                    background-color: ${config.primaryColor ?? '#5b21b6'};
                    color: white;
                }
            ` : config.design?.buttonVariant === 'filled' ? `
                .btn, button, .theme-button {
                    border: none;
                    background-color: ${config.primaryColor ?? '#5b21b6'};
                    color: white;
                }
                .btn:hover, button:hover, .theme-button:hover {
                    opacity: 0.9;
                }
            ` : ` /* Fallback para quando buttonVariant for undefined ou outro */
                .btn, button, .theme-button {
                    border: none;
                    background-color: ${config.primaryColor ?? '#5b21b6'};
                    color: white;
                }
                .btn:hover, button:hover, .theme-button:hover {
                    opacity: 0.9;
                }
            `}

            /* Product List Layout */
            .theme-product-list-grid {
                ${config.productList?.layout === 'grid' ? `
                    grid-template-columns: repeat(${config.productList.gridColumns}, 1fr);
                ` : `
                    grid-template-columns: 1fr;
                `}
            }

            /* Product Detail Image Position */
            .product-detail-layout .product-gallery {
                 flex-direction: ${config.productDetail?.imagePosition === 'top-gallery' ? 'column' : 'row'};
            }
            /* Adicione estilos para left/right se precisar. No layout base, side-gallery se comporta como row */


            /* Custom Scrollbar */
            ${config.design?.enableCustomScrollbar && config.design?.scrollbarColor ? `
                ::-webkit-scrollbar { width: 10px; }
                ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 5px; }
                ::-webkit-scrollbar-thumb { background: ${config.design.scrollbarColor}; border-radius: 5px; }
                ::-webkit-scrollbar-thumb:hover { background: ${config.design.scrollbarColor}da; }
                html { scrollbar-width: thin; scrollbar-color: ${config.design.scrollbarColor} #f1f1f1; }
            ` : ''}

            /* Hover Effects (classes adicionadas via JS no iframe, estilos aqui) */
            ${config.design?.enableHoverEffects ? `
                .theme-hover-scale:hover { transform: scale(1.03); transition: transform 0.3s ease; }
                .theme-hover-opacity:hover { opacity: 0.8; transition: opacity 0.3s ease; }
            ` : ''}
            
            ${config.advanced?.customCss || ''} /* Custom CSS no final */
        `;

        // Adiciona todas as variáveis e estilos dinâmicos
        style.appendChild(doc.createTextNode(cssVariables + dynamicStyles));
        doc.head.appendChild(style);
    }, [config, previewMode]); // Adicionado config e previewMode para recriar a função quando mudarem

    // Carrega o tema selecionado no iframe
    useEffect(() => {
        if (iframeRef.current) {
            iframeRef.current.src = `/themes/${selectedTheme}/index.html`;
        }
    }, [selectedTheme]);

    // Lida com o carregamento do iframe e com as atualizações de configuração
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) return;

        const onLoadHandler = () => {
            console.log('Iframe carregado. Injetando estilos e enviando config inicial...');
            injectStylesIntoIframe();
            sendConfigToIframe(); 
        };

        const handleMessageFromIframe = (event: MessageEvent) => {
            if (event.data && event.data.type === 'REQUEST_THEME_CONFIG') {
                console.log('Iframe solicitou configuração. Reenviando...');
                sendConfigToIframe(); 
            }
        };

        if (iframe.contentDocument && iframe.contentDocument.readyState === 'complete') {
            onLoadHandler();
        } else {
            iframe.addEventListener('load', onLoadHandler);
        }
        window.addEventListener('message', handleMessageFromIframe);

        return () => {
            iframe.removeEventListener('load', onLoadHandler);
            window.removeEventListener('message', handleMessageFromIframe);
        };
    }, [sendConfigToIframe, injectStylesIntoIframe]); // Dependências ajustadas

    // Re-envia a configuração sempre que ela muda (para atualizações em tempo real)
    useEffect(() => {
        // console.log('Configuração do painel alterada. Enviando para o iframe...');
        sendConfigToIframe();
        injectStylesIntoIframe(); // Garante que estilos condicionais (display: none etc) sejam atualizados
    }, [sendConfigToIframe, injectStylesIntoIframe]);


    return (
        <div className={`${styles.previewContainer} ${styles[previewMode]}`}>
            <iframe
                ref={iframeRef}
                title="Theme Preview"
                className={styles.themeIframe}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals" 
            />
        </div>
    );
};

export default Preview;