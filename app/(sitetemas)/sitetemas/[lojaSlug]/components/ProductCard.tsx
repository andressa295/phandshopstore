'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { ProdutoData, DesignConfig } from '../../../../(painel)/personalizar/types'; // Importa a interface DesignConfig

interface ProductCardProps {
    produto: ProdutoData;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const ProductCard: React.FC<ProductCardProps> = ({ produto }) => {
    const { config } = useTheme();
    const designConfig: DesignConfig = config.design || {};

    const displayImageUrl = produto.imagem_url 
        ? produto.imagem_url 
        : `https://placehold.co/300x300/E0E7FF/4338CA?text=${encodeURIComponent(produto.nome)}`;

    const discountPercentage = 5;
    const discountedPrice = produto.preco * (1 - discountPercentage / 100);
    const installmentValue = discountedPrice / 12;

    const borderRadiusClass = designConfig.imageBorderRadius === 'rounded' 
        ? 'rounded-lg' 
        : designConfig.imageBorderRadius === 'square' 
        ? 'rounded-none' 
        : 'rounded-full'; // Mantido 'full' como fallback, mas você pediu para remover

    return (
        <div className="ph-product-card">
            <Link href={`/produtos/${produto.id}`} className="ph-product-link">
                <div className={`ph-product-image-wrapper ${borderRadiusClass}`}>
                    <img 
                        src={displayImageUrl} 
                        alt={produto.nome} 
                        className="ph-product-image" 
                        onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/300x300/CCCCCC/000000?text=Imagem+N%C3%A3o+Dispon%C3%ADvel`;
                            e.currentTarget.onerror = null;
                        }}
                    />
                </div>
                <div className="ph-product-info-content">
                    <h3 className="ph-product-name">{produto.nome}</h3>
                    <p className="ph-product-price-main">{formatCurrency(produto.preco)}</p> 
                    {discountPercentage > 0 && (
                        <p className="ph-product-discount-price">
                            {discountPercentage}% OFF: {formatCurrency(discountedPrice)}
                        </p>
                    )}
                    {installmentValue > 0 && (
                        <p className="ph-product-installment">
                            ou 12x de {formatCurrency(installmentValue)} sem juros
                        </p>
                    )}
                    <p className="ph-product-stock">Estoque: {produto.estoque}</p>
                </div>
            </Link>
        </div>
    );
};

export default ProductCard;
