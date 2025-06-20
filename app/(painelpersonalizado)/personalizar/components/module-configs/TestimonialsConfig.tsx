// app/(painelpersonalizado)/personalizar/components/module-configs/TestimonialsConfig.tsx
'use client';
import React from 'react';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import TextField from '../ui/TextField';
import TextareaField from '../ui/TextareaField';
import ImageUploadSquare from '../ui/ImageUploadSquare';
import SelectField from '../ui/SelectField'; // Para o rating
import { HomePageModule, Tema, TestimonialItem } from '../EditorContext';

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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
            </button>
            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Depoimentos: {module.fullLabel || module.label}</h3>
            <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                Adicione depoimentos de seus clientes para construir prova social.
            </p>

            <TextField
                label="Título da Seção de Depoimentos:"
                value={module.config?.title ?? ''}
                onChange={(val) => handleModuleConfigChange(module.id, { title: val })}
                placeholder="Ex: O que dizem nossos clientes"
            />

            <div style={{ border: '1px solid #eee', padding: '15px', borderRadius: '8px' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Depoimentos ({currentTestimonials.length} no total)</h4>

                {currentTestimonials.map((testimonial, index) => (
                    <div key={testimonial.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '6px', marginBottom: '15px', backgroundColor: '#fdfdfd', position: 'relative' }}>
                        <h5 style={{ margin: '0 0 10px 0', fontSize: '0.95rem', color: '#555', fontFamily: 'Poppins, sans-serif' }}>Depoimento #{index + 1}</h5>

                        {currentTestimonials.length > 1 && (
                            <button
                                onClick={() => handleRemoveTestimonial(testimonial.id)}
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    background: '#dc3545',
                                    color: '#fff',
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
                            value={testimonial.rating ?? 5}
                            onChange={(val) => handleTestimonialItemChange(testimonial.id, 'rating', Number(val))}
                            options={[
                                { value: 5, label: '5 Estrelas' },
                                { value: 4, label: '4 Estrelas' },
                                { value: 3, label: '3 Estrelas' },
                                { value: 2, label: '2 Estrelas' },
                                { value: 1, label: '1 Estrela' },
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
                        background: '#28a745',
                        color: '#fff',
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
                        fontFamily: 'Poppins, sans-serif',
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
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    padding: '1rem',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: 'bold',
                    marginTop: '20px',
                    fontFamily: 'Poppins, sans-serif'
                }}
            >
                Voltar
            </button>
        </div>
    );
};

export default TestimonialsConfig;