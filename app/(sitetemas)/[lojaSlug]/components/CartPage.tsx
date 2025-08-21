// app/(sitetemas)/[lojaSlug]/components/CartPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Se precisar de ícones para remover item, etc., importe do Lucide React
import { Trash2, Plus, Minus } from 'lucide-react';

// REMOVIDO: import '../styles/cart-page.css'; // O estilo virá do tema ativo

// Interface para um item no carrinho
interface CartItem {
    id: string;
    produtoId: string;
    nome: string;
    preco: number;
    quantidade: number;
    imagem_url: string | null;
    // Adicione outras propriedades do item do carrinho, como variações selecionadas
    variacoesSelecionadas?: Record<string, string>;
}

interface CartPageProps {
    // Em uma aplicação real, o carrinho viria de um estado global (Context API, Zustand, Redux)
    // ou de uma API. Aqui, usaremos um mock para demonstração.
    initialCartItems?: CartItem[];
    lojaNome: string; // Para exibir o nome da loja
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const CartPage: React.FC<CartPageProps> = ({ initialCartItems = [], lojaNome }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialCartItems);
    const [subtotal, setSubtotal] = useState(0);
    const [frete, setFrete] = useState<number | null>(null); // Mock de frete

    useEffect(() => {
        const newSubtotal = cartItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
        setSubtotal(newSubtotal);
        // Lógica de cálculo de frete real aqui (API de CEP, etc.)
        setFrete(newSubtotal > 100 ? 0 : 20); // Exemplo: frete grátis acima de R$100
    }, [cartItems]);

    const handleRemoveItem = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) newQuantity = 1; // Garante que a quantidade mínima é 1
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantidade: newQuantity } : item
            )
        );
    };

    const total = subtotal + (frete !== null ? frete : 0);

    return (
        <div className="ph-cart-page">
            <h1 className="ph-cart-title">Seu Carrinho de Compras</h1>

            {cartItems.length === 0 ? (
                <div className="ph-empty-cart-message">
                    <p>Seu carrinho está vazio.</p>
                    <Link href={`/${lojaNome}`} className="ph-continue-shopping-button">
                        Continuar Comprando
                    </Link>
                </div>
            ) : (
                <div className="ph-cart-content">
                    <div className="ph-cart-items-list">
                        {cartItems.map(item => (
                            <div key={item.id} className="ph-cart-item">
                                <img 
                                    src={item.imagem_url || `https://placehold.co/100x100/E0E7FF/4338CA?text=${encodeURIComponent(item.nome)}`} 
                                    alt={item.nome} 
                                    className="ph-cart-item-image"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/100x100/CCCCCC/000000?text=Img`;
                                        e.currentTarget.onerror = null;
                                    }}
                                />
                                <div className="ph-cart-item-details">
                                    <Link href={`/produtos/${item.produtoId}`} className="ph-cart-item-name">
                                        {item.nome}
                                    </Link>
                                    {item.variacoesSelecionadas && Object.keys(item.variacoesSelecionadas).length > 0 && (
                                        <div className="ph-cart-item-variations">
                                            {Object.entries(item.variacoesSelecionadas).map(([key, value]) => (
                                                <span key={key} className="ph-cart-item-variation">{key}: {value}</span>
                                            ))}
                                        </div>
                                    )}
                                    <p className="ph-cart-item-price">{formatCurrency(item.preco)}</p>
                                </div>
                                <div className="ph-cart-item-quantity-controls">
                                    <button 
                                        onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)} 
                                        className="ph-quantity-button ph-quantity-minus"
                                        aria-label="Diminuir quantidade"
                                    >
                                        <Minus size={16} />
                                    </button>
                                    <input 
                                        type="number" 
                                        value={item.quantidade} 
                                        onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value))}
                                        className="ph-quantity-input"
                                        min="1"
                                    />
                                    <button 
                                        onClick={() => handleUpdateQuantity(item.id, item.quantidade + 1)} 
                                        className="ph-quantity-button ph-quantity-plus"
                                        aria-label="Aumentar quantidade"
                                    >
                                        <Plus size={16} />
                                    </button>
                                </div>
                                <button 
                                    onClick={() => handleRemoveItem(item.id)} 
                                    className="ph-remove-item-button"
                                    aria-label="Remover item"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="ph-cart-summary">
                        <h2 className="ph-summary-title">Resumo do Pedido</h2>
                        <div className="ph-summary-line">
                            <span>Subtotal:</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="ph-summary-line">
                            <span>Frete:</span>
                            <span>{frete !== null ? formatCurrency(frete) : 'Calculando...'}</span>
                        </div>
                        <div className="ph-summary-total">
                            <span>Total:</span>
                            <span>{formatCurrency(total)}</span>
                        </div>
                        <Link href="/checkout" className="ph-checkout-button">
                            Finalizar Compra
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;
