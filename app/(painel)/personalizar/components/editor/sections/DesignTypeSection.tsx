'use client';

import React from 'react';
import { ThemeConfig, ThemeUpdateFn } from '../../../types';
import styles from './DesignTypeSection.module.css'; // Continua importando o CSS correto

interface Props {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
}

const DesignTypeSection: React.FC<Props> = ({ config, updateConfig }) => {
  const designConfig = config.design || {
    buttonBorderRadius: 'rounded',
    buttonHoverAnimation: 'none',
    cartIcon: 'cart',
    showCartIconText: true,
    cartIconTextColor: '',
    imageBorderRadius: 'rounded',
    imageHoverEffect: 'none',
    enableShadows: true,
    shadowStyle: 'medium',
    enableCustomScrollbar: false,
    scrollbarColor: '#007bff',
    enableHoverEffects: true,
    enableClickAnimations: false,
  };

  const handleUpdate = (field: keyof typeof designConfig, value: any) => {
    updateConfig({
      design: {
        ...designConfig,
        [field]: value,
      },
    });
  };

  return (
    <div className={styles.sectionBlock}>
      <h3 className={styles.sectionTitle}>Opções de Design Global</h3>
      <p className={styles.sectionDescription}>
        Personalize o visual geral da sua loja, incluindo o estilo de botões, imagens e ícones.
      </p>

      <div className={styles.inputGroup}>
        <label htmlFor="buttonBorderRadius" className={styles.inputLabel}>Formato dos Botões:</label>
        <select
          id="buttonBorderRadius"
          className={styles.selectInput}
          value={designConfig.buttonBorderRadius}
          onChange={(e) => handleUpdate('buttonBorderRadius', e.target.value as 'square' | 'rounded' | 'oval')}
        >
          <option value="square">Quadrado</option>
          <option value="rounded">Bordas Arredondadas</option>
          <option value="oval">Oval (Bordas Super Arredondadas)</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="buttonHoverAnimation" className={styles.inputLabel}>Animação ao Passar o Mouse nos Botões:</label>
        <select
          id="buttonHoverAnimation"
          className={styles.selectInput}
          value={designConfig.buttonHoverAnimation}
          onChange={(e) => handleUpdate('buttonHoverAnimation', e.target.value as 'none' | 'scale' | 'opacity' | 'slide')}
        >
          <option value="none">Nenhum</option>
          <option value="scale">Escalar</option>
          <option value="opacity">Opacidade</option>
          <option value="slide">Slide</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="cartIcon" className={styles.inputLabel}>Ícone do Carrinho:</label>
        <select
          id="cartIcon"
          className={styles.selectInput}
          value={designConfig.cartIcon}
          onChange={(e) => handleUpdate('cartIcon', e.target.value as 'cart' | 'bag' | 'shopping_cart_outlined' | 'shopping_bag_outlined')}
        >
          <option value="cart">Carrinho (Padrão)</option>
          <option value="bag">Sacola de Compras</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={designConfig.showCartIconText}
            onChange={(e) => handleUpdate('showCartIconText', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Texto "Carrinho" ao lado do Ícone
        </label>
        {designConfig.showCartIconText && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="cartIconTextColor" className={styles.inputLabel}>Cor do Texto do Ícone:</label>
            <input
              type="color"
              id="cartIconTextColor"
              className={styles.colorInput}
              value={designConfig.cartIconTextColor || config.headerTextColor || '#000000'}
              onChange={(e) => handleUpdate('cartIconTextColor', e.target.value)}
            />
            <small className={styles.fieldDescription}>
              Deixe vazio para usar a cor padrão do texto do cabeçalho.
            </small>
          </div>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="imageBorderRadius" className={styles.inputLabel}>Formato das Imagens:</label>
        <select
          id="imageBorderRadius"
          className={styles.selectInput}
          value={designConfig.imageBorderRadius}
          onChange={(e) => handleUpdate('imageBorderRadius', e.target.value as 'square' | 'rounded' | 'circle')}
        >
          <option value="square">Quadrada</option>
          <option value="rounded">Bordas Arredondadas</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="imageHoverEffect" className={styles.inputLabel}>Efeito ao Passar o Mouse nas Imagens:</label>
        <select
          id="imageHoverEffect"
          className={styles.selectInput}
          value={designConfig.imageHoverEffect}
          onChange={(e) => handleUpdate('imageHoverEffect', e.target.value as 'none' | 'zoom' | 'grayscale' | 'overlay')}
        >
          <option value="none">Nenhum</option>
          <option value="zoom">Zoom Suave</option>
          <option value="grayscale">Escala de Cinza</option>
          <option value="overlay">Sobreposição de Cor</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={designConfig.enableShadows}
            onChange={(e) => handleUpdate('enableShadows', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Sombras em Elementos (Cartões, Imagens)
        </label>
        {designConfig.enableShadows && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="shadowStyle" className={styles.inputLabel}>Estilo da Sombra:</label>
            <select
              id="shadowStyle"
              className={styles.selectInput}
              value={designConfig.shadowStyle}
              onChange={(e) => handleUpdate('shadowStyle', e.target.value as 'none' | 'small' | 'medium' | 'large')}
            >
              <option value="none">Nenhuma Sombra</option>
              <option value="small">Pequena</option>
              <option value="medium">Média</option>
              <option value="large">Grande</option>
            </select>
          </div>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={designConfig.enableCustomScrollbar}
            onChange={(e) => handleUpdate('enableCustomScrollbar', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Barra de Rolagem Customizada
        </label>
        {designConfig.enableCustomScrollbar && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="scrollbarColor" className={styles.inputLabel}>Cor da Barra de Rolagem:</label>
            <input
              type="color"
              id="scrollbarColor"
              className={styles.colorInput}
              value={designConfig.scrollbarColor || config.primaryColor || '#000000'}
              onChange={(e) => handleUpdate('scrollbarColor', e.target.value)}
            />
            <small className={styles.fieldDescription}>
              Cor do "polegar" (thumb) da barra de rolagem.
            </small>
          </div>
        )}
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={designConfig.enableHoverEffects}
            onChange={(e) => handleUpdate('enableHoverEffects', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Efeitos de Destaque ao Passar o Mouse (links, ícones)
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={designConfig.enableClickAnimations}
            onChange={(e) => handleUpdate('enableClickAnimations', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Pequenas Animações ao Clicar (botões)
        </label>
      </div>

      {/* Se quiser adicionar um seletor para temas mais amplos (claro/escuro): */}
      {/*
      <div className={styles.inputGroup}>
        <label htmlFor="themeStyle" className={styles.inputLabel}>Estilo de Tema Geral:</label>
        <select
          id="themeStyle"
          className={styles.selectInput}
          value={designConfig.themeStyle}
          onChange={(e) => handleUpdate('themeStyle', e.target.value as 'light' | 'dark' | 'system')}
        >
          <option value="light">Claro</option>
          <option value="dark">Escuro</option>
          <option value="system">Seguir Preferência do Sistema</option>
        </select>
      </div>
      */}
    </div>
  );
};

export default DesignTypeSection;