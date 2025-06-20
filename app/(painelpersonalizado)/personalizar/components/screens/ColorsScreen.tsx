import React from 'react';
import ColorPickerField from '../ui/ColorPickerField';
import { Tema, CoresTema } from '../EditorContext';

interface ColorsScreenProps {
    tema: Tema;
    handleTemaChange: (key: keyof Tema, value: any) => void;
    goBackToMainMenu: () => void;
}

const ColorsScreen: React.FC<ColorsScreenProps> = ({ tema, handleTemaChange }) => {
    const handleColorChange = (key: keyof CoresTema, value: string) => {
        handleTemaChange('cores', {
            ...tema.cores,
            [key]: value
        });
    };

    const sectionStyle: React.CSSProperties = {
        border: '1px solid #eee',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '1rem',
        backgroundColor: '#fff'
    };

    const titleStyle: React.CSSProperties = {
        margin: '0 0 12px 0',
        fontSize: '1.05rem',
        fontWeight: '600',
        color: '#333',
        fontFamily: 'Poppins, sans-serif'
    };

    const helperTextStyle: React.CSSProperties = {
        fontSize: '0.75rem',
        color: '#666',
        marginTop: '0.25rem',
        fontFamily: 'Poppins, sans-serif'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
            
            <div style={sectionStyle}>
                <h4 style={titleStyle}>Cores Principais da Marca</h4>
                <ColorPickerField
                    label="Cor principal"
                    description="Aparece nos botões, no preço do produto e nos textos do rodapé."
                    value={tema.cores.primaria}
                    onChange={(val) => handleColorChange('primaria', val)}
                />
                <ColorPickerField
                    label="Cor secundária"
                    description="Aparece na barra de anúncio."
                    value={tema.cores.secundaria}
                    onChange={(val) => handleColorChange('secundaria', val)}
                />
                <ColorPickerField
                    label="Cor de destaque"
                    description="Aparece nas promoções e nas mensagens de desconto, frete grátis e parcelamento sem juros."
                    value={tema.cores.destaque}
                    onChange={(val) => handleColorChange('destaque', val)}
                />
            </div>

            <div style={sectionStyle}>
                <h4 style={titleStyle}>Cores de Elementos Específicos</h4>
                <ColorPickerField
                    label="Fundo do Cabeçalho"
                    value={tema.cores.headerBg}
                    onChange={(val) => handleColorChange('headerBg', val)}
                />
                <ColorPickerField
                    label="Cor do Texto do Cabeçalho"
                    value={tema.cores.headerText}
                    onChange={(val) => handleColorChange('headerText', val)}
                />
                <ColorPickerField
                    label="Fundo do Rodapé"
                    value={tema.cores.footerBg}
                    onChange={(val) => handleColorChange('footerBg', val)}
                />
                <ColorPickerField
                    label="Cor do Texto do Rodapé"
                    value={tema.cores.footerText}
                    onChange={(val) => handleColorChange('footerText', val)}
                />
            </div>

            <div style={sectionStyle}>
                <h4 style={titleStyle}>Cores de Contraste</h4>
                <ColorPickerField
                    label="Cor de fundo"
                    value={tema.cores.fundo}
                    onChange={(val) => handleColorChange('fundo', val)}
                />
                <ColorPickerField
                    label="Cor dos textos"
                    value={tema.cores.texto}
                    onChange={(val) => handleColorChange('texto', val)}
                />
                <p style={helperTextStyle}>
                    Para facilitar a leitura, certifique-se de que as cores contrastem entre si.
                </p>
            </div>
        </div>
    );
};

export default ColorsScreen;
