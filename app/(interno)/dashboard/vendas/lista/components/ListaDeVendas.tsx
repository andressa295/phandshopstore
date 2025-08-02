'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import './ListaDeVendas.css';

interface Venda {
  id: string;
  created_at: string;
  cliente: { nome: string } | null; // Ajustado para refletir seu join real
  valor_total: number;
  status: 'pendente' | 'pago' | 'cancelado' | 'enviado';
}

interface ListaDeVendasProps {
  initialVendas: Venda[];
}

const getStatusDisplayName = (status: Venda['status']): string => {
  switch (status) {
    case 'pendente': return 'Pendente';
    case 'pago': return 'Pago';
    case 'cancelado': return 'Cancelado';
    case 'enviado': return 'Enviado';
    default: return status;
  }
};

const ListaDeVendas: React.FC<ListaDeVendasProps> = ({ initialVendas }) => {
  const [todasVendas, setTodasVendas] = useState<Venda[]>(initialVendas);
  const [vendasFiltradas, setVendasFiltradas] = useState<Venda[]>(initialVendas);

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

  useEffect(() => {
    let vendas = [...todasVendas];

    // Filtro por termo (id, nome do cliente, status, valor)
    const termo = termoPesquisa.toLowerCase().trim();
    if (termo) {
      vendas = vendas.filter(venda =>
        venda.id.toLowerCase().includes(termo) ||
        venda.cliente?.nome.toLowerCase().includes(termo) ||
        getStatusDisplayName(venda.status).toLowerCase().includes(termo) ||
        venda.valor_total.toString().includes(termo)
      );
    }

    // Filtro por status
    if (filtroStatus) {
      vendas = vendas.filter(venda => venda.status === filtroStatus);
    }

    // Filtro por data
    const dataInicioObj = filtroDataInicio ? new Date(filtroDataInicio + 'T00:00:00') : null;
    const dataFimObj = filtroDataFim ? new Date(filtroDataFim + 'T23:59:59') : null;
    if (dataInicioObj || dataFimObj) {
      vendas = vendas.filter(venda => {
        const dataVenda = new Date(venda.created_at);
        if (dataInicioObj && dataVenda < dataInicioObj) return false;
        if (dataFimObj && dataVenda > dataFimObj) return false;
        return true;
      });
    }

    // Filtro por preço mínimo
    if (filtroPrecoMin !== '') {
      vendas = vendas.filter(venda => venda.valor_total >= Number(filtroPrecoMin));
    }

    // Filtro por preço máximo
    if (filtroPrecoMax !== '') {
      vendas = vendas.filter(venda => venda.valor_total <= Number(filtroPrecoMax));
    }

    // Ordenação
    vendas.sort((a, b) => {
      let valA: any = a[colunaOrdenacao];
      let valB: any = b[colunaOrdenacao];

      if (colunaOrdenacao === 'valor_total') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (colunaOrdenacao === 'created_at') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return direcaoOrdenacao === 'asc' ? -1 : 1;
      if (valA > valB) return direcaoOrdenacao === 'asc' ? 1 : -1;
      return 0;
    });

    setVendasFiltradas(vendas);
    setPaginaAtual(1);
  }, [termoPesquisa, filtroStatus, filtroDataInicio, filtroDataFim, filtroPrecoMin, filtroPrecoMax, todasVendas, colunaOrdenacao, direcaoOrdenacao]);

  const limparFiltros = () => {
    setTermoPesquisa('');
    setFiltroStatus('');
    setFiltroDataInicio('');
    setFiltroDataFim('');
    setFiltroPrecoMin('');
    setFiltroPrecoMax('');
  };

  const totalPaginas = Math.max(1, Math.ceil(vendasFiltradas.length / itensPorPagina));
  const startIndex = (paginaAtual - 1) * itensPorPagina;
  const vendasNaPagina = vendasFiltradas.slice(startIndex, startIndex + itensPorPagina);

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

  const handleAcaoEmMassa = (acao: string) => {
    if (vendasSelecionadas.length === 0) {
      alert('Nenhuma venda selecionada para esta ação.');
      return;
    }
    if (window.confirm(`Confirma a ação "${acao}" para ${vendasSelecionadas.length} venda(s)?`)) {
      // Aqui você pode chamar API para atualizar as vendas
      console.log(`Ação "${acao}" executada para vendas:`, vendasSelecionadas);
      setVendasSelecionadas([]);
      alert(`Ação "${acao}" concluída.`);
    }
  };

  const exportarCSV = () => {
    if (vendasFiltradas.length === 0) {
      alert('Nenhuma venda para exportar.');
      return;
    }
    const header = ['ID', 'Data', 'Cliente', 'Status', 'Valor Total'];
    const rows = vendasFiltradas.map(venda => [
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
            {vendasNaPagina.length === 0 ? (
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
            disabled={paginaAtual === totalPaginas}
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
