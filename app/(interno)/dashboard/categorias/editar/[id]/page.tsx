'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import FormularioCategoria from '../../components/FormularioCategoria'; // Caminho para o FormularioCategoria
// Importa as interfaces dos arquivos de tipos globais
import type { Categoria } from '../../../../../../types/Categoria'; // <<< CORREÇÃO: Importando Categoria do types/Categoria.ts
import type { Produto } from '../../../../../../types/Produto'; // <<< CORREÇÃO: Importando Produto do types/Produto.ts
import { FaPlus } from 'react-icons/fa';

// DEFINIÇÕES DE COLORS E TYPOGRAPHY NO TOPO DO ARQUIVO (ESCOPO CORRETO para este page.tsx)
const colors = {
    primary: '#6b21a8',
    background: '#f8f9fa',
    white: '#ffffff',
    text: '#333333',
    lightText: '#666666',
    border: '#e0e0e0',
    accent: '#7C3AED',
    danger: '#dc3545',
    success: '#28a745', // CORREÇÃO: Adicionado 'success' aqui
};
const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
    bodySize: '0.95rem',
    smallSize: '0.8rem', // CORREÇÃO: Adicionado 'smallSize' aqui
};

// MOCK DE PRODUTOS (PARA TESTAR A ASSOCIAÇÃO)
const getTodosOsProdutosMock = (): Produto[] => {
    if (typeof window !== 'undefined') {
        const storedProdutos = localStorage.getItem('produtosMock');
        return storedProdutos ? JSON.parse(storedProdutos) : [
            { id: 1, nome: 'Camiseta Roxa Premium', categoria: 'Vestuário', estoque: 120, preco: 59.90, ativo: true, imagensAdicionais: ['https://via.placeholder.com/50x50.png?text=Camiseta'] },
            { id: 2, nome: 'Tênis Casual Urbano', categoria: 'Calçados', estoque: 45, preco: 199.90, ativo: true, imagensAdicionais: ['https://via.placeholder.com/50x50.png?text=Tênis'] },
            { id: 3, nome: 'Caneca Mágica', categoria: 'Acessórios', estoque: 0, preco: 39.90, ativo: false, imagensAdicionais: ['https://via.placeholder.com/50x50.png?text=Caneca'] },
            { id: 4, nome: 'Smartwatch Esportivo', categoria: 'Eletrônicos', estoque: 75, preco: 499.99, ativo: true, imagensAdicionais: ['https://via.placeholder.com/50x50.png?text=Smartwatch'] },
            { id: 5, nome: 'Aliança Prata', categoria: 'Joias', estoque: 30, preco: 350.00, ativo: true, imagensAdicionais: ['https://via.placeholder.com/50x50.png?text=Aliança'] },
            { id: 6, nome: 'Colar de Pérolas', categoria: 'Joias', estoque: 20, preco: 280.00, ativo: true, imagensAdicionais: ['https://via.placeholder.com/50x50.png?text=Colar'] },
        ];
    }
    return [];
};


