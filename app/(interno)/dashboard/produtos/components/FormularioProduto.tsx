'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Produto } from '../../../../../types/Produto';
import { FaPlus, FaTimes, FaTrash, FaImage, FaLink, FaMagic, FaBrain } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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

const mockCategorias = [
    'Eletrônicos', 'Vestuário', 'Calçados', 'Acessórios', 'Decoração', 'Brinquedos',
    'Joias', 'Alianças', 'Roupas Personalizadas'
];

const formasPagamentoDisponiveis = [
    { id: 'todos', nome: 'Todas as formas de pagamento' },
    { id: 'pix', nome: 'Somente PIX' },
    { id: 'cartao', nome: 'Somente Cartão de Crédito' },
    { id: 'boleto', nome: 'Somente Boleto' },
];

interface FormularioProdutoProps {
    produtoInicial?: Produto | null;
    onSave: (produto: Produto) => void;
    onCancel: () => void;
    onDelete?: (produto: Produto) => void;
}

const FormularioProduto: React.FC<FormularioProdutoProps> = ({ produtoInicial, onSave, onCancel, onDelete }) => {
    const supabase = createClientComponentClient();
    const [formData, setFormData] = useState<Produto>(
        produtoInicial || {
            id: 0,
            nome: '',
            categoria: '',
            estoque: 0,
            preco: 0,
            precoPromocional: null,
            ativo: true,
            imagensAdicionais: [],
            descricao: '',
            sku: '',
            peso: null,
            altura: null,
            comprimento: null,
            metaTitulo: '',
            metaDescricao: '',
            palavrasChave: '',
            urlAmigavel: '',
            hasVariacoes: false,
            variacoes: {
                tamanhosRoupas: [],
                tamanhosCalcados: [],
                cores: [],
            },
            isPersonalizado: false,
            personalizacaoTextoCampos: [],
            personalizacaoNumericaCampos: [],
            freteGratis: false,
            formasPagamento: ['todos'],
        }
    );

    const [categorias, setCategorias] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [showUrlInputIndex, setShowUrlInputIndex] = useState<number | null>(null);

    const variacaoInputRefs = {
        tamanhosRoupas: useRef<HTMLInputElement>(null),
        tamanhosCalcados: useRef<HTMLInputElement>(null),
        cores: useRef<HTMLInputElement>(null)
    };
    
    useEffect(() => {
        async function fetchCategorias() {
            const { data: categoriasData, error } = await supabase.from('categorias').select('nome');
            if (error) {
                console.error('Erro ao buscar categorias:', error);
            } else {
                setCategorias(categoriasData.map(c => c.nome));
            }
        }
        fetchCategorias();
    }, [supabase]);

    useEffect(() => {
        if (!produtoInicial?.urlAmigavel && formData.nome && !formData.urlAmigavel) {
            const slug = formData.nome
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, urlAmigavel: slug }));
        }
    }, [formData.nome, formData.urlAmigavel, produtoInicial?.urlAmigavel]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let newValue: any = value;
        
        if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
            newValue = e.target.checked;
        } else if (['preco', 'estoque', 'precoPromocional', 'peso', 'altura', 'largura', 'comprimento'].includes(name)) {
            newValue = value === '' ? null : parseFloat(value);
            if (isNaN(newValue as number) && newValue !== null) {
                newValue = 0;
            }
        }
        
        setFormData(prev => ({ ...prev, [name]: newValue }));

        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleVariacaoKeyDown = (type: 'tamanhosRoupas' | 'tamanhosCalcados' | 'cores', e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === ',' || e.key === 'Enter' || e.key === 'Tab') {
            e.preventDefault();
            const inputElement = variacaoInputRefs[type].current;
            if (inputElement) {
                const value = inputElement.value.trim();
                if (value) {
                    setFormData(prev => {
                        const currentVariations = (prev.variacoes?.[type] || []) as (string | number)[];
                        let newItem: string | number = value;

                        if (type === 'tamanhosCalcados') {
                            const parsedNum = parseFloat(value);
                            newItem = isNaN(parsedNum) ? value : parsedNum;
                        }

                        if (!currentVariations.includes(newItem)) {
                            return {
                                ...prev,
                                variacoes: {
                                    ...prev.variacoes,
                                    [type]: [...currentVariations, newItem]
                                }
                            };
                        }
                        return prev;
                    });
                    inputElement.value = '';
                }
            }
        }
    };

    const handleRemoveVariacaoTag = (type: 'tamanhosRoupas' | 'tamanhosCalcados' | 'cores', itemToRemove: string | number) => {
        setFormData(prev => ({
            ...prev,
            variacoes: {
                ...prev.variacoes,
                [type]: (prev.variacoes?.[type] || []).filter(item => item !== itemToRemove)
            }
        }));
    };


    const handleAddImage = () => {
        setFormData(prev => ({
            ...prev,
            imagensAdicionais: [...(prev.imagensAdicionais || []), '']
        }));
        setTimeout(() => {
            const newIndex = (formData.imagensAdicionais?.length || 0);
            if (fileInputRefs.current[newIndex]) {
                fileInputRefs.current[newIndex]?.click();
            }
        }, 0);
    };
    
    // CORREÇÃO: Lógica para upload de imagem para o Supabase
    const handleImageChange = (index: number, url: string) => { // Refatorado para aceitar uma URL
        setFormData(prev => {
            const newImages = [...(prev.imagensAdicionais || [])];
            newImages[index] = url;
            return { ...prev, imagensAdicionais: newImages };
        });
        if (url.startsWith('http') || url.startsWith('data:image')) {
            setShowUrlInputIndex(null);
        }
    };
    
    const handleFileUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const { data, error } = await supabase.storage
            .from('imagens-produtos') // Substitua pelo nome do seu bucket
            .upload(`${formData.id}-${file.name}`, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Erro ao fazer upload da imagem:', error);
            alert('Erro ao fazer upload da imagem.');
            return;
        }

        const { data: publicUrlData } = supabase.storage
            .from('imagens-produtos')
            .getPublicUrl(data.path);
        
        handleImageChange(index, publicUrlData.publicUrl);
    };

    const handleRemoveImage = (index: number) => {
        setFormData(prev => {
            const newImages = [...(prev.imagensAdicionais || [])];
            newImages.splice(index, 1);
            return { ...prev, imagensAdicionais: newImages };
        });
        setShowUrlInputIndex(null);
    };

    const handleFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileUpload(index, e);
        }
        e.target.value = '';
    };

    const toggleUrlInput = (index: number, event?: React.MouseEvent) => {
        event?.stopPropagation();
        setShowUrlInputIndex(showUrlInputIndex === index ? null : index);
    };

    const handleAddPersonalizationField = (type: 'text' | 'numeric') => {
        if (type === 'text') {
            setFormData(prev => ({
                ...prev,
                personalizacaoTextoCampos: [...(prev.personalizacaoTextoCampos || []), { id: `text_${Date.now()}`, label: 'Título do Campo de Texto', maxCaracteres: 50 }]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                personalizacaoNumericaCampos: [...(prev.personalizacaoNumericaCampos || []), { id: `num_${Date.now()}`, label: 'Título do Campo Numérico (Ex: Tamanho Aro)', min: 0, max: 100 }]
            }));
        }
    };

    const handlePersonalizationFieldChange = (
        type: 'text' | 'numeric',
        id: string,
        field: string,
        value: string | number
    ) => {
        if (type === 'text') {
            setFormData(prev => ({
                ...prev,
                personalizacaoTextoCampos: (prev.personalizacaoTextoCampos || []).map(f =>
                    f.id === id ? { ...f, [field]: value } : f
                )
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                personalizacaoNumericaCampos: (prev.personalizacaoNumericaCampos || []).map(f =>
                    f.id === id ? { ...f, [field]: value } : f
                )
            }));
        }
    };

    const handleRemovePersonalizationField = (type: 'text' | 'numeric', id: string) => {
        if (type === 'text') {
            setFormData(prev => ({
                ...prev,
                personalizacaoTextoCampos: (prev.personalizacaoTextoCampos || []).filter(f => f.id !== id)
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                personalizacaoNumericaCampos: (prev.personalizacaoNumericaCampos || []).filter(f => f.id !== id)
            }));
        }
    };

    const generateSku = () => {
        const timestamp = Date.now().toString().slice(-6);
        const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
        const categoryPrefix = formData.categoria ? formData.categoria.substring(0, 3).toUpperCase() : 'PRO';
        const generatedSku = `${categoryPrefix}-${timestamp}-${randomStr}`;
        setFormData(prev => ({ ...prev, sku: generatedSku }));
    };

    const generateTextWithAI = (fieldName: 'descricao' | 'metaTitulo' | 'metaDescricao' | 'palavrasChave') => {
        const productName = formData.nome || "este produto";
        const category = formData.categoria || "diversos";
        
        let generatedContent = '';
        switch (fieldName) {
            case 'descricao':
                generatedContent = `Descubra a inovação do(a) ${productName}, um item essencial na categoria de ${category}. Desenvolvido para ${Math.random() > 0.5 ? 'facilitar seu dia a dia' : 'oferecer a melhor experiência'}, este produto combina qualidade e design.`;
                break;
            case 'metaTitulo':
                generatedContent = `${productName} | Compre ${productName} Online - ${category}`;
                break;
            case 'metaDescricao':
                generatedContent = `Encontre ${productName} em ${category} com o melhor preço. Qualidade garantida e entrega rápida. Ideal para quem busca ${Math.random() > 0.5 ? 'conforto e durabilidade' : 'estilo e funcionalidade'}.`;
                break;
            case 'palavrasChave':
                generatedContent = `${productName.toLowerCase()}, ${category.toLowerCase()}, loja online, ${Math.random() > 0.5 ? 'promoção' : 'novidade'}`;
                break;
            default:
                generatedContent = 'Texto gerado por IA (placeholder).';
        }

        setTimeout(() => {
            setFormData(prev => ({ ...prev, [fieldName]: generatedContent }));
            alert(`Texto para "${fieldName}" gerado com sucesso pela IA! (Simulado)`);
        }, 1000);
    };


    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.nome.trim()) newErrors.nome = 'Nome é obrigatório.';
        if (!formData.categoria.trim()) newErrors.categoria = 'Categoria é obrigatória.';
        if (formData.estoque !== null && formData.estoque < 0) newErrors.estoque = 'Estoque não pode ser negativo.';
        if (formData.preco !== null && formData.preco <= 0) newErrors.preco = 'Preço deve ser maior que zero.';
        
        const precoPromocionalValue = formData.precoPromocional;
        if (precoPromocionalValue !== null && precoPromocionalValue !== undefined) {
             if (precoPromocionalValue <= 0) {
                 newErrors.precoPromocional = 'Preço promocional deve ser maior que zero.';
             } else if (formData.preco !== null && precoPromocionalValue >= formData.preco) {
                 newErrors.precoPromocional = 'Preço promocional deve ser menor que o preço normal.';
             }
        }
        
        if (!formData.imagensAdicionais || formData.imagensAdicionais.length === 0 || !formData.imagensAdicionais[0]?.trim()) {
            newErrors.imagensAdicionais = 'Pelo menos uma Imagem é obrigatória.';
        } else if (formData.imagensAdicionais[0] && !/^https?:\/\/.+\.(png|jpg|jpeg|gif|svg|data:image)/i.test(formData.imagensAdicionais[0])) {
            newErrors.imagensAdicionais = 'URL/Formato de Imagem principal inválida. Use um link válido ou faça upload.';
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

    const tagStyle: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: colors.accent,
        color: colors.white,
        borderRadius: '4px',
        padding: '5px 8px',
        marginRight: '5px',
        marginBottom: '5px',
        fontSize: typography.smallSize,
        fontFamily: typography.fontFamily,
        gap: '5px',
        cursor: 'default',
    };

    const removeTagButtonStyle: React.CSSProperties = {
        background: 'none',
        border: 'none',
        color: colors.white,
        cursor: 'pointer',
        fontSize: '0.7rem',
        marginLeft: '5px',
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    };

    const aiButtonSmall: React.CSSProperties = {
        backgroundColor: colors.accent,
        color: colors.white,
        border: 'none',
        borderRadius: '9999px',
        padding: '5px 10px',
        cursor: 'pointer',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        transition: 'background-color 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        flexShrink: 0,
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Seção de Imagens (movida para o topo e com upload de arquivo) */}
            <h2 style={sectionTitleStyle}>Imagens do Produto</h2>
            <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginBottom: '10px', fontFamily: typography.fontFamily }}>
                A primeira imagem adicionada será a imagem principal. Clique nos quadrados para selecionar imagens do seu computador ou cole uma URL.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '10px' }}>
                {(formData.imagensAdicionais || []).map((imgUrl, index) => (
                    <div key={index} style={{
                        position: 'relative',
                        width: '100px',
                        height: '100px',
                        border: `1px solid ${errors.imagensAdicionais && index === 0 ? colors.danger : colors.border}`,
                        borderRadius: '4px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        backgroundColor: colors.background,
                        cursor: 'pointer',
                    }}
                    onClick={() => fileInputRefs.current[index]?.click()}
                    title={index === 0 ? "Imagem Principal" : `Imagem Adicional ${index}`}
                    >
                        {imgUrl ? (
                            <img src={imgUrl} alt={`Imagem ${index + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <FaImage size={30} color={colors.lightText} />
                        )}
                        {index === 0 && <span style={{ position: 'absolute', bottom: '0px', backgroundColor: 'rgba(0,0,0,0.5)', color: 'white', fontSize: '0.6rem', padding: '2px 5px', borderRadius: '3px', whiteSpace: 'nowrap' }}>Principal</span>}
                        
                        <input
                            type="file"
                            accept="image/*"
                            ref={el => { if (el) fileInputRefs.current[index] = el; }}
                            onChange={(e) => handleFileChange(index, e)}
                            style={{ display: 'none' }}
                        />
                        
                        <button
                            type="button"
                            onClick={(e) => toggleUrlInput(index, e)}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                left: '5px',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                            title="Colar URL da Imagem"
                        >
                            <FaLink size={10} />
                        </button>

                        <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); handleRemoveImage(index); }}
                            style={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                backgroundColor: colors.danger,
                                color: colors.white,
                                border: 'none',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.8rem',
                                cursor: 'pointer',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            }}
                            title="Remover imagem"
                        >
                            <FaTimes size={10} />
                        </button>
                    </div>
                ))}
                <button
                    type="button"
                    onClick={handleAddImage}
                    style={{
                        width: '100px',
                        height: '100px',
                        border: `1px dashed ${colors.accent}`,
                        borderRadius: '4px',
                        backgroundColor: colors.background,
                        color: colors.accent,
                        fontSize: '2rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'border-color 0.2s, background-color 0.2s',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0e6ff'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.background}
                >
                    <FaPlus />
                </button>
            </div>
            {errors.imagensAdicionais && <p style={errorStyle}>{errors.imagensAdicionais}</p>}

            {showUrlInputIndex !== null && (
                <div style={{ marginTop: '10px' }}>
                    <label htmlFor={`url-input-${showUrlInputIndex}`} style={labelStyle}>Colar URL da Imagem (Opção Manual):</label>
                    <input
                        type="text"
                        id={`url-input-${showUrlInputIndex}`}
                        value={(formData.imagensAdicionais || [])[showUrlInputIndex] || ''}
                        onChange={(e) => handleImageChange(showUrlInputIndex, e.target.value)}
                        placeholder="Cole a URL completa da imagem aqui (ex: https://site.com/imagem.jpg)"
                        style={inputStyle}
                        onBlur={() => setShowUrlInputIndex(null)}
                        autoFocus
                    />
                </div>
            )}

            <h2 style={sectionTitleStyle}>Informações Básicas</h2>
            <div>
                <label htmlFor="nome" style={labelStyle}>Nome do Produto:</label>
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
                <label htmlFor="categoria" style={labelStyle}>Categoria:</label>
                <select
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    style={{ ...inputStyle, borderColor: errors.categoria ? colors.danger : colors.border, appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center', backgroundSize: '16px' }}
                >
                    <option value="">Selecione uma categoria</option>
                    {categorias.map((cat: string) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                {errors.categoria && <p style={errorStyle}>{errors.categoria}</p>}
            </div>

            <div>
                <label htmlFor="estoque" style={labelStyle}>Estoque:</label>
                <input
                    type="number"
                    id="estoque"
                    name="estoque"
                    value={formData.estoque ?? ''}
                    onChange={handleChange}
                    style={{ ...inputStyle, borderColor: errors.estoque ? colors.danger : colors.border }}
                />
                {errors.estoque && <p style={errorStyle}>{errors.estoque}</p>}
            </div>

            <div>
                <label htmlFor="preco" style={labelStyle}>Preço (R$):</label>
                <input
                    type="number"
                    id="preco"
                    name="preco"
                    value={formData.preco ?? ''}
                    onChange={handleChange}
                    step="0.01"
                    style={{ ...inputStyle, borderColor: errors.preco ? colors.danger : colors.border }}
                />
                {errors.preco && <p style={errorStyle}>{errors.preco}</p>}
            </div>

            <div>
                <label htmlFor="precoPromocional" style={labelStyle}>Preço Promocional (R$):</label>
                <input
                    type="number"
                    id="precoPromocional"
                    name="precoPromocional"
                    value={formData.precoPromocional ?? ''}
                    onChange={handleChange}
                    step="0.01"
                    placeholder="Opcional"
                    style={{ ...inputStyle, borderColor: errors.precoPromocional ? colors.danger : colors.border }}
                />
                {errors.precoPromocional && <p style={errorStyle}>{errors.precoPromocional}</p>}
            </div>

            <div>
                <label htmlFor="sku" style={labelStyle}>SKU (Opcional):</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        id="sku"
                        name="sku"
                        value={formData.sku || ''}
                        onChange={handleChange}
                        placeholder="Código único do produto"
                        style={inputStyle}
                    />
                    <button
                        type="button"
                        onClick={generateSku}
                        style={{ ...aiButtonSmall, backgroundColor: colors.secondary }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.secondary}
                    >
                        <FaMagic size={12} /> Gerar SKU
                    </button>
                </div>
            </div>

            <div>
                <label htmlFor="descricao" style={labelStyle}>Descrição (Opcional):</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <textarea
                        id="descricao"
                        name="descricao"
                        value={formData.descricao || ''}
                        onChange={handleChange}
                        rows={5}
                        style={{ ...inputStyle, resize: 'vertical', flexGrow: 1 }}
                    />
                    <button
                        type="button"
                        onClick={() => generateTextWithAI('descricao')}
                        style={{ ...aiButtonSmall, alignSelf: 'flex-start' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                    >
                        <FaBrain size={12} /> Gerar com IA
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <input
                    type="checkbox"
                    id="ativo"
                    name="ativo"
                    checked={formData.ativo}
                    onChange={handleChange}
                    style={{ transform: 'scale(1.2)' }}
                />
                <label htmlFor="ativo" style={{ ...labelStyle, marginBottom: 0 }}>Produto Ativo no Site</label>
            </div>

            <h2 style={sectionTitleStyle}>Variações</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <input
                    type="checkbox"
                    id="hasVariacoes"
                    name="hasVariacoes"
                    checked={formData.hasVariacoes || false}
                    onChange={handleChange}
                    style={{ transform: 'scale(1.2)' }}
                />
                <label htmlFor="hasVariacoes" style={{ ...labelStyle, marginBottom: 0 }}>Seu produto tem variações (tamanhos, cores, etc.)?</label>
            </div>

            {formData.hasVariacoes && (
                <div style={{ border: `1px dashed ${colors.border}`, padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginBottom: '10px', fontFamily: typography.fontFamily }}>
                        Digite os valores e pressione **vírgula (,) ou Enter** para adicionar cada variação. Clique no "X" para remover.
                    </p>
                    <div>
                        <label htmlFor="tamanhosRoupas" style={labelStyle}>Tamanhos de Roupas (Ex: P, M, G):</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', border: `1px solid ${colors.border}`, borderRadius: '6px', padding: '5px', backgroundColor: colors.white }}>
                            {(formData.variacoes?.tamanhosRoupas || []).map((t, i) => (
                                <span key={t + i} style={tagStyle}>
                                    {t}
                                    <button type="button" onClick={() => handleRemoveVariacaoTag('tamanhosRoupas', t)} style={removeTagButtonStyle}><FaTimes /></button>
                                </span>
                            ))}
                            <input
                                type="text"
                                id="tamanhosRoupas"
                                name="tamanhosRoupas"
                                onKeyDown={(e) => handleVariacaoKeyDown('tamanhosRoupas', e)}
                                placeholder="Adicionar tamanho"
                                ref={variacaoInputRefs.tamanhosRoupas}
                                style={{ ...inputStyle, border: 'none', outline: 'none', flexGrow: 1, minWidth: '100px', padding: '5px' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="tamanhosCalcados" style={labelStyle}>Tamanhos de Calçados (Ex: 34, 35.5, 36):</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', border: `1px solid ${colors.border}`, borderRadius: '6px', padding: '5px', backgroundColor: colors.white }}>
                            {(formData.variacoes?.tamanhosCalcados || []).map((t, i) => (
                                <span key={t + i} style={tagStyle}>
                                    {t}
                                    <button type="button" onClick={() => handleRemoveVariacaoTag('tamanhosCalcados', t)} style={removeTagButtonStyle}><FaTimes /></button>
                                </span>
                            ))}
                            <input
                                type="text"
                                id="tamanhosCalcados"
                                name="tamanhosCalcados"
                                onKeyDown={(e) => handleVariacaoKeyDown('tamanhosCalcados', e)}
                                placeholder="Adicionar tamanho"
                                ref={variacaoInputRefs.tamanhosCalcados}
                                style={{ ...inputStyle, border: 'none', outline: 'none', flexGrow: 1, minWidth: '100px', padding: '5px' }}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="cores" style={labelStyle}>Cores (Ex: Vermelho, #FF0000, Azul):</label>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', border: `1px solid ${colors.border}`, borderRadius: '6px', padding: '5px', backgroundColor: colors.white }}>
                            {(formData.variacoes?.cores || []).map((c, i) => (
                                <span key={c + i} style={tagStyle}>
                                    {c}
                                    <button type="button" onClick={() => handleRemoveVariacaoTag('cores', c)} style={removeTagButtonStyle}><FaTimes /></button>
                                </span>
                            ))}
                            <input
                                type="text"
                                id="cores"
                                name="cores"
                                onKeyDown={(e) => handleVariacaoKeyDown('cores', e)}
                                placeholder="Adicionar cor"
                                ref={variacaoInputRefs.cores}
                                style={{ ...inputStyle, border: 'none', outline: 'none', flexGrow: 1, minWidth: '100px', padding: '5px' }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <h2 style={sectionTitleStyle}>Personalização (Produto Sob Demanda)</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <input
                    type="checkbox"
                    id="isPersonalizado"
                    name="isPersonalizado"
                    checked={formData.isPersonalizado || false}
                    onChange={handleChange}
                    style={{ transform: 'scale(1.2)' }}
                />
                <label htmlFor="isPersonalizado" style={{ ...labelStyle, marginBottom: 0 }}>Seu produto permite personalização (ex: nome em camiseta, gravação em aliança)?</label>
            </div>

            {formData.isPersonalizado && (
                <div style={{ border: `1px dashed ${colors.border}`, padding: '15px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <p style={{ fontSize: typography.smallSize, color: colors.lightText, marginBottom: '10px', fontFamily: typography.fontFamily }}>
                        Configure os campos de personalização que o cliente preencherá na página do produto.
                    </p>

                    <h3 style={{ fontSize: typography.bodySize, color: colors.primary, marginBottom: '10px', fontFamily: typography.fontFamily }}>Campos de Texto Personalizado:</h3>
                    {(formData.personalizacaoTextoCampos || []).map((field, index) => (
                        <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={labelStyle}>Título do Campo para o Cliente:</label>
                            <input
                                type="text"
                                value={field.label}
                                onChange={(e) => handlePersonalizationFieldChange('text', field.id, 'label', e.target.value)}
                                placeholder="Ex: Nome na Aliança"
                                style={inputStyle}
                            />
                            <div>
                                <label style={labelStyle}>Max. Caracteres:</label>
                                <input
                                    type="number"
                                    value={field.maxCaracteres || ''}
                                    onChange={(e) => handlePersonalizationFieldChange('text', field.id, 'maxCaracteres', parseInt(e.target.value) || 0)}
                                    style={{ ...inputStyle, width: '120px' }}
                                />
                            </div>
                            <button type="button" onClick={() => handleRemovePersonalizationField('text', field.id)}
                                style={{ background: colors.danger, color: colors.white, border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', alignSelf: 'flex-start' }}>
                                <FaTrash size={12} /> Remover Campo
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddPersonalizationField('text')}
                        style={{ background: colors.accent, color: colors.white, border: 'none', borderRadius: '9999px', padding: '8px 15px', cursor: 'pointer', alignSelf: 'flex-start', fontSize: typography.smallSize }}>
                        <FaPlus /> adicionar campo de texto
                    </button>

                    <h3 style={{ fontSize: typography.bodySize, color: colors.primary, marginTop: '20px', marginBottom: '10px', fontFamily: typography.fontFamily }}>Campos Numéricos Personalizados:</h3>
                    {(formData.personalizacaoNumericaCampos || []).map((field, index) => (
                        <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                            <label style={labelStyle}>Título do Campo para o Cliente:</label>
                            <input
                                type="text"
                                value={field.label}
                                onChange={(e) => handlePersonalizationFieldChange('numeric', field.id, 'label', e.target.value)}
                                placeholder="Ex: Tamanho do Aro (8-40)"
                                style={inputStyle}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Mínimo:</label>
                                    <input
                                        type="number"
                                        value={field.min || ''}
                                        onChange={(e) => handlePersonalizationFieldChange('numeric', field.id, 'min', parseInt(e.target.value) || 0)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={labelStyle}>Máximo:</label>
                                    <input
                                        type="number"
                                        value={field.max || ''}
                                        onChange={(e) => handlePersonalizationFieldChange('numeric', field.id, 'max', parseInt(e.target.value) || 0)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>
                            <button type="button" onClick={() => handleRemovePersonalizationField('numeric', field.id)}
                                style={{ background: colors.danger, color: colors.white, border: 'none', borderRadius: '4px', padding: '8px 12px', cursor: 'pointer', alignSelf: 'flex-start' }}>
                                <FaTrash size={12} /> Remover Campo
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={() => handleAddPersonalizationField('numeric')}
                        style={{ background: colors.accent, color: colors.white, border: 'none', borderRadius: '9999px', padding: '8px 15px', cursor: 'pointer', alignSelf: 'flex-start', fontSize: typography.smallSize }}>
                        <FaPlus /> adicionar campo numérico
                    </button>
                </div>
            )}


            <h2 style={sectionTitleStyle}>Detalhes de Envio</h2>
            <div>
                <label htmlFor="peso" style={labelStyle}>Peso (gramas):</label>
                <input
                    type="number"
                    id="peso"
                    name="peso"
                    value={formData.peso ?? ''}
                    onChange={handleChange}
                    placeholder="Ex: 500 (para 500g)"
                    style={inputStyle}
                />
            </div>
            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                    <label htmlFor="altura" style={labelStyle}>Altura (cm):</label>
                    <input type="number" id="altura" name="altura" value={formData.altura ?? ''} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="largura" style={labelStyle}>Largura (cm):</label>
                    <input type="number" id="largura" name="largura" value={formData.largura ?? ''} onChange={handleChange} style={inputStyle} />
                </div>
                <div style={{ flex: 1 }}>
                    <label htmlFor="comprimento" style={labelStyle}>Comprimento (cm):</label>
                    <input type="number" id="comprimento" name="comprimento" value={formData.comprimento ?? ''} onChange={handleChange} style={inputStyle} />
                </div>
            </div>
             {/* CORREÇÃO: Adicionando campos de Frete e Pagamento */}
             <h2 style={sectionTitleStyle}>Opções de Frete e Pagamento</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                        type="checkbox"
                        id="freteGratis"
                        name="freteGratis"
                        checked={formData.freteGratis || false}
                        onChange={handleChange}
                        style={{ transform: 'scale(1.2)' }}
                    />
                    <label htmlFor="freteGratis" style={{ ...labelStyle, marginBottom: 0 }}>Oferecer Frete Grátis para este produto?</label>
                </div>
                <div>
                    <label htmlFor="formasPagamento" style={labelStyle}>Formas de Pagamento Aceitas:</label>
                    <select
                        id="formasPagamento"
                        name="formasPagamento"
                        value={formData.formasPagamento?.[0] || 'todos'}
                        onChange={(e) => setFormData(prev => ({ ...prev, formasPagamento: [e.target.value] }))}
                        style={inputStyle}
                    >
                        {formasPagamentoDisponiveis.map(op => (
                            <option key={op.id} value={op.id}>{op.nome}</option>
                        ))}
                    </select>
                </div>
            </div>

            <h2 style={sectionTitleStyle}>SEO e Divulgação</h2>
            <div>
                <label htmlFor="metaTitulo" style={labelStyle}>Meta Título (SEO):</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        id="metaTitulo"
                        name="metaTitulo"
                        value={formData.metaTitulo || ''}
                        onChange={handleChange}
                        placeholder="Título para motores de busca (max 60 caracteres)"
                        maxLength={60}
                        style={{ ...inputStyle, flexGrow: 1 }}
                    />
                    <button
                        type="button"
                        onClick={() => generateTextWithAI('metaTitulo')}
                        style={aiButtonSmall}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                    >
                        <FaBrain size={12} /> Gerar com IA
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="metaDescricao" style={labelStyle}>Meta Descrição (SEO):</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                    <textarea
                        id="metaDescricao"
                        name="metaDescricao"
                        value={formData.metaDescricao || ''}
                        onChange={handleChange}
                        placeholder="Descrição para motores de busca (max 160 caracteres)"
                        maxLength={160}
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical', flexGrow: 1 }}
                    />
                    <button
                        type="button"
                        onClick={() => generateTextWithAI('metaDescricao')}
                        style={{ ...aiButtonSmall, alignSelf: 'flex-start' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                    >
                        <FaBrain size={12} /> Gerar com IA
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="palavrasChave" style={labelStyle}>Palavras-chave (SEO):</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        id="palavrasChave"
                        name="palavrasChave"
                        value={formData.palavrasChave || ''}
                        onChange={handleChange}
                        placeholder="Separe por vírgulas (Ex: joia, anel, prata)"
                        style={inputStyle}
                    />
                    <button
                        type="button"
                        onClick={() => generateTextWithAI('palavrasChave')}
                        style={aiButtonSmall}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                    >
                        <FaBrain size={12} /> Gerar com IA
                    </button>
                </div>
            </div>
            <div>
                <label htmlFor="urlAmigavel" style={labelStyle}>URL Amigável (Slug):</label>
                <input
                    type="text"
                    id="urlAmigavel"
                    name="urlAmigavel"
                    value={formData.urlAmigavel || ''}
                    onChange={handleChange}
                    placeholder="seu-produto-incrivel"
                    style={{ ...inputStyle, backgroundColor: '#f0f0f0' }}
                />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                {produtoInicial && produtoInicial.id !== 0 && onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(produtoInicial)}
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
                        Excluir Produto
                    </button>
                )}
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
                    Salvar Produto
                </button>
            </div>
        </form>
    );
};

export default FormularioProduto;
