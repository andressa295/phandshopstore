import React from 'react';
import { HomePageModule, Tema } from '../EditorContext';

// Imports dos configs
import ProductSectionConfig from '../module-configs/ProductSectionConfig';
import CategoryGridConfig from '../module-configs/CategoryGridConfig';
import BannerConfig from '../module-configs/BannerConfig';
import TextModuleConfig from '../module-configs/TextModuleConfig';
import SocialModuleConfig from '../module-configs/SocialModuleConfig';
import NewsletterModuleConfig from '../module-configs/NewsletterModuleConfig';
import InfoModuleConfig from '../module-configs/InfoModuleConfig';
import HighlightBannersConfig from '../module-configs/HighlightBannersConfig';

interface ModuleConfigScreenWrapperProps {
  module: HomePageModule;
  goBack: () => void;
  handleModuleConfigChange: (moduleId: string, newConfig: Partial<HomePageModule['config']>) => void;
  tema: Tema;
  setTema: React.Dispatch<React.SetStateAction<Tema>>;
  handleTemaChange: (key: keyof Tema, value: any) => void;
  handleNestedTemaChange: (parentKey: keyof Tema, subKey: string, value: any) => void;
}

const ModuleConfigScreenWrapper: React.FC<ModuleConfigScreenWrapperProps> = ({
  module,
  goBack,
  handleModuleConfigChange,
  tema,
  setTema,
  handleTemaChange,
  handleNestedTemaChange,
}) => {
  const commonProps = {
    module,
    tema,
    setTema,
    handleTemaChange,
    handleNestedTemaChange,
    handleModuleConfigChange,
    goBackFromModuleConfig: goBack,
  };

  switch (module.type) {
    case 'product_section':
      return <ProductSectionConfig {...commonProps} />;
    case 'category_grid':
      return <CategoryGridConfig {...commonProps} />;
    case 'banner':
      return <BannerConfig {...commonProps} />;
    case 'text':
      return <TextModuleConfig {...commonProps} />;
    case 'social':
      return <SocialModuleConfig {...commonProps} />;
    case 'newsletter':
      return <NewsletterModuleConfig {...commonProps} />;
    case 'info':
      return <InfoModuleConfig {...commonProps} />;
    case 'highlight_banners':
      return <HighlightBannersConfig {...commonProps} />;
    default:
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.8rem',
            padding: '0 15px',
            flexGrow: 1,
            overflowY: 'auto',
            fontFamily: 'Poppins, sans-serif',
          }}
        >
          {/* Removi botão vazio que tava aí no topo sem função */}
          <h3 style={{ color: '#333', fontSize: '1.1rem', marginBottom: '0.8rem' }}>
            Configurar: {module.fullLabel || module.label}
          </h3>
          <p>Este tipo de módulo ({module.type}) ainda não possui uma tela de configuração detalhada.</p>
          <button
            onClick={goBack}
            style={{
              background: '#7C3AED',
              color: '#fff',
              border: 'none',
              padding: '0.8rem 1rem',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: 'bold',
              marginTop: 'auto',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#5a22b7')}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#7C3AED')}
          >
            Voltar
          </button>
        </div>
      );
  }
};

export default ModuleConfigScreenWrapper;
