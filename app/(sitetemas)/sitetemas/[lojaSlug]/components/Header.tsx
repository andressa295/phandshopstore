'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, Menu, Search, X } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { HeaderSettingsConfig } from '../../../../(painel)/personalizar/types';

const Header: React.FC = () => {
    const { config } = useTheme();

    const headerSettings: HeaderSettingsConfig = config.headerSettings || {};
    const lojaNome = config.headerTitle || 'Sua Loja Padrão';
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileSearchActive, setIsMobileSearchActive] = useState<boolean>(false);

    const toggleMobileSearch = () => {
        setIsMobileSearchActive(!isMobileSearchActive);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileSearchActive) setIsMobileSearchActive(false);
    };

    return (
        <header className="ph-header-container">
            {/* Barra de Anúncio (Frete Grátis) */}
            {headerSettings.showAnnouncementBar && (
                <div className="ph-announcement-bar">
                    <div className="ph-loja-container">
                        <span className="ph-announcement-text-wrapper">
                            <span className="ph-announcement-text">{headerSettings.announcementText}</span>
                        </span>
                    </div>
                </div>
            )}

            {/* Cabeçalho Desktop (Oculto no Mobile) */}
            <div className="ph-main-header-bar ph-desktop-only">
                <div className="ph-loja-container">
                    <div className="ph-header-top-row">
                        {/* Logo */}
                        <Link href="/" className="ph-logo-link">
                            {headerSettings.logoUrl ? (
                                <img
                                    src={headerSettings.logoUrl}
                                    alt={`${lojaNome} Logo`}
                                    className="ph-logo-img"
                                />
                            ) : (
                                <h1 className="ph-logo-placeholder">{lojaNome}</h1>
                            )}
                        </Link>
        
                        {/* Busca */}
                        <div className="ph-search-bar">
                            <input type="text" placeholder="O que deseja procurar?" className="ph-search-input" />
                            <button className="ph-search-button" aria-label="Buscar">
                                <Search size={20} />
                            </button>
                        </div>
        
                        {/* Ações do Usuário */}
                        <div className="ph-user-actions">
                            <Link href="/minha-conta" className="ph-user-action-link">
                                <User size={20} />
                                <span className="ph-user-action-text">Minha Conta</span>
                            </Link>
                            <Link href="/carrinho" className="ph-user-action-link">
                                <ShoppingBag size={20} />
                                <span className="ph-user-action-text">Carrinho</span>
                            </Link>
                        </div>
                    </div>
                    
                    {/* Linha Divisória */}
                    <hr className="ph-header-divider" />
        
                    {/* Navegação Principal */}
                    <nav className="ph-main-nav">
                        <ul>
                            <li><Link href="/">Início</Link></li>
                            <li><Link href="/produtos">Produtos</Link></li>
                            <li><Link href="/contato">Contato</Link></li>
                            <li><Link href="/quem-somos">Quem Somos</Link></li>
                            <li><Link href="/politicas">Políticas</Link></li>
                            <li><Link href="/trocas-devolucoes">Trocas e Devoluções</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>

            {/* Header Mobile (Oculto no Desktop) */}
            <div className="ph-main-header-bar ph-loja-container ph-mobile-only">
                <button
                    className="ph-mobile-menu-toggle"
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                    <Menu size={28} />
                </button>
        
                <Link href="/" className="ph-logo-link">
                    <h1>{lojaNome}</h1>
                </Link>
        
                <div className="ph-mobile-actions-right">
                    <button
                        className="ph-mobile-search-toggle"
                        onClick={toggleMobileSearch}
                        aria-label={isMobileSearchActive ? 'Fechar busca' : 'Abrir busca'}
                    >
                        <Search size={24} />
                    </button>
                    <Link href="/carrinho" className="ph-mobile-cart-link" aria-label="Sacola de compras">
                        <ShoppingBag size={24} />
                    </Link>
                </div>
            </div>

            {/* Menu Mobile */}
            <div className={`ph-mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
                <button
                    className="ph-mobile-menu-close-button"
                    onClick={toggleMobileMenu}
                    aria-label="Fechar menu"
                >
                    <X size={40} />
                </button>
                <nav className="ph-mobile-nav">
                    <ul>
                        <li><Link href="/" onClick={toggleMobileMenu}>Início</Link></li>
                        <li><Link href="/produtos" onClick={toggleMobileMenu}>Produtos</Link></li>
                        <li><Link href="/contato" onClick={toggleMobileMenu}>Contato</Link></li>
                        <li><Link href="/quem-somos" onClick={toggleMobileMenu}>Quem Somos</Link></li>
                        <li><Link href="/politicas" onClick={toggleMobileMenu}>Políticas</Link></li>
                        <li><Link href="/trocas-devolucoes" onClick={toggleMobileMenu}>Trocas e Devoluções</Link></li>
                        <li><Link href="/minha-conta" onClick={toggleMobileMenu}>Minha Conta</Link></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;