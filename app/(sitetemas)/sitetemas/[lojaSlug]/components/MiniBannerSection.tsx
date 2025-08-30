'use client';
import React from 'react';
import Link from 'next/link';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { MiniBannerModuleData, SingleMiniBannerData } from '../../../../(painel)/personalizar/types';

interface MiniBannerSectionProps {
  data: MiniBannerModuleData;
}

const MiniBannerSection: React.FC<MiniBannerSectionProps> = ({ data }) => {
  if (!data.isActive || !data.banners || data.banners.length === 0) {
    return null; // Não renderiza a seção se não houver banners ou se estiver inativa
  }

  // Acessamos o array de banners e o título da seção de forma segura
  const banners = data.banners;
  const sectionTitle = data.title;
  
  // Define o layout com base nas configurações do painel
  const containerClass = data.layout === 'carousel' 
    ? "flex overflow-x-auto snap-x snap-mandatory space-x-4" 
    : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8";

  return (
    <section className="ph-mini-banner-section">
      {sectionTitle && <h2 className="ph-mini-banner-section-title">{sectionTitle}</h2>}
      <div className={containerClass}>
        {banners.map(banner => (
          <Link key={banner.id} href={banner.link || '#'} className="ph-mini-banner-card">
            <img 
              src={banner.imageUrl || `https://placehold.co/300x150/CCCCCC/000000?text=Mini+Banner`} 
              alt={banner.title || 'Mini Banner'} 
              className="ph-mini-banner-image"
              onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/300x150/CCCCCC/000000?text=Mini+Banner`;
                  e.currentTarget.onerror = null;
              }}
            />
            <div className="ph-mini-banner-content">
              {banner.title && <h3 className="ph-mini-banner-title">{banner.title}</h3>}
              {banner.subtitle && <p className="ph-mini-banner-subtitle">{banner.subtitle}</p>}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default MiniBannerSection;
