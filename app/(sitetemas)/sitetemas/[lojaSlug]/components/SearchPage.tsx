'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { ProdutoData } from '../../../../(painel)/personalizar/types';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';

// --- CORREÇÃO AQUI: A interface agora inclui a propriedade lojaId ---
interface SearchClientProps {
    lojaId: string;
}

const formatCurrency = (value: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

const SearchClient: React.FC<SearchClientProps> = ({ lojaId }) => {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
    const [searchResults, setSearchResults] = useState<ProdutoData[]>([]);
    const [loading, setLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    useEffect(() => {
        if (searchTerm) {
            performSearch(searchTerm);
        }
    }, [searchTerm, lojaId]);

    const performSearch = async (term: string) => {
        setLoading(true);
        setHasSearched(true);

        const { data, error } = await supabase
            .from('produtos')
            .select('*')
            .eq('loja_id', lojaId)
            .ilike('nome', `%${term}%`); // Usa ilike para busca case-insensitive

        if (error) {
            console.error('Erro na busca:', error);
            setSearchResults([]);
        } else {
            setSearchResults(data || []);
        }
        setLoading(false);
    };

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        router.push(`?q=${searchTerm}`); // Atualiza a URL com o termo de busca
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

export default SearchClient;