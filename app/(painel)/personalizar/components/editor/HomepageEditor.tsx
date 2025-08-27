// app/(painel)/personalizar/components/editor/HomepageEditor.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';

// --- DND-KIT IMPORTS ---
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';

// --- Ícones ---
import { MdAdd, MdArrowBack } from 'react-icons/md';


// Importa os componentes de módulo individuais (SEUS EDITORES)
import BannerModule from './modules/BannerModule';
import MiniBannerModule from './modules/MiniBannerModule';
import ProductShowcaseModule from './modules/ProductShowcaseModule';
import TextImageModule from './modules/TextImageModule';
import NewsletterModule from './modules/NewsletterModule';
import CategoriesModule from './modules/CategoriesModule';
import HighlightsModule from './modules/HighlightsModule';
import VideoModule from './modules/VideoModule';
import TestimonialsModule from './modules/TestimonialsModule';
import ImageGalleryModule from './modules/ImageGalleryModule';

// Importa a interface para o item da lista de módulos (o quadradinho arrastável)
import HomepageModuleListItem from './modules/HomepageModuleListItem';

// Importa os estilos específicos do HomepageEditor
import styles from './HomepageEditor.module.css';
import { useTheme } from '../../context/ThemeContext';

// Importa todas as interfaces de dados de módulo do arquivo de tipos
import {
  ThemeConfig,
  ThemeUpdateFn,
  HomepageModuleType,
  BannerModuleData,
  MiniBannerModuleData,
  ProductShowcaseModuleData,
  TextImageModuleData,
  NewsletterModuleData,
  CategoriesModuleData,
  HighlightsModuleData,
  VideoModuleData,
  TestimonialsModuleData,
  ImageGalleryModuleData,
  SingleBannerData,
  SingleProductShowcaseData,
  SingleHighlightItem,
  SelectedCategoryDisplayData,
  SingleMiniBannerData,
  SingleTestimonialData,
  SingleImageGalleryData,
} from '../../types';
import { v4 as uuidv4 } from 'uuid';


// --- DEFINIÇÕES DE AJUDA PARA MÓDULOS (GLOBAL PARA REUSO) ---

const MODULE_DISPLAY_NAMES_RAW = {
  banner: 'Banner Principal',
  mini_banners: 'Mini Banners',
  product_showcase: 'Vitrine de Produtos',
  text_image: 'Texto e Imagem',
  newsletter: 'Newsletter',
  categories: 'Categorias',
  highlights: 'Banner Info',
  video: 'Vídeo',
  testimonials: 'Depoimentos',
  image_gallery: 'Galeria de Imagens',
} as const;

type ModuleDisplayKeys = keyof typeof MODULE_DISPLAY_NAMES_RAW;
const MODULE_DISPLAY_NAMES: Record<ModuleDisplayKeys, string> = MODULE_DISPLAY_NAMES_RAW;

const ModuleEditorComponents: Record<ModuleDisplayKeys, React.FC<any>> = {
  banner: BannerModule,
  mini_banners: MiniBannerModule,
  product_showcase: ProductShowcaseModule,
  text_image: TextImageModule,
  newsletter: NewsletterModule,
  categories: CategoriesModule,
  highlights: HighlightsModule,
  video: VideoModule,
  testimonials: TestimonialsModule,
  image_gallery: ImageGalleryModule,
};

