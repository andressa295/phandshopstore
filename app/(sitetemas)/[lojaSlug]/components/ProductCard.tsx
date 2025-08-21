// app/(temas)/[lojaSlug]/components/ProductCard.tsx
'use client';

import React from 'react';
import Link from 'next/link';

// REMOVIDO: import '../styles/product-card.css'; // O estilo virá do tema ativo

interface ProdutoData {
    id: string;
    nome: string;
    descricao: string | null;
    preco: number;
    estoque: number;
    imagem_url: string | null; // Adicionado: URL da imagem do produto
    // Adicione outros campos de produto conforme necessário (ex: preco_promocional, parcelamento_maximo)
}

interface ProductCardProps {
    produto: ProdutoData;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const ProductCard: React.FC<ProductCardProps> = ({ produto }) => {
    // Usa a imagem do produto se disponível, caso contrário, usa um placeholder
    const displayImageUrl = produto.imagem_url 
        ? produto.imagem_url 
        : `https://placehold.co/300x300/E0E7FF/4338CA?text=${encodeURIComponent(produto.nome)}`;

    // Lógica de exemplo para desconto e parcelamento (você pode buscar isso do DB ou ter lógica mais complexa)
    // Estes valores são mockados. Em uma aplicação real, viriam do 'produto' ou de outras configurações.
    const discountPercentage = 5; // Exemplo: 5% de desconto
    const discountedPrice = produto.preco * (1 - discountPercentage / 100);
    const installmentValue = discountedPrice / 12; // Exemplo: 12x no cartão

    return (
        <div className="ph-product-card">
            <div className="ph-product-image-wrapper"> {/* Wrapper para a imagem manter proporção */}
                <img 
                    src={displayImageUrl} 
                    alt={produto.nome} 
                    className="ph-product-image" 
                    onError={(e) => {
                        // Fallback para uma imagem genérica se a URL original falhar
                        e.currentTarget.src = `https://placehold.co/300x300/CCCCCC/000000?text=Imagem+N%C3%A3o+Dispon%C3%ADvel`;
                        e.currentTarget.onerror = null; // Evita loop de erro
                    }}
                />
            </div>
            <div className="ph-product-info-content"> {/* Wrapper para o conteúdo textual */}
                <h3 className="ph-product-name">{produto.nome}</h3>
                {/* Preço original */}
                <p className="ph-product-price-main">{formatCurrency(produto.preco)}</p> 
                {/* Preço com desconto - exibe apenas se houver desconto */}
                {discountPercentage > 0 && (
                    <p className="ph-product-discount-price">
                        {discountPercentage}% OFF: {formatCurrency(discountedPrice)}
                    </p>
                )}
                {/* Parcelamento - exibe apenas se houver parcelamento */}
                {installmentValue > 0 && (
                    <p className="ph-product-installment">
                        ou 12x de {formatCurrency(installmentValue)} sem juros
                    </p>
                )}
                {/* Estoque */}
                <p className="ph-product-stock">Estoque: {produto.estoque}</p>
            </div>
            <Link href={`/produtos/${produto.id}`} className="ph-product-button">
                Ver Detalhes
            </Link>
        </div>
    );
};

export default ProductCard;
