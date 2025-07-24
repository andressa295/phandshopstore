'use client';

import React from 'react';
import { CategoriesModuleData } from '../../../types';
import styles from './CategoriesModule.module.css';

interface CategoriesModuleProps {
  id: string;
  data: CategoriesModuleData;
  onChange: (newData: Partial<CategoriesModuleData>) => void;
  onRemove: (id: string) => void;
}

const CategoriesModule: React.FC<CategoriesModuleProps> = ({ id, data, onChange, onRemove }) => (
  <div className={styles.sectionBlock}>
    {/* Cabeçalho do módulo com título e botão de remover */}
    <div className={styles.moduleHeader}>
      <h4 className={styles.nestedTitle}>Configurações de Categorias</h4>
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
      <label className={styles.inputLabel} htmlFor={`cat-title-${id}`}>Título:</label>
      <input
        type="text"
        id={`cat-title-${id}`}
        className={styles.textInput}
        value={data.title}
        onChange={(e) => onChange({ title: e.target.value })}
        placeholder="Ex: Nossas Categorias"
      />
      <p className={styles.fieldDescription}>Título exibido acima das categorias.</p>
    </div>

    {/* Campo Layout */}
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel} htmlFor={`cat-layout-${id}`}>Layout:</label>
      <select
        id={`cat-layout-${id}`}
        className={styles.selectInput}
        value={data.layout}
        onChange={(e) => onChange({ layout: e.target.value as 'grid' | 'carousel' })}
      >
        <option value="grid">Grade (Itens lado a lado)</option>
        <option value="carousel">Carrossel (Itens deslizantes)</option>
      </select>
      <p className={styles.fieldDescription}>Define como as categorias serão dispostas.</p>
    </div>

    {/* Campo Categorias Selecionadas */}
    <div className={styles.inputGroup}>
      <label className={styles.inputLabel} htmlFor={`cat-selected-${id}`}>
        Categorias Selecionadas (slugs, separados por vírgula):
      </label>
      <textarea
        id={`cat-selected-${id}`}
        className={styles.textArea}
        value={(data.selectedCategories ?? []).join(', ')}
        onChange={(e) => {
          const items = e.target.value
            .split(',')
            .map((s: string) => s.trim())
            .filter(Boolean);
          onChange({ selectedCategories: items });
        }}
        rows={4}
        placeholder="Ex: eletronicos, moda-feminina, acessorios"
      ></textarea>
      <p className={styles.fieldDescription}>
        Liste os 'slugs' das categorias que você deseja exibir, separados por vírgula.
      </p>
    </div>

    {/* Campo Ativo */}
    <div className={styles.inputGroup}>
      <label className={styles.checkboxLabel} htmlFor={`cat-active-${id}`}>
        <input
          type="checkbox"
          id={`cat-active-${id}`}
          className={styles.checkboxInput}
          checked={data.isActive}
          onChange={(e) => onChange({ isActive: e.target.checked })}
        /> Ativo
      </label>
      <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
    </div>
  </div>
);

export default CategoriesModule;
