'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import type { PaginaInformativa } from '../../../../../types/PaginaInformativa';
import { FaBrain } from 'react-icons/fa';

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
    fontFamily: 'Poppins', // Use apenas o nome da família, o resto é no CSS global ou content_style
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
    bodySize: '0.95rem',
    smallSize: '0.8rem',
};

interface FormularioPaginaProps {
    paginaInicial?: PaginaInformativa | null;
    onSave: (pagina: PaginaInformativa) => void;
    onCancel: () => void;
    onDelete?: (pagina: PaginaInformativa) => void;
}

const FormularioPagina: React.FC<FormularioPaginaProps> = ({ paginaInicial, onSave, onCancel, onDelete }) => {
    const [formData, setFormData] = useState<PaginaInformativa>(
        paginaInicial || {
            id: 0,
            titulo: '',
            urlAmigavel: '',
            conteudoHtml: '',
            ativa: true,
            metaTitulo: '',
            metaDescricao: '',
        }
    );

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        if (!paginaInicial?.urlAmigavel && formData.titulo && !formData.urlAmigavel) {
            const slug = formData.titulo
                .toLowerCase()
                .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
                .replace(/[^\w\s-]/g, '')
                .replace(/[\s_-]+/g, '-')
                .replace(/^-+|-+$/g, '');
            setFormData(prev => ({ ...prev, urlAmigavel: slug }));
        }
    }, [formData.titulo, formData.urlAmigavel, paginaInicial?.urlAmigavel]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type, checked } = e.target as HTMLInputElement;
        setFormData((prev: PaginaInformativa) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
        if (errors[name]) {
            setErrors((prev: { [key: string]: string }) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleEditorChange = (content: string, editor: any) => {
        setFormData(prev => ({ ...prev, conteudoHtml: content }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório.';
        if (!formData.urlAmigavel.trim()) newErrors.urlAmigavel = 'URL Amigável é obrigatória.';
        else if (!/^[a-z0-9-]+$/.test(formData.urlAmigavel)) newErrors.urlAmigavel = 'URL Amigável deve conter apenas letras minúsculas, números e hífens.';

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

    const generateTextWithAI = (fieldName: 'conteudoHtml' | 'metaTitulo' | 'metaDescricao') => {
        const pageTitle = formData.titulo || "esta página";
        let generatedContent = '';

        switch (fieldName) {
            case 'conteudoHtml':
                generatedContent = `<p>Bem-vindo à nossa página "${pageTitle}". Aqui, você encontrará informações detalhadas sobre a nossa loja, nossa missão e o que nos torna especiais. Nosso objetivo é ${Math.random() > 0.5 ? 'oferecer produtos de alta qualidade' : 'proporcionar a melhor experiência de compra'} para você.</p><p>Explore nossa seleção e descubra o que fazemos de melhor.</p>`;
                break;
            case 'metaTitulo':
                generatedContent = `${pageTitle} | ${Math.random() > 0.5 ? 'Conheça Nossa História' : 'Sua Loja Online de Qualidade'}`;
                break;
            case 'metaDescricao':
                generatedContent = `Descubra mais sobre a ${pageTitle} da nossa loja. Comprometidos com ${Math.random() > 0.5 ? 'excelência e satisfação do cliente' : 'inovação e produtos exclusivos'}. Visite-nos!`;
                break;
        }

        setTimeout(() => {
            setFormData(prev => ({ ...prev, [fieldName]: generatedContent }));
            alert(`Texto para "${fieldName}" gerado com sucesso pela IA! (Simulado)`);
        }, 1000);
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
            <h2 style={sectionTitleStyle}>Informações da Página</h2>
            <div>
                <label htmlFor="titulo" style={labelStyle}>Título da Página:</label>
                <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    style={{ ...inputStyle, borderColor: errors.titulo ? colors.danger : colors.border }}
                />
                {errors.titulo && <p style={errorStyle}>{errors.titulo}</p>}
            </div>

            <div>
                <label htmlFor="urlAmigavel" style={labelStyle}>URL Amigável (ex: quem-somos):</label>
                <input
                    type="text"
                    id="urlAmigavel"
                    name="urlAmigavel"
                    value={formData.urlAmigavel}
                    onChange={handleChange}
                    placeholder="Gerado automaticamente, pode ser editado"
                    style={{ ...inputStyle, borderColor: errors.urlAmigavel ? colors.danger : colors.border, backgroundColor: '#f0f0f0' }}
                />
                {errors.urlAmigavel && <p style={errorStyle}>{errors.urlAmigavel}</p>}
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
                <label htmlFor="ativa" style={{ ...labelStyle, marginBottom: 0 }}>Página Ativa no Site</label>
            </div>

            <div>
                <label htmlFor="conteudoHtml" style={labelStyle}>Conteúdo da Página:</label>
                <div style={{ border: `1px solid ${colors.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                    <Editor
                        apiKey="2vrxigkd72tl6xw2kj1ndk4n11llg7087jo3aqn5x4730tx7" // Sua chave de API do TinyMCE
                        init={{
                            height: 300,
                            menubar: false,
                            plugins: [
                                'advlist autolink lists link image charmap print preview anchor',
                                'searchreplace visualblocks code fullscreen',
                                'insertdatetime media table paste code help wordcount'
                            ],
                            toolbar: 'undo redo | formatselect | ' +
                                'bold italic backcolor forecolor underline strikethrough | alignleft aligncenter ' +
                                'alignright alignjustify | bullist numlist outdent indent | ' +
                                'link image media | removeformat | help',
                            content_style: `
                                @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap');
                                body { font-family: 'Poppins', sans-serif; }
                                p { font-size: ${typography.bodySize}; line-height: 1.6; color: ${colors.text}; }
                                h1 { font-size: ${typography.headingSize}; color: ${colors.primary}; }
                                h2 { font-size: ${typography.subHeadingSize}; color: ${colors.primary}; }
                            `,
                            image_title: true,
                            automatic_uploads: false,
                            file_picker_callback: function (cb: (url: string, meta?: {alt?: string, title?: string}) => void, value: string, meta: {filetype: string}) {
                                const input = document.createElement('input');
                                input.setAttribute('type', 'url');
                                input.setAttribute('placeholder', 'Cole a URL da imagem aqui');

                                input.onchange = function (e: Event) {
                                    const target = e.target as HTMLInputElement;
                                    const url = target.value;
                                    if (url && (url.startsWith('http') || url.startsWith('https'))) {
                                        cb(url, { title: url });
                                    } else {
                                        alert('Por favor, cole uma URL de imagem válida.');
                                    }
                                };
                                input.click();
                            },
                        }}
                        value={formData.conteudoHtml}
                        onEditorChange={handleEditorChange}
                    />
                </div>
                {/* Botão Gerar com IA para o conteúdo do RTE */}
                <button
                    type="button"
                    onClick={() => generateTextWithAI('conteudoHtml')}
                    style={{ ...aiButtonSmall, alignSelf: 'flex-start', marginTop: '10px' }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = colors.primary}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = colors.accent}
                >
                    <FaBrain size={12} /> Gerar com IA
                </button>
            </div>

            <h2 style={sectionTitleStyle}>Otimização para Buscadores (SEO)</h2>
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px' }}>
                {paginaInicial && paginaInicial.id !== 0 && onDelete && (
                    <button
                        type="button"
                        onClick={() => onDelete(paginaInicial)}
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
                        Excluir Página
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
                    Salvar Página
                </button>
            </div>
        </form>
    );
};

export default FormularioPagina;