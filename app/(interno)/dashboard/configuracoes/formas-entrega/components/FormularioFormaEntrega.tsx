'use client';

import React, { useState, useEffect } from 'react';
import type { FormaEntrega } from '../../../../../../types/FormaEntrega';

// Definindo cores e fontes (repetido para auto-suficiência)
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

// interface para as opções do select
interface TipoFreteOption {
    value: FormaEntrega['tipo']; // O valor agora é tipado como um dos tipos literais ou string vazia
    label: string;
}

interface FormularioFormaEntregaProps {
    formaEntregaInicial?: FormaEntrega | null;
    onSave: (forma: FormaEntrega) => void;
    onCancel: () => void;
    tipoFreteOptions: TipoFreteOption[]; // Recebe as opções como prop
}

const FormularioFormaEntrega: React.FC<FormularioFormaEntregaProps> = ({ formaEntregaInicial, onSave, onCancel, tipoFreteOptions }) => {
    const [formData, setFormData] = useState<FormaEntrega>(
        formaEntregaInicial || {
            id: 0,
            nome: '',
            tipo: '', // CORREÇÃO: Inicializa com string vazia, que é um valor permitido pela interface agora
            ativa: true,
            // Inicializa as propriedades opcionais para evitar 'undefined' em algumas operações
            precoFixo: null, 
            prazoDiasMin: null, 
            prazoDiasMax: null, 
            regiaoAtiva: '', 
            pedidoMinimoFreteGratis: null,
        }
    );

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (name.includes('preco') || name.includes('prazo') || name.includes('pedidoMinimo')) ? (value === '' ? null : parseFloat(value) || 0) : value,
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
        if (!formData.tipo || formData.tipo.trim() === '') newErrors.tipo = 'Tipo de entrega é obrigatório.'; // Valida que um tipo foi selecionado

        if (formData.tipo === 'frete_fixo' && (formData.precoFixo === null || formData.precoFixo === undefined || formData.precoFixo <= 0)) {
            newErrors.precoFixo = 'Preço fixo deve ser maior que zero.';
        }
        if (formData.tipo === 'frete_gratis' && (formData.pedidoMinimoFreteGratis === null || formData.pedidoMinimoFreteGratis === undefined || formData.pedidoMinimoFreteGratis < 0)) {
            newErrors.pedidoMinimoFreteGratis = 'Valor mínimo para frete grátis não pode ser negativo.';
        }

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

    // Estilos reutilizáveis
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
        display: 'block',
    };

    const errorStyle: React.CSSProperties = {
        color: colors.danger,
        fontSize: '0.75rem',
        marginTop: '5px',
        fontFamily: typography.fontFamily,
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: typography.subHeadingSize,
        color: colors.primary,
        fontWeight: 'bold',
        marginBottom: '15px',
        marginTop: '30px',
        borderBottom: `2px solid ${colors.primary}`,
        paddingBottom: '5px',
        width: '100%',
        fontFamily: typography.fontFamily,
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <h2 style={sectionTitleStyle}>Detalhes da Forma de Entrega</h2>
            <div>
                <label htmlFor="nome" style={labelStyle}>Nome da Forma de Entrega:</label>
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
                <label htmlFor="tipo" style={labelStyle}>Tipo de Frete:</label>
                <select
                    id="tipo"
                    name="tipo"
                    value={formData.tipo || ''}
                    onChange={handleChange}
                    style={{ ...inputStyle, borderColor: errors.tipo ? colors.danger : colors.border, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
                >
                    {/* Opções do select agora vêm de tipoFreteOptions */}
                    {tipoFreteOptions.map(option => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {errors.tipo && <p style={errorStyle}>{errors.tipo}</p>}
            </div>

            {(formData.tipo === 'frete_fixo' || formData.tipo === 'frete_gratis') && (
                <div style={{ border: `1px dashed ${colors.border}`, padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {formData.tipo === 'frete_fixo' && (
                        <div>
                            <label htmlFor="precoFixo" style={labelStyle}>Preço Fixo (R$):</label>
                            <input
                                type="number"
                                id="precoFixo"
                                name="precoFixo"
                                value={formData.precoFixo ?? ''}
                                onChange={handleChange}
                                step="0.01"
                                style={{ ...inputStyle, borderColor: errors.precoFixo ? colors.danger : colors.border }}
                            />
                            {errors.precoFixo && <p style={errorStyle}>{errors.precoFixo}</p>}
                        </div>
                    )}
                    {formData.tipo === 'frete_gratis' && (
                        <div>
                            <label htmlFor="pedidoMinimoFreteGratis" style={labelStyle}>Valor Mínimo do Pedido para Frete Grátis (R$):</label>
                            <input
                                type="number"
                                id="pedidoMinimoFreteGratis"
                                name="pedidoMinimoFreteGratis"
                                value={formData.pedidoMinimoFreteGratis ?? ''}
                                onChange={handleChange}
                                step="0.01"
                                style={{ ...inputStyle, borderColor: errors.pedidoMinimoFreteGratis ? colors.danger : colors.border }}
                            />
                            {errors.pedidoMinimoFreteGratis && <p style={errorStyle}>{errors.pedidoMinimoFreteGratis}</p>}
                        </div>
                    )}
                    {/* Campo para Região Ativa (simplificado) */}
                    <div>
                        <label htmlFor="regiaoAtiva" style={labelStyle}>Região Ativa (Ex: BR, SP, Sudeste):</label>
                        <input
                            type="text"
                            id="regiaoAtiva"
                            name="regiaoAtiva"
                            value={formData.regiaoAtiva || ''}
                            onChange={handleChange}
                            placeholder="Ex: BR, SP, Sudeste (separe por vírgulas)"
                            style={inputStyle}
                        />
                    </div>
                </div>
            )}

            {/* Prazo de Entrega */}
            <div>
                <label htmlFor="prazoDiasMin" style={labelStyle}>Prazo de Entrega (dias úteis):</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="number"
                        id="prazoDiasMin"
                        name="prazoDiasMin"
                        value={formData.prazoDiasMin ?? ''}
                        onChange={handleChange}
                        placeholder="Mínimo"
                        style={inputStyle}
                    />
                    <input
                        type="number"
                        id="prazoDiasMax"
                        name="prazoDiasMax"
                        value={formData.prazoDiasMax ?? ''}
                        onChange={handleChange}
                        placeholder="Máximo"
                        style={inputStyle}
                    />
                </div>
                <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginTop: '5px' }}>
                    Ex: 3 a 7 dias úteis.
                </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                    type="checkbox"
                    id="ativa"
                    name="ativa"
                    checked={formData.ativa}
                    onChange={handleChange}
                    style={{ transform: 'scale(1.2)' }}
                />
                <label htmlFor="ativa" style={labelStyle}>Forma de Entrega Ativa</label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
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
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = '#888'}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.lightText}
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
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                >
                    Salvar Forma de Entrega
                </button>
            </div>
        </form>
    );
};

export default FormularioFormaEntrega;