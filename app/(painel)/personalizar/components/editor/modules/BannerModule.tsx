// app/(painel)/personalizar/components/editor/modules/BannerModule.tsx
'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import { BannerModuleData, SingleBannerData } from '../../../types';
import styles from './BannerModule.module.css'; 
import { MdDeleteForever, MdOutlineFileUpload, MdAdd, MdClose, MdEdit, MdImage as MdImageIcon } from 'react-icons/md'; // Ícones
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; 
import { v4 as uuidv4 } from 'uuid'; 

interface BannerModuleProps {
  id: string; 
  data: BannerModuleData; 
  onChange: (newData: Partial<BannerModuleData>) => void;
  onRemove: (id: string) => void; 
}

// Inicializa o cliente Supabase para Client Components
const supabase = createClientComponentClient();
const SUPABASE_STORAGE_BUCKET = 'theme-images';


interface EditBannerModalProps {
  banner: SingleBannerData;
  onSave: (updatedBanner: SingleBannerData) => void;
  onClose: () => void;
}

const EditBannerModal: React.FC<EditBannerModalProps> = ({ banner, onSave, onClose }) => {
  const [currentBanner, setCurrentBanner] = useState<SingleBannerData>(banner);

  const desktopImageInputRef = useRef<HTMLInputElement>(null);
  const mobileImageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, field: 'desktopImageUrl' | 'mobileImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    const filePath = `${banner.id}/${currentBanner.id}/${field}-${Date.now()}.${fileExtension}`; 

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
        setCurrentBanner(prev => ({ ...prev, [field]: publicUrlData.publicUrl }));
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
    onSave(currentBanner);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>Editar Banner</h5>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <MdClose size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Título do Banner */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-banner-title-${currentBanner.id}`} className={styles.inputLabel}>Título do Banner:</label>
            <input
              id={`modal-banner-title-${currentBanner.id}`}
              type="text"
              className={styles.textInput}
              value={currentBanner.title ?? ''}
              onChange={(e) => setCurrentBanner(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Ex: Nova Coleção de Verão"
            />
            <p className={styles.fieldDescription}>O texto principal do seu banner.</p>
          </div>

          {/* Subtítulo do Banner */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-banner-subtitle-${currentBanner.id}`} className={styles.inputLabel}>Subtítulo:</label>
            <textarea
              id={`modal-banner-subtitle-${currentBanner.id}`}
              className={styles.textArea}
              value={currentBanner.subtitle ?? ''}
              onChange={(e) => setCurrentBanner(prev => ({ ...prev, subtitle: e.target.value }))}
              placeholder="Ex: Produtos com até 50% de desconto!"
            />
            <p className={styles.fieldDescription}>Texto que acompanha o título.</p>
          </div>

          {/* Link do Botão */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-banner-buttonLink-${currentBanner.id}`} className={styles.inputLabel}>Link do Botão (opcional):</label>
            <input
              id={`modal-banner-buttonLink-${currentBanner.id}`}
              type="text"
              className={styles.textInput}
              value={currentBanner.buttonLink ?? ''}
              onChange={(e) => setCurrentBanner(prev => ({ ...prev, buttonLink: e.target.value }))}
              placeholder="Ex: /categorias/promocao"
            />
            <p className={styles.fieldDescription}>A URL para onde o botão do banner irá direcionar.</p>
          </div>

          {/* Cor do Overlay */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-banner-overlayColor-${currentBanner.id}`} className={styles.inputLabel}>Cor do Overlay:</label>
            <input
              id={`modal-banner-overlayColor-${currentBanner.id}`}
              type="color"
              className={styles.colorInput}
              value={currentBanner.overlayColor ?? '#000000'}
              onChange={(e) => setCurrentBanner(prev => ({ ...prev, overlayColor: e.target.value }))}
            />
            <p className={styles.fieldDescription}>Cor da camada escura sobre a imagem do banner.</p>
          </div>

          {/* Opacidade do Overlay */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-banner-overlayOpacity-${currentBanner.id}`} className={styles.inputLabel}>Opacidade do Overlay (0-1):</label>
            <input
              id={`modal-banner-overlayOpacity-${currentBanner.id}`}
              type="number"
              className={styles.textInput}
              value={currentBanner.overlayOpacity ?? 0.3}
              onChange={(e) => setCurrentBanner(prev => ({ ...prev, overlayOpacity: parseFloat(e.target.value) }))}
              min="0"
              max="1"
              step="0.1"
            />
            <p className={styles.fieldDescription}>Transparência da camada escura (0 = totalmente transparente, 1 = totalmente opaco).</p>
          </div>

          {/* Módulo Ativo */}
          <div className={styles.inputGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={currentBanner.isActive ?? false}
                onChange={(e) => setCurrentBanner(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              Banner Ativo
            </label>
            <p className={styles.fieldDescription}>Desative para ocultar este banner específico no carrossel.</p>
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

const BannerModule: React.FC<BannerModuleProps> = ({ id, data, onChange, onRemove }) => {
  const banners: SingleBannerData[] = data.banners || [];
  const [editingBanner, setEditingBanner] = useState<SingleBannerData | null>(null);

  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});


  const handleUpdateModuleData = (newModuleData: Partial<BannerModuleData>) => {
    onChange(newModuleData);
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, bannerId: string, field: 'desktopImageUrl' | 'mobileImageUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    const filePath = `${id}/${bannerId}/${field}-${Date.now()}.${fileExtension}`;

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
        handleUpdateBanner(bannerId, { [field]: publicUrlData.publicUrl as string });
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

  const handleUpdateBanner = (bannerId: string, newBannerData: Partial<SingleBannerData>) => {
    const updatedBanners = banners.map(banner =>
      banner.id === bannerId ? { ...banner, ...newBannerData } : banner
    );
    handleUpdateModuleData({ banners: updatedBanners });
  };

  const handleAddBanner = () => {
    const newBanner: SingleBannerData = {
      id: uuidv4(),
      desktopImageUrl: '',
      mobileImageUrl: '',
      title: 'Novo Banner',
      subtitle: 'Clique para editar',
      buttonText: '',
      buttonLink: '',
      overlayColor: '#000000',
      overlayOpacity: 0.3,
      isActive: true,
    };
    handleUpdateModuleData({ banners: [...banners, newBanner] });
  };

  const handleRemoveBanner = (bannerId: string) => {
    if (window.confirm('Tem certeza que deseja remover este banner?')) {
      const updatedBanners = banners.filter(banner => banner.id !== bannerId);
      handleUpdateModuleData({ banners: updatedBanners });
    }
  };

  const handleSaveEditedBanner = (updatedBanner: SingleBannerData) => {
    const updatedBanners = banners.map(b =>
      b.id === updatedBanner.id ? updatedBanner : b
    );
    handleUpdateModuleData({ banners: updatedBanners });
    setEditingBanner(null);
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}> Banner Rotativo</h4>
        <button onClick={() => onRemove(id)} className={styles.removeModuleButton} title="Remover Módulo">
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>Gerencie as imagens e textos que aparecerão no carrossel de banners da sua página inicial.</p>

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
        <p className={styles.fieldDescription}>Um título para esta seção de banners (opcional).</p>
      </div>

      {/* Subtítulo Geral do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`module-subtitle-${id}`} className={styles.inputLabel}>Subtítulo:</label>
        <textarea
          id={`module-subtitle-${id}`}
          className={styles.textArea}
          value={data.subtitle ?? ''}
          onChange={(e) => handleUpdateModuleData({ subtitle: e.target.value })}
          placeholder="Ex: Confira nossas últimas novidades"
        />
        <p className={styles.fieldDescription}>Um subtítulo para esta seção de banners (opcional).</p>
      </div>

      <button type="button" onClick={handleAddBanner} className={styles.addBannerButton}>
        <MdAdd />  Novo banner
      </button>

      {banners.length === 0 && (
        <p className={styles.noContentMessage}>Nenhum banner adicionado ainda. Clique em "Adicionar Novo Banner" para começar.</p>
      )}

      <div className={styles.bannersList}>
        {banners.map((banner, index) => (
          <div key={banner.id} className={styles.bannerPreviewItem}>
            <div
              className={styles.bannerPreviewImageWrapper}
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: Event) => {
                  const target = e.target as HTMLInputElement;
                  const simulatedChangeEvent: ChangeEvent<HTMLInputElement> = {
                    ...e,
                    target: target,
                    currentTarget: target,
                    nativeEvent: e, // Adiciona nativeEvent
                    isDefaultPrevented: () => false, // Mock
                    isPropagationStopped: () => false, // Mock
                    persist: () => {}, // Mock
                  };
                  handleFileUpload(simulatedChangeEvent, banner.id, 'desktopImageUrl');
                };
                input.click();
              }}
            >
              {banner.desktopImageUrl ? (
                <img src={banner.desktopImageUrl} alt={`Banner ${index + 1}`} className={styles.bannerPreviewImage} />
              ) : (
                <div className={styles.bannerPlaceholder}>
                  <MdImageIcon size={48} />
                  <span>Clique para adicionar imagem</span>
                </div>
              )}
            </div>

            {/* Botões de Ação no Canto Superior Direito (visíveis no hover) */}
            <div className={styles.bannerActionsOverlay}>
              <button onClick={(e) => { e.stopPropagation(); setEditingBanner(banner); }} className={styles.editBannerInlineButton} title="Editar Banner">
                <MdEdit size={16} />
              </button>
              <button onClick={(e) => { e.stopPropagation(); handleRemoveBanner(banner.id); }} className={styles.removeBannerInlineButton} title="Remover Banner">
                <MdClose size={16} />
              </button>
            </div>
            {/* Título abaixo da imagem (para melhor visibilidade sem overlay) */}
            <h5 className={styles.bannerPreviewTitleBelowImage}>{banner.title || `Banner #${index + 1}`}</h5>
          </div>
        ))}
      </div>

      {/* Opções de Layout do Carrossel (para o módulo Banner como um todo) */}
      <div className={styles.inputGroup}>
        <label htmlFor={`banner-layout-${id}`} className={styles.inputLabel}>Layout do Carrossel:</label>
        <select
          id={`banner-layout-${id}`}
          className={styles.selectInput}
          value={data.layout ?? 'carousel'}
          onChange={(e) => handleUpdateModuleData({ layout: e.target.value as 'carousel' | 'fade' })}
        >
          <option value="carousel">Carrossel Padrão</option>
          <option value="fade">Transição Suave (Fade)</option>
        </select>
        <p className={styles.fieldDescription}>Escolha o tipo de transição entre os banners.</p>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor={`banner-autoplay-${id}`} className={styles.checkboxLabel}>
          <input
            id={`banner-autoplay-${id}`}
            type="checkbox"
            className={styles.checkboxInput}
            checked={data.autoplay ?? true}
            onChange={(e) => handleUpdateModuleData({ autoplay: e.target.checked })}
          />
          Reprodução Automática
        </label>
        <p className={styles.fieldDescription}>Os banners mudarão automaticamente após um tempo.</p>
      </div>

      {data.autoplay && (
        <div className={styles.inputGroupSmall}>
          <label htmlFor={`banner-interval-${id}`} className={styles.inputLabel}>Intervalo (segundos):</label>
          <input
            id={`banner-interval-${id}`}
            type="number"
            className={styles.textInput}
            value={data.interval ?? 5}
            onChange={(e) => handleUpdateModuleData({ interval: parseInt(e.target.value, 10) })}
            min="1"
          />
          <p className={styles.fieldDescription}>Tempo em segundos que cada banner ficará visível.</p>
        </div>
      )}

      {/* Módulo Ativo (para o módulo Banner como um todo) */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={data.isActive ?? false}
            onChange={(e) => handleUpdateModuleData({ isActive: e.target.checked })}
          />
          Módulo Banner Ativo
        </label>
        <p className={styles.fieldDescription}>Desative para ocultar todo o carrossel de banners na página inicial.</p>
      </div>

      {editingBanner && (
        <EditBannerModal
          banner={editingBanner}
          onSave={handleSaveEditedBanner}
          onClose={() => setEditingBanner(null)}
        />
      )}
    </div>
  );
};

export default BannerModule;