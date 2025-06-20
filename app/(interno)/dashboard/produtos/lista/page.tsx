'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Importar Produto do seu arquivo de tipos
import type { Produto } from '../../../../../types/Produto'; // <<< AJUSTE ESTE CAMINHO PARA SEU ARQUIVO Produto.ts

// Definindo as cores e fontes principais para um estilo consistente (DENTRO DO ARQUIVO)
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

// Dados mockados (ou carregados do localStorage)
const getProdutosInicial = (): Produto[] => {
    if (typeof window !== 'undefined') {
        const storedProdutos = localStorage.getItem('produtosMock');
        return storedProdutos ? JSON.parse(storedProdutos) : [
            {
                id: 1,
                nome: 'Camiseta Roxa Premium',
                categoria: 'Vestuário',
                estoque: 120,
                preco: 59.90,
                precoPromocional: 49.90,
                ativo: true,
                imagensAdicionais: ['https://via.placeholder.com/150x150.png?text=Camiseta+Roxa'], // Usar imagensAdicionais[0] para a foto
                descricao: 'Camiseta de algodão premium, confortável e durável.',
                sku: 'CAM-ROXA-001',
            },
            {
                id: 2,
                nome: 'Tênis Casual Urbano',
                categoria: 'Calçados',
                estoque: 45,
                preco: 199.90,
                precoPromocional: null,
                ativo: true,
                imagensAdicionais: ['https://via.placeholder.com/150x150.png?text=Tênis+Casual'],
                descricao: 'Tênis moderno para o dia a dia, estilo e conforto.',
                sku: 'TEN-URB-002',
            },
            {
                id: 3,
                nome: 'Caneca Mágica Personalizada',
                categoria: 'Acessórios',
                estoque: 0,
                preco: 39.90,
                precoPromocional: null,
                ativo: false,
                imagensAdicionais: ['https://via.placeholder.com/150x150.png?text=Caneca+Mágica'],
                descricao: 'Caneca que muda de cor com líquidos quentes.',
                sku: 'CAN-MAG-003',
                isPersonalizado: true,
                personalizacaoTextoCampos: [{ id: 'can_text1', label: 'Texto na Caneca', maxCaracteres: 20 }]
            },
            {
                id: 4,
                nome: 'Smartwatch Esportivo',
                categoria: 'Eletrônicos',
                estoque: 75,
                preco: 499.99,
                precoPromocional: 450.00,
                ativo: true,
                imagensAdicionais: ['https://via.placeholder.com/150x150.png?text=Smartwatch'],
                descricao: 'Monitore sua saúde e atividades com estilo.',
                sku: 'SMART-ESP-004',
            },
            {
                id: 5,
                nome: 'Aliança Prata Personalizada',
                categoria: 'Joias',
                estoque: 30,
                preco: 350.00,
                precoPromocional: null,
                ativo: true,
                imagensAdicionais: ['https://via.placeholder.com/150x150.png?text=Aliança'],
                descricao: 'Aliança de prata 925 com gravação interna.',
                sku: 'ALI-PRA-005',
                isPersonalizado: true,
                personalizacaoTextoCampos: [
                    { id: 'ali_nome', label: 'Gravar Nome', maxCaracteres: 15 },
                    { id: 'ali_data', label: 'Gravar Data', maxCaracteres: 10 }
                ],
                personalizacaoNumericaCampos: [
                    { id: 'ali_aro', label: 'Tamanho do Aro', min: 8, max: 35 }
                ]
            },
        ];
    }
    return [];
};

export default function ListaProdutos() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [busca, setBusca] = useState('');
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<Produto | null>(null);
    const [editingPromoPriceId, setEditingPromoPriceId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        setProdutos(getProdutosInicial());
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && produtos.length > 0) {
            localStorage.setItem('produtosMock', JSON.stringify(produtos));
        }
    }, [produtos]);

    const produtosFiltrados = produtos.filter((p: Produto) =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.categoria.toLowerCase().includes(busca.toLowerCase()) ||
        p.sku?.toLowerCase().includes(busca.toLowerCase())
    );

    function navegarParaAdicionarProduto() {
        router.push('/dashboard/produtos/novo');
    }

    function navegarParaEditarProduto(id: number) {
        router.push(`/dashboard/produtos/editar/${id}`);
    }

    function iniciarExclusao(produto: Produto) {
        setConfirmacaoExclusao(produto);
    }

    function confirmarExclusao() {
        if (confirmacaoExclusao) {
            setProdutos(produtos.filter(p => p.id !== confirmacaoExclusao.id));
            alert(`Produto "${confirmacaoExclusao.nome}" excluído com sucesso!`);
            setConfirmacaoExclusao(null);
        }
    }

    function cancelarExclusao() {
        setConfirmacaoExclusao(null);
    }

    const handlePromoPriceChange = (id: number, value: string) => {
        setProdutos(prevProdutos => prevProdutos.map(p =>
            p.id === id ? { ...p, precoPromocional: value === '' ? null : parseFloat(value) || null } : p
        ));
    };

    const handleSavePromoPrice = (id: number) => {
        setEditingPromoPriceId(null);
        console.log(`Preço promocional do produto ${id} atualizado.`);
    };

    function gerarCatalogoMeta(produtos: Produto[]) {
        return produtos.map(prod => ({
            id: prod.id.toString(),
            title: prod.nome,
            description: prod.descricao || prod.nome,
            availability: prod.estoque > 0 ? 'in stock' : 'out of stock',
            condition: 'new',
            price: `${prod.preco.toFixed(2)} BRL`,
            // CORREÇÃO: Usar a primeira imagem de 'imagensAdicionais'
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
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>ID</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Nome</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Categoria</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Estoque</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'right', fontSize: typography.smallSize }}>Preço (R$)</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'right', fontSize: typography.smallSize }}>Preço Promo (R$)</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Ativo</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produtosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan={9} style={{ textAlign: 'center', padding: '30px', color: colors.lightText, fontSize: typography.bodySize }}>
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        ) : (
                            produtosFiltrados.map((prod: Produto) => (
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
                                            src={prod.imagensAdicionais && prod.imagensAdicionais.length > 0 ? prod.imagensAdicionais[0] : 'https://via.placeholder.com/50x50.png?text=Sem+Imagem'} // Usar imagensAdicionais[0] para a foto
                                            alt={prod.nome}
                                            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: '4px', border: `1px solid ${colors.border}` }}
                                        />
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize }}>{prod.id}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontWeight: 'bold', fontSize: typography.bodySize }}>{prod.nome}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize, color: colors.lightText }}>{prod.categoria}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'center', fontSize: typography.bodySize, fontWeight: 'bold', color: prod.estoque === 0 ? colors.danger : colors.text }}>{prod.estoque}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'right', fontSize: typography.bodySize, fontWeight: 'bold' }}>
                                        {prod.preco.toFixed(2).replace('.', ',')}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'right' }}>
                                        {editingPromoPriceId === prod.id ? (
                                            <input
                                                type="number"
                                                value={prod.precoPromocional ?? ''}
                                                onChange={(e) => handlePromoPriceChange(prod.id, e.target.value)}
                                                onBlur={() => handleSavePromoPrice(prod.id)}
                                                onKeyDown={(e) => { if (e.key === 'Enter') handleSavePromoPrice(prod.id); }}
                                                style={{
                                                    width: '80px',
                                                    padding: '5px',
                                                    borderRadius: '4px',
                                                    border: `1px solid ${colors.accent}`,
                                                    textAlign: 'right',
                                                    fontSize: typography.bodySize,
                                                }}
                                                autoFocus
                                            />
                                        ) : (
                                            <span
                                                onClick={() => setEditingPromoPriceId(prod.id)}
                                                style={{
                                                    cursor: 'pointer',
                                                    color: prod.precoPromocional !== null && prod.precoPromocional !== undefined ? colors.accent : colors.lightText,
                                                    fontWeight: 'bold',
                                                    textDecoration: prod.precoPromocional !== null && prod.precoPromocional !== undefined ? 'none' : 'underline dotted',
                                                }}
                                            >
                                                {prod.precoPromocional !== null && prod.precoPromocional !== undefined ? prod.precoPromocional.toFixed(2).replace('.', ',') : 'Add Promo'}
                                            </span>
                                        )}
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

            {/* Modal de Confirmação de Exclusão (mantido) */}
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
                            Tem certeza que deseja excluir o produto "<strong>{confirmacaoExclusao.nome}</strong>"? Esta ação não pode ser desfeita.
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