'use client';

import React from 'react';
import { VideoModuleData } from '../../../types';
import styles from './VideoModule.module.css'; // Importa estilos locais
import { MdDeleteForever } from 'react-icons/md';

interface VideoModuleProps {
  id: string;
  data: VideoModuleData;
  onChange: (newData: Partial<VideoModuleData>) => void;
  onRemove: (id: string) => void;
}

const VideoModule: React.FC<VideoModuleProps> = ({ id, data, onChange, onRemove }) => (
    <div className={styles.sectionBlock}>
        <div className={styles.moduleHeader}>
            <h4 className={styles.nestedTitle}>Configurações de Vídeo</h4>
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
            <label htmlFor={`vid-title-${id}`} className={styles.inputLabel}>Título:</label>
            <input
                type="text"
                id={`vid-title-${id}`}
                className={styles.textInput}
                value={data.title}
                onChange={(e) => onChange({ title: e.target.value })}
                placeholder="Ex: Assista Nosso Vídeo Institucional"
            />
            <p className={styles.fieldDescription}>Um título para o módulo de vídeo.</p>
        </div>

        {/* Campo URL do Vídeo */}
        <div className={styles.inputGroup}>
            <label htmlFor={`vid-url-${id}`} className={styles.inputLabel}>URL do Vídeo (YouTube/Vimeo):</label>
            <input
                type="text"
                id={`vid-url-${id}`}
                className={styles.textInput}
                value={data.videoUrl}
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
                    checked={data.autoplay}
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
                    checked={data.loop}
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
                    checked={data.controls}
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
                    checked={data.isActive}
                    onChange={(e) => onChange({ isActive: e.target.checked })}
                /> Ativo
            </label>
            <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
        </div>
    </div>
);

export default VideoModule;