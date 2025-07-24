// app/(painel)/personalizar/components/editor/modules/HomepageModuleListItem.tsx

'use client';

import React from 'react';
import { HomepageModuleType } from '../../../types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { MdOutlineDragIndicator, MdDeleteForever, MdVisibility, MdVisibilityOff } from 'react-icons/md';

// IMPORTANTE: Removido commonModuleStyles, agora tudo é styles
import styles from './HomepageModuleListItem.module.css'; // Importa os estilos específicos do item de lista

interface HomepageModuleListItemProps {
  id: string;
  module: HomepageModuleType;
  index: number;
  displayName: string;
  onEdit: () => void;
  onRemove: (id: string) => void;
  onToggleActive: (id: string, isActive: boolean) => void;
}

const HomepageModuleListItem: React.FC<HomepageModuleListItemProps> = ({
  id,
  module,
  index,
  displayName,
  onEdit,
  onRemove,
  onToggleActive
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
    boxShadow: isDragging ? '0 6px 12px rgba(0,0,0,0.15)' : '0 1px 3px rgba(0,0,0,0.05)',
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={styles.moduleListItem}
    >
      {/* DRAG HANDLE (os três risquinhos) */}
      <div className={styles.dragHandle} {...listeners} {...attributes}>
        <MdOutlineDragIndicator size={24} />
      </div>

      {/* Conteúdo do item (clicável para editar) */}
      <div className={styles.moduleContent} onClick={onEdit}>
        <span className={styles.moduleTitleDisplay}>
          {index + 1}. {displayName}
        </span>
        {!module.data.isActive && <span className={styles.statusTagInactive}> (Inativo)</span>} {/* USANDO styles.statusTagInactive */}
      </div>

      {/* Botões de Ação */}
      <div className={styles.moduleActions}>
        {/* Botão de Visibilidade (Olhinho) */}
        <button
          onClick={(e) => { e.stopPropagation(); onToggleActive(id, !module.data.isActive); }}
          className={styles.iconActionButton} /* USANDO styles.iconActionButton */
          title={module.data.isActive ? "Ocultar Módulo" : "Mostrar Módulo"}
        >
          {module.data.isActive ? <MdVisibility size={18} /> : <MdVisibilityOff size={18} />}
        </button>

        {/* Botão Remover - LIXEIRA */}
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(id); }}
          className={styles.removeButton} /* USANDO styles.removeButton */
          title="Remover Módulo"
        >
          <MdDeleteForever className={styles.removeIcon} /> {/* USANDO styles.removeIcon */}
        </button>
      </div>
    </li>
  );
};

export default HomepageModuleListItem;