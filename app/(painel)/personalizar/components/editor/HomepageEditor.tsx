// app/(painel)/personalizar/components/editor/HomepageEditor.tsx
'use client';

import React, { useState, useEffect } from 'react';

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

// Importa a interface para o item da lista de módulos (o quadradinho arrastável)
import HomepageModuleListItem from './modules/HomepageModuleListItem';

// Importa os estilos específicos do HomepageEditor
import styles from './HomepageEditor.module.css';

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
} from '../../types';


// --- DEFINIÇÕES DE AJUDA PARA MÓDULOS (GLOBAL PARA REUSO) ---

// Define MODULE_DISPLAY_NAMES com `as const` para inferência de tipos literais
const MODULE_DISPLAY_NAMES_RAW = {
  banner: 'Banner Principal',
  mini_banners: 'Mini Banners',
  product_showcase: 'Vitrine de Produtos',
  text_image: 'Texto e Imagem',
  newsletter: 'Newsletter',
  categories: 'Categorias',
  highlights: 'Destaques (Confiança)',
  video: 'Vídeo',
} as const;

// Mapeamento dos tipos de módulo para nomes de exibição (visíveis no painel)
type ModuleDisplayKeys = keyof typeof MODULE_DISPLAY_NAMES_RAW;
const MODULE_DISPLAY_NAMES: Record<ModuleDisplayKeys, string> = MODULE_DISPLAY_NAMES_RAW;


// Mapeamento dos tipos de módulo para seus componentes de edição
const ModuleEditorComponents: Record<ModuleDisplayKeys, React.FC<any>> = {
  banner: BannerModule,
  mini_banners: MiniBannerModule,
  product_showcase: ProductShowcaseModule,
  text_image: TextImageModule,
  newsletter: NewsletterModule,
  categories: CategoriesModule,
  highlights: HighlightsModule,
  video: VideoModule,
};

// Função para criar um novo módulo com dados padrão (para quando o usuário adicionar um)
const createNewModule = (type: ModuleDisplayKeys): HomepageModuleType => {
  const newId = `${type}-${Date.now()}`;

  switch (type) {
    case 'banner':
      return {
        id: newId, type: 'banner',
        data: {
          desktopImageUrl: 'https://via.placeholder.com/1200x400?text=Novo+Banner+Desktop',
          mobileImageUrl: 'https://via.placeholder.com/600x800?text=Novo+Banner+Mobile',
          title: 'Novo Banner',
          subtitle: 'Clique para editar o conteúdo',
          buttonText: 'Saiba Mais',
          buttonLink: '#',
          isActive: true
        }
      };
    case 'mini_banners':
      return {
        id: newId, type: 'mini_banners',
        data: { title: 'Nova Seção de Mini Banners', banners: [{ id: `mb-${Date.now()}-1`, imageUrl: 'https://via.placeholder.com/300x150?text=MiniBanner', link: '#', title: 'Mini Banner', subtitle: 'Descrição' }], layout: 'grid', isActive: true }
      };
    case 'product_showcase':
      return { id: newId, type: 'product_showcase', data: { title: 'Nova Vitrine de Produtos', displayType: 'latest', productIds: [], numberOfProducts: 4, isActive: true } };
    case 'text_image':
      return { id: newId, type: 'text_image', data: { title: 'Novo Bloco de Texto e Imagem', text: 'Este é um novo bloco de texto e imagem. Edite o conteúdo e a imagem ao lado.', imageUrl: 'https://via.placeholder.com/400x200?text=Texto+e+Imagem', imagePosition: 'left', buttonText: 'Ler Mais', buttonLink: '#', isActive: true } };
    case 'newsletter':
      return { id: newId, type: 'newsletter', data: { title: 'Nova Newsletter', subtitle: 'Assine para receber novidades!', buttonText: 'Assinar', privacyPolicyLink: '#', isActive: true } };
    case 'categories':
      return { id: newId, type: 'categories', data: { title: 'Novas Categorias', selectedCategories: [], layout: 'grid', isActive: true } };
    case 'highlights':
      return { id: newId, type: 'highlights', data: { title: 'Novos Destaques', highlightItems: [{ icon: '✨', text: 'Qualidade' }, { icon: '🚀', text: 'Rapidez' }], layout: 'icons-text', isActive: true } };
    case 'video':
        return { id: newId, type: 'video', data: { title: 'Novo Vídeo', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', autoplay: false, loop: false, controls: true, isActive: true } };
    default:
      throw new Error(`Tipo de módulo desconhecido ou inválido: ${type}`);
  }
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


  const handleUpdateModuleData = (moduleId: string, newData: Partial<any>) => {
    setHomepageModules(prevModules => {
      const updatedModules = prevModules.map(mod => {
        if (mod.id === moduleId) {
          switch (mod.type) {
            case 'banner': return { ...mod, data: { ...mod.data, ...(newData as Partial<BannerModuleData>) } };
            case 'mini_banners': return { ...mod, data: { ...mod.data, ...(newData as Partial<MiniBannerModuleData>) } };
            case 'product_showcase': return { ...mod, data: { ...mod.data, ...(newData as Partial<ProductShowcaseModuleData>) } };
            case 'text_image': return { ...mod, data: { ...mod.data, ...(newData as Partial<TextImageModuleData>) } };
            case 'newsletter': return { ...mod, data: { ...mod.data, ...(newData as Partial<NewsletterModuleData>) } };
            case 'categories': return { ...mod, data: { ...mod.data, ...(newData as Partial<CategoriesModuleData>) } };
            case 'highlights': return { ...mod, data: { ...mod.data, ...(newData as Partial<HighlightsModuleData>) } };
            case 'video': return { ...mod, data: { ...mod.data, ...(newData as Partial<VideoModuleData>) } };
            default: return mod;
          }
        }
        return mod;
      });
      updateConfig({ homepage: { modules: updatedModules } });
      return updatedModules;
    });
  };

  const handleAddModule = (type: ModuleDisplayKeys) => {
    const newModule = createNewModule(type);
    setHomepageModules(prevModules => {
      const updated = [...prevModules, newModule];
      updateConfig({ homepage: { modules: updated } });
      return updated;
    });
    setEditingModuleId(newModule.id);
    setShowAddModuleDropdown(false);
  };

  const handleRemoveModule = (moduleId: string) => {
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
  };

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
          <MdArrowBack size={20} /> {/* Ícone de flecha para voltar */}
        </button>
      )}

      {/* Conteúdo Principal: Lista de Módulos OU Editor de Módulo Específico */}
      {!editingModuleId ? (
        // --- VISÃO DA LISTA DE MÓDULOS (Adicionar e Reordenar) ---
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
                      onToggleActive={(moduleId, isActive) => handleUpdateModuleData(moduleId, { isActive })}
                    />
                  ))}
                </ul>
              </SortableContext>
            </DndContext>
          </div>
        </>
      ) : (
        // VISÃO DO EDITOR DE MÓDULO ESPECÍFICO
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