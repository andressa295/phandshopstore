// app/(painelpersonalizado)/personalizar/components/module-configs/SocialModuleConfig.tsx
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import TextField from '../ui/TextField';
import { HomePageModule, Tema } from '../EditorContext';

interface SocialModuleConfigProps {
    module: HomePageModule;
    // Corrija aqui: espera goBackFromModuleConfig
    goBackFromModuleConfig: () => void; // <<< MUDANÇA AQUI!
    handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
    tema: Tema;
    handleNestedTemaChange: (parentKey: keyof Tema, subKey: string, value: any) => void;
}

const SocialModuleConfig: React.FC<SocialModuleConfigProps> = ({ 
    module, 
    goBackFromModuleConfig, // <<< MUDANÇA AQUI na desestruturação
    handleModuleConfigChange, 
    tema, 
    handleNestedTemaChange 
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
            {/* O botão agora chama a prop com o nome correto */}
            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
                <FaArrowLeft size={14} /> Voltar aos Módulos da Página Inicial
            </button>
            <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Social: {module.fullLabel || module.label}</h3>
            <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                Configurações de Redes Sociais (integração Instagram API).
            </p>

            <TextField
                label="Link do Instagram:"
                type="url"
                value={tema.redesSociaisLinks?.instagram ?? ''}
                onChange={(val) => handleNestedTemaChange('redesSociaisLinks', 'instagram', val)}
                placeholder="https://instagram.com/sua_loja"
            />
            {/* O botão agora chama a prop com o nome correto */}
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

export default SocialModuleConfig;