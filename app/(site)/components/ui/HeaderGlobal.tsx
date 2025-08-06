'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import {
  FaBars,
  FaTimes,
  FaRocket,
  FaCode,
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
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
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
  
  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
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
                    <Link href="#">Cases de Sucesso</Link>
                    <Link href="#">Notícias do E-commerce</Link>
                    <Link href="#">Tendências de Mercado</Link>
                    <Link href="#" className={styles.verMaisLink}>
                      Ver mais <FaArrowRight className={styles.arrowIcon} />
                    </Link>
                  </div>
                  <div className={`${styles.column} ${styles.columnSeparator}`}>
                    <h4>Ajuda & Suporte</h4>
                    <Link href="#">Central de Ajuda</Link>
                    <Link href="#">Fórum da Comunidade</Link>
                    <Link href="#">Contato</Link>
                    <Link href="#" className={styles.verMaisLink}>
                      Ver mais <FaArrowRight className={styles.arrowIcon} />
                    </Link>
                  </div>
                  <div className={`${styles.column} ${styles.columnSeparator}`}>
                    <h4>Ferramentas</h4>
                    <Link href="#">Calculadora de Lucro</Link>
                    <Link href="#">Guia de SEO</Link>
                    <Link href="#">Templates Grátis</Link>
                    <Link href="#" className={styles.verMaisLink}>
                      Ver mais <FaArrowRight className={styles.arrowIcon} />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
          <Link href="/login" className={styles.loginButton}>
            <FaUserCircle />
            Fazer Login
          </Link>
          <Link
            href="/planos"
            className={styles.navButton}
          >
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
        <div 
          className={`${styles.megaMenu}`}
          ref={dropdownRef}
        >
          {openDropdown === 'plataforma' && (
            <div className={styles.megaMenuContent}>
              <div className={styles.column}>
                <h4>Conversão</h4>
                <Link href="#">Recuperação de carrinho</Link>
                <Link href="#">Checkout simplificado</Link>
                <Link href="#">Cupons e descontos</Link>
                <Link href="#" className={styles.verMaisLink}>
                  Ver mais <FaArrowRight className={styles.arrowIcon} />
                </Link>
              </div>
              <div className={`${styles.column} ${styles.columnSeparator}`}>
                <h4>Automação</h4>
                <Link href="#">E-mails automáticos</Link>
                <Link href="#">Notificações inteligentes</Link>
                <Link href="#">Fluxos de venda</Link>
                <Link href="#" className={styles.verMaisLink}>
                  Ver mais <FaArrowRight className={styles.arrowIcon} />
                </Link>
              </div>
              <div className={`${styles.column} ${styles.columnSeparator}`}>
                <h4>Análises</h4>
                <Link href="#">Dashboard moderna</Link>
                <Link href="#">Google Analytics integrado</Link>
                <Link href="#">Relatórios detalhados</Link>
                <Link href="#" className={styles.verMaisLink}>
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
                  <p className={styles.smallText}>Acesse seu painel para gerenciar comissões e divulgações.</p>
                  <Link href="#" className={styles.partnerLoginLink}>
                    Acessar Painel <FaRegPaperPlane />
                  </Link>
                </div>
                <div className={`${styles.parceirosColumn} ${styles.columnSeparator}`}>
                  <h5>Seja um parceiro</h5>
                  <Link href="#">Parceiros Especialistas</Link>
                  <Link href="#">Parceiros Tecnológicos</Link>
                  <Link href="#">Parceiros Afiliados</Link>
                  <Link href="#" className={styles.verMaisLink}>
                    Ver mais <FaArrowRight className={styles.arrowIcon} />
                  </Link>
                </div>
                <div className={`${styles.parceirosColumn} ${styles.columnSeparator}`}>
                  <h5>Contrate um parceiro</h5>
                  <Link href="#">Design e Criação</Link>
                  <Link href="#">Configuração da loja</Link>
                  <Link href="#">Migração para Phandshop</Link>
                  <Link href="#" className={styles.verMaisLink}>
                    Ver mais <FaArrowRight className={styles.arrowIcon} />
                  </Link>
                </div>
                <div className={`${styles.parceirosColumn} ${styles.columnSeparator}`}>
                  <h5>Para Desenvolvedores</h5>
                  <Link href="#">Documentação API</Link>
                  <Link href="#">Integrações</Link>
                  <Link href="#">Comunidade</Link>
                  <Link href="#" className={styles.verMaisLink}>
                    Ver mais <FaArrowRight className={styles.arrowIcon} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* MENU MOBILE - PAINEL LATERAL */}
      <div 
        className={`${styles.navMobile} ${isMenuOpen ? styles.isOpen : ''}`}
        ref={mobileMenuRef}
      >
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

        <div className={`${styles.mobileMenuContent} ${openMobileSubMenu ? styles.hideMenu : ''}`}>
          <nav className={styles.mobileMenuLinks}>
            <Link href="/plataforma" className={styles.mobileNavLink}>
              Plataforma <FaChevronDown className={styles.mobileChevron} />
            </Link>
            <Link href="/planos" className={styles.mobileNavLink}>
              Planos
            </Link>
            <Link href="/profissionais" className={styles.mobileNavLink}>
              Profissionais <FaChevronDown className={styles.mobileChevron} />
            </Link>
            <button onClick={() => setOpenMobileSubMenu('recursos')} className={styles.mobileNavLink}>
              Recursos <FaChevronDown className={styles.mobileChevron} />
            </button>
          </nav>
          <div className={styles.mobileFooterButtons}>
            <Link href="/planos" className={styles.mobileButtonPrimary}>
              Criar loja grátis
            </Link>
            <Link href="/login" className={styles.mobileButtonSecondary}>
              Login
            </Link>
          </div>
        </div>
        
        {/* SUB-MENU MOBILE (RECURSOS) */}
        {openMobileSubMenu === 'recursos' && (
          <div className={`${styles.mobileSubMenu} ${styles.showSubMenu}`}>
            <div className={styles.mobileSubMenuHeader}>
              <button onClick={() => setOpenMobileSubMenu(null)} className={styles.mobileBackButton}>
                <FaArrowLeft />
              </button>
              <span>Recursos</span>
            </div>
            <nav className={styles.mobileSubMenuLinks}>
              <Link href="#">Blog</Link>
              <Link href="#">Central de ajuda</Link>
              <Link href="#">Comunidade</Link>
            </nav>
          </div>
        )}
      </div>
    </>
  );
}