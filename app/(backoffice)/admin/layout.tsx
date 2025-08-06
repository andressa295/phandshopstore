'use client';
import React, { ReactNode } from 'react';

import Sidebar from '@/app/(backoffice)/components/Sidebar'; // O caminho pode variar dependendo da sua estrutura

// Define os tipos para as props do componente BackofficeLayout.
interface BackofficeLayoutProps {
  children: ReactNode;
}

const BackofficeLayout: React.FC<BackofficeLayoutProps> = ({ children }) => {
  const handleLogout = () => {
    // Ação real de logout, como remover o token e redirecionar para a página de login.
    console.log('Usuário deslogado.');
  };

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar onLogout={handleLogout} />
      <main style={{
        flexGrow: 1,
        marginLeft: '240px', // Corresponde à largura da sidebar
        padding: '2rem'
      }}>
        {children}
      </main>
    </div>
  );
};

export default BackofficeLayout;
