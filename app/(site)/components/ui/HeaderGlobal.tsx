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
  FaSignInAlt,
  FaStore,
  FaArrowLeft
} from 'react-icons/fa';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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

        <nav className={styles.navDesktop}>
          <Link href="/criadores" className={styles.navLink}>Para Desenvolvedores</Link>
          <Link href="/beneficios" className={styles.navLink}>Recursos</Link>
          <Link href="/login" className={styles.navLink}>Fazer Login</Link>
          <Link href="/planos" className={`${styles.navButton} ${styles.ovalButton}`}>
            Criar loja grátis
          </Link>
        </nav>

        <button
          className={styles.hamburgerButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      <div
        ref={dropdownRef}
        className={`${styles.navMobile} ${isMenuOpen ? styles.isOpen : ''}`}
      >
        <Link href="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          <FaArrowLeft style={{ marginRight: '8px' }} />
          Voltar para início
        </Link>
        <Link href="/beneficios" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          <FaRocket style={{ marginRight: '8px' }} />
          Recursos
        </Link>
        <Link href="/criadores" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          <FaCode style={{ marginRight: '8px' }} />
          Para Desenvolvedores
        </Link>
        <Link href="/login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          <FaSignInAlt style={{ marginRight: '8px' }} />
          Fazer Login
        </Link>
        <Link
          href="/planos"
          className={`${styles.navButton} ${styles.ovalButton}`}
          onClick={() => setIsMenuOpen(false)}
        >
          <FaStore style={{ marginRight: '8px' }} />
          Criar loja grátis
        </Link>
      </div>
    </>
  );
}
