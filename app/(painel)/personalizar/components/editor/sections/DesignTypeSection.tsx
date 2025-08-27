// app/(painel)/personalizar/components/editor/DesignTypeSection.tsx
'use client';

import React, { useRef } from 'react';
import { ThemeConfig, ThemeUpdateFn, DesignConfig } from '../../../types'; // Importa DesignConfig
import styles from './DesignTypeSection.module.css';
import { useTheme } from '../../../context/ThemeContext'; // Importa useTheme

interface DesignTypeSectionProps {
  // config e updateConfig virão do useTheme, não mais de props diretas
}

const DesignTypeSection: React.FC<DesignTypeSectionProps> = () => { // Remove as props config e updateConfig
  const { config, updateConfig } = useTheme(); // Usa o hook para acessar o contexto

  // Garante que designConfig seja do tipo DesignConfig com valores padrão
  const designConfig: DesignConfig = config.design || {
    buttonBorderRadius: 'rounded',
    buttonHoverAnimation: 'none',
    buttonVariant: 'filled',
    cartIcon: 'shopping_bag_outlined',
    showCartIconText: false, // Valor padrão
    cartIconTextColor: '#333333', // Valor padrão
    imageBorderRadius: 'rounded',
    imageHoverEffect: 'none',
    enableShadows: true,
    shadowStyle: 'medium',
    enableCustomScrollbar: false, // Valor padrão
    scrollbarColor: '#333333', // Valor padrão
    enableHoverEffects: true,
    enableClickAnimations: false,
  };

  const handleUpdate = (field: keyof DesignConfig, value: any) => {
    updateConfig({
      design: {
        ...designConfig,
        [field]: value,
      },
    });
  };

  return (
    <div className={styles.sectionBlock}>
      <h3 className={styles.sectionTitle}>Design Global</h3>
      <p className={styles.sectionDescription}>
        Personalize o visual geral da sua loja, incluindo o estilo de botões, imagens e ícones.
      </p>

      {/* 1. Formato dos Botões */}
      <div className={styles.inputGroup}>
        <label htmlFor="buttonBorderRadius" className={styles.inputLabel}>Formato dos Botões:</label>
        <select
          id="buttonBorderRadius"
          className={styles.selectInput}
          value={designConfig.buttonBorderRadius ?? 'rounded'}
          onChange={(e) => handleUpdate('buttonBorderRadius', e.target.value as 'square' | 'rounded' | 'oval')}
        >
          <option value="square">Quadrado</option>
          <option value="rounded">Bordas Arredondadas</option>
          <option value="oval">Oval </option>
        </select>
        <p className={styles.fieldDescription}>Define o formato dos cantos de todos os botões da loja.</p>
      </div>

      {/* 2. Animação ao Passar o Mouse nos Botões */}
      <div className={styles.inputGroup}>
        <label htmlFor="buttonHoverAnimation" className={styles.inputLabel}>Animação ao Passar o Mouse nos Botões:</label>
        <select
          id="buttonHoverAnimation"
          className={styles.selectInput}
          value={designConfig.buttonHoverAnimation ?? 'none'}
          onChange={(e) => handleUpdate('buttonHoverAnimation', e.target.value as 'none' | 'scale' | 'opacity' | 'slide')}
        >
          <option value="none">Nenhum</option>
          <option value="scale">Escalar </option>
          <option value="opacity">Opacidade </option>
          <option value="slide">Slide</option>
        </select>
        <p className={styles.fieldDescription}>Escolha um efeito visual quando o mouse passar sobre os botões.</p>
      </div>

      {/* 3. Variante do Botão (Preenchido/Bordado) */}
      <div className={styles.inputGroup}>
        <label htmlFor="buttonVariant" className={styles.inputLabel}>Estilo do Botão:</label>
        <select
          id="buttonVariant"
          className={styles.selectInput}
          value={designConfig.buttonVariant ?? 'filled'}
          onChange={(e) => handleUpdate('buttonVariant', e.target.value as 'filled' | 'bordered')}
        >
          <option value="filled">Preenchido</option>
          <option value="bordered">Bordado </option>
        </select>
        <p className={styles.fieldDescription}>Define se os botões terão fundo preenchido ou apenas uma borda.</p>
      </div>

      {/* 4. Ícone do Carrinho */}
      <div className={styles.inputGroup}>
        <label htmlFor="cartIcon" className={styles.inputLabel}>Ícone do Carrinho:</label>
        <select
          id="cartIcon"
          className={styles.selectInput}
          value={designConfig.cartIcon ?? 'shopping_bag_outlined'}
          onChange={(e) => handleUpdate('cartIcon', e.target.value as 'cart' | 'bag' | 'shopping_cart_outlined' | 'shopping_bag_outlined')}
        >
          <option value="shopping_bag_outlined">Sacola (Padrão)</option>
          <option value="shopping_cart_outlined">Carrinho</option>
          <option value="bag">Sacola de Compras </option>
          <option value="cart">Carrinho </option>
        </select>
        <p className={styles.fieldDescription}>Escolha o ícone que representará o carrinho de compras.</p>
      </div>
      
      {/* 5. Formato das Imagens (opção "circular" removida) */}
      <div className={styles.inputGroup}>
        <label htmlFor="imageBorderRadius" className={styles.inputLabel}>Formato das Imagens:</label>
        <select
          id="imageBorderRadius"
          className={styles.selectInput}
          value={designConfig.imageBorderRadius ?? 'rounded'}
          onChange={(e) => handleUpdate('imageBorderRadius', e.target.value as 'square' | 'rounded')}
        >
          <option value="square">Quadrada</option>
          <option value="rounded">Bordas Arredondadas</option>
        </select>
        <p className={styles.fieldDescription}>Define o formato dos cantos de todas as imagens da loja.</p>
      </div>

      {/* 6. Efeito ao Passar o Mouse nas Imagens */}
      <div className={styles.inputGroup}>
        <label htmlFor="imageHoverEffect" className={styles.inputLabel}>Efeito ao Passar o Mouse nas Imagens:</label>
        <select
          id="imageHoverEffect"
          className={styles.selectInput}
          value={designConfig.imageHoverEffect ?? 'none'}
          onChange={(e) => handleUpdate('imageHoverEffect', e.target.value as 'none' | 'zoom' | 'grayscale' | 'overlay')}
        >
          <option value="none">Nenhum</option>
          <option value="zoom">Zoom Suave</option>
          <option value="grayscale">Escala de Cinza</option>
          <option value="overlay">Sobreposição de Cor</option>
        </select>
        <p className={styles.fieldDescription}>Escolha um efeito visual quando o mouse passar sobre as imagens.</p>
      </div>

      {/* 7. Habilitar Sombras em Elementos */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={designConfig.enableShadows ?? false}
            onChange={(e) => handleUpdate('enableShadows', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Sombras em Elementos (Cartões, Imagens)
        </label>
        <p className={styles.fieldDescription}>Adiciona sombras sutis a cartões de produto e outros elementos visuais.</p>
        {designConfig.enableShadows && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="shadowStyle" className={styles.inputLabel}>Estilo da Sombra:</label>
            <select
              id="shadowStyle"
              className={styles.selectInput}
              value={designConfig.shadowStyle ?? 'medium'}
              onChange={(e) => handleUpdate('shadowStyle', e.target.value as 'none' | 'small' | 'medium' | 'large')}
            >
              <option value="none">Nenhuma Sombra</option>
              <option value="small">Pequena</option>
              <option value="medium">Média</option>
              <option value="large">Grande</option>
            </select>
            <p className={styles.fieldDescription}>Define a intensidade e o tamanho das sombras.</p>
          </div>
        )}
      </div>

      {/* 8. Habilitar Efeitos de Destaque ao Passar o Mouse */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={designConfig.enableHoverEffects ?? true}
            onChange={(e) => handleUpdate('enableHoverEffects', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Efeitos de Destaque ao Passar o Mouse (links, ícones)
        </label>
        <p className={styles.fieldDescription}>Ativa animações sutis em elementos interativos ao passar o mouse.</p>
      </div>

      {/* 9. Habilitar Pequenas Animações ao Clicar */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={designConfig.enableClickAnimations ?? false}
            onChange={(e) => handleUpdate('enableClickAnimations', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Pequenas Animações ao Clicar (botões)
        </label>
        <p className={styles.fieldDescription}>Ativa pequenas animações em botões e elementos clicáveis.</p>
      </div>
    </div>
  );
};

export default DesignTypeSection;
