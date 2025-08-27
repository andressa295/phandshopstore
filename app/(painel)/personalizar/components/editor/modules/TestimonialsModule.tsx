// app/(painel)/personalizar/components/editor/modules/TestimonialsModule.tsx
'use client';

import React, { ChangeEvent, useRef, useState } from 'react';
import { TestimonialsModuleData, SingleTestimonialData } from '../../../types';
import styles from './TestimonialsModule.module.css'; // Importa estilos locais
import { MdDeleteForever, MdAdd, MdClose, MdEdit, MdOutlineFileUpload, MdStar, MdStarBorder } from 'react-icons/md'; // Ícones
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // Cliente Supabase
import { v4 as uuidv4 } from 'uuid'; // Para gerar IDs únicos

interface TestimonialsModuleProps {
  id: string; // ID do módulo Depoimentos na homepage
  data: TestimonialsModuleData; // Dados gerais do módulo Depoimentos
  onChange: (newData: Partial<TestimonialsModuleData>) => void; // Função para atualizar os dados do módulo
  onRemove: (id: string) => void; // Função para remover o módulo Depoimentos
}

// Inicializa o cliente Supabase para Client Components
const supabase = createClientComponentClient();
const SUPABASE_STORAGE_BUCKET = 'theme-images'; // <--- NOME DO SEU BUCKET NO SUPABASE STORAGE!

// Componente Modal para Edição de Depoimento Individual
interface EditTestimonialModalProps {
  testimonial: SingleTestimonialData;
  onSave: (updatedTestimonial: SingleTestimonialData) => void;
  onClose: () => void;
  moduleId: string; // ID do módulo pai para o upload
}

const EditTestimonialModal: React.FC<EditTestimonialModalProps> = ({ testimonial, onSave, onClose, moduleId }) => {
  const [currentTestimonial, setCurrentTestimonial] = useState<SingleTestimonialData>(testimonial);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop();
    const filePath = `${moduleId}/${currentTestimonial.id}/author-image-${Date.now()}.${fileExtension}`;

    try {
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Erro ao fazer upload da imagem:', uploadError);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from(SUPABASE_STORAGE_BUCKET)
        .getPublicUrl(filePath);

      if (publicUrlData?.publicUrl) {
        setCurrentTestimonial(prev => ({ ...prev, imageUrl: publicUrlData.publicUrl as string }));
        console.log('Upload de imagem concluído com sucesso:', publicUrlData.publicUrl);
      } else {
        console.error('Não foi possível obter a URL pública da imagem.');
      }

    } catch (error: any) {
      console.error('Erro inesperado no upload:', error);
    } finally {
      e.target.value = '';
    }
  };

  const handleSave = () => {
    onSave(currentTestimonial);
    onClose();
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h5 className={styles.modalTitle}>Editar Depoimento</h5>
          <button onClick={onClose} className={styles.modalCloseButton}>
            <MdClose size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          {/* Texto do Depoimento */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-testimonial-text-${currentTestimonial.id}`} className={styles.inputLabel}>Texto do Depoimento:</label>
            <textarea
              id={`modal-testimonial-text-${currentTestimonial.id}`}
              className={styles.textArea}
              value={currentTestimonial.text ?? ''}
              onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Ex: Adorei a loja e os produtos!"
              rows={4}
            />
            <p className={styles.fieldDescription}>O texto principal do depoimento do cliente.</p>
          </div>

          {/* Autor do Depoimento */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-testimonial-author-${currentTestimonial.id}`} className={styles.inputLabel}>Autor:</label>
            <input
              id={`modal-testimonial-author-${currentTestimonial.id}`}
              type="text"
              className={styles.textInput}
              value={currentTestimonial.author ?? ''}
              onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, author: e.target.value }))}
              placeholder="Ex: Maria S."
            />
            <p className={styles.fieldDescription}>O nome do cliente que deixou o depoimento.</p>
          </div>

          {/* Upload da Imagem do Autor */}
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>Imagem do Cliente (opcional):</label>
            <div
              className={styles.imageUploadBox}
              onClick={() => imageInputRef.current?.click()}
            >
              {currentTestimonial.imageUrl ? (
                <img src={currentTestimonial.imageUrl} alt="Preview Cliente" className={styles.imagePreview} />
              ) : (
                <div className={styles.uploadInner}>
                  <MdOutlineFileUpload className={styles.uploadIconPlaceholder} />
                  <span className={styles.uploadPlaceholder}>Clique para fazer upload (80x80px)</span>
                </div>
              )}
            </div>
            <input
              id={`image-file-input-${currentTestimonial.id}`}
              ref={imageInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            {currentTestimonial.imageUrl && (
                <button
                    type="button"
                    className={styles.removeImageButton}
                    onClick={() => setCurrentTestimonial(prev => ({ ...prev, imageUrl: '' }))}
                >
                    <MdClose size={18} /> Remover Imagem
                </button>
            )}
            <p className={styles.fieldDescription}>Foto do cliente (redonda) para acompanhar o depoimento.</p>
          </div>

          {/* Avaliação (Rating) */}
          <div className={styles.inputGroup}>
            <label htmlFor={`modal-testimonial-rating-${currentTestimonial.id}`} className={styles.inputLabel}>Avaliação (1-5 estrelas):</label>
            <div className={styles.ratingInput}>
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={styles.starIcon}
                  onClick={() => setCurrentTestimonial(prev => ({ ...prev, rating: star as SingleTestimonialData['rating'] }))}
                >
                  {star <= (currentTestimonial.rating ?? 0) ? <MdStar size={24} /> : <MdStarBorder size={24} />}
                </span>
              ))}
            </div>
            <p className={styles.fieldDescription}>A avaliação em estrelas dada pelo cliente.</p>
          </div>

          {/* Depoimento Ativo */}
          <div className={styles.inputGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.checkboxInput}
                checked={currentTestimonial.isActive ?? false}
                onChange={(e) => setCurrentTestimonial(prev => ({ ...prev, isActive: e.target.checked }))}
              />
              Depoimento Ativo
            </label>
            <p className={styles.fieldDescription}>Desative para ocultar este depoimento.</p>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.secondaryButton}>Cancelar</button>
          <button onClick={handleSave} className={styles.primaryButton}>Salvar</button>
        </div>
      </div>
    </div>
  );
};

