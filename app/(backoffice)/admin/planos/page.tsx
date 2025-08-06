'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import '@/app/globals.css';
import { createClient } from '@supabase/supabase-js';

// Conexão com o Supabase.
// ATENÇÃO: Substitua os placeholders abaixo pelas suas credenciais.
const supabaseUrl = 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipagem para a estrutura de dados de um plano.
interface Plano {
  id: number;
  nome: string;
  preco: number;
  recursos: string[];
  status: 'ativo' | 'inativo';
}

const getStatusColor = (status: Plano['status']) => {
  return status === 'ativo' ? 'var(--green-success)' : 'red';
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const PlanosPage: React.FC = () => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [planoSelecionado, setPlanoSelecionado] = useState<Plano | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [planoEditado, setPlanoEditado] = useState<Plano | null>(null);

  // Lógica para buscar os planos do Supabase.
  useEffect(() => {
    const fetchPlanos = async () => {
      // Aqui você faria a chamada real para a sua tabela de planos.
      const { data, error } = await supabase
        .from('planos')
        .select('*');

      if (error) {
        console.error('Erro ao buscar planos:', error);
      } else {
        // Substituímos os dados simulados pelos dados reais do Supabase.
        setPlanos(data as Plano[]);
      }
    };

    fetchPlanos();
  }, []);

  const buttonBaseStyle = {
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
  };

  const handleOpenDetails = (plano: Plano) => {
    setPlanoSelecionado(plano);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plano: Plano) => {
    setPlanoSelecionado(plano);
    setPlanoEditado({ ...plano });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPlanoSelecionado(null);
    setPlanoEditado(null);
  };

  const handleSaveChanges = async (e: FormEvent) => {
    e.preventDefault();
    if (!planoEditado) return;
    
    // Lógica para salvar as mudanças no Supabase.
    const { data, error } = await supabase
      .from('planos')
      .update(planoEditado)
      .eq('id', planoEditado.id);
    
    if (error) {
      console.error('Erro ao salvar plano:', error);
    } else {
      console.log('Dados salvos:', data);
      handleCloseModal();
      // Atualizar a lista de planos para refletir a mudança.
      setPlanos(planos.map(p => p.id === planoEditado.id ? planoEditado : p));
    }
  };

  const ModalDetalhes = () => {
    if (!planoSelecionado) return null;
    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <h3 style={{ color: 'var(--purple-main)', marginBottom: '1rem' }}>Detalhes do Plano</h3>
          <p><strong>Nome:</strong> {planoSelecionado.nome}</p>
          <p><strong>Preço:</strong> {formatCurrency(planoSelecionado.preco)}</p>
          <p><strong>Status:</strong> {planoSelecionado.status}</p>
          <p><strong>Recursos:</strong></p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            {planoSelecionado.recursos.map((recurso, index) => (
              <li key={index}>{recurso}</li>
            ))}
          </ul>
          <button style={{ ...buttonBaseStyle, marginTop: '1.5rem', background: 'var(--gray-dark-text)' }} onClick={handleCloseModal}>
            Fechar
          </button>
        </div>
      </div>
    );
  };

  const ModalEdicao = () => {
    if (!planoEditado) return null;
    return (
      <div style={modalOverlayStyle}>
        <div style={modalContentStyle}>
          <h3 style={{ color: 'var(--purple-main)', marginBottom: '1rem' }}>Editar Plano</h3>
          <form onSubmit={handleSaveChanges}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome:</label>
              <input
                type="text"
                value={planoEditado.nome}
                onChange={(e) => setPlanoEditado({ ...planoEditado, nome: e.target.value })}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Preço:</label>
              <input
                type="number"
                value={planoEditado.preco}
                onChange={(e) => setPlanoEditado({ ...planoEditado, preco: parseFloat(e.target.value) })}
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Status:</label>
              <select
                value={planoEditado.status}
                onChange={(e) => setPlanoEditado({ ...planoEditado, status: e.target.value as Plano['status'] })}
                style={inputStyle}
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
              <button type="button" style={{ ...buttonBaseStyle, background: 'var(--gray-dark-text)' }} onClick={handleCloseModal}>
                Cancelar
              </button>
              <button type="submit" style={{ ...buttonBaseStyle, background: 'var(--purple-main)' }}>
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--purple-main)', fontSize: '2rem', marginBottom: '1rem' }}>Gestão de Planos</h2>
      <p style={{ color: 'var(--gray-dark-text)', marginBottom: '2rem' }}>
        Gerencie os planos de assinatura e os recursos disponíveis na plataforma.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-light)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', fontWeight: '600' }}>ID</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Nome</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Preço</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {planos.map((plano) => (
              <tr key={plano.id} style={{ borderBottom: '1px solid var(--gray-medium)' }}>
                <td style={{ padding: '1rem' }}>{plano.id}</td>
                <td style={{ padding: '1rem' }}>{plano.nome}</td>
                <td style={{ padding: '1rem' }}>{formatCurrency(plano.preco)}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    color: 'white',
                    background: getStatusColor(plano.status),
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                    {plano.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>
                  <button
                    style={{
                      ...buttonBaseStyle,
                      marginRight: '0.5rem',
                      background: 'var(--purple-main)'
                    }}
                    onClick={() => handleOpenDetails(plano)}
                  >
                    Ver
                  </button>
                  <button
                    style={{
                      ...buttonBaseStyle,
                      background: 'var(--gray-dark-text)'
                    }}
                    onClick={() => handleOpenEdit(plano)}
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (isEditMode ? <ModalEdicao /> : <ModalDetalhes />)}
    </div>
  );
};

const modalOverlayStyle = {
  position: 'fixed' as 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const modalContentStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '12px',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  maxWidth: '500px',
  width: '100%',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  borderRadius: '8px',
  border: '1px solid var(--gray-medium)',
  color: 'var(--gray-dark-text)',
};

export default PlanosPage;
