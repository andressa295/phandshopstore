// app/(backoffice)/admin/layout.tsx
'use client';
import React, { ReactNode } from 'react';
import styles from './Backoffice.module.css'; // Importa o arquivo de estilo
import Sidebar from '../components/Sidebar';
// Define os tipos para as props do componente BackofficeLayout.
interface BackofficeLayoutProps {
  children: ReactNode;
}

const BackofficeLayout: React.FC<BackofficeLayoutProps> = ({ children }) => {
  // handleLogout agora é gerenciado internamente pelo Sidebar, não precisa ser passado aqui
  // const handleLogout = () => { ... };

  return (
    <div className={styles.backofficeLayout}>
      <Sidebar /> {/* CORRIGIDO: onLogout não é mais passado como prop */}
      <main className={styles.backofficeContent}>
        {children}
      </main>
    </div>
  );
};

export default BackofficeLayout;