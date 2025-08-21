// app/(sitetemas)/[lojaSlug]/components/TextWithImageSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';

// REMOVIDO: import '../styles/text-with-image-section.css'; // O estilo virá do tema ativo

interface ImageItem {
    id: string;
    url: string;
    alt: string;
    link?: string; // Link opcional para a imagem
}

interface TextWithImageSectionProps {
    title?: string;
    subtitle?: string;
    contentHtml: string; // Conteúdo principal em HTML
    images: ImageItem[]; // Array de imagens para a seção
    imagePosition?: 'left' | 'right' | 'top' | 'bottom'; // Posição das imagens em relação ao texto
    callToActionText?: string; // Texto do botão de CTA
    callToActionLink?: string; // Link do botão de CTA
}

const TextWithImageSection: React.FC<TextWithImageSectionProps> = ({ 
    title, 
    subtitle, 
    contentHtml, 
    images, 
    imagePosition = 'right', // Padrão: imagem à direita
    callToActionText, 
    callToActionLink 
}) => {
    if (!contentHtml && (!images || images.length === 0)) {
        return null; // Não renderiza a seção se não houver conteúdo nem imagens
    }

    const sectionClasses = `ph-text-with-image-section ph-image-position-${imagePosition}`;

    return (
        <section className={sectionClasses}>
            <div className="ph-text-with-image-content">
                {title && <h2 className="ph-text-with-image-title">{title}</h2>}
                {subtitle && <p className="ph-text-with-image-subtitle">{subtitle}</p>}
                <div className="ph-text-with-image-text" dangerouslySetInnerHTML={{ __html: contentHtml }} />
                {callToActionText && callToActionLink && (
                    <Link href={callToActionLink} className="ph-text-with-image-cta-button">
                        {callToActionText}
                    </Link>
                )}
            </div>
            
            {images && images.length > 0 && (
                <div className="ph-text-with-image-gallery">
                    {images.map(image => (
                        <div key={image.id} className="ph-text-with-image-item">
                            {image.link ? (
                                <Link href={image.link}>
                                    <img 
                                        src={image.url} 
                                        alt={image.alt} 
                                        className="ph-text-with-image-img"
                                        onError={(e) => {
                                            e.currentTarget.src = `https://placehold.co/400x300/CCCCCC/000000?text=Imagem`;
                                            e.currentTarget.onerror = null;
                                        }}
                                    />
                                </Link>
                            ) : (
                                <img 
                                    src={image.url} 
                                    alt={image.alt} 
                                    className="ph-text-with-image-img"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/400x300/CCCCCC/000000?text=Imagem`;
                                        e.currentTarget.onerror = null;
                                    }}
                                />
                            )}
                            <p className="ph-text-with-image-img-alt">{image.alt}</p> {/* Exibe o texto alt como legenda */}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default TextWithImageSection;
