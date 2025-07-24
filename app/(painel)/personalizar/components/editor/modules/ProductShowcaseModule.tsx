'use client';

import React from 'react';
import { ProductShowcaseModuleData } from '../../../types';
import styles from './ProductShowcaseModule.module.css'; // Importa estilos locais
import { MdDeleteForever } from 'react-icons/md'; // Ícone para remover

interface ProductShowcaseModuleProps {
  id: string;
  data: ProductShowcaseModuleData;
  onChange: (newData: Partial<ProductShowcaseModuleData>) => void;
  onRemove: (id: string) => void;
}

const ProductShowcaseModule: React.FC<ProductShowcaseModuleProps> = ({ id, data, onChange, onRemove }) => (
  <div className={styles.sectionBlock}>
    <div className={styles.moduleHeader}>
      <h4 className={styles.nestedTitle}>Configurações da Vitrine de Produtos</h4>
      <button
        onClick={() => onRemove(id)}
        className={styles.removeButton}
        title="Remover este módulo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={styles.removeIcon}>
          <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V4C7 3.44772 7.44772 3 8 3H16C16.5523 3 17 3.44772 17 4V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 5V6H15V5H9Z"></path>
        </svg>
      </button>
    </div>

    {/* Campo Título */}
    <div className={styles.inputGroup}>
      <label htmlFor={`ps-title-${id}`} className={styles.inputLabel}>Título:</label>
      <input
        type="text"
        id={`ps-title-${id}`}
        className={styles.textInput}
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Ex: Nossos Produtos"
      />
      <p className={styles.fieldDescription}>Título exibido acima da vitrine de produtos.</p>
    </div>

    {/* Campo Tipo de Exibição */}
    <div className={styles.inputGroup}>
      <label htmlFor={`ps-display-${id}`} className={styles.inputLabel}>Tipo de Exibição:</label>
      <select
        id={`ps-display-${id}`}
        className={styles.selectInput}
        value={data.displayType}
        onChange={(e) => onChange({ displayType: e.target.value as 'latest' | 'best_sellers' | 'featured' | 'selected' })}
      >
        <option value="latest">Últimos Produtos Adicionados</option>
        <option value="best_sellers">Produtos Mais Vendidos</option>
        <option value="featured">Produtos em Destaque</option>
        <option value="selected">Produtos Selecionados (Manualmente)</option>
      </select>
      <p className={styles.fieldDescription}>Define quais produtos serão exibidos na vitrine.</p>
    </div>

    {/* Campo Produtos Selecionados (Condicional) */}
    {data.displayType === 'selected' && (
      <div className={styles.inputGroup}>
        <label htmlFor={`ps-selected-products-${id}`} className={styles.inputLabel}>
          IDs dos Produtos Selecionados (separados por vírgula):
        </label>
        <textarea
          id={`ps-selected-products-${id}`}
          className={styles.textArea}
          value={(data.productIds ?? []).join(', ')}
          onChange={(e) => {
            const ids = e.target.value
              .split(',')
              .map((s: string) => s.trim())
              .filter(Boolean);
            onChange({ productIds: ids });
          }}
          rows={4}
          placeholder="Ex: prod123, prod456, prod789"
        ></textarea>
        <p className={styles.fieldDescription}>
          Insira os IDs únicos dos produtos que deseja exibir, separados por vírgula.
        </p>
      </div>
    )}

    {/* Campo Número de Produtos */}
    <div className={styles.inputGroup}>
      <label htmlFor={`ps-num-${id}`} className={styles.inputLabel}>Número de Produtos a Exibir:</label>
      <input
        type="number"
        id={`ps-num-${id}`}
        className={styles.textInput}
        value={data.numberOfProducts}
        onChange={(e) => onChange({ numberOfProducts: parseInt(e.target.value) || 0 })}
        min={1}
        placeholder="Ex: 8"
      />
      <p className={styles.fieldDescription}>Quantos produtos serão mostrados na vitrine.</p>
    </div>

    {/* Campo Ativo */}
    <div className={styles.inputGroup}>
      <label htmlFor={`ps-active-${id}`} className={styles.checkboxLabel}>
        <input
          type="checkbox"
          id={`ps-active-${id}`}
          className={styles.checkboxInput}
          checked={data.isActive}
          onChange={(e) => onChange({ isActive: e.target.checked })}
        /> Ativo
      </label>
      <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
    </div>
  </div>
);

export default ProductShowcaseModule;
