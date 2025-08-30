// app/(sitetemas)/sitetemas/[lojaSlug]/components/TextWithImageSection.tsx
'use client';

import React from 'react';
import Link from 'next/link';


interface ImageItem {
    id: string; // CORREÇÃO: Adicionado o ID à interface
    url: string;
    alt: string;
    link?: string; // Link opcional para a imagem
}

interface TextWithImageSectionProps {
    title?: string;
    subtitle?: string; // CORREÇÃO: Subtitle será renderizado
    contentHtml: string; // Conteúdo principal em HTML
    images?: ImageItem[]; // CORREÇÃO: Array de imagens é opcional
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
    // CORREÇÃO: Verifica se há conteúdo ou imagens antes de renderizar
    if (!contentHtml && (!images || images.length === 0) && !title && !subtitle && !callToActionText) {
        return null; 
    }

    const sectionClasses = `ph-text-with-image-section ph-image-position-${imagePosition}`;

    return (
        <section className={sectionClasses}>
            <div className="ph-text-with-image-content">
                {title && <h2 className="ph-text-with-image-title">{title}</h2>}
                {subtitle && <p className="ph-text-with-image-subtitle">{subtitle}</p>} {/* CORREÇÃO: Renderiza o subtitle */}
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
                                        alt={image.alt || ''} // CORREÇÃO: Fallback para alt
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
                                    alt={image.alt || ''} // CORREÇÃO: Fallback para alt
                                    className="ph-text-with-image-img"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/400x300/CCCCCC/000000?text=Imagem`;
                                        e.currentTarget.onerror = null;
                                    }}
                                />
                            )}
                            {image.alt && <p className="ph-text-with-image-img-alt">{image.alt}</p>} {/* CORREÇÃO: Exibe o alt apenas se existir */}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
};

export default TextWithImageSection;