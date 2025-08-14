'use client';
import React, { useState, useEffect } from 'react';
import styles from './Usuarios.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Tipagem para a estrutura de dados de um lojista.
interface Lojista {
  id: string;
  nome: string;
  email: string;
  plano: string;
  status: 'ativo' | 'inativo' | 'pendente';
  dataCadastro: string;
}

const getStatusColorClass = (status: Lojista['status']) => {
  switch (status) {
    case 'ativo':
      return styles.statusAtivo;
    case 'inativo':
      return styles.statusInativo;
    case 'pendente':
      return styles.statusPendente;
    default:
      return styles.statusDefault;
  }
};

const UsuariosPage: React.FC = () => {
  const supabase = createClientComponentClient();
  const [lojistas, setLojistas] = useState<Lojista[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLojistas = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('lojas')
        .select(`
          id,
          nome_loja,
          user_id,
          created_at,
          assinaturas(
            status,
            planos(
              nome_plano
            )
          )
        `);

      if (error) {
        console.error('Erro ao buscar lojistas:', error);
        setError('Não foi possível carregar os lojistas.');
      } else {
        const lojistasData: Lojista[] = await Promise.all(
          data.map(async (lojista: any) => {
            // Busca o email do usuário na tabela 'auth.users'
            const { data: userData } = await supabase.auth.admin.getUserById(lojista.user_id);
            const userEmail = userData?.user?.email || 'N/A';

            const assinaturaStatus = lojista.assinaturas?.[0]?.status || 'pendente';
            const planoNome = lojista.assinaturas?.[0]?.planos?.[0]?.nome_plano || 'N/A';

            return {
              id: lojista.id,
              nome: lojista.nome_loja,
              email: userEmail,
              plano: planoNome,
              status: assinaturaStatus === 'ativa' ? 'ativo' : 'inativo',
              dataCadastro: new Date(lojista.created_at).toLocaleDateString(),
            };
          })
        );
        setLojistas(lojistasData);
      }
      setLoading(false);
    };

    fetchLojistas();
  }, []);

  if (loading) return <div className={styles.container}><p>Carregando lojistas...</p></div>;
  if (error) return <div className={styles.container}><p>Erro: {error}</p></div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.pageTitle}>Gerenciamento de Lojistas</h2>
      <p className={styles.pageSubtitle}>
        Aqui você pode visualizar, editar e gerenciar todos os lojistas cadastrados na plataforma.
      </p>

      <div className={styles.tableContainer}>
        <table className={styles.lojistasTable}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Plano</th>
              <th>Status</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {lojistas.map((lojista) => (
              <tr key={lojista.id}>
                <td>{lojista.id}</td>
                <td>{lojista.nome}</td>
                <td>{lojista.email}</td>
                <td>{lojista.plano}</td>
                <td>
                  <span className={`${styles.statusBadge} ${getStatusColorClass(lojista.status)}`}>
                    {lojista.status.charAt(0).toUpperCase() + lojista.status.slice(1)}
                  </span>
                </td>
                <td>{lojista.dataCadastro}</td>
                <td>
                  <button className={`${styles.button} ${styles.buttonPrimary}`} onClick={() => alert(`Visualizando detalhes do Lojista #${lojista.id}`)}>
                    Ver
                  </button>
                  <button className={`${styles.button} ${styles.buttonSecondary}`} onClick={() => alert(`Editando Lojista #${lojista.id}`)}>
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