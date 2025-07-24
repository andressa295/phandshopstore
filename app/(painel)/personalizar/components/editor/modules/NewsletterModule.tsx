// app/(painel)/personalizar/components/editor/modules/NewsletterModule.tsx
'use client';

import React from 'react';
import { NewsletterModuleData } from '../../../types';
import styles from './NewsletterModule.module.css'; // Importa estilos locais
import { MdDeleteForever } from 'react-icons/md';

interface NewsletterModuleProps {
  id: string;
  data: NewsletterModuleData;
  onChange: (newData: Partial<NewsletterModuleData>) => void;
  onRemove: (id: string) => void;
}

const NewsletterModule: React.FC<NewsletterModuleProps> = ({ id, data, onChange, onRemove }) => {
  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Configurações do Módulo Newsletter</h4>
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
        <label htmlFor={`newsletter-title-${id}`} className={styles.inputLabel}>Título:</label>
        <input
          id={`newsletter-title-${id}`}
          type="text"
          className={styles.textInput}
          value={data.title}
          onChange={(e) => onChange({ title: e.target.value })}
          placeholder="Ex: Assine nossa Newsletter!"
        />
        <p className={styles.fieldDescription}>O texto principal exibido no módulo de newsletter.</p>
      </div>

      {/* Campo Subtítulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`newsletter-subtitle-${id}`} className={styles.inputLabel}>Subtítulo:</label>
        <input
          id={`newsletter-subtitle-${id}`}
          type="text"
          className={styles.textInput}
          value={data.subtitle}
          onChange={(e) => onChange({ subtitle: e.target.value })}
          placeholder="Receba novidades e ofertas exclusivas."
        />
        <p className={styles.fieldDescription}>Texto complementar que acompanha o título principal.</p>
      </div>

      {/* Campo Texto do Botão */}
      <div className={styles.inputGroup}>
        <label htmlFor={`newsletter-button-text-${id}`} className={styles.inputLabel}>Texto do Botão:</label>
        <input
          id={`newsletter-button-text-${id}`}
          type="text"
          className={styles.textInput}
          value={data.buttonText}
          onChange={(e) => onChange({ buttonText: e.target.value })}
          placeholder="Ex: Cadastrar"
        />
        <p className={styles.fieldDescription}>O texto que aparecerá no botão de inscrição.</p>
      </div>

      {/* Campo Link da Política de Privacidade */}
      <div className={styles.inputGroup}>
        <label htmlFor={`newsletter-privacy-link-${id}`} className={styles.inputLabel}>Link da Política de Privacidade (Opcional):</label>
        <input
          id={`newsletter-privacy-link-${id}`}
          type="text"
          className={styles.textInput}
          value={data.privacyPolicyLink}
          onChange={(e) => onChange({ privacyPolicyLink: e.target.value })}
          placeholder="Ex: /politica-de-privacidade"
        />
        <p className={styles.fieldDescription}>Opcional. Link para a página de política de privacidade, se aplicável.</p>
      </div>

      {/* Campo Ativo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`newsletter-isActive-${id}`} className={styles.checkboxLabel}>
          <input
            id={`newsletter-isActive-${id}`}
            type="checkbox"
            className={styles.checkboxInput}
            checked={data.isActive}
            onChange={(e) => onChange({ isActive: e.target.checked })}
          /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>
    </div>
  );
};

export default NewsletterModule;