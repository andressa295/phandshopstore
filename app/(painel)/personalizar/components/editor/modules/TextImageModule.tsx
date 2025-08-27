// app/(painel)/personalizar/components/editor/modules/TextImageModule.tsx
'use client';

import React, { ChangeEvent, useRef } from 'react';
import { TextImageModuleData } from '../../../types';
import styles from './TextImageModule.module.css'; // Importa estilos locais
import { MdDeleteForever, MdOutlineFileUpload, MdClose } from 'react-icons/md'; // Ícones
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // Cliente Supabase

interface TextImageModuleProps {
  id: string;
  data: TextImageModuleData;
  onChange: (newData: Partial<TextImageModuleData>) => void;
  onRemove: (id: string) => void;
}

// Inicializa o cliente Supabase para Client Components
const supabase = createClientComponentClient();
const SUPABASE_STORAGE_BUCKET = 'theme-images'; // <--- NOME DO SEU BUCKET NO SUPABASE STORAGE!

const TextImageModule: React.FC<TextImageModuleProps> = ({ id, data, onChange, onRemove }) => {
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    const filePath = `${id}/text-image-${Date.now()}.${fileExtension}`; // Caminho único no storage

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
        onChange({ imageUrl: publicUrlData.publicUrl as string });
        console.log('Upload de imagem concluído com sucesso:', publicUrlData.publicUrl);
      } else {
        console.error('Não foi possível obter a URL pública da imagem.');
      }

    } catch (error: any) {
      console.error('Erro inesperado no upload:', error);
    } finally {
      if (e.target) e.target.value = ''; // Limpa o input de arquivo
    }
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Texto e Imagem</h4>
        <button
          onClick={() => onRemove(id)}
          className={styles.removeModuleButton}
          title="Remover este módulo"
        >
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>
        Adicione um bloco de texto com uma imagem lateral para destacar informações ou histórias.
      </p>

      {/* Campo Título */}
      <div className={styles.inputGroup}>
        <label htmlFor={`ti-title-${id}`} className={styles.inputLabel}>Título:</label>
        <input
            type="text"
            id={`ti-title-${id}`}
            className={styles.textInput}
            value={data.title ?? ''}
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
            value={data.text ?? ''}
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
          className={styles.imageUploadBox}
          onClick={() => imageInputRef.current?.click()}
        >
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="Preview Imagem" className={styles.imagePreview} />
          ) : (
            <div className={styles.uploadInner}>
              <MdOutlineFileUpload className={styles.uploadIconPlaceholder} />
              <span className={styles.uploadPlaceholder}>Clique para fazer upload (600x400px)</span>
            </div>
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
        {data.imageUrl && (
            <button
                type="button"
                className={styles.removeImageButton}
                onClick={() => onChange({ imageUrl: '' })}
            >
                <MdClose size={18} /> Remover Imagem
            </button>
        )}
        <p className={styles.fieldDescription}>
          Faça upload de uma imagem. Dimensões recomendadas: 600x400px.
        </p>
      </div>

      {/* Campo Posição da Imagem */}
      <div className={styles.inputGroup}>
        <label htmlFor={`ti-position-${id}`} className={styles.inputLabel}>Posição da Imagem:</label>
        <select
            id={`ti-position-${id}`}
            className={styles.selectInput}
            value={data.imagePosition ?? 'left'}
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
            value={data.buttonText ?? ''}
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
            value={data.buttonLink ?? ''}
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
                checked={data.isActive ?? false}
                onChange={(e) => onChange({ isActive: e.target.checked })}
            /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
    </div>
    </div>
  );
};

export default TextImageModule;