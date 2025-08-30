// app/(painel)/personalizar/components/Preview.tsx

'use client';
import React, { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import styles from './Preview.module.css';

const Preview: React.FC = () => {
    const { iframeRef, previewMode, lojaSlug } = useTheme(); // Adicione lojaSlug aqui

    // CORREÇÃO: Voltar para a URL dinâmica da sua loja
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
    }, [iframeRef, lojaSlug]); // Adicione lojaSlug nas dependências

    const iframeClass = previewMode === 'mobile' ? styles.mobilePreview : styles.desktopPreview;

    return (
        <div className={styles.previewContainer}>
            <iframe
                ref={iframeRef}
                src={iframeSrc}
                className={`${styles.iframeBase} ${iframeClass}`}
                title="Pré-visualização da Loja"
                // Mantenha as permissões do sandbox ajustadas que você já testou
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals allow-pointer-lock allow-downloads" 
            />
        </div>
    );
};

export default Preview;