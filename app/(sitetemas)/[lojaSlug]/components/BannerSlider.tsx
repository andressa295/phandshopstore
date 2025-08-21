'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { ChevronLeft, ChevronRight } from 'lucide-react';


interface BannerData {
    id: string;
    imagem_url: string;
    link_url: string | null;
    titulo: string | null;
    subtitulo: string | null;
    ordem: number;
}

interface BannerSliderProps {
    banners: BannerData[];
}

const BannerSlider: React.FC<BannerSliderProps> = ({ banners }) => {
    const [currentSlide, setCurrentSlide] = useState(0);

    // Ordena os banners pela propriedade 'ordem'
    const sortedBanners = [...banners].sort((a, b) => a.ordem - b.ordem);

    useEffect(() => {
        if (sortedBanners.length > 1) {
            const interval = setInterval(() => {
                setCurrentSlide((prevSlide) => (prevSlide + 1) % sortedBanners.length);
            }, 5000); // Muda de slide a cada 5 segundos

            return () => clearInterval(interval); // Limpa o intervalo ao desmontar o componente
        }
    }, [sortedBanners.length]);

    const goToNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % sortedBanners.length);
    };

    const goToPrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + sortedBanners.length) % sortedBanners.length);
    };

    if (sortedBanners.length === 0) {
        return null; // Não renderiza nada se não houver banners
    }

    // currentBanner não é mais estritamente necessário aqui, pois o map renderiza todos e o CSS controla a visibilidade
    // const currentBanner = sortedBanners[currentSlide]; 

    return (
        <div className="ph-banner-slider-container">
            {sortedBanners.length > 1 && (
                <>
                    <button className="ph-slider-arrow ph-slider-arrow-left" onClick={goToPrevSlide} aria-label="Slide Anterior">
                        <FaChevronLeft />
                        {/* Se usar Lucide: <ChevronLeft size={24} /> */}
                    </button>
                    <button className="ph-slider-arrow ph-slider-arrow-right" onClick={goToNextSlide} aria-label="Próximo Slide">
                        <FaChevronRight />
                        {/* Se usar Lucide: <ChevronRight size={24} /> */}
                    </button>
                </>
            )}

            {/* Renderiza todos os slides, mas o CSS controla qual está 'active' */}
            {sortedBanners.map((banner, index) => (
                <div key={banner.id} className={`ph-banner-slide ${index === currentSlide ? 'ph-active' : ''}`}>
                    {banner.link_url ? (
                        <Link href={banner.link_url} className="ph-banner-link">
                            <img src={banner.imagem_url} alt={banner.titulo || 'Banner'} className="ph-banner-image" />
                            <div className="ph-banner-content">
                                {banner.titulo && <h2 className="ph-banner-title">{banner.titulo}</h2>}
                                {banner.subtitulo && <p className="ph-banner-subtitle">{banner.subtitulo}</p>}
                            </div>
                        </Link>
                    ) : (
                        <>
                            <img src={banner.imagem_url} alt={banner.titulo || 'Banner'} className="ph-banner-image" />
                            <div className="ph-banner-content">
                                {banner.titulo && <h2 className="ph-banner-title">{banner.titulo}</h2>}
                                {banner.subtitulo && <p className="ph-banner-subtitle">{banner.subtitulo}</p>}
                            </div>
                        </>
                    )}
                </div>
            ))}

            {sortedBanners.length > 1 && (
                <div className="ph-slider-dots">
                    {sortedBanners.map((_, index) => (
                        <span
                            key={index}
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
