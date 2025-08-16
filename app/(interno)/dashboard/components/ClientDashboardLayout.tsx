'use client';

import React, { ReactNode, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUser } from '../UserContext';
import HeaderPainel from './HeaderPainel';
import {
  FaHome, FaChartBar, FaBoxOpen, FaUsers, FaTags, FaBullhorn, FaShoppingCart,
  FaStore, FaChevronDown, FaChevronUp, FaFacebook, FaListAlt
} from 'react-icons/fa';
import { MdSettings, MdMenu } from 'react-icons/md';
import './dashboard-layout.css';

interface MenuItem {
  icon: React.ReactNode;
  label: string;
  href?: string;
  children?: MenuChild[];
}
interface MenuChild {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const menuItems: MenuItem[] = [
  { icon: <FaHome />, label: 'Página inicial', href: '/dashboard' },
  { icon: <FaChartBar />, label: 'Estatísticas', href: '/dashboard/estatisticas' },
  {
    icon: <FaShoppingCart />, label: 'Vendas', children: [
      { label: 'Lista de vendas', href: '/dashboard/vendas/lista' },
      { label: 'Carrinhos abandonados', href: '/dashboard/vendas/carrinhos' },
      { label: 'Pedidos manuais', href: '/dashboard/vendas/pedidos' },
    ]
  },
  {
    icon: <FaBoxOpen />, label: 'Produtos', children: [
      { label: 'Lista de produtos', href: '/dashboard/produtos/lista' },
      { label: 'Categorias', href: '/dashboard/categorias' },
    ]
  },
  {
    icon: <FaUsers />, label: 'Clientes', children: [
      { label: 'Lista de clientes', href: '/dashboard/clientes/lista' },
      { label: 'Mensagens', href: '/dashboard/clientes/mensagens' },
    ]
  },
  {
    icon: <FaTags />, label: 'Descontos', children: [
      { label: 'Cupons', href: '/dashboard/descontos/cupons' },
      { label: 'Frete grátis', href: '/dashboard/descontos/frete-gratis' },
      { label: 'Promoções', href: '/dashboard/promocoes' },
    ]
  },
  { icon: <FaBullhorn />, label: 'Marketing', children: [{ label: 'Aplicativos', href: '/dashboard/marketing/aplicativos' }] },
  { icon: <FaStore />, label: 'Canais de venda', href: '/dashboard/canais' },
  {
    icon: <FaStore />, label: 'Loja online', children: [
      { label: 'Loja Temas', href: '/dashboard/editarloja/temas' },
      { label: 'Editar loja', href: '/personalizar' },
      { label: 'Páginas', href: '/dashboard/paginas' },
      { label: 'Menus', href: '/dashboard/loja/menus' },
      { label: 'Página em construção', href: '/dashboard/construcao' },
      { label: 'Informação de contato', href: '/dashboard/contato' },
    ]
  },
  {
    icon: <FaFacebook />, label: 'Redes sociais', children: [
      { label: 'Facebook / Meta', href: '/dashboard/facebook-meta' },
      { label: 'Instagram Shopping', href: '/dashboard/instagram' },
      { label: 'Google Shopping', href: '/dashboard/google-shopping' },
    ]
  },
  {
    icon: <MdSettings />, label: 'Configurações', children: [
      { label: 'Forma de entrega', href: '/dashboard/configuracoes/formas-entrega' },
      { label: 'Meios de pagamentos', href: '/dashboard/configuracoes/meios-pagamentos' },
      { label: 'E-mails', href: '/dashboard/configuracoes/emails' },
      { label: 'WhatsApp', href: '/dashboard/configuracoes/whatsapp' },
      { label: 'Moedas e Idiomas', href: '/dashboard/configuracoes/moedas-idiomas' },
      { label: 'Opções de checkout', href: '/dashboard/configuracoes/opcoes-checkout' },
      { label: 'Códigos externos', href: '/dashboard/configuracoes/codigos-externos' },
      { label: 'Redirecionamentos 301', href: '/dashboard/configuracoes/redirecionamentos' },
      { label: 'Domínios', href: '/dashboard/configuracoes/dominios' },
    ]
  },
];

export default function ClientDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, profile, loading } = useUser();

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const initial: Record<string, boolean> = {};
    menuItems.forEach((item) => {
      if (item.children) {
        initial[item.label] = item.children.some((sub) => pathname.startsWith(sub.href));
      }
    });
    setOpenMenus(initial);
  }, [pathname]);

  const toggleMenu = (label: string) =>
    setOpenMenus((prev) => ({ ...prev, [label]: !prev[label] }));

  const isActive = (href: string) => {
    if (!href) return false;
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // 🔹 mover o useMemo para antes dos returns condicionais
  const bottomNav = useMemo(
    () => [
      { href: '/dashboard', label: 'Início', icon: <FaHome /> },
      { href: '/dashboard/estatisticas', label: 'Stats', icon: <FaChartBar /> },
      { href: '/dashboard/vendas/lista', label: 'Vendas', icon: <FaListAlt /> },
      { href: '/dashboard/produtos/lista', label: 'Produtos', icon: <FaBoxOpen /> },
      { href: '/dashboard/clientes/lista', label: 'Clientes', icon: <FaUsers /> },
    ],
    []
  );

  if (loading) {
    return (
      <div className="layout-loading">
        <p className="font-poppins text-gray-600 text-lg sm:text-xl md:text-2xl font-medium">
          Carregando Dashboard...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="layout-error">
        <p className="font-poppins text-red-600 text-lg sm:text-xl md:text-2xl font-medium">
          Erro: Usuário não autenticado.
        </p>
      </div>
    );
  }

  return (
    <div className="layout-root">
      <HeaderPainel userProfile={profile} />

      {/* 🔹 Esconde o botão hambúrguer no mobile */}
      <button className="hamburger-btn desktop-only" onClick={() => setSidebarOpen(true)}>
        <MdMenu size={22} />
      </button>

      <div className="layout-main">
        {/* 🔹 Sidebar só aparece no desktop */}
        <aside className={`sidebar desktop-only ${sidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <p className="sidebar-subtitle">Painel Administrativo</p>
          </div>
          <nav className="sidebar-nav">
            <ul>
              {menuItems.map((item) => (
                <li key={item.label}>
                  {item.children ? (
                    <>
                      <button
                        className={`nav-parent ${openMenus[item.label] ? 'expanded' : ''}`}
                        onClick={() => toggleMenu(item.label)}
                      >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-text">{item.label}</span>
                        {openMenus[item.label] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                      {openMenus[item.label] && (
                        <ul className="nav-children">
                          {item.children.map((child) => (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className={`nav-child ${isActive(child.href) ? 'active' : ''}`}
                              >
                                {child.icon && <span className="nav-icon">{child.icon}</span>}
                                <span className="nav-text">{child.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href || '#'}
                      className={`nav-item ${isActive(item.href || '') ? 'active' : ''}`}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-text">{item.label}</span>
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="sidebar-footer">
            <p>© 2025 Phandshop</p>
          </div>
        </aside>

        {sidebarOpen && <div className="backdrop desktop-only" onClick={() => setSidebarOpen(false)} />}

        <main className="content-area">{children}</main>
      </div>

      <nav className="bottom-nav">
        {bottomNav.map((it) => (
          <Link key={it.href} href={it.href} className={`bottom-link ${isActive(it.href) ? 'active' : ''}`}>
            <span className="bottom-icon">{it.icon}</span>
            <span className="bottom-label">{it.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
