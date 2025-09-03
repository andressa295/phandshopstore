'use client';

import React from 'react';
// Importa ícones necessários do Lucide React, incluindo 'User'
import { Star, Quote, User } from 'lucide-react'; 

interface TestimonialData {
    id: string; // CORREÇÃO: Adicionado o ID à interface
    nomeCliente: string;
    depoimento: string;
    avaliacaoEstrelas?: number; // De 1 a 5
    imagemClienteUrl?: string | null;
}

interface TestimonialsSectionProps {
    testimonials: TestimonialData[];
    sectionTitle?: string;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ 
    testimonials, 
    sectionTitle = "O que nossos clientes dizem" 
}) => {
    if (!testimonials || testimonials.length === 0) {
        return null;
    }

    return (
        <section className="ph-testimonials-section">
            <h2 className="ph-testimonials-section-title">{sectionTitle}</h2>
            <div className="ph-testimonials-grid">
                {testimonials.map(testimonial => (
                    <div key={testimonial.id} className="ph-testimonial-card">
                        {testimonial.imagemClienteUrl ? (
                            <img 
                                src={testimonial.imagemClienteUrl} 
                                alt={testimonial.nomeCliente} 
                                className="ph-testimonial-image"
                                onError={(e) => {
                                    e.currentTarget.src = `https://placehold.co/80x80/CCCCCC/000000?text=Cliente`;
                                    e.currentTarget.onerror = null;
                                }}
                            />
                        ) : (
                            <div className="ph-testimonial-avatar-placeholder">
                                <User size={40} />
                            </div>
                        )}
                        <Quote size={24} className="ph-testimonial-quote-icon" />
                        <p className="ph-testimonial-text">{testimonial.depoimento}</p>
                        {testimonial.avaliacaoEstrelas && (
                            <div className="ph-testimonial-rating">
                                {[...Array(5)].map((_, i) => (
                                    <Star 
                                        key={i} 
                                        size={18} 
                                        fill={i < testimonial.avaliacaoEstrelas! ? "currentColor" : "none"} 
                                        className="ph-testimonial-star-icon" 
                                    />
                                ))}
                            </div>
                        )}
                        <p className="ph-testimonial-author">- {testimonial.nomeCliente}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TestimonialsSection;