'use client';

import React from 'react';
import { ThemeConfig, ThemeUpdateFn } from '../../../types';
// Importa o NOVO arquivo de estilos específico para ProductListSection
import styles from './ProductListSection.module.css';

interface Props {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
}

const ProductListSection: React.FC<Props> = ({ config, updateConfig }) => {
  const productListConfig = config.productList || {
    layout: 'grid',
    gridColumns: 3,
    showProductImage: true,
    showProductName: true,
    showProductPrice: true,
    showProductDescriptionSnippet: false,
    showAddToCartButton: true,
    showQuickViewButton: true,
    enableFilters: true,
    enableSorting: true,
    productsPerPage: 12,
    showPagination: true,
    addToCartButtonColor: '',
  };

  const handleUpdate = (field: keyof typeof productListConfig, value: any) => {
    updateConfig({
      productList: {
        ...productListConfig,
        [field]: value,
      },
    });
  };

  return (
    <div className={styles.sectionBlock}>
      <h3 className={styles.sectionTitle}>Configurações da Lista de Produtos</h3>
      <p className={styles.sectionDescription}>
        Ajuste como os produtos são exibidos em páginas de categoria, resultados de busca e outras listagens.
      </p>

      <div className={styles.inputGroup}>
        <label htmlFor="listLayout" className={styles.inputLabel}>Layout da Lista:</label>
        <select
          id="listLayout"
          className={styles.selectInput}
          value={productListConfig.layout}
          onChange={(e) => handleUpdate('layout', e.target.value as 'grid' | 'list')}
        >
          <option value="grid">Grade (Recomendado)</option>
          <option value="list">Lista (Vertical)</option>
        </select>
      </div>

      {productListConfig.layout === 'grid' && (
        <div className={styles.nestedInputGroup}> {/* Usando nestedInputGroup para indentação */}
          <label htmlFor="gridColumns" className={styles.inputLabel}>Colunas na Grade:</label>
          <select
            id="gridColumns"
            className={styles.selectInput}
            value={productListConfig.gridColumns}
            onChange={(e) => handleUpdate('gridColumns', parseInt(e.target.value, 10) as 2 | 3 | 4)}
          >
            <option value={2}>2 Colunas</option>
            <option value={3}>3 Colunas</option>
            <option value={4}>4 Colunas</option>
          </select>
        </div>
      )}

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productListConfig.showProductImage}
            onChange={(e) => handleUpdate('showProductImage', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Imagem do Produto
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productListConfig.showProductName}
            onChange={(e) => handleUpdate('showProductName', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Nome do Produto
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productListConfig.showProductPrice}
            onChange={(e) => handleUpdate('showProductPrice', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Preço do Produto
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productListConfig.showProductDescriptionSnippet}
            onChange={(e) => handleUpdate('showProductDescriptionSnippet', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Resumo da Descrição
        </label>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productListConfig.showAddToCartButton}
            onChange={(e) => handleUpdate('showAddToCartButton', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Botão "Adicionar ao Carrinho"
        </label>
        {productListConfig.showAddToCartButton && (
          <div className={styles.nestedInputGroup}>
            <label htmlFor="addToCartButtonColor" className={styles.inputLabel}>Cor do Botão "Adicionar":</label>
            <input
              type="color"
              id="addToCartButtonColor"
              className={styles.colorInput}
              value={productListConfig.addToCartButtonColor || '#007bff'} // Default para azul ou primária
              onChange={(e) => handleUpdate('addToCartButtonColor', e.target.value)}
            />
            <small className={styles.fieldDescription}> {/* Usando fieldDescription para consistência */}
              Deixe vazio para usar a cor primária padrão do tema.
            </small>
          </div>
        )}
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productListConfig.showQuickViewButton}
            onChange={(e) => handleUpdate('showQuickViewButton', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Botão "Pré-visualização Rápida"
        </label>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productListConfig.enableFilters}
            onChange={(e) => handleUpdate('enableFilters', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Filtros de Produtos
        </label>
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productListConfig.enableSorting}
            onChange={(e) => handleUpdate('enableSorting', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Opções de Ordenação
        </label>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor="productsPerPage" className={styles.inputLabel}>Produtos por Página:</label>
        <input
          type="number"
          id="productsPerPage"
          className={styles.textInput} /* Usando textInput para campo de número */
          value={productListConfig.productsPerPage}
          onChange={(e) => handleUpdate('productsPerPage', parseInt(e.target.value, 10))}
          min={1}
        />
      </div>
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={productListConfig.showPagination}
            onChange={(e) => handleUpdate('showPagination', e.target.checked)}
            className={styles.checkboxInput}
          />
          Exibir Paginação (Navegação entre páginas)
        </label>
      </div>
    </div>
  );
};

export default ProductListSection;