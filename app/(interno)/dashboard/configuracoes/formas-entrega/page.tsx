'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import FormularioFormaEntrega from './components/FormularioFormaEntrega'; // Importa o formulário
import type { FormaEntrega } from '../../../../../types/FormaEntrega'; // <<< AJUSTE O CAMINHO

// Definindo cores e fontes (no topo do arquivo)
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

// Interface para as opções do select (re-definida aqui para ser estritamente tipada)
interface TipoFreteOption {
    value: 'correios' | 'transportadora' | 'retirada' | 'frete_fixo' | 'frete_gratis' | ''; // Tipos literais permitidos, incluindo string vazia
    label: string;
}

// Opções para o tipo de frete (AGORA COM TIPAGEM EXATA)
const tipoFreteOptions: TipoFreteOption[] = [ // CORREÇÃO: Tipagem explícita aqui
    { value: '', label: 'Selecione o tipo de entrega' },
    { value: 'frete_fixo', label: 'Frete Fixo' },
    { value: 'correios', label: 'Correios (SEDEX, PAC, etc.)' },
    { value: 'transportadora', label: 'Transportadora' },
    { value: 'retirada', label: 'Retirada no Local' },
    { value: 'frete_gratis', label: 'Frete Grátis' },
];


// Dados mockados de formas de entrega
const getFormasEntregaInicial = (): FormaEntrega[] => {
    if (typeof window !== 'undefined') {
        const storedFormas = localStorage.getItem('formasEntregaMock');
        return storedFormas ? JSON.parse(storedFormas) : [
            { id: 1, nome: 'Frete Fixo SP', tipo: 'frete_fixo', precoFixo: 15.00, regiaoAtiva: 'SP', prazoDiasMin: 3, prazoDiasMax: 7, ativa: true },
            { id: 2, nome: 'Retirada na Loja', tipo: 'retirada', prazoDiasMin: 1, prazoDiasMax: 1, ativa: true },
            { id: 3, nome: 'Correios PAC', tipo: 'correios', prazoDiasMin: 5, prazoDiasMax: 15, ativa: true },
            { id: 4, nome: 'Frete Grátis (acima de R$200)', tipo: 'frete_gratis', pedidoMinimoFreteGratis: 200.00, regiaoAtiva: 'BR', prazoDiasMin: 7, prazoDiasMax: 20, ativa: true },
        ];
    }
    return [];
};

