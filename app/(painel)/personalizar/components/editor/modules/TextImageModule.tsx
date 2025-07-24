// app/(painel)/personalizar/components/editor/modules/TextImageModule.tsx
'use client';

import React, { ChangeEvent, useRef } from 'react';
import { TextImageModuleData } from '../../../types';
import styles from './TextImageModule.module.css'; // Importa estilos locais
import { MdDeleteForever } from 'react-icons/md';

interface TextImageModuleProps {
  id: string;
  data: TextImageModuleData;
  onChange: (newData: Partial<TextImageModuleData>) => void;
  onRemove: (id: string) => void;
}

const TextImageModule: React.FC<TextImageModuleProps> = ({ id, data, onChange, onRemove }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onChange({ imageUrl: event.target?.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Configurações de Texto e Imagem</h4>
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
        <label htmlFor={`ti-title-${id}`} className={styles.inputLabel}>Título:</label>
        <input
            type="text"
            id={`ti-title-${id}`}
            className={styles.textInput}
            value={data.title}
            onChange={(e) => onChange({ title: e.target.value })}
            placeholder="Ex: Conheça Nossa História"
        />
        <p className={styles.fieldDescription}>O título principal do bloco de texto e imagem.</p>
      </div>

      {/* Campo Texto */}
      <div className={styles.inputGroup}>
        <label htmlFor={`ti-text-${id}`} className={styles.inputLabel}>Texto:</label>
        <textarea
            id={`ti-text-${id}`}
            className={styles.textArea}
            value={data.text}
            onChange={(e) => onChange({ text: e.target.value })}
            rows={6}
            placeholder="Insira o texto descritivo aqui."
        ></textarea>
        <p className={styles.fieldDescription}>O conteúdo textual que acompanhará a imagem.</p>
      </div>

      {/* Campo URL da Imagem / Upload */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Imagem:</label>
        <div
          className={styles.logoUploadBox}
          style={{ minHeight: '150px' }}
          onClick={() => imageInputRef.current?.click()}
        >
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="Preview Imagem" className={styles.fullBleedImagePreview} />
          ) : (
            <span className={styles.logoPlaceholder}>Clique ou arraste para adicionar imagem</span>
          )}
        </div>
        <input
          ref={imageInputRef}
          id={`ti-img-upload-${id}`}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <p className={styles.fieldDescription}>
          Faça upload de uma imagem ou insira a URL diretamente. Dimensões recomendadas: 600x400px.
        </p>
      </div>

      {/* Campo Posição da Imagem */}
      <div className={styles.inputGroup}>
        <label htmlFor={`ti-position-${id}`} className={styles.inputLabel}>Posição da Imagem:</label>
        <select
            id={`ti-position-${id}`}
            className={styles.selectInput}
            value={data.imagePosition}
            onChange={(e) => onChange({ imagePosition: e.target.value as 'left' | 'right' })}
        >
            <option value="left">Esquerda do Texto</option>
            <option value="right">Direita do Texto</option>
        </select>
        <p className={styles.fieldDescription}>Define se a imagem aparecerá à esquerda ou à direita do texto.</p>
      </div>

      {/* Campo Texto do Botão */}
      <div className={styles.inputGroup}>
        <label htmlFor={`ti-btntext-${id}`} className={styles.inputLabel}>Texto do Botão (opcional):</label>
        <input
            type="text"
            id={`ti-btntext-${id}`}
            className={styles.textInput}
            value={data.buttonText}
            onChange={(e) => onChange({ buttonText: e.target.value })}
            placeholder="Ex: Saiba Mais"
        />
        <p className={styles.fieldDescription}>Deixe em branco se não quiser um botão.</p>
      </div>

      {/* Campo Link do Botão */}
      <div className={styles.inputGroup}>
        <label htmlFor={`ti-btnlink-${id}`} className={styles.inputLabel}>Link do Botão (opcional):</label>
        <input
            type="text"
            id={`ti-btnlink-${id}`}
            className={styles.textInput}
            value={data.buttonLink}
            onChange={(e) => onChange({ buttonLink: e.target.value })}
            placeholder="Ex: /sobre-nos"
        />
        <p className={styles.fieldDescription}>Para onde o botão irá direcionar. Necessário se houver texto no botão.</p>
      </div>

      {/* Campo Ativo */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel} htmlFor={`ti-active-${id}`}>
            <input
                type="checkbox"
                id={`ti-active-${id}`}
                className={styles.checkboxInput}
                checked={data.isActive}
                onChange={(e) => onChange({ isActive: e.target.checked })}
            /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
    </div>
  </div>
);
}

 export default TextImageModule;