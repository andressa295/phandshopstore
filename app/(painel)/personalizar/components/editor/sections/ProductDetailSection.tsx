'use client';

import React from 'react';
import { ThemeConfig, ThemeUpdateFn } from '../../../types';
// Importa o NOVO arquivo de estilos específico para ProductDetailSection
import styles from './ProductDetailSection.module.css'; 

export interface ProductDetailConfig {
  galleryLayout: 'carousel' | 'grid';
  showPrice: boolean;
  showSku: boolean;
  showStock: boolean;
  enableQuantitySelector: boolean;
  showVariations: boolean;
  showProductDescription: boolean;
  showAdditionalInfoTabs: boolean;
  showReviewsSection: boolean;
  showRelatedProducts: boolean;
  relatedProductsTitle: string;
  showTrustBadges: boolean;
  trustBadgesImages: string[];
}

interface Props {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
}

const ProductDetailSection: React.FC<Props> = ({ config, updateConfig }) => {
  const productDetailConfig = config.productDetail || {
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
  };

  const handleUpdate = (field: keyof typeof productDetailConfig, value: any) => {
    updateConfig({
      productDetail: {
        ...productDetailConfig, 
        [field]: value, 
      },
    });
  };

  return (
    <div className={styles.sectionBlock}> 
      <h3 className={styles.sectionTitle}>Página de Detalhes do Produto</h3>
      <p className={styles.sectionDescription}>
        Ajuste como os produtos individuais são exibidos na sua loja.
      </p>

      <div className={styles.inputGroup}>
        <label htmlFor="galleryLayout" className={styles.inputLabel}>Layout da Galeria de Imagens:</label>
        <select
          id="galleryLayout"
          className={styles.selectInput}
          value={productDetailConfig.galleryLayout}
          onChange={(e) => handleUpdate('galleryLayout', e.target.value)}
        >
          <option value="carousel">Carrossel (Padrão)</option>
          <option value="grid">Grade de Miniaturas</option>
        </select>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showPrice}
            onChange={(e) => handleUpdate('showPrice', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Preço
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showSku}
            onChange={(e) => handleUpdate('showSku', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir SKU
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showStock}
            onChange={(e) => handleUpdate('showStock', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Quantidade em Estoque
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.enableQuantitySelector}
            onChange={(e) => handleUpdate('enableQuantitySelector', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Seletor de Quantidade
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showVariations}
            onChange={(e) => handleUpdate('showVariations', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Variações do Produto (Tamanho, Cor, etc.)
        </label>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showProductDescription}
            onChange={(e) => handleUpdate('showProductDescription', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Descrição Completa do Produto
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showAdditionalInfoTabs}
            onChange={(e) => handleUpdate('showAdditionalInfoTabs', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Abas de Informações Adicionais (Especificações, Dimensões, etc.)
        </label>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showReviewsSection}
            onChange={(e) => handleUpdate('showReviewsSection', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Seção de Avaliações de Clientes
        </label>
      </div>

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
          <div className={styles.nestedInputGroup}> {/* Usando classe CSS */}
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

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productDetailConfig.showTrustBadges}
            onChange={(e) => handleUpdate('showTrustBadges', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Selos de Confiança (Segurança, Pagamento, etc.)
        </label>
        {productDetailConfig.showTrustBadges && (
          <div className={styles.nestedInputGroup}> {/* Usando classe CSS */}
            <label htmlFor="trustBadgesImages" className={styles.inputLabel}>URLs dos Selos de Confiança (uma por linha):</label>
            <textarea
              id="trustBadgesImages"
              className={styles.textArea}
              value={productDetailConfig.trustBadgesImages.join('\n')}
              onChange={(e) => handleUpdate('trustBadgesImages', e.target.value.split('\n'))}
              placeholder="Ex: /images/selo-seguro.png\n/images/selo-pagamento.png"
              rows={4}
            />
            <small className={styles.fieldDescription}>
              Coloque uma URL de imagem por linha. Estas imagens aparecerão próximas ao botão "Comprar".
            </small>
            <div className={styles.imagePreviewContainer}> {/* Usando classe CSS */}
              {productDetailConfig.trustBadgesImages.map((src, idx) => src && (
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