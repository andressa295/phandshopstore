'use client';

import React, { ChangeEvent, useRef } from 'react';
import { BannerModuleData } from '../../../types';
import styles from './BannerModule.module.css';
import { MdDeleteForever, MdOutlineFileUpload } from 'react-icons/md';

interface BannerModuleProps {
  id: string;
  data: BannerModuleData;
  onChange: (newData: Partial<BannerModuleData>) => void;
  onRemove: (id: string) => void;
}

const BannerModule: React.FC<BannerModuleProps> = ({ id, data, onChange, onRemove }) => {
  const desktopImageInputRef = useRef<HTMLInputElement>(null);
  const mobileImageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>, field: keyof BannerModuleData) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ [field]: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Configurações do Módulo Banner</h4>
        <button onClick={() => onRemove(id)} className={styles.removeButton} title="Remover">
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor={`banner-title-${id}`} className={styles.inputLabel}>Título do Banner:</label>
        <input
          id={`banner-title-${id}`}
          type="text"
          className={styles.textInput}
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex: Nova Coleção de Verão"
        />
        <p className={styles.fieldDescription}>O texto principal do seu banner.</p>
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor={`banner-subtitle-${id}`} className={styles.inputLabel}>Subtítulo:</label>
        <textarea
          id={`banner-subtitle-${id}`}
          className={styles.textArea}
          value={data.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="Ex: Produtos com até 50% de desconto!"
        />
        <p className={styles.fieldDescription}>Texto complementar que acompanha o título.</p>
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Imagem Desktop:</label>
        <div
          className={styles.logoUploadBox}
          onClick={() => desktopImageInputRef.current?.click()}
        >
          {data.desktopImageUrl ? (
            <img src={data.desktopImageUrl} alt="Banner Desktop" className={styles.fullBleedImagePreview} />
          ) : (
            <div className={styles.uploadInner}>
              <MdOutlineFileUpload className={styles.uploadIconPlaceholder} />
              <span className={styles.logoPlaceholder}>Clique para fazer upload (1920x600px)</span>
            </div>
          )}
        </div>
        <input
          ref={desktopImageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e, 'desktopImageUrl')}
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Imagem Mobile:</label>
        <div
          className={styles.logoUploadBox}
          onClick={() => mobileImageInputRef.current?.click()}
        >
          {data.mobileImageUrl ? (
            <img src={data.mobileImageUrl} alt="Banner Mobile" className={styles.fullBleedImagePreview} />
          ) : (
            <div className={styles.uploadInner}>
              <MdOutlineFileUpload className={styles.uploadIconPlaceholder} />
              <span className={styles.logoPlaceholder}>Clique para fazer upload (600x800px)</span>
            </div>
          )}
        </div>
        <input
          ref={mobileImageInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e, 'mobileImageUrl')}
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor={`banner-buttonText-${id}`} className={styles.inputLabel}>Texto do Botão (opcional):</label>
        <input
          id={`banner-buttonText-${id}`}
          type="text"
          className={styles.textInput}
          value={data.buttonText}
          onChange={(e) => onChange({ buttonText: e.target.value })}
          placeholder="Ex: Comprar Agora"
        />
      </div>

      <div className={styles.inputGroup}>
        <label htmlFor={`banner-buttonLink-${id}`} className={styles.inputLabel}>Link do Botão (opcional):</label>
        <input
          id={`banner-buttonLink-${id}`}
          type="text"
          className={styles.textInput}
          value={data.buttonLink}
          onChange={(e) => onChange({ buttonLink: e.target.value })}
          placeholder="Ex: /categorias/promocao"
        />
      </div>

      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={data.isActive}
            onChange={(e) => onChange({ isActive: e.target.checked })}
          />
          Módulo Ativo
        </label>
      </div>
    </div>
  );
};

export default BannerModule;
