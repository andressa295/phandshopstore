'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { CartConfig } from '../../../../(painel)/personalizar/types';

// Interfaces para os dados de exemplo
interface CartItem {
    id: string;
    produtoId: string;
    nome: string;
    preco: number;
    quantidade: number;
    imagem_url: string | null;
    variacoesSelecionadas?: Record<string, string>;
}

interface Address {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
}

interface ShippingOption {
    id: string;
    nome: string;
    prazo: string;
    custo: number;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const CheckoutPage: React.FC = () => {
    // CORRIGIDO: Obtém a configuração do tema via contexto
    const { config } = useTheme();
    const cartConfig: CartConfig = config.cart || {};

    const [cartItems, setCartItems] = useState<CartItem[]>([
      { id: '1', produtoId: 'prod1', nome: 'Produto Exemplo 1', preco: 50.00, quantidade: 2, imagem_url: 'https://placehold.co/100x100/E0E7FF/4338CA?text=Prod1' },
      { id: '2', produtoId: 'prod2', nome: 'Produto Exemplo 2', preco: 120.00, quantidade: 1, imagem_url: 'https://placehold.co/100x100/E0E7FF/4338CA?text=Prod2' },
    ]);

    const [address, setAddress] = useState<Address>({
        cep: '', rua: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '',
    });
    const [selectedShipping, setSelectedShipping] = useState<string | null>(null);
    const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix' | 'boleto'>('credit_card');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const subtotal = cartItems.reduce((acc, item) => acc + item.preco * item.quantidade, 0);

    const shippingOptions: ShippingOption[] = [
        { id: 'normal', nome: 'Entrega Normal', prazo: '5-7 dias úteis', custo: 25.00 },
        { id: 'express', nome: 'Entrega Expressa', prazo: '1-3 dias úteis', custo: 45.00 },
    ];

    const currentShippingCost = selectedShipping
        ? shippingOptions.find(opt => opt.id === selectedShipping)?.custo || 0
        : 0;

    const total = subtotal + currentShippingCost;
    
    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
    };

