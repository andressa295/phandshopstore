import React from 'react';
import SelectField from '../ui/SelectField';
import CheckboxField from '../ui/CheckboxField';
import ImageUploadSquare from '../ui/ImageUploadSquare';
import { Tema } from '../EditorContext';

interface DesignerTypeScreenProps {
    tema: Tema;
    handleTemaChange: (key: keyof Tema, value: any) => void;
    goBackToMainMenu: () => void;
}

const DesignerTypeScreen: React.FC<DesignerTypeScreenProps> = ({ tema, handleTemaChange }) => {
    const handleLogoUpload = (imageUrl: string | null) => {
        handleTemaChange('logoUrl', imageUrl);
    };

    const sectionStyle: React.CSSProperties = {
        border: '1px solid #eee',
        padding: '16px',
        borderRadius: '8px',
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

    const textStyle: React.CSSProperties = {
        fontSize: '0.85rem',
        color: '#666',
        fontFamily: 'Poppins, sans-serif'
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
            
            <div style={sectionStyle}>
                <h4 style={titleStyle}>Logo</h4>
                <ImageUploadSquare
                    label="Upload da Logo da Loja:"
                    onImageUpload={handleLogoUpload}
                    currentImageUrl={tema.logoUrl}
                    recommendation="Tamanho recomendado: 250px x 60px (largura máxima). A altura será ajustada proporcionalmente."
                />
                <SelectField
                    label="Tamanho da logo no cabeçalho:"
                    value={tema.tamanhoLogo ?? ''}
                    onChange={(val) => handleTemaChange('tamanhoLogo', val)}
                    options={[
                        { value: 'pequeno', label: 'Pequeno (max 120px largura)' },
                        { value: 'medio', label: 'Médio (max 180px largura)' },
                        { value: 'grande', label: 'Grande (max 250px largura)' },
                    ]}
                />
            </div>

            <div style={sectionStyle}>
                <h4 style={titleStyle}>Cabeçalho em celulares</h4>
                <SelectField
                    label="Posição do logo:"
                    value={tema.posicaoLogoMobile ?? ''}
                    onChange={(val) => handleTemaChange('posicaoLogoMobile', val)}
                    options={[
                        { value: 'esquerda', label: 'Esquerda' },
                        { value: 'centralizado', label: 'Centralizado' },
                    ]}
                />
                <SelectField
                    label="Estilo do cabeçalho:"
                    value={tema.estiloCabecalhoMobile ?? ''}
                    onChange={(val) => handleTemaChange('estiloCabecalhoMobile', val)}
                    options={[
                        { value: 'menuBuscadorCarrinho', label: 'Menu, buscador e carrinho' },
                        { value: 'barraHorizontalCategorias', label: 'Barra horizontal de categorias' },
                        { value: 'barraPesquisaGrande', label: 'Barra de pesquisa grande' },
                    ]}
                />
                {tema.estiloCabecalhoMobile !== 'menuBuscadorCarrinho' && (
                    <p style={{ ...textStyle, fontSize: '0.75rem', marginTop: '0.5rem' }}>
                        * Para "Barra horizontal de categorias" ou "Barra de pesquisa grande", a exibição do menu pode ser diferente.
                    </p>
                )}
            </div>

            <div style={sectionStyle}>
                <h4 style={titleStyle}>Cabeçalho para computador</h4>
                <SelectField
                    label="Posição do logo:"
                    value={tema.posicaoLogoDesktop ?? ''}
                    onChange={(val) => handleTemaChange('posicaoLogoDesktop', val)}
                    options={[
                        { value: 'esquerda', label: 'Esquerda' },
                        { value: 'centralizado', label: 'Centralizado' },
                    ]}
                />
                <SelectField
                    label="Tamanho dos ícones:"
                    value={tema.estiloIconesDesktop ?? ''}
                    onChange={(val) => handleTemaChange('estiloIconesDesktop', val)}
                    options={[
                        { value: 'pequeno', label: 'Pequeno' },
                        { value: 'grande', label: 'Grande' },
                    ]}
                    description="Aplica-se a ícones de ajuda, conta e carrinho."
                />
            </div>

            <div style={sectionStyle}>
                <h4 style={titleStyle}>Borda</h4>
                <p style={{ ...textStyle, marginBottom: '1rem' }}>
                    Define a aparência geral das bordas, principalmente em fotos e banners.
                </p>
                <CheckboxField
                    label="Usar bordas arredondadas"
                    checked={tema.usarBordasArredondadas ?? false}
                    onChange={(val) => handleTemaChange('usarBordasArredondadas', val)}
                />
            </div>

            <div style={sectionStyle}>
                <h4 style={titleStyle}>Formatos dos botões</h4>
                <SelectField
                    label="Formato:"
                    value={tema.formatoBotoes ?? ''}
                    onChange={(val) => handleTemaChange('formatoBotoes', val)}
                    options={[
                        { value: 'quadrado', label: 'Quadrado' },
                        { value: 'oval', label: 'Oval' },
                        { value: 'redondo', label: 'Redondo' },
                    ]}
                />
            </div>
        </div>
    );
};

export default DesignerTypeScreen;
