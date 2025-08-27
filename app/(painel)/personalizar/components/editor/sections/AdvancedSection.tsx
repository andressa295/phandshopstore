// app/(painel)/personalizar/components/editor/AdvancedSection.tsx
'use client';

import React, { useRef } from 'react';
import { ThemeConfig, ThemeUpdateFn } from '../../../types';
import styles from './AdvancedSection.module.css';
import { useTheme } from '../../../context/ThemeContext'; // Importa useTheme

interface Props {
  // Config e updateConfig virão do useTheme, não mais de props diretas
  // config: ThemeConfig;
  // updateConfig: ThemeUpdateFn;
  // saveThemeConfig: () => void; // Este botão de salvar será no PanelHeader
}

const AdvancedSection: React.FC = () => {
  const { config, updateConfig, saveThemeConfig } = useTheme(); // Usa o hook para acessar o contexto

  const advancedConfig = config.advanced || {
    customCss: '',
    customJs: '',
    faviconUrl: '',
    enableLazyLoading: true,
    enableCodeMinification: false,
    lastUpdatedScript: '', // Garante que exista para evitar undefined
    lastUpdatedEditor: '', // Garante que exista para evitar undefined
  };

  const handleUpdate = (field: keyof typeof advancedConfig, value: any) => {
    updateConfig({
      advanced: {
        ...advancedConfig,
        [field]: value,
      },
    });
  };

  // Removida a função handleFaviconUpload (Base64)
  // Removido o useRef para o input de arquivo

  const handleTestChanges = () => {
    console.log('Testando alterações:', config);
    alert('As alterações foram aplicadas para teste na pré-visualização!');
  };

  return (
    <div className={styles.sectionBlock}>
      <h3 className={styles.sectionTitle}>Configurações Avançadas e SEO</h3>
      <p className={styles.sectionDescription}>
        Para usuários com conhecimento técnico. Permite a inserção de códigos personalizados e outras otimizações.
      </p>

      {/* CSS Personalizado */}
      <div className={styles.inputGroup}>
        <label htmlFor="customCssEditor" className={styles.inputLabel}>CSS Personalizado:</label>
        <textarea
          id="customCssEditor"
          className={styles.textAreaInput}
          value={advancedConfig.customCss}
          onChange={(e) => handleUpdate('customCss', e.target.value)}
          placeholder={`/* Insira seu CSS personalizado aqui */\nbody { font-size: 16px; }`}
          rows={10}
        />
        <p className={styles.fieldDescription}>
          Insira códigos CSS para aplicar modificações no design da sua loja.
          <br />
          <strong className={styles.attentionText}>Atenção:</strong> As alterações aqui podem sobrescrever outras configurações do tema.
        </p>
      </div>

      {/* JavaScript Personalizado */}
      <div className={styles.inputGroup}>
        <label htmlFor="customJsEditor" className={styles.inputLabel}>JavaScript Personalizado (Body End):</label>
        <textarea
          id="customJsEditor"
          className={styles.textAreaInput}
          value={advancedConfig.customJs}
          onChange={(e) => handleUpdate('customJs', e.target.value)}
          placeholder={`// Insira seu JavaScript personalizado aqui\n// Ex: Para scripts de analytics ou pixels de conversão\nconsole.log('Site carregado!');`}
          rows={10}
        />
        <p className={styles.fieldDescription}>
          Códigos JavaScript que serão injetados antes do fechamento da tag `&lt;/body&gt;`. Ideal para scripts de tracking e integrações.
        </p>
      </div>

      {/* Favicon URL (AGORA COM INPUT DE TEXTO) */}
      <div className={styles.inputGroup}>
        <label htmlFor="faviconUrlInput" className={styles.inputLabel}>URL do Favicon:</label>
        <input
          id="faviconUrlInput"
          type="text"
          className={styles.textInput} // Use um estilo de input de texto
          value={advancedConfig.faviconUrl}
          onChange={(e) => handleUpdate('faviconUrl', e.target.value)}
          placeholder="https://seusite.com/favicon.ico"
        />
        {advancedConfig.faviconUrl && (
          <div className={styles.faviconPreviewContainer}>
            <p className={styles.fieldDescription}>Pré-visualização:</p>
            <img src={advancedConfig.faviconUrl} alt="Favicon Preview" className={styles.faviconImagePreview} />
          </div>
        )}
        <small className={styles.fieldDescription}>
          Adicione a URL pública do ícone que aparecerá na aba do navegador (ex: um arquivo .ico ou .png).
        </small>
      </div>

      {/* Checkbox: Habilitar Lazy Loading */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={advancedConfig.enableLazyLoading}
            onChange={(e) => handleUpdate('enableLazyLoading', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Lazy Loading para Imagens
        </label>
        <p className={styles.fieldDescription}>
          Carrega imagens apenas quando visíveis na tela, melhorando a velocidade de carregamento inicial.
        </p>
      </div>

      {/* Checkbox: Habilitar Minificação de Código */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={advancedConfig.enableCodeMinification}
            onChange={(e) => handleUpdate('enableCodeMinification', e.target.checked)}
            className={styles.checkboxInput}
          />
          Habilitar Minificação de Código (CSS/JS)
        </label>
        <p className={styles.fieldDescription}>
          Reduz o tamanho dos arquivos de código para um carregamento mais rápido (geralmente tratado automaticamente em produção).
        </p>
      </div>

      <hr className={styles.divider} />

      {/* Botão Testar Alterações */}
      <div className={styles.buttonGroup}>
        <button className={styles.saveButton} onClick={handleTestChanges}>
          Testar Alterações
        </button>
      </div>
    </div>
  );
};

export default AdvancedSection;