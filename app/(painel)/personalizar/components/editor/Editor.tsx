'use client';

import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import styles from './Editor.module.css'; 
import ColorsSection from './sections/ColorsSection';
import FontsSection from './sections/FontsSection';
import HeaderSection from './sections/HeaderSection';
import HomepageEditor from './HomepageEditor'; 

import ProductListSection from './sections/ProductListSection';
import ProductDetailSection from './sections/ProductDetailSection';
import CartSection from './sections/CartSection';
import FooterSection from './sections/FooterSection';
import DesignTypeSection from './sections/DesignTypeSection';
import AdvancedSection from './sections/AdvancedSection';

interface EditorProps {
  activeSection: string;
  goBack: () => void;
}

const Editor: React.FC<EditorProps> = ({ activeSection, goBack }) => {
  const { config, updateConfig, saveThemeConfig } = useTheme();

  const renderSection = () => {
    switch (activeSection) {
      case 'cores':
        return <ColorsSection config={config} updateConfig={updateConfig} />;
      case 'fontes':
        return <FontsSection config={config} updateConfig={updateConfig} />;
      case 'cabecalho':
        return <HeaderSection config={config} updateConfig={updateConfig} />;
      case 'pagina-inicial':
        return (
          <HomepageEditor
            config={config}
            updateConfig={updateConfig}
          />
        );
      case 'lista-produtos':
        return <ProductListSection config={config} updateConfig={updateConfig} />;
      case 'detalhes-produto':
        return <ProductDetailSection config={config} updateConfig={updateConfig} />;
      case 'carrinho-compras':
        return <CartSection config={config} updateConfig={updateConfig} />;
      case 'rodape-pagina':
        return <FooterSection config={config} updateConfig={updateConfig} />;
      case 'tipo-designer':
        return <DesignTypeSection config={config} updateConfig={updateConfig} />;
      case 'avancado':
        return (
          <AdvancedSection
            config={config}
            updateConfig={updateConfig}
            saveThemeConfig={saveThemeConfig}
          />
        );
      default:
        return <p className={styles.noSectionSelected}>Selecione uma seção para configurar.</p>;
    }
  };

  return (
    <div className={styles.editorWrapper} style={{ flexGrow: 1 }}>
      <button
        className={styles.backButton}
        onClick={goBack} 
      >
        ← Voltar ao menu
      </button>

      {renderSection()}

      <div className={styles.saveWrapper}>
        <button className={styles.saveButton} onClick={saveThemeConfig}>
          Salvar todas as alterações
        </button>
      </div>
    </div>
  );
};

export default Editor;