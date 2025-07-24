// app/(painel)/personalizar/components/editor/modules/MiniBannerModule.tsx
'use client';

import React, { ChangeEvent } from 'react';
import { MiniBannerModuleData, SingleMiniBannerData } from '../../../types';
// IMPORTANTE: Removido commonModuleStyles, agora tudo é styles
import styles from './MiniBannerModule.module.css'; // Importa os estilos específicos do MiniBannerModule
import { MdAdd, MdDeleteForever } from 'react-icons/md';

interface MiniBannerModuleProps {
  id: string;
  data: MiniBannerModuleData;
  onChange: (newData: Partial<MiniBannerModuleData>) => void;
  onRemove: (id: string) => void;
}

const MiniBannerModule: React.FC<MiniBannerModuleProps> = ({ id, data, onChange, onRemove }) => {
  const handleMiniBannerChange = (miniBannerId: string, field: keyof SingleMiniBannerData, value: any) => {
    const updatedBanners = data.banners.map(banner =>
      banner.id === miniBannerId ? { ...banner, [field]: value } : banner
    );
    onChange({ banners: updatedBanners });
  };

  const handleAddMiniBanner = () => {
    const newMiniBanner: SingleMiniBannerData = {
      id: `mb-${Date.now()}`,
      imageUrl: '',
      title: 'Novo Mini Banner',
      subtitle: 'Clique para editar',
      link: '#',
    };
    onChange({ banners: [...data.banners, newMiniBanner] });
  };

  const handleRemoveMiniBannerItem = (miniBannerId: string) => {
    if (window.confirm('Tem certeza que deseja remover este mini banner?')) {
        onChange({ banners: data.banners.filter(banner => banner.id !== miniBannerId) });
    }
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, bannerId: string) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        handleMiniBannerChange(bannerId, 'imageUrl', event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Configurações do Módulo Mini Banners</h4> 
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

      {/* Título do Módulo */}
      <div className={styles.inputGroup}> {/* USANDO styles.inputGroup */}
        <label htmlFor={`mini-banner-title-${id}`} className={styles.inputLabel}>Título da Seção:</label> {/* USANDO styles.inputLabel */}
        <input
          id={`mini-banner-title-${id}`}
          type="text"
          className={styles.textInput} 
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex: Nossos Benefícios"
        />
        <p className={styles.fieldDescription}>Um título para a seção de mini banners.</p> {/* USANDO styles.fieldDescription */}
      </div>

      {/* Layout */}
      <div className={styles.inputGroup}> 
        <label htmlFor={`mini-banner-layout-${id}`} className={styles.inputLabel}>Layout:</label>
        <select
          id={`mini-banner-layout-${id}`}
          className={styles.selectInput} 
          value={data.layout}
          onChange={(e) => onChange({ layout: e.target.value as 'grid' | 'carousel' })}
        >
          <option value="grid">Grade (Grid)</option>
          <option value="carousel">Carrossel (Carousel)</option>
        </select>
        <p className={styles.fieldDescription}>Define como os mini banners serão exibidos.</p> {/* USANDO styles.fieldDescription */}
      </div>

      <div className={styles.nestedInputGroup}> {/* USANDO styles.nestedInputGroup */}
        <h5 className={styles.nestedTitle}>Mini Banners Individuais</h5> {/* USANDO styles.nestedTitle */}
        {data.banners.length === 0 && <p className={styles.fieldDescription}>Nenhum mini banner adicionado ainda.</p>} {/* USANDO styles.fieldDescription */}
        {data.banners.map((banner, index) => (
          <div key={banner.id} className={styles.miniBannerItemEditor}> {/* USANDO styles.miniBannerItemEditor */}
            <h6 className={styles.miniBannerItemTitle}>Mini Banner #{index + 1}</h6> {/* USANDO styles.miniBannerItemTitle */}

            <button
              onClick={() => handleRemoveMiniBannerItem(banner.id)}
              className={styles.removeImageButton} 
              title="Remover este mini banner"
            >
              <MdDeleteForever className={styles.removeImageIcon} /> 
            </button>

            <div className={styles.inputGroup}> 
              <label className={styles.inputLabel}>Imagem do Mini Banner:</label> 
              <div
                className={styles.logoUploadBox} 
                style={{ minHeight: '80px' }}
                onClick={() => document.getElementById(`mini-banner-image-input-${banner.id}`)?.click()}
              >
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt="Preview Mini Banner" className={styles.fullBleedImagePreview} /> 
                ) : (
                  <span className={styles.logoPlaceholder}>Clique ou arraste para adicionar imagem</span> 
                )}
              </div>
              <input
                id={`mini-banner-image-input-${banner.id}`}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, banner.id)}
              />
              <p className={styles.fieldDescription}>
                Dimensões recomendadas: 300x150px.
              </p>
            </div>

            
            <div className={styles.inputGroup}>
              <label htmlFor={`mb-${banner.id}-title`} className={styles.inputLabel}>Título:</label> {/* USANDO styles.inputLabel */}
              <input
                id={`mb-${banner.id}-title`}
                type="text"
                className={styles.textInput} 
                value={banner.title}
                onChange={(e) => handleMiniBannerChange(banner.id, 'title', e.target.value)}
                placeholder="Título do Mini Banner"
              />
            </div>

            {/* Subtítulo do Mini Banner */}
            <div className={styles.inputGroup}> {/* USANDO styles.inputGroup */}
              <label htmlFor={`mb-${banner.id}-subtitle`} className={styles.inputLabel}>Subtítulo:</label> {/* USANDO styles.inputLabel */}
              <input
                id={`mb-${banner.id}-subtitle`}
                type="text"
                className={styles.textInput} 
                value={banner.subtitle}
                onChange={(e) => handleMiniBannerChange(banner.id, 'subtitle', e.target.value)}
                placeholder="Subtítulo do Mini Banner"
              />
            </div>

            {/* Link do Mini Banner */}
            <div className={styles.inputGroup}> 
              <label htmlFor={`mb-${banner.id}-link`} className={styles.inputLabel}>Link:</label> {/* USANDO styles.inputLabel */}
              <input
                id={`mb-${banner.id}-link`}
                type="text"
                className={styles.textInput} 
                value={banner.link}
                onChange={(e) => handleMiniBannerChange(banner.id, 'link', e.target.value)}
                placeholder="Link (Ex: /pagina-de-destino)"
              />
            </div>
          </div>
        ))}
        <button onClick={handleAddMiniBanner} className={styles.addButton}> {/* USANDO styles.addButton */}
          <MdAdd /> Adicionar Novo Mini Banner
        </button>
      </div>

      {/* Ativo */}
      <div className={styles.inputGroup}> {/* USANDO styles.inputGroup */}
        <label htmlFor={`mini-banner-isActive-${id}`} className={styles.checkboxLabel}> {/* USANDO styles.checkboxLabel */}
          <input
            id={`mini-banner-isActive-${id}`}
            type="checkbox"
            className={styles.checkboxInput} 
            checked={data.isActive}
            onChange={(e) => onChange({ isActive: e.target.checked })}
          /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p> {/* USANDO styles.fieldDescription */}
      </div>
    </div>
  );
};

export default MiniBannerModule;