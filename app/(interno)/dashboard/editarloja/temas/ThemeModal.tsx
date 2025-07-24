'use client';

import React, { useEffect } from 'react';
import styles from './ThemeModal.module.css';

interface Tema {
  id: string;
  nome: string;
  categoria: string;
  descricao?: string;
  imagemUrl: string;
}

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  tema: Tema | null;
  onApply: (somenteAplicar: boolean) => void;
}

const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose, tema, onApply }) => {
  if (!isOpen || !tema) return null;

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.content}>
        <h2 className={styles.title}>
          Deseja aplicar o tema <strong>{tema.nome}</strong> e personalizar agora?
        </h2>

        <div className={styles.buttonsGroup}>
          <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={() => { onApply(true); onClose(); }}>
            Só aplicar
          </button>
          <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => { onApply(false); onClose(); }}>
            Aplicar e personalizar
          </button>
        </div>

        <button className={styles.closeButton} onClick={onClose} aria-label="Fechar modal">✕</button>
      </div>
    </div>
  );
};

export default ThemeModal;