// --- Componente Principal TestimonialsModule ---
const TestimonialsModule: React.FC<TestimonialsModuleProps> = ({ id, data, onChange, onRemove }) => {
  const testimonials: SingleTestimonialData[] = data.testimonials || [];
  const [editingTestimonial, setEditingTestimonial] = useState<SingleTestimonialData | null>(null);

  const handleUpdateModuleData = (newModuleData: Partial<TestimonialsModuleData>) => {
    onChange(newModuleData);
  };

  const handleAddTestimonial = () => {
    const newTestimonial: SingleTestimonialData = {
      id: uuidv4(),
      text: 'Novo depoimento de cliente.',
      author: 'Novo Cliente',
      imageUrl: '',
      rating: 5,
      isActive: true,
    };
    handleUpdateModuleData({ testimonials: [...testimonials, newTestimonial] });
  };

  const handleRemoveTestimonial = (testimonialId: string) => {
    if (window.confirm('Tem certeza que deseja remover este depoimento?')) {
      const updatedTestimonials = testimonials.filter(t => t.id !== testimonialId);
      handleUpdateModuleData({ testimonials: updatedTestimonials });
    }
  };

  const handleSaveEditedTestimonial = (updatedTestimonial: SingleTestimonialData) => {
    const updatedTestimonials = testimonials.map(t =>
      t.id === updatedTestimonial.id ? updatedTestimonial : t
    );
    handleUpdateModuleData({ testimonials: updatedTestimonials });
    setEditingTestimonial(null);
  };

  return (
    <div className={styles.sectionBlock}>
      <div className={styles.moduleHeader}>
        <h4 className={styles.nestedTitle}>Depoimentos</h4>
        <button onClick={() => onRemove(id)} className={styles.removeModuleButton} title="Remover Módulo">
          <MdDeleteForever className={styles.removeIcon} />
        </button>
      </div>

      <p className={styles.sectionDescription}>
        Exiba depoimentos de clientes satisfeitos para aumentar a confiança em sua loja.
      </p>

      {/* Título Geral do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`testimonials-title-${id}`} className={styles.inputLabel}>Título:</label>
        <input
          id={`testimonials-title-${id}`}
          type="text"
          className={styles.textInput}
          value={data.title ?? ''}
          onChange={(e) => handleUpdateModuleData({ title: e.target.value })}
          placeholder="Ex: O Que Nossos Clientes Dizem"
        />
        <p className={styles.fieldDescription}>Um título para esta seção de depoimentos (opcional).</p>
      </div>

      {/* Subtítulo Geral do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`testimonials-subtitle-${id}`} className={styles.inputLabel}>Subtítulo:</label>
        <textarea
          id={`testimonials-subtitle-${id}`}
          className={styles.textArea}
          value={data.subtitle ?? ''}
          onChange={(e) => handleUpdateModuleData({ subtitle: e.target.value })}
          placeholder="Ex: Veja a opinião de quem já comprou!"
          rows={3}
        />
        <p className={styles.fieldDescription}>Um subtítulo para esta seção de depoimentos (opcional).</p>
      </div>

      <button type="button" onClick={handleAddTestimonial} className={styles.addTestimonialButton}>
        <MdAdd /> Novo depoimento
      </button>

      {testimonials.length === 0 && (
        <p className={styles.noContentMessage}>Nenhum depoimento adicionado ainda. Clique em "Adicionar Novo Depoimento" para começar.</p>
      )}

      <div className={styles.testimonialsList}>
        {testimonials.map((testimonial, index) => (
          <div key={testimonial.id} className={styles.testimonialPreviewItem}>
            <div className={styles.testimonialPreviewContent}>
              {testimonial.imageUrl && (
                <img src={testimonial.imageUrl} alt={testimonial.author} className={styles.testimonialPreviewImage} />
              )}
              <div className={styles.testimonialTextInfo}>
                <h5 className={styles.testimonialPreviewAuthor}>{testimonial.author || `Depoimento #${index + 1}`}</h5>
                <p className={styles.testimonialPreviewText}>"{testimonial.text || 'Depoimento sem texto'}"</p>
                <div className={styles.testimonialPreviewRating}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <MdStar key={star} size={16} className={star <= (testimonial.rating ?? 0) ? styles.starFilled : styles.starEmpty} />
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.testimonialActionsOverlay}>
              <button onClick={() => setEditingTestimonial(testimonial)} className={styles.editTestimonialInlineButton} title="Editar Depoimento">
                <MdEdit size={16} />
              </button>
              <button onClick={() => handleRemoveTestimonial(testimonial.id)} className={styles.removeTestimonialInlineButton} title="Remover Depoimento">
                <MdClose size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Campo Layout do Carrossel */}
      <div className={styles.inputGroup}>
        <label htmlFor={`testimonials-layout-${id}`} className={styles.inputLabel}>Layout dos Depoimentos:</label>
        <select
          id={`testimonials-layout-${id}`}
          className={styles.selectInput}
          value={data.layout ?? 'carousel'}
          onChange={(e) => handleUpdateModuleData({ layout: e.target.value as 'carousel' | 'grid' })}
        >
          <option value="carousel">Carrossel</option>
          <option value="grid">Grade (Grid)</option>
        </select>
        <p className={styles.fieldDescription}>Define como os depoimentos serão exibidos.</p>
      </div>

      {/* Campo Ativo do Módulo */}
      <div className={styles.inputGroup}>
        <label htmlFor={`testimonials-active-${id}`} className={styles.checkboxLabel}>
          <input
            type="checkbox"
            id={`testimonials-active-${id}`}
            className={styles.checkboxInput}
            checked={data.isActive ?? false}
            onChange={(e) => handleUpdateModuleData({ isActive: e.target.checked })}
          /> Módulo Ativo
        </label>
        <p className={styles.fieldDescription}>Marque para exibir este módulo na página inicial.</p>
      </div>

      {editingTestimonial && (
        <EditTestimonialModal
          testimonial={editingTestimonial}
          onSave={handleSaveEditedTestimonial}
          onClose={() => setEditingTestimonial(null)}
          moduleId={id}
        />
      )}
    </div>
  );
};

export default TestimonialsModule;