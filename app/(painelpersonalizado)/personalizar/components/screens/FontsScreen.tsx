import React from 'react';
import SelectField from '../ui/SelectField';
import { Tema, TipografiaTema } from '../EditorContext';
import { webSafeFonts, fontSizeOptions } from '../utils/constants';

interface FontsScreenProps {
  tema: Tema;
  handleTemaChange: (key: keyof Tema, value: any) => void;
  goBackToMainMenu: () => void;
}

const FontsScreen: React.FC<FontsScreenProps> = ({ tema, handleTemaChange }) => {
  const fontWeights = [
    { value: 'normal', label: 'Normal' },
    { value: 'bold', label: 'Negrito' },
  ];

  const fontOptions = webSafeFonts.map((font) => ({ value: font, label: font }));

  const handleTipografiaChange = (key: keyof TipografiaTema, value: string) => {
    handleTemaChange('tipografia', {
      ...tema.tipografia,
      [key]: value,
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '0 20px',
        flexGrow: 1,
        overflowY: 'auto',
      }}
    >
      <div
        style={{
          border: '1px solid #eee',
          padding: '20px',
          borderRadius: '10px',
          marginBottom: '1rem',
        }}
      >
        <h4
          style={{
            margin: '0 0 12px 0',
            fontSize: '1rem',
            color: '#333',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Fonte de Título
        </h4>
        <SelectField
          label="Família da Fonte:"
          value={tema.tipografia.titulo}
          onChange={(val) => handleTipografiaChange('titulo', val)}
          options={fontOptions}
        />
        <SelectField
          label="Peso da Fonte:"
          value={tema.tipografia.tituloPeso}
          onChange={(val) => handleTipografiaChange('tituloPeso', val)}
          options={fontWeights}
        />
        <SelectField
          label="Tamanho da Fonte:"
          value={tema.tipografia.tituloTamanho}
          onChange={(val) => handleTipografiaChange('tituloTamanho', val)}
          options={fontSizeOptions}
        />
        <p
          style={{
            fontFamily: tema.tipografia.titulo,
            fontWeight: tema.tipografia.tituloPeso,
            fontSize: tema.tipografia.tituloTamanho,
            marginTop: '15px',
            borderTop: '1px dashed #eee',
            paddingTop: '10px',
          }}
        >
          Exemplo de Título
        </p>
      </div>

      <div
        style={{
          border: '1px solid #eee',
          padding: '20px',
          borderRadius: '10px',
        }}
      >
        <h4
          style={{
            margin: '0 0 12px 0',
            fontSize: '1rem',
            color: '#333',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          Textos da Página
        </h4>
        <SelectField
          label="Família da Fonte:"
          value={tema.tipografia.texto}
          onChange={(val) => handleTipografiaChange('texto', val)}
          options={fontOptions}
        />
        <SelectField
          label="Peso da Fonte:"
          value={tema.tipografia.textoPeso}
          onChange={(val) => handleTipografiaChange('textoPeso', val)}
          options={fontWeights}
        />
        <SelectField
          label="Tamanho da Fonte:"
          value={tema.tipografia.textoTamanho}
          onChange={(val) => handleTipografiaChange('textoTamanho', val)}
          options={fontSizeOptions}
        />
        <p
          style={{
            fontFamily: tema.tipografia.texto,
            fontWeight: tema.tipografia.textoPeso,
            fontSize: tema.tipografia.textoTamanho,
            marginTop: '15px',
            borderTop: '1px dashed #eee',
            paddingTop: '10px',
          }}
        >
          Exemplo de texto normal para o seu site.
        </p>
      </div>
    </div>
  );
};

export default FontsScreen;