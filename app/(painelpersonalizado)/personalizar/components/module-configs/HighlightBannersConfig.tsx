import React, { useRef } from 'react';
import TextField from '../ui/TextField';
import TextareaField from '../ui/TextareaField';
import { HomePageModule, Tema } from '../EditorContext';

interface HighlightBannersConfigProps {
  module: HomePageModule;
  goBackFromModuleConfig?: () => void;
  handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
  tema: Tema;
  setTema: React.Dispatch<React.SetStateAction<Tema>>;
  handleTemaChange: (key: keyof Tema, value: any) => void;
  handleNestedTemaChange: (parentKey: keyof Tema, subKey: string, value: any) => void;
}

const HighlightBannersConfig: React.FC<HighlightBannersConfigProps> = ({
  module,
  goBackFromModuleConfig,
  handleModuleConfigChange,
  tema,
  setTema,
  handleTemaChange,
  handleNestedTemaChange
}) => {
  const currentBanners = module.config?.highlightBanners || [];

  const handleBannerChange = (index: number, key: string, value: string) => {
    const updatedBanners = [...currentBanners];
    updatedBanners[index] = { ...updatedBanners[index], [key]: value };
    handleModuleConfigChange(module.id, { highlightBanners: updatedBanners });
  };

  const handleAddBanner = () => {
    const newBanner = { id: `hb_${Date.now()}`, imageUrl: '', link: '', title: '', description: '' };
    handleModuleConfigChange(module.id, { highlightBanners: [...currentBanners, newBanner] });
  };

  const handleRemoveBanner = (idToRemove: string) => {
    const updatedBanners = currentBanners.filter(banner => banner.id !== idToRemove);
    handleModuleConfigChange(module.id, { highlightBanners: updatedBanners });
  };

  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleImageUpload = (index: number, file: File | null) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        handleBannerChange(index, 'imageUrl', reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '0 15px', flexGrow: 1, overflowY: 'auto' }}>
      <button onClick={goBackFromModuleConfig} style={{ background: 'none', border: 'none', color: '#333', cursor: 'pointer', textAlign: 'left', marginBottom: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold', fontFamily: 'Poppins, sans-serif' }}>
      </button>
      <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem', fontFamily: 'Poppins, sans-serif' }}>Configurar Banners de Destaque: {module.fullLabel || module.label}</h3>
      <p style={{ fontSize: '0.85rem', color: '#777', fontFamily: 'Poppins, sans-serif' }}>
        Gerencie os mini banners que aparecem nesta seção.
      </p>

      <button
        onClick={handleAddBanner}
        style={{
          background: '#28a745',
          color: '#fff',
          border: 'none',
          padding: '0.75rem 1.2rem',
          borderRadius: '25px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 'normal',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          maxWidth: 'fit-content',
          fontFamily: 'Poppins, sans-serif',
          marginBottom: '1rem',
        }}
      >
        Adicionar Novo Banner
      </button>

      {currentBanners.map((banner, index) => (
        <div
          key={banner.id}
          style={{
            border: '1px solid #eee',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '1rem',
            position: 'relative',
          }}
        >
          <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem', color: '#333', fontFamily: 'Poppins, sans-serif' }}>
            Banner {index + 1}
          </h4>

          <TextField
            label="Título:"
            value={banner.title ?? ''}
            onChange={(val) => handleBannerChange(index, 'title', val)}
            placeholder="Título do banner"
          />
          <TextareaField
            label="Descrição:"
            value={banner.description ?? ''}
            onChange={(val) => handleBannerChange(index, 'description', val)}
            placeholder="Breve descrição do banner"
            minHeight="38px"
            maxHeight="80px"
          />

          <div style={{ marginTop: '8px' }}>
            <label style={{ fontSize: '0.9rem', color: '#555', fontFamily: 'Poppins, sans-serif', display: 'block', marginBottom: '4px' }}>
              Imagem do Banner:
            </label>
            <input
              type="file"
              accept="image/*"
              style={{ cursor: 'pointer' }}
              ref={el => { fileInputRefs.current[index] = el; }}
              onChange={(e) => handleImageUpload(index, e.target.files ? e.target.files[0] : null)}
            />
          </div>

          {banner.imageUrl && (
            <img
              src={banner.imageUrl}
              alt={`Banner ${index + 1}`}
              style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '10px 0', borderRadius: '4px' }}
            />
          )}

          <TextField
            label="Link do Banner:"
            type="url"
            value={banner.link ?? ''}
            onChange={(val) => handleBannerChange(index, 'link', val)}
            placeholder="https://exemplo.com/pagina-do-banner"
          />

          <button
            onClick={() => handleRemoveBanner(banner.id)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: '#dc3545',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: '30px',
              height: '30px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 'bold',
            }}
            title="Remover Banner"
          >
            ×
          </button>
        </div>
      ))}

      <button
        onClick={goBackFromModuleConfig}
        style={{
          background: '#007bff',
          color: '#fff',
          border: 'none',
          padding: '1rem',
          borderRadius: '5px',
          cursor: 'pointer',
          fontSize: '0.9rem',
          fontWeight: 'bold',
          marginTop: 'auto',
          fontFamily: 'Poppins, sans-serif'
        }}
      >
        Voltar
      </button>
    </div>
  );
};

export default HighlightBannersConfig;
