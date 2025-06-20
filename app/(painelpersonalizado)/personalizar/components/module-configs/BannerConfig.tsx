// app/(painelpersonalizado)/personalizar/components/module-configs/BannerConfig.tsx
'use client';
import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import TextField from '../ui/TextField';
import ImageUploadSquare from '../ui/ImageUploadSquare';
import { HomePageModule, Tema, BannerItem } from '../EditorContext';
import SelectField from '../ui/SelectField';

const sectionStyle = {
  border: '1px solid #eee',
  borderRadius: '12px',
  padding: '20px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
  marginBottom: '1.5rem',
};

const titleStyle = {
  margin: '0 0 10px 0',
  fontSize: '1rem',
  fontWeight: 600,
  color: '#333',
  fontFamily: 'Poppins, sans-serif',
};

interface BannerConfigProps {
  module: HomePageModule;
  goBackFromModuleConfig: () => void;
  handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
  tema: Tema;
  handleTemaChange: (key: keyof Tema, value: any) => void;
}

const BannerConfig: React.FC<BannerConfigProps> = ({
  module,
  handleModuleConfigChange,
  tema,
  handleTemaChange,
}) => {
  const currentBanners: BannerItem[] = (module.config?.banners as BannerItem[]) || [
    {
      id: `banner_${Date.now()}`,
      imageUrlDesktop: null,
      imageUrlMobile: null,
      linkUrl: '',
      altText: '',
    },
  ];

  const handleAddBanner = () => {
    const newBanner: BannerItem = {
      id: `banner_${Date.now()}`,
      imageUrlDesktop: null,
      imageUrlMobile: null,
      linkUrl: '',
      altText: '',
    };
    handleModuleConfigChange(module.id, { banners: [...currentBanners, newBanner] });
  };

  const handleRemoveBanner = (idToRemove: string) => {
    const updatedBanners = currentBanners.filter((banner) => banner.id !== idToRemove);
    handleModuleConfigChange(module.id, { banners: updatedBanners });
  };

  const handleBannerItemChange = (id: string, key: keyof BannerItem, value: any) => {
    const updatedBanners = currentBanners.map((banner) =>
      banner.id === id ? { ...banner, [key]: value } : banner
    );
    handleModuleConfigChange(module.id, { banners: updatedBanners });
  };

  const handleImageUpload = (bannerId: string, isMobile: boolean) => (imageUrl: string | null) => {
    handleBannerItemChange(bannerId, isMobile ? 'imageUrlMobile' : 'imageUrlDesktop', imageUrl);
  };

  return (
    <div
      style={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '1rem 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflowY: 'auto',
        flexGrow: 1,
      }}
    >
      <h3 style={{ ...titleStyle, fontSize: '1.2rem' }}>
        Configurar: {module.fullLabel || module.label}
      </h3>

      <TextField
        label="Título da Seção de Banners:"
        value={module.config?.title ?? ''}
        onChange={(val) => handleModuleConfigChange(module.id, { title: val })}
        placeholder="Título acima dos banners (ex: Destaque Principal)"
      />

      <div style={sectionStyle}>
        <h4 style={titleStyle}>Layout do Banner</h4>
        <SelectField
          label="Escolha o formato de exibição dos banners:"
          value={(module.config?.bannerLayoutType as string) ?? 'carousel'}
          onChange={(val) => handleModuleConfigChange(module.id, { bannerLayoutType: val as any })}
          options={[
            { value: 'carousel', label: 'Carrossel (um banner por vez)' },
            { value: 'full_width', label: 'Banner de Largura Total (Fixo)' },
            { value: 'grid_2x1', label: 'Grade 2x1 (2 banners por linha Desktop)' },
            { value: 'grid_3x1', label: 'Grade 3x1 (3 banners por linha Desktop)' },
            { value: 'diagonal_left', label: 'Banner Diagonal Esquerda' },
            { value: 'diagonal_right', label: 'Banner Diagonal Direita' },
          ]}
        />
      </div>

      <div style={sectionStyle}>
        <h4 style={titleStyle}>Gerenciar Banners ({currentBanners.length})</h4>

        {currentBanners.map((banner, index) => (
          <div key={banner.id} style={{ ...sectionStyle, backgroundColor: '#fafafa' }}>
            <h5 style={{ ...titleStyle, fontSize: '0.95rem' }}>Banner #{index + 1}</h5>

            {currentBanners.length > 1 && (
              <button
                onClick={() => handleRemoveBanner(banner.id)}
                style={{
                  background: '#dc3545',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  padding: '6px 12px',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  marginBottom: '1rem',
                }}
              >
                <FaTrash size={12} /> Remover
              </button>
            )}

            <TextField
              label="Título do Banner (sobreposto - opcional):"
              value={banner.title ?? ''}
              onChange={(val) => handleBannerItemChange(banner.id, 'title', val)}
              placeholder="Ex: Super Promoção!"
            />
            <TextField
              label="Descrição do Banner (sobreposto - opcional):"
              value={banner.description ?? ''}
              onChange={(val) => handleBannerItemChange(banner.id, 'description', val)}
              placeholder="Ex: Descontos de até 50%!"
            />
            <TextField
              label="Texto do Botão (sobreposto - opcional):"
              value={banner.buttonText ?? ''}
              onChange={(val) => handleBannerItemChange(banner.id, 'buttonText', val)}
              placeholder="Ex: Compre Agora"
            />
            <TextField
              label="Link do Botão (opcional):"
              type="url"
              value={banner.buttonLink ?? ''}
              onChange={(val) => handleBannerItemChange(banner.id, 'buttonLink', val)}
              placeholder="https://sua-loja.com/link-do-botao"
            />
            <TextField
              label="Link Geral do Banner:"
              type="url"
              value={banner.linkUrl ?? ''}
              onChange={(val) => handleBannerItemChange(banner.id, 'linkUrl', val)}
              placeholder="https://sua-loja.com/promocao-geral"
            />
            <TextField
              label="Texto Alternativo (Alt Text - SEO):"
              value={banner.altText ?? ''}
              onChange={(val) => handleBannerItemChange(banner.id, 'altText', val)}
              placeholder="Descreva a imagem para SEO e acessibilidade"
            />

            <div style={{ display: 'flex', gap: '15px', marginTop: '15px', flexWrap: 'wrap' }}>
              <ImageUploadSquare
                label="Imagem Desktop:"
                onImageUpload={handleImageUpload(banner.id, false)}
                currentImageUrl={banner.imageUrlDesktop}
                recommendation="Tamanho sugerido: 1920x600px."
                shape="landscape_banner"
              />
              <ImageUploadSquare
                label="Imagem Mobile:"
                onImageUpload={handleImageUpload(banner.id, true)}
                currentImageUrl={banner.imageUrlMobile}
                recommendation="Tamanho sugerido: 640x320px."
                shape="landscape_banner"
              />
            </div>
          </div>
        ))}

        <button
          onClick={handleAddBanner}
          style={{
            background: '#007bff',
            color: '#fff',
            border: 'none',
            padding: '0.75rem 1.2rem',
            borderRadius: '25px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: 'normal',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontFamily: 'Poppins, sans-serif',
            width: 'fit-content',
            margin: '15px auto 0 auto',
          }}
        >
          <FaPlus size={14} /> Adicionar Novo Banner
        </button>
      </div>
    </div>
  );
};

export default BannerConfig;
