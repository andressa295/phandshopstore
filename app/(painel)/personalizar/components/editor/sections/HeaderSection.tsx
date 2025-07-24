'use client'

import React, { useRef } from 'react' // Importa useRef
import styles from './HeaderSection.module.css'
import { ThemeConfig, ThemeUpdateFn, HeaderSettingsConfig } from '../../../types' // Importa os tipos corretos

interface HeaderSectionProps {
  config: ThemeConfig // Tipado corretamente
  updateConfig: ThemeUpdateFn // Tipado corretamente
}

const HeaderSection: React.FC<HeaderSectionProps> = ({ config, updateConfig }) => {

  // Pega as configurações de cabeçalho existentes ou usa defaults
  const headerSettings: HeaderSettingsConfig = config.headerSettings || {
    logoUrl: '',
    logoSize: 'medium',
    iconSize: 'medium',
    desktopSearch: 'icon',
    mobileSearch: 'icon',
    showAnnouncementBar: false,
    announcementText: '',
    announcementLink: '',
    announcementMarquee: false,
    useCustomHeaderColors: false, // NOVO: Adiciona a propriedade para controlar as cores customizadas
  };

  // Refs para os inputs de cor ocultos, para que possamos disparar o clique programaticamente
  const headerBgColorInputRef = useRef<HTMLInputElement>(null);
  const headerTextColorInputRef = useRef<HTMLInputElement>(null);

  // Função genérica para atualizar as propriedades dentro de headerSettings
  const handleHeaderSettingsUpdate = (field: keyof HeaderSettingsConfig, value: any) => {
    updateConfig({
      headerSettings: {
        ...headerSettings, // Garante que as outras propriedades de headerSettings são mantidas
        [field]: value,
      },
    });
  };

  // Função para atualizar propriedades diretas da ThemeConfig (headerBackgroundColor, headerTextColor, headerTitle, fixedHeader, showSearchBar)
  const handleRootHeaderUpdate = (field: keyof ThemeConfig, value: any) => {
    updateConfig({ [field]: value });
  };


  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        // ATENÇÃO: reader.result é uma string Base64.
        // Para um sistema real, você faria um upload para um servidor
        // e salvaria a URL pública retornada (ex: /uploads/logo.png).
        handleHeaderSettingsUpdate('logoUrl', reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className={styles.headerSection}>
      <h3 className={styles.sectionTitle}>Personalização do Cabeçalho</h3>

      {/* Título da Loja (já existe em ThemeConfig) */}
      <div className={styles.inputGroup}> {/* Ajustado para inputGroup */}
        <label className={styles.inputLabel}>Título da Loja:</label> {/* Ajustado para inputLabel */}
        <input
          type="text"
          className={styles.textInput}
          value={config.headerTitle ?? ''}
          onChange={(e) => handleRootHeaderUpdate('headerTitle', e.target.value)}
          placeholder="Minha Loja Online"
        />
      </div>

      {/* Upload da logo */}
      <div className={styles.inputGroup}> {/* Ajustado para inputGroup */}
        <label className={styles.inputLabel}>Logo da loja:</label> {/* Ajustado para inputLabel */}
        <div
          className={styles.logoUploadBox}
          onClick={() => document.getElementById('logoInput')?.click()}
        >
          {headerSettings.logoUrl ? (
            <img src={headerSettings.logoUrl} alt="Logo preview" className={styles.logoPreview} />
          ) : (
            <span className={styles.logoPlaceholder}>Clique para adicionar a logo</span>
          )}
        </div>
        <input
          id="logoInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleLogoUpload}
        />
      </div>

      {/* Tamanho da logo */}
      <div className={styles.inputGroup}> {/* Ajustado para inputGroup */}
        <label className={styles.inputLabel}>Tamanho da Logo:</label> {/* Ajustado para inputLabel */}
        <select
          className={styles.selectInput}
          value={headerSettings.logoSize ?? 'medium'}
          onChange={(e) => handleHeaderSettingsUpdate('logoSize', e.target.value as 'small' | 'medium' | 'large')}
        >
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>
      </div>

      {/* Tamanho dos Ícones */}
      <div className={styles.inputGroup}> {/* Ajustado para inputGroup */}
        <label className={styles.inputLabel}>Tamanho dos Ícones:</label> {/* Ajustado para inputLabel */}
        <select
          className={styles.selectInput}
          value={headerSettings.iconSize ?? 'medium'}
          onChange={(e) => handleHeaderSettingsUpdate('iconSize', e.target.value as 'small' | 'medium' | 'large')}
        >
          <option value="icon">Apenas lupa</option>
          <option value="bar">Barra de pesquisa</option>
        </select>
      </div>

      {/* Pesquisa no Desktop */}
      <div className={styles.inputGroup}> {/* Ajustado para inputGroup */}
        <label className={styles.inputLabel}>Pesquisa no Desktop:</label> {/* Ajustado para inputLabel */}
        <select
          className={styles.selectInput}
          value={headerSettings.desktopSearch ?? 'icon'}
          onChange={(e) => handleHeaderSettingsUpdate('desktopSearch', e.target.value as 'icon' | 'bar')}
        >
          <option value="icon">Apenas lupa</option>
          <option value="bar">Barra de pesquisa</option>
        </select>
      </div>

      {/* Pesquisa no Mobile */}
      <div className={styles.inputGroup}> {/* Ajustado para inputGroup */}
        <label className={styles.inputLabel}>Pesquisa no Mobile:</label> {/* Ajustado para inputLabel */}
        <select
          className={styles.selectInput}
          value={headerSettings.mobileSearch ?? 'icon'}
          onChange={(e) => handleHeaderSettingsUpdate('mobileSearch', e.target.value as 'icon' | 'bar')}
        >
          <option value="icon">Apenas lupa</option>
          <option value="bar">Barra de pesquisa</option>
        </select>
      </div>

      {/* NOVO: Checkbox para ativar cores customizadas do cabeçalho */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={headerSettings.useCustomHeaderColors ?? false}
            onChange={(e) => handleHeaderSettingsUpdate('useCustomHeaderColors', e.target.checked)}
          />
          Deseja utilizar estas cores para o cabeçalho?
        </label>
      </div>

      {/* Renderização condicional dos seletores de cor */}
      {headerSettings.useCustomHeaderColors && (
        <>
          {/* Cor do fundo do cabeçalho */}
          <div className={styles.inputGroup}> {/* Ajustado para inputGroup */}
            <label className={styles.inputLabel}>Cor do fundo do cabeçalho:</label> {/* Ajustado para inputLabel */}
            <div className={styles.colorSwatchContainer}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: config.headerBackgroundColor ?? '#ffffff' }}
                onClick={() => headerBgColorInputRef.current?.click()} // Dispara o clique no input oculto
              ></div>
              <input
                ref={headerBgColorInputRef} // Atribui a ref ao input oculto
                type="color"
                className={styles.hiddenColorInput} // Usa a classe para ocultar
                value={config.headerBackgroundColor ?? '#ffffff'}
                onChange={(e) => handleRootHeaderUpdate('headerBackgroundColor', e.target.value)}
              />
            </div>
          </div>

          {/* Cor do texto do cabeçalho */}
          <div className={styles.inputGroup}> {/* Ajustado para inputGroup */}
            <label className={styles.inputLabel}>Cor do texto do cabeçalho:</label> {/* Ajustado para inputLabel */}
            <div className={styles.colorSwatchContainer}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: config.headerTextColor ?? '#000000' }}
                onClick={() => headerTextColorInputRef.current?.click()} // Dispara o clique no input oculto
              ></div>
              <input
                ref={headerTextColorInputRef} // Atribui a ref ao input oculto
                type="color"
                className={styles.hiddenColorInput} // Usa a classe para ocultar
                value={config.headerTextColor ?? '#000000'}
                onChange={(e) => handleRootHeaderUpdate('headerTextColor', e.target.value)}
              />
            </div>
          </div>
        </>
      )}

      {/* Checkbox: Ativar barra de anúncio */}
      <div className={styles.inputGroup}> {/* Ajustado para inputGroup */}
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={headerSettings.showAnnouncementBar ?? false}
            onChange={(e) => handleHeaderSettingsUpdate('showAnnouncementBar', e.target.checked)}
          />
          Ativar barra de anúncio acima do cabeçalho
        </label>

        {headerSettings.showAnnouncementBar && (
          <div className={styles.announcementFields}>
            <input
              type="text"
              placeholder="Texto da barra de anúncio"
              className={styles.textInput}
              value={headerSettings.announcementText ?? ''}
              onChange={(e) => handleHeaderSettingsUpdate('announcementText', e.target.value)}
            />
            <input
              type="text"
              placeholder="Link da barra"
              className={styles.textInput}
              value={headerSettings.announcementLink ?? ''}
              onChange={(e) => handleHeaderSettingsUpdate('announcementLink', e.target.value)}
            />
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={headerSettings.announcementMarquee ?? false}
                onChange={(e) => handleHeaderSettingsUpdate('announcementMarquee', e.target.checked)}
              />
              Ativar efeito de letreiro (texto rolando)
            </label>
          </div>
        )}
      </div>
    </div>
  )
}

export default HeaderSection;
