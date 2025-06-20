// app\(interno)\dashboard\categorias\components\FormularioCategoria.tsx (FINALMENTE COM TUDO E SEM ERROS DE ESCOPO!)
'use client';

import React, { useState, useEffect } from 'react';
// Importar a interface Categoria do arquivo de tipos global
import type { Categoria } from '../../../../../types/Categoria'; // <<< CORREÇÃO: Importando Categoria do types/Categoria.ts

// DEFINIÇÕES DE COLORS E TYPOGRAPHY NO TOPO DO ARQUIVO (ESCOPO CORRETO para este componente)
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

interface FormularioCategoriaProps {
    categoriaInicial?: Categoria | null;
    onSave: (categoria: Categoria) => void;
    onCancel: () => void;
    parentId?: number | null; // NOVO: para identificar se é uma subcategoria
}

const FormularioCategoria: React.FC<FormularioCategoriaProps> = ({ categoriaInicial, onSave, onCancel, parentId }) => {
    const [formData, setFormData] = useState<Categoria>(
        categoriaInicial || {
            id: 0,
            nome: '',
            descricao: '',
            subcategorias: [] // Garante que subcategorias seja um array vazio
        }
    );

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => { // CORREÇÃO: Tipagem explícita para 'prev'
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nome.trim()) newErrors.nome = 'Nome da categoria é obrigatório.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        } else {
            alert('Por favor, corrija os erros no formulário.');
        }
    };

    const inputStyle: React.CSSProperties = {
        padding: '10px 12px',
        borderRadius: '6px',
        border: `1px solid ${colors.border}`,
        fontSize: typography.bodySize,
        fontFamily: typography.fontFamily,
        color: colors.text,
        backgroundColor: colors.white,
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'border-color 0.2s ease',
    };

    const labelStyle: React.CSSProperties = {
        marginBottom: '5px',
        fontWeight: 'bold',
        fontSize: typography.smallSize,
        color: colors.text,
        fontFamily: typography.fontFamily,
    };

    const errorStyle: React.CSSProperties = {
        color: colors.danger,
        fontSize: '0.75rem',
        marginTop: '5px',
        fontFamily: typography.fontFamily,
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Campo oculto para parentId, se for uma subcategoria */}
            {parentId !== null && parentId !== undefined && (
                <input type="hidden" name="parentId" value={parentId} />
            )}

            <div>
                <label htmlFor="nome" style={labelStyle}>Nome da Categoria:</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    style={{ ...inputStyle, borderColor: errors.nome ? colors.danger : colors.border }}
                />
                {errors.nome && <p style={errorStyle}>{errors.nome}</p>}
            </div>
            <div>
                <label htmlFor="descricao" style={labelStyle}>Descrição (Opcional):</label>
                <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao || ''}
                    onChange={handleChange}
                    rows={3}
                    style={{ ...inputStyle, resize: 'vertical' }}
                />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                    type="button"
                    onClick={onCancel}
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
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: colors.primary,
                        color: colors.white,
                        border: 'none',
                        borderRadius: '9999px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: typography.bodySize,
                        transition: 'background-color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    Salvar Categoria
                </button>
            </div>
        </form>
    );
};

export default FormularioCategoria;