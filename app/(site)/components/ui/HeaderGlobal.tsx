'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import {
  FaBars,
  FaTimes,
  FaUserCircle,
  FaStore,
  FaChevronDown,
  FaArrowRight,
  FaArrowLeft,
  FaRegPaperPlane,
} from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openMobileSubMenu, setOpenMobileSubMenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const clickedElement = event.target as HTMLElement;
      const isDropdownButton = clickedElement.closest(`.${styles.dropdownToggle}`);

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(clickedElement) &&
        !isDropdownButton
      ) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (menu: string) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
    setOpenMobileSubMenu(null);
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLinkClick = () => {
    closeMenu();
  };

  // Agora vamos garantir que esses arrays tenham as opções do mobile submenus
  const plataformaLinks = [
    { label: "Recuperação de carrinho", href: "#" },
    { label: "Checkout simplificado", href: "#" },
    { label: "Cupons e descontos", href: "#" },
    { label: "E-mails automáticos", href: "#" },
    { label: "Notificações inteligentes", href: "#" },
    { label: "Fluxos de venda", href: "#" },
    { label: "Dashboard moderna", href: "#" },
    { label: "Google Analytics integrado", href: "#" },
    { label: "Relatórios detalhados", href: "#" },
  ];

  const profissionaisLinks = [
    { label: "Acessar Painel", href: "#" },
    { label: "Parceiros Especialistas", href: "#" },
    { label: "Parceiros Tecnológicos", href: "#" },
    { label: "Parceiros Afiliados", href: "#" },
    { label: "Configuração da loja", href: "#" },
    { label: "Design e Criação", href: "#" },
    { label: "Migração para Phandshop", href: "#" },
    { label: "Documentação API", href: "#" },
    { label: "Integrações", href: "#" },
    { label: "Comunidade", href: "#" },
  ];

  const recursosLinks = [
    { label: "Cases de Sucesso", href: "#" },
    { label: "Notícias do E-commerce", href: "#" },
    { label: "Tendências de Mercado", href: "#" },
    { label: "Central de Ajuda", href: "#" },
    { label: "Fórum da Comunidade", href: "#" },
    { label: "Contato", href: "#" },
    { label: "Calculadora de Lucro", href: "#" },
    { label: "Guia de SEO", href: "#" },
    { label: "Templates Grátis", href: "#" },
  ];

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink} onClick={handleLinkClick}>
          <Image
            src="/logo.png"
            alt="Phandshop Logo"
            width={170}
            height={45}
            priority
            className={styles.logoImage}
          />
        </Link>

        {/* MENU DESKTOP */}
        <nav className={styles.navDesktop}>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownToggle}
              onClick={() => toggleDropdown('plataforma')}
            >
              Plataforma <FaChevronDown className={styles.chevronIcon} />
            </button>
          </div>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownToggle}
              onClick={() => toggleDropdown('profissionais')}
            >
              Profissionais <FaChevronDown className={styles.chevronIcon} />
            </button>
          </div>
          <div className={styles.dropdown}>
            <button
              className={styles.dropdownToggle}
              onClick={() => toggleDropdown('recursos')}
            >
              Recursos <FaChevronDown className={styles.chevronIcon} />
            </button>
            {openDropdown === 'recursos' && (
              <div className={`${styles.megaMenu}`} ref={dropdownRef}>
                <div className={styles.megaMenuContent}>
                  <div className={styles.column}>
                    <h4>Blog & Conteúdo</h4>
                    <Link href="#" onClick={handleLinkClick}>Cases de Sucesso</Link>
                    <Link href="#" onClick={handleLinkClick}>Notícias do E-commerce</Link>
                    <Link href="#" onClick={handleLinkClick}>Tendências de Mercado</Link>
                    <Link href="#" className={styles.verMaisLink} onClick={handleLinkClick}>
                      Ver mais <FaArrowRight className={styles.arrowIcon} />
                    </Link>
                  </div>
                  <div className={`${styles.column} ${styles.columnSeparator}`}>
                    <h4>Ajuda & Suporte</h4>
                    <Link href="#" onClick={handleLinkClick}>Central de Ajuda</Link>
                    <Link href="#" onClick={handleLinkClick}>Fórum da Comunidade</Link>
                    <Link href="#" onClick={handleLinkClick}>Contato</Link>
                    <Link href="#" className={styles.verMaisLink} onClick={handleLinkClick}>
                      Ver mais <FaArrowRight className={styles.arrowIcon} />
                    </Link>
                  </div>
                  <div className={`${styles.column} ${styles.columnSeparator}`}>
                    <h4>Ferramentas</h4>
                    <Link href="#" onClick={handleLinkClick}>Calculadora de Lucro</Link>
                    <Link href="#" onClick={handleLinkClick}>Guia de SEO</Link>
                    <Link href="#" onClick={handleLinkClick}>Templates Grátis</Link>
                    <Link href="#" className={styles.verMaisLink} onClick={handleLinkClick}>
                      Ver mais <FaArrowRight className={styles.arrowIcon} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/login" className={styles.loginButton} onClick={handleLinkClick}>
            <FaUserCircle />
            Fazer Login
          </Link>
          <Link href="/planos" className={styles.navButton} onClick={handleLinkClick}>
            <FaStore />
            Criar loja grátis
          </Link>
        </nav>

        {/* BOTÃO HAMBURGER */}
        <button
          className={styles.hamburgerButton}
          onClick={toggleMobileMenu}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* MEGA MENU - DESKTOP */}
      {(openDropdown === 'plataforma' || openDropdown === 'profissionais') && (
        <div className={`${styles.megaMenu}`} ref={dropdownRef}>
          {openDropdown === 'plataforma' && (
            <div className={styles.megaMenuContent}>
              <div className={styles.column}>
                <h4>Conversão</h4>
                <Link href="#" onClick={handleLinkClick}>Recuperação de carrinho</Link>
                <Link href="#" onClick={handleLinkClick}>Checkout simplificado</Link>
                <Link href="#" onClick={handleLinkClick}>Cupons e descontos</Link>
                <Link href="#" className={styles.verMaisLink} onClick={handleLinkClick}>
                  Ver mais <FaArrowRight className={styles.arrowIcon} />
                </Link>
              </div>
              <div className={`${styles.column} ${styles.columnSeparator}`}>
                <h4>Automação</h4>
                <Link href="#" onClick={handleLinkClick}>E-mails automáticos</Link>
                <Link href="#" onClick={handleLinkClick}>Notificações inteligentes</Link>
                <Link href="#" onClick={handleLinkClick}>Fluxos de venda</Link>
                <Link href="#" className={styles.verMaisLink} onClick={handleLinkClick}>
                  Ver mais <FaArrowRight className={styles.arrowIcon} />
                </Link>
              </div>
              <div className={`${styles.column} ${styles.columnSeparator}`}>
                <h4>Análises</h4>
                <Link href="#" onClick={handleLinkClick}>Dashboard moderna</Link>
                <Link href="#" onClick={handleLinkClick}>Google Analytics integrado</Link>
                <Link href="#" onClick={handleLinkClick}>Relatórios detalhados</Link>
                <Link href="#" className={styles.verMaisLink} onClick={handleLinkClick}>
                  Ver mais <FaArrowRight className={styles.arrowIcon} />
                </Link>
              </div>
            </div>
          )}

          {openDropdown === 'profissionais' && (
            <div className={styles.megaMenuContent}>
              <div className={styles.parceirosWrapper}>
                <div className={styles.parceirosEco}>
                  <h4>Login do Parceiro</h4>
                  <p className={styles.smallText}>
                    Acesse seu painel para gerenciar comissões e divulgações.
                  </p>
                  <Link href="/sitecriadores/afiliado" className={styles.partnerLoginLink} onClick={handleLinkClick}>
                    Acessar Painel <FaRegPaperPlane />
                  </Link>
                </div>
                <div className={`${styles.parceirosColumn} ${styles.columnSeparator}`}>
                  <h5>Seja um parceiro</h5>
                  <Link href="/seja-um-parceiro/parceiros/temas" onClick={handleLinkClick}>Parceiros Especialistas</Link>
                  <Link href="/seja-um-parceiro/tecnologicos" onClick={handleLinkClick}>Parceiros Tecnológicos</Link>
                  <Link href="/seja-um-parceiro/criadores" onClick={handleLinkClick}>Parceiros Afiliados</Link>
                  <Link href="/seja-um-parceiro" className={styles.verMaisLink} onClick={handleLinkClick}>
                    Ver mais <FaArrowRight className={styles.arrowIcon} />
                  </Link>
                </div>
                <div className={`${styles.parceirosColumn} ${styles.columnSeparator}`}>
                  <h5>Contrate um parceiro</h5>
                  <Link href="/contratar/configuracao" onClick={handleLinkClick}>Configuração da loja</Link>
                  <Link href="/contratar/design" onClick={handleLinkClick}>Design e Criação</Link>
                  <Link href="/contratar/migracao" onClick={handleLinkClick}>Migração para Phandshop</Link>
                  <Link href="/contratar" className={styles.verMaisLink} onClick={handleLinkClick}>
                    Ver mais <FaArrowRight className={styles.arrowIcon} />
                  </Link>
                </div>
                <div className={`${styles.parceirosColumn} ${styles.columnSeparator}`}>
                  <h5>Trabalhe Conosco</h5>
                  <Link href="/trabalhe-conosco" onClick={handleLinkClick}>Vagas em Aberto</Link>
                  <Link href="/trabalhe-conosco" onClick={handleLinkClick}>Nossa Cultura</Link>
                  <Link href="/trabalhe-conosco" onClick={handleLinkClick}>Programas de Estágio</Link>
                  <Link href="/trabalhe-conosco" className={styles.verMaisLink} onClick={handleLinkClick}>
                    Ver mais <FaArrowRight className={styles.arrowIcon} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* MENU MOBILE */}
      <div className={`${styles.navMobile} ${isMenuOpen ? styles.isOpen : ''}`}>
        <div className={styles.mobileHeader}>
          <Image
            src="/logo.png"
            alt="Phandshop Logo"
            width={150}
            height={40}
            priority
            className={styles.mobileLogo}
          />
          <button onClick={closeMenu} className={styles.mobileCloseButton}>
            <FaTimes size={24} />
          </button>
        </div>

        {/* Menu Principal */}
        {!openMobileSubMenu && (
          <div className={styles.mobileMenuContent}>
            <nav className={styles.mobileMenuLinks}>
              <button onClick={() => setOpenMobileSubMenu('plataforma')} className={styles.mobileNavLink}>
                Plataforma <FaChevronDown className={styles.mobileChevron} />
              </button>
              <Link href="/planos" className={styles.mobileNavLink} onClick={handleLinkClick}>
                Planos
              </Link>
              <button onClick={() => setOpenMobileSubMenu('profissionais')} className={styles.mobileNavLink}>
                Profissionais <FaChevronDown className={styles.mobileChevron} />
              </button>
              <button onClick={() => setOpenMobileSubMenu('recursos')} className={styles.mobileNavLink}>
                Recursos <FaChevronDown className={styles.mobileChevron} />
              </button>
            </nav>
            <div className={styles.mobileFooterButtons}>
              <Link href="/planos" className={styles.mobileButtonPrimary} onClick={handleLinkClick}>
                Criar loja grátis
              </Link>
              <Link href="/login" className={styles.mobileButtonSecondary} onClick={handleLinkClick}>
                Login
              </Link>
            </div>
          </div>
        )}

        {/* Submenu Mobile */}
        {openMobileSubMenu && (
          <div className={styles.mobileSubMenu}>
            <div className={styles.mobileSubMenuHeader}>
              <button onClick={() => setOpenMobileSubMenu(null)} className={styles.mobileBackButton}>
                <FaArrowLeft />
              </button>
              <span>{openMobileSubMenu.charAt(0).toUpperCase() + openMobileSubMenu.slice(1)}</span>
            </div>
            <nav className={styles.mobileSubMenuLinks}>
              {(openMobileSubMenu === 'plataforma'
  ? plataformaLinks
  : openMobileSubMenu === 'profissionais'
  ? profissionaisLinks
  : recursosLinks
).map((item, index) => (
  <Link
    key={`${item.href}-${index}-${item.label.replace(/\s+/g, '')}`}
    href={item.href}
    onClick={handleLinkClick}
  >
    {item.label}
  </Link>
))}
            </nav>
          </div>
        )}
      </div>
    </>
  );
}
