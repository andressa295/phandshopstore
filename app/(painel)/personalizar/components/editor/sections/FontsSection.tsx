'use client';

import React from 'react';
import { ThemeConfig, ThemeUpdateFn } from '../../../types'; 
import styles from './FontsSection.module.css'; 
import editorStyles from '../../../context/theme-editor-panel.module.css'; 

interface FontsSectionProps {
  config: ThemeConfig; 
  updateConfig: ThemeUpdateFn; 
}

const modernFonts = [
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Inter', label: 'Inter' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Oswald', label: 'Oswald (Títulos)' },
  { value: 'Playfair Display', label: 'Playfair Display (Títulos)' },
  { value: 'sans-serif', label: 'Padrão do Sistema (Sans-serif)' },
  { value: 'serif', label: 'Padrão do Sistema (Serif)' },
];


const FontsSection: React.FC<FontsSectionProps> = ({ config, updateConfig }) => {

  const getSafeValue = <K extends keyof ThemeConfig>(key: K): ThemeConfig[K] | '' => {
    return config[key] ?? '';
  };

  const handlePrimaryFontChange = (value: string) => {
    updateConfig({ primaryFont: value });
  };

  const handleSecondaryFontChange = (value: string) => {
    updateConfig({ secondaryFont: value });
  };

  const handleTitleFontSizeChange = (value: 'small' | 'medium' | 'large') => {
    updateConfig({ titleBaseFontSize: value }); 
  };

  const handleTextFontSizeChange = (value: 'small' | 'medium' | 'large') => {
    updateConfig({ textBaseFontSize: value }); 
  };


  return (
    <div className={styles.fontsSection}> {/* Uso da classe 'fontsSection' do Styles */}
      <h3 className={styles.sectionTitle}>Fontes do Tema</h3> {/* Uso da classe 'sectionTitle' do Styles */}

      {/* Fonte Principal (para Títulos) */}
      <div className={editorStyles.inputGroup}>
        <label htmlFor="primaryFont" className={editorStyles.inputLabel}>
          Fonte Principal (Títulos):
        </label>
        <select
          id="primaryFont"
          className={editorStyles.selectInput}
          value={getSafeValue('primaryFont')}
          onChange={(e) => handlePrimaryFontChange(e.target.value)}
        >
          {modernFonts.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
        <p className={editorStyles.fieldDescription}>
          Escolha a fonte principal para títulos e cabeçalhos da loja.
        </p>
      </div>

      {/* Fonte Secundária (para Texto do Corpo) */}
      <div className={editorStyles.inputGroup}>
        <label htmlFor="secondaryFont" className={editorStyles.inputLabel}>
          Fonte Secundária (Texto):
        </label>
        <select
          id="secondaryFont"
          className={editorStyles.selectInput}
          value={getSafeValue('secondaryFont')}
          onChange={(e) => handleSecondaryFontChange(e.target.value)}
        >
          {modernFonts.map(font => (
            <option key={font.value} value={font.value}>{font.label}</option>
          ))}
        </select>
        <p className={editorStyles.fieldDescription}>
          Escolha a fonte para o corpo do texto, parágrafos e descrições gerais.
        </p>
      </div>

      {/* Tamanho da Fonte do Título (GLOBAL) */}
      <div className={editorStyles.inputGroup}>
        <label htmlFor="titleBaseFontSize" className={editorStyles.inputLabel}>
          Tamanho Base do Título:
        </label>
        <select
          id="titleBaseFontSize"
          className={editorStyles.selectInput}
          value={getSafeValue('titleBaseFontSize') || 'medium'}
          onChange={(e) => handleTitleFontSizeChange(e.target.value as 'small' | 'medium' | 'large')}
        >
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>
        <p className={editorStyles.fieldDescription}>
          Ajusta o tamanho base dos títulos (H1-H6) em toda a loja.
        </p>
      </div>

      {/* Tamanho da Fonte do Texto (GLOBAL) */}
      <div className={editorStyles.inputGroup}>
        <label htmlFor="textBaseFontSize" className={editorStyles.inputLabel}>
          Tamanho Base do Texto:
        </label>
        <select
          id="textBaseFontSize"
          className={editorStyles.selectInput}
          value={getSafeValue('textBaseFontSize') || 'medium'}
          onChange={(e) => handleTextFontSizeChange(e.target.value as 'small' | 'medium' | 'large')}
        >
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>
        <p className={editorStyles.fieldDescription}>
          Ajusta o tamanho base do corpo do texto em toda a loja.
        </p>
      </div>
    </div>
  );
};

export default FontsSection;