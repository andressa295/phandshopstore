// app/(painel)/personalizar/components/editor/modules/VideoModule.tsx
'use client';

import React from 'react';
import { VideoModuleData } from '../../../types';
import styles from './VideoModule.module.css'; // Importa estilos locais
import { MdDeleteForever } from 'react-icons/md'; // Ícone para remover

interface VideoModuleProps {
  id: string;
  data: VideoModuleData;
  onChange: (newData: Partial<VideoModuleData>) => void;
  onRemove: (id: string) => void;
}

const VideoModule: React.FC<VideoModuleProps> = ({ id, data, onChange, onRemove }) => {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Configurações de Vídeo</h4>
        <button
          onClick={() => onRemove(id)}
          className={styles.removeModuleButton} // Usando removeModuleButton para consistência
          title="Remover este módulo"
        >
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>
        Adicione um vídeo do YouTube ou Vimeo para enriquecer sua página inicial.
      </p>

      {/* Campo Título */}
      <div className={styles.inputGroup}>
        <label htmlFor={`vid-title-${id}`} className={styles.inputLabel}>Título:</label>
        <input
          type="text"
          id={`vid-title-${id}`}
          className={styles.textInput}
          value={data.title ?? ''} // Garante que o valor não seja undefined
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex: Assista Nosso Vídeo Institucional"
        />
        <p className={styles.fieldDescription}>Um título para o módulo de vídeo (opcional).</p>
      </div>

      {/* Campo URL do Vídeo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`vid-url-${id}`} className={styles.inputLabel}>URL do Vídeo (YouTube/Vimeo):</label>
        <input
          type="text"
          id={`vid-url-${id}`}
          className={styles.textInput}
          value={data.videoUrl ?? ''} // Garante que o valor não seja undefined
          onChange={(e) => onChange({ videoUrl: e.target.value })}
          placeholder="Ex: https://www.youtube.com/watch?v=VIDEO_ID"
        />
        <p className={styles.fieldDescription}>Insira a URL completa do vídeo do YouTube ou Vimeo.</p>
      </div>

      {/* Campo Autoplay */}
      <div className={styles.inputGroup}>
        <label htmlFor={`vid-autoplay-${id}`} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id={`vid-autoplay-${id}`}
            className={styles.checkboxInput}
            checked={data.autoplay ?? false} // Garante que o valor não seja undefined
            onChange={(e) => onChange({ autoplay: e.target.checked })}
          /> Autoplay
        </label>
        <p className={styles.fieldDescription}>O vídeo será iniciado automaticamente.</p>
      </div>

      {/* Campo Loop */}
      <div className={styles.inputGroup}>
        <label htmlFor={`vid-loop-${id}`} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id={`vid-loop-${id}`}
            className={styles.checkboxInput}
            checked={data.loop ?? false} // Garante que o valor não seja undefined
            onChange={(e) => onChange({ loop: e.target.checked })}
          /> Loop
        </label>
        <p className={styles.fieldDescription}>O vídeo será reproduzido em um loop infinito.</p>
      </div>

      {/* Campo Controles */}
      <div className={styles.inputGroup}>
        <label htmlFor={`vid-controls-${id}`} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id={`vid-controls-${id}`}
            className={styles.checkboxInput}
            checked={data.controls ?? true} // Garante que o valor não seja undefined
            onChange={(e) => onChange({ controls: e.target.checked })}
          /> Controles
        </label>
        <p className={styles.fieldDescription}>Exibir ou ocultar os controles de reprodução do vídeo.</p>
      </div>

      {/* Campo Ativo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`vid-active-${id}`} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id={`vid-active-${id}`}
            className={styles.checkboxInput}
            checked={data.isActive ?? false} // Garante que o valor não seja undefined
            onChange={(e) => onChange({ isActive: e.target.checked })}
          /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>
    </div>
  );
};

export default VideoModule;