// app/(painel)/personalizar/components/editor/modules/HighlightsModule.tsx
'use client';

import React from 'react';
import { HighlightsModuleData, SingleHighlightItem } from '../../../types';
import styles from './HighlightsModule.module.css'; // Importa o CSS Module do componente
import {
  MdDeleteForever,
  MdAdd,
  MdLocalShipping,    // Entrega
  MdCreditCard,       // Cartão de Crédito
  MdHeadset,          // Suporte
  MdStar,             // Qualidade
  MdSecurity,         // Segurança
  MdAccessTime,       // Rapidez
  MdWorkspacePremium, // Premium
  MdOutlineVerified,  // Verificado
  MdWhatsapp,         // WhatsApp
  MdArchive,          // Caixa / Estoque
  MdClose,            // <--- CORRIGIDO: MdClose importado corretamente
} from 'react-icons/md'; // Ícones de exemplo
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos

// Ícones de exemplo para o lojista escolher (SOMENTE ÍCONES, SEM EMOJIS)
const availableIcons = [
  { value: 'MdLocalShipping', label: 'Entrega Rápida' },
  { value: 'MdCreditCard', label: 'Cartão de Crédito' },
  { value: 'MdHeadset', label: 'Suporte Dedicado' },
  { value: 'MdStar', label: 'Alta Qualidade' },
  { value: 'MdSecurity', label: 'Segurança Online' },
  { value: 'MdAccessTime', label: 'Envio Imediato' },
  { value: 'MdWorkspacePremium', label: 'Produtos Premium' },
  { value: 'MdOutlineVerified', label: 'Verificado' },
  { value: 'MdWhatsapp', label: 'WhatsApp' },
  { value: 'MdArchive', label: 'Em Estoque' },
  // Adicione mais ícones de Md aqui conforme necessário
];

// Mapeamento de strings de ícones para componentes React-Icons
const IconComponents: Record<string, React.ElementType> = {
  MdLocalShipping: MdLocalShipping,
  MdCreditCard: MdCreditCard,
  MdHeadset: MdHeadset,
  MdStar: MdStar,
  MdSecurity: MdSecurity,
  MdAccessTime: MdAccessTime,
  MdWorkspacePremium: MdWorkspacePremium,
  MdOutlineVerified: MdOutlineVerified,
  MdWhatsapp: MdWhatsapp,
  MdArchive: MdArchive,
  // Adicione outros ícones aqui conforme necessário
};


interface HighlightsModuleProps {
  id: string;
  data: HighlightsModuleData;
  onChange: (newData: Partial<HighlightsModuleData>) => void;
  onRemove: (id: string) => void;
}

