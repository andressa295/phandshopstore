// app\(painelpersonalizado)\personalizar\components\module-configs\TestimonialsConfig.tsx
'use client';
import React from 'react';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import TextField from '../ui/TextField';
import TextareaField from '../ui/TextareaField';
import ImageUploadSquare from '../ui/ImageUploadSquare';
import SelectField from '../ui/SelectField'; // Para o rating

import { HomePageModule, Tema, TestimonialItem } from '../EditorContext';

// DEFINIÇÕES DE COLORS E TYPOGRAPHY NO TOPO DO ARQUIVO (ESCOPO CORRETO e ÚNICO)
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


interface TestimonialsConfigProps {
    module: HomePageModule;
    goBackFromModuleConfig: () => void;
    handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
    tema: Tema;
    handleTemaChange: (key: keyof Tema, value: any) => void;
    handleNestedTemaChange: (parentKey: keyof Tema, subKey: string, value: any) => void;
}

const TestimonialsConfig: React.FC<TestimonialsConfigProps> = ({
    module,
    goBackFromModuleConfig,
    handleModuleConfigChange,
    tema,
}) => {
    const currentTestimonials: TestimonialItem[] = (module.config?.testimonials as TestimonialItem[]) || [{
        id: `test_item_${Date.now()}`,
        text: 'Excelente produto e atendimento!',
        author: 'Nome do Cliente',
        rating: 5,
        avatarUrl: null,
    }];

    const handleAddTestimonial = () => {
        const newItem: TestimonialItem = {
            id: `test_item_${Date.now()}`,
            text: 'Novo depoimento de cliente.',
            author: 'Novo Cliente',
            rating: 5,
            avatarUrl: null,
        };
        handleModuleConfigChange(module.id, { testimonials: [...currentTestimonials, newItem] });
    };

    const handleRemoveTestimonial = (idToRemove: string) => {
        const updatedItems = currentTestimonials.filter(item => item.id !== idToRemove);
        handleModuleConfigChange(module.id, { testimonials: updatedItems });
    };

    const handleTestimonialItemChange = (id: string, key: keyof TestimonialItem, value: any) => {
        const updatedItems = currentTestimonials.map(item =>
            item.id === id ? { ...item, [key]: value } : item
        );
        handleModuleConfigChange(module.id, { testimonials: updatedItems });
    };

    const handleImageUpload = (itemId: string) => (imageUrl: string | null) => {
        handleTestimonialItemChange(itemId, 'avatarUrl', imageUrl);
    };

    // Estilos internos - AGORA REUTILIZAM AS CONSTANTES DEFINIDAS NO TOPO
    // Sem duplicar as definições de 'colors' ou 'typography' aqui dentro.
    const inputStyle: React.CSSProperties = {
        padding: '10px 12px',
        borderRadius: '6px',
        border: `1px solid ${colors.border}`, // Usando 'colors' do topo
        fontSize: typography.bodySize, // Usando 'typography' do topo
        fontFamily: typography.fontFamily, // Usando 'typography' do topo
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
        fontSize: typography.smallSize, // Usando 'typography' do topo
        color: colors.text,
        fontFamily: typography.fontFamily, // Usando 'typography' do topo
        display: 'block',
    };

    const sectionTitleStyle: React.CSSProperties = {
        fontSize: typography.subHeadingSize, // Usando 'typography' do topo
        color: colors.primary, // Usando 'colors' do topo
        fontWeight: 'bold',
        marginBottom: '15px',
        marginTop: '30px',
        borderBottom: `2px solid ${colors.primary}`, // Usando 'colors' do topo
        paddingBottom: '5px',
        width: '100%',
        fontFamily: typography.fontFamily, // Usando 'typography' do topo
    };


    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: colors.text, cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: typography.fontFamily }}>
                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
            </button>
            <h3 style={{ color: colors.text, fontSize: typography.subHeadingSize, marginBottom: '0.8rem', fontFamily: typography.fontFamily }}>Configurar Depoimentos: {module.fullLabel || module.label}</h3>
            <p style={{ fontSize: typography.smallSize, color: colors.lightText, fontFamily: typography.fontFamily }}>
                Adicione depoimentos de seus clientes para construir prova social.
            </p>

            <TextField
                label="Título da Seção de Depoimentos:"
                value={module.config?.title ?? ''}
                onChange={(val) => handleModuleConfigChange(module.id, { title: val })}
                placeholder="Ex: O que dizem nossos clientes"
            />

            <div style={{ border: `1px solid ${colors.border}`, padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: colors.text, fontFamily: typography.fontFamily }}>Depoimentos ({currentTestimonials.length} no total)</h4>

                {currentTestimonials.map((testimonial, index) => (
                    <div key={testimonial.id} style={{ border: `1px solid ${colors.border}`, padding: '15px', borderRadius: '6px', marginBottom: '15px', backgroundColor: colors.background, position: 'relative' }}>
                        <h5 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: colors.text, fontFamily: typography.fontFamily }}>Depoimento #{index + 1}</h5>
                        
                        {currentTestimonials.length > 1 && (
                            <button
                                onClick={() => handleRemoveTestimonial(testimonial.id)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: colors.danger,
                                    color: colors.white,
                                    border: 'none',
                                    borderRadius: '50%',
                                    width: '24px',
                                    height: '24px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem',
                                    zIndex: 1,
                                }}
                                title="Remover este depoimento"
                            >
                                <FaTrash size={12} />
                            </button>
                        )}

                        <TextareaField
                            label="Texto do Depoimento:"
                            value={testimonial.text ?? ''}
                            onChange={(val) => handleTestimonialItemChange(testimonial.id, 'text', val)}
                            placeholder="Digite o que o cliente disse sobre a sua loja."
                            minHeight="60px"
                            maxHeight="120px"
                        />
                        <TextField
                            label="Autor do Depoimento:"
                            value={testimonial.author ?? ''}
                            onChange={(val) => handleTestimonialItemChange(testimonial.id, 'author', val)}
                            placeholder="Nome do Cliente (ex: Maria S.)"
                        />
                        <SelectField
                            label="Avaliação (Estrelas):"
                            value={testimonial.rating?.toString() ?? '5'} // OK
                            onChange={(val) => handleTestimonialItemChange(testimonial.id, 'rating', Number(val))}
                            options={[
                                { value: '5', label: '5 Estrelas' },
                                { value: '4', label: '4 Estrelas' },
                                { value: '3', label: '3 Estrelas' },
                                { value: '2', label: '2 Estrelas' },
                                { value: '1', label: '1 Estrela' },
                            ]}
                        />
                        <ImageUploadSquare
                            label="Upload Avatar do Cliente (opcional):"
                            onImageUpload={handleImageUpload(testimonial.id)}
                            currentImageUrl={testimonial.avatarUrl}
                            recommendation="Tamanho recomendado: 50x50px (quadrado)."
                            shape="square"
                        />
                    </div>
                ))}

                <button
                    onClick={handleAddTestimonial}
                    style={{
                        background: colors.success, // Usando colors.success para o botão Adicionar
                        color: colors.white,
                        border: 'none',
                        padding: '0.75rem 1.2rem',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'normal',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontFamily: typography.fontFamily,
                        width: 'fit-content',
                        margin: '15px auto 0 auto'
                    }}
                >
                    <FaPlus size={14} /> Adicionar Novo Depoimento
                </button>
            </div>

            <button
                onClick={goBackFromModuleConfig}
                style={{
                    background: colors.primary, // Usando colors.primary para o botão Voltar
                    color: colors.white,
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginTop: '20px',
                    fontFamily: typography.fontFamily
                }}
            >
                Voltar
            </button>
        </div>
    );
};

export default TestimonialsConfig;