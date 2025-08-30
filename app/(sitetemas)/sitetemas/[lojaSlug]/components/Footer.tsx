'use client';

import React from 'react';
import Link from 'next/link';
// Você pode importar ícones do Lucide React para as redes sociais aqui
import { Facebook, Instagram, Twitter, Youtube, X } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { FooterConfig, HeaderSettingsConfig } from '../../../../(painel)/personalizar/types';

// Mapeamento de ícones (exemplo)
const socialIcons: Record<string, React.ElementType> = {
    facebook: Facebook,
    instagram: Instagram,
    x: X,
    youtube: Youtube,
};

const Footer: React.FC = () => {
    const { config } = useTheme();
    const footerConfig: FooterConfig = config.footer || {};
    const currentYear = new Date().getFullYear();

    return (
        <footer className="ph-footer" style={{ backgroundColor: footerConfig.footerBackgroundColor, color: footerConfig.footerTextColor }}>
            <div className="ph-footer-content">
                {/* Seção de Links Rápidos */}
                {footerConfig.showQuickLinks && (
                    <div className="ph-footer-section">
                        <h3>{footerConfig.quickLinksTitle || 'Links Úteis'}</h3>
                        <ul>
                            {(footerConfig.quickLinks || []).map(link => (
                                <li key={link.id}>
                                    <Link href={link.url || '#'} className="ph-footer-link">{link.text}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Seção de Redes Sociais */}
                {footerConfig.showSocialMediaIcons && (
                    <div className="ph-footer-section">
                        <h3>{footerConfig.socialMediaTitle || 'Siga-nos'}</h3>
                        <div className="ph-social-media-links">
                            {(footerConfig.socialMediaLinks || []).map(link => {
                                const IconComponent = socialIcons[link.platform];
                                return (
                                    <Link key={link.id} href={link.url || '#'} className="ph-social-link">
                                        {IconComponent ? <IconComponent size={24} /> : link.platform}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                )}
                
                {/* Seção de Contato */}
                {footerConfig.showContactInfo && (
                    <div className="ph-footer-section">
                        <h3>Contato</h3>
                        {footerConfig.contactAddress && <p>Endereço: {footerConfig.contactAddress}</p>}
                        {footerConfig.contactPhone && <p>Telefone: {footerConfig.contactPhone}</p>}
                        {footerConfig.contactEmail && <p>Email: {footerConfig.contactEmail}</p>}
                    </div>
                )}
            </div>

            <div className="ph-footer-bottom-bar">
                {/* Seção de Métodos de Pagamento */}
                {footerConfig.showPaymentMethods && footerConfig.paymentMethodsImages && footerConfig.paymentMethodsImages.length > 0 && (
                    <div className="ph-footer-section">
                        <h3>Métodos de Pagamento</h3>
                        <div className="ph-payment-methods">
                            {footerConfig.paymentMethodsImages.map(image => (
                                <img key={image.id} src={image.imageUrl} alt={image.id} className="ph-payment-image" />
                            ))}
                        </div>
                    </div>
                )}
                 {/* Seção de Métodos de Envio */}
                {footerConfig.showShippingMethods && footerConfig.shippingMethodsImages && footerConfig.shippingMethodsImages.length > 0 && (
                    <div className="ph-footer-section">
                        <h3>Métodos de Envio</h3>
                        <div className="ph-shipping-methods">
                            {footerConfig.shippingMethodsImages.map(image => (
                                <img key={image.id} src={image.imageUrl} alt={image.id} className="ph-shipping-image" />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Copyright */}
            {footerConfig.showCopyright && (
                <div className="ph-copyright">
                    <p>&copy; {currentYear} {footerConfig.copyrightText || 'Sua Loja. Todos os direitos reservados.'}</p>
                    {footerConfig.showCnpj && <p className="ph-cnpj">{footerConfig.cnpjText}</p>}
                </div>
            )}
        </footer>
    );
};

export default Footer;