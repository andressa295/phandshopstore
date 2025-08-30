'use client';

import React from 'react';
import Link from 'next/link';
import { ImageGalleryModuleData } from '../../../../(painel)/personalizar/types';

interface ImageGalleryModuleProps {
    data: ImageGalleryModuleData;
}

const ImageGalleryModule: React.FC<ImageGalleryModuleProps> = ({ data }) => {
    if (!data || !data.isActive || !data.images || data.images.length === 0) {
        return null;
    }

    const renderImages = () => {
        switch (data.layout) {
            case 'carousel':
                return (
                    <div className="flex overflow-x-auto snap-x snap-mandatory space-x-4">
                        {data.images.map(image => (
                            <div key={image.id} className="flex-shrink-0 snap-center w-full sm:w-1/2 lg:w-1/3">
                                {image.link ? (
                                    <Link href={image.link} passHref legacyBehavior>
                                        <a title={image.title} className="block">
                                            <img src={image.imageUrl} alt={image.title || 'Imagem da Galeria'} className="w-full h-auto object-cover rounded-lg" />
                                        </a>
                                    </Link>
                                ) : (
                                    <img src={image.imageUrl} alt={image.title || 'Imagem da Galeria'} className="w-full h-auto object-cover rounded-lg" />
                                )}
                            </div>
                        ))}
                    </div>
                );
            case 'grid':
            default:
                return (
                    <div className="grid gap-4 md:gap-6 lg:gap-8" style={{
                        gridTemplateColumns: `repeat(${data.gridColumns || 3}, 1fr)`
                    } as React.CSSProperties}>
                        {data.images.map(image => (
                            <div key={image.id} className="relative group overflow-hidden rounded-lg">
                                {image.link ? (
                                    <Link href={image.link} passHref legacyBehavior>
                                        <a title={image.title} className="block">
                                            <img src={image.imageUrl} alt={image.title || 'Imagem da Galeria'} className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105" />
                                            {image.title && (
                                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                    <p className="text-white text-lg font-bold">{image.title}</p>
                                                </div>
                                            )}
                                        </a>
                                    </Link>
                                ) : (
                                    <>
                                        <img src={image.imageUrl} alt={image.title || 'Imagem da Galeria'} className="w-full h-full object-cover transition-transform duration-300 transform group-hover:scale-105" />
                                        {image.title && (
                                            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                                <p className="text-white text-lg font-bold">{image.title}</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                );
        }
    };

    return (
        <section className="container mx-auto py-12 px-4 text-center">
            {data.title && <h2 className="text-3xl font-bold text-gray-800 mb-2">{data.title}</h2>}
            {data.subtitle && <p className="text-lg text-gray-600 mb-8">{data.subtitle}</p>}
            {renderImages()}
        </section>
    );
};

export default ImageGalleryModule;