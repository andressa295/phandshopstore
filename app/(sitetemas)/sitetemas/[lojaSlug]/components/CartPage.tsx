'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, Package, Tag } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { CartConfig, ProdutoData } from '../../../../(painel)/personalizar/types';
import ProductCard from './ProductCard';

interface CartItem {
    id: string;
    produtoId: string;
    nome: string;
    preco: number;
    quantidade: number;
    imagem_url: string | null;
    variacoesSelecionadas?: Record<string, string>;
}

interface CartPageProps {
    lojaNome: string;
    crossSellProducts?: ProdutoData[]; // Tornando opcional
    compreJuntoProduct?: ProdutoData | null; // Tornando opcional
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const CartPage: React.FC<CartPageProps> = ({ lojaNome, crossSellProducts, compreJuntoProduct }) => {
    const { config } = useTheme();
    const cartConfig: CartConfig = config.cart || {};

    // Mock de dados do carrinho
    const [cartItems, setCartItems] = useState<CartItem[]>([
        { id: '1', produtoId: 'prod-1', nome: 'Camiseta Básica', preco: 49.90, quantidade: 1, imagem_url: 'https://placehold.co/100x100?text=Camiseta' },
        { id: '2', produtoId: 'prod-2', nome: 'Calça Jeans', preco: 129.90, quantidade: 1, imagem_url: 'https://placehold.co/100x100?text=Calça' },
    ]);

    const [subtotal, setSubtotal] = useState(0);
    const [frete, setFrete] = useState<number | null>(null);

    useEffect(() => {
        const newSubtotal = cartItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
        setSubtotal(newSubtotal);
        setFrete(newSubtotal > 100 ? 0 : 20);
    }, [cartItems]);

    const total = subtotal + (frete !== null ? frete : 0);

    const handleRemoveItem = (id: string) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    };

    const handleUpdateQuantity = (id: string, newQuantity: number) => {
        if (newQuantity < 1) newQuantity = 1;
        setCartItems(prevItems =>
            prevItems.map(item =>
                item.id === id ? { ...item, quantidade: newQuantity } : item
            )
        );
    };

    const handleAddCompreJunto = () => {
        if (!compreJuntoProduct) return;
        const itemExistente = cartItems.find(item => item.produtoId === compreJuntoProduct.id);
        if (!itemExistente) {
            setCartItems(prev => [...prev, {
                id: compreJuntoProduct.id,
                produtoId: compreJuntoProduct.id,
                nome: compreJuntoProduct.nome,
                preco: compreJuntoProduct.preco,
                quantidade: 1,
                imagem_url: compreJuntoProduct.imagem_url,
            }]);
        }
    };

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
                <div className="ph-cart-content-wrapper">
                    <div className="ph-cart-main-content">
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
                                        <p className="ph-cart-item-price">{formatCurrency(item.preco)}</p>
                                    </div>
                                    <div className="ph-cart-item-quantity-controls">
                                        <button 
                                            onClick={() => handleUpdateQuantity(item.id, item.quantidade - 1)} 
                                            className="ph-quantity-button ph-quantity-minus"
                                        > <Minus size={16} /> </button>
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
                                        > <Plus size={16} /> </button>
                                    </div>
                                    <button 
                                        onClick={() => handleRemoveItem(item.id)} 
                                        className="ph-remove-item-button"
                                    > <Trash2 size={20} /> </button>
                                </div>
                            ))}
                        </div>
                        
                        {/* Seção de "Compre Junto" */}
                        {compreJuntoProduct && (
                            <div className="ph-compre-junto-section">
                                <h2 className="ph-section-title">
                                    <Tag size={20} className="ph-section-icon" /> Compre Junto
                                </h2>
                                <div className="ph-compre-junto-card">
                                    <div className="ph-compre-junto-group">
                                        {cartItems.length > 0 && (
                                            <div className="ph-compre-junto-item">
                                                <img src={cartItems[0].imagem_url || ''} alt={cartItems[0].nome} className="ph-compre-junto-image"/>
                                                <span>{cartItems[0].nome}</span>
                                            </div>
                                        )}
                                        <span className="ph-compre-junto-plus">+</span>
                                        <div className="ph-compre-junto-item">
                                            <img src={compreJuntoProduct.imagem_url || ''} alt={compreJuntoProduct.nome} className="ph-compre-junto-image"/>
                                            <span>{compreJuntoProduct.nome}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={handleAddCompreJunto}
                                        className="ph-add-compre-junto-button"
                                    >
                                        Adicionar e Economizar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Seção de Cross-sell */}
                        {(crossSellProducts && crossSellProducts.length > 0) && (
                            <div className="ph-cross-sell-section">
                                <h2 className="ph-section-title">
                                    <Package size={20} className="ph-section-icon" /> Pessoas que compraram isso também levaram:
                                </h2>
                                <div className="ph-cross-sell-grid">
                                    {crossSellProducts.map(product => (
                                        <ProductCard key={product.id} produto={product} />
                                    ))}
                                </div>
                            </div>
                        )}
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
                        <Link href={`/${lojaNome}/checkout`} className="ph-checkout-button">
                            {cartConfig.checkoutButtonText ?? 'Finalizar Compra'}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CartPage;