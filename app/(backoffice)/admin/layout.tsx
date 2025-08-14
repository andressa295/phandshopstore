'use client';
import React, { ReactNode } from 'react';
import styles from './Backoffice.module.css';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/navigation';

interface BackofficeLayoutProps {
  children: ReactNode;
  onLogout: () => void; // A prop onLogout agora é necessária
}

const BackofficeLayout: React.FC<BackofficeLayoutProps> = ({ children, onLogout }) => {
  return (
    <div className={styles.backofficeLayout}>
      <Sidebar onLogout={onLogout} />
      <main className={styles.backofficeContent}>
        {children}
      </main>
    </div>
  );
};

export default BackofficeLayout;