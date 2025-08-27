// app/(painel)/personalizar/components/editor/modules/CategoriesModule.tsx
'use client';

import React, { useState, useEffect, ChangeEvent, useRef, useCallback } from 'react'; // Adicionado useCallback
import { CategoriesModuleData, CategoryData, SelectedCategoryDisplayData } from '../../../types';
import styles from './CategoriesModule.module.css'; 
import { MdAdd, MdDeleteForever, MdOutlineFileUpload, MdClose } from 'react-icons/md'; // Adicionado MdOutlineFileUpload
import { useTheme } from '../../../context/ThemeContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; 
import { v4 as uuidv4 } from 'uuid'; // 

interface CategoriesModuleProps {
  id: string;
  data: CategoriesModuleData;
  onChange: (newData: Partial<CategoriesModuleData>) => void;
  onRemove: (id: string) => void;
}

const supabase = createClientComponentClient();
const SUPABASE_STORAGE_BUCKET = 'theme-images'; 


const CategoriesModule: React.FC<CategoriesModuleProps> = ({ id, data, onChange, onRemove }) => {
  const { config } = useTheme(); 
  const availableCategories: CategoryData[] = config.homepage?.categoriesData || [];
  const categoriesToDisplay: SelectedCategoryDisplayData[] = data.categoriesToDisplay || [];

  const [searchTerm, setSearchTerm] = useState<string>('');


  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});


  const filteredAvailableCategories = availableCategories.filter(cat =>
    cat.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !categoriesToDisplay.some(selected => selected.id === cat.id) 
  );

  const handleUpdateModuleData = useCallback((newModuleData: Partial<CategoriesModuleData>) => {
    onChange(newModuleData);
  }, [onChange]);

  const handleUpdateCategoryData = useCallback((categoryId: string, newCategoryData: Partial<SelectedCategoryDisplayData>) => {
    const updatedCategories = categoriesToDisplay.map(cat =>
      cat.id === categoryId ? { ...cat, ...newCategoryData } : cat
    );
    handleUpdateModuleData({ categoriesToDisplay: updatedCategories });
  }, [categoriesToDisplay, handleUpdateModuleData]);


  const handleAddCategory = (categoryId: string) => {
    const categoryToAdd = availableCategories.find(cat => cat.id === categoryId);
    if (categoryToAdd) {
      const newCategory: SelectedCategoryDisplayData = {
        id: categoryToAdd.id,
        nome: categoryToAdd.nome,
        slug: categoryToAdd.slug,
        imageUrl: categoryToAdd.imagem_url || '', 
        isActive: true,
      };
      handleUpdateModuleData({ categoriesToDisplay: [...categoriesToDisplay, newCategory] });
      setSearchTerm(''); 
    }
  };

  const handleRemoveCategory = (categoryId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta categoria da exibição?')) {
      const newSelectedCategories = categoriesToDisplay.filter(cat => cat.id !== categoryId);
      handleUpdateModuleData({ categoriesToDisplay: newSelectedCategories });
    }
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, categoryId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    const filePath = `${id}/${categoryId}/image-${Date.now()}.${fileExtension}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        handleUpdateCategoryData(categoryId, { imageUrl: publicUrlData.publicUrl as string });
        console.log('Upload de imagem concluído com sucesso:', publicUrlData.publicUrl);
      } else {
        console.error('Não foi possível obter a URL pública da imagem.');
      }

    } catch (error: any) {
      console.error('Erro inesperado no upload:', error);
    } finally {
      e.target.value = ''; 
    }
  };


  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Categorias</h4>
        <button
          onClick={() => onRemove(id)}
          className={styles.removeModuleButton}
          title="Remover este módulo"
        >
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>
        Exiba uma seleção de categorias de produtos na sua página inicial, com imagens personalizadas.
      </p>

      {/* Campo Título */}
      <div className={styles.inputGroup}>
        <label htmlFor={`cat-title-${id}`} className={styles.inputLabel}>Título:</label>
        <input
          type="text"
          id={`cat-title-${id}`}
          className={styles.textInput}
          value={data.title ?? ''}
          onChange={(e) => handleUpdateModuleData({ title: e.target.value })}
          placeholder="Ex: Nossas Categorias"
        />
        <p className={styles.fieldDescription}>Título exibido acima das categorias.</p>
      </div>

      {/* Campo Layout */}
      <div className={styles.inputGroup}>
        <label htmlFor={`cat-layout-${id}`} className={styles.inputLabel}>Layout:</label>
        <select
          id={`cat-layout-${id}`}
          className={styles.selectInput}
          value={data.layout ?? 'grid'}
          onChange={(e) => handleUpdateModuleData({ layout: e.target.value as 'grid' | 'carousel' })}
        >
          <option value="grid">Grade (Itens lado a lado)</option>
          <option value="carousel">Carrossel (Itens deslizantes)</option>
        </select>
        <p className={styles.fieldDescription}>Define como as categorias serão dispostas.</p>
      </div>

      {/* Seleção de Categorias */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Gerenciar Categorias para Exibição:</label>
        <p className={styles.fieldDescription}>
          Selecione as categorias que deseja exibir. Clique na imagem para fazer upload de um ícone customizado.
        </p>

        {/* Lista de Categorias Selecionadas */}
        {categoriesToDisplay.length === 0 ? (
          <p className={styles.noContentMessage}>Nenhuma categoria selecionada.</p>
        ) : (
          <div className={styles.selectedCategoriesList}>
            {categoriesToDisplay.map((cat, index) => (
              <div key={cat.id} className={styles.selectedCategoryItem}>
                <div
                  className={styles.categoryImageWrapper}
                  onClick={() => fileInputRefs.current[`file-input-${cat.id}`]?.click()}
                >
                  {cat.imageUrl ? (
                    <img src={cat.imageUrl} alt={cat.nome} className={styles.categoryImagePreview} />
                  ) : (
                    <div className={styles.uploadInner}>
                      <MdOutlineFileUpload className={styles.uploadIconPlaceholder} />
                      <span>Adicionar Imagem</span>
                    </div>
                  )}
                  <input
                    id={`file-input-${cat.id}`}
                    ref={(el: HTMLInputElement | null) => { fileInputRefs.current[`file-input-${cat.id}`] = el; }} 
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileUpload(e, cat.id)}
                  />
                </div>
                <span className={styles.categoryName}>{cat.nome}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(cat.id)}
                  className={styles.removeCategoryButton}
                >
                  <MdClose size={16} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Busca e Adição de Categorias */}
        <div className={styles.nestedInputGroup}>
          <label htmlFor={`search-categories-${id}`} className={styles.inputLabel}>Adicionar Categoria:</label>
          <input
            id={`search-categories-${id}`}
            type="text"
            className={styles.textInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar categorias disponíveis..."
          />
          {searchTerm && filteredAvailableCategories.length > 0 && (
            <div className={styles.availableCategoriesDropdown}>
              {filteredAvailableCategories.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  className={styles.addCategoryButtonDropdown}
                  onClick={() => handleAddCategory(cat.id)}
                >
                  {cat.nome}
                </button>
              ))}
            </div>
          )}
          {searchTerm && filteredAvailableCategories.length === 0 && (
            <p className={styles.noResultsMessage}>Nenhuma categoria encontrada com "{searchTerm}".</p>
          )}
          {!searchTerm && availableCategories.length === 0 && (
            <p className={styles.noResultsMessage}>Nenhuma categoria disponível para adicionar. Verifique suas categorias de produtos.</p>
          )}
        </div>
      </div>

      {/* Campo Ativo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`cat-active-${id}`} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id={`cat-active-${id}`}
            className={styles.checkboxInput}
            checked={data.isActive ?? false}
            onChange={(e) => handleUpdateModuleData({ isActive: e.target.checked })}
          /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>
    </div>
  );
};

export default CategoriesModule;