const initialModuleData: { [key in ModuleDisplayKeys]: HomepageModuleType['data'] } = {
  banner: {
    title: 'Novo Banner Principal',
    subtitle: 'Subtítulo do Banner',
    banners: [{
      id: uuidv4(),
      desktopImageUrl: 'https://via.placeholder.com/1200x400?text=Novo+Banner+Desktop',
      mobileImageUrl: 'https://via.placeholder.com/600x800?text=Novo+Banner+Mobile',
      title: 'Novo Banner',
      subtitle: 'Clique para editar o conteúdo',
      buttonText: 'Saiba Mais',
      buttonLink: '#',
      overlayColor: '#000000',
      overlayOpacity: 0.3,
      isActive: true
    }],
    layout: 'carousel',
    autoplay: true,
    interval: 5,
    isActive: true
  },
  mini_banners: {
    title: 'Nova Seção de Mini Banners',
    banners: [{
      id: uuidv4(),
      imageUrl: 'https://via.placeholder.com/300x150?text=MiniBanner',
      link: '#',
      title: 'Mini Banner',
      subtitle: 'Descrição',
      isActive: true
    }],
    layout: 'grid',
    isActive: true
  },
  product_showcase: {
    title: 'Nova Vitrine de Produtos',
    subtitle: 'Explore nossos produtos.',
    showcases: [{
      id: uuidv4(),
      title: 'Mais Vendidos',
      displayType: 'best_sellers',
      categoryId: null,
      productIds: [],
      numberOfProducts: 4,
      isActive: true
    }],
    isActive: true
  },
  text_image: {
    title: 'Novo Bloco de Texto e Imagem',
    text: 'Este é um novo bloco de texto e imagem. Edite o conteúdo e a imagem ao lado.',
    imageUrl: 'https://via.placeholder.com/400x200?text=Texto+e+Imagem',
    imagePosition: 'left',
    buttonText: 'Ler Mais',
    buttonLink: '#',
    isActive: true
  },
  newsletter: {
    title: 'Nova Newsletter',
    subtitle: 'Assine para receber novidades!',
    buttonText: 'Assinar',
    privacyPolicyLink: '#',
    isActive: true
  },
  categories: {
    title: 'Novas Categorias',
    categoriesToDisplay: [],
    layout: 'grid',
    isActive: true
  },
  highlights: {
    title: 'Novos Destaques',
    subtitle: 'Conheça nossos diferenciais.',
    highlightItems: [{
      id: uuidv4(),
      icon: 'MdStar',
      title: 'Qualidade',
      subtitle: 'Produtos de alta qualidade',
      isActive: true
    }],
    layout: 'icons-text',
    isActive: true
  },
  video: {
    title: 'Novo Vídeo',
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    autoplay: false,
    loop: false,
    controls: true,
    isActive: true
  },
  testimonials: {
    title: 'Novos Depoimentos',
    subtitle: 'O que nossos clientes dizem.',
    testimonials: [{
      id: uuidv4(),
      text: 'Amei os produtos e o atendimento!',
      author: 'Cliente Satisfeito',
      imageUrl: 'https://via.placeholder.com/80x80?text=Cliente',
      rating: 5,
      isActive: true,
    }],
    layout: 'carousel',
    isActive: true,
  },
  image_gallery: {
    title: 'Nova Galeria de Imagens',
    subtitle: 'Confira nossas fotos.',
    images: [{
      id: uuidv4(),
      imageUrl: 'https://via.placeholder.com/400x300?text=Galeria+Imagem',
      title: 'Imagem da Galeria',
      link: '#',
      isActive: true,
    }],
    layout: 'grid',
    gridColumns: 3,
    isActive: true,
  }
};


const createNewModule = (type: ModuleDisplayKeys): HomepageModuleType => {
  const newId = `${type}-${Date.now()}`;
  return {
    id: newId,
    type: type,
    data: initialModuleData[type],
  } as HomepageModuleType;
};


const getSafeDisplayName = (type: HomepageModuleType['type'] | undefined | string): string => {
  if (type && (MODULE_DISPLAY_NAMES as any).hasOwnProperty(type)) {
    return (MODULE_DISPLAY_NAMES as any)[type];
  }
  return type || 'Módulo Desconhecido';
};


interface HomepageEditorProps {
  config: ThemeConfig;
  updateConfig: ThemeUpdateFn;
}


