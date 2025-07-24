'use client';

import React, { useRef } from 'react'; // Importa useRef
import { ThemeConfig, ThemeUpdateFn } from '../../../types';
// Importa o novo arquivo de estilos específico para AdvancedSection
import styles from './AdvancedSection.module.css';

interface Props {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
  saveThemeConfig: () => void; // Mantido para um possível botão de salvar separado
}

const AdvancedSection: React.FC<Props> = ({ config, updateConfig, saveThemeConfig }) => {
  const advancedConfig = config.advanced || {
    customCss: '',
    customJs: '',
    faviconUrl: '', // Agora será gerenciado via upload
    enableLazyLoading: true,
    enableCodeMinification: false,
  };

  // Ref para o input de upload do favicon
  const faviconInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = (field: keyof typeof advancedConfig, value: any) => {
    updateConfig({
      advanced: {
        ...advancedConfig,
        [field]: value,
      },
    });
  };

  // Nova função para lidar com o upload do favicon
  const handleFaviconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // ATENÇÃO: reader.result é uma string Base64. Em um sistema real,
        // você faria um upload para um servidor e salvaria a URL pública.
        handleUpdate('faviconUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Função para simular o "teste" das alterações
  const handleTestChanges = () => {
    // Aqui você pode adicionar a lógica real para aplicar e pré-visualizar as alterações
    // sem necessariamente salvá-las no backend.
    console.log('Testando alterações:', config);
    // Exemplo: Poderia enviar a 'config' para uma API de preview
    alert('As alterações foram aplicadas para teste na pré-visualização!'); // Usando alert para feedback simples
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

      {/* Favicon Upload (AGORA COM UPLOAD) */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Favicon:</label>
        <div
          className={styles.logoUploadBox} // Reutilizando o estilo do upload de logo
          onClick={() => faviconInputRef.current?.click()}
        >
          {advancedConfig.faviconUrl ? (
            <img src={advancedConfig.faviconUrl} alt="Favicon Preview" className={styles.faviconImagePreview} />
          ) : (
            <span className={styles.logoPlaceholder}>Clique para adicionar o Favicon</span>
          )}
        </div>
        <input
          ref={faviconInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFaviconUpload}
        />
        <small className={styles.fieldDescription}>
          Adicione o ícone que aparecerá na aba do navegador (geralmente um arquivo .ico ou .png).
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
