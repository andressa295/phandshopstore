// app/(sitetemas)/[lojaSlug]/components/CategoryListingPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
// Importe ProductCard para exibir os produtos na categoria
import ProductCard from './ProductCard'; 

// REMOVIDO: import '../styles/category-listing-page.css'; // O estilo virá do tema ativo

interface CategoryData {
    id: string;
    nome: string;
    slug: string;
    imagem_url?: string | null; // Imagem representativa da categoria
}

interface ProdutoData {
    id: string;
    nome: string;
    descricao: string | null;
    preco: number;
    estoque: number;
    imagem_url: string | null;
    categoria_id: string; // Para filtrar produtos por categoria
}

interface CategoryListingPageProps {
    lojaNome: string;
    // Em uma aplicação real, as categorias e produtos viriam de uma API
    categories: CategoryData[];
    allProducts: ProdutoData[]; // Todos os produtos da loja para filtrar por categoria
    initialCategoryId?: string; // ID da categoria selecionada inicialmente (da URL)
}

const CategoryListingPage: React.FC<CategoryListingPageProps> = ({ 
    lojaNome, 
    categories, 
    allProducts, 
    initialCategoryId 
}) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(initialCategoryId || null);
    const [filteredProducts, setFilteredProducts] = useState<ProdutoData[]>([]);

    useEffect(() => {
        if (selectedCategory) {
            setFilteredProducts(allProducts.filter(product => product.categoria_id === selectedCategory));
        } else {
            setFilteredProducts(allProducts); // Se nenhuma categoria selecionada, mostra todos
        }
    }, [selectedCategory, allProducts]);

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
        // Em uma aplicação real, você também pode atualizar a URL aqui
        // router.push(`/categorias/${categoryId}`);
    };

    const currentCategoryName = categories.find(cat => cat.id === selectedCategory)?.nome || "Todos os Produtos";

    return (
        <div className="ph-category-listing-page">
            <h1 className="ph-category-listing-title">{currentCategoryName}</h1>

            <div className="ph-category-navigation">
                {categories.map(category => (
                    <button 
                        key={category.id} 
                        onClick={() => handleCategoryClick(category.id)}
                        className={`ph-category-button ${selectedCategory === category.id ? 'ph-active' : ''}`}
                    >
                        {category.nome}
                    </button>
                ))}
                {/* Botão para ver todos os produtos */}
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`ph-category-button ${selectedCategory === null ? 'ph-active' : ''}`}
                >
                    Todos
                </button>
            </div>

            {filteredProducts.length === 0 ? (
                <p className="ph-no-products-message">Nenhum produto encontrado nesta categoria.</p>
            ) : (
                <div className="ph-products-grid">
                    {filteredProducts.map(produto => (
                        <ProductCard key={produto.id} produto={produto} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategoryListingPage;