const HomepageEditor: React.FC<HomepageEditorProps> = ({ config, updateConfig }) => {
  const [homepageModules, setHomepageModules] = useState<HomepageModuleType[]>(
    JSON.parse(JSON.stringify(config.homepage?.modules || []))
  );

  const [editingModuleId, setEditingModuleId] = useState<string | null>(null);
  const [showAddModuleDropdown, setShowAddModuleDropdown] = useState(false);


  useEffect(() => {
    const newModules = JSON.parse(JSON.stringify(config.homepage?.modules || []));
    if (JSON.stringify(newModules) !== JSON.stringify(homepageModules)) {
      setHomepageModules(newModules);
    }
  }, [config.homepage?.modules]);

  useEffect(() => {
    if (editingModuleId && !homepageModules.some(m => m.id === editingModuleId)) {
      setEditingModuleId(null);
    }
  }, [editingModuleId, homepageModules]);


  const handleUpdateModuleData = useCallback((moduleId: string, newData: Partial<any>) => {
    setHomepageModules(prevModules => {
      const updatedModules = prevModules.map(mod => {
        if (mod.id !== moduleId) return mod;

        // Solução mais robusta: garantir que o tipo do módulo é mantido
        // Isso resolve o erro de 'Type incompatibility'
        const updatedModule = {
          ...mod,
          data: { ...mod.data, ...newData }
        };

        // Usa 'as' para forçar o tipo, já que a estrutura de união é complexa
        return updatedModule as HomepageModuleType;
      });
      updateConfig({ homepage: { modules: updatedModules } });
      return updatedModules;
    });
  }, [homepageModules, updateConfig]);


  const handleAddModule = useCallback((type: ModuleDisplayKeys) => {
    const newModule = createNewModule(type);
    setHomepageModules(prevModules => {
      const updated = [...prevModules, newModule];
      updateConfig({ homepage: { modules: updated } });
      return updated;
    });
    setEditingModuleId(newModule.id);
    setShowAddModuleDropdown(false);
  }, [updateConfig]);


  const handleRemoveModule = useCallback((moduleId: string) => {
    const moduleTypeForDisplay = homepageModules.find(m => m.id === moduleId)?.type;
    const displayName = getSafeDisplayName(moduleTypeForDisplay);

    if (window.confirm(`Tem certeza que deseja remover o módulo "${displayName}"?`)) {
      setHomepageModules(prevModules => {
        const updatedModules = prevModules.filter(mod => mod.id !== moduleId);
        updateConfig({ homepage: { modules: updatedModules } });
        return updatedModules;
      });
      if (editingModuleId === moduleId) {
        setEditingModuleId(null);
      }
    }
  }, [homepageModules, updateConfig, editingModuleId]);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setHomepageModules((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over!.id);
        
        const newOrderedModules = arrayMove(items, oldIndex, newIndex);
        updateConfig({ homepage: { modules: newOrderedModules } });
        return newOrderedModules;
      });
    }
  }

  const toggleAddModuleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowAddModuleDropdown(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showAddModuleDropdown &&
        event.target instanceof HTMLElement &&
        !event.target.closest(`.${styles.addModuleFabContainer}`) &&
        !event.target.closest(`.${styles.addModuleDropdown}`)
      ) {
        setShowAddModuleDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [showAddModuleDropdown]);


  const editingModule = homepageModules.find(mod => mod.id === editingModuleId);
  const SpecificModuleEditorComponent = editingModule ? ModuleEditorComponents[editingModule.type] : null;


  return (
    <div className={styles.editorWrapper}>
      {/* Botão de Voltar para os Módulos (visível SOMENTE quando editando um módulo específico) */}
      {editingModuleId && (
        <button className={styles.backToModulesButton} onClick={() => setEditingModuleId(null)}>
          <MdArrowBack size={20} />
        </button>
      )}

      {/* Conteúdo Principal: Lista de Módulos OU Editor de Módulo Específico */}
      {!editingModuleId ? (
        <>
          <h3 className={styles.sectionTitle}>Página Inicial: Gerenciar Módulos</h3>
          <p className={styles.fieldDescription}>
            Arraste e solte os blocos de conteúdo para mudar a ordem. Clique em um módulo para editá-lo.
          </p>

          {/* NOVO: Botão Flutuante de Adicionar Módulo (FAB) que abre um seletor */}
          <div className={styles.addModuleFabContainer}>
            <button
              className={styles.addModuleFab}
              onClick={toggleAddModuleDropdown}
              title="Adicionar Novo Módulo"
            >
              <MdAdd size={24} />
            </button>
            <div className={`${styles.addModuleDropdown} ${showAddModuleDropdown ? styles.isActive : ''}`}>
              <h4 className={styles.dropdownLabel}>Escolha o tipo de módulo:</h4>
              <div className={styles.moduleSelectionGrid}>
                {Object.keys(MODULE_DISPLAY_NAMES).map((typeKey: string) => (
                  <button
                    key={typeKey}
                    className={styles.moduleSelectionButton}
                    onClick={() => handleAddModule(typeKey as ModuleDisplayKeys)}
                  >
                    {MODULE_DISPLAY_NAMES[typeKey as ModuleDisplayKeys]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.modulesListContainer}>
            {homepageModules.length === 0 && (
              <p className={styles.noContentMessage}>
                Nenhum módulo adicionado ainda. Clique no botão de "Adicionar" para começar!
              </p>
            )}

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={homepageModules.map(mod => mod.id)}
                strategy={verticalListSortingStrategy}
              >
                <ul className={styles.modulesList}>
                  {homepageModules.map((module, index) => (
                    <HomepageModuleListItem
                      key={module.id}
                      id={module.id}
                      module={module}
                      index={index}
                      displayName={getSafeDisplayName(module.type)}
                      onEdit={() => setEditingModuleId(module.id)}
                      onRemove={handleRemoveModule}
                      onToggleActive={(moduleId, isActive) => {
                        setHomepageModules((prevModules) => {
  const updated = prevModules.map((mod) => {
    if (mod.id !== moduleId) return mod;

    // narrow por tipo
    switch (mod.type) {
      case "banner":
        return {
          ...mod,
          data: { ...mod.data, isActive } as BannerModuleData,
        };
      case "mini_banners":
        return {
          ...mod,
          data: { ...mod.data, isActive } as MiniBannerModuleData,
        };
      case "product_showcase":
        return {
          ...mod,
          data: { ...mod.data, isActive } as ProductShowcaseModuleData,
        };
      case "text_image":
        return {
          ...mod,
          data: { ...mod.data, isActive } as TextImageModuleData,
        };
      case "newsletter":
        return {
          ...mod,
          data: { ...mod.data, isActive } as NewsletterModuleData,
        };
      case "categories":
        return {
          ...mod,
          data: { ...mod.data, isActive } as CategoriesModuleData,
        };
      case "highlights":
        return {
          ...mod,
          data: { ...mod.data, isActive } as HighlightsModuleData,
        };
      case "video":
        return {
          ...mod,
          data: { ...mod.data, isActive } as VideoModuleData,
        };
      case "testimonials":
        return {
          ...mod,
          data: { ...mod.data, isActive } as TestimonialsModuleData,
        };
      case "image_gallery":
        return {
          ...mod,
          data: { ...mod.data, isActive } as ImageGalleryModuleData,
        };
      default:
        return mod;
    }
  });

  updateConfig({ homepage: { modules: updated } });
  return updated;
});

                      
                      }}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
        </>
      ) : (
        <div className={styles.moduleEditorBlock}>
          {SpecificModuleEditorComponent && (
            <SpecificModuleEditorComponent
              id={editingModule!.id}
              data={editingModule!.data}
              onChange={(newData: Partial<any>) => handleUpdateModuleData(editingModule!.id, newData)}
              onRemove={handleRemoveModule}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;