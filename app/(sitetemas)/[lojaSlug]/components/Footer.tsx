'use client';

import React from 'react';
import Link from 'next/link';

interface FooterProps {
    lojaNome: string;
    footerInstitutionalLinks?: { label: string; url: string; }[];
    footerSocialLinks?: { platform: string; url: string; }[];
    footerContactEmail?: string;
    footerContactPhone?: string;
    footerAddress?: string;
}

const Footer: React.FC<FooterProps> = ({ lojaNome }) => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className="ph-footer">
            <div className="ph-footer-content">
                <div className="ph-footer-section">
                    <h3>Sobre {lojaNome}</h3>
                    <p>Sua loja online de confiança para os melhores produtos.</p>
                </div>
                <div className="ph-footer-section">
                    <h3>Links Úteis</h3>
                    <ul>
                        <li><Link href="/politica-privacidade" className="ph-footer-link">Política de Privacidade</Link></li>
                        <li><Link href="/termos-de-uso" className="ph-footer-link">Termos de Uso</Link></li>
                        <li><Link href="/trocas-e-devolucoes" className="ph-footer-link">Trocas e Devoluções</Link></li>
                    </ul>
                </div>
                <div className="ph-footer-section">
                    <h3>Contato</h3>
                    <p>Email: contato@{lojaNome.toLowerCase().replace(/\s/g, '')}.com.br</p>
                    <p>Telefone: (XX) XXXX-XXXX</p>
                </div>
                {/* Você pode adicionar mais seções aqui, como redes sociais, métodos de pagamento, etc. */}
            </div>
            <div className="ph-copyright">
                &copy; {currentYear} {lojaNome}. Todos os direitos reservados.
            </div>
        </footer>
    );
};

export default Footer;
