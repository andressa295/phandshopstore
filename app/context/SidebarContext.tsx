'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type SidebarContextType = {
  openMenus: Record<string, boolean>;
  toggleMenu: (label: string) => void;
};

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  // Carregar estado do localStorage ao montar
  useEffect(() => {
    const stored = localStorage.getItem('openMenus');
    if (stored) {
      setOpenMenus(JSON.parse(stored));
    }
  }, []);

  // Salvar estado no localStorage sempre que mudar
  useEffect(() => {
    localStorage.setItem('openMenus', JSON.stringify(openMenus));
  }, [openMenus]);

  const toggleMenu = (label: string) => {
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <SidebarContext.Provider value={{ openMenus, toggleMenu }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar deve ser usado dentro de SidebarProvider');
  }
  return context;
};
