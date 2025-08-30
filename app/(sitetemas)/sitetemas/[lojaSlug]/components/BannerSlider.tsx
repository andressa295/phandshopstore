// app/(sitetemas)/sitetemas/[lojaSlug]/components/BannerSlider.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // CORRIGIDO: Usando lucide-react
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { BannerModuleData } from '../../../../(painel)/personalizar/types';

const BannerSlider: React.FC = () => {
  const { config } = useTheme();
  const bannerModule = config.homepage?.modules.find(mod => mod.type === 'banner')?.data as BannerModuleData | undefined;

  if (!bannerModule || !bannerModule.isActive || !bannerModule.banners || bannerModule.banners.length === 0) {
    return null;
  }

  // Ordena os banners usando o ID como fallback
  const sortedBanners = [...bannerModule.banners].sort((a, b) => (a.id > b.id ? 1 : -1));

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (sortedBanners.length > 1 && bannerModule.autoplay) { // CORRIGIDO: Verifica se autoplay está ativo
      const interval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % sortedBanners.length);
      }, (bannerModule.interval || 5) * 1000); // CORRIGIDO: Usa o intervalo do tema, se existir, ou 5 segundos como padrão

      return () => clearInterval(interval);
    }
  }, [sortedBanners.length, bannerModule.interval, bannerModule.autoplay]);

  const goToNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % sortedBanners.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + sortedBanners.length) % sortedBanners.length);
  };

  // Renderização centralizada do conteúdo do banner para evitar duplicação
  const renderBannerContent = (banner: any) => (
    <>
      <img src={banner.desktopImageUrl} alt={banner.title || 'Banner'} className="ph-banner-image" />
      <div className="ph-banner-content" style={{ backgroundColor: banner.overlayColor, opacity: banner.overlayOpacity }}>
          {banner.title && <h2 className="ph-banner-title" style={{ color: banner.textColor, fontSize: banner.titleFontSize }}>{banner.title}</h2>}
          {banner.subtitle && <p className="ph-banner-subtitle" style={{ color: banner.textColor, fontSize: banner.subtitleFontSize }}>{banner.subtitle}</p>}
      </div>
    </>
  );

  return (
    <div className="ph-banner-slider-container">
      {sortedBanners.length > 1 && (
        <>
          <button className="ph-slider-arrow ph-slider-arrow-left" onClick={goToPrevSlide} aria-label="Slide Anterior">
            <ChevronLeft size={24} />
          </button>
          <button className="ph-slider-arrow ph-slider-arrow-right" onClick={goToNextSlide} aria-label="Próximo Slide">
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {sortedBanners.map((banner, index) => (
        <div key={banner.id} className={`ph-banner-slide ${index === currentSlide ? 'ph-active' : ''}`}>
          {banner.buttonLink ? (
            <Link href={banner.buttonLink} className="ph-banner-link">
              {renderBannerContent(banner)}
            </Link>
          ) : (
            renderBannerContent(banner)
          )}
        </div>
      ))}

      {sortedBanners.length > 1 && (
        <div className="ph-slider-dots">
          {sortedBanners.map((banner, index) => ( // CORRIGIDO: Usando 'banner' para a key
            <span
              key={banner.id}
              className={`ph-dot ${index === currentSlide ? 'ph-active' : ''}`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Ir para o slide ${index + 1}`}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default BannerSlider;