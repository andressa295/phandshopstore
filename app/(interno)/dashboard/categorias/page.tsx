'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormularioCategoria from './components/FormularioCategoria';
import { FaPlus, FaCaretRight } from 'react-icons/fa';

// DEFINIÇÕES DE COLORS E TYPOGRAPHY NO TOPO DO ARQUIVO
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

// Importa a interface Categoria do arquivo de tipos global
import type { Categoria } from '../../../../types/Categoria'; // <<< CORREÇÃO: AGORA IMPORTANDO DO SEU ARQUIVO TYPES/CATEGORIA.TS


// Dados mockados de categorias
const getCategoriasInicial = (): Categoria[] => {
    if (typeof window !== 'undefined') {
        const storedCategorias = localStorage.getItem('categoriasMock');
        return storedCategorias ? JSON.parse(storedCategorias) : [
            { id: 1, nome: 'Eletrônicos', descricao: 'Smartphones, notebooks e gadgets.', produtosAssociadosIds: [4] },
            { id: 2, nome: 'Vestuário', descricao: 'Roupas masculinas e femininas.', subcategorias: [
                { id: 11, nome: 'Calças', descricao: 'Jeans, moletom, sarja.', produtosAssociadosIds: [1], subcategorias: [
                    {id: 111, nome: 'Calça Jeans', descricao: 'Diversos modelos de jeans.'}
                ]},
                { id: 12, nome: 'Camisas', descricao: 'Manga curta e longa.' }
            ], produtosAssociadosIds: []},
            { id: 3, nome: 'Calçados', descricao: 'Tênis, sapatos e sandálias.', produtosAssociadosIds: [2]},
            { id: 4, nome: 'Joias', descricao: 'Anéis, colares, brincos em ouro e prata.', produtosAssociadosIds: [5]},
            { id: 5, nome: 'Acessórios', descricao: 'Mochilas, bolsas e óculos.', produtosAssociadosIds: [3]},
        ];
    }
    return [];
};


