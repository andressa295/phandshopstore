// app/(sitetemas)/[lojaSlug]/components/OrderConfirmationPage.tsx
'use client';

import React from 'react';
import Link from 'next/link';
// Se precisar de ícones de confirmação, etc., importe do Lucide React
import { CheckCircle, Package, Truck, CreditCard } from 'lucide-react';

// REMOVIDO: import '../styles/order-confirmation-page.css'; // O estilo virá do tema ativo

interface OrderConfirmationPageProps {
    // Em uma aplicação real, estes dados viriam de uma API ou de props passadas pela rota
    orderId: string;
    orderStatus: 'pending_payment' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    orderDate: string;
    totalAmount: number;
    shippingAddress: {
        rua: string;
        numero: string;
        complemento?: string; // CORREÇÃO: Adicionada a propriedade 'complemento' como opcional
        bairro: string;
        cidade: string;
        estado: string;
        cep: string;
    };
    paymentMethod: 'credit_card' | 'pix' | 'boleto';
    items: {
        id: string;
        nome: string;
        quantidade: number;
        preco: number;
        imagem_url: string | null;
    }[];
    lojaNome: string; // Para links de volta à loja
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const getStatusText = (status: OrderConfirmationPageProps['orderStatus']) => {
    switch (status) {
        case 'pending_payment': return 'Aguardando Pagamento';
        case 'processing': return 'Processando Pedido';
        case 'shipped': return 'Pedido Enviado';
        case 'delivered': return 'Pedido Entregue';
        case 'cancelled': return 'Pedido Cancelado';
        default: return 'Status Desconhecido';
    }
};

const getPaymentMethodText = (method: OrderConfirmationPageProps['paymentMethod']) => {
    switch (method) {
        case 'credit_card': return 'Cartão de Crédito';
        case 'pix': return 'Pix';
        case 'boleto': return 'Boleto Bancário';
        default: return 'Método Desconhecido';
    }
};

const OrderConfirmationPage: React.FC<OrderConfirmationPageProps> = ({
    orderId,
    orderStatus,
    orderDate,
    totalAmount,
    shippingAddress,
    paymentMethod,
    items,
    lojaNome,
}) => {
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
                    {/* Você pode adicionar ícones aqui para cada método de pagamento */}
                    {paymentMethod === 'credit_card' && <CreditCard size={24} className="ph-payment-icon" />}
                    {paymentMethod === 'pix' && <Package size={24} className="ph-payment-icon" />} {/* Usando Package como placeholder para Pix */}
                    {paymentMethod === 'boleto' && <Truck size={24} className="ph-payment-icon" />} {/* Usando Truck como placeholder para Boleto */}
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
