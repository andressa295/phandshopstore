// app/(sitetemas)/[lojaSlug]/components/MyAccountPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Importe ícones do Lucide React para as opções do menu
import { User, ShoppingBag, MapPin, CreditCard, LogOut } from 'lucide-react';

// REMOVIDO: import '../styles/my-account-page.css'; // O estilo virá do tema ativo

interface MyAccountPageProps {
    lojaNome: string;
    // Em uma aplicação real, estes dados viriam de uma API ou de props passadas pela rota
    userName: string;
    userEmail: string;
    // Você pode adicionar um mock de contagem de pedidos para exibição
    totalOrders?: number;
}

const MyAccountPage: React.FC<MyAccountPageProps> = ({ lojaNome, userName, userEmail, totalOrders = 0 }) => {
    // Lógica para logout (placeholder)
    const handleLogout = () => {
        console.log('Usuário deslogado.');
        // Implementar lógica de logout real (Supabase auth.signOut())
        // Redirecionar para a página de login
        window.location.href = '/login'; 
    };

    return (
        <div className="ph-my-account-page">
            <h1 className="ph-my-account-title">Minha Conta</h1>
            <p className="ph-welcome-message">Bem-vindo(a), {userName}!</p>

            <div className="ph-account-summary">
                <div className="ph-summary-card">
                    <User size={32} className="ph-summary-icon" />
                    <h2 className="ph-summary-card-title">Dados Pessoais</h2>
                    <p className="ph-summary-card-text">Email: {userEmail}</p>
                    <Link href={`/${lojaNome}/minha-conta/perfil`} className="ph-summary-card-link">
                        Editar Perfil
                    </Link>
                </div>

                <div className="ph-summary-card">
                    <ShoppingBag size={32} className="ph-summary-icon" />
                    <h2 className="ph-summary-card-title">Meus Pedidos</h2>
                    <p className="ph-summary-card-text">{totalOrders} pedidos realizados</p>
                    <Link href={`/${lojaNome}/minha-conta/pedidos`} className="ph-summary-card-link">
                        Ver Todos
                    </Link>
                </div>

                <div className="ph-summary-card">
                    <MapPin size={32} className="ph-summary-icon" />
                    <h2 className="ph-summary-card-title">Meus Endereços</h2>
                    <p className="ph-summary-card-text">Gerencie seus endereços de entrega.</p>
                    <Link href={`/${lojaNome}/minha-conta/enderecos`} className="ph-summary-card-link">
                        Gerenciar Endereços
                    </Link>
                </div>

                <div className="ph-summary-card">
                    <CreditCard size={32} className="ph-summary-icon" />
                    <h2 className="ph-summary-card-title">Meios de Pagamento</h2>
                    <p className="ph-summary-card-text">Gerencie seus cartões salvos.</p>
                    <Link href={`/${lojaNome}/minha-conta/pagamentos`} className="ph-summary-card-link">
                        Gerenciar Pagamentos
                    </Link>
                </div>
            </div>

            <button onClick={handleLogout} className="ph-logout-button">
                <LogOut size={20} /> Sair da Conta
            </button>
        </div>
    );
};

export default MyAccountPage;
