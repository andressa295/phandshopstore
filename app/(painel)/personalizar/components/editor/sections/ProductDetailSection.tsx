// app/(painel)/personalizar/components/editor/ProductDetailSection.tsx
'use client';

import React from 'react';
import { ThemeConfig, ThemeUpdateFn, ProductDetailConfig } from '../../../types'; // Importa ProductDetailConfig
import styles from './ProductDetailSection.module.css';
import { useTheme } from '../../../context/ThemeContext'; 

interface Props {
}

const ProductDetailSection: React.FC<Props> = () => { 
  const { config, updateConfig } = useTheme(); 

  const productDetailConfig: ProductDetailConfig = config.productDetail || { // Garante que productDetailConfig seja do tipo ProductDetailConfig
    galleryLayout: 'carousel',
    showPrice: true,
    showSku: true,
    showStock: true,
    enableQuantitySelector: true,
    showVariations: true,
    showProductDescription: true,
    showAdditionalInfoTabs: true,
    showReviewsSection: true,
    showRelatedProducts: true,
    relatedProductsTitle: 'Produtos Relacionados',
    showTrustBadges: false,
    trustBadgesImages: [],
    imagePosition: 'side-gallery', // Valor padrão do defaultThemeConfig
  };

  const trustBadgesImages = Array.isArray(productDetailConfig.trustBadgesImages)
    ? productDetailConfig.trustBadgesImages
    : [];

  const handleUpdate = (field: keyof ProductDetailConfig, value: any) => { // Usa keyof ProductDetailConfig
    updateConfig({
      productDetail: {
        ...productDetailConfig,
        [field]: value,
      },
    });
  };

  return (
    <div className={styles.sectionBlock}>
      <h3 className={styles.sectionTitle}>Detalhes do Produto</h3>
      <p className={styles.sectionDescription}>
        Ajuste como os produtos individuais são exibidos na sua loja.
      </p>

      {/* 1. Layout da Galeria de Imagens */}
      <div className={styles.inputGroup}>
        <label htmlFor="galleryLayout" className={styles.inputLabel}>Layout da Galeria de Imagens:</label>
        <select
          id="galleryLayout"
          className={styles.selectInput}
          value={productDetailConfig.galleryLayout}
          onChange={(e) => handleUpdate('galleryLayout', e.target.value as 'carousel' | 'grid')}
        >
          <option value="carousel">Carrossel </option>
          <option value="grid">Grade de Miniaturas</option>
        </select>
      </div>

      {/* 2. Posição da Imagem Principal */}
      <div className={styles.inputGroup}>
        <label htmlFor="imagePosition" className={styles.inputLabel}>Posição da Imagem Principal:</label>
        <select
          id="imagePosition"
          className={styles.selectInput}
          value={productDetailConfig.imagePosition}
          onChange={(e) => handleUpdate('imagePosition', e.target.value as 'left' | 'right' | 'top-gallery' | 'side-gallery')}
        >
          <option value="side-gallery">Ao Lado da Descrição</option>
          <option value="top-gallery">Acima da Descrição</option>
        </select>
      </div>

      {/* 3. Checkboxes gerais */}
      {[
        { label: 'Exibir Preço', field: 'showPrice' },
        { label: 'Exibir SKU', field: 'showSku' },
        { label: 'Exibir Quantidade em Estoque', field: 'showStock' },
        { label: 'Habilitar Seletor de Quantidade', field: 'enableQuantitySelector' },
        { label: 'Exibir Variações do Produto ', field: 'showVariations' },
        { label: 'Exibir Descrição Completa do Produto', field: 'showProductDescription' },
        { label: 'Exibir Abas de Informações Adicionais ', field: 'showAdditionalInfoTabs' },
        { label: 'Exibir Seção de Avaliações de Clientes', field: 'showReviewsSection' },
      ].map(({ label, field }) => (
        <div className={styles.inputGroup} key={field}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={productDetailConfig[field as keyof ProductDetailConfig] as boolean}
              onChange={(e) => handleUpdate(field as keyof ProductDetailConfig, e.target.checked)}
              className={styles.checkboxInput}
            />
            {label}
          </label>
        </div>
      ))}

      {/* 4. Produtos Relacionados */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showRelatedProducts}
            onChange={(e) => handleUpdate('showRelatedProducts', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Seção de Produtos Relacionados
        </label>
        {productDetailConfig.showRelatedProducts && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="relatedProductsTitle" className={styles.inputLabel}>Título da Seção de Relacionados:</label>
            <input
              type="text"
              id="relatedProductsTitle"
              className={styles.textInput}
              value={productDetailConfig.relatedProductsTitle}
              onChange={(e) => handleUpdate('relatedProductsTitle', e.target.value)}
              placeholder="Ex: Quem comprou este, também levou..."
            />
          </div>
        )}
      </div>

      {/* 5. Selos de Confiança */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showTrustBadges}
            onChange={(e) => handleUpdate('showTrustBadges', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Selos de Confiança
        </label>
        {productDetailConfig.showTrustBadges && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="trustBadgesImages" className={styles.inputLabel}>
              URLs dos Selos de Confiança (uma por linha):
            </label>
            <textarea
              id="trustBadgesImages"
              className={styles.textArea}
              value={trustBadgesImages.join('\n')}
              onChange={(e) => handleUpdate('trustBadgesImages', e.target.value.split('\n'))}
              placeholder="Ex: https://seusite.com/images/selo-seguro.png\nhttps://seusite.com/images/selo-pagamento.png"
              rows={4}
            />
            <small className={styles.fieldDescription}>
              Coloque uma URL de imagem por linha. Estas imagens aparecerão próximas ao botão "Comprar".
            </small>
            <div className={styles.imagePreviewContainer}>
              {trustBadgesImages.map((src, idx) => src && (
                <img key={idx} src={src} alt="Selo de Confiança" className={styles.imagePreviewSmall} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailSection;