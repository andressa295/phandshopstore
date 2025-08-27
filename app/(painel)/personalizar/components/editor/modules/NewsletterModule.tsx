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
        <h4 className={styles.nestedTitle}>Newsletter</h4>
        <button
          onClick={() => onRemove(id)}
          className={styles.removeModuleButton}
          title="Remover este módulo"
        >
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>
        Personalize o formulário de inscrição da newsletter para capturar e-mails de clientes.
      </p>

      {/* Campo Título */}
      <div className={styles.inputGroup}>
        <label htmlFor={`newsletter-title-${id}`} className={styles.inputLabel}>Título:</label>
        <input
          id={`newsletter-title-${id}`}
          type="text"
          className={styles.textInput}
          value={data.title ?? ''} // Garante que o valor não seja undefined
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
          value={data.subtitle ?? ''}
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
          value={data.buttonText ?? ''}
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
          value={data.privacyPolicyLink ?? ''}
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
            checked={data.isActive ?? false}
            onChange={(e) => onChange({ isActive: e.target.checked })}
          /> Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>
    </div>
  );
};

export default NewsletterModule;