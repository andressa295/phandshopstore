import React from 'react';
import { FaBars, FaEye, FaBoxOpen } from 'react-icons/fa';
import { HomePageModule, Tema } from '../EditorContext';
import { renderIconFromString } from '../utils/iconMap';

import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

interface HomePageModulesListScreenProps {
  homePageModules: HomePageModule[];
  setEditingModuleId: (id: string | null) => void;
  setCurrentSidebarScreen: (key: string) => void;
  setActiveScreenKey: (key: string) => void;
  setTema: React.Dispatch<React.SetStateAction<Tema>>;
  activeScreenKey: string;
}

const buttonAddProductStyle: React.CSSProperties = {
  background: 'transparent',
  borderWidth: '1.5px',
  borderStyle: 'solid',
  borderColor: '#7C3AED',
  color: '#7C3AED',
  borderRadius: 20,
  padding: '0.45rem 1rem',
  cursor: 'pointer',
  fontSize: '0.9rem',
  fontWeight: 500,
  fontFamily: 'Poppins, sans-serif',
  transition: 'all 0.2s ease',
  alignSelf: 'flex-start',
};

const buttonAddProductHover: React.CSSProperties = {
  background: '#7C3AED',
  color: '#fff',
  borderColor: '#7C3AED',
};

const HomePageModulesListScreen: React.FC<HomePageModulesListScreenProps> = ({
  homePageModules,
  setEditingModuleId,
  setCurrentSidebarScreen,
  setActiveScreenKey,
  setTema,
  activeScreenKey,
}) => {
  const [isAddHover, setIsAddHover] = React.useState(false);

  const toggleModuleVisibility = (moduleId: string) => {
    setTema((prevTema: Tema) => ({
      ...prevTema,
      homePageModules: prevTema.homePageModules.map((module: HomePageModule) =>
        module.id === moduleId ? { ...module, isVisible: !module.isVisible } : module
      ),
    }));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    // Aqui travamos para aceitar somente reordenação vertical
    if (result.destination.index === result.source.index) return;

    const reorderedModules = Array.from(homePageModules);
    const [removed] = reorderedModules.splice(result.source.index, 1);
    reorderedModules.splice(result.destination.index, 0, removed);

    setTema(prevTema => ({
      ...prevTema,
      homePageModules: reorderedModules,
    }));
  };

  const addProductSection = () => {
    const newProductSection: HomePageModule = {
      id: `produtos_personalizado_${Date.now()}`,
      label: `Nova Seção de Produtos`,
      fullLabel: `Nova Seção Personalizada de Produtos`,
      icon: 'FaBoxOpen',
      type: 'product_section',
      isVisible: true,
      config: { title: 'Nova Seção de Produtos', layout: 'grid', productIds: [] },
    };
    setTema(prevTema => ({
      ...prevTema,
      homePageModules: [...prevTema.homePageModules, newProductSection],
    }));
    setEditingModuleId(newProductSection.id);
    setCurrentSidebarScreen(newProductSection.id);
    setActiveScreenKey(newProductSection.id);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, padding: '0 10px', flexGrow: 1, overflowY: 'auto', fontFamily: 'Poppins, sans-serif', maxWidth: 'calc(100vw - 20px)' }}>
      {/* Texto arrasta e solte, linha única, leve e alinhado */}
      <p
        style={{
          fontSize: 12,
          color: '#555',
          lineHeight: 1.3,
          marginBottom: 6,
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
        aria-label="Instrução de arrastar e soltar módulos"
      >
        Arraste e solte o ícone <FaBars size={14} style={{ color: '#7C3AED' }} aria-hidden="true" /> para reordenar os módulos. Clique no <FaEye size={14} style={{ color: '#7C3AED' }} aria-hidden="true" /> para alternar visibilidade. Clique no módulo para editar.
      </p>

      {/* Botão delicado de adicionar seção de produtos */}
      <button
        onClick={addProductSection}
        style={isAddHover ? { ...buttonAddProductStyle, ...buttonAddProductHover } : buttonAddProductStyle}
        onMouseEnter={() => setIsAddHover(true)}
        onMouseLeave={() => setIsAddHover(false)}
        aria-label="Adicionar seção de produtos"
        type="button"
      >
        + Adicionar Seção de Produtos
      </button>

      {/* Lista com DragDropContext */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="home-page-modules" direction="vertical">
          {(provided) => (
            <ul
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={{
                listStyle: 'none',
                padding: 0,
                marginTop: 8,
                marginBottom: 0,
                maxWidth: '100%',
              }}
            >
              {homePageModules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(providedInner, snapshotInner) => (
                    <li
                      ref={providedInner.innerRef}
                      {...providedInner.draggableProps}
                      style={{
                        ...providedInner.draggableProps.style,
                        marginBottom: 8,
                        background: snapshotInner.isDragging
                          ? 'rgba(124,58,237,0.15)'
                          : module.id === activeScreenKey
                          ? '#F3E8FF'
                          : '#fff',
                        border: '1px solid #ddd',
                        borderRadius: 6,
                        boxShadow: snapshotInner.isDragging ? '0 0 10px rgba(124,58,237,0.3)' : 'none',
                        transition: 'background 0.2s ease, box-shadow 0.2s ease',
                        cursor: 'pointer',
                        userSelect: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 14px',
                        fontSize: 14, // Tamanho reduzido para evitar overflow no texto
                        color: '#333',
                        fontWeight: module.id === activeScreenKey ? '600' : '500',
                        maxWidth: '100%', // evita overflow horizontal
                      }}
                      onClick={() => {
                        setEditingModuleId(module.id);
                        setCurrentSidebarScreen(module.id);
                        setActiveScreenKey(module.id);
                      }}
                      title={module.fullLabel || module.label}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setEditingModuleId(module.id);
                          setCurrentSidebarScreen(module.id);
                          setActiveScreenKey(module.id);
                        }
                      }}
                      aria-pressed={module.id === activeScreenKey}
                      {...providedInner.dragHandleProps}
                    >
                      <span style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 1, overflow: 'hidden' }}>
                        <FaBars size={16} style={{ color: '#7C3AED' }} aria-label="Arrastar módulo" />
                        {renderIconFromString(module.icon as string, 16, '#7C3AED') || <FaBoxOpen size={16} color="#7C3AED" />}
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flexShrink: 1 }}>{module.label}</span>
                      </span>
                      <FaEye
                        size={16}
                        style={{ color: module.isVisible ? '#7C3AED' : '#bbb', cursor: 'pointer', flexShrink: 0 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleModuleVisibility(module.id);
                        }}
                        aria-label={module.isVisible ? 'Ocultar módulo' : 'Mostrar módulo'}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            toggleModuleVisibility(module.id);
                          }
                        }}
                      />
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default HomePageModulesListScreen;