export default function ListaFormasEntrega() {
    const [formasEntrega, setFormasEntrega] = useState<FormaEntrega[]>([]);
    const [busca, setBusca] = useState('');
    const [modalAberto, setModalAberto] = useState(false);
    const [formaEntregaEmEdicao, setFormaEntregaEmEdicao] = useState<FormaEntrega | null>(null);
    const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<FormaEntrega | null>(null);

    const router = useRouter();

    useEffect(() => {
        setFormasEntrega(getFormasEntregaInicial());
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined' && formasEntrega.length > 0) {
            localStorage.setItem('formasEntregaMock', JSON.stringify(formasEntrega));
        }
    }, [formasEntrega]);

    const formasEntregaFiltradas = formasEntrega.filter(f =>
        f.nome.toLowerCase().includes(busca.toLowerCase()) ||
        f.tipo?.toLowerCase().includes(busca.toLowerCase() || '') ||
        f.regiaoAtiva?.toLowerCase().includes(busca.toLowerCase() || '')
    );

    // --- Funções CRUD ---

    function abrirModal(forma: FormaEntrega | null = null) {
        setFormaEntregaEmEdicao(forma);
        setModalAberto(true);
    }

    function fecharModal() {
        setModalAberto(false);
        setFormaEntregaEmEdicao(null);
    }

    function salvarFormaEntrega(forma: FormaEntrega) {
        if (forma.id === 0) {
            const novoId = Math.max(...formasEntrega.map(f => f.id), 0) + 1;
            setFormasEntrega((prev: FormaEntrega[]) => [...prev, { ...forma, id: novoId }]);
            alert('Forma de entrega adicionada com sucesso!');
        } else {
            setFormasEntrega((prev: FormaEntrega[]) => prev.map(f => (f.id === forma.id ? forma : f)));
            alert('Forma de entrega atualizada com sucesso!');
        }
        fecharModal();
    }

    function iniciarExclusao(forma: FormaEntrega) {
        setConfirmacaoExclusao(forma);
    }

    function confirmarExclusao() {
        if (confirmacaoExclusao) {
            setFormasEntrega((prev: FormaEntrega[]) => prev.filter(f => f.id !== confirmacaoExclusao.id));
            alert(`Forma de entrega "${confirmacaoExclusao.nome}" excluída com sucesso!`);
            setConfirmacaoExclusao(null);
        }
    }

    function cancelarExclusao() {
        setConfirmacaoExclusao(null);
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
                Configurações de Entrega
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
                    placeholder="Buscar por nome ou tipo..."
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
                    onClick={() => abrirModal(null)}
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
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                    onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'translateY(1px)'}
                    onMouseUp={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                    + Adicionar Forma de Entrega
                </button>
            </div>

            {/* Tabela de Formas de Entrega */}
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
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Nome</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'left', fontSize: typography.smallSize }}>Tipo</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'right', fontSize: typography.smallSize }}>Preço Fixo / Mín. Grátis</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Prazo</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Ativa</th>
                            <th style={{ padding: '12px 15px', border: `1px solid ${colors.primary}`, textAlign: 'center', fontSize: typography.smallSize }}>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formasEntregaFiltradas.length === 0 ? (
                            <tr>
                                <td colSpan={7} style={{ textAlign: 'center', padding: '30px', color: colors.lightText, fontSize: typography.bodySize }}>
                                    Nenhuma forma de entrega encontrada.
                                </td>
                            </tr>
                        ) : (
                            formasEntregaFiltradas.map((forma: FormaEntrega) => (
                                <tr key={forma.id} style={{ borderBottom: `1px solid ${colors.border}`, transition: 'background-color 0.2s ease' }}
                                    onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) => e.currentTarget.style.backgroundColor = colors.background}
                                    onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) => e.currentTarget.style.backgroundColor = colors.white}>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize }}>{forma.id}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontWeight: 'bold', fontSize: typography.bodySize }}>{forma.nome}</td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, fontSize: typography.smallSize, color: colors.lightText }}>
                                        {tipoFreteOptions.find(opt => opt.value === forma.tipo)?.label || forma.tipo}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'right', fontSize: typography.bodySize }}>
                                        {forma.tipo === 'frete_fixo' ? `R$ ${forma.precoFixo?.toFixed(2).replace('.', ',') || '0,00'}` :
                                         forma.tipo === 'frete_gratis' ? `A partir de R$ ${forma.pedidoMinimoFreteGratis?.toFixed(2).replace('.', ',') || '0,00'}` :
                                         '-'}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'center', fontSize: typography.smallSize }}>
                                        {forma.prazoDiasMin && forma.prazoDiasMax ? `${forma.prazoDiasMin}-${forma.prazoDiasMax} dias` : 'N/A'}
                                    </td>
                                    <td
                                        style={{
                                            padding: '10px 15px',
                                            border: `1px solid ${colors.border}`,
                                            textAlign: 'center',
                                            color: forma.ativa ? colors.success : colors.danger,
                                            fontWeight: 'bold',
                                            fontSize: typography.smallSize,
                                        }}
                                    >
                                        {forma.ativa ? 'Sim' : 'Não'}
                                    </td>
                                    <td style={{ padding: '10px 15px', border: `1px solid ${colors.border}`, textAlign: 'center' }}>
                                        <button
                                            onClick={() => abrirModal(forma)}
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
                                            onClick={() => iniciarExclusao(forma)}
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

            {/* Modal de Adição/Edição de Forma de Entrega */}
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
                        onClick={(e: React.MouseEvent) => e.stopPropagation()}
                    >
                        <h2 style={{
                            marginBottom: '15px',
                            fontSize: typography.subHeadingSize,
                            color: colors.primary,
                            textAlign: 'center',
                            fontWeight: 'bold',
                        }}>
                            {formaEntregaEmEdicao ? 'Editar Forma de Entrega' : 'Adicionar Nova Forma de Entrega'}
                        </h2>
                        <FormularioFormaEntrega
                            formaEntregaInicial={formaEntregaEmEdicao}
                            onSave={salvarFormaEntrega}
                            onCancel={fecharModal}
                            tipoFreteOptions={tipoFreteOptions}
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
                            Tem certeza que deseja excluir a forma de entrega "<strong>{confirmacaoExclusao.nome}</strong>"? Esta ação não pode ser desfeita.
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