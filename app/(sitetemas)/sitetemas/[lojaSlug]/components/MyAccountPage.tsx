'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Se precisar de ícones para métodos de pagamento, etc., importe do Lucide React
import { User, ShoppingBag, MapPin, CreditCard, LogOut } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { LojaData } from '../../../../(painel)/personalizar/types';

// O componente agora não precisa de props diretas, ele vai buscar do contexto
interface MyAccountPageProps {
  // O componente agora não precisa mais de props diretas.
}

const MyAccountPage: React.FC<MyAccountPageProps> = () => {
  const { config } = useTheme();

  // Mock de dados para simular uma conta real, já que não temos o banco de dados de usuários
  const [userName, setUserName] = useState('Cliente Exemplo');
  const [userEmail, setUserEmail] = useState('cliente@exemplo.com');
  const [totalOrders, setTotalOrders] = useState(5);

  const handleLogout = () => {
    console.log('Usuário deslogado.');
    // Implementar lógica de logout real (Supabase auth.signOut())
    // Redirecionar para a página de login
    window.location.href = '/login';
  };

  const lojaNome = config.headerTitle || 'Sua Loja';

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