export default function ListaCategorias() {
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [categoriaEmEdicao, setCategoriaEmEdicao] = useState<Categoria | null>(null);
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<Categoria | null>(null);
    const [categoriaPaiParaSub, setCategoriaPaiParaSub] = useState<Categoria | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<number[]>([]);

    const router = useRouter();

    useEffect(() => {
        setCategorias(getCategoriasInicial());
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && categorias.length > 0) {
            localStorage.setItem('categoriasMock', JSON.stringify(categorias));
        }
    }, [categorias]);

    const categoriasFiltradas = categorias.filter(cat =>
        cat.nome.toLowerCase().includes(busca.toLowerCase()) ||
        cat.descricao?.toLowerCase().includes(busca.toLowerCase()) ||
        cat.subcategorias?.some(sub => sub.nome.toLowerCase().includes(busca.toLowerCase()))
    );

    // --- Funções CRUD ---

    function abrirModal(categoria: Categoria | null = null, parentCategory: Categoria | null = null) {
        setCategoriaEmEdicao(categoria);
        setCategoriaPaiParaSub(parentCategory);
        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
        setCategoriaEmEdicao(null);
        setCategoriaPaiParaSub(null);
    }

    function salvarCategoria(categoria: Categoria) {
        if (categoria.id === 0) {
            const novoId = Math.max(...categorias.flatMap(c => [c.id, ...(c.subcategorias || []).map(s => s.id)]), 0) + 1;
            const novaCategoriaComId = { ...categoria, id: novoId };

            if (categoriaPaiParaSub) {
                const updateSubcategorias = (cats: Categoria[]): Categoria[] => {
                    return cats.map(c => {
                        if (c.id === categoriaPaiParaSub.id) {
                            return {
                                ...c,
                                subcategorias: [...(c.subcategorias || []), novaCategoriaComId]
                            };
                        }
                        if (c.subcategorias) {
                            return { ...c, subcategorias: updateSubcategorias(c.subcategorias) };
                        }
                        return c;
                    });
                };
                setCategorias((prev: Categoria[]) => updateSubcategorias(prev));
            } else {
                setCategorias((prev: Categoria[]) => [...prev, novaCategoriaComId]);
            }
            alert('Categoria adicionada com sucesso!');
        } else {
            const updateCategorias = (cats: Categoria[]): Categoria[] => {
                return cats.map(c => {
                    if (c.id === categoria.id) {
                        return categoria;
                    }
                    if (c.subcategorias) {
                        return { ...c, subcategorias: updateCategorias(c.subcategorias) };
                    }
                    return c;
                });
            };
            setCategorias((prev: Categoria[]) => updateCategorias(prev));
            alert('Categoria atualizada com sucesso!');
        }
        fecharModal();
    }

    function iniciarExclusao(categoria: Categoria) {
        setConfirmacaoExclusao(categoria);
    }

    function confirmarExclusao() {
        if (confirmacaoExclusao) {
            const removeCategoria = (cats: Categoria[]): Categoria[] => {
                return cats.filter(c => c.id !== confirmacaoExclusao.id).map(c => {
                    if (c.subcategorias) {
                        return { ...c, subcategorias: removeCategoria(c.subcategorias) };
                    }
                    return c;
                });
            };
            setCategorias((prev: Categoria[]) => removeCategoria(prev));
            alert(`Categoria "${confirmacaoExclusao.nome}" excluída com sucesso!`);
            setConfirmacaoExclusao(null);
        }
    }

    function cancelarExclusao() {
        setConfirmacaoExclusao(null);
    }

    const toggleCategoryExpand = (id: number) => {
        setExpandedCategories(prev =>
            prev.includes(id) ? prev.filter(catId => catId !== id) : [...prev, id]
        );
    };

    const renderCategoryRow = (cat: Categoria, level: number = 0) => {
        const isExpanded = expandedCategories.includes(cat.id);
        const paddingLeft = `${20 + level * 20}px`;

        return (
            <React.Fragment key={cat.id}>
                <tr style={{ borderBottom: `1px solid ${colors.border}`, transition: 'background-color 0.2s ease' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.background}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.white}>
                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize, paddingLeft: paddingLeft }}>
                        {cat.subcategorias && cat.subcategorias.length > 0 && (
                            <FaCaretRight
                                size={14}
                                style={{
                                    marginRight: '5px',
                                    cursor: 'pointer',
                                    transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.2s ease'
                                }}
                                onClick={(e) => { e.stopPropagation(); toggleCategoryExpand(cat.id); }}
                            />
                        )}
                        {cat.id}
                    </td>
                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontWeight: 'bold', fontSize: typography.bodySize }}>{cat.nome}</td>
                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize, color: colors.lightText }}>{cat.descricao || 'Sem descrição'}</td>
                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'center' }}>
                        <button
                            onClick={() => router.push(`/dashboard/categorias/editar/${cat.id}`)}
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
                                marginRight: '8px',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        >
                            Editar
                        </button>
                        <button
                            onClick={() => iniciarExclusao(cat)}
                            style={{
                                padding: '8px 15px',
                                cursor: 'pointer',
                                backgroundColor: colors.danger,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: typography.smallSize,
                                fontWeight: 'bold',
                                transition: 'background-color 0.2s ease',
                                minWidth: '80px',
                                marginRight: '8px',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.danger}
                        >
                            Excluir
                        </button>
                        <button
                            onClick={() => abrirModal(null, cat)}
                            style={{
                                padding: '8px 15px',
                                cursor: 'pointer',
                                backgroundColor: colors.secondary,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '9999px',
                                fontSize: typography.smallSize,
                                fontWeight: 'bold',
                                transition: 'background-color 0.2s ease',
                                minWidth: '80px',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                        >
                            <FaPlus size={10} style={{ marginRight: '5px' }} /> Subcategoria
                        </button>
                    </td>
                </tr>
                {isExpanded && cat.subcategorias && cat.subcategorias.map(subCat => renderCategoryRow(subCat, level + 1))}
            </React.Fragment>
        );
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
            <h1 style={{
                marginBottom: '25px',
                fontSize: typography.headingSize,
                color: colors.primary,
                textAlign: 'center',
                fontWeight: 'bold',
                margin: 0, padding: 0,
            }}>
                Gestão de Categorias
            </h1>

            {/* Barra de Busca e Botão Adicionar */}
            <div style={{
                marginBottom: '20px',
                display: 'flex',
                gap: '15px',
                alignItems: 'center',
                backgroundColor: colors.white,
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                border: `1px solid ${colors.border}`,
            }}>
                <input
                    type="text"
                    placeholder="Buscar por nome ou descrição..."
                    value={busca}
                    onChange={e => setBusca(e.target.value)}
                    style={{
                        padding: '10px 12px',
                        flex: 1,
                        borderRadius: '6px',
                        border: `1px solid ${colors.border}`,
                        fontSize: typography.bodySize,
                        color: colors.text,
                        backgroundColor: colors.white,
                        outline: 'none',
                        transition: 'border-color 0.2s ease',
                    }}
                    onFocus={(e) => e.currentTarget.style.borderColor = colors.accent}
                    onBlur={(e) => e.currentTarget.style.borderColor = colors.border}
                />
                <button
                    onClick={() => abrirModal(null, null)} // Para adicionar categoria principal
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
                    + Adicionar Categoria
                </button>
            </div>

            {/* Tabela de Categorias */}
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
                    minWidth: '600px',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: colors.primary, color: colors.white }}>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>ID</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Nome da Categoria</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Descrição</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categoriasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ textAlign: 'center', padding: '30px', color: colors.lightText, fontSize: typography.bodySize }}>
                                    Nenhuma categoria encontrada.
                                </td>
                            </tr>
                        ) : (
                            categoriasFiltradas.map((cat: Categoria) => renderCategoryRow(cat, 0)) // Começa a renderização recursiva
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Adição/Edição de Categoria */}
            {modalAberto && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000,
                        boxSizing: 'border-box',
                        backdropFilter: 'blur(5px)',
                    }}
                    onClick={fecharModal}
                >
                    <div
                        style={{
                            backgroundColor: colors.white,
                            padding: '30px',
                            borderRadius: '10px',
                            width: '90%',
                            maxWidth: '500px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 style={{
                            marginBottom: '15px',
                            fontSize: typography.subHeadingSize,
                            color: colors.primary,
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}>
                            {categoriaEmEdicao ? 'Editar Categoria' : (categoriaPaiParaSub ? `Adicionar Subcategoria em "${categoriaPaiParaSub.nome}"` : 'Adicionar Nova Categoria')}
                        </h2>
                        <FormularioCategoria
                            categoriaInicial={categoriaEmEdicao}
                            onSave={salvarCategoria}
                            onCancel={fecharModal}
                            parentId={categoriaPaiParaSub?.id || null} // Passa o ID do pai para o formulário
                        />
                    </div>
                </div>
            )}

            {/* Modal de Confirmação de Exclusão */}
            {confirmacaoExclusao && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0,0,0,0.6)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1001,
                        boxSizing: 'border-box',
                        backdropFilter: 'blur(5px)',
                    }}
                    onClick={cancelarExclusao}
                >
                    <div
                        style={{
                            backgroundColor: colors.white,
                            padding: '30px',
                            borderRadius: '10px',
                            width: '90%',
                            maxWidth: '400px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
                            boxSizing: 'border-box',
                            textAlign: 'center',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <h2 style={{
                            marginBottom: '15px',
                            fontSize: typography.subHeadingSize,
                            color: colors.danger,
                            fontWeight: 'bold',
                        }}>
                            Confirmar Exclusão
                        </h2>
                        <p style={{
                            marginBottom: '25px',
                            fontSize: typography.bodySize,
                            color: colors.text,
                        }}>
                            Tem certeza que deseja excluir a categoria "<strong>{confirmacaoExclusao.nome}</strong>"? Esta ação não pode ser desfeita.
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
                            <button
                                onClick={confirmarExclusao}
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
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.danger}
                            >
                                Excluir
                            </button>
                            <button
                                onClick={cancelarExclusao}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: colors.lightText,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '9999px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold',
                                    fontSize: typography.bodySize,
                                    transition: 'background-color 0.2s ease',
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#888'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.lightText}
                            >
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}