'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard';

interface ProdutoData {
    id: string;
    nome: string;
    preco: number;
    imagem_url: string;
    categoria_id: string;
    descricao: string | null;
    estoque: number; // CORREÇÃO: Tipo ajustado para ser apenas 'number'
}

interface ShowcaseItem {
    id: string;
    title: string;
    displayType: string;
    numberOfProducts: number;
    isActive: boolean;
}

interface ProductShowcaseModuleProps {
    isActive?: boolean;
    title?: string;
    subtitle?: string;
    showcases: ShowcaseItem[];
}

const ProductShowcaseModule: React.FC<ProductShowcaseModuleProps> = ({ isActive, title, subtitle, showcases }) => {
    if (!isActive || !showcases || showcases.length === 0) {
        return null;
    }

    const mockProducts: ProdutoData[] = [
        { id: '1', nome: 'Produto em Destaque 1', preco: 99.90, imagem_url: 'https://placehold.co/400x400/FF0000/FFFFFF?text=Prod+1', categoria_id: 'cat-1', descricao: 'Descrição do produto 1.', estoque: 10 },
        { id: '2', nome: 'Produto em Destaque 2', preco: 150.00, imagem_url: 'https://placehold.co/400x400/0000FF/FFFFFF?text=Prod+2', categoria_id: 'cat-1', descricao: 'Descrição do produto 2.', estoque: 5 },
        { id: '3', nome: 'Produto em Destaque 3', preco: 75.50, imagem_url: 'https://placehold.co/400x400/008000/FFFFFF?text=Prod+3', categoria_id: 'cat-2', descricao: 'Descrição do produto 3.', estoque: 20 },
        { id: '4', nome: 'Produto em Destaque 4', preco: 200.00, imagem_url: 'https://placehold.co/400x400/FFFF00/000000?text=Prod+4', categoria_id: 'cat-3', descricao: 'Descrição do produto 4.', estoque: 12 },
    ];

    return (
        <section className="ph-product-showcase">
            <div className="ph-loja-container">
                {title && <h2 className="ph-showcase-title">{title}</h2>}
                {subtitle && <p className="ph-showcase-subtitle">{subtitle}</p>}
                
                <div className="ph-product-grid">
                    {mockProducts.map((product) => (
                        <ProductCard key={product.id} produto={product} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductShowcaseModule;