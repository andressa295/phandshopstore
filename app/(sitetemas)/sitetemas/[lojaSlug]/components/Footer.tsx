'use client';

import React from 'react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import Link from 'next/link';

const Footer: React.FC = () => {
    const { config } = useTheme();
    const footerConfig = config.footer || {};
    
    return (
        <footer className="ph-footer">
            <div className="ph-loja-container">
                {footerConfig.showNewsletterSignup && (
                    <div className="ph-newsletter-signup">
                        <h3 className="ph-newsletter-title">{footerConfig.newsletterTitle}</h3>
                        <p className="ph-newsletter-subtitle">{footerConfig.newsletterSubtitle}</p>
                    </div>
                )}
                
                {footerConfig.showSocialMediaIcons && (
                    <div className="ph-social-media">
                        <h3 className="ph-social-title">{footerConfig.socialMediaTitle}</h3>
                        <div className="ph-social-icons">
                            {/* Adicione lógica de renderização dos ícones sociais aqui */}
                        </div>
                    </div>
                )}
                
                {footerConfig.showCopyright && (
                    <div className="ph-copyright-info">
                        <p>{footerConfig.copyrightText}</p>
                    </div>
                )}
            </div>
        </footer>
    );
};

export default Footer;