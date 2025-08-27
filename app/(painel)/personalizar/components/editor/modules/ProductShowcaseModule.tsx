// app/(painel)/personalizar/components/editor/modules/ProductShowcaseModule.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { ProductShowcaseModuleData, SingleProductShowcaseData, CategoryData, ThemeConfig } from '../../../types'; // Importa ThemeConfig
import styles from './ProductShowcaseModule.module.css';
import { MdAdd, MdDeleteForever, MdEdit, MdClose } from 'react-icons/md';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../../../context/ThemeContext'; // Para acessar config e updateConfig

// --- Interface para as props do componente principal ---
interface ProductShowcaseModuleProps {
  id: string;
  data: ProductShowcaseModuleData;
  onChange: (newData: Partial<ProductShowcaseModuleData>) => void;
  onRemove: (id: string) => void;
}

// --- Componente Modal para Edição de Vitrine Individual ---
interface EditShowcaseModalProps {
  showcase: SingleProductShowcaseData;
  onSave: (updatedShowcase: SingleProductShowcaseData) => void;
  onClose: () => void;
  availableCategories: CategoryData[]; // Categorias disponíveis passadas como prop
  availableProducts: any[]; // Todos os produtos da loja (para seleção)
}

const EditShowcaseModal: React.FC<EditShowcaseModalProps> = ({ showcase, onSave, onClose, availableCategories, availableProducts }) => {
  const [currentShowcase, setCurrentShowcase] = useState<SingleProductShowcaseData>(showcase);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Filtra produtos com base na categoria selecionada e termo de busca
  useEffect(() => {
    let productsToFilter = availableProducts;

    if (currentShowcase.categoryId) {
      productsToFilter = productsToFilter.filter(p => p.categoria_id === currentShowcase.categoryId);
    }

    if (searchTerm) {
      productsToFilter = productsToFilter.filter(p =>
        p.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(productsToFilter);
  }, [currentShowcase.categoryId, searchTerm, availableProducts]);


  const handleSave = () => {
    onSave(currentShowcase);
    onClose();
  };

  const handleProductSelection = (productId: string, isSelected: boolean) => {
    setCurrentShowcase(prev => {
      const currentIds = prev.productIds || [];
      if (isSelected) {
        return { ...prev, productIds: [...currentIds, productId] };
      } else {
        return { ...prev, productIds: currentIds.filter(id => id !== productId) };
      }
    });
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>Editar Vitrine de Produtos</h5>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <MdClose size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Título da Vitrine */}
          <div className={styles.inputGroup}>
            <label htmlFor={`showcase-title-${currentShowcase.id}`} className={styles.inputLabel}>Título da Vitrine:</label>
            <input
              id={`showcase-title-${currentShowcase.id}`}
              type="text"
              className={styles.textInput}
              value={currentShowcase.title ?? ''}
              onChange={(e) => setCurrentShowcase(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Calças em Destaque"
            />
            <p className={styles.fieldDescription}>Um título para esta vitrine específica.</p>
          </div>

          {/* Tipo de Exibição */}
          <div className={styles.inputGroup}>
            <label htmlFor={`showcase-displayType-${currentShowcase.id}`} className={styles.inputLabel}>Tipo de Exibição:</label>
            <select
              id={`showcase-displayType-${currentShowcase.id}`}
              className={styles.selectInput}
              value={currentShowcase.displayType ?? 'latest'}
              onChange={(e) => setCurrentShowcase(prev => ({ ...prev, displayType: e.target.value as 'latest' | 'best_sellers' | 'featured' | 'selected' }))}
            >
              <option value="latest">Últimos Produtos Adicionados</option>
              <option value="best_sellers">Produtos Mais Vendidos</option>
              <option value="featured">Produtos em Destaque</option>
              <option value="selected">Produtos Selecionados (Manualmente)</option>
            </select>
            <p className={styles.fieldDescription}>Define quais produtos serão exibidos nesta vitrine.</p>
          </div>

          {/* Seletor de Categoria (se houver categorias disponíveis) */}
          {availableCategories.length > 0 && (
            <div className={styles.inputGroup}>
              <label htmlFor={`showcase-category-${currentShowcase.id}`} className={styles.inputLabel}>Filtrar por Categoria (opcional):</label>
              <select
                id={`showcase-category-${currentShowcase.id}`}
                className={styles.selectInput}
                value={currentShowcase.categoryId ?? ''}
                onChange={(e) => setCurrentShowcase(prev => ({ ...prev, categoryId: e.target.value || null }))}
              >
                <option value="">Todas as Categorias</option>
                {availableCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nome}</option>
                ))}
              </select>
              <p className={styles.fieldDescription}>Selecione uma categoria para exibir produtos específicos.</p>
            </div>
          )}

          {/* Seleção Manual de Produtos (apenas se displayType for 'selected') */}
          {currentShowcase.displayType === 'selected' && (
            <div className={styles.nestedInputGroup}>
              <h5 className={styles.nestedTitle}>Selecionar Produtos</h5>
              <div className={styles.inputGroup}>
                <label htmlFor={`search-products-${currentShowcase.id}`} className={styles.inputLabel}>Buscar Produtos:</label>
                <input
                  id={`search-products-${currentShowcase.id}`}
                  type="text"
                  className={styles.textInput}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Digite para buscar produtos..."
                />
              </div>

              <div className={styles.productListSelector}>
                {filteredProducts.length === 0 ? (
                  <p className={styles.noContentMessage}>Nenhum produto encontrado.</p>
                ) : (
                  filteredProducts.map(product => (
                    <label key={product.id} className={styles.checkboxLabel}>
                      <input
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={(currentShowcase.productIds || []).includes(product.id)}
                        onChange={(e) => handleProductSelection(product.id, e.target.checked)}
                      />
                      {product.nome} (R$ {product.preco})
                    </label>
                  ))
                )}
              </div>
              <p className={styles.fieldDescription}>Selecione os produtos que deseja exibir nesta vitrine.</p>
            </div>
          )}

          {/* Número de Produtos a Exibir (se displayType NÃO for 'selected' ou se for 'selected' mas sem productIds) */}
          {currentShowcase.displayType !== 'selected' && (
            <div className={styles.inputGroup}>
              <label htmlFor={`showcase-num-products-${currentShowcase.id}`} className={styles.inputLabel}>Número de Produtos a Exibir:</label>
              <input
                id={`showcase-num-products-${currentShowcase.id}`}
                type="number"
                className={styles.textInput}
                value={currentShowcase.numberOfProducts ?? 4}
                onChange={(e) => setCurrentShowcase(prev => ({ ...prev, numberOfProducts: parseInt(e.target.value, 10) || 0 }))}
                min="1"
                placeholder="Ex: 8"
              />
              <p className={styles.fieldDescription}>Quantos produtos serão mostrados nesta vitrine.</p>
            </div>
          )}

          {/* Vitrine Ativa */}
          <div className={styles.inputGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={currentShowcase.isActive ?? false}
                onChange={(e) => setCurrentShowcase(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              Vitrine Ativa
            </label>
            <p className={styles.fieldDescription}>Desative para ocultar esta vitrine específica na página inicial.</p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.secondaryButton}>Cancelar</button>
          <button onClick={handleSave} className={styles.primaryButton}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal ProductShowcaseModule ---
const ProductShowcaseModule: React.FC<ProductShowcaseModuleProps> = ({ id, data, onChange, onRemove }) => {
  const showcases: SingleProductShowcaseData[] = data.showcases || [];
  const [editingShowcase, setEditingShowcase] = useState<SingleProductShowcaseData | null>(null);

  const { config } = useTheme(); // Acessa o config para obter categorias e produtos globais
  // Garante que categoriesData e productsData existam e sejam arrays
  const availableCategories: CategoryData[] = config.homepage?.categoriesData || [];
  const availableProducts: any[] = config.homepage?.productsData || [];


  const handleUpdateModuleData = (newModuleData: Partial<ProductShowcaseModuleData>) => {
    onChange(newModuleData);
  };

  const handleAddShowcase = () => {
    const newShowcase: SingleProductShowcaseData = {
      id: uuidv4(),
      title: 'Nova Vitrine',
      displayType: 'latest',
      categoryId: null,
      productIds: [],
      numberOfProducts: 4,
      isActive: true,
    };
    handleUpdateModuleData({ showcases: [...showcases, newShowcase] });
  };

  const handleRemoveShowcase = (showcaseId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta vitrine?')) {
      const updatedShowcases = showcases.filter(showcase => showcase.id !== showcaseId);
      handleUpdateModuleData({ showcases: updatedShowcases });
    }
  };

  const handleSaveEditedShowcase = (updatedShowcase: SingleProductShowcaseData) => {
    const updatedShowcases = showcases.map(s =>
      s.id === updatedShowcase.id ? updatedShowcase : s
    );
    handleUpdateModuleData({ showcases: updatedShowcases });
    setEditingShowcase(null);
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Vitrines de Produtos</h4>
        <button onClick={() => onRemove(id)} className={styles.removeModuleButton} title="Remover Módulo">
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>Crie e gerencie múltiplas vitrines de produtos para exibir em sua página inicial.</p>

      {/* Título Geral do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`module-title-${id}`} className={styles.inputLabel}>Título:</label>
        <input
          id={`module-title-${id}`}
          type="text"
          className={styles.textInput}
          value={data.title ?? ''}
          onChange={(e) => handleUpdateModuleData({ title: e.target.value })}
          placeholder="Ex: Nossos Destaques"
        />
        <p className={styles.fieldDescription}>Um título para esta seção de vitrines (opcional).</p>
      </div>

      {/* Subtítulo Geral do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`module-subtitle-${id}`} className={styles.inputLabel}>Subtítulo:</label>
        <textarea
          id={`module-subtitle-${id}`}
          className={styles.textArea}
          value={data.subtitle ?? ''}
          onChange={(e) => handleUpdateModuleData({ subtitle: e.target.value })}
          placeholder="Ex: Explore nossos produtos por categoria ou destaque"
        />
        <p className={styles.fieldDescription}>Um subtítulo para esta seção de vitrines (opcional).</p>
      </div>

      <button type="button" onClick={handleAddShowcase} className={styles.addShowcaseButton}>
        <MdAdd /> Nova vitrine
      </button>

      {showcases.length === 0 && (
        <p className={styles.noContentMessage}>Nenhuma vitrine adicionada ainda. Clique em "Adicionar Nova Vitrine" para começar.</p>
      )}

      <div className={styles.showcasesList}>
        {showcases.map((showcase, index) => (
          <div key={showcase.id} className={styles.showcasePreviewItem}>
            <div className={styles.showcasePreviewContent}>
              <h5 className={styles.showcasePreviewTitle}>{showcase.title || `Vitrine #${index + 1}`}</h5>
              <p className={styles.showcasePreviewSubtitle}>
                Tipo: {showcase.displayType === 'latest' ? 'Últimos' : showcase.displayType === 'best_sellers' ? 'Mais Vendidos' : showcase.displayType === 'featured' ? 'Destaque' : 'Selecionados'}
              </p>
              {showcase.categoryId && (
                <p className={styles.showcasePreviewCategory}>
                  Categoria: {availableCategories.find(cat => cat.id === showcase.categoryId)?.nome || 'Desconhecida'}
                </p>
              )}
            </div>
            <div className={styles.showcaseActionsOverlay}> {/* Usando overlay para ações */}
              <button onClick={(e) => { e.stopPropagation(); setEditingShowcase(showcase); }} className={styles.editShowcaseInlineButton}>
                <MdEdit size={16} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleRemoveShowcase(showcase.id); }} className={styles.removeShowcaseInlineButton}>
                <MdClose size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Módulo Ativo (para o módulo ProductShowcaseModule como um todo) */}
      <div className={styles.inputGroup}>
        <label htmlFor={`ps-active-${id}`} className={styles.checkboxLabel}>
          <input
            id={`ps-active-${id}`}
            type="checkbox"
            className={styles.checkboxInput}
            checked={data.isActive ?? false}
            onChange={(e) => handleUpdateModuleData({ isActive: e.target.checked })}
          /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>

      {editingShowcase && (
        <EditShowcaseModal
          showcase={editingShowcase}
          onSave={handleSaveEditedShowcase}
          onClose={() => setEditingShowcase(null)}
          availableCategories={availableCategories}
          availableProducts={availableProducts}
        />
      )}
    </div>
  );
};

export default ProductShowcaseModule;