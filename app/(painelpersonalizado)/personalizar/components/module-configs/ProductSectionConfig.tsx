// app\(editorpainel)\personalizar\components\module-configs\ProductSectionConfig.tsx
'use client';

import React, { Fragment, useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { HomePageModule, Tema } from '../EditorContext'; // Importe os tipos necessários

interface ProductSectionConfigProps {
    module: HomePageModule;
    tema: Tema; // Recebe o tema completo
    setTema: React.Dispatch<React.SetStateAction<Tema>>; // Recebe a função setTema
    handleTemaChange: (key: keyof Tema, value: any) => void; // Passada de Sidebar
    handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void; // Passada de Sidebar
    goBackFromModuleConfig: () => void; // Função para voltar, passada de Sidebar
}

export default function ProductSectionConfig({ 
    module, 
    tema, // O tema completo
    setTema, // A função setTema para atualizações diretas (se necessário)
    handleTemaChange, // Para atualizações de propriedades diretas do tema
    handleModuleConfigChange, // Para atualizações de config do módulo específico
    goBackFromModuleConfig 
}: ProductSectionConfigProps) {
    // Estado local para os campos do módulo, para permitir edição antes de salvar
    const [currentTitle, setCurrentTitle] = useState(module.config?.title || '');
    const [currentLayout, setCurrentLayout] = useState(module.config?.layout || 'grid');
    const [currentProductIds, setCurrentProductIds] = useState(module.config?.productIds || []);

    const handleSave = () => {
        // Usa handleModuleConfigChange para atualizar a configuração do módulo no estado pai (Sidebar)
        handleModuleConfigChange(module.id, { 
            title: currentTitle, 
            layout: currentLayout, 
            productIds: currentProductIds 
        });
        goBackFromModuleConfig(); // Volta para a lista de módulos
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
            </button>
            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar: {module.fullLabel || module.label}</h3>
            
            {/* Campos de configuração específicos para product_section */}
            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', fontFamily: 'Poppins, sans-serif' }}>Título para esta seção de produtos:</label>
            <input 
                type="text" 
                value={currentTitle} 
                onChange={(e) => setCurrentTitle(e.target.value)} 
                placeholder={`Ex: Nossos Destaques`} 
                style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', width: '100%', fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}
            />

            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', marginTop: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Layout dos produtos:</label>
            <div style={{ display: 'flex', gap: '15px' }}>
                <label style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>
                    <input type="radio" name={`${module.id}-layout`} value="grid" checked={currentLayout === 'grid'} onChange={() => setCurrentLayout('grid')} style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                    Grade
                </label>
                <label style={{ fontFamily: 'Poppins, sans-serif', fontSize: '0.85rem' }}>
                    <input type="radio" name={`${module.id}-layout`} value="carrossel" checked={currentLayout === 'carousel'} onChange={() => setCurrentLayout('carousel')} style={{ width: '16px', height: '16px', flexShrink: 0 }} />
                    Carrossel
                </label>
            </div>

            <label style={{ fontSize: '0.85rem', color: '#555', marginBottom: '5px', marginTop: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Escolher produtos:</label>
            <button 
                onClick={() => alert('Funcionalidade de seleção de produtos aqui!')}
                style={{ background: '#007bff', color: '#fff', border: 'none', padding: '0.75rem 1rem', borderRadius: '5px', cursor: 'pointer', fontSize: '0.85rem', fontFamily: 'Poppins, sans-serif' }}
            >
                Selecionar Produtos da Loja
            </button>
            <p style={{ fontSize: '0.7rem', color: '#777', marginTop: '0.5rem', fontFamily: 'Poppins, sans-serif' }}>{currentProductIds.length > 0 ? `Produtos selecionados: ${currentProductIds.join(', ')}` : 'Nenhum produto selecionado.'}</p>
            
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
                Salvar Configurações do Módulo
            </button>
        </div>
    );
}
