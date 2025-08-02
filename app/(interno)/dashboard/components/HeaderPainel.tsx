// app/(interno)/dashboard/components/HeaderPainel.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import './HeaderPainel.css';
import { UserProfile } from '../UserContext'; 

import { 
    FaUserCircle, FaCreditCard, FaTags, FaHistory, FaFileInvoiceDollar, FaDollarSign, 
    FaShieldAlt, FaUsers, FaBell, FaSignOutAlt, FaShareAlt, FaBuilding 
} from 'react-icons/fa';
import { MdSettings } from 'react-icons/md';

interface HeaderPainelProps {
    userProfile: UserProfile | null;
}

const HeaderPainel: React.FC<HeaderPainelProps> = ({ userProfile }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const supabase = createClientComponentClient();
    const router = useRouter();

    const userName = userProfile?.nome_completo || 'Minha Loja';
    const userEmail = userProfile?.email || 'N/A';
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
        <header className="header-painel">
            <Link href="/dashboard" className="logo-link">
                <Image src="/logoroxo.png" alt="Phandshop Logo" width={150} height={50} priority className="logo" /> 
            </Link>

            <div className="user-menu-container">
                <FaUserCircle 
                    size={28} 
                    className="user-icon"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    title="Minha Conta"
                />

                {isDropdownOpen && (
                    <div className="user-dropdown-menu">
                        <div className="dropdown-header">
                            <p className="user-name-text">{userName}</p>
                            <p className="user-email-text">{userEmail}</p>
                            <p className="plan-status-text">
                                Plano: {userPlanDisplay} {userRecorrenciaDisplay && `(${userRecorrenciaDisplay})`}
                            </p>
                        </div>
                        
                        {dropdownItems.map(item => (
                            <Link 
                                key={item.label} 
                                href={item.href} 
                                onClick={item.action ? (e) => { e.preventDefault(); item.action(); setIsDropdownOpen(false); } : undefined}
                                className="dropdown-item"
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