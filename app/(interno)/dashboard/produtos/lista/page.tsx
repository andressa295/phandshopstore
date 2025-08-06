'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Produto } from '../../../../../types/Produto';
import Modal from '../../vendas/detalhes/components/Modal';
import ConfirmModal from '../../vendas/detalhes/components/ConfirmModal';
import Toast from '../../vendas/detalhes/components/Toast';

const colors = {
    primary: '#6b21a8',
    secondary: '#a21caf',
    accent: '#7C3AED',
    text: '#333333',
    lightText: '#666666',
    border: '#e0e0e0',
    background: '#f8f9fa',
    white: '#ffffff',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
};

const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
    bodySize: '0.95rem',
    smallSize: '0.8rem',
};

export default function ListaProdutos() {
    const supabase = createClientComponentClient();
    const router = useRouter();
    const [lojaId, setLojaId] = useState<string | null>(null);
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalProdutos, setTotalProdutos] = useState(0);

    const [busca, setBusca] = useState('');
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<Produto | null>(null);
    const [paginaAtual, setPaginaAtual] = useState(1);
    const [itensPorPagina, setItensPorPagina] = useState(10);
    const [colunaOrdenacao, setColunaOrdenacao] = useState<keyof Produto>('nome');
    const [direcaoOrdenacao, setDirecaoOrdenacao] = useState<'desc' | 'asc'>('asc');
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

    const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    }, []);

    const fetchLojaAndProducts = useCallback(async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            setLoading(false);
            return;
        }

        const { data: loja, error: lojaError } = await supabase
            .from('lojas')
            .select('id')
            .eq('usuario_id', user.id)
            .single();

        if (lojaError || !loja) {
            console.error('Erro ao buscar a loja do usuário:', lojaError);
            showToast('Erro ao carregar os dados da loja. Verifique as permissões.', 'error');
            setLoading(false);
            return;
        }
        setLojaId(loja.id);
        
        let query = supabase.from('produtos')
            .select('id, nome, categoria, preco, preco_promocional, estoque, ativo, imagens:imagensAdicionais', { count: 'exact' })
            .eq('loja_id', loja.id)
            .order(colunaOrdenacao, { ascending: direcaoOrdenacao === 'asc' });

        if (busca) {
            query = query.or(`nome.ilike.%${busca}%,sku.ilike.%${busca}%`);
        }
        
        const from = (paginaAtual - 1) * itensPorPagina;
        const to = from + itensPorPagina - 1;

        const { data: produtosData, error: produtosError, count } = await query.range(from, to);

        if (produtosError) {
            console.error('Erro ao buscar produtos:', produtosError);
            showToast('Ocorreu um erro ao buscar os produtos.', 'error');
        } else {
            setProdutos(produtosData || []);
            setTotalProdutos(count || 0);
        }
        setLoading(false);
    }, [supabase, router, busca, paginaAtual, itensPorPagina, colunaOrdenacao, direcaoOrdenacao, showToast]);

    useEffect(() => {
        fetchLojaAndProducts();
    }, [fetchLojaAndProducts]);

    function navegarParaAdicionarProduto() {
        router.push('/dashboard/produtos/novo');
    }

    function navegarParaEditarProduto(id: number) {
        router.push(`/dashboard/produtos/editar/${id}`);
    }

    function iniciarExclusao(produto: Produto) {
        setConfirmacaoExclusao(produto);
    }

    const confirmarExclusao = async () => {
        if (confirmacaoExclusao) {
            setLoading(true);
            const { error } = await supabase
                .from('produtos')
                .delete()
                .eq('id', confirmacaoExclusao.id)
                .eq('loja_id', lojaId);

            if (error) {
                console.error(`Erro ao excluir o produto "${confirmacaoExclusao.nome}":`, error);
                showToast('Erro ao excluir o produto.', 'error');
            } else {
                showToast(`Produto "${confirmacaoExclusao.nome}" excluído com sucesso!`, 'success');
                fetchLojaAndProducts();
            }
            setConfirmacaoExclusao(null);
            setIsConfirmModalOpen(false);
            setLoading(false);
        }
    };

    function cancelarExclusao() {
        setConfirmacaoExclusao(null);
        setIsConfirmModalOpen(false);
    }
    
    const handlePromoPriceChange = (id: number, value: string) => {
        setProdutos(prevProdutos => prevProdutos.map(p =>
            p.id === id ? { ...p, precoPromocional: value === '' ? null : parseFloat(value) || null } : p
        ));
    };

    function gerarCatalogoMeta(produtos: Produto[]) {
        return produtos.map(prod => ({
            id: prod.id.toString(),
            title: prod.nome,
            description: prod.descricao || prod.nome,
            availability: prod.estoque > 0 ? 'in stock' : 'out of stock',
            condition: 'new',
            price: `${prod.preco.toFixed(2)} BRL`,
            image_link: prod.imagensAdicionais && prod.imagensAdicionais.length > 0 ? prod.imagensAdicionais[0] : 'https://via.placeholder.com/150x150.png?text=No+Image',
            brand: 'Phandshop',
            sale_price: (prod.precoPromocional !== null && prod.precoPromocional !== undefined)
                ? `${prod.precoPromocional.toFixed(2)} BRL`
                : undefined,
        }));
    }

    function baixarCatalogoMeta() {
        const catalogo = gerarCatalogoMeta(produtos);
        const dataStr =
            'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(catalogo, null, 2));
        const dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute('href', dataStr);
        dlAnchorElem.setAttribute('download', 'catalogo-meta.json');
        dlAnchorElem.click();
    }
    
    const totalPaginas = Math.ceil(totalProdutos / itensPorPagina);
    const produtosNaPagina = produtos;
    
    const handleSort = (coluna: keyof Produto) => {
        const novaDirecao = colunaOrdenacao === coluna && direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
        setColunaOrdenacao(coluna);
        setDirecaoOrdenacao(novaDirecao);
    };

    return (
        <div style={{
            padding: '20px',
            fontFamily: typography.fontFamily,
            color: colors.text,
            backgroundColor: colors.background,
            minHeight: 'calc(100vh - 100px)',
            boxSizing: 'border-box',
        }}>
            {/* Título e Barra de Ferramentas */}
            <div style={{
                marginBottom: '25px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px',
            }}>
                <h1 style={{
                    fontSize: typography.headingSize,
                    color: colors.primary,
                    fontWeight: 'bold',
                    margin: 0,
                    padding: 0,
                }}>
                    Gestão de Produtos
                </h1>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Buscar por nome, categoria ou SKU..."
                        value={busca}
                        onChange={e => setBusca(e.target.value)}
                        style={{
                            padding: '10px 12px',
                            borderRadius: '6px',
                            border: `1px solid ${colors.border}`,
                            fontSize: typography.bodySize,
                            color: colors.text,
                            backgroundColor: colors.white,
                            outline: 'none',
                            transition: 'border-color 0.2s ease',
                            minWidth: '200px',
                            flexGrow: 1,
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = colors.accent}
                        onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
                    />
                    <button
                        onClick={baixarCatalogoMeta}
                        style={{
                            padding: '10px 15px',
                            backgroundColor: '#4267B2',
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: typography.bodySize,
                            transition: 'background-color 0.2s ease, transform 0.1s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#365899'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#4267B2'}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        Exportar Catálogo Meta
                    </button>
                    <button
                        onClick={navegarParaAdicionarProduto}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: colors.accent,
                            color: colors.white,
                            border: 'none',
                            borderRadius: '9999px',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            fontSize: typography.bodySize,
                            transition: 'background-color 0.2s ease, transform 0.1s ease',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                        onMouseDown={(e) => e.currentTarget.style.transform = 'translateY(1px)'}
                        onMouseUp={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        + Adicionar Produto
                    </button>
                </div>
            </div>

            {/* Tabela de Produtos */}
            <div style={{
                backgroundColor: colors.white,
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                border: `1px solid ${colors.border}`,
                overflowX: 'auto',
                marginBottom: '20px',
            }}>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: '900px',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: colors.primary, color: colors.white }}>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Foto</th>
                            <th onClick={() => handleSort('id')} style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize, cursor: 'pointer' }}>ID</th>
                            <th onClick={() => handleSort('nome')} style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize, cursor: 'pointer' }}>Nome</th>
                            <th onClick={() => handleSort('categoria')} style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize, cursor: 'pointer' }}>Categoria</th>
                            <th onClick={() => handleSort('estoque')} style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize, cursor: 'pointer' }}>Estoque</th>
                            <th onClick={() => handleSort('preco')} style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'right', fontSize: typography.smallSize, cursor: 'pointer' }}>Preço (R$)</th>
                            <th onClick={() => handleSort('precoPromocional')} style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'right', fontSize: typography.smallSize, cursor: 'pointer' }}>Preço Promo (R$)</th>
                            <th onClick={() => handleSort('ativo')} style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize, cursor: 'pointer' }}>Ativo</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: colors.lightText, fontSize: typography.bodySize }}>
                                    Carregando produtos...
                                </td>
                            </tr>
                        ) : produtos.length === 0 ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: colors.lightText, fontSize: typography.bodySize }}>
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        ) : (
                            produtos.map((prod: Produto) => (
                                <tr key={prod.id} style={{ borderBottom: `1px solid ${colors.border}`, transition: 'background-color 0.2s ease' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.white}>
                                    <td
                                        style={{
                                            padding: '10px 15px',
                                            border: `1px solid ${colors.border}`,
                                            textAlign: 'center',
                                        }}
                                    >
                                        <img
                                            src={prod.imagensAdicionais && prod.imagensAdicionais.length > 0 ? prod.imagensAdicionais[0] : 'https://via.placeholder.com/50x50.png?text=Sem+Imagem'}
                                            alt={prod.nome}
                                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px', border: `1px solid ${colors.border}` }}
                                        />
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize }}>{prod.id}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontWeight: 'bold', fontSize: typography.bodySize }}>{prod.nome}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize, color: colors.lightText }}>{prod.categoria}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'center', fontSize: typography.bodySize, fontWeight: 'bold', color: prod.estoque === 0 ? colors.danger : colors.text }}>{prod.estoque}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'right', fontSize: typography.bodySize, fontWeight: 'bold' }}>
                                        R$ {prod.preco.toFixed(2).replace('.', ',')}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'right', fontSize: typography.bodySize, fontWeight: 'bold' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backgroundColor: 'white', borderRadius: '4px', border: `1px solid ${colors.border}` }}>
                                            <span style={{ paddingLeft: '5px', color: colors.lightText }}>R$</span>
                                            <input
                                                type="number"
                                                value={prod.precoPromocional?.toFixed(2) ?? ''}
                                                onChange={(e) => handlePromoPriceChange(prod.id, e.target.value)}
                                                onBlur={() => console.log(`Preço promocional do produto ${prod.id} atualizado.`)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') console.log(`Preço promocional do produto ${prod.id} atualizado.`); }}
                                                style={{
                                                    width: '100px',
                                                    padding: '5px',
                                                    border: 'none',
                                                    textAlign: 'right',
                                                    fontSize: typography.bodySize,
                                                }}
                                            />
                                        </div>
                                    </td>
                                    <td
                                        style={{
                                            padding: '10px 15px',
                                            border: `1px solid ${colors.border}`,
                                            textAlign: 'center',
                                            color: prod.ativo ? colors.success : colors.danger,
                                            fontWeight: 'bold',
                                            fontSize: typography.smallSize,
                                        }}
                                    >
                                        {prod.ativo ? 'Ativo' : 'Inativo'}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'center' }}>
                                        <button
                                            onClick={() => navegarParaEditarProduto(prod.id)}
                                            style={{
                                                padding: '8px 15px',
                                                cursor: 'pointer',
                                                backgroundColor: colors.primary,
                                                color: colors.white,
                                                border: 'none',
                                                borderRadius: '9999px',
                                                fontSize: typography.smallSize,
                                                fontWeight: 'bold',
                                                transition: 'background-color 0.2s ease',
                                                minWidth: '80px',
                                            }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
