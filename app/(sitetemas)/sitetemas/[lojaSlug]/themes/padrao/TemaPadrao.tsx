"use client";

import React, { useState } from "react";
import "./styles/announcement.css";
import "./styles/banner.css";
import "./styles/footer.css";
import "./styles/header.css";
import "./styles/highlight.css";
import "./styles/infobar.css";
import "./styles/mini-banners.css";
import "./styles/newsletter.css";
import "./styles/products.css";
import "./styles/reset.css";
import "./styles/responsive.css";
import "./styles/variables.css";
import { Search, ShoppingBag, User, Menu } from "lucide-react";
import { ThemeConfig, ProductItem } from "../../theme/types";
import InfoBar from "../../components/InfoBar";

interface LojaData {
  nome: string;
  logoUrl?: string;
}

interface TemaPadraoProps {
  lojaData: LojaData;
  produtos?: ProductItem[];
  themeConfig: ThemeConfig;
}

export default function TemaPadrao({
  lojaData,
  produtos = [],
  themeConfig,
}: TemaPadraoProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="theme-padrao">
      {/* Announcement */}
      {themeConfig?.announcementBar ? (
        <div
          className="announcement"
          style={{
            backgroundColor: themeConfig.announcementBar.backgroundColor ?? "#444",
            color: themeConfig.announcementBar.textColor ?? "#fff",
          }}
        >
          {themeConfig.announcementBar.message ??
            "Frete grátis em pedidos acima de R$199"}
        </div>
      ) : (
        <div className="announcement">
          Frete grátis em pedidos acima de R$199
        </div>
      )}

      {/* Header */}
      <header>
        <div className="header-top">
          <div className="logo">
            {lojaData.logoUrl ? (
              <img src={lojaData.logoUrl} alt={lojaData.nome} height={40} />
            ) : (
              lojaData.nome
            )}
          </div>

          <div className="search-container">
            <button
              className="search-toggle"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={20} />
            </button>
            <div className={`search-bar ${searchOpen ? "expanded" : ""}`}>
              <input type="text" placeholder="Buscar produtos..." />
              <button>
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="header-actions">
            <a href="/conta">
              <User size={20} />
            </a>
            <a href="/carrinho">
              <ShoppingBag size={20} />
            </a>
            <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu size={22} />
            </button>
          </div>
        </div>

        <div className="header-bottom">
          <nav>
            {(themeConfig.header?.links ?? [
              { href: "/", label: "Início" },
              { href: "/produtos", label: "Produtos" },
              { href: "/quem-somos", label: "Quem somos" },
              { href: "/contato", label: "Contato" },
            ]).map((link, idx) => (
              <a key={idx} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className={`mobile-menu ${menuOpen ? "active" : ""}`}>
        <nav>
          {(themeConfig.header?.links ?? []).map((link, idx) => (
            <a key={idx} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      <main>
        {/* Banner */}
        <section className="banner">
          {themeConfig.banner?.images && themeConfig.banner.images.length > 0 ? (
            <img
              src={themeConfig.banner.images[0].src}
              alt={themeConfig.banner.images[0].alt ?? "Banner principal"}
            />
          ) : (
            <img src="/placeholder.jpg" alt="Banner placeholder" />
          )}
        </section>

        {/* InfoBar dinâmico */}
        {themeConfig.infobar?.items?.length > 0 ? (
          <InfoBar
            items={themeConfig.infobar.items}
            variant={themeConfig.infobar.variant}
          />
        ) : null}

        {/* Mini banners */}
        {themeConfig.miniBanners?.enabled && (
          <section className="mini-banners">
            {(themeConfig.miniBanners?.banners ?? []).map((b, idx) => (
              <div key={idx} className="mini-banner">
                {b.title ?? "Banner"}
              </div>
            ))}
          </section>
        )}

        {/* Vitrine */}
        <section>
          <h2 className="section-title">
            {themeConfig.productShowcase?.title ?? "Destaques"}
          </h2>
          <div className="product-grid">
            {(
              themeConfig.productShowcase?.products?.length
                ? themeConfig.productShowcase.products
                : produtos
            ).map((p) => (
              <div key={p.id} className="product-card">
                <img src={p.imageUrl || "/placeholder.jpg"} alt={p.name} />
                <h3>{p.name}</h3>
                <p>{p.price}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Quem somos */}
        {themeConfig.textImageSection ? (
          <section className="highlight">
            <div className="highlight-text">
              <h2>{themeConfig.textImageSection.title ?? "Quem somos"}</h2>
              <p>
                {themeConfig.textImageSection.text ??
                  "Nossa loja foi criada para oferecer os melhores produtos com qualidade e confiança."}
              </p>
            </div>
            <div className="highlight-img">
              <img
                src={
                  themeConfig.textImageSection.imageUrl || "/placeholder.jpg"
                }
                alt={themeConfig.textImageSection.title ?? "Quem somos"}
              />
            </div>
          </section>
        ) : null}

        {/* Newsletter */}
        {themeConfig.newsletter?.enabled && (
          <section
            className="newsletter"
            style={{
              backgroundColor: themeConfig.newsletter.backgroundColor ?? "#f5f5f5",
              color: themeConfig.newsletter.textColor ?? "#333",
            }}
          >
            <h2>{themeConfig.newsletter.title ?? "Assine nossa Newsletter"}</h2>
            <p>
              {themeConfig.newsletter.description ??
                "Receba promoções e novidades direto no seu e-mail"}
            </p>
            <form className="newsletter-form">
              <input
                type="email"
                placeholder={themeConfig.newsletter.placeholder ?? "Seu e-mail"}
              />
              <button type="submit">
                {themeConfig.newsletter.buttonLabel ?? "Assinar"}
              </button>
            </form>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: themeConfig.footer?.backgroundColor ?? "#000",
          color: themeConfig.footer?.textColor ?? "#fff",
        }}
      >
        <div className="footer-columns">
          {(themeConfig.footer?.links ?? []).map((link, idx) => (
            <div key={idx}>
              <a href={link.href}>{link.label}</a>
            </div>
          ))}
        </div>
        <div className="footer-copy">
          {themeConfig.footer?.text ??
            `© ${new Date().getFullYear()} ${lojaData.nome}. Todos os direitos reservados.`}
        </div>
      </footer>
    </div>
  );
}
