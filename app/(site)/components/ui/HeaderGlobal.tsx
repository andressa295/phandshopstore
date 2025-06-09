'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css';
import { FaBars, FaTimes } from 'react-icons/fa';

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
          <Link href="/planos" className={styles.navLink}>
            Planos e Preços
          </Link>
          <Link href="/login" className={styles.navLink}>
            Fazer Login
          </Link>
          <Link href="/cadastro" className={styles.navButton}>
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
        <Link href="/planos" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Planos e Preços
        </Link>
        <Link href="/login" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>
          Fazer Login
        </Link>
        <Link href="/cadastro" className={styles.navButton} onClick={() => setIsMenuOpen(false)}>
          Criar loja grátis
        </Link>
      </div>
    </>
  );
}
