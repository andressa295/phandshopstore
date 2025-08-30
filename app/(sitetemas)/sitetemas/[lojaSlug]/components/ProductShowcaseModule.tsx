// app/(sitetemas)/sitetemas/[lojaSlug]/components/ProductShowcaseModule.tsx
'use client';

import React from 'react';
import ProductCard from './ProductCard'; // Certifique-se de que o caminho está correto
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';

const ProductShowcaseModule: React.FC = () => {
    const { lojaData, produtos } = useTheme();

    return (
        <div className="ph-product-showcase-module">
            <h1 className="ph-page-title">Produtos da {lojaData?.nome_loja}</h1>
            <p className="ph-page-subtitle">Descubra nossos itens mais recentes e populares.</p>

            {produtos.length === 0 ? (
                <p className="ph-no-products-message">Nenhum produto encontrado nesta loja.</p>
            ) : (
                <div className="ph-products-grid">
                    {produtos.map((produto) => (
                        <ProductCard key={produto.id} produto={produto} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductShowcaseModule;