// app\(interno)\dashboard\paginas\page.tsx (CORRIGIDO: TIPAGEM DOS EVENTOS DE MOUSE)
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormularioPagina from './components/FormularioPagina';
import type { PaginaInformativa } from '../../../../types/PaginaInformativa';
import { FaPlus } from 'react-icons/fa';

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
    info: '#17a2b8',
};

const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
    bodySize: '0.95rem',
    smallSize: '0.8rem',
};

// Dados mockados de páginas informativas
const getPaginasInformativasInicial = (): PaginaInformativa[] => {
    if (typeof window !== 'undefined') {
        const storedPaginas = localStorage.getItem('paginasInformativasMock');
        return storedPaginas ? JSON.parse(storedPaginas) : [
            { id: 1, titulo: 'Quem Somos', urlAmigavel: 'quem-somos', conteudoHtml: '<p>Somos uma loja dedicada a...</p>', ativa: true, metaTitulo: 'Sobre Nós', metaDescricao: 'Conheça nossa história.' },
            { id: 2, titulo: 'Política de Privacidade', urlAmigavel: 'politica-privacidade', conteudoHtml: '<p>Sua privacidade é importante para nós...</p>', ativa: true, metaTitulo: 'Privacidade', metaDescricao: 'Política de privacidade da loja.' },
            { id: 3, titulo: 'Trocas e Devoluções', urlAmigavel: 'trocas-devolucoes', conteudoHtml: '<p>Para trocas e devoluções...</p>', ativa: true, metaTitulo: 'Trocas', metaDescricao: 'Política de trocas e devoluções.' },
            { id: 4, titulo: 'Perguntas Frequentes', urlAmigavel: 'faq', conteudoHtml: '<p>Encontre respostas para suas dúvidas...</p>', ativa: false, metaTitulo: 'FAQ', metaDescricao: 'Perguntas e respostas frequentes.' },
        ];
    }
    return [];
};

export default function ListaPaginasInformativas() {
    const [paginas, setPaginas] = useState<PaginaInformativa[]>([]);
    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [paginaEmEdicao, setPaginaEmEdicao] = useState<PaginaInformativa | null>(null);
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<PaginaInformativa | null>(null);

    const router = useRouter();

    useEffect(() => {
        setPaginas(getPaginasInformativasInicial());
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && paginas.length > 0) {
            localStorage.setItem('paginasInformativasMock', JSON.stringify(paginas));
        }
    }, [paginas]);

    const paginasFiltradas = paginas.filter(p =>
        p.titulo.toLowerCase().includes(busca.toLowerCase()) ||
        p.urlAmigavel.toLowerCase().includes(busca.toLowerCase()) ||
        p.conteudoHtml.toLowerCase().includes(busca.toLowerCase())
    );

    // --- Funções CRUD (Ações de Modal para Exclusão) ---
    function iniciarExclusao(pagina: PaginaInformativa) {
        setConfirmacaoExclusao(pagina);
    }

    function confirmarExclusao() {
        if (confirmacaoExclusao) {
            setPaginas((prev: PaginaInformativa[]) => prev.filter(p => p.id !== confirmacaoExclusao.id));
            alert(`Página "${confirmacaoExclusao.titulo}" excluída com sucesso!`);
            setConfirmacaoExclusao(null);
        }
    }

    function cancelarExclusao() {
        setConfirmacaoExclusao(null);
    }

    // NAVEGAÇÃO PARA PÁGINAS DE ADIÇÃO/EDIÇÃO (NÃO MAIS MODAIS)
    const navegarParaAdicionarPagina = () => {
        router.push('/dashboard/paginas/novo');
    };

    const navegarParaEditarPagina = (id: number) => {
        router.push(`/dashboard/paginas/editar/${id}`);
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
                Gestão de Páginas Informativas
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
                    placeholder="Buscar por título ou conteúdo..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
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
                    onClick={navegarParaAdicionarPagina}
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
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary} // CORREÇÃO: Tipagem para 'e'
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent} // CORREÇÃO: Tipagem para 'e'
                    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'translateY(1px)'} // CORREÇÃO: Tipagem para 'e'
                    onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'translateY(0)'} // CORREÇÃO: Tipagem para 'e'
                >
                    + Adicionar Página
                </button>
            </div>

            {/* Tabela de Páginas */}
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
                    minWidth: '800px',
                }}>
                    <thead>
                        <tr style={{ backgroundColor: colors.primary, color: colors.white }}>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>ID</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Título</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>URL Amigável</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Ativa</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginasFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={5} style={{ textAlign: 'center', padding: '30px', color: colors.lightText, fontSize: typography.bodySize }}>
                                    Nenhuma página informativa encontrada.
                                </td>
                            </tr>
                        ) : (
                            paginasFiltradas.map((pagina: PaginaInformativa) => (
                                <tr key={pagina.id} style={{ borderBottom: `1px solid ${colors.border}`, transition: 'background-color 0.2s ease' }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) => e.currentTarget.style.backgroundColor = colors.background} // CORREÇÃO: Tipagem para 'e'
                                    onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) => e.currentTarget.style.backgroundColor = colors.white}> {/* CORREÇÃO: Tipagem para 'e' */}
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize }}>{pagina.id}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontWeight: 'bold', fontSize: typography.bodySize }}>{pagina.titulo}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize, color: colors.lightText }}>/{pagina.urlAmigavel}</td>
                                    <td
                                        style={{
                                            padding: '10px 15px',
                                            border: `1px solid ${colors.border}`,
                                            textAlign: 'center',
                                            color: pagina.ativa ? colors.success : colors.danger,
                                            fontWeight: 'bold',
                                            fontSize: typography.smallSize,
                                        }}
                                    >
                                        {pagina.ativa ? 'Sim' : 'Não'}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'center' }}>
                                        <button
                                            onClick={() => navegarParaEditarPagina(pagina.id)} // CHAMA A FUNÇÃO DE NAVEGAÇÃO
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
                                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => iniciarExclusao(pagina)}
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
                                            }}
                                            onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#c82333'}
                                            onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.danger}
                                        >
                                            Excluir
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal de Confirmação de Exclusão (mantido aqui para não criar mais arquivos por enquanto) */}
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
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
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
                            Tem certeza que deseja excluir a página "<strong>{confirmacaoExclusao.titulo}</strong>"? Esta ação não pode ser desfeita.
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
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#c82333'}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.danger}
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
                                onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#888'}
                                onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.lightText}
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