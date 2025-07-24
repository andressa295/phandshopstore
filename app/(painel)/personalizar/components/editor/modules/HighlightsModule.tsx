// app/(painel)/personalizar/components/editor/modules/HighlightsModule.tsx
'use client';

import React from 'react';
import { HighlightsModuleData } from '../../../types';
import styles from './HighlightsModule.module.css';
import { MdDeleteForever, MdAdd } from 'react-icons/md';

interface HighlightsModuleProps {
  id: string;
  data: HighlightsModuleData;
  onChange: (newData: Partial<HighlightsModuleData>) => void;
  onRemove: (id: string) => void;
}

const HighlightsModule: React.FC<HighlightsModuleProps> = ({ id, data, onChange, onRemove }) => {
  const handleHighlightItemChange = (index: number, field: 'icon' | 'text', value: string) => {
    const updatedItems = data.highlightItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    onChange({ highlightItems: updatedItems });
  };

  const handleAddHighlightItem = () => {
    const newItem = { icon: '✨', text: 'Novo Destaque' };
    onChange({ highlightItems: [...data.highlightItems, newItem] });
  };

  const handleRemoveHighlightItem = (index: number) => {
    if (window.confirm('Tem certeza que deseja remover este item de destaque?')) {
      const updatedItems = data.highlightItems.filter((_, i) => i !== index);
      onChange({ highlightItems: updatedItems });
    }
  };

  return (
    <div className={styles.sectionBlock}>
      {/* Cabeçalho do módulo com título e botão de remover */}
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Configurações de Destaques</h4>
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
        <label className={styles.inputLabel} htmlFor={`hl-title-${id}`}>Título:</label>
        <input
          type="text"
          id={`hl-title-${id}`}
          className={styles.textInput}
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex: Por Que Nos Escolher?"
        />
        <p className={styles.fieldDescription}>Título exibido acima dos itens de destaque.</p>
      </div>

      {/* Campo Layout */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel} htmlFor={`hl-layout-${id}`}>Layout:</label>
        <select
          id={`hl-layout-${id}`}
          className={styles.selectInput}
          value={data.layout}
          onChange={(e) => onChange({ layout: e.target.value as 'icons-text' | 'cards' })}
        >
          <option value="icons-text">Ícones e Texto (Lista)</option>
          <option value="cards">Cards (Blocos com borda)</option>
        </select>
        <p className={styles.fieldDescription}>Define como os itens de destaque serão exibidos.</p>
      </div>

      {/* Itens de Destaque */}
      <h5 className={styles.nestedTitle}>Itens de Destaque:</h5>
      {data.highlightItems.length === 0 && (
        <p className={styles.fieldDescription}>Nenhum item de destaque adicionado ainda.</p>
      )}
      {data.highlightItems.map((item, index) => (
        <div key={index} className={styles.highlightItem}>
          <span className={styles.highlightItemIcon}>{item.icon}</span>
          <input
            type="text"
            className={styles.textInput}
            value={item.text}
            onChange={(e) => handleHighlightItemChange(index, 'text', e.target.value)}
            placeholder="Texto do Destaque"
          />
          {/* Campo para o ícone/emoji */}
          <input
            type="text"
            className={styles.textInput}
            value={item.icon}
            onChange={(e) => handleHighlightItemChange(index, 'icon', e.target.value)}
            placeholder="Ícone/Emoji (Ex: ✨)"
            style={{ width: '80px', flexShrink: 0 }}
          />
          <button
            onClick={() => handleRemoveHighlightItem(index)}
            className={styles.removeHighlightItemButton}
            title="Remover este destaque"
          >
            <MdDeleteForever size={18} />
          </button>
        </div>
      ))}
      <button onClick={handleAddHighlightItem} className={styles.addButton}>
        <MdAdd /> Adicionar Destaque
      </button>

      {/* Campo Ativo */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel} htmlFor={`hl-active-${id}`}>
          <input
            type="checkbox"
            id={`hl-active-${id}`}
            className={styles.checkboxInput}
            checked={data.isActive}
            onChange={(e) => onChange({ isActive: e.target.checked })}
          /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>
    </div>
  );
};

export default HighlightsModule;