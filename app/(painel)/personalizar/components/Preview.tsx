'use client';

import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './Preview.module.css';
import { Monitor, Smartphone } from 'lucide-react';

const Preview: React.FC = () => {
    const { iframeRef, previewMode, setPreviewMode, lojaSlug } = useTheme();
    const iframeSrc = `/sitetemas/${lojaSlug}`;

    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe) {
            console.error("Erro: iframeRef.current é null.");
            return;
        }

        const onLoadHandler = () => {
            console.log('Depuração: Iframe carregou o conteúdo da loja.');
        };

        iframe.addEventListener('load', onLoadHandler);
        return () => iframe.removeEventListener('load', onLoadHandler);
    }, [iframeRef, lojaSlug]);

    const iframeClass = previewMode === 'mobile' ? styles.mobilePreview : styles.desktopPreview;

    // Define as classes do container interno de forma condicional
    let innerContainerClasses = '';
    if (previewMode === 'mobile') {
        innerContainerClasses = `${styles.mobilePadding} ${styles.centeredIframeArea}`;
    } else {
        innerContainerClasses = `${styles.desktopPadding}`;
    }

    return (
        <div className={styles.previewContainer}>
            <div className={styles.previewToolbar}>
                <div className={styles.modeSwitch}>
                    <button
                        className={previewMode === 'desktop' ? styles.active : ''}
                        onClick={() => setPreviewMode('desktop')}
                        title="Desktop"
                        aria-label="Desktop"
                        type="button"
                    >
                        <Monitor size={18} />
                    </button>
                    <button
                        className={previewMode === 'mobile' ? styles.active : ''}
                        onClick={() => setPreviewMode('mobile')}
                        title="Mobile"
                        aria-label="Mobile"
                        type="button"
                    >
                        <Smartphone size={18} />
                    </button>
                </div>
                <a
                    href={iframeSrc}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.viewStoreLink}
                >
                    Ver Loja ↗
                </a>
            </div>
            {/* O NOVO DIV QUE RECEBE OS PADDINGS E CENTRALIZAÇÃO */}
            <div className={`${styles.iframeArea} ${innerContainerClasses}`}>
                <iframe
                    ref={iframeRef}
                    src={iframeSrc}
                    className={`${styles.iframeBase} ${iframeClass}`}
                    title="Pré-visualização da Loja"
                    sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock allow-downloads"
                />
            </div>
        </div>
    );
};

export default Preview;