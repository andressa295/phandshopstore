'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { ProdutoData, HeaderSettingsConfig } from '../../../../(painel)/personalizar/types';

interface SearchPageProps {
  // A busca será interna, então o componente não precisa de props.
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const SearchPage: React.FC<SearchPageProps> = () => {
  const { config } = useTheme();
  const lojaNome = config.headerTitle || 'Sua Loja';
  
  // Mock de produtos para simular resultados de busca
  const mockProducts: ProdutoData[] = [
    { id: '1', nome: 'Anel de Prata', descricao: 'Anel elegante em prata 925.', preco: 150.00, imagem_url: 'https://placehold.co/300x300/E0E7FF/4338CA?text=Anel', estoque: 10, categoria_id: 'cat-1' },
    { id: '2', nome: 'Colar de Ouro', descricao: 'Colar com pingente de coração em ouro 18k.', preco: 800.00, imagem_url: 'https://placehold.co/300x300/E0E7FF/4338CA?text=Colar', estoque: 5, categoria_id: 'cat-2' },
    { id: '3', nome: 'Brincos de Pérola', descricao: 'Brincos clássicos com pérolas cultivadas.', preco: 250.00, imagem_url: 'https://placehold.co/300x300/E0E7FF/4338CA?text=Brincos', estoque: 15, categoria_id: 'cat-1' },
    { id: '4', nome: 'Pulseira de Couro', descricao: 'Pulseira moderna em couro legítimo.', preco: 80.00, imagem_url: 'https://placehold.co/300x300/E0E7FF/4338CA?text=Pulseira', estoque: 20, categoria_id: 'cat-3' },
  ];

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ProdutoData[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = async (term: string) => {
    setLoading(true);
    setHasSearched(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const filtered = mockProducts.filter(product =>
      product.nome.toLowerCase().includes(term.toLowerCase()) ||
      product.descricao?.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filtered);
    setLoading(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  return (
    <div className="ph-search-page">
      <h1 className="ph-search-title">Resultados da Pesquisa</h1>

      <form onSubmit={handleSearchSubmit} className="ph-search-form">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="O que você está procurando?"
          className="ph-search-input-main"
        />
        <button type="submit" className="ph-search-button-main" disabled={loading}>
          {loading ? 'Buscando...' : <Search size={20} />}
        </button>
      </form>

      {hasSearched && !loading && searchResults.length === 0 && (
        <p className="ph-no-results-message">Nenhum resultado encontrado para "{searchTerm}".</p>
      )}

      {loading ? (
        <p className="ph-loading-message">Buscando produtos...</p>
      ) : (
        searchResults.length > 0 && (
          <div className="ph-search-results-grid">
            {searchResults.map(product => (
              <div key={product.id} className="ph-search-result-card">
                <img 
                  src={product.imagem_url || `https://placehold.co/150x150/E0E7FF/4338CA?text=${encodeURIComponent(product.nome)}`} 
                  alt={product.nome} 
                  className="ph-search-result-image"
                  onError={(e) => {
                      e.currentTarget.src = `https://placehold.co/150x150/CCCCCC/000000?text=Img`;
                      e.currentTarget.onerror = null;
                  }}
                />
                <div className="ph-search-result-info">
                  <h3 className="ph-search-result-name">{product.nome}</h3>
                  <p className="ph-search-result-price">{formatCurrency(product.preco)}</p>
                  <Link href={`/produtos/${product.id}`} className="ph-search-result-button">
                    Ver Detalhes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default SearchPage;
