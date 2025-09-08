'use client';

import React from 'react';
import Link from 'next/link';
import { TextImageModuleData } from '../../../../(painel)/personalizar/types';

interface TextWithImageSectionProps {
    data: TextImageModuleData;
}

const TextWithImageSection: React.FC<TextWithImageSectionProps> = ({ data }) => {
    
    // Verifica se o módulo está ativo e se há conteúdo para ser exibido
    if (!data || !data.isActive) {
        return null; 
    }

    // Define a classe da seção com base na posição da imagem
    const sectionClasses = `ph-text-image-section ${data.imagePosition === 'right' ? 'ph-image-right' : ''}`;

    // Constrói os elementos de texto e imagem para flexibilidade de layout
    const textElement = (
        <div className="ph-text-image-text-wrapper">
            {data.title && <h2 className="ph-text-image-title">{data.title}</h2>}
            {data.text && <p className="ph-text-image-text">{data.text}</p>}
            {data.buttonText && data.buttonLink && (
                <Link href={data.buttonLink} passHref>
                    <button className="ph-text-image-cta-button">
                        {data.buttonText}
                    </button>
                </Link>
            )}
        </div>
    );

    const imageElement = (
        <div className="ph-text-image-image-wrapper">
            <img 
                src={data.imageUrl || `https://placehold.co/600x400/CCCCCC/000000?text=Texto+Imagem`} 
                alt={data.title || 'Imagem do Módulo'} 
                className="ph-text-image-image"
            />
        </div>
    );

    return (
        <section className={sectionClasses}>
            <div className="ph-loja-container ph-text-image-content">
                {/* Renderiza o texto e a imagem na ordem correta */}
                {data.imagePosition === 'left' ? (
                    <>
                        {imageElement}
                        {textElement}
                    </>
                ) : (
                    <>
                        {textElement}
                        {imageElement}
                    </>
                )}
            </div>
        </section>
    );
};

export default TextWithImageSection;
