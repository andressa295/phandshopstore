'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
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
            alert('Falha ao fazer logout. Tente novamente.');
        }
        setIsDropdownOpen(false);
    };

    const dropdownItems = [
        { label: 'Minha conta', href: '/dashboard/menu/minha-conta' },
        { label: 'Pagamentos e assinaturas', href: '/dashboard/menu/pagamentos-assinaturas' },
        { label: 'Histórico de faturas', href: '/dashboard/menu/historico-faturas' },
        { label: 'Tarifas por vendas', href: '/dashboard/menu/tarifas-por-vendas' },
        { label: 'Planos', href: '/dashboard/menu/planos' },
        { label: 'Medidas de segurança', href: '/dashboard/menu/medidas-seguranca' },
        { label: 'Usuários e notificações', href: '/dashboard/menu/usuarios-notificacoes' },
        { label: 'Sessões e dispositivos', href: '/dashboard/menu/sessoes-dispositivos' },
        { label: 'Dados da minha conta', href: '/dashboard/menu/dados-conta' },
        { label: 'Redes sociais', href: '/dashboard/menu/redes-sociais' },
        { label: 'Dados do meu negócio', href: '/dashboard/menu/dados-negocio' },
        { label: 'Sair', action: handleLogout, href: '/(site)/login' },
    ];

    // Fecha dropdown ao clicar fora
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
        <header className="header-painel">
            <Link href="/dashboard" className="logo-link">
                <Image src="/logoroxo.png" alt="Phandshop Logo" width={150} height={50} priority className="logo" /> 
            </Link>

            <div className="user-menu-container" ref={dropdownRef}>
                <div className="user-avatar" onClick={() => setIsDropdownOpen(!isDropdownOpen)} title="Minha Conta">
                    {userInitials}
                </div>
                <div className="user-name" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                    {userName}
                </div>

                {isDropdownOpen && (
                    <div className="user-dropdown-menu">
                        <div className="dropdown-header">
                            <p className="user-name-text">{userName}</p>
                            <p className="user-email-text">{userEmail}</p>
                            <p className="plan-status-text">
                                Plano: {userPlanDisplay} {userRecorrenciaDisplay && `(${userRecorrenciaDisplay})`}
                            </p>
                            <p className="plan-price-text">
                                Preço: {getPlanPrice()}
                            </p>
                        </div>
                        
                        {dropdownItems.map(item => (
                            <Link 
                                key={item.label} 
                                href={item.href} 
                                onClick={item.action ? (e) => { e.preventDefault(); item.action(); setIsDropdownOpen(false); } : undefined}
                                className="dropdown-item"
                            >
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
