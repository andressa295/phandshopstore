'use client';

import React from 'react';
import { MdColorLens, MdFontDownload, MdWeb, MdHome, MdList, MdInfo, MdShoppingCart, MdCropDin, MdBrush, MdCode } from 'react-icons/md';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import styles from './Sidebar.module.css';
import Link from 'next/link'; // Importa o componente Link

interface SidebarProps {
  setActiveSection: (id: string) => void;
  activeSection: string | null;
}

const menuItems = [
  { id: 'cores', name: 'Cores', icon: <MdColorLens /> },
  { id: 'fontes', name: 'Fontes', icon: <MdFontDownload /> },
  { id: 'tipo-designer', name: ' Designer', icon: <MdBrush /> },
  { id: 'cabecalho', name: 'Cabeçalho', icon: <MdWeb /> },
  { id: 'pagina-inicial', name: 'Página Inicial', icon: <MdHome /> },
  { id: 'lista-produtos', name: 'Lista de Produtos', icon: <MdList /> },
  { id: 'detalhes-produto', name: 'Detalhes do Produto', icon: <MdInfo /> },
  { id: 'carrinho-compras', name: 'Carrinho de Compras', icon: <MdShoppingCart /> },
  { id: 'rodape-pagina', name: 'Rodapé da Página', icon: <MdCropDin /> },
  { id: 'avancado', name: 'Avançado', icon: <MdCode /> },
];

const Sidebar: React.FC<SidebarProps> = ({ setActiveSection, activeSection }) => {
  return (
    <nav className={styles.sidebar}>
      <div className={styles.topbar}>
        <Link href="/dashboard" passHref className={styles.backButton}>
          <ArrowLeft size={20} />
        </Link>
        <Image
          src="/logoroxo.png"
          alt="Logo da Phandshop"
          width={150}
          height={80}
          className={styles.logo}
        />
      </div>
      <h2 className={styles.title}>Editar Tema</h2>
      {menuItems.map(({ id, name, icon }) => (
        <button
          key={id}
          className={`${styles.menuItem} ${activeSection === id ? styles.active : ''}`}
          onClick={() => setActiveSection(id)}
        >
          <span className={styles.icon}>{icon}</span>
          <span className={styles.menuText}>{name}</span>
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;