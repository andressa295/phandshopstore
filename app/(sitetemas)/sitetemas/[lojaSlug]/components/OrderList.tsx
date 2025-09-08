'use client';

import React from 'react';
import Link from 'next/link';

interface Order {
    id: string;
    status: string;
    valor_total: number;
    created_at: string;
}

interface OrderListProps {
    orders: Order[];
    lojaSlug: string;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const getStatusText = (status: string) => {
    switch (status) {
        case 'pendente': return 'Aguardando Pagamento';
        case 'em_processamento': return 'Em Processamento';
        case 'enviado': return 'Enviado';
        case 'entregue': return 'Entregue';
        case 'cancelado': return 'Cancelado';
        default: return 'Status Desconhecido';
    }
};

const OrderList: React.FC<OrderListProps> = ({ orders, lojaSlug }) => {
    return (
        <div className="ph-orders-page">
            <h1 className="ph-orders-title">Meus Pedidos</h1>
            {orders.length === 0 ? (
                <div className="ph-empty-orders-message">
                    <p>Você ainda não fez nenhum pedido.</p>
                    <Link href={`/${lojaSlug}`} className="ph-continue-shopping-button">
                        Continuar Comprando
                    </Link>
                </div>
            ) : (
                <div className="ph-orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="ph-order-card">
                            <div className="ph-order-card-header">
                                <p><strong>Pedido:</strong> #{order.id}</p>
                                <p><strong>Data:</strong> {new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="ph-order-card-body">
                                <p><strong>Total:</strong> {formatCurrency(order.valor_total)}</p>
                                <p><strong>Status:</strong> <span className={`ph-order-status ph-status-${order.status}`}>{getStatusText(order.status)}</span></p>
                            </div>
                            <div className="ph-order-card-footer">
                                <Link href={`/${lojaSlug}/minha-conta/pedidos/${order.id}`} className="ph-order-details-button">
                                    Ver Detalhes
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderList;