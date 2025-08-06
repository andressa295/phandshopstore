'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import './ListaDeVendas.css';
import Modal from '../../detalhes/components/Modal';
import ConfirmModal from '../../detalhes/components/ConfirmModal';
import Toast from '../../detalhes/components/Toast'; // Adicionando import para o Toast

interface Cliente {
  nome: string;
}

interface Venda {
  id: string;
  created_at: string;
  cliente: Cliente | null;
  valor_total: number;
  status: 'pendente' | 'pago' | 'cancelado' | 'enviado' | 'entregue' | 'separando' | 'confeccao' | 'fabricacao' | 'arquivado';
}

interface ListaDeVendasProps {
  lojaId: string;
  initialVendas: Venda[];
}

const getStatusDisplayName = (status: Venda['status']): string => {
  switch (status) {
    case 'pendente': return 'Pendente';
    case 'pago': return 'Pago';
    case 'cancelado': return 'Cancelado';
    case 'enviado': return 'Enviado';
    case 'arquivado': return 'Arquivado';
    case 'entregue': return 'Entregue';
    case 'separando': return 'Separando Pedido';
    case 'confeccao': return 'Em Confecção';
    case 'fabricacao': return 'Em Fabricação';
    default: return status;
  }
};

const ListaDeVendas: React.FC<ListaDeVendasProps> = ({ lojaId, initialVendas }) => {
  const supabase = createClientComponentClient();
  const [vendas, setVendas] = useState<Venda[]>(initialVendas);
  const [loading, setLoading] = useState(false);
  const [totalVendas, setTotalVendas] = useState(0);

  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [filtroStatus, setFiltroStatus] = useState<Venda['status'] | ''>('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
  const [filtroPrecoMin, setFiltroPrecoMin] = useState<number | ''>('');
  const [filtroPrecoMax, setFiltroPrecoMax] = useState<number | ''>('');
  
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [itensPorPagina, setItensPorPagina] = useState(10);
  const [colunaOrdenacao, setColunaOrdenacao] = useState<keyof Venda>('created_at');
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState<'desc' | 'asc'>('desc');

  const [vendasSelecionadas, setVendasSelecionadas] = useState<string[]>([]);
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalData, setConfirmModalData] = useState<{ title: string; message: string; onConfirm: () => void; confirmText?: string; } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' | 'warning' } | null>(null);

  const openConfirmModal = useCallback((title: string, message: string, onConfirm: () => void, confirmText?: string) => {
    setConfirmModalData({ title, message, onConfirm, confirmText });
    setIsConfirmModalOpen(true);
  }, []);
  
  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' | 'warning') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);
  
  const fetchVendas = async () => {
    setLoading(true);

    let query = supabase.from('vendas')
      .select('id, created_at, valor_total, status, cliente:clientes(nome)', { count: 'exact' })
      .eq('loja_id', lojaId)
      .order(colunaOrdenacao, { ascending: direcaoOrdenacao === 'asc' });

    if (termoPesquisa) {
      query = query.or(`id.ilike.%${termoPesquisa}%,cliente.nome.ilike.%${termoPesquisa}%`);
    }
    if (filtroStatus) {
      query = query.eq('status', filtroStatus);
    }
    if (filtroDataInicio) {
      query = query.gte('created_at', filtroDataInicio);
    }
    if (filtroDataFim) {
      query = query.lte('created_at', filtroDataFim);
    }
    if (filtroPrecoMin !== '') {
      query = query.gte('valor_total', filtroPrecoMin);
    }
    if (filtroPrecoMax !== '') {
      query = query.lte('valor_total', filtroPrecoMax);
    }

    const from = (paginaAtual - 1) * itensPorPagina;
    const to = from + itensPorPagina - 1;

    const { data, error, count } = await query.range(from, to);

    if (error) {
      console.error('Erro ao buscar vendas:', error);
      showToast('Ocorreu um erro ao buscar as vendas.', 'error');
    } else {
      const formattedData = (data as any[] ?? []).map(venda => ({
        ...venda,
        cliente: Array.isArray(venda.cliente) && venda.cliente.length > 0 ? venda.cliente[0] : null
      }));
      setVendas(formattedData as Venda[] ?? []);
      setTotalVendas(count ?? 0);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVendas();
  }, [lojaId, termoPesquisa, filtroStatus, filtroDataInicio, filtroDataFim, filtroPrecoMin, filtroPrecoMax, paginaAtual, itensPorPagina, colunaOrdenacao, direcaoOrdenacao]);

  const limparFiltros = () => {
    setTermoPesquisa('');
    setFiltroStatus('');
    setFiltroDataInicio('');
    setFiltroDataFim('');
    setFiltroPrecoMin('');
    setFiltroPrecoMax('');
    setPaginaAtual(1);
    setItensPorPagina(10);
    setColunaOrdenacao('created_at');
    setDirecaoOrdenacao('desc');
  };

  const totalPaginas = Math.ceil(totalVendas / itensPorPagina);
  const vendasNaPagina = vendas;
  
  const todasNaPaginaSelecionadas = vendasNaPagina.length > 0 &&
      vendasNaPagina.every(venda => vendasSelecionadas.includes(venda.id));
  
  const handleSelecionarVenda = (id: string, isChecked: boolean) => {
      if (isChecked) {
        setVendasSelecionadas(prev => [...prev, id]);
      } else {
        setVendasSelecionadas(prev => prev.filter(vendaId => vendaId !== id));
      }
  };
  
  const handleSelecionarTodasNaPagina = (isChecked: boolean) => {
      const idsNaPagina = vendasNaPagina.map(venda => venda.id);
      if (isChecked) {
        setVendasSelecionadas(prev => [...new Set([...prev, ...idsNaPagina])]);
      } else {
        setVendasSelecionadas(prev => prev.filter(id => !idsNaPagina.includes(id)));
      }
  };
  
  const handleSort = (coluna: keyof Venda) => {
      const novaDirecao = colunaOrdenacao === coluna && direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
      setColunaOrdenacao(coluna);
      setDirecaoOrdenacao(novaDirecao);
  };
  
  const handleAcaoEmMassa = async (acao: string) => {
      if (vendasSelecionadas.length === 0) {
        showToast('Nenhuma venda selecionada para esta ação.', 'warning');
        return;
      }
      
      openConfirmModal(
        'Confirmar Ação em Massa',
        `Confirma a ação "${acao.replace('marcar_', '')}" para ${vendasSelecionadas.length} venda(s)?`,
        async () => {
          setLoading(true);
          const { error } = await supabase
            .from('vendas')
            .update({ status: acao.replace('marcar_', '') as Venda['status'] })
            .in('id', vendasSelecionadas);
          
          if (error) {
            console.error(`Erro ao executar a ação em massa "${acao}":`, error);
            showToast('Ocorreu um erro ao executar a ação.', 'error');
          } else {
            console.log(`Ação "${acao}" executada para vendas:`, vendasSelecionadas);
            showToast(`Ação "${acao}" concluída.`, 'success');
            setVendasSelecionadas([]);
            fetchVendas();
          }
          setLoading(false);
        }
      );
  };
  
  const exportarCSV = () => {
      if (vendasNaPagina.length === 0) {
        showToast('Nenhuma venda para exportar.', 'info');
        return;
      }
      const header = ['ID', 'Data', 'Cliente', 'Status', 'Valor Total'];
      const rows = vendasNaPagina.map(venda => [
        venda.id,
        new Date(venda.created_at).toLocaleDateString(),
        venda.cliente?.nome ?? 'N/A',
        getStatusDisplayName(venda.status),
        venda.valor_total.toFixed(2).replace('.', ','),
      ]);
  
      const csvContent =
        'data:text/csv;charset=utf-8,' +
        [header, ...rows].map(e => e.join(';')).join('\n');
  
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `vendas_export_${Date.now()}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="lista-vendas-container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {confirmModalData && (
        <ConfirmModal
            isOpen={isConfirmModalOpen}
            onClose={() => setIsConfirmModalOpen(false)}
            onConfirm={confirmModalData.onConfirm}
            title={confirmModalData.title}
            message={confirmModalData.message}
            confirmText={confirmModalData.confirmText}
        />
      )}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Pesquisar por ID, cliente, status ou valor..."
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
          autoComplete="off"
        />
        <div className="filters-grid">
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value as Venda['status'] | '')}
          >
            <option value="">Todos os Status</option>
            <option value="pendente">Pendente</option>
            <option value="pago">Pago</option>
            <option value="cancelado">Cancelado</option>
            <option value="enviado">Enviado</option>
            <option value="arquivado">Arquivado</option>
          </select>
          <input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
            placeholder="Data Início"
          />
          <input
            type="date"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
            placeholder="Data Fim"
          />
          <input
            type="number"
            min={0}
            step={0.01}
            value={filtroPrecoMin}
            onChange={(e) => setFiltroPrecoMin(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Preço Mínimo"
          />
          <input
            type="number"
            min={0}
            step={0.01}
            value={filtroPrecoMax}
            onChange={(e) => setFiltroPrecoMax(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="Preço Máximo"
          />
          <button onClick={limparFiltros}>Limpar Filtros</button>
          <button className="export-btn" onClick={exportarCSV}>Exportar para CSV</button>
        </div>
      </div>
      {vendasSelecionadas.length > 0 && (
          <div className="bulk-actions">
              <span>{vendasSelecionadas.length} venda(s) selecionada(s)</span>
              <select
                  onChange={(e) => handleAcaoEmMassa(e.target.value)}
                  value=""
                  className="bulk-action-select"
              >
                  <option value="">Escolha uma ação</option>
                  <option value="arquivar">Arquivar</option>
                  <option value="marcar_paga">Marcar como Paga</option>
                  <option value="cancelar">Cancelar Pedido</option>
              </select>
          </div>
      )}
      <div className="sales-table-container">
        <table>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={todasNaPaginaSelecionadas}
                  onChange={(e) => handleSelecionarTodasNaPagina(e.target.checked)}
                />
              </th>
              <th onClick={() => handleSort('id')}>ID do Pedido</th>
              <th onClick={() => handleSort('created_at')}>Data</th>
              <th>Cliente</th>
              <th onClick={() => handleSort('status')}>Status</th>
              <th onClick={() => handleSort('valor_total')}>Total</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>Carregando vendas...</td>
              </tr>
            ) : vendasNaPagina.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center' }}>Nenhuma venda encontrada.</td>
              </tr>
            ) : (
              vendasNaPagina.map(venda => (
                <tr key={venda.id}>
                  <td>
                    <input
                      type="checkbox"
                      checked={vendasSelecionadas.includes(venda.id)}
                      onChange={(e) => handleSelecionarVenda(venda.id, e.target.checked)}
                    />
                  </td>
                  <td>#{venda.id.substring(0, 8)}...</td>
                  <td>{new Date(venda.created_at).toLocaleDateString()}</td>
                  <td>{venda.cliente?.nome ?? 'N/A'}</td>
                  <td>
                    <span className={`status-text ${venda.status}`}>
                      {getStatusDisplayName(venda.status)}
                    </span>
                  </td>
                  <td>{`R$ ${venda.valor_total.toFixed(2).replace('.', ',')}`}</td>
                  <td>
                      <Link href={`/dashboard/vendas/detalhes/${venda.id}`}>
                        <button className="view-details-btn">Ver Detalhes</button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
          </tbody>
        </table>
      </div>
      <div className="table-footer">
        <div className="pagination">
          <button onClick={() => setPaginaAtual(prev => Math.max(prev - 1, 1))} disabled={paginaAtual === 1}>
            Anterior
          </button>
          <span>{paginaAtual}</span> / <span>{totalPaginas}</span>
          <button
            onClick={() => setPaginaAtual(prev => Math.min(prev + 1, totalPaginas))}
            disabled={paginaAtual >= totalPaginas}
          >
            Próxima
          </button>
          <select value={itensPorPagina} onChange={(e) => { setItensPorPagina(Number(e.target.value)); setPaginaAtual(1); }}>
            <option value={10}>10 por página</option>
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
      </div>
    </div>
  );
};
 
export default ListaDeVendas;
