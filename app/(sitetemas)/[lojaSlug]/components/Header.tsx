// app/(sitetemas)/[lojaSlug]/components/Header.tsx
'use client';

import React, { useState } from 'react';
import { User, ShoppingBag, Menu, Search, X } from 'lucide-react';

// REMOVIDO: import '../styles/header.css'; // O estilo virá do tema ativo

interface HeaderProps {
    lojaNome: string;
    topInfoBarText: string | null;
    topInfoBarLink: string | null;
    topInfoBarActive: boolean;
    trackOrderLinkActive: boolean;
    supportLinkActive: boolean;
    lojaLogoUrl?: string | null;
}

const Header: React.FC<HeaderProps> = ({
    lojaNome,
    topInfoBarText,
    topInfoBarLink,
    topInfoBarActive,
    trackOrderLinkActive,
    supportLinkActive,
    lojaLogoUrl,
}) => {
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
        <header className="ph-header-container">
            {/* Barra Superior */}
            {topInfoBarActive && (
                <div className="ph-topmost-bar">
                    <div className="ph-topmost-content">
                        <span className="ph-topmost-message">
                            {topInfoBarLink ? (
                                <a href={topInfoBarLink || '#'} className="ph-topmost-message-link">
                                    {topInfoBarText}
                                </a>
                            ) : (
                                <span className="ph-topmost-message-text">{topInfoBarText}</span>
                            )}
                        </span>
                        <div className="ph-topmost-links ph-desktop-only">
                            {trackOrderLinkActive && (
                                <a href="/rastrear-pedido" className="ph-topmost-link">
                                    RASTRAR PEDIDO
                                </a>
                            )}
                            {supportLinkActive && (
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
                <a href={`/${lojaNome}`} className="ph-logo-link">
                    {lojaLogoUrl ? (
                        <img
                            src={lojaLogoUrl}
                            alt={`${lojaNome} Logo`}
                            className="ph-logo-img"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
                                console.error(`Falha ao carregar logo: ${lojaLogoUrl}`);
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

                <a href={`/${lojaNome}`} className="ph-logo-link">
                    {lojaLogoUrl ? (
                        <img
                            src={lojaLogoUrl}
                            alt={`${lojaNome} Logo`}
                            className="ph-logo-img"
                            onError={(e) => {
                                e.currentTarget.style.display = 'none';
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
                    <li><a href="/" className="ph-main-nav-link">Início</a></li>
                    <li><a href="/produtos" className="ph-main-nav-link">Produtos</a></li>
                    <li><a href="/contato" className="ph-main-nav-link">Contato</a></li>
                    <li><a href="/quem-somos" className="ph-main-nav-link">Quem Somos</a></li>
                    <li><a href="/politicas" className="ph-main-nav-link">Políticas</a></li>
                    <li><a href="/trocas-devolucoes" className="ph-main-nav-link">Trocas e Devoluções</a></li>
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
