// app/(painel)/personalizar/components/editor/HeaderSection.tsx
'use client';

import React, { ChangeEvent, useRef } from 'react'; // Adicionado ChangeEvent
import { ThemeConfig, ThemeUpdateFn, HeaderSettingsConfig } from '../../../types';
import styles from './HeaderSection.module.css';
import { useTheme } from '../../../context/ThemeContext'; // Importa useTheme
import { MdOutlineFileUpload, MdClose } from 'react-icons/md'; // Importa ícones
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // Importa cliente Supabase

interface HeaderSectionProps {
  // config e updateConfig virão do useTheme, não mais de props diretas
}

// Inicializa o cliente Supabase para Client Components
const supabase = createClientComponentClient();
const SUPABASE_STORAGE_BUCKET = 'theme-images'; // <--- NOME DO SEU BUCKET NO SUPABASE STORAGE!

const HeaderSection: React.FC<HeaderSectionProps> = () => {
  const { config, updateConfig } = useTheme();

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
    useCustomHeaderColors: false,
    headerBackgroundColor: '#ffffff',
    headerTextColor: '#333333',
    announcementBackgroundColor: '#444444',
    announcementTextColor: '#ffffff',
    searchBarBackgroundColor: '#f8f8f8',
  };

  // Refs para os inputs de cor ocultos e para o input de arquivo da logo
  const logoFileInputRef = useRef<HTMLInputElement>(null); // Ref para o input de arquivo da logo
  const headerBgColorInputRef = useRef<HTMLInputElement>(null);
  const headerTextColorInputRef = useRef<HTMLInputElement>(null);
  const announcementBgColorInputRef = useRef<HTMLInputElement>(null);
  const announcementTextColorInputRef = useRef<HTMLInputElement>(null);
  const searchBarBgColorInputRef = useRef<HTMLInputElement>(null);

  // Função genérica para atualizar as propriedades dentro de headerSettings
  const handleHeaderSettingsUpdate = (field: keyof HeaderSettingsConfig, value: any) => {
    updateConfig({
      headerSettings: {
        ...headerSettings,
        [field]: value,
      },
    });
  };

  // Função para atualizar propriedades diretas da ThemeConfig (headerTitle, fixedHeader)
  const handleRootHeaderUpdate = (field: keyof ThemeConfig, value: any) => {
    updateConfig({ [field]: value });
  };

  // Função para lidar com o upload da logo
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    const filePath = `header/logo-${Date.now()}.${fileExtension}`; // Caminho único no storage

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Erro ao fazer upload da logo:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        handleHeaderSettingsUpdate('logoUrl', publicUrlData.publicUrl as string);
        console.log('Upload de logo concluído com sucesso:', publicUrlData.publicUrl);
      } else {
        console.error('Não foi possível obter a URL pública da logo.');
      }

    } catch (error: any) {
      console.error('Erro inesperado no upload da logo:', error);
    } finally {
      e.target.value = ''; // Limpa o input de arquivo
    }
  };

  return (
    <div className={styles.sectionBlock}>
      <h3 className={styles.sectionTitle}>Cabeçalho</h3>
      <p className={styles.sectionDescription}>
        Ajuste a logo, pesquisa, barra de anúncio e cores do cabeçalho da sua loja.
      </p>

      {/* Upload da Logo */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Logo da Loja:</label>
        <div
          className={styles.imageUploadBox} // Usando a classe de upload padronizada
          onClick={() => logoFileInputRef.current?.click()}
        >
          {headerSettings.logoUrl ? (
            <img src={headerSettings.logoUrl} alt="Logo preview" className={styles.imagePreview} />
          ) : (
            <div className={styles.uploadInner}>
              <MdOutlineFileUpload className={styles.uploadIconPlaceholder} />
              <span className={styles.uploadPlaceholder}>Clique para fazer upload da logo</span>
            </div>
          )}
        </div>
        <input
          ref={logoFileInputRef}
          id={`logo-file-input`}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleLogoUpload}
        />
        {headerSettings.logoUrl && (
            <button
                type="button"
                className={styles.removeImageButton}
                onClick={() => handleHeaderSettingsUpdate('logoUrl', '')}
            >
                <MdClose size={18} /> Remover Logo
            </button>
        )}
        <p className={styles.fieldDescription}>
          Faça upload da logo da sua loja. Formatos recomendados: PNG, SVG.
        </p>
      </div>

      {/* Título da Loja (já existe em ThemeConfig) */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Título da Loja:</label>
        <input
          type="text"
          className={styles.textInput}
          value={config.headerTitle ?? ''}
          onChange={(e) => handleRootHeaderUpdate('headerTitle', e.target.value)}
          placeholder="Minha Loja Online"
        />
        <p className={styles.fieldDescription}>O título principal da sua loja, exibido no cabeçalho.</p>
      </div>

      {/* Tamanho da logo */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Tamanho da Logo:</label>
        <select
          className={styles.selectInput}
          value={headerSettings.logoSize ?? 'medium'}
          onChange={(e) => handleHeaderSettingsUpdate('logoSize', e.target.value as 'small' | 'medium' | 'large')}
        >
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>
        <p className={styles.fieldDescription}>Define o tamanho de exibição da logo no cabeçalho.</p>
      </div>

      {/* Tamanho dos Ícones */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Tamanho dos Ícones (Carrinho, Busca):</label>
        <select
          className={styles.selectInput}
          value={headerSettings.iconSize ?? 'medium'}
          onChange={(e) => handleHeaderSettingsUpdate('iconSize', e.target.value as 'small' | 'medium' | 'large')}
        >
          <option value="small">Pequeno</option>
          <option value="medium">Médio</option>
          <option value="large">Grande</option>
        </select>
        <p className={styles.fieldDescription}>Define o tamanho dos ícones de ação no cabeçalho.</p>
      </div>

      {/* Pesquisa no Desktop */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Pesquisa no Desktop:</label>
        <select
          className={styles.selectInput}
          value={headerSettings.desktopSearch ?? 'icon'}
          onChange={(e) => handleHeaderSettingsUpdate('desktopSearch', e.target.value as 'icon' | 'bar' | 'none')}
        >
          <option value="icon">Apenas Ícone de Lupa</option>
          <option value="bar">Barra de Pesquisa Aberta</option>
          <option value="none">Não Exibir</option>
        </select>
        <p className={styles.fieldDescription}>Como a pesquisa será exibida em telas maiores.</p>
      </div>

      {/* Pesquisa no Mobile */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Pesquisa no Mobile:</label>
        <select
          className={styles.selectInput}
          value={headerSettings.mobileSearch ?? 'icon'}
          onChange={(e) => handleHeaderSettingsUpdate('mobileSearch', e.target.value as 'icon' | 'bar' | 'none')}
        >
          <option value="icon">Apenas Ícone de Lupa</option>
          <option value="bar">Barra de Pesquisa Aberta</option>
          <option value="none">Não Exibir</option>
        </select>
        <p className={styles.fieldDescription}>Como a pesquisa será exibida em dispositivos móveis.</p>
      </div>

      {/* Checkbox: Ativar cabeçalho fixo */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={config.fixedHeader ?? false}
            onChange={(e) => handleRootHeaderUpdate('fixedHeader', e.target.checked)}
          />
          Fixar cabeçalho ao rolar a página
        </label>
        <p className={styles.fieldDescription}>Mantém o cabeçalho visível enquanto o usuário rola a página.</p>
      </div>

      {/* Checkbox: Ativar cores customizadas do cabeçalho */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={headerSettings.useCustomHeaderColors ?? false}
            onChange={(e) => handleHeaderSettingsUpdate('useCustomHeaderColors', e.target.checked)}
          />
          Usar cores customizadas para o cabeçalho
        </label>
        <p className={styles.fieldDescription}>Ative para definir cores específicas para o cabeçalho.</p>
      </div>

      {/* Renderização condicional dos seletores de cor do cabeçalho */}
      {headerSettings.useCustomHeaderColors && (
        <>
          {/* Cor do fundo do cabeçalho */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Cor de fundo do cabeçalho:</label>
            <div className={styles.colorSwatchContainer}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: headerSettings.headerBackgroundColor ?? '#ffffff' }}
                onClick={() => headerBgColorInputRef.current?.click()}
              ></div>
              <input
                ref={headerBgColorInputRef}
                type="color"
                className={styles.hiddenColorInput}
                value={headerSettings.headerBackgroundColor ?? '#ffffff'}
                onChange={(e) => handleHeaderSettingsUpdate('headerBackgroundColor', e.target.value)}
              />
            </div>
            <p className={styles.fieldDescription}>Cor de fundo da barra principal do cabeçalho.</p>
          </div>

          {/* Cor do texto do cabeçalho */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Cor do texto do cabeçalho:</label>
            <div className={styles.colorSwatchContainer}>
              <div
                className={styles.colorSwatch}
                style={{ backgroundColor: headerSettings.headerTextColor ?? '#000000' }}
                onClick={() => headerTextColorInputRef.current?.click()}
              ></div>
              <input
                ref={headerTextColorInputRef}
                type="color"
                className={styles.hiddenColorInput}
                value={headerSettings.headerTextColor ?? '#000000'}
                onChange={(e) => handleHeaderSettingsUpdate('headerTextColor', e.target.value)}
              />
            </div>
            <p className={styles.fieldDescription}>Cor do texto e ícones no cabeçalho.</p>
          </div>
        </>
      )}

      {/* Checkbox: Ativar barra de anúncio */}
      <div className={styles.inputGroup}>
        <label className={styles.checkboxLabel}>
          <input
            type="checkbox"
            className={styles.checkboxInput}
            checked={headerSettings.showAnnouncementBar ?? false}
            onChange={(e) => handleHeaderSettingsUpdate('showAnnouncementBar', e.target.checked)}
          />
          Ativar barra de anúncio acima do cabeçalho
        </label>
        <p className={styles.fieldDescription}>Exibe uma barra de anúncio personalizável no topo da página.</p>

        {headerSettings.showAnnouncementBar && (
          <div className={styles.nestedInputGroup}>
            <div className={styles.inputGroupInline}>
              <label className={styles.inputLabel}>Texto do Anúncio:</label>
              <input
                type="text"
                placeholder="Texto da barra de anúncio"
                className={styles.textInput}
                value={headerSettings.announcementText ?? ''}
                onChange={(e) => handleHeaderSettingsUpdate('announcementText', e.target.value)}
              />
              <p className={styles.fieldDescription}>A mensagem que será exibida na barra de anúncio.</p>
            </div>
            <div className={styles.inputGroupInline}>
              <label className={styles.inputLabel}>Link do Anúncio (opcional):</label>
              <input
                type="text"
                placeholder="Link da barra"
                className={styles.textInput}
                value={headerSettings.announcementLink ?? ''}
                onChange={(e) => handleHeaderSettingsUpdate('announcementLink', e.target.value)}
              />
              <p className={styles.fieldDescription}>A URL para onde o anúncio irá direcionar.</p>
            </div>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={headerSettings.announcementMarquee ?? false}
                onChange={(e) => handleHeaderSettingsUpdate('announcementMarquee', e.target.checked)}
              />
              Ativar efeito de letreiro (texto rolando)
            </label>
            <p className={styles.fieldDescription}>Faz o texto do anúncio rolar horizontalmente.</p>

            {/* Cores da barra de anúncio */}
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Fundo da Barra de Anúncio:</label>
              <div className={styles.colorSwatchContainer}>
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: headerSettings.announcementBackgroundColor ?? '#444444' }}
                  onClick={() => announcementBgColorInputRef.current?.click()}
                ></div>
                <input
                  ref={announcementBgColorInputRef}
                  type="color"
                  className={styles.hiddenColorInput}
                  value={headerSettings.announcementBackgroundColor ?? '#444444'}
                  onChange={(e) => handleHeaderSettingsUpdate('announcementBackgroundColor', e.target.value)}
                />
              </div>
              <p className={styles.fieldDescription}>Cor de fundo da barra de anúncio.</p>
            </div>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel}>Texto da Barra de Anúncio:</label>
              <div className={styles.colorSwatchContainer}>
                <div
                  className={styles.colorSwatch}
                  style={{ backgroundColor: headerSettings.announcementTextColor ?? '#ffffff' }}
                  onClick={() => announcementTextColorInputRef.current?.click()}
                ></div>
                <input
                  ref={announcementTextColorInputRef}
                  type="color"
                  className={styles.hiddenColorInput}
                  value={headerSettings.announcementTextColor ?? '#ffffff'}
                  onChange={(e) => handleHeaderSettingsUpdate('announcementTextColor', e.target.value)}
                />
              </div>
              <p className={styles.fieldDescription}>Cor do texto da barra de anúncio.</p>
            </div>
          </div>
        )}
      </div>

      {/* Cor de fundo da barra de pesquisa no header */}
      <div className={styles.inputGroup}>
        <label className={styles.inputLabel}>Cor de fundo da barra de pesquisa:</label>
        <div className={styles.colorSwatchContainer}>
          <div
            className={styles.colorSwatch}
            style={{ backgroundColor: headerSettings.searchBarBackgroundColor ?? '#f8f8f8' }}
            onClick={() => searchBarBgColorInputRef.current?.click()}
          ></div>
          <input
            ref={searchBarBgColorInputRef}
            type="color"
            className={styles.hiddenColorInput}
            value={headerSettings.searchBarBackgroundColor ?? '#f8f8f8'}
            onChange={(e) => handleHeaderSettingsUpdate('searchBarBackgroundColor', e.target.value)}
          />
        </div>
        <p className={styles.fieldDescription}>Cor de fundo do campo de pesquisa no cabeçalho.</p>
      </div>
    </div>
  );
};

export default HeaderSection;