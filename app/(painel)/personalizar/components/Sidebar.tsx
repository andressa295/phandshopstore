'use client';

import React from 'react';
import { MdColorLens, MdFontDownload, MdWeb, MdHome, MdList, MdInfo, MdShoppingCart, MdCropDin, MdBrush, MdCode } from 'react-icons/md';
import styles from './Sidebar.module.css';

interface SidebarProps {
  setActiveSection: (id: string) => void;
}

const menuItems = [
  { id: 'cores', name: 'Cores', icon: <MdColorLens /> },
  { id: 'fontes', name: 'Fontes', icon: <MdFontDownload /> },
  { id: 'cabecalho', name: 'Cabeçalho', icon: <MdWeb /> },
  { id: 'pagina-inicial', name: 'Página Inicial', icon: <MdHome /> },
  { id: 'lista-produtos', name: 'Lista de Produtos', icon: <MdList /> },
  { id: 'detalhes-produto', name: 'Detalhes do Produto', icon: <MdInfo /> },
  { id: 'carrinho-compras', name: 'Carrinho de Compras', icon: <MdShoppingCart /> },
  { id: 'rodape-pagina', name: 'Rodapé da Página', icon: <MdCropDin /> },
  { id: 'tipo-designer', name: 'Tipo de Designer', icon: <MdBrush /> },
  { id: 'avancado', name: 'Avançado', icon: <MdCode /> },
];

const Sidebar: React.FC<SidebarProps> = ({ setActiveSection }) => {
  return (
    <nav className={styles.sidebar}>
      <h2 className={styles.title}>Editar Tema</h2>
      {menuItems.map(({ id, name, icon }) => (
        <button
          key={id}
          className={styles.menuItem}
          onClick={() => setActiveSection(id)}
        >
          <span className={styles.icon}>{icon}</span>
          <span>{name}</span>
        </button>
      ))}
    </nav>
  );
};

export default Sidebar;
