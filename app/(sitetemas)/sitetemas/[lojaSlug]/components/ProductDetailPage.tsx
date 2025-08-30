'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, Share2 } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { 
  ProdutoData, 
  ProductDetailConfig,
  SingleProductShowcaseData,
} from '../../../../(painel)/personalizar/types';

// Interfaces de dados para um produto de exemplo (mock)
interface VariacaoProduto {
  tipo: string;
  opcoes: string[];
}

interface ProdutoComVariacoes extends ProdutoData {
  imagens_galeria?: string[];
  variacoes?: VariacaoProduto[];
}


interface ProductDetailPageProps {
    // Em uma aplicação real, você receberia apenas o 'id' do produto
    // e buscaria os dados do produto dentro do componente.
    // Para manter a coerência com o seu código anterior, vamos simular isso.
    produto: ProdutoComVariacoes; // Usando a nova interface
    lojaNome: string;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ produto, lojaNome }) => {
    const { config } = useTheme();
    const productDetailConfig: ProductDetailConfig = config.productDetail || {};

    const [selectedQuantity, setSelectedQuantity] = useState(1);
    const [selectedVariation, setSelectedVariation] = useState<Record<string, string>>({});

    const discountPercentage = 5; 
    const discountedPrice = produto.preco * (1 - discountPercentage / 100);
    const installmentValue = discountedPrice / 12;

    const mainImageUrl = produto.imagem_url 
        ? produto.imagem_url 
        : `https://placehold.co/600x600/E0E7FF/4338CA?text=${encodeURIComponent(produto.nome)}`;

    const handleAddToCart = () => {
        console.log(`Adicionar ${selectedQuantity} de ${produto.nome} ao carrinho.`);
    };

    return (
        <div className="ph-product-detail-page">
            <div className="ph-product-detail-container">
                <div className="ph-product-detail-gallery">
                    <img 
                        src={mainImageUrl} 
                        alt={produto.nome} 
                        className="ph-product-detail-main-image" 
                        onError={(e) => {
                            e.currentTarget.src = `https://placehold.co/600x600/CCCCCC/000000?text=Imagem+N%C3%A3o+Dispon%C3%ADvel`;
                            e.currentTarget.onerror = null;
                        }}
                    />
                    {/* CORREÇÃO: Usando galleryLayout do config */}
                    {productDetailConfig.galleryLayout === 'grid' && produto.imagens_galeria && produto.imagens_galeria.length > 0 && (
                        <div className="ph-product-detail-thumbnails">
                            {produto.imagens_galeria.map((imgUrl, index) => (
                                <img 
                                    key={index} 
                                    src={imgUrl} 
                                    alt={`${produto.nome} - ${index + 1}`} 
                                    className="ph-product-detail-thumbnail"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://placehold.co/100x100/CCCCCC/000000?text=Img`;
                                        e.currentTarget.onerror = null;
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <div className="ph-product-detail-info">
                    <h1 className="ph-product-detail-name">{produto.nome}</h1>
                    {productDetailConfig.showProductDescription && produto.descricao && (
                        <p className="ph-product-detail-description">{produto.descricao}</p>
                    )}
                    
                    {productDetailConfig.showPrice && (
                        <>
                            <p className="ph-product-detail-price-main">{formatCurrency(produto.preco)}</p>
                            {/* Lógica para desconto e parcelamento, baseada em suas regras de negócio */}
                            {discountPercentage > 0 && (
                                <p className="ph-product-detail-discount-price">
                                    {discountPercentage}% OFF: {formatCurrency(discountedPrice)}
                                </p>
                            )}
                            {installmentValue > 0 && (
                                <p className="ph-product-detail-installment">
                                    ou 12x de {formatCurrency(installmentValue)} sem juros
                                </p>
                            )}
                        </>
                    )}

                    {/* Variações do produto */}
                    {productDetailConfig.showVariations && produto.variacoes && produto.variacoes.map(variation => (
                        <div key={variation.tipo} className="ph-product-detail-variation-group">
                            <label className="ph-product-detail-variation-label">{variation.tipo}:</label>
                            <select 
                                className="ph-product-detail-variation-select"
                                onChange={(e) => setSelectedVariation(prev => ({ ...prev, [variation.tipo]: e.target.value }))}
                            >
                                <option value="">Selecione {variation.tipo}</option>
                                {variation.opcoes.map(opcao => (
                                    <option key={opcao} value={opcao}>{opcao}</option>
                                ))}
                            </select>
                        </div>
                    ))}

                    {productDetailConfig.enableQuantitySelector && (
                        <div className="ph-product-detail-quantity-selector">
                            <label htmlFor="quantity" className="ph-product-detail-quantity-label">Quantidade:</label>
                            <input
                                type="number"
                                id="quantity"
                                min="1"
                                value={selectedQuantity}
                                onChange={(e) => setSelectedQuantity(Number(e.target.value))}
                                className="ph-product-detail-quantity-input"
                            />
                        </div>
                    )}
                    
                    {productDetailConfig.showStock && (
                        <p className="ph-product-detail-stock">Estoque: {produto.estoque}</p>
                    )}

                    <button 
                        onClick={handleAddToCart} 
                        className="ph-product-detail-add-to-cart-button"
                        disabled={produto.estoque === 0}
                    >
                        {produto.estoque === 0 ? 'Produto Esgotado' : 'Adicionar ao Carrinho'}
                    </button>
                </div>
            </div>

            {/* Seção de Produtos Relacionados (placeholder) */}
            {productDetailConfig.showRelatedProducts && (
                <div className="ph-product-detail-related-products">
                    <h2 className="ph-product-detail-related-title">{productDetailConfig.relatedProductsTitle || 'Produtos Relacionados'}</h2>
                    <div className="ph-product-detail-related-grid">
                        <p>Nenhum produto relacionado encontrado.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailPage;
