'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
// CORREÇÃO: Importa o CSS do dashboard da localização correta
import './HeaderPainel.css'; 
import { UserProfile } from '../UserContext';

import { 
    FaCreditCard, FaTags, FaHistory, FaFileInvoiceDollar, FaDollarSign, 
    FaShieldAlt, FaUsers, FaBell, FaSignOutAlt, FaShareAlt, FaBuilding 
} from 'react-icons/fa';

interface HeaderPainelProps {
    userProfile: UserProfile | null;
}

const HeaderPainel: React.FC<HeaderPainelProps> = ({ userProfile }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const supabase = createClientComponentClient();
    const router = useRouter();

    const userName = userProfile?.nome_completo || 'Minha Loja';
    const userEmail = userProfile?.email || 'N/A';
    const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
    const userPlanDisplay = userProfile?.plano ? 
        userProfile.plano.replace('plano_', 'Plano ').replace(/\b\w/g, (char: string) => char.toUpperCase()) :
        'Plano Grátis';
    const userRecorrenciaDisplay = userProfile?.recorrencia || '';

    const getPlanPrice = () => {
        if (userProfile?.plano === 'plano_gratis') return 'R$ 0,00';
        if (userProfile?.recorrencia === 'anual') {
            return userProfile?.preco_anual ? `R$ ${userProfile.preco_anual.toFixed(2).replace('.', ',')}` : 'N/A';
        }
        return userProfile?.preco_mensal ? `R$ ${userProfile.preco_mensal.toFixed(2).replace('.', ',')}` : 'N/A';
    };

    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            router.push('/login');
        } else {
            console.error('Erro ao fazer logout:', error);
            console.warn('Mensagem: Falha ao fazer logout. Tente novamente. (Implementar modal customizado)');
        }
        setIsDropdownOpen(false);
    };

    const dropdownItems = [
        { label: 'Minha conta', href: '/dashboard/menu/minha-conta', icon: <FaUsers /> },
        { label: 'Pagamentos e assinaturas', href: '/dashboard/menu/pagamentos-assinaturas', icon: <FaCreditCard /> },
        { label: 'Histórico de faturas', href: '/dashboard/menu/historico-faturas', icon: <FaFileInvoiceDollar /> },
        { label: 'Tarifas por vendas', href: '/dashboard/menu/tarifas-por-vendas', icon: <FaDollarSign /> },
        { label: 'Planos', href: '/dashboard/menu/planos', icon: <FaTags /> },
        { label: 'Medidas de segurança', href: '/dashboard/menu/medidas-seguranca', icon: <FaShieldAlt /> },
        { label: 'Usuários e notificações', href: '/dashboard/menu/usuarios-notificacoes', icon: <FaBell /> },
        { label: 'Sessões e dispositivos', href: '/dashboard/menu/sessoes-dispositivos', icon: <FaHistory /> },
        { label: 'Dados da minha conta', href: '/dashboard/menu/dados-conta', icon: <FaBuilding /> },
        { label: 'Redes sociais', href: '/dashboard/menu/redes-sociais', icon: <FaShareAlt /> },
        { label: 'Sair', action: handleLogout, href: '/login', icon: <FaSignOutAlt /> },
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [dropdownRef]);

    return (
        <header className="ph-header-painel">
            <Link href="/dashboard" className="ph-logo-link">
                <Image src="/logoroxo.png" alt="Phandshop Logo" width={150} height={50} priority className="ph-logo" /> 
            </Link>

            <div className="ph-user-menu-container" ref={dropdownRef}>
                <div className="ph-user-avatar" onClick={() => setIsDropdownOpen(!isDropdownOpen)} title="Minha Conta">
                    {userInitials}
                </div>
                <div className="ph-user-name" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {userName}
                </div>

                {isDropdownOpen && (
                    <div className="ph-user-dropdown-menu">
                        <div className="ph-dropdown-header">
                            <p className="ph-user-name-text">{userName}</p>
                            <p className="ph-user-email-text">{userEmail}</p>
                            <p className="ph-plan-status-text">
                                Plano: {userPlanDisplay} {userRecorrenciaDisplay && `(${userRecorrenciaDisplay})`}
                            </p>
                            <p className="ph-plan-price-text">
                                Preço: {getPlanPrice()}
                            </p>
                        </div>
                        
                        {dropdownItems.map(item => (
                            <Link 
                                key={item.label} 
                                href={item.href} 
                                onClick={item.action ? (e) => { e.preventDefault(); item.action(); setIsDropdownOpen(false); } : undefined}
                                className="ph-dropdown-item"
                            >
                                <span className="ph-dropdown-item-icon">{item.icon}</span>
                                {item.label}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
};

export default HeaderPainel;
