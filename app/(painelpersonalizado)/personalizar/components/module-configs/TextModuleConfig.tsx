// app/(painelpersonalizado)/personalizar/components/module-configs/TextModuleConfig.tsx
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import TextField from '../ui/TextField';
import TextareaField from '../ui/TextareaField'; // Certifique-se de importar TextareaField
import { HomePageModule, Tema } from '../EditorContext';

interface TextModuleConfigProps {
    module: HomePageModule;
    // ONDE ESTAVA: goBack: () => void;
    // CORRIGIDO:
    goBackFromModuleConfig: () => void; // <<< MUDANÇA AQUI!
    handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
    tema: Tema;
    // Adicione handleTemaChange e handleNestedTemaChange se necessário neste módulo específico
    handleTemaChange: (key: keyof Tema, value: any) => void;
    handleNestedTemaChange?: (parentKey: keyof Tema, subKey: string, value: any) => void;
}

const TextModuleConfig: React.FC<TextModuleConfigProps> = ({
    module,
    goBackFromModuleConfig, // <<< E AQUI na desestruturação das props
    handleModuleConfigChange,
    tema,
    handleTemaChange
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
            {/* E AQUI no onClick do botão */}
            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
            </button>
            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Texto: {module.fullLabel || module.label}</h3>
            <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                Controles para Módulo de Texto (editor de texto, etc.)
            </p>

            <TextField
                label="Título da Seção:"
                value={module.config?.title ?? ''}
                onChange={(val) => handleModuleConfigChange(module.id, { title: val })}
                placeholder="Título da sua seção de texto"
            />
            <TextareaField
                label="Conteúdo do Texto:"
                value={module.config?.text ?? ''}
                onChange={(val) => handleModuleConfigChange(module.id, { text: val })}
                placeholder="Seu texto de boas vindas ou institucional."
                minHeight="100px"
                maxHeight="200px"
            />
            {/* E AQUI no onClick do botão de voltar */}
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
                    marginTop: 'auto',
                    fontFamily: 'Poppins, sans-serif'
                }}
            >
                Voltar
            </button>
        </div>
    );
};

export default TextModuleConfig;