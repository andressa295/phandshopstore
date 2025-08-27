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
  // Os componentes de seção agora pegam config e updateConfig diretamente do useTheme()
  // Não precisamos passá-los como props aqui.
  const { config, updateConfig, saveThemeConfig, isLoading, error } = useTheme();

  // Se estiver carregando ou com erro, exibe um feedback
  if (isLoading) {
    return <div className={styles.loadingMessage}>Carregando configurações do tema...</div>;
  }
  if (error) {
    return <div className={styles.errorMessage}>Erro ao carregar tema: {error}</div>;
  }
  if (!config) {
    return <div className={styles.noConfigMessage}>Nenhuma configuração de tema disponível.</div>;
  }

  // Renderiza o componente de seção correto com base em activeSection
  const renderSection = () => {
    switch (activeSection) {
      case 'cores':
        return <ColorsSection />; // Não passa props config/updateConfig
      case 'fontes':
        return <FontsSection />; // Não passa props config/updateConfig
      case 'cabecalho':
        return <HeaderSection />; // Não passa props config/updateConfig
      case 'pagina-inicial':
        return <HomepageEditor config={config} updateConfig={updateConfig} />; // HomepageEditor ainda espera essas props
      case 'lista-produtos':
        return <ProductListSection />; // Não passa props config/updateConfig
      case 'detalhes-produto':
        return <ProductDetailSection />; // Não passa props config/updateConfig
      case 'carrinho-compras':
        return <CartSection />; // Não passa props config/updateConfig
      case 'rodape-pagina':
        return <FooterSection />; // Não passa props config/updateConfig
      case 'tipo-designer': // Este pode ser o DesignTypeSection
        return <DesignTypeSection />; // Não passa props config/updateConfig
      case 'avancado':
        return <AdvancedSection />; // Não passa props config/updateConfig
      default:
        return (
          <div className={styles.noSectionSelected}>
            <p>Selecione uma seção no menu lateral para começar a editar.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.editorWrapper}>
      <button onClick={goBack} className={styles.backButton}>
        ← Voltar ao menu
      </button>
      <div className={styles.sectionContent}>
        {renderSection()}
      </div>
    </div>
  );
};

export default Editor;