'use client'; 

import React from 'react';
import styles from './ThemeCard.module.css'; // <-- Importa o CSS Module do Card

interface Tema {
  id: string;
  nome: string;
  categoria: string;
  descricao?: string;
  imagemUrl: string;
}

interface ThemeCardProps {
  tema: Tema;
  onSelecionar: (tema: Tema) => void;
}

const ThemeCard: React.FC<ThemeCardProps> = ({ tema, onSelecionar }) => {
  return (
    <div
      className={styles.cardItem} /* Usando a classe do CSS Module */
      onClick={() => onSelecionar(tema)}
      aria-label={`Selecionar tema ${tema.nome}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onSelecionar(tema);
        }
      }}
    >
      <img src={tema.imagemUrl} alt={tema.nome} className={styles.image} />
      <div className={styles.info}>
        <h3 className={styles.title}>{tema.nome}</h3>
        <p className={styles.category}>{tema.categoria}</p>
        <button className={styles.button} onClick={(e) => { e.stopPropagation(); onSelecionar(tema); }}>
          Personalizar tema
        </button>
      </div>
    </div>
  );
};

export default ThemeCard;