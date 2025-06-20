import React, { useEffect, useCallback } from 'react';
import TextareaField from '../ui/TextareaField';
import { Tema } from '../EditorContext';

interface AdvancedCssScreenProps {
  tema: Tema;
  handleTemaChange: (key: keyof Tema, value: any) => void;
  goBackToMainMenu: () => void;
}

const AdvancedCssScreen: React.FC<AdvancedCssScreenProps> = ({
  tema,
  handleTemaChange,
  goBackToMainMenu,
}) => {
  const applyAdvancedCss = useCallback(() => {
    let styleTag = document.getElementById('advanced-css-style') as HTMLStyleElement;
    if (!styleTag) {
      styleTag = document.createElement('style');
      styleTag.id = 'advanced-css-style';
      document.head.appendChild(styleTag);
    }
    styleTag.textContent = tema.advancedCss || '';
  }, [tema.advancedCss]);

  useEffect(() => {
    applyAdvancedCss();
  }, [applyAdvancedCss]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '0.8rem',
        padding: '0 15px',
        flexGrow: 1,
        overflowY: 'auto',
        fontFamily: 'Poppins, sans-serif',
      }}
    >
      <button
        onClick={goBackToMainMenu}
        style={{
          background: 'none',
          border: 'none',
          color: '#7C3AED', // Roxo Phandshop, pra não perder o ritmo
          cursor: 'pointer',
          textAlign: 'left',
          marginBottom: '0.8rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontWeight: 'bold',
          fontSize: '1rem',
          fontFamily: 'Poppins, sans-serif',
        }}
        aria-label="Voltar ao menu principal"
      >
      </button>

      <p
        style={{
          fontSize: '0.85rem',
          color: '#666',
          marginBottom: '1rem',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Para web designers:
      </p>

      <TextareaField
        label=""
        value={tema.advancedCss ?? ''}
        onChange={(val) => handleTemaChange('advancedCss', val)}
        placeholder="/* Insira seu CSS personalizado aqui */"
        minHeight="250px"
        maxHeight="400px" // limite pra não explodir o layout
        style={{
          background: '#1e1e1e',
          color: '#d4d4d4',
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: '0.9rem',
          border: '1px solid #333',
          resize: 'vertical',
          overflowY: 'auto',
        }}
        description="Os comentários que você inclui não serão salvos."
      />

      <button
        onClick={applyAdvancedCss}
        style={{
          background: '#7C3AED',
          color: '#fff',
          border: 'none',
          padding: '0.6rem 0.8rem',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '0.85rem',
          fontWeight: 'normal',
          fontFamily: 'Poppins, sans-serif',
          marginTop: '1rem',
          maxWidth: 'fit-content',
          alignSelf: 'flex-end',
          boxShadow: '0 2px 6px rgba(124, 58, 237, 0.4)',
          transition: 'background-color 0.3s ease',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5a22c6')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#7C3AED')}
      >
        Testar CSS
      </button>
    </div>
  );
};

export default AdvancedCssScreen;
