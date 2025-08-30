'use client';

import React from 'react';
import Link from 'next/link';
import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { LojaData } from '../../../../(painel)/personalizar/types';

// O componente agora não precisa de props diretas, ele vai buscar do contexto
interface OrderConfirmationPageProps {
  // O componente agora não precisa mais de props diretas.
}

// Interfaces de dados para um pedido de exemplo (mock)
interface OrderItem {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  imagem_url: string | null;
}

interface ShippingAddress {
  rua: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const getStatusText = (status: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
  switch (status) {
    case 'pending_payment': return 'Aguardando Pagamento';
    case 'processing': return 'Processando Pedido';
    case 'shipped': return 'Pedido Enviado';
    case 'delivered': return 'Pedido Entregue';
    case 'cancelled': return 'Pedido Cancelado';
    default: return 'Status Desconhecido';
  }
};

const getPaymentMethodText = (method: 'credit_card' | 'pix' | 'boleto') => {
  switch (method) {
    case 'credit_card': return 'Cartão de Crédito';
    case 'pix': return 'Pix';
    case 'boleto': return 'Boleto Bancário';
    default: return 'Método Desconhecido';
  }
};

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = () => {
  const { config } = useTheme();

  // Mock de dados do pedido para demonstração
  const orderData = {
    orderId: 'ORD-123456',
    orderStatus: 'processing' as const,
    orderDate: new Date().toISOString(),
    totalAmount: 299.80,
    shippingAddress: {
      rua: 'Rua Principal',
      numero: '100',
      bairro: 'Centro',
      cidade: 'Cidade Exemplo',
      estado: 'EX',
      cep: '00000-000',
    } as ShippingAddress,
    paymentMethod: 'credit_card' as const,
    items: [
      { id: '1', nome: 'Item A', quantidade: 1, preco: 150.00, imagem_url: 'https://placehold.co/80x80?text=ItemA' },
      { id: '2', nome: 'Item B', quantidade: 2, preco: 74.90, imagem_url: 'https://placehold.co/80x80?text=ItemB' },
    ] as OrderItem[],
    lojaNome: config.headerTitle || 'Sua Loja',
  };

  const {
    orderId,
    orderStatus,
    orderDate,
    totalAmount,
    shippingAddress,
    paymentMethod,
    items,
    lojaNome,
  } = orderData;
  
  return (
    <div className="ph-order-confirmation-page">
      <div className="ph-confirmation-header">
        <CheckCircle size={60} className="ph-confirmation-icon" />
        <h1 className="ph-confirmation-title">Pedido Confirmado!</h1>
        <p className="ph-confirmation-subtitle">Obrigado por sua compra em {lojaNome}!</p>
      </div>

      <div className="ph-order-details-summary">
        <div className="ph-detail-block">
          <h2 className="ph-block-title">Detalhes do Pedido</h2>
          <p><strong>Número do Pedido:</strong> {orderId}</p>
          <p><strong>Data do Pedido:</strong> {new Date(orderDate).toLocaleDateString('pt-BR')}</p>
          <p><strong>Status:</strong> <span className={`ph-status-${orderStatus}`}>{getStatusText(orderStatus)}</span></p>
          <p><strong>Total:</strong> {formatCurrency(totalAmount)}</p>
        </div>

        <div className="ph-detail-block">
          <h2 className="ph-block-title">Endereço de Entrega</h2>
          <p>{shippingAddress.rua}, {shippingAddress.numero} {shippingAddress.complemento}</p>
          <p>{shippingAddress.bairro}, {shippingAddress.cidade} - {shippingAddress.estado}</p>
          <p>CEP: {shippingAddress.cep}</p>
        </div>

        <div className="ph-detail-block">
          <h2 className="ph-block-title">Método de Pagamento</h2>
          <p>{getPaymentMethodText(paymentMethod)}</p>
          paymentMethod  'credit_card' && <CreditCard size={24} className="ph-payment-icon" />
          paymentMethod  'pix' && <Package size={24} className="ph-payment-icon" />
          paymentMethod 'boleto' && <Truck size={24} className="ph-payment-icon" />
        </div>
      </div>

      <div className="ph-order-items-list">
        <h2 className="ph-block-title">Itens do Pedido</h2>
        {items.map(item => (
          <div key={item.id} className="ph-order-item">
            <img 
              src={item.imagem_url || `https://placehold.co/80x80/E0E7FF/4338CA?text=${encodeURIComponent(item.nome)}`} 
              alt={item.nome} 
              className="ph-order-item-image"
              onError={(e) => {
                  e.currentTarget.src = `https://placehold.co/80x80/CCCCCC/000000?text=Img`;
                  e.currentTarget.onerror = null;
              }}
            />
            <div className="ph-order-item-details">
              <p className="ph-order-item-name">{item.nome}</p>
              <p className="ph-order-item-quantity">Quantidade: {item.quantidade}</p>
              <p className="ph-order-item-price">{formatCurrency(item.preco)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="ph-confirmation-actions">
        <Link href={`/${lojaNome}/meus-pedidos`} className="ph-view-orders-button">
          Ver Meus Pedidos
        </Link>
        <Link href={`/${lojaNome}`} className="ph-continue-shopping-button">
          Continuar Comprando
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
