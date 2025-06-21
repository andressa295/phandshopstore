'use client';

import React, { useState, useEffect } from 'react';
import { Editor } from '@tinymce/tinymce-react'; 
import type { EmailTemplate } from '../../../../../../types/EmailTemplate'; 
import { FaBrain } from 'react-icons/fa'; 

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

interface FormularioEmailProps {
    emailTemplateInicial?: EmailTemplate | null;
    onSave: (template: EmailTemplate) => void;
    onCancel: () => void;
}

const FormularioEmail: React.FC<FormularioEmailProps> = ({ emailTemplateInicial, onSave, onCancel }) => {
    const [formData, setFormData] = useState<EmailTemplate>(
        emailTemplateInicial || {
            id: '', // Será definido na página de listagem/edição
            titulo: '',
            assuntoPadrao: '',
            conteudoHtmlPadrao: '',
            categoria: 'usuario', // Valor padrão, pode ser ajustado
            descricao: '',
            variaveisDisponiveis: [],
        }
    );

    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    // Efeito para garantir que o ID seja persistente para edição, se estiver editando
    useEffect(() => {
        if (emailTemplateInicial) {
            setFormData(emailTemplateInicial);
        }
    }, [emailTemplateInicial]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    // Handler para o conteúdo do TinyMCE
    const handleEditorChange = (content: string, editor: any) => {
        setFormData(prev => ({ ...prev, conteudoHtmlPadrao: content }));
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};
        if (!formData.titulo.trim()) newErrors.titulo = 'Título é obrigatório.';
        if (!formData.assuntoPadrao.trim()) newErrors.assuntoPadrao = 'Assunto Padrão é obrigatório.';
        if (!formData.conteudoHtmlPadrao.trim()) newErrors.conteudoHtmlPadrao = 'Conteúdo do E-mail é obrigatório.';
        // Você pode adicionar mais validações aqui, como para a categoria

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

    // Função para simular geração de texto com IA
    const generateTextWithAI = (fieldName: 'assuntoPadrao' | 'conteudoHtmlPadrao') => {
        const emailTitle = formData.titulo || "este e-mail";
        const emailCategory = formData.categoria || "general";
        let generatedContent = '';

        switch (fieldName) {
            case 'assuntoPadrao':
                generatedContent = `[Assunto gerado por IA] Confirmação: Seu ${emailTitle} na loja ${Math.random() > 0.5 ? 'Online' : 'Phandshop'}`;
                break;
            case 'conteudoHtmlPadrao':
                generatedContent = `<p>Prezado(a) {{nome_cliente}},</p><p>Este é um e-mail gerado automaticamente para o seu ${emailTitle} na categoria de ${emailCategory}.</p><p>Agradecemos a sua interação e estamos à disposição para qualquer dúvida.</p><p>Atenciosamente,<br>A Equipe da Sua Loja</p>`;
                break;
        }

        setTimeout(() => {
            setFormData(prev => ({ ...prev, [fieldName]: generatedContent }));
            alert(`Texto para "${fieldName}" gerado com sucesso pela IA! (Simulado)`);
        }, 1000);
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
            <h2 style={sectionTitleStyle}>Editar Modelo de E-mail: {formData.titulo}</h2>
            
            <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Assunto Padrão do E-mail:</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input
                        type="text"
                        name="assuntoPadrao"
                        value={formData.assuntoPadrao}
                        onChange={handleChange}
                        style={{ ...inputStyle, flexGrow: 1, borderColor: errors.assuntoPadrao ? colors.danger : colors.border }}
                        placeholder="Ex: Seu pedido foi confirmado!"
                    />
                    <button
                        type="button"
                        onClick={() => generateTextWithAI('assuntoPadrao')}
                        style={aiButtonSmall}
                        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                    >
                        <FaBrain size={12} /> Gerar com IA
                    </button>
                </div>
                {errors.assuntoPadrao && <p style={errorStyle}>{errors.assuntoPadrao}</p>}
            </div>

            <div style={{ marginBottom: '15px' }}>
                <label style={labelStyle}>Conteúdo do E-mail:</label>
                <div style={{ border: `1px solid ${colors.border}`, borderRadius: '6px', overflow: 'hidden' }}>
                    <Editor
                        apiKey="2vrxigkd72tl6xw2kj1ndk4n11llg7087jo3aqn5x4730tx7" // Sua chave de API do TinyMCE
                        init={{
                            height: 400, // Aumenta a altura do editor
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
                        value={formData.conteudoHtmlPadrao}
                        onEditorChange={handleEditorChange}
                    />
                </div>
                {errors.conteudoHtmlPadrao && <p style={errorStyle}>{errors.conteudoHtmlPadrao}</p>}
                <button
                    type="button"
                    onClick={() => generateTextWithAI('conteudoHtmlPadrao')}
                    style={{ ...aiButtonSmall, alignSelf: 'flex-start', marginTop: '10px' }}
                    onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.primary}
                    onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => e.currentTarget.style.backgroundColor = colors.accent}
                >
                    <FaBrain size={12} /> Gerar com IA
                </button>
            </div>

            {/* Variáveis Disponíveis */}
            {formData.variaveisDisponiveis && formData.variaveisDisponiveis.length > 0 && (
                <div style={{ marginBottom: '15px' }}>
                    <p style={labelStyle}>Variáveis disponíveis para uso neste e-mail:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', fontSize: typography.smallSize, color: colors.lightText }}>
                        {formData.variaveisDisponiveis.map(variable => (
                            <span key={variable} style={{ backgroundColor: '#f0f0f0', padding: '3px 8px', borderRadius: '4px', border: `1px solid ${colors.border}` }}>
                                {variable}
                            </span>
                        ))}
                    </div>
                </div>
            )}

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
                    Salvar Modelo de E-mail
                </button>
            </div>
        </form>
    );
};

export default FormularioEmail;