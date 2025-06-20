// app/(painelpersonalizado)/personalizar/components/module-configs/NewsletterModuleConfig.tsx
import React from 'react';
import TextField from '../ui/TextField';
import TextareaField from '../ui/TextareaField';
import { HomePageModule, Tema } from '../EditorContext';

interface NewsletterModuleConfigProps {
    module: HomePageModule;
    // Corrija aqui: espera goBackFromModuleConfig
    goBackFromModuleConfig: () => void; // <<< MUDANÇA AQUI!
    handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
    tema: Tema;
    handleTemaChange: (key: keyof Tema, value: any) => void;
}

const NewsletterModuleConfig: React.FC<NewsletterModuleConfigProps> = ({ 
    module, 
    goBackFromModuleConfig, // <<< MUDANÇA AQUI na desestruturação
    handleModuleConfigChange, 
    tema, 
    handleTemaChange 
}) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px' }}>
            <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
            </button>
            <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
                Controles para Módulo de Newsletter (texto de chamada, integração).
            </p>

            <TextareaField
                label="Texto de Chamada:"
                value={tema.newsletterTexto ?? ''}
                onChange={(val) => handleTemaChange('newsletterTexto', val)}
                placeholder="Receba nossas novidades e promoções!"
                minHeight="80px"
                maxHeight="150px"
            />
            <TextField
                label="Placeholder do Campo de Email:"
                value={tema.newsletterPlaceholder ?? ''}
                onChange={(val) => handleTemaChange('newsletterPlaceholder', val)}
                placeholder="Digite seu e-mail aqui"
            />
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

export default NewsletterModuleConfig;