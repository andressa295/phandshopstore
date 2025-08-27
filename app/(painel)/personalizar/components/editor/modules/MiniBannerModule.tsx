// app/(painel)/personalizar/components/editor/modules/MiniBannerModule.tsx
'use client';

import React, { ChangeEvent, useRef, useState, useCallback } from 'react'; 
import { MiniBannerModuleData, SingleMiniBannerData } from '../../../types';
import styles from './MiniBannerModule.module.css'; 
import { MdAdd, MdDeleteForever, MdOutlineFileUpload, MdClose } from 'react-icons/md'; 
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; 
import { v4 as uuidv4 } from 'uuid'; 

interface MiniBannerModuleProps {
  id: string; 
  data: MiniBannerModuleData; 
  onChange: (newData: Partial<MiniBannerModuleData>) => void; 
  onRemove: (id: string) => void; 
}

const supabase = createClientComponentClient();
const SUPABASE_STORAGE_BUCKET = 'theme-images'; 

interface EditBannerModalProps {
  banner: SingleMiniBannerData; 
  onSave: (updatedBanner: SingleMiniBannerData) => void;
  onClose: () => void;
}

const EditBannerModal: React.FC<EditBannerModalProps> = ({ banner, onSave, onClose }) => {
  const [currentBanner, setCurrentBanner] = useState<SingleMiniBannerData>(banner);

  const handleSave = () => {
    onSave(currentBanner);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>Editar Mini Banner</h5>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <MdClose size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Título do Mini Banner */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-mb-title-${currentBanner.id}`} className={styles.inputLabel}>Título:</label>
            <input
              id={`modal-mb-title-${currentBanner.id}`}
              type="text"
              className={styles.textInput}
              value={currentBanner.title ?? ''}
              onChange={(e) => setCurrentBanner(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Título do Mini Banner"
            />
            <p className={styles.fieldDescription}>O título principal do mini banner.</p>
          </div>

          {/* Subtítulo do Mini Banner */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-mb-subtitle-${currentBanner.id}`} className={styles.inputLabel}>Subtítulo:</label>
            <input
              id={`modal-mb-subtitle-${currentBanner.id}`}
              type="text"
              className={styles.textInput}
              value={currentBanner.subtitle ?? ''}
              onChange={(e) => setCurrentBanner(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Subtítulo do Mini Banner"
            />
            <p className={styles.fieldDescription}>Um texto complementar para o mini banner.</p>
          </div>

          {/* Link do Mini Banner */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-mb-link-${currentBanner.id}`} className={styles.inputLabel}>Link:</label>
            <input
              id={`modal-mb-link-${currentBanner.id}`}
              type="text"
              className={styles.textInput}
              value={currentBanner.link ?? ''}
              onChange={(e) => setCurrentBanner(prev => ({ ...prev, link: e.target.value }))}
              placeholder="Link (Ex: /pagina-de-destino)"
            />
            <p className={styles.fieldDescription}>A URL para onde o mini banner irá direcionar.</p>
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

const MiniBannerModule: React.FC<MiniBannerModuleProps> = ({ id, data, onChange, onRemove }) => {
  const banners: SingleMiniBannerData[] = data.banners || [];
  const [editingBanner, setEditingBanner] = useState<SingleMiniBannerData | null>(null);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});


  const handleUpdateModuleData = useCallback((newModuleData: Partial<MiniBannerModuleData>) => {
    onChange(newModuleData);
  }, [onChange]);

  const handleMiniBannerChange = useCallback((miniBannerId: string, field: keyof SingleMiniBannerData, value: any) => {
    const updatedBanners = banners.map(banner =>
      banner.id === miniBannerId ? { ...banner, [field]: value } : banner
    );
    handleUpdateModuleData({ banners: updatedBanners });
  }, [banners, handleUpdateModuleData]); 

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, bannerId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    const filePath = `${id}/${bannerId}/image-${Date.now()}.${fileExtension}`;

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
        handleMiniBannerChange(bannerId, 'imageUrl', publicUrlData.publicUrl as string);
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

  const handleAddMiniBanner = () => {
    const newMiniBanner: SingleMiniBannerData = {
      id: uuidv4(), 
      imageUrl: '',
      title: 'Novo Mini Banner',
      subtitle: 'Descrição breve',
      link: '#',
    };
    onChange({ banners: [...banners, newMiniBanner] });
  };

  const handleRemoveMiniBannerItem = (miniBannerId: string) => {
    if (window.confirm('Tem certeza que deseja remover este mini banner?')) {
      onChange({ banners: banners.filter(banner => banner.id !== miniBannerId) });
    }
  };

  const handleSaveEditedBanner = (updatedBanner: SingleMiniBannerData) => {
    const updatedBanners = banners.map(b =>
      b.id === updatedBanner.id ? updatedBanner : b
    );
    handleUpdateModuleData({ banners: updatedBanners });
    setEditingBanner(null);
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}> Mini Banners</h4>
        <button
          onClick={() => onRemove(id)}
          className={styles.removeModuleButton}
          title="Remover este módulo"
        >
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>
        Adicione e personalize pequenos banners com imagens, títulos e links para destacar produtos ou categorias.
      </p>

      {/* Título Geral do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`mini-banner-module-title-${id}`} className={styles.inputLabel}>Título Geral do Módulo:</label>
        <input
          id={`mini-banner-module-title-${id}`}
          type="text"
          className={styles.textInput}
          value={data.title ?? ''}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex: Nossos Destaques"
        />
        <p className={styles.fieldDescription}>Um título para esta seção de mini banners (opcional).</p>
      </div>

      {/* Layout */}
      <div className={styles.inputGroup}>
        <label htmlFor={`mini-banner-layout-${id}`} className={styles.inputLabel}>Layout:</label>
        <select
          id={`mini-banner-layout-${id}`}
          className={styles.selectInput}
          value={data.layout ?? 'grid'}
          onChange={(e) => onChange({ layout: e.target.value as 'grid' | 'carousel' })}
        >
          <option value="grid">Grade (Grid)</option>
          <option value="carousel">Carrossel (Carousel)</option>
        </select>
        <p className={styles.fieldDescription}>Define como os mini banners serão exibidos.</p>
      </div>

      <button onClick={handleAddMiniBanner} className={styles.addMiniBannerButton}>
        <MdAdd /> Mini banner
      </button>

      {banners.length === 0 && (
        <p className={styles.noContentMessage}>Nenhum mini banner adicionado ainda. Clique em "Adicionar Novo Mini Banner" para começar.</p>
      )}

      <div className={styles.bannersList}>
        {banners.map((banner, index) => (
          <div key={banner.id} className={styles.miniBannerItem}>
            <div
              className={styles.miniBannerImageWrapper}
              onClick={() => fileInputRefs.current[`file-input-${banner.id}`]?.click()}
            >
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={`Clique para adicionar imagem ${index + 1}`} className={styles.miniBannerImagePreview} />
              ) : (
                <div className={styles.uploadInner}>
                  <MdOutlineFileUpload className={styles.uploadIconPlaceholder} />
                  <span>Clique para adicionar imagem</span>
                </div>
              )}
              <input
                id={`file-input-${banner.id}`}
                ref={(el: HTMLInputElement | null) => { fileInputRefs.current[`file-input-${banner.id}`] = el; }} // <--- CORREÇÃO AQUI
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleFileUpload(e, banner.id)}
              />
            </div>

            <div className={styles.miniBannerDetails}>
              {/* Título do Mini Banner */}
              <div className={styles.inputGroupInline}>
                <label htmlFor={`mb-${banner.id}-title`} className={styles.inputLabel}>Título:</label>
                <input
                  id={`mb-${banner.id}-title`}
                  type="text"
                  className={styles.textInputInline}
                  value={banner.title ?? ''}
                  onChange={(e) => handleMiniBannerChange(banner.id, 'title', e.target.value)}
                  placeholder="Título do Mini Banner"
                />
              </div>

              {/* Subtítulo do Mini Banner */}
              <div className={styles.inputGroupInline}>
                <label htmlFor={`mb-${banner.id}-subtitle`} className={styles.inputLabel}>Subtítulo:</label>
                <input
                  id={`mb-${banner.id}-subtitle`}
                  type="text"
                  className={styles.textInputInline}
                  value={banner.subtitle ?? ''}
                  onChange={(e) => handleMiniBannerChange(banner.id, 'subtitle', e.target.value)}
                  placeholder="Subtítulo do Mini Banner"
                />
              </div>

              {/* Link do Mini Banner */}
              <div className={styles.inputGroupInline}>
                <label htmlFor={`mb-${banner.id}-link`} className={styles.inputLabel}>Link:</label>
                <input
                  id={`mb-${banner.id}-link`}
                  type="text"
                  className={styles.textInputInline}
                  value={banner.link ?? ''}
                  onChange={(e) => handleMiniBannerChange(banner.id, 'link', e.target.value)}
                  placeholder="Link (Ex: /pagina-de-destino)"
                />
              </div>
            </div>

            {/* Botão de Remover Mini Banner Individual */}
            <button
              onClick={() => handleRemoveMiniBannerItem(banner.id)}
              className={styles.removeMiniBannerItemButton}
              title="Remover este mini banner"
            >
              <MdClose size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* Opções de Ativo para o Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`mini-banner-isActive-${id}`} className={styles.checkboxLabel}>
          <input
            id={`mini-banner-isActive-${id}`}
            type="checkbox"
            className={styles.checkboxInput}
            checked={data.isActive ?? false}
            onChange={(e) => onChange({ isActive: e.target.checked })}
          /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>
    </div>
  );
};

export default MiniBannerModule;