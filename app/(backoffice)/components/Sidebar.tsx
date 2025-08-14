'use client';
import React from 'react';
import styles from '../admin/Backoffice.module.css';
import Image from 'next/image';
import Link from 'next/link';

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const navItems = [
    { name: 'Dashboard', path: '#dashboard' },
    { name: 'Receita', path: '#receita' },
    { name: 'Lojistas', path: '#usuarios' },
    { name: 'Suporte', path: '#suporte' },
    { name: 'Planos', path: '#planos' },
    { name: 'Sair', path: '#logout', action: onLogout }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoWrapper}>
        <Image
          src="/logo.png"
          alt="Phandshop Logo"
          width={170}
          height={40}
          className={styles.logo}
        />
      </div>
      <nav>
        <ul className={styles.sidebarNav}>
          {navItems.map((item) => (
            <li key={item.path} className={styles.sidebarNavItem}>
              {item.action ? (
                <button
                  onClick={item.action}
                  className={styles.sidebarButton}
                >
                  {item.name}
                </button>
              ) : (
                <a href={item.path} className={styles.sidebarLink}>
                  {item.name}
                </a>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;