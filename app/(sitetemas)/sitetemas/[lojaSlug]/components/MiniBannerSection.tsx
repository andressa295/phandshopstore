'use client';

import React from 'react';
import Link from 'next/link';
import { MiniBannerModuleData, SingleMiniBannerData } from '../../../../(painel)/personalizar/types';

interface MiniBannerSectionProps {
    data: MiniBannerModuleData;
}

const MiniBannerSection: React.FC<MiniBannerSectionProps> = ({ data }) => {
    
    // Verificação robusta para garantir que 'data' e 'banners' existem
    if (!data || !data.isActive || !data.banners || data.banners.length === 0) {
        return null;
    }

    const { banners, layout, title, subtitle } = data;

    const containerClasses = layout === 'carousel' 
        ? "flex overflow-x-auto snap-x snap-mandatory space-x-4" 
        : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8";

    return (
        <section className="ph-mini-banner-section">
            {title && <h2 className="ph-mini-banner-section-title">{title}</h2>}
            {subtitle && <p className="ph-mini-banner-section-subtitle">{subtitle}</p>}
            
            <div className={containerClasses}>
                {banners.map(banner => (
                    <div key={banner.id} className="ph-mini-banner-card">
                        {banner.link ? (
                            <Link href={banner.link} passHref>
                                <img 
                                    src={banner.imageUrl || `https://placehold.co/300x150/CCCCCC/000000?text=Mini+Banner`} 
                                    alt={banner.title || 'Mini Banner'} 
                                    className="ph-mini-banner-image"
                                />
                            </Link>
                        ) : (
                            <img 
                                src={banner.imageUrl || `https://placehold.co/300x150/CCCCCC/000000?text=Mini+Banner`} 
                                alt={banner.title || 'Mini Banner'} 
                                className="ph-mini-banner-image"
                            />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default MiniBannerSection;

