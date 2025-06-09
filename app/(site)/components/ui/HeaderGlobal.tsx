'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './Header.module.css'; // Supondo que você usa o CSS Module que te passei
import { FaBars, FaTimes } from 'react-icons/fa';

// O seu arquivo Header.module.css da resposta anterior não precisa de alterações.
// A mudança principal está no código do componente abaixo.

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Efeito para fechar o dropdown se clicar fora. Este é seguro e mantido.
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      // Verifica se o ref existe e se o clique não foi dentro do elemento do ref
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    // Função de limpeza: remove o listener quando o componente é desmontado
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []); // O array de dependências vazio garante que isso rode apenas uma vez (na montagem)

  /*
    ***** ALTERAÇÃO PRINCIPAL *****
    O useEffect que controlava o 'document.body.style.overflow' foi REMOVIDO.
    Ele era a causa mais provável do erro 'Cannot read properties of null (reading 'removeChild')'
    durante as transições de página no Next.js.
  */

  return (
    <>
      <header className={styles.header}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/logo.png" // Troque pelo caminho da sua logo
            alt="Phandshop Logo"
            width={170}
            height={45}
            priority
            className={styles.logoImage}
          />
        </Link>

        {/* NAVEGAÇÃO PARA DESKTOP */}
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

        {/* BOTÃO HAMBÚRGUER PARA MOBILE */}
        {/* Este botão agora só controla a abertura do menu mobile, sem o efeito de scroll lock */}
        <button 
          className={styles.hamburgerButton} 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={isMenuOpen}
        >
          {/* O ícone muda entre hambúrguer e 'X' */}
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </header>

      {/* PAINEL DO MENU MOBILE */}
      {/* A lógica de classe para abrir/fechar continua a mesma */}
      <div className={`${styles.navMobile} ${isMenuOpen ? styles.isOpen : ''}`}>
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