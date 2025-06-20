// app\(editorpainel)\personalizar\components\module-configs\CategoryGridConfig.tsx
'use client';

import React, { Fragment, useState } from 'react';
import { FaArrowLeft, FaPlus, FaTrash } from 'react-icons/fa';
import { HomePageModule, Tema } from '../EditorContext';

interface CategoryGridConfigProps {
    module: HomePageModule;
    tema: Tema;
    setTema: React.Dispatch<React.SetStateAction<Tema>>;
    handleTemaChange: (key: keyof Tema, value: any) => void;
    handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
    goBackFromModuleConfig: () => void;
}

export default function CategoryGridConfig({ 
    module, 
    handleModuleConfigChange, 
    goBackFromModuleConfig 
}: CategoryGridConfigProps) {
    const [currentTitle, setCurrentTitle] = useState(module.config?.title || '');
    const [currentCategories, setCurrentCategories] = useState(module.config?.categoryImages || []);

    const handleSave = () => {
        handleModuleConfigChange(module.id, { 
            title: currentTitle, 
            categoryImages: currentCategories 
        });
        goBackFromModuleConfig();
    };

    const handleCategoryChange = (index: number, field: 'name' | 'imageUrl' | 'link', value: string) => {
        const updatedCategories = [...currentCategories];
        if (!updatedCategories[index].id) {
            updatedCategories[index].id = `cat_${Date.now()}_${index}`;
        }
        updatedCategories[index] = { ...updatedCategories[index], [field]: value };
        setCurrentCategories(updatedCategories);
    };

    const handleAddCategory = () => {
        setCurrentCategories([...currentCategories, { id: `cat_${Date.now()}`, name: '', imageUrl: '', link: '' }]);
    };

    const handleRemoveCategory = (index: number) => {
        const updatedCategories = currentCategories.filter((_, i) => i !== index);
        setCurrentCategories(updatedCategories);
    };

    const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                handleCategoryChange(index, 'imageUrl', uploadEvent.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
            </button>
            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar: {module.fullLabel || module.label}</h3>
            
            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', fontFamily: 'Poppins, sans-serif' }}>Título para esta seção de categorias:</label>
            <input 
                type="text" 
                value={currentTitle} 
                onChange={(e) => setCurrentTitle(e.target.value)} 
                placeholder={`Ex: Nossas Categorias`} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}
            />

            <h4 style={{ margin: '15px 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>Categorias</h4>
            {currentCategories.map((cat, index) => (
                <div key={cat.id || index} style={{ border: '1px solid #eee', padding: '10px', borderRadius: '8px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif' }}>Categoria {index + 1}</span>
                        <button onClick={() => handleRemoveCategory(index)} style={{ background: 'none', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '1.2rem' }}>
                            <FaTrash />
                        </button>
                    </div>
                    
                    <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Nome da Categoria:</label>
                    <input 
                        type="text" 
                        value={cat.name} 
                        onChange={(e) => handleCategoryChange(index, 'name', e.target.value)} 
                        placeholder="Ex: Roupas" 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '10px' }}
                    />
                    
                    <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>URL da Imagem (quadrada recomendada):</label>
                    <input 
                        type="text" 
                        value={cat.imageUrl} 
                        onChange={(e) => handleCategoryChange(index, 'imageUrl', e.target.value)} 
                        placeholder="https://sua-loja.com/imagem-categoria.jpg" 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem', marginBottom: '5px' }}
                    />
                    <input 
                        type="file" 
                        onChange={(e) => handleImageUpload(index, e)} 
                        style={{ marginBottom: '10px', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}
                    />
                    {cat.imageUrl && (
                        <img src={cat.imageUrl} alt="Preview" style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'cover', borderRadius: '4px', border: '1px dashed #ccc' }} onError={(e) => (e.currentTarget.src = 'https://placehold.co/80x80/ccc/fff?text=Erro')} />
                    )}

                    <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', marginTop: '10px', display: 'block', fontFamily: 'Poppins, sans-serif' }}>Link da Categoria:</label>
                    <input 
                        type="text" 
                        value={cat.link} 
                        onChange={(e) => handleCategoryChange(index, 'link', e.target.value)} 
                        placeholder="https://sua-loja.com/categoria/roupas" 
                        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}
                    />
                </div>
            ))}
            <button 
                onClick={handleAddCategory} 
                style={{ background: '#28a745', color: '#fff', border: 'none', padding: '0.8rem 1rem', borderRadius: '5px', cursor: 'pointer', fontSize: '0.9rem', fontFamily: 'Poppins, sans-serif', display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center', maxWidth: 'fit-content', marginBottom: '20px' }}
            >
                <FaPlus size={14} /> Adicionar Categoria
            </button>

            <button 
                onClick={handleSave} 
                style={{ 
                    background: '#007bff', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '1rem', 
                    borderRadius: '5px', 
                    cursor: 'pointer', 
                    fontSize: '0.9rem', 
                    fontWeight: 'bold',
                    marginTop: 'auto',
                    fontFamily: 'Poppins, sans-serif' 
                }}
            >
                Salvar Configurações da Seção
            </button>
        </div>
    );
}