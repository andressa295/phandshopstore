'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProductCard from './ProductCard'; 
import { 
    CategoriesModuleData, 
    ProdutoData, 
} from '../../../../(painel)/personalizar/types';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';

interface CategoryListingPageProps {
    data?: CategoriesModuleData; // Tornando a prop 'data' opcional
}

const CategoryListingPage: React.FC<CategoryListingPageProps> = ({ data }) => {
    // Acessa os dados diretamente do contexto
    const { lojaData, produtos: allProducts } = useTheme();

    const categories = data?.categoriesToDisplay || [];
    
    const [selectedCategory, setSelectedCategory] = useState<string | null>(categories[0]?.id || null);
    const [filteredProducts, setFilteredProducts] = useState<ProdutoData[]>([]);
    
    const lojaSlug = lojaData?.slug || 'loja-padrao';

    useEffect(() => {
        if (selectedCategory) {
            setFilteredProducts(allProducts.filter(product => product.categoria_id === selectedCategory));
        } else {
            setFilteredProducts(allProducts);
        }
    }, [selectedCategory, allProducts]);

    const handleCategoryClick = (categoryId: string) => {
        setSelectedCategory(categoryId);
    };

    if (!data?.isActive || categories.length === 0) {
        return null;
    }

    return (
        <div className="ph-category-listing-page">
            <h1 className="ph-category-listing-title">{data.title || "Explore Nossas Categorias"}</h1>
            <p className="ph-category-listing-subtitle">Navegue pelas categorias e encontre seus produtos favoritos.</p>

            <div className="ph-category-navigation">
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className={`ph-category-button ${selectedCategory === null ? 'ph-active' : ''}`}
                >
                    Todos
                </button>
                {categories.map(category => (
                    <button 
                        key={category.id} 
                        onClick={() => handleCategoryClick(category.id)}
                        className={`ph-category-button ${selectedCategory === category.id ? 'ph-active' : ''}`}
                    >
                        {category.nome}
                    </button>
                ))}
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