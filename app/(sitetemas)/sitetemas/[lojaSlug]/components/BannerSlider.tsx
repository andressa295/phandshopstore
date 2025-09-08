'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerItem {
    id: string;
    desktopImageUrl: string;
    mobileImageUrl?: string;
    title?: string;
    subtitle?: string;
    buttonText?: string;
    buttonLink?: string;
    overlayColor?: string;
    overlayOpacity?: number;
    isActive?: boolean;
}

interface BannerSliderProps {
    isActive?: boolean;
    banners: BannerItem[];
    autoplay?: boolean;
    interval?: number;
}

const BannerSlider: React.FC<BannerSliderProps> = ({ isActive, banners, autoplay, interval }) => {
    if (!isActive || !banners || banners.length === 0) {
        return null;
    }

    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        if (banners.length > 1 && autoplay) {
            const autoPlayInterval = setInterval(() => {
                setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
            }, (interval || 5) * 1000);

            return () => clearInterval(autoPlayInterval);
        }
    }, [banners.length, interval, autoplay]);

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % banners.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + banners.length) % banners.length);
    };

    const renderBannerContent = (banner: BannerItem) => (
        <>
            <img src={banner.desktopImageUrl} alt={banner.title || 'Banner'} className="ph-banner-image" />
            <div className="ph-banner-content">
                {banner.title && <h2 className="ph-banner-title">{banner.title}</h2>}
                {banner.subtitle && <p className="ph-banner-subtitle">{banner.subtitle}</p>}
                {banner.buttonLink && banner.buttonText && (
                    <span className="ph-button">
                        {banner.buttonText}
                    </span>
                )}
            </div>
        </>
    );

    return (
        <div className="ph-banner-slider-container">
            {banners.length > 1 && (
                <>
                    <button className="ph-slider-arrow ph-slider-arrow-left" onClick={goToPrevSlide} aria-label="Slide Anterior">
                        <ChevronLeft size={24} />
                    </button>
                    <button className="ph-slider-arrow ph-slider-arrow-right" onClick={goToNextSlide} aria-label="Próximo Slide">
                        <ChevronRight size={24} />
                    </button>
                </>
            )}

            {banners.map((banner, index) => (
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

            {banners.length > 1 && (
                <div className="ph-slider-dots">
                    {banners.map((banner, index) => (
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