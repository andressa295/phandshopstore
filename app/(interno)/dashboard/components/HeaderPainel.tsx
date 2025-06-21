// app\(interno)\dashboard\components\HeaderPainel.tsx (CORRIGIDO: CAMINHO DA LOGO)
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Para a logo
import { 
    FaUserCircle, FaCreditCard, FaTags, FaHistory, FaFileInvoiceDollar, FaDollarSign, 
    FaShieldAlt, FaUsers, FaBell, FaSignOutAlt, FaShareAlt, FaBuilding // Importar todos os ícones necessários
} from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';


// Definindo cores e tipografia (copiadas para autossuficiência do componente)
const colors = {
    primary: '#6b21a8',
    secondary: '#a21caf',
    accent: '#7C3AED',
    text: '#333333',
    lightText: '#666666',
    border: '#e0e0e0',
    background: '#f8f9fa',
    white: '#ffffff',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
};

const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
    bodySize: '0.95rem',
    smallSize: '0.8rem',
};


const HeaderPainel: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Itens do dropdown de perfil do usuário
    const dropdownItems = [
        { label: 'Minha conta', icon: <FaUserCircle />, href: '/dashboard/minha-conta' },
        { label: 'Pagamentos e assinaturas', icon: <FaCreditCard />, href: '/dashboard/pagamentos-assinaturas' },
        { label: 'Histórico de faturas', icon: <FaFileInvoiceDollar />, href: '/dashboard/historico-faturas' },
        { label: 'Tarifas por vendas', icon: <FaDollarSign />, href: '/dashboard/tarifas-vendas' },
        { label: 'Planos', icon: <FaHistory />, href: '/dashboard/planos' },
        { label: 'Medidas de segurança', icon: <FaShieldAlt />, href: '/dashboard/medidas-seguranca' },
        { label: 'Usuários e notificações', icon: <FaUsers />, href: '/dashboard/usuarios-notificacoes' },
        { label: 'Sessões e dispositivos', icon: <FaBell />, href: '/dashboard/sessoes-dispositivos' },
        { label: 'Dados da minha conta', icon: <FaUserCircle />, href: '/dashboard/dados-conta' },
        { label: 'Redes sociais', icon: <FaShareAlt />, href: '/dashboard/redes-sociais' },
        { label: 'Dados do meu negócio', icon: <FaBuilding />, href: '/dashboard/dados-negocio' },
        { label: 'Sair', icon: <FaSignOutAlt />, href: '/logout' },
    ];

    return (
        <header style={{
            height: '60px',
            backgroundColor: colors.white, // Fundo branco
            borderBottom: `1px solid ${colors.border}`, // Borda sutil
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)', // Sombra discreta
            flexShrink: 0,
            zIndex: 100,
            position: 'sticky',
            top: 0,
            width: '100%',
            boxSizing: 'border-box',
        }}>
            {/* Logo da Phandshop no Painel */}
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* CORREÇÃO: Usando caminho para imagem na pasta public */}
                <Image src="/logoroxo.png" alt="Phandshop Logo" width={150} height={50} priority style={{ objectFit: 'contain' }} /> 
            </Link>

            {/* Ícone de Usuário e Dropdown */}
            <div style={{ position: 'relative' }}>
                <FaUserCircle 
                    size={28} 
                    color={colors.text} // Cor do ícone
                    style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.primary} // Hover na cor primária
                    onMouseLeave={(e) => e.currentTarget.style.color = colors.text}
                    title="Minha Conta"
                />

                {isDropdownOpen && (
                    <div style={{
                        position: 'absolute',
                        top: '40px',
                        right: 0,
                        backgroundColor: colors.white,
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        minWidth: '220px',
                        zIndex: 101,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${colors.border}`,
                    }}>
                        <div style={{ padding: '10px 15px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.background }}>
                            <p style={{ margin: 0, fontSize: typography.smallSize, fontWeight: 'bold', color: colors.text }}>MK ALIANÇAS & JOIAS</p>
                            <p style={{ margin: 0, fontSize: typography.smallSize, color: colors.lightText }}>mk_aliancas@email.com</p>
                        </div>
                        {dropdownItems.map(item => (
                            <Link 
                                key={item.label} 
                                href={item.href} 
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px', 
                                    padding: '10px 15px', 
                                    textDecoration: 'none', 
                                    color: colors.text, 
                                    fontSize: typography.smallSize, 
                                    transition: 'background-color 0.2s ease',
                                    fontWeight: 'normal',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.white}
                                onClick={() => setIsDropdownOpen(false)}
                            >
                                {item.icon} {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};

export default HeaderPainel;