'use client';

import React from 'react';
import '@/app/globals.css';

// Tipagem para a estrutura de dados de um ticket.
interface Ticket {
  id: number;
  assunto: string;
  lojista: string;
  status: 'aberto' | 'em progresso' | 'fechado';
  data: string;
}

const ticketsSimulacao: Ticket[] = [
  { id: 101, assunto: 'Problema com o checkout', lojista: 'Loja A', status: 'aberto', data: '2023-07-28' },
  { id: 102, assunto: 'Dúvida sobre o plano Master', lojista: 'Loja B', status: 'em progresso', data: '2023-07-27' },
  { id: 103, assunto: 'Erro no upload de produtos', lojista: 'Loja C', status: 'fechado', data: '2023-07-25' },
  { id: 104, assunto: 'Erro 404 no subdomínio', lojista: 'Loja D', status: 'aberto', data: '2023-07-28' },
];

const getStatusColor = (status: Ticket['status']) => {
  switch (status) {
    case 'aberto':
      return 'red';
    case 'em progresso':
      return 'orange';
    case 'fechado':
      return 'var(--green-success)';
    default:
      return 'gray';
  }
};

const SuportePage: React.FC = () => {
  const buttonBaseStyle = {
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    transition: 'background-color 0.2s',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: 'var(--purple-main)', fontSize: '2rem', marginBottom: '1rem' }}>Central de Suporte</h2>
      <p style={{ color: 'var(--gray-dark-text)', marginBottom: '2rem' }}>
        Visualize e responda aos tickets de suporte e mensagens dos lojistas aqui.
      </p>

      {/* Tabela de Tickets de Suporte */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-light)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', fontWeight: '600' }}>ID</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Assunto</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Lojista</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Data</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {ticketsSimulacao.map((ticket) => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid var(--gray-medium)' }}>
                <td style={{ padding: '1rem' }}>{ticket.id}</td>
                <td style={{ padding: '1rem' }}>{ticket.assunto}</td>
                <td style={{ padding: '1rem' }}>{ticket.lojista}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    color: 'white',
                    background: getStatusColor(ticket.status),
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    textTransform: 'capitalize',
                  }}>
                    {ticket.status}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{ticket.data}</td>
                <td style={{ padding: '1rem' }}>
                  <button
                    style={{
                      ...buttonBaseStyle,
                      background: 'var(--purple-main)'
                    }}
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

