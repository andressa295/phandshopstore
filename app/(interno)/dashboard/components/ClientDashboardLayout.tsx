// app/(interno)/dashboard/components/ClientDashboardLayout.tsx
'use client';

import React, { ReactNode, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useUser } from '../UserContext';
import HeaderPainel from './HeaderPainel';
import FooterPainel from './FooterPainel';

import { 
    FaHome, FaChartBar, FaBoxOpen, FaUsers, FaTags, FaBullhorn, FaShoppingCart,
    FaStore, FaChevronDown, FaChevronUp, FaFacebook, FaGoogle, FaLink, FaListAlt, FaCogs, FaEnvelope, FaGlobe, FaCertificate, FaSearch, FaPhone, FaMapMarkerAlt, FaFileAlt, FaLock, FaCreditCard, FaTruck, FaMoneyBillWave, FaDollarSign, FaCode, FaRetweet, FaColumns, FaMap
} from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';
import { Poppins } from 'next/font/google';

const poppins = Poppins({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700', '800'] });

const colors = {
    primary: '#6b21a8', secondary: '#820AD1', accent: '#7C3AED', text: '#333333', lightText: '#666666', border: '#e0e0e0', background: '#f8f9fa', white: '#ffffff', success: '#28a745', danger: '#dc3545', warning: '#ffc107', info: '#17a2b8',
};

const typography = {
    fontFamily: 'Poppins, sans-serif', headingSize: '1.8rem', subHeadingSize: '1.2rem', bodySize: '0.95rem', smallSize: '0.8rem',
};

const DASHBOARD_HEADER_HEIGHT = '60px';

interface MenuItem { icon: React.ReactNode; label: string; href?: string; children?: MenuChild[]; }
interface MenuChild { label: string; href: string; icon?: React.ReactNode; }

const menuItems: MenuItem[] = [
    { icon: <FaHome />, label: 'Página inicial', href: '/dashboard' },
    { icon: <FaChartBar />, label: 'Estatísticas', href: '/dashboard/estatisticas' },
    { icon: <FaShoppingCart />, label: 'Vendas', children: [{ label: 'Lista de vendas', href: '/dashboard/vendas/lista' }, { label: 'Carrinhos abandonados', href: '/dashboard/vendas/carrinhos' }, { label: 'Pedidos manuais', href: '/dashboard/vendas/pedidos' }] },
    { icon: <FaBoxOpen />, label: 'Produtos', children: [{ label: 'Lista de produtos', href: '/dashboard/produtos/lista' }, { label: 'Categorias', href: '/dashboard/categorias' }] },
    { icon: <FaUsers />, label: 'Clientes', children: [{ label: 'Lista de clientes', href: '/dashboard/clientes/lista' }, { label: 'Mensagens', href: '/dashboard/clientes/mensagens' }] },
    { icon: <FaTags />, label: 'Descontos', children: [{ label: 'Cupons', href: '/dashboard/descontos/cupons' }, { label: 'Frete grátis', href: '/dashboard/descontos/frete-gratis' }, { label: 'Promoções', href: '/dashboard/promocoes' }] },
    { icon: <FaBullhorn />, label: 'Marketing', children: [{ label: 'Aplicativos', href: '/dashboard/marketing/aplicativos' }] },
    { icon: <FaStore />, label: 'Canais de venda', href: '/dashboard/canais' },
    { icon: <FaStore />, label: 'Loja online', children: [{ label: 'Loja Temas', href: '/dashboard/editarloja/temas' }, { label: 'Editar loja', href: '/personalizar' }, { label: 'Páginas', href: '/dashboard/paginas' }, { label: 'Menus', href: '/dashboard/loja/menus' }, { label: 'Página em construção', href: '/dashboard/construcao' }, { label: 'Informação de contato', href: '/dashboard/contato' }] },
    { icon: <FaFacebook />, label: 'Redes sociais', children: [{ label: 'Facebook / Meta', href: '/dashboard/facebook-meta' }, { label: 'Instagram Shopping', href: '/dashboard/instagram' }, { label: 'Google Shopping', href: '/dashboard/google-shopping' }] },
    { icon: <MdSettings />, label: 'Configurações', children: [{ label: 'Forma de entrega', href: '/dashboard/configuracoes/formas-entrega' }, { label: 'Meios de pagamentos', href: '/dashboard/configuracoes/meios-pagamentos' }, { label: 'E-mails', href: '/dashboard/configuracoes/emails' }, { label: 'WhatsApp', href: '/dashboard/configuracoes/whatsapp' }, { label: 'Moedas e Idiomas', href: '/dashboard/configuracoes/moedas-idiomas' }, { label: 'Opções de checkout', href: '/dashboard/configuracoes/opcoes-checkout' }, { label: 'Códigos externos', href: '/dashboard/configuracoes/codigos-externos' }, { label: 'Redirecionamentos 301', href: '/dashboard/configuracoes/redirecionamentos' }, { label: 'Domínios', href: '/dashboard/configuracoes/dominios' }] }
];


export default function ClientDashboardLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const { user, profile, loading } = useUser();

    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
        const initialOpenState: Record<string, boolean> = {};
        menuItems.forEach(item => {
            if (item.children) {
                initialOpenState[item.label] = item.children.some(subItem => pathname.startsWith(subItem.href));
            }
        });
        return initialOpenState;
    });

    const toggleMenu = (label: string) => { setOpenMenus(prev => ({ ...prev, [label]: !prev[label] })); };
    const isActiveLink = (href: string) => { if (href === '/dashboard') { return pathname === '/dashboard'; } return pathname.startsWith(href); };

    useEffect(() => {
        document.body.style.overflow = 'hidden'; 
        document.body.style.height = '100vh';
        document.body.style.width = '100vw';

        return () => {
            document.body.style.overflow = ''; 
            document.body.style.height = '';
            document.body.style.width = '';
        };
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: colors.background, fontFamily: typography.fontFamily, color: colors.text }}>
                <h1>Carregando Dashboard...</h1>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: colors.background, fontFamily: typography.fontFamily, color: colors.danger }}>
                <h1>Erro: Usuário não autenticado.</h1>
            </div>
        );
    }

    return (
        <div className={poppins.className} style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: colors.background,
            color: colors.text,
        }}>
            <HeaderPainel userProfile={profile} /> 

            <div style={{ display: 'flex', flexGrow: 1 }}>
                <aside style={{
                    width: '250px',
                    backgroundColor: colors.white,
                    boxShadow: '2px 0 5px rgba(0,0,0,0.05)',
                    flexShrink: 0,
                    overflowY: 'auto',
                    padding: '20px 0',
                    boxSizing: 'border-box',
                    height: `calc(100vh - ${DASHBOARD_HEADER_HEIGHT})`,
                    position: 'sticky',
                    top: DASHBOARD_HEADER_HEIGHT,
                }}>
                    <div style={{ padding: '0 20px', marginBottom: '30px' }}>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>Painel Administrativo</p>
                    </div>

                    <nav style={{ flexGrow: 1 }}>
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                            {menuItems.map((item, index) => (
                                <li key={item.label + index} style={{ marginBottom: '10px' }}>
                                    {item.children ? (
                                        <>
                                            <div
                                                onClick={() => toggleMenu(item.label)}
                                                style={{
                                                    display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', cursor: 'pointer', fontWeight: 'bold', color: colors.text, fontSize: typography.smallSize, userSelect: 'none', backgroundColor: openMenus[item.label] ? colors.background : 'transparent', transition: 'background-color 0.2s ease',
                                                }}
                                                aria-expanded={!!openMenus[item.label]} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(item.label); } }}
                                            >
                                                {item.icon} <span>{item.label}</span>
                                                {openMenus[item.label] ? <FaChevronUp size={12} style={{ marginLeft: 'auto' }} /> : <FaChevronDown size={12} style={{ marginLeft: 'auto' }} />}
                                            </div>
                                            {openMenus[item.label] && (
                                                <ul style={{ listStyle: 'none', padding: '0', margin: '5px 0 0 0' }}>
                                                    {item.children.map((child, childIndex) => (
                                                        <li key={child.href} style={{ marginBottom: '5px' }}>
                                                            <Link href={child.href} style={{
                                                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 20px 8px 32px', textDecoration: 'none', color: isActiveLink(child.href) ? colors.white : colors.lightText, backgroundColor: isActiveLink(child.href) ? colors.secondary : 'transparent', borderRadius: '0 20px 20px 0', fontWeight: isActiveLink(child.href) ? 'bold' : 'normal', fontSize: typography.smallSize, transition: 'all 0.2s ease',
                                                            }}
                                                            // CORREÇÃO: Usar um bloco para a lógica do mouse enter/leave
                                                            onMouseEnter={(e) => {
                                                              if (!isActiveLink(child.href)) {
                                                                e.currentTarget.style.backgroundColor = colors.background;
                                                              }
                                                            }}
                                                            onMouseLeave={(e) => {
                                                              if (!isActiveLink(child.href)) {
                                                                e.currentTarget.style.backgroundColor = 'transparent';
                                                              }
                                                            }}
                                                            >
                                                                {child.icon} {child.label}
                                                            </Link>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </>
                                    ) : (
                                        <Link href={item.href || '#'} style={{
                                            display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 20px', fontWeight: 'bold', fontSize: typography.smallSize, textDecoration: 'none', color: isActiveLink(item.href || '#') ? colors.white : colors.text, backgroundColor: isActiveLink(item.href || '#') ? colors.primary : 'transparent', borderRadius: '0 25px 25px 0', transition: 'all 0.2s ease',
                                        }}
                                        // CORREÇÃO: Usar um bloco para a lógica do mouse enter/leave
                                        onMouseEnter={(e) => {
                                          if (!isActiveLink(item.href || '#')) {
                                            e.currentTarget.style.backgroundColor = colors.background;
                                          }
                                        }}
                                        onMouseLeave={(e) => {
                                          if (!isActiveLink(item.href || '#')) {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                          }
                                        }}
                                        >
                                            {item.icon} <span>{item.label}</span>
                                        </Link>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div style={{ marginTop: 'auto', padding: '20px', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
                        <p style={{ fontSize: typography.smallSize, color: colors.lightText }}>© 2025 Phandshop</p>
                    </div>
                </aside>

                <main style={{ flexGrow: 1, overflowY: 'auto', boxSizing: 'border-box', padding: '20px', height: `calc(100vh - ${DASHBOARD_HEADER_HEIGHT})` }}>
                    {children}
                </main>
            </div>

            <FooterPainel />
        </div>
    );
}