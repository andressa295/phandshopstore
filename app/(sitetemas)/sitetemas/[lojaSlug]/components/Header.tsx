'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { User, ShoppingBag, Menu, Search, X } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { HeaderSettingsConfig } from '../../../../(painel)/personalizar/types';

// O componente agora não precisa mais de props diretas.
const Header: React.FC = () => {
    const { config } = useTheme();

    const headerSettings: HeaderSettingsConfig = config.headerSettings || {};
    const lojaNome = config.headerTitle || 'Minha Loja';
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [cartItemCount, setCartItemCount] = useState<number>(0);
    const [isMobileSearchActive, setIsMobileSearchActive] = useState<boolean>(false);

    const handleMenuItemClick = () => {
        setIsMobileMenuOpen(false);
        setIsMobileSearchActive(false);
    };

    const toggleMobileSearch = () => {
        setIsMobileSearchActive(!isMobileSearchActive);
        if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
        if (isMobileSearchActive) setIsMobileSearchActive(false);
    };

    return (
        <header className="ph-header-container" style={{ backgroundColor: headerSettings.headerBackgroundColor, color: headerSettings.headerTextColor }}>
            {/* Barra Superior */}
            {headerSettings.showAnnouncementBar && (
                <div className="ph-topmost-bar" style={{ backgroundColor: headerSettings.announcementBackgroundColor, color: headerSettings.announcementTextColor }}>
                    <div className="ph-topmost-content">
                        <span className="ph-topmost-message">
                            {headerSettings.announcementLink ? (
                                <a href={headerSettings.announcementLink || '#'} className="ph-topmost-message-link">
                                    {headerSettings.announcementText}
                                </a>
                            ) : (
                                <span className="ph-topmost-message-text">{headerSettings.announcementText}</span>
                            )}
                        </span>
                        <div className="ph-topmost-links ph-desktop-only">
                            {headerSettings.trackOrderLinkActive && ( // CORRIGIDO: Usa a prop do tema
                                <a href="/rastrear-pedido" className="ph-topmost-link">
                                    RASTRAR PEDIDO
                                </a>
                            )}
                            {headerSettings.supportLinkActive && ( // CORRIGIDO: Usa a prop do tema
                                <a href="/ajuda" className="ph-topmost-link">
                                    AJUDA E SUPORTE
                                </a>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Cabeçalho Desktop */}
            <div className="ph-main-header-bar ph-desktop-only">
                <a href="/" className="ph-logo-link">
                    {headerSettings.logoUrl ? (
                        <img
                            src={headerSettings.logoUrl}
                            alt={`${lojaNome} Logo`}
                            className="ph-logo-img"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                console.error(`Falha ao carregar logo: ${headerSettings.logoUrl}`);
                            }}
                        />
                    ) : (
                        <div className="ph-logo-placeholder">
                            <h1>{lojaNome}</h1>
                        </div>
                    )}
                </a>

                <div className="ph-search-bar">
                    <input type="text" placeholder="O que deseja procurar?" className="ph-search-input" />
                    <button className="ph-search-button" aria-label="Buscar">
                        <Search size={20} />
                    </button>
                </div>

                <div className="ph-user-actions">
                    <a href="/minha-conta" className="ph-user-action-link">
                        <User size={20} className="ph-user-icon" />
                        <span className="ph-user-action-text-wrapper">
                            <span className="ph-user-action-label">Minha Conta</span>
                            <span className="ph-user-action-detail">Entrar / Cadastrar</span>
                        </span>
                    </a>
                    <a href="/sacola" className="ph-user-action-link">
                        <ShoppingBag size={20} className="ph-user-icon" />
                        <span className="ph-user-action-text-wrapper">
                            <span className="ph-user-action-label">Carrinho</span>
                            <span className="ph-user-action-detail">
                                {cartItemCount} item{cartItemCount !== 1 ? 's' : ''}
                            </span>
                        </span>
                    </a>
                </div>
            </div>

            {/* Cabeçalho Mobile */}
            <div className="ph-main-header-bar ph-mobile-only">
                <button
                    className="ph-mobile-menu-toggle"
                    onClick={toggleMobileMenu}
                    aria-label={isMobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
                >
                    <Menu size={28} />
                </button>

                <a href="/" className="ph-logo-link">
                    {headerSettings.logoUrl ? (
                        <img
                            src={headerSettings.logoUrl}
                            alt={`${lojaNome} Logo`}
                            className="ph-logo-img"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                console.error(`Falha ao carregar logo: ${headerSettings.logoUrl}`);
                            }}
                        />
                    ) : (
                        <div className="ph-logo-placeholder">
                            <h1>{lojaNome}</h1>
                        </div>
                    )}
                </a>

                <div className="ph-mobile-actions-right">
                    <button
                        className="ph-mobile-search-toggle"
                        onClick={toggleMobileSearch}
                        aria-label={isMobileSearchActive ? 'Fechar busca' : 'Abrir busca'}
                    >
                        <Search size={24} />
                    </button>
                    <a href="/sacola" className="ph-mobile-cart-link" aria-label="Sacola de compras">
                        <ShoppingBag size={24} />
                        {cartItemCount > 0 && <span className="ph-mobile-cart-count">{cartItemCount}</span>}
                    </a>
                </div>
            </div>

            {isMobileSearchActive && (
                <div className="ph-mobile-search-expanded ph-mobile-only">
                    <input type="text" placeholder="O que deseja procurar?" className="ph-search-input" />
                    <button className="ph-search-button" aria-label="Buscar">
                        <Search size={20} />
                    </button>
                    <button
                        className="ph-mobile-search-close-button-inline"
                        onClick={toggleMobileSearch}
                        aria-label="Fechar busca"
                    >
                        <X size={20} />
                    </button>
                </div>
            )}

            <hr className="ph-header-divider" />

            <nav className="ph-main-nav ph-desktop-only">
                <ul>
                    <li><a href="/" onClick={handleMenuItemClick}>Início</a></li>
                    <li><a href="/produtos" onClick={handleMenuItemClick}>Produtos</a></li>
                    <li><a href="/contato" onClick={handleMenuItemClick}>Contato</a></li>
                    <li><a href="/quem-somos" onClick={handleMenuItemClick}>Quem Somos</a></li>
                    <li><a href="/politicas" onClick={handleMenuItemClick}>Políticas</a></li>
                    <li><a href="/trocas-devolucoes" onClick={handleMenuItemClick}>Trocas e Devoluções</a></li>
                </ul>
            </nav>

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
                        <li><a href="/" onClick={handleMenuItemClick}>Início</a></li>
                        <li><a href="/produtos" onClick={handleMenuItemClick}>Produtos</a></li>
                        <li><a href="/contato" onClick={handleMenuItemClick}>Contato</a></li>
                        <li><a href="/quem-somos" onClick={handleMenuItemClick}>Quem Somos</a></li>
                        <li><a href="/politicas" onClick={handleMenuItemClick}>Políticas</a></li>
                        <li><a href="/trocas-devolucoes" onClick={handleMenuItemClick}>Trocas e Devoluções</a></li>
                        <li><a href="/minha-conta" onClick={handleMenuItemClick}>Minha Conta</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;