'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './Planos.module.css';

// Tipagem para a estrutura de dados de um plano, de acordo com o banco.
interface Plano {
  id: string;
  nome_plano: string;
  preco_mensal: number;
  preco_anual: number | null;
  recursos: string[];
  stripe_price_id_mensal: string | null;
  stripe_price_id_anual: string | null;
  tarifa_venda_percentual: number;
  is_ativo: boolean;
}

// Funções utilitárias
const getStatusColorClass = (status: boolean) => {
  return status ? styles.statusAtivo : styles.statusInativo;
};

const formatCurrency = (value: number | null) => {
  if (value === null) return 'N/A';
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const PlanosPage: React.FC = () => {
  const supabase = createClientComponentClient();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [planoEditado, setPlanoEditado] = useState<Plano | null>(null);

  const fetchPlanos = async () => {
    const { data, error } = await supabase
      .from('planos')
      .select('*')
      .order('preco_mensal', { ascending: true });

    if (error) {
      console.error('Erro ao buscar planos:', error);
      setError('Não foi possível carregar os planos.');
    } else {
      setPlanos(data as Plano[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlanos();
  }, []);

  const handleOpenEdit = (plano: Plano) => {
    setPlanoEditado({ ...plano });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPlanoEditado(null);
    setIsEditMode(false);
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!planoEditado) return;
    
    // Lógica para salvar as mudanças no Supabase.
    const { error } = await supabase
      .from('planos')
      .update(planoEditado)
      .eq('id', planoEditado.id);
    
    if (error) {
      console.error('Erro ao salvar plano:', error);
      alert('Erro ao salvar as alterações.');
    } else {
      handleCloseModal();
      fetchPlanos(); // Atualiza a lista para refletir a mudança.
    }
  };

  const ModalEdicao = () => {
    if (!planoEditado) return null;
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <h3 className={styles.modalTitle}>Editar Plano: {planoEditado.nome_plano}</h3>
          <form onSubmit={handleSaveChanges}>
            <div className={styles.inputGroup}>
              <label>Nome do Plano:</label>
              <input
                type="text"
                value={planoEditado.nome_plano}
                onChange={(e) => setPlanoEditado({ ...planoEditado, nome_plano: e.target.value })}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Preço Mensal:</label>
              <input
                type="number"
                value={planoEditado.preco_mensal}
                onChange={(e) => setPlanoEditado({ ...planoEditado, preco_mensal: parseFloat(e.target.value) })}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Preço Anual:</label>
              <input
                type="number"
                value={planoEditado.preco_anual || ''}
                onChange={(e) => setPlanoEditado({ ...planoEditado, preco_anual: parseFloat(e.target.value) || null })}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Tarifa (%):</label>
              <input
                type="number"
                value={planoEditado.tarifa_venda_percentual}
                onChange={(e) => setPlanoEditado({ ...planoEditado, tarifa_venda_percentual: parseFloat(e.target.value) })}
                className={styles.input}
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Status:</label>
              <select
                value={planoEditado.is_ativo ? 'ativo' : 'inativo'}
                onChange={(e) => setPlanoEditado({ ...planoEditado, is_ativo: e.target.value === 'ativo' })}
                className={styles.input}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label>Recursos (separados por vírgula):</label>
              <textarea
                value={planoEditado.recursos.join(', ')}
                onChange={(e) => setPlanoEditado({ ...planoEditado, recursos: e.target.value.split(',').map(s => s.trim()) })}
                className={styles.textarea}
              />
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className={`${styles.button} ${styles.buttonSecondary}`} onClick={handleCloseModal}>
                Cancelar
              </button>
              <button type="submit" className={`${styles.button} ${styles.buttonPrimary}`}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (loading) return <div className={styles.planosPage}><p>Carregando planos...</p></div>;
  if (error) return <div className={styles.planosPage}><p>Erro: {error}</p></div>;

  return (
    <div className={styles.planosPage}>
      <h2 className={styles.pageTitle}>Gestão de Planos</h2>
      <p className={styles.pageSubtitle}>
        Gerencie os planos de assinatura e os recursos disponíveis na plataforma.
      </p>

      <div className={styles.tableContainer}>
        <table className={styles.planosTable}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Preço Mensal</th>
              <th>Preço Anual</th>
              <th>Tarifa (%)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {planos.map((plano) => (
              <tr key={plano.id}>
                <td>{plano.nome_plano}</td>
                <td>{formatCurrency(plano.preco_mensal)}</td>
                <td>{formatCurrency(plano.preco_anual)}</td>
                <td>{plano.tarifa_venda_percentual}%</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusColorClass(plano.is_ativo)}`}>
                    {plano.is_ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={() => handleOpenEdit(plano)}>
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && <ModalEdicao />}
    </div>
  );
};

export default PlanosPage;