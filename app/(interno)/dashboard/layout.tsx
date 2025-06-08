'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import HeaderPainel from './components/HeaderPainel';
import FooterPainel from './components/FooterPainel';

import {
  FaHome, FaChartBar, FaBoxOpen, FaUsers, FaTags, FaBullhorn, FaShoppingCart,
  FaStore, FaChevronDown, FaChevronUp
} from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';

type MenuChild = {
  label: string;
  href: string;
};

type MenuItem = {
  icon: React.ReactNode;
  label: string;
  href?: string;
  children?: MenuChild[];
};

const menuItems: MenuItem[] = [
  { icon: <FaHome />, label: 'Página inicial', href: '/inicio' },
  { icon: <FaChartBar />, label: 'Estatísticas', href: '/dashboard/estatisticas' },
  {
    icon: <FaShoppingCart />, label: 'Vendas', children: [
      { label: 'Lista de vendas', href: '/dashboard/vendas/lista' },
      { label: 'Carrinhos abandonados', href: '/dashboard/vendas/carrinhos' },
      { label: 'Pedidos manuais', href: '/dashboard/vendas/pedidos' }
    ]
  },
  {
    icon: <FaBoxOpen />, label: 'Produtos', children: [
      { label: 'Lista de produtos', href: '/dashboard/produtos/lista' },
      { label: 'Categorias', href: '/dashboard/produtos/categorias' }
    ]
  },
  {
    icon: <FaUsers />, label: 'Clientes', children: [
      { label: 'Lista de clientes', href: '/dashboard/clientes/lista' },
      { label: 'Mensagens', href: '/dashboard/clientes/mensagens' }
    ]
  },
  {
    icon: <FaTags />, label: 'Descontos', children: [
      { label: 'Cupons', href: '/dashboard/descontos/cupons' },
      { label: 'Frete grátis', href: '/dashboard/descontos/frete-gratis' },
      { label: 'Promoções', href: '/dashboard/descontos/promocoes' }
    ]
  },
  {
    icon: <FaBullhorn />, label: 'Marketing', children: [
      { label: 'Aplicativos', href: '/dashboard/marketing/aplicativos' }
    ]
  },
  { icon: <FaStore />, label: 'Canais de venda', href: '/dashboard/canais' },
  {
    icon: <FaStore />, label: 'Loja online', children: [
      { label: 'Editar loja', href: '/dashboard/loja/editar' },
      { label: 'Páginas', href: '/dashboard/loja/paginas' },
      { label: 'Menus', href: '/dashboard/loja/menus' },
      { label: 'Página em construção', href: '/dashboard/loja/pagina-em-construcao' },
      { label: 'Informação de contato', href: '/dashboard/loja/contato' }
    ]
  },
  {
    icon: <FaStore />, label: 'Redes sociais', children: [
      { label: 'Facebook / Meta', href: '/dashboard/redes/facebook' },
      { label: 'Instagram Shopping', href: '/dashboard/redes/instagram' },
      { label: 'Google Shopping', href: '/dashboard/redes/google' }
    ]
  },
  {
    icon: <MdSettings />, label: 'Configurações', children: [
      { label: '(Pagamentos e envios)', href: '/dashboard/configuracoes/pagamentos-envios' },
      { label: 'Forma de entrega', href: '/dashboard/configuracoes/forma-entrega' },
      { label: 'Meios de pagamentos', href: '/dashboard/configuracoes/meios-pagamentos' },
      { label: '(Comunicação)', href: '/dashboard/configuracoes/comunicacao' },
      { label: 'E-mails', href: '/dashboard/configuracoes/emails' },
      { label: 'WhatsApp', href: '/dashboard/configuracoes/whatsapp' },
      { label: '(Configurações gerais)', href: '/dashboard/configuracoes/gerais' },
      { label: 'Moedas e Idiomas', href: '/dashboard/configuracoes/moedas-idiomas' },
      { label: '(Configuração Avançada)', href: '/dashboard/configuracoes/avancada' },
      { label: 'Opções de checkout', href: '/dashboard/configuracoes/opcoes-checkout' },
      { label: 'Códigos externos', href: '/dashboard/configuracoes/codigos-externos' },
      { label: 'Redirecionamentos 301', href: '/dashboard/configuracoes/redirecionamentos' },
      { label: 'Domínios', href: '/dashboard/configuracoes/dominios' },
      { label: 'Campos personalizados', href: '/dashboard/configuracoes/campos-personalizados' }
    ]
  }
];

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (label: string) => {
    setOpenMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <HeaderPainel />

      <div style={{
        display: 'flex',
        flexGrow: 1,
        minHeight: 0,
      }}>
        {/* Sidebar */}
        <aside style={{
          width: 280,
          backgroundColor: '#fff',
          borderRight: '1px solid #eee',
          padding: 24,
          boxSizing: 'border-box',
          height: '100%',
          overflowY: 'auto'
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map(({ icon, label, children, href }) => (
              <li key={label} style={{ marginBottom: 12 }}>
                {children ? (
                  <>
                    <div
                      onClick={() => toggleMenu(label)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        cursor: 'pointer',
                        fontWeight: 500,
                        color: '#333',
                        fontSize: 15,
                        userSelect: 'none'
                      }}
                      aria-expanded={!!openMenus[label]}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleMenu(label);
                        }
                      }}
                    >
                      {icon}
                      <span>{label}</span>
                      {openMenus[label]
                        ? <FaChevronUp size={12} style={{ marginLeft: 'auto' }} />
                        : <FaChevronDown size={12} style={{ marginLeft: 'auto' }} />}
                    </div>
                    {openMenus[label] && (
                      <ul style={{ marginTop: 6, paddingLeft: 24 }}>
                        {children.map(({ label: childLabel, href: childHref }) => (
                          <li key={childHref} style={{ padding: '4px 0', fontSize: 14 }}>
                            <Link href={childHref} style={{ color: '#666', textDecoration: 'none' }}>
                              {childLabel}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={href || '#'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      fontWeight: 500,
                      color: '#333',
                      fontSize: 15,
                      textDecoration: 'none'
                    }}
                  >
                    {icon}
                    <span>{label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </aside>

        {/* Conteúdo principal */}
        <main style={{
          flexGrow: 1,
          padding: 32,
          backgroundColor: '#f9f9f9',
          minHeight: '100%',
          overflowY: 'auto'
        }}>
          {children}
        </main>
      </div>

      <FooterPainel />
    </div>
  );
}