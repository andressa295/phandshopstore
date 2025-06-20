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

export const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose, tema, onApply }) => {
  if (!isOpen || !tema) return null;

  const handleEscapeKey = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    // Adiciona o listener de teclado
    document.addEventListener('keydown', handleEscapeKey);

    // Adiciona a classe no body para desabilitar o scroll
    // Adiciona uma verificação para garantir que document.body existe
    if (document.body) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      // Remove o listener de teclado
      document.removeEventListener('keydown', handleEscapeKey);

      // Remove a classe do body ao fechar o modal
      // Adiciona uma verificação para garantir que document.body existe antes de manipulá-lo
      if (document.body) {
        document.body.style.overflow = '';
      }
    };
  }, [onClose]); // Dependência em onClose

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className={styles.overlay} 
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className={styles.content}> 
        <h2 id="modal-title">
          Deseja aplicar o tema <strong>{tema.nome}</strong> e personalizar agora?
        </h2>
        <div className={styles.buttonsGroup}> 
          <button
            className={`${styles.button} ${styles.buttonPrimary}`} 
            onClick={() => {
              onApply(true);
              onClose();
            }}
            aria-label={`Só aplicar tema ${tema.nome}`}
          >
            Só aplicar
          </button>
          <button
            className={`${styles.button} ${styles.buttonSecondary}`} 
            onClick={() => {
              onApply(false);
              onClose();
            }}
            aria-label={`Aplicar e personalizar tema ${tema.nome}`}
          >
            Aplicar e personalizar
          </button>
        </div>
        <button
          onClick={onClose}
          className={styles.closeButton} 
          aria-label="Fechar modal"
        >
          ✕
        </button>
      </div>
    </div>
  );
};