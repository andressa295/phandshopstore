'use client';

import React from 'react';

// Tipagem para a estrutura de dados de um lojista.
interface Lojista {
  id: number;
  nome: string;
  email: string;
  plano: string;
  status: 'ativo' | 'inativo' | 'pendente';
  dataCadastro: string;
}

const lojistasSimulacao: Lojista[] = [
  { id: 1, nome: 'Loja A', email: 'lojaA@email.com', plano: 'Master', status: 'ativo', dataCadastro: '2023-01-15' },
  { id: 2, nome: 'Loja B', email: 'lojaB@email.com', plano: 'Basic', status: 'ativo', dataCadastro: '2023-02-20' },
  { id: 3, nome: 'Loja C', email: 'lojaC@email.com', plano: 'Pro', status: 'inativo', dataCadastro: '2023-03-10' },
  { id: 4, nome: 'Loja D', email: 'lojaD@email.com', plano: 'Basic', status: 'pendente', dataCadastro: '2023-04-05' },
];

const getStatusColor = (status: Lojista['status']) => {
  switch (status) {
    case 'ativo':
      return 'var(--green-success)';
    case 'inativo':
      return 'red';
    case 'pendente':
      return 'orange';
    default:
      return 'gray';
  }
};

const UsuariosPage: React.FC = () => {
  // Estilo base para os botões de ação
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
      <h2 style={{ color: 'var(--purple-main)', fontSize: '2rem', marginBottom: '1rem' }}>Gerenciamento de Lojistas</h2>
      <p style={{ color: 'var(--gray-dark-text)', marginBottom: '2rem' }}>
        Aqui você pode visualizar, editar e gerenciar todos os lojistas cadastrados na plataforma.
      </p>

      {/* Tabela de Lojistas */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: 'var(--gray-light)', textAlign: 'left' }}>
              <th style={{ padding: '1rem', fontWeight: '600' }}>ID</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Nome</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>E-mail</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Plano</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Cadastro</th>
              <th style={{ padding: '1rem', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lojistasSimulacao.map((lojista) => (
              <tr key={lojista.id} style={{ borderBottom: '1px solid var(--gray-medium)' }}>
                <td style={{ padding: '1rem' }}>{lojista.id}</td>
                <td style={{ padding: '1rem' }}>{lojista.nome}</td>
                <td style={{ padding: '1rem' }}>{lojista.email}</td>
                <td style={{ padding: '1rem' }}>{lojista.plano}</td>
                <td style={{ padding: '1rem' }}>
                  <span style={{
                    color: 'white',
                    background: getStatusColor(lojista.status),
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.875rem',
                    fontWeight: '600'
                  }}>
                    {lojista.status.charAt(0).toUpperCase() + lojista.status.slice(1)}
                  </span>
                </td>
                <td style={{ padding: '1rem' }}>{lojista.dataCadastro}</td>
                <td style={{ padding: '1rem' }}>
                  <button style={{
                    ...buttonBaseStyle,
                    marginRight: '0.5rem',
                    background: 'var(--purple-main)'
                  }}>
                    Ver
                  </button>
                  <button style={{
                    ...buttonBaseStyle,
                    background: 'var(--gray-dark-text)'
                  }}>
                    Editar
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

export default UsuariosPage;