export default function EditarCategoriaPage() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params.id ? parseInt(params.id as string) : null;

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [todosOsProdutos, setTodosOsProdutos] = useState<Produto[]>([]);
    const [categoriaAtual, setCategoriaAtual] = useState<Categoria | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedCategorias = localStorage.getItem('categoriasMock');
        if (storedCategorias) {
            const parsedCategorias: Categoria[] = JSON.parse(storedCategorias);
            setCategorias(parsedCategorias);

            // CORREÇÃO: Tipagem explícita para o parâmetro 'id'
            const findCategoryById = (id: number, cats: Categoria[]): Categoria | null => {
                for (const cat of cats) {
                    if (cat.id === id) {
                        return cat;
                    }
                    if (cat.subcategorias) {
                        const foundSub = findCategoryById(id, cat.subcategorias);
                        if (foundSub) return foundSub;
                    }
                }
                return null;
            };

            const foundCategory = findCategoryById(categoryId!, parsedCategorias);
            if (foundCategory) {
                setCategoriaAtual(foundCategory);
            } else {
                alert('Categoria não encontrada!');
                router.push('/dashboard/categorias');
            }
        } else {
            alert('Nenhuma categoria encontrada. Crie categorias primeiro.');
            router.push('/dashboard/categorias');
        }

        setTodosOsProdutos(getTodosOsProdutosMock());

        setLoading(false);
    }, [categoryId, router]);

    const handleSave = (categoriaEditada: Categoria) => {
        const updateCategoriasInTree = (cats: Categoria[]): Categoria[] => {
            return cats.map(c => {
                if (c.id === categoriaEditada.id) {
                    return categoriaEditada;
                }
                if (c.subcategorias) {
                    return { ...c, subcategorias: updateCategoriasInTree(c.subcategorias) };
                }
                return c;
            });
        };

        const categoriasAtualizadas = updateCategoriasInTree(categorias);
        localStorage.setItem('categoriasMock', JSON.stringify(categoriasAtualizadas));
        alert('Categoria atualizada com sucesso!');
        router.push('/dashboard/categorias');
    };

    const handleCancel = () => {
        router.push('/dashboard/categorias');
    };

    const handleDelete = (catToDelete: Categoria) => {
        if (window.confirm(`Tem certeza que deseja excluir a categoria "${catToDelete.nome}"? Esta ação também excluirá suas subcategorias.`)) {
            const removeCategoriaFromTree = (cats: Categoria[]): Categoria[] => {
                return cats.filter(c => c.id !== catToDelete.id).map(c => {
                    if (c.subcategorias) {
                        return { ...c, subcategorias: removeCategoriaFromTree(c.subcategorias) };
                    }
                    return c;
                });
            };
            const categoriasAtualizadas = removeCategoriaFromTree(categorias);
            localStorage.setItem('categoriasMock', JSON.stringify(categoriasAtualizadas));
            alert(`Categoria "${catToDelete.nome}" excluída com sucesso!`);
            router.push('/dashboard/categorias');
        }
    };

    // --- Lógica de Associação de Produtos ---
    const isProductAssociated = (productId: number): boolean => {
        return categoriaAtual?.produtosAssociadosIds?.includes(productId) || false;
    };

    // CORREÇÃO: Tipagem para prev no setCategoriaAtual
    const associateProduct = (productId: number) => {
        if (categoriaAtual) {
            const updatedProdutosAssociados = [...(categoriaAtual.produtosAssociadosIds || []), productId];
            const updatedCategoria: Categoria = { ...categoriaAtual, produtosAssociadosIds: updatedProdutosAssociados };
            // setCategoriaAtual(updatedCategoria); // Não usar setCategoriaAtual diretamente para evitar salvar 2x
            setCategoriaAtual(prev => ({ ...prev!, produtosAssociadosIds: updatedProdutosAssociados })); // CORREÇÃO: Usar prev e garantir que prev não é null
            handleSave(updatedCategoria); // Salva imediatamente no localStorage e navega
        }
    };

    // CORREÇÃO: Tipagem para prev no setCategoriaAtual
    const dissociateProduct = (productId: number) => {
        if (categoriaAtual) {
            const updatedProdutosAssociados = (categoriaAtual.produtosAssociadosIds || []).filter(id => id !== productId);
            const updatedCategoria: Categoria = { ...categoriaAtual, produtosAssociadosIds: updatedProdutosAssociados };
            // setCategoriaAtual(updatedCategoria); // Não usar setCategoriaAtual diretamente para evitar salvar 2x
            setCategoriaAtual(prev => ({ ...prev!, produtosAssociadosIds: updatedProdutosAssociados })); // CORREÇÃO: Usar prev e garantir que prev não é null
            handleSave(updatedCategoria); // Salva imediatamente no localStorage e navega
        }
    };

    const produtosNaoAssociados = todosOsProdutos.filter(p => !isProductAssociated(p.id));
    const produtosAssociados = todosOsProdutos.filter(p => isProductAssociated(p.id));


    if (loading) {
        return (
            <div style={{
                padding: '20px',
                fontFamily: typography.fontFamily,
                color: colors.text,
                backgroundColor: colors.background,
                minHeight: 'calc(100vh - 100px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Carregando categoria...
            </div>
        );
    }

    if (!categoriaAtual) {
        return (
            <div style={{
                padding: '20px',
                fontFamily: typography.fontFamily,
                color: colors.text,
                backgroundColor: colors.background,
                minHeight: 'calc(100vh - 100px)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                Categoria não encontrada ou ID inválido.
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            fontFamily: typography.fontFamily,
            color: colors.text,
            backgroundColor: colors.background,
            minHeight: 'calc(100vh - 100px)',
            boxSizing: 'border-box',
        }}>
            <h1 style={{
                marginBottom: '25px',
                fontSize: typography.headingSize,
                color: colors.primary,
                textAlign: 'center',
                fontWeight: 'bold',
                margin: 0, padding: 0,
            }}>
                Editar Categoria: {categoriaAtual.nome}
            </h1>
            <div style={{
                backgroundColor: colors.white,
                padding: '30px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                maxWidth: '800px', // Aumenta a largura para caber as colunas de produtos
                margin: '20px auto',
                boxSizing: 'border-box',
            }}>
                <FormularioCategoria
                    categoriaInicial={categoriaAtual}
                    onSave={handleSave}
                    onCancel={handleCancel}
                />

                {/* Seção para associar/desassociar produtos */}
                <div style={{ marginTop: '30px', paddingTop: '20px', borderTop: `1px solid ${colors.border}` }}>
                    <h3 style={{ fontSize: typography.subHeadingSize, color: colors.primary, marginBottom: '15px', textAlign: 'center' }}>
                        Associar Produtos
                    </h3>

                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {/* Coluna de Produtos Não Associados */}
                        <div style={{ flex: '1 1 300px', border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '15px', backgroundColor: colors.background }}>
                            <h4 style={{ fontSize: typography.bodySize, color: colors.text, marginBottom: '10px', textAlign: 'center' }}>Produtos Disponíveis ({produtosNaoAssociados.length})</h4>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: `1px solid ${colors.lightText}`, borderRadius: '4px', padding: '10px' }}>
                                {produtosNaoAssociados.length === 0 ? (
                                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, textAlign: 'center' }}>Todos os produtos estão associados.</p>
                                ) : (
                                    produtosNaoAssociados.map(p => (
                                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px dashed ${colors.border}` }}>
                                            <span style={{ fontSize: typography.smallSize }}>
                                                <img src={p.imagensAdicionais && p.imagensAdicionais.length > 0 ? p.imagensAdicionais[0] : 'https://via.placeholder.com/20x20.png?text=Img'} alt={p.nome} style={{ width: '20px', height: '20px', borderRadius: '2px', marginRight: '5px', objectFit: 'cover' }} />
                                                {p.nome} (ID: {p.id})
                                            </span>
                                            <button
                                                onClick={() => associateProduct(p.id)}
                                                style={{ padding: '5px 10px', backgroundColor: colors.success, color: colors.white, border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: typography.smallSize }}
                                            >
                                                Adicionar
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Coluna de Produtos Associados */}
                        <div style={{ flex: '1 1 300px', border: `1px solid ${colors.border}`, borderRadius: '8px', padding: '15px', backgroundColor: colors.background }}>
                            <h4 style={{ fontSize: typography.bodySize, color: colors.text, marginBottom: '10px', textAlign: 'center' }}>Produtos Associados ({produtosAssociados.length})</h4>
                            <div style={{ maxHeight: '300px', overflowY: 'auto', border: `1px solid ${colors.lightText}`, borderRadius: '4px', padding: '10px' }}>
                                {produtosAssociados.length === 0 ? (
                                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, textAlign: 'center' }}>Nenhum produto associado a esta categoria.</p>
                                ) : (
                                    produtosAssociados.map(p => (
                                        <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px dashed ${colors.border}` }}>
                                            <span style={{ fontSize: typography.smallSize }}>
                                                <img src={p.imagensAdicionais && p.imagensAdicionais.length > 0 ? p.imagensAdicionais[0] : 'https://via.placeholder.com/20x20.png?text=Img'} alt={p.nome} style={{ width: '20px', height: '20px', borderRadius: '2px', marginRight: '5px', objectFit: 'cover' }} />
                                                {p.nome} (ID: {p.id})
                                            </span>
                                            <button
                                                onClick={() => dissociateProduct(p.id)}
                                                style={{ padding: '5px 10px', backgroundColor: colors.danger, color: colors.white, border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: typography.smallSize }}
                                            >
                                                Remover
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Botão de Excluir Categoria (se quiser um na página de edição também) */}
                <button
                    onClick={() => handleDelete(categoriaAtual)}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: colors.danger,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: typography.bodySize,
                        transition: 'background-color 0.2s ease',
                        marginTop: '20px',
                        display: 'block',
                        margin: '20px auto 0 auto'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.danger}
                >
                    Excluir Categoria
                </button>
            </div>
        </div>
    );
}