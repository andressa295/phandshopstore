'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import styles from './Suporte.module.css';

// Tipagem para a estrutura de dados de um ticket.
interface Ticket {
  id: number;
  assunto: string;
  lojista: string;
  status: 'aberto' | 'em progresso' | 'fechado';
  data: string;
}

const getStatusColorClass = (status: Ticket['status']) => {
  switch (status) {
    case 'aberto':
      return styles.statusAberto;
    case 'em progresso':
      return styles.statusEmProgresso;
    case 'fechado':
      return styles.statusFechado;
    default:
      return styles.statusDefault;
  }
};

const SuportePage: React.FC = () => {
  const supabase = createClientComponentClient();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('tickets_suporte')
        .select('*');
        // Você pode adicionar um .order('created_at', { ascending: false }) para ordenar por mais recentes

      if (error) {
        console.error('Erro ao buscar tickets:', error);
        setError('Não foi possível carregar os tickets.');
      } else {
        // Mapeamos os dados do banco para o formato do nosso componente
        setTickets(data.map(t => ({
          id: t.id,
          assunto: t.assunto,
          lojista: 'Nome do lojista aqui', // Placeholder: você precisará buscar essa informação
          status: t.status,
          data: new Date(t.created_at).toLocaleDateString(),
        })) as Ticket[]);
      }
      setLoading(false);
    };

    fetchTickets();
  }, []);

  if (loading) return <div className={styles.container}><p>Carregando tickets...</p></div>;
  if (error) return <div className={styles.container}><p>Erro: {error}</p></div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Central de Suporte</h2>
      <p className={styles.pageSubtitle}>
        Visualize e responda aos tickets de suporte e mensagens dos lojistas aqui.
      </p>

      {/* Tabela de Tickets de Suporte */}
      <div className={styles.tableContainer}>
        <table className={styles.ticketsTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Assunto</th>
              <th>Lojista</th>
              <th>Status</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr key={ticket.id}>
                <td>{ticket.id}</td>
                <td>{ticket.assunto}</td>
                <td>{ticket.lojista}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusColorClass(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td>{ticket.data}</td>
                <td>
                  <button
                    className={`${styles.button} ${styles.buttonPrimary}`}
                    onClick={() => alert(`Visualizando detalhes do Ticket #${ticket.id}`)}
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuportePage;