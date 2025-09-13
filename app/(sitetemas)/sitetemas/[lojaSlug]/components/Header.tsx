"use client";

import React, { useState } from "react";
import { Search, ShoppingBag, User, Menu, X } from "lucide-react";

interface HeaderLink {
  label: string;
  href: string;
}

interface HeaderProps {
  lojaNome: string;
  links?: HeaderLink[];
}

export default function Header({
  lojaNome,
  links = [
    { label: "Início", href: "/" },
    { label: "Produtos", href: "/produtos" },
    { label: "Quem somos", href: "/quem-somos" },
    { label: "Contato", href: "/contato" },
    { label: "Carrinho", href: "/carrinho" },
  ],
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="border-b relative">
      {/* TOP BAR */}
      <div className="header-top">
        {/* ESQUERDA (MOBILE): MENU */}
        <div className="flex items-center gap-3">
          <button
            className="menu-btn"
            aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              // fecha a busca se o menu abrir
              if (!mobileMenuOpen) setMobileSearchOpen(false);
            }}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* CENTRO: LOGO */}
        <div className="logo">{lojaNome}</div>

        {/* DIREITA: AÇÕES */}
        <div className="header-actions">
          {/* MOBILE: TOGGLE DE BUSCA (fica ao lado dos ícones) */}
          <button
            className="search-toggle"
            aria-label={mobileSearchOpen ? "Fechar busca" : "Abrir busca"}
            onClick={() => {
              setMobileSearchOpen(!mobileSearchOpen);
              // fecha o menu se a busca abrir
              if (!mobileSearchOpen) setMobileMenuOpen(false);
            }}
          >
            {mobileSearchOpen ? <X size={22} /> : <Search size={20} />}
          </button>

          <a href="/conta" aria-label="Minha conta">
            <User size={20} />
          </a>
          <a href="/carrinho" aria-label="Carrinho">
            <ShoppingBag size={20} />
          </a>
        </div>
      </div>

      {/* DESKTOP: BARRA OVAL SEMPRE VISÍVEL */}
      <div className="header-desktop-search">
        <form className="search-pill" role="search">
          <input
            type="text"
            placeholder="Buscar produtos..."
            aria-label="Buscar produtos"
          />
          <button type="submit" aria-label="Buscar">
            <Search size={18} />
          </button>
        </form>
      </div>

      {/* DESKTOP: MENU INFERIOR */}
      <div className="header-bottom">
        <nav>
          {links.map((link, i) => (
            <a key={i} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* MOBILE: OVERLAY DA BUSCA (SEM LUPA INTERNA) */}
      {mobileSearchOpen && (
        <div className="mobile-search-bar">
          <form role="search" className="mobile-search-form" onSubmit={(e)=>e.preventDefault()}>
            <input
              type="text"
              placeholder="Buscar produtos..."
              aria-label="Buscar produtos"
            />
            <button type="submit">Buscar</button>
          </form>
        </div>
      )}

      {/* MOBILE: DRAWER À ESQUERDA */}
      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        <button
          className="close-btn"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Fechar menu"
        >
          <X size={20} /> Fechar
        </button>
        <nav>
          {links.map((link, i) => (
            <a key={i} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
