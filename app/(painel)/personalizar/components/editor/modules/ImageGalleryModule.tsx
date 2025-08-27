// app/(painel)/personalizar/components/editor/modules/ImageGalleryModule.tsx
'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import { ImageGalleryModuleData, SingleImageGalleryData } from '../../../types';
import styles from './ImageGalleryModule.module.css'; 
import { MdDeleteForever, MdAdd, MdClose, MdEdit, MdOutlineFileUpload, MdImage as MdImageIcon } from 'react-icons/md'; 
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; 
import { v4 as uuidv4 } from 'uuid';

interface ImageGalleryModuleProps {
  id: string; 
  data: ImageGalleryModuleData; 
  onChange: (newData: Partial<ImageGalleryModuleData>) => void; 
  onRemove: (id: string) => void; 
}

const supabase = createClientComponentClient();
const SUPABASE_STORAGE_BUCKET = 'theme-images'; 

interface EditImageModalProps {
  image: SingleImageGalleryData;
  onSave: (updatedImage: SingleImageGalleryData) => void;
  onClose: () => void;
  moduleId: string; 
}

const EditImageModal: React.FC<EditImageModalProps> = ({ image, onSave, onClose, moduleId }) => {
  const [currentImage, setCurrentImage] = useState<SingleImageGalleryData>(image);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    const filePath = `${moduleId}/${currentImage.id}/gallery-image-${Date.now()}.${fileExtension}`;

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
        setCurrentImage(prev => ({ ...prev, imageUrl: publicUrlData.publicUrl as string }));
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

  const handleSave = () => {
    onSave(currentImage);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>Editar Imagem da Galeria</h5>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <MdClose size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Título da Imagem */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-gallery-title-${currentImage.id}`} className={styles.inputLabel}>Título da Imagem (opcional):</label>
            <input
              id={`modal-gallery-title-${currentImage.id}`}
              type="text"
              className={styles.textInput}
              value={currentImage.title ?? ''}
              onChange={(e) => setCurrentImage(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Coleção Verão 2024"
            />
            <p className={styles.fieldDescription}>Um título para esta imagem na galeria.</p>
          </div>

          {/* Link da Imagem */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-gallery-link-${currentImage.id}`} className={styles.inputLabel}>Link da Imagem (opcional):</label>
            <input
              id={`modal-gallery-link-${currentImage.id}`}
              type="text"
              className={styles.textInput}
              value={currentImage.link ?? ''}
              onChange={(e) => setCurrentImage(prev => ({ ...prev, link: e.target.value }))}
              placeholder="Ex: /colecao-verao"
            />
            <p className={styles.fieldDescription}>A URL para onde a imagem irá direcionar ao ser clicada.</p>
          </div>

          {/* Upload da Imagem */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Imagem:</label>
            <div
              className={styles.imageUploadBox}
              onClick={() => imageInputRef.current?.click()}
            >
              {currentImage.imageUrl ? (
                <img src={currentImage.imageUrl} alt="Preview Imagem" className={styles.imagePreview} />
              ) : (
                <div className={styles.uploadInner}>
                  <MdOutlineFileUpload className={styles.uploadIconPlaceholder} />
                  <span className={styles.uploadPlaceholder}>Clique para fazer upload (400x300px recomendado)</span>
                </div>
              )}
            </div>
            <input
              id={`image-file-input-${currentImage.id}`}
              ref={imageInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            {currentImage.imageUrl && (
                <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => setCurrentImage(prev => ({ ...prev, imageUrl: '' }))}
                >
                    <MdClose size={18} /> Remover Imagem
                </button>
            )}
            <p className={styles.fieldDescription}>Faça upload da imagem para a galeria.</p>
          </div>

          {/* Imagem Ativa */}
          <div className={styles.inputGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={currentImage.isActive ?? false}
                onChange={(e) => setCurrentImage(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              Imagem Ativa
            </label>
            <p className={styles.fieldDescription}>Desative para ocultar esta imagem na galeria.</p>
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

const ImageGalleryModule: React.FC<ImageGalleryModuleProps> = ({ id, data, onChange, onRemove }) => {
  const images: SingleImageGalleryData[] = data.images || [];
  const [editingImage, setEditingImage] = useState<SingleImageGalleryData | null>(null);

  const handleUpdateModuleData = (newModuleData: Partial<ImageGalleryModuleData>) => {
    onChange(newModuleData);
  };

  const handleAddImage = () => {
    const newImage: SingleImageGalleryData = {
      id: uuidv4(),
      imageUrl: '',
      title: 'Nova Imagem',
      link: '#',
      isActive: true,
    };
    handleUpdateModuleData({ images: [...images, newImage] });
  };

  const handleRemoveImage = (imageId: string) => {
    if (window.confirm('Tem certeza que deseja remover esta imagem da galeria?')) {
      const updatedImages = images.filter(img => img.id !== imageId);
      handleUpdateModuleData({ images: updatedImages });
    }
  };

  const handleSaveEditedImage = (updatedImage: SingleImageGalleryData) => {
    const updatedImages = images.map(img =>
      img.id === updatedImage.id ? updatedImage : img
    );
    handleUpdateModuleData({ images: updatedImages });
    setEditingImage(null);
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Galeria de Imagens</h4>
        <button onClick={() => onRemove(id)} className={styles.removeModuleButton} title="Remover Módulo">
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>
        Crie uma galeria de imagens para exibir fotos de produtos, coleções ou momentos especiais.
      </p>

      {/* Título Geral do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`gallery-title-${id}`} className={styles.inputLabel}>Título:</label>
        <input
          id={`gallery-title-${id}`}
          type="text"
          className={styles.textInput}
          value={data.title ?? ''}
          onChange={(e) => handleUpdateModuleData({ title: e.target.value })}
          placeholder="Ex: Nossa Coleção"
        />
        <p className={styles.fieldDescription}>Um título para esta seção da galeria (opcional).</p>
      </div>

      {/* Subtítulo Geral do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`gallery-subtitle-${id}`} className={styles.inputLabel}>Subtítulo:</label>
        <textarea
          id={`gallery-subtitle-${id}`}
          className={styles.textArea}
          value={data.subtitle ?? ''}
          onChange={(e) => handleUpdateModuleData({ subtitle: e.target.value })}
          placeholder="Ex: Momentos que inspiram"
          rows={3}
        />
        <p className={styles.fieldDescription}>Um subtítulo para esta seção da galeria (opcional).</p>
      </div>

      {/* Layout da Galeria */}
      <div className={styles.inputGroup}>
        <label htmlFor={`gallery-layout-${id}`} className={styles.inputLabel}>Layout da Galeria:</label>
        <select
          id={`gallery-layout-${id}`}
          className={styles.selectInput}
          value={data.layout ?? 'grid'}
          onChange={(e) => handleUpdateModuleData({ layout: e.target.value as 'grid' | 'carousel' })}
        >
          <option value="grid">Grade (Grid)</option>
          <option value="carousel">Carrossel (Slider)</option>
        </select>
        <p className={styles.fieldDescription}>Define como as imagens serão exibidas.</p>
      </div>

      {/* Número de Colunas (apenas se layout for 'grid') */}
      {data.layout === 'grid' && (
        <div className={styles.nestedInputGroup}>
          <label htmlFor={`gallery-grid-columns-${id}`} className={styles.inputLabel}>Colunas na Grade:</label>
          <select
            id={`gallery-grid-columns-${id}`}
            className={styles.selectInput}
            value={data.gridColumns ?? 3}
            onChange={(e) => handleUpdateModuleData({ gridColumns: parseInt(e.target.value, 10) as 2 | 3 | 4 })}
          >
            <option value={2}>2 Colunas</option>
            <option value={3}>3 Colunas</option>
            <option value={4}>4 Colunas</option>
          </select>
          <p className={styles.fieldDescription}>Número de colunas para o layout em grade.</p>
        </div>
      )}

      <button type="button" onClick={handleAddImage} className={styles.addImageButton}>
        <MdAdd /> Nova Imagem
      </button>

      {images.length === 0 && (
        <p className={styles.noContentMessage}>Nenhuma imagem adicionada ainda. Clique em "Adicionar Nova Imagem" para começar.</p>
      )}

      <div className={styles.imagesList}>
        {images.map((image, index) => (
          <div key={image.id} className={styles.imagePreviewItem}>
            <div className={styles.imagePreviewContent}>
              {image.imageUrl ? (
                <img src={image.imageUrl} alt={image.title || `Imagem ${index + 1}`} className={styles.galleryImagePreview} />
              ) : (
                <div className={styles.imagePlaceholder}>
                  <MdImageIcon size={48} />
                  <span>Imagem #{index + 1}</span>
                </div>
              )}
            </div>
            <div className={styles.imageActionsOverlay}>
              <button onClick={() => setEditingImage(image)} className={styles.editImageInlineButton} title="Editar Imagem">
                <MdEdit size={16} />
              </button>
              <button onClick={() => handleRemoveImage(image.id)} className={styles.removeImageInlineButton} title="Remover Imagem">
                <MdClose size={16} />
              </button>
            </div>
            <h5 className={styles.imagePreviewTitleBelowImage}>{image.title || `Imagem #${index + 1}`}</h5>
          </div>
        ))}
      </div>

      {/* Campo Ativo do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`gallery-active-${id}`} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id={`gallery-active-${id}`}
            className={styles.checkboxInput}
            checked={data.isActive ?? false}
            onChange={(e) => handleUpdateModuleData({ isActive: e.target.checked })}
          /> Módulo Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>

      {editingImage && (
        <EditImageModal
          image={editingImage}
          onSave={handleSaveEditedImage}
          onClose={() => setEditingImage(null)}
          moduleId={id}
        />
      )}
    </div>
  );
};

export default ImageGalleryModule;