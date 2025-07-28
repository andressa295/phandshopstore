// app\(interno)\dashboard\components\HeaderPainel.tsx

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { UserProfile } from '../UserContext'; 


import { 
    FaUserCircle, FaCreditCard, FaTags, FaHistory, FaFileInvoiceDollar, FaDollarSign, 
    FaShieldAlt, FaUsers, FaBell, FaSignOutAlt, FaShareAlt, FaBuilding 
} from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';


// DEFININDO CORES E TYPOGRAPHY
const colors = {
    primary: '#6b21a8',
    secondary: '#820AD1',
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


interface HeaderPainelProps {
  userProfile: UserProfile | null;
}


const HeaderPainel: React.FC<HeaderPainelProps> = ({ userProfile }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter();

    const userName = userProfile?.nome || 'Minha Loja';
    const userEmail = userProfile?.email || 'N/A';
    // --- CORREÇÃO: Explicitamente tipando 'char' como string ---
    const userPlanDisplay = userProfile?.plano ? 
        userProfile.plano.replace('plano_', 'Plano ').replace(/\b\w/g, (char: string) => char.toUpperCase()) :
        'Plano Grátis';
    const userRecorrenciaDisplay = userProfile?.recorrencia || '';


    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/login');
        } else {
            console.error('Erro ao fazer logout:', error);
            alert('Falha ao fazer logout. Tente novamente.');
        }
        setIsDropdownOpen(false);
    };

    const dropdownItems = [
        { label: 'Minha conta', icon: <FaUserCircle />, href: '/dashboard/menu/minha-conta' },
        { label: 'Pagamentos e assinaturas', icon: <FaCreditCard />, href: '/dashboard/menu/pagamentos-assinaturas' },
        { label: 'Histórico de faturas', icon: <FaFileInvoiceDollar />, href: '/dashboard/menu/historico-faturas' },
        { label: 'Tarifas por vendas', icon: <FaDollarSign />, href: '/dashboard/menu/tarifas-por-vendas' },
        { label: 'Planos', icon: <FaHistory />, href: '/dashboard/menu/planos' },
        { label: 'Medidas de segurança', icon: <FaShieldAlt />, href: '/dashboard/menu/medidas-seguranca' },
        { label: 'Usuários e notificações', icon: <FaUsers />, href: '/dashboard/menu/usuarios-notificacoes' },
        { label: 'Sessões e dispositivos', icon: <FaBell />, href: '/dashboard/menu/sessoes-dispositivos' },
        { label: 'Dados da minha conta', icon: <FaUserCircle />, href: '/dashboard/menu/dados-conta' },
        { label: 'Redes sociais', icon: <FaShareAlt />, href: '/dashboard/menu/redes-sociais' },
        { label: 'Dados do meu negócio', icon: <FaBuilding />, href: '/dashboard/menu/dados-negocio' },
        { label: 'Sair', icon: <FaSignOutAlt />, action: handleLogout, href: '/(site)/login' },
    ];

    return (
        <header style={{
            height: '60px',
            backgroundColor: colors.white,
            borderBottom: `1px solid ${colors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            flexShrink: 0,
            zIndex: 100,
            position: 'sticky',
            top: 0,
            width: '100%',
            boxSizing: 'border-box',
            fontFamily: typography.fontFamily,
        }}>
            <Link href="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Image src="/logoroxo.png" alt="Phandshop Logo" width={150} height={50} priority style={{ objectFit: 'contain' }} /> 
            </Link>

            <div style={{ position: 'relative' }}>
                <FaUserCircle 
                    size={28} 
                    color={colors.text}
                    style={{ cursor: 'pointer', transition: 'color 0.2s ease' }}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    onMouseEnter={(e) => e.currentTarget.style.color = colors.primary}
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
                        minWidth: '180px',
                        zIndex: 101,
                        overflow: 'auto',
                        maxHeight: '500px', // CORRIGIDO: Adicionado um limite de altura fixo

                        display: 'flex',
                        flexDirection: 'column',
                        border: `1px solid ${colors.border}`,
                    }}>
                        <div style={{ padding: '10px 15px', borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.background }}>
                            <p style={{ margin: 0, fontSize: typography.bodySize, fontWeight: 'bold', color: colors.text }}>{userName}</p>
                            <p style={{ margin: '0 0 5px 0', fontSize: typography.smallSize, color: colors.lightText }}>{userEmail}</p>
                            <p style={{ margin: 0, fontSize: typography.smallSize, color: colors.primary, fontWeight: 'bold' }}>
                                Plano: {userPlanDisplay} ({userRecorrenciaDisplay})
                            </p>
                        </div>
                        
                        {dropdownItems.map(item => (
                            <Link 
                                key={item.label} 
                                href={item.href} 
                                onClick={item.action ? (e) => { e.preventDefault(); item.action(); setIsDropdownOpen(false); } : undefined}
                                style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: '10px', 
                                    padding: '10px 15px', 
                                    textDecoration: 'none', 
                                    color: colors.text, 
                                    fontSize: typography.bodySize, 
                                    transition: 'background-color 0.2s ease',
                                    fontWeight: 'normal',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.white}
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