'use client';

import React from 'react';
import Link from 'next/link';

interface MiniBannerData {
    id: string;
    imagem_url: string;
    link_url: string;
    titulo?: string; // Título opcional para o banner
    subtitulo?: string; // Subtítulo opcional
}

interface MiniBannerSectionProps {
    banners: MiniBannerData[];
    sectionTitle?: string; // Título opcional para a seção
}

const MiniBannerSection: React.FC<MiniBannerSectionProps> = ({ banners, sectionTitle }) => {
    if (!banners || banners.length === 0) {
        return null; // Não renderiza a seção se não houver banners
    }

    return (
        <section className="ph-mini-banner-section">
            {sectionTitle && <h2 className="ph-mini-banner-section-title">{sectionTitle}</h2>}
            <div className="ph-mini-banner-grid">
                {banners.map(banner => (
                    <Link key={banner.id} href={banner.link_url} className="ph-mini-banner-card">
                        <img 
                            src={banner.imagem_url} 
                            alt={banner.titulo || 'Mini Banner'} 
                            className="ph-mini-banner-image"
                            onError={(e) => {
                                e.currentTarget.src = `https://placehold.co/300x150/CCCCCC/000000?text=Mini+Banner`;
                                e.currentTarget.onerror = null;
                            }}
                        />
                        <div className="ph-mini-banner-content">
                            {banner.titulo && <h3 className="ph-mini-banner-title">{banner.titulo}</h3>}
                            {banner.subtitulo && <p className="ph-mini-banner-subtitle">{banner.subtitulo}</p>}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default MiniBannerSection;
