// app\(painelpersonalizado)\personalizar\components\screens\FooterScreen.tsx
import React, { Fragment, useCallback } from 'react';
import CheckboxField from '../ui/CheckboxField';
import ColorPickerField from '../ui/ColorPickerField';
import TextField from '../ui/TextField';
import TextareaField from '../ui/TextareaField';
import ImageUploadSquare from '../ui/ImageUploadSquare';
import { Tema } from '../EditorContext'; // Adapte o caminho conforme sua estrutura

// CORREÇÃO: Cast explícito para 'overflowY'
const containerStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '0.8rem',
    padding: '0 15px',
    flexGrow: 1,
    overflowY: 'auto' as const, // <<< CORREÇÃO AQUI: 'auto' as const
};

const sectionStyle = {
    border: '1px solid #eee',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '0.8rem'
};

const sectionLastStyle = {
    ...sectionStyle,
    marginBottom: '1.5rem'
};

const headingStyle = {
    margin: '0 0 10px 0',
    fontSize: '1rem',
    color: '#333',
    fontFamily: 'Poppins, sans-serif'
};

const paragraphStyle = {
    fontSize: '0.75rem',
    color: '#666',
    marginBottom: '1rem',
    fontFamily: 'Poppins, sans-serif'
};

interface FooterScreenProps {
    tema: Tema;
    handleTemaChange: (key: keyof Tema, value: any) => void;
    handleNestedTemaChange: (parentKey: keyof Tema, subKey: string, value: any) => void;
}

const FooterScreen: React.FC<FooterScreenProps> = React.memo(({ tema, handleTemaChange }) => {
    const handleSeloImageUpload = useCallback(
        (imageUrl: string | null) => {
            handleTemaChange('rodape_seloImagemUrl', imageUrl);
        },
        [handleTemaChange]
    );

    return (
        <div style={containerStyle}>
            {/* Cores */}
            <div style={sectionStyle}>
                <h4 style={headingStyle}>Cores</h4>
                <CheckboxField
                    label="Usar estas cores para o rodapé da página"
                    checked={tema.rodape_usarCoresPersonalizadas ?? false}
                    onChange={(val) => handleTemaChange('rodape_usarCoresPersonalizadas', val)}
                    aria-label="Usar cores personalizadas para rodapé"
                />
                {tema.rodape_usarCoresPersonalizadas && (
                    <Fragment>
                        <ColorPickerField
                            label="Cor de fundo"
                            value={tema.rodape_fundo ?? '#000000'}
                            onChange={(val) => handleTemaChange('rodape_fundo', val)}
                            aria-label="Cor de fundo do rodapé"
                        />
                        <ColorPickerField
                            label="Cor de texto e ícones"
                            value={tema.rodape_textoIcones ?? '#000000'}
                            onChange={(val) => handleTemaChange('rodape_textoIcones', val)}
                            aria-label="Cor de texto e ícones do rodapé"
                        />
                    </Fragment>
                )}
            </div>

            {/* Menu Inicial */}
            <div style={sectionStyle}>
                <h4 style={headingStyle}>Menu Inicial</h4>
                <CheckboxField
                    label="Exibir menu"
                    checked={tema.rodape_exibirMenu ?? false}
                    onChange={(val) => handleTemaChange('rodape_exibirMenu', val)}
                    aria-label="Exibir menu no rodapé"
                />
            </div>

            {/* Dados de Contato */}
            <div style={sectionStyle}>
                <h4 style={headingStyle}>Dados de contato</h4>
                <CheckboxField
                    label="Mostrar os dados de contato"
                    checked={tema.rodape_mostrarDadosContato ?? false}
                    onChange={(val) => handleTemaChange('rodape_mostrarDadosContato', val)}
                    aria-label="Mostrar dados de contato no rodapé"
                />
                {tema.rodape_mostrarDadosContato && (
                    <Fragment>
                        <TextField
                            label="Título:"
                            value={tema.rodape_tituloDadosContato ?? ''}
                            onChange={(val) => handleTemaChange('rodape_tituloDadosContato', val)}
                            placeholder="Entre em contato"
                            aria-label="Título dos dados de contato"
                        />
                    </Fragment>
                )}
            </div>

            {/* Redes Sociais */}
            <div style={sectionStyle}>
                <h4 style={headingStyle}>Redes sociais</h4>
                <TextField
                    label="Título:"
                    value={tema.rodape_tituloRedesSociais ?? ''}
                    onChange={(val) => handleTemaChange('rodape_tituloRedesSociais', val)}
                    placeholder="Permaneça conectado"
                    aria-label="Título das redes sociais"
                />
            </div>

            {/* Meio de Envio */}
            <div style={sectionStyle}>
                <h4 style={headingStyle}>Meio de envio</h4>
                <CheckboxField
                    label="Mostrar as opções de frete na sua loja."
                    checked={tema.rodape_mostrarOpcoesFrete ?? false}
                    onChange={(val) => handleTemaChange('rodape_mostrarOpcoesFrete', val)}
                    aria-label="Mostrar opções de frete"
                />
            </div>

            {/* Meio de Pagamento */}
            <div style={sectionStyle}>
                <h4 style={headingStyle}>Meio de pagamento</h4>
                <CheckboxField
                    label="Mostrar as opções de pagamento na sua loja."
                    checked={tema.rodape_mostrarOpcoesPagamento ?? false}
                    onChange={(val) => handleTemaChange('rodape_mostrarOpcoesPagamento', val)}
                    aria-label="Mostrar opções de pagamento"
                />
            </div>

            {/* Selos Personalizados no Rodapé */}
            <div style={sectionLastStyle}>
                <h4 style={headingStyle}>Selos personalizados no rodapé</h4>
                <p style={paragraphStyle}>
                    Você pode adicionar selos de duas formas: incluindo uma imagem ou adicionando um código HTML/JavaScript.
                </p>

                <ImageUploadSquare
                    label="Upload da imagem do selo:"
                    onImageUpload={handleSeloImageUpload}
                    currentImageUrl={tema.rodape_seloImagemUrl}
                    recommendation="Tamanho recomendado: 24px x 24px."
                    shape="square"
                />

                <TextareaField
                    label="Código HTML ou JavaScript para o selo:"
                    value={tema.rodape_seloHtmlCode ?? ''}
                    onChange={(val) => handleTemaChange('rodape_seloHtmlCode', val)}
                    placeholder=""
                    minHeight="38px"
                    maxHeight="150px"
                    aria-label="Código HTML ou JavaScript para o selo"
                />
            </div>
        </div>
    );
});

export default FooterScreen;