    const handlePlaceOrder = async () => {
        setError('');
        setLoading(true);

        if (!address.rua || !address.numero || !address.cidade || !address.estado || !selectedShipping || !paymentMethod) {
            setError('Por favor, preencha todos os campos obrigatórios e selecione as opções de frete e pagamento.');
            setLoading(false);
            return;
        }

        try {
            console.log('Processando pedido...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            // CORRIGIDO: Usar useRouter para navegação em uma aplicação real
            // router.push('/confirmacao-pedido');
            window.location.href = '/confirmacao-pedido';
        } catch (err) {
            console.error('Erro ao finalizar compra:', err);
            setError('Ocorreu um erro ao finalizar sua compra. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="ph-checkout-page">
            <h1 className="ph-checkout-title">Finalizar Compra</h1>

            <div className="ph-checkout-steps">
                {/* Etapa 1: Endereço de Entrega */}
                <div className="ph-checkout-section">
                    <h2 className="ph-section-title">1. Endereço de Entrega</h2>
                    <div className="ph-form-group">
                        <label htmlFor="cep" className="ph-label">CEP:</label>
                        <input type="text" id="cep" name="cep" value={address.cep} onChange={handleAddressChange} className="ph-input" placeholder="00000-000" />
                    </div>
                    <div className="ph-form-group">
                        <label htmlFor="rua" className="ph-label">Rua:</label>
                        <input type="text" id="rua" name="rua" value={address.rua} onChange={handleAddressChange} className="ph-input" placeholder="Nome da Rua" />
                    </div>
                    <div className="ph-form-group ph-form-group-inline">
                        <div className="ph-form-group-half">
                            <label htmlFor="numero" className="ph-label">Número:</label>
                            <input type="text" id="numero" name="numero" value={address.numero} onChange={handleAddressChange} className="ph-input" placeholder="123" />
                        </div>
                        <div className="ph-form-group-half">
                            <label htmlFor="complemento" className="ph-label">Complemento (opcional):</label>
                            <input type="text" id="complemento" name="complemento" value={address.complemento} onChange={handleAddressChange} className="ph-input" placeholder="Apto, Bloco" />
                        </div>
                    </div>
                    <div className="ph-form-group">
                        <label htmlFor="bairro" className="ph-label">Bairro:</label>
                        <input type="text" id="bairro" name="bairro" value={address.bairro} onChange={handleAddressChange} className="ph-input" placeholder="Seu Bairro" />
                    </div>
                    <div className="ph-form-group ph-form-group-inline">
                        <div className="ph-form-group-half">
                            <label htmlFor="cidade" className="ph-label">Cidade:</label>
                            <input type="text" id="cidade" name="cidade" value={address.cidade} onChange={handleAddressChange} className="ph-input" placeholder="Sua Cidade" />
                        </div>
                        <div className="ph-form-group-half">
                            <label htmlFor="estado" className="ph-label">Estado:</label>
                            <input type="text" id="estado" name="estado" value={address.estado} onChange={handleAddressChange} className="ph-input" placeholder="UF" maxLength={2} />
                        </div>
                    </div>
                </div>

                {/* Etapa 2: Opções de Frete */}
                {cartConfig.showShippingEstimator && ( // CORRIGIDO: Usa a config do tema
                    <div className="ph-checkout-section">
                        <h2 className="ph-section-title">2. Opções de Frete</h2>
                        <div className="ph-shipping-options">
                            {shippingOptions.map(option => (
                                <label key={option.id} className="ph-shipping-option-label">
                                    <input
                                        type="radio"
                                        name="shipping"
                                        value={option.id}
                                        checked={selectedShipping === option.id}
                                        onChange={() => setSelectedShipping(option.id)}
                                        className="ph-radio-input"
                                    />
                                    <span className="ph-radio-custom"></span>
                                    <div className="ph-shipping-details">
                                        <span className="ph-shipping-name">{option.nome}</span>
                                        <span className="ph-shipping-prazo">{option.prazo}</span>
                                        <span className="ph-shipping-cost">{formatCurrency(option.custo)}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Etapa 3: Opções de Pagamento */}
                <div className="ph-checkout-section">
                    <h2 className="ph-section-title">3. Opções de Pagamento</h2>
                    <div className="ph-payment-options">
                        <label className="ph-payment-option-label">
                            <input type="radio" name="payment" value="credit_card" checked={paymentMethod === 'credit_card'} onChange={() => setPaymentMethod('credit_card')} className="ph-radio-input" />
                            <span className="ph-radio-custom"></span>
                            Cartão de Crédito
                        </label>
                        {cartConfig.showCouponField && ( // CORRIGIDO: Usa a config do tema
                            <label className="ph-payment-option-label">
                                <input type="radio" name="payment" value="pix" checked={paymentMethod === 'pix'} onChange={() => setPaymentMethod('pix')} className="ph-radio-input" />
                                <span className="ph-radio-custom"></span>
                                Pix
                            </label>
                        )}
                        <label className="ph-payment-option-label">
                            <input type="radio" name="payment" value="boleto" checked={paymentMethod === 'boleto'} onChange={() => setPaymentMethod('boleto')} className="ph-radio-input" />
                            <span className="ph-radio-custom"></span>
                            Boleto Bancário
                        </label>
                        {paymentMethod === 'credit_card' && (
                            <div className="ph-credit-card-fields">
                                <p className="ph-payment-placeholder">Campos do cartão de crédito aqui...</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="ph-order-summary-checkout">
                <h2 className="ph-summary-title">Resumo do Pedido</h2>
                <div className="ph-summary-line">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                </div>
                {cartConfig.showShippingEstimator && ( // CORRIGIDO: Usa a config do tema
                    <div className="ph-summary-line">
                        <span>Frete:</span>
                        <span>{currentShippingCost !== 0 ? formatCurrency(currentShippingCost) : 'Grátis'}</span>
                    </div>
                )}
                <div className="ph-summary-total">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                </div>

                {error && <p className="ph-error-message">{error}</p>}

                <button onClick={handlePlaceOrder} className="ph-place-order-button" disabled={loading}>
                    {loading ? 'Processando...' : cartConfig.checkoutButtonText ?? 'Finalizar Pedido'}
                </button>
            </div>
        </div>
    );
};

export default CheckoutPage;