const HighlightsModule: React.FC<HighlightsModuleProps> = ({ id, data, onChange, onRemove }) => {
  const highlightItems: SingleHighlightItem[] = data.highlightItems ?? []; // fallback defensivo

  const handleHighlightItemChange = (itemId: string, field: keyof SingleHighlightItem, value: any) => {
    const updatedItems = highlightItems.map((item) =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    onChange({ highlightItems: updatedItems });
  };

  const handleAddHighlightItem = () => {
    // Limita a 4 itens, como você sugeriu
    if (highlightItems.length >= 4) {
      alert('Limite de 4 itens de destaque atingido.'); // Mantido alert temporariamente para feedback
      return;
    }
    const newItem: SingleHighlightItem = { id: uuidv4(), icon: 'MdStar', title: 'Novo Destaque', subtitle: 'Descrição breve', isActive: true }; // Usando MdStar como default
    onChange({ highlightItems: [...highlightItems, newItem] });
  };

  const handleRemoveHighlightItem = (itemId: string) => {
    if (window.confirm('Tem certeza que deseja remover este item de destaque?')) {
      const updatedItems = highlightItems.filter((item) => item.id !== itemId);
      onChange({ highlightItems: updatedItems });
    }
  };

  return (
    <div className={styles.sectionBlock}>
      {/* Cabeçalho do módulo com título e botão de remover */}
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Banner Info</h4>
        <button
          onClick={() => onRemove(id)}
          className={styles.removeModuleButton}
          title="Remover este módulo"
        >
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>
        Crie uma barra informativa com ícones e textos para destacar benefícios da sua loja.
      </p>

      {/* Campo Título Geral do Módulo */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel} htmlFor={`hl-title-${id}`}>Título:</label>
        <input
          type="text"
          id={`hl-title-${id}`}
          className={styles.textInput}
          value={data.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex: Por Que Nos Escolher?"
        />
        <p className={styles.fieldDescription}>Título exibido acima dos itens de destaque (opcional).</p>
      </div>

      {/* Campo Layout */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel} htmlFor={`hl-layout-${id}`}>Layout:</label>
        <select
          id={`hl-layout-${id}`}
          className={styles.selectInput}
          value={data.layout ?? 'icons-text'}
          onChange={(e) => onChange({ layout: e.target.value as 'icons-text' | 'cards' })}
        >
          <option value="icons-text">Ícones e Texto (Lista Horizontal)</option>
          <option value="cards">Cards (Blocos com borda)</option>
        </select>
        <p className={styles.fieldDescription}>Define como os itens de destaque serão exibidos.</p>
      </div>

      {/* Itens de Destaque */}
      <h5 className={styles.nestedTitle}>Itens de Destaque:</h5>
      <p className={styles.fieldDescription}>Adicione até 4 itens de destaque.</p>

      {highlightItems.length === 0 && (
        <p className={styles.noContentMessage}>Nenhum item de destaque adicionado ainda.</p>
      )}

      <div className={styles.highlightItemsList}>
        {highlightItems.map((item, index) => {
          const IconComponent = IconComponents[item.icon as string] || MdStar; // Fallback para MdStar
          return (
            <div key={item.id} className={styles.highlightItem}>
              <div className={styles.highlightItemIcon}>
                {IconComponent ? <IconComponent size={24} /> : <span>{item.icon}</span>}
              </div>

              {/* Seletor de Ícone */}
              <div className={styles.inputGroupInline}>
                <label htmlFor={`hl-icon-${item.id}`} className={styles.inputLabel}>Ícone:</label>
                <select
                  id={`hl-icon-${item.id}`}
                  className={styles.selectInput}
                  value={item.icon ?? 'MdStar'}
                  onChange={(e) => handleHighlightItemChange(item.id, 'icon', e.target.value)}
                >
                  {availableIcons.map(icon => (
                    <option key={icon.value} value={icon.value}>{icon.label}</option>
                  ))}
                </select>
              </div>

              {/* Título do Destaque */}
              <div className={styles.inputGroupInline}>
                <label htmlFor={`hl-item-title-${item.id}`} className={styles.inputLabel}>Título:</label>
                <input
                  type="text"
                  id={`hl-item-title-${item.id}`}
                  className={styles.textInput}
                  value={item.title ?? ''}
                  onChange={(e) => handleHighlightItemChange(item.id, 'title', e.target.value)}
                  placeholder="Ex: Frete Grátis"
                />
              </div>

              {/* Subtítulo do Destaque */}
              <div className={styles.inputGroupInline}>
                <label htmlFor={`hl-item-subtitle-${item.id}`} className={styles.inputLabel}>Subtítulo:</label>
                <input
                  type="text"
                  id={`hl-item-subtitle-${item.id}`}
                  className={styles.textInput}
                  value={item.subtitle ?? ''}
                  onChange={(e) => handleHighlightItemChange(item.id, 'subtitle', e.target.value)}
                  placeholder="Ex: Em compras acima de R$199"
                />
              </div>

              {/* Checkbox Ativo */}
              <div className={styles.inputGroupInline}>
                <label className={styles.checkboxLabel} htmlFor={`hl-item-active-${item.id}`}>
                  <input
                    type="checkbox"
                    id={`hl-item-active-${item.id}`}
                    className={styles.checkboxInput}
                    checked={item.isActive ?? false}
                    onChange={(e) => handleHighlightItemChange(item.id, 'isActive', e.target.checked)}
                  /> Ativo
                </label>
              </div>

              <button
                onClick={() => handleRemoveHighlightItem(item.id)}
                className={styles.removeHighlightItemButton}
                title="Remover este destaque"
              >
                <MdClose size={18} />
              </button>
            </div>
          );
        })}
      </div>

      <button onClick={handleAddHighlightItem} className={styles.addHighlightButton}>
        <MdAdd /> Adicionar Destaque
      </button>

      {/* Campo Ativo do Módulo */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel} htmlFor={`hl-module-active-${id}`}>
          <input
            type="checkbox"
            id={`hl-module-active-${id}`}
            className={styles.checkboxInput}
            checked={data.isActive ?? false}
            onChange={(e) => onChange({ isActive: e.target.checked })}
          /> Módulo Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>
    </div>
  );
};

export default HighlightsModule;