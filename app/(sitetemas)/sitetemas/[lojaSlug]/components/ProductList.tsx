'use client';

import React from 'react';
import ProductCard from '../components/ProductCard';
import { LojaData, ProdutoData } from '../../../../(painel)/personalizar/types';

interface ProductListProps {
    produtos: ProdutoData[];
    lojaSlug: string;
}

const ProductList: React.FC<ProductListProps> = ({ produtos, lojaSlug }) => {
    return (
        <div className="ph-product-list-page">
            <h1 className="ph-product-list-title">Todos os Produtos</h1>
            
            {produtos.length === 0 ? (
                <p className="ph-no-products-message">Não há produtos nesta loja.</p>
            ) : (
                <div className="ph-products-grid">
                    {produtos.map(produto => (
                        <ProductCard key={produto.id} produto={produto} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductList;