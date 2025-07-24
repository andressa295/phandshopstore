'use client';

import React, { useState, useEffect } from 'react';
import './components/ListaDeVendas.css'; // Caminho relativo correto para o CSS

// Interface para um objeto de venda (atualizada com todos os tipos de status)
interface Venda {
  id: string;
  data: string;
  cliente: string;
  status: 'concluida' | 'pendente' | 'cancelada' | 'em_processamento' | 'enviada' | 'entregue' | 'separando' | 'confeccao' | 'fabricacao' | 'arquivado';
  total: number;
  pagamento: string;
}

// Dados mockados para simular uma API
const mockVendas: Venda[] = [
  { id: '1001', data: '2025-06-21 14:30', cliente: 'Ana Paula', status: 'concluida', total: 250.00, pagamento: 'PIX' },
  { id: '1002', data: '2025-06-21 11:00', cliente: 'Bruno Mendes', status: 'pendente', total: 50.00, pagamento: 'Boleto' },
  { id: '1003', data: '2025-06-20 09:15', cliente: 'Carla Dias', status: 'cancelada', total: 120.00, pagamento: 'Cartão de Crédito' },
  { id: '1004', data: '2025-06-19 16:45', cliente: 'Daniel Costa', status: 'concluida', total: 300.00, pagamento: 'Cartão de Crédito' },
  { id: '1005', data: '2025-06-19 10:00', cliente: 'Eduardo Lima', status: 'separando', total: 80.00, pagamento: 'PIX' },
  { id: '1006', data: '2025-06-18 13:00', cliente: 'Fernanda Rocha', status: 'pendente', total: 180.00, pagamento: 'Boleto' },
  { id: '1007', data: '2025-06-17 08:30', cliente: 'Gabriel Souza', status: 'concluida', total: 45.00, pagamento: 'PIX' },
  { id: '1008', data: '2025-06-16 17:00', cliente: 'Helena Pires', status: 'confeccao', total: 99.90, pagamento: 'Cartão de Crédito' },
  { id: '1009', data: '2025-06-15 12:00', cliente: 'Igor Santos', status: 'enviada', total: 75.00, pagamento: 'PIX' },
  { id: '1010', data: '2025-06-14 10:00', cliente: 'Juliana Oliveira', status: 'entregue', total: 220.00, pagamento: 'Cartão de Crédito' },
  { id: '1011', data: '2025-06-13 15:00', cliente: 'Kleber Nogueira', status: 'fabricacao', total: 60.00, pagamento: 'Boleto' },
  { id: '1012', data: '2025-06-12 11:30', cliente: 'Laura Vianna', status: 'concluida', total: 350.00, pagamento: 'PIX' },
  { id: '1013', data: '2025-06-11 09:00', cliente: 'Marcelo Gomes', status: 'pendente', total: 110.00, pagamento: 'Cartão de Crédito' },
  { id: '1014', data: '2025-06-10 14:00', cliente: 'Natalia Castro', status: 'concluida', total: 190.00, pagamento: 'Boleto' },
  { id: '1015', data: '2025-06-09 16:00', cliente: 'Otavio Pereira', status: 'arquivado', total: 280.00, pagamento: 'PIX' },
];

// Função auxiliar para obter o nome de exibição do status
const getStatusDisplayName = (status: Venda['status']): string => {
  switch (status) {
    case 'concluida': return 'Concluída';
    case 'pendente': return 'Pendente';
    case 'cancelada': return 'Cancelada';
    case 'em_processamento': return 'Em Processamento';
    case 'enviada': return 'Enviada';
    case 'entregue': return 'Entregue';
    case 'separando': return 'Separando Pedido';
    case 'confeccao': return 'Em Confecção';
    case 'fabricacao': return 'Em Fabricação';
    case 'arquivado': return 'Arquivado';
    default: return status;
  }
};

// Renomeando a função para VendasListaPage para refletir que é o componente da página
const VendasListaPage: React.FC = () => {
  const [todasVendas, setTodasVendas] = useState<Venda[]>([]);
  const [vendasFiltradas, setVendasFiltradas] = useState<Venda[]>([]);
  const [termoPesquisa, setTermoPesquisa] = useState<string>('');
  const [filtroStatus, setFiltroStatus] = useState<Venda['status'] | ''>('');
  const [filtroPagamento, setFiltroPagamento] = useState<string>('');
  const [filtroDataInicio, setFiltroDataInicio] = useState<string>('');
  const [filtroDataFim, setFiltroDataFim] = useState<string>('');
  const [filtroCliente, setFiltroCliente] = useState<string>('');
  const [filtroPrecoMin, setFiltroPrecoMin] = useState<number | ''>('');
  const [filtroPrecoMax, setFiltroPrecoMax] = useState<number | ''>('');

  const [paginaAtual, setPaginaAtual] = useState<number>(1);
  const [itensPorPagina, setItensPorPagina] = useState<number>(10);
  const [colunaOrdenacao, setColunaOrdenacao] = useState<keyof Venda | null>(null);
  const [direcaoOrdenacao, setDirecaoOrdenacao] = useState<'asc' | 'desc'>('asc');

  const [vendasSelecionadas, setVendasSelecionadas] = useState<string[]>([]);

  useEffect(() => {
    setTodasVendas(mockVendas);
    aplicarFiltros();
  }, []);

  useEffect(() => {
    aplicarFiltros();
    setVendasSelecionadas([]);
  }, [termoPesquisa, filtroStatus, filtroPagamento, filtroDataInicio, filtroDataFim, filtroCliente, filtroPrecoMin, filtroPrecoMax, todasVendas]);

  const aplicarFiltros = () => {
    let vendasAtuais = [...todasVendas];

    const termo = termoPesquisa.toLowerCase().trim();
    if (termo) {
      vendasAtuais = vendasAtuais.filter(venda =>
        venda.id.toLowerCase().includes(termo) ||
        venda.cliente.toLowerCase().includes(termo) ||
        venda.pagamento.toLowerCase().includes(termo)
      );
    }

    if (filtroStatus) {
      vendasAtuais = vendasAtuais.filter(venda => venda.status === filtroStatus);
    }

    if (filtroPagamento) {
      vendasAtuais = vendasAtuais.filter(venda => venda.pagamento === filtroPagamento);
    }

    const dataInicioObj = filtroDataInicio ? new Date(filtroDataInicio + 'T00:00:00') : null;
    const dataFimObj = filtroDataFim ? new Date(filtroDataFim + 'T23:59:59') : null;

    if (dataInicioObj || dataFimObj) {
      vendasAtuais = vendasAtuais.filter(venda => {
        const dataVenda = new Date(venda.data);
        let match = true;
        if (dataInicioObj && dataVenda < dataInicioObj) match = false;
        if (dataFimObj && dataVenda > dataFimObj) match = false;
        return match;
      });
    }

    const clienteTermo = filtroCliente.toLowerCase().trim();
    if (clienteTermo) {
      vendasAtuais = vendasAtuais.filter(venda =>
        venda.cliente.toLowerCase().includes(clienteTermo)
      );
    }

    if (filtroPrecoMin !== '' && !isNaN(Number(filtroPrecoMin))) {
      vendasAtuais = vendasAtuais.filter(venda => venda.total >= Number(filtroPrecoMin));
    }
    if (filtroPrecoMax !== '' && !isNaN(Number(filtroPrecoMax))) {
      vendasAtuais = vendasAtuais.filter(venda => venda.total <= Number(filtroPrecoMax));
    }

    setVendasFiltradas(vendasAtuais);
    setPaginaAtual(1);
  };

  const limparFiltros = () => {
    setTermoPesquisa('');
    setFiltroStatus('');
    setFiltroPagamento('');
    setFiltroDataInicio('');
    setFiltroDataFim('');
    setFiltroCliente('');
    setFiltroPrecoMin('');
    setFiltroPrecoMax('');
    setVendasSelecionadas([]);
  };

  const handleSort = (coluna: keyof Venda) => {
    const novaDirecao = colunaOrdenacao === coluna && direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    setColunaOrdenacao(coluna);
    setDirecaoOrdenacao(novaDirecao);

    const vendasOrdenadas = [...vendasFiltradas].sort((a, b) => {
      let valA: any = a[coluna];
      let valB: any = b[coluna];

      if (coluna === 'total') {
        valA = Number(valA);
        valB = Number(valB);
      } else if (coluna === 'data') {
        valA = new Date(valA as string).getTime();
        valB = new Date(valB as string).getTime();
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return novaDirecao === 'asc' ? -1 : 1;
      if (valA > valB) return novaDirecao === 'asc' ? 1 : -1;
      return 0;
    });
    setVendasFiltradas(vendasOrdenadas);
  };

  const totalPaginas = Math.ceil(vendasFiltradas.length / itensPorPagina);
  const startIndex = (paginaAtual - 1) * itensPorPagina;
  const endIndex = startIndex + itensPorPagina;
  const vendasNaPagina = vendasFiltradas.slice(startIndex, endIndex);

  const goToPrevPage = () => setPaginaAtual(prev => Math.max(1, prev - 1));
  const goToNextPage = () => setPaginaAtual(prev => Math.min(totalPaginas, prev + 1));
  const handleItensPorPaginaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setItensPorPagina(Number(e.target.value));
    setPaginaAtual(1);
  };

  const handleSelecionarVenda = (id: string, isChecked: boolean) => {
    if (isChecked) {
      setVendasSelecionadas(prev => [...prev, id]);
    } else {
      setVendasSelecionadas(prev => prev.filter(saleId => saleId !== id));
    }
  };

  const handleSelecionarTodasNaPagina = (isChecked: boolean) => {
    if (isChecked) {
      const idsNaPagina = vendasNaPagina.map(venda => venda.id);
      setVendasSelecionadas(prev => [...new Set([...prev, ...idsNaPagina])]);
    } else {
      const idsNaPagina = vendasNaPagina.map(venda => venda.id);
      setVendasSelecionadas(prev => prev.filter(saleId => !idsNaPagina.includes(saleId)));
    }
  };

  const todasNaPaginaSelecionadas = vendasNaPagina.length > 0 &&
    vendasNaPagina.every(venda => vendasSelecionadas.includes(venda.id));

  const handleAcaoEmMassa = (acao: string) => {
    if (vendasSelecionadas.length === 0) {
      alert('Nenhuma venda selecionada para esta ação.');
      return;
    }
    const confirmacao = window.confirm(`Tem certeza que deseja "${acao}" ${vendasSelecionadas.length} venda(s)?`);
    if (confirmacao) {
      console.log(`Executando ação "${acao}" para as vendas:`, vendasSelecionadas);
      setVendasSelecionadas([]);
      alert(`Ação "${acao}" concluída para as vendas selecionadas.`);
    }
  };


  const exportarCSV = () => {
    const headers = ["ID da Venda", "Data", "Cliente", "Status", "Total", "Pagamento"];
    const rows = vendasFiltradas.map(venda => [
      `"${venda.id}"`,
      `"${venda.data}"`,
      `"${venda.cliente}"`,
      `"${getStatusDisplayName(venda.status)}"`,
      `"${venda.total.toFixed(2)}"`,
      `"${venda.pagamento}"`
    ]);

    let csvContent = "data:text/csv;charset=utf-8,"
      + headers.join(",") + "\n"
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lista_de_vendas.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  // FUNÇÃO CORRIGIDA PARA NAVEGAR PARA DETALHES DO PRODUTO (Next.js App Router path)
  const handleVerDetalhes = (id: string) => {
    // Este caminho aponta para: app/(interno)/dashboard/produtos/detalhes/page.tsx
    // O 'id' na query string permite que a página de detalhes saiba qual produto carregar
    window.location.href = `/dashboard/produtos/detalhes?id=${id}`;
  };

  return (
    <div className="lista-vendas-container">
      <h1>Lista de Vendas</h1>

      {/* Pesquisa e Filtros */}
      <div className="filter-section">
        <input
          type="text"
          placeholder="Pesquisar por ID, Cliente ou Produto..."
          value={termoPesquisa}
          onChange={(e) => setTermoPesquisa(e.target.value)}
        />

        <div className="filters-grid">
          {/* Atualizado com os novos status, incluindo 'Arquivados' */}
          <select value={filtroStatus} onChange={(e) => setFiltroStatus(e.target.value as Venda['status'])}>
            <option value="">Todos os Status</option>
            <option value="concluida">Concluída</option>
            <option value="pendente">Pendente</option>
            <option value="cancelada">Cancelada</option> {/* Mantido 'Cancelada' para display, mas o 'value' é o que importa */}
            <option value="em_processamento">Em Processamento</option>
            <option value="enviada">Enviada</option>
            <option value="entregue">Entregue</option>
            <option value="separando">Separando Pedido</option>
            <option value="confeccao">Em Confecção</option>
            <option value="fabricacao">Em Fabricação</option>
            <option value="arquivado">Arquivados</option>
          </select>

          <select value={filtroPagamento} onChange={(e) => setFiltroPagamento(e.target.value)}>
            <option value="">Todas as Formas Pgto.</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Boleto">Boleto</option>
            <option value="PIX">PIX</option>
          </select>

          <input
            type="date"
            value={filtroDataInicio}
            onChange={(e) => setFiltroDataInicio(e.target.value)}
          />
          <input
            type="date"
            value={filtroDataFim}
            onChange={(e) => setFiltroDataFim(e.target.value)}
          />

          <input
            type="text"
            placeholder="Filtrar por Cliente"
            value={filtroCliente}
            onChange={(e) => setFiltroCliente(e.target.value)}
          />
          <input
            type="number"
            placeholder="Valor Mínimo"
            value={filtroPrecoMin}
            onChange={(e) => setFiltroPrecoMin(e.target.value === '' ? '' : Number(e.target.value))}
          />
          <input
            type="number"
            placeholder="Valor Máximo"
            value={filtroPrecoMax}
            onChange={(e) => setFiltroPrecoMax(e.target.value === '' ? '' : Number(e.target.value))}
          />

          <button onClick={aplicarFiltros}>Aplicar Filtros</button>
          <button onClick={limparFiltros}>Limpar Filtros</button>
          {/* BOTÃO EXPORTAR MOVIDO PARA AQUI, DENTRO DO FILTERS-GRID */}
          <button className="export-btn" onClick={exportarCSV}>Exportar para CSV</button>
        </div>

        {/* SEÇÃO DE AÇÕES EM MASSA: Visível apenas se houver vendas selecionadas */}
        {vendasSelecionadas.length > 0 && (
          <div className="bulk-actions">
            <span>{vendasSelecionadas.length} venda(s) selecionada(s)</span>
            <select
                onChange={(e) => handleAcaoEmMassa(e.target.value)}
                value="" /* Reset após seleção para permitir re-selecionar a mesma ação */
                className="bulk-action-select"
            >
                <option value="">Escolha uma ação</option>
                <option value="arquivar">Arquivar</option>
                <option value="reabrir">Reabrir Pedido</option>
                <option value="marcar_paga">Marcar como Paga</option>
                <option value="cancelar">Cancelar Pedido</option>
                <optgroup label="Alterar Status para:">
                    <option value="separando">Separando Pedido</option>
                    <option value="confeccao">Em Confecção</option>
                    <option value="fabricacao">Em Fabricação</option>
                    <option value="enviada">Enviada</option>
                    <option value="entregue">Entregue</option>
                    <option value="pendente">Pendente</option>
                    <option value="concluida">Concluída</option>
                </optgroup>
            </select>
          </div>
        )}
      </div>

      {/* Tabela de Vendas */}
      <div className="sales-table-container">
        <table>
          <thead>
            <tr>
              {/* Checkbox para selecionar todas as vendas na página */}
              <th>
                <input
                  type="checkbox"
                  checked={todasNaPaginaSelecionadas}
                  onChange={(e) => handleSelecionarTodasNaPagina(e.target.checked)}
                />
              </th>
              <th onClick={() => handleSort('id')}>ID da Venda {colunaOrdenacao === 'id' && (direcaoOrdenacao === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('data')}>Data {colunaOrdenacao === 'data' && (direcaoOrdenacao === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('cliente')}>Cliente {colunaOrdenacao === 'cliente' && (direcaoOrdenacao === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('status')}>Status {colunaOrdenacao === 'status' && (direcaoOrdenacao === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('total')}>Total {colunaOrdenacao === 'total' && (direcaoOrdenacao === 'asc' ? '▲' : '▼')}</th>
              <th onClick={() => handleSort('pagamento')}>Pagamento {colunaOrdenacao === 'pagamento' && (direcaoOrdenacao === 'asc' ? '▲' : '▼')}</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendasNaPagina.length === 0 ? (
              <tr>
                {/* Colspan ajustado para 9, considerando a nova coluna de checkbox */}
                <td colSpan={9} style={{ textAlign: 'center' }}>Nenhuma venda encontrada.</td>
              </tr>
            ) : (
              vendasNaPagina.map(venda => (
                <tr key={venda.id}>
                  {/* Checkbox para seleção individual */}
                  <td>
                    <input
                      type="checkbox"
                      checked={vendasSelecionadas.includes(venda.id)}
                      onChange={(e) => handleSelecionarVenda(venda.id, e.target.checked)}
                    />
                  </td>
                  {/* data-label para responsividade da tabela */}
                  <td data-label="ID da Venda">#{venda.id}</td>
                  <td data-label="Data">{venda.data}</td>
                  <td data-label="Cliente">{venda.cliente}</td>
                  <td data-label="Status"><span className={`status-badge ${venda.status}`}>{getStatusDisplayName(venda.status)}</span></td>
                  <td data-label="Total">{`R$ ${venda.total.toFixed(2).replace('.', ',')}`}</td>
                  <td data-label="Pagamento">{venda.pagamento}</td>
                  <td data-label="Ações">
                    <button className="view-details-btn" onClick={() => handleVerDetalhes(venda.id)}>
                      Ver Detalhes
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação (o botão de exportar foi movido, agora só a paginação aqui) */}
      <div className="table-footer">
        <div className="pagination">
          <button onClick={goToPrevPage} disabled={paginaAtual === 1}>Anterior</button>
          <span>{paginaAtual}</span> / <span>{totalPaginas === 0 ? 1 : totalPaginas}</span>
          <button onClick={goToNextPage} disabled={paginaAtual === totalPaginas || totalPaginas === 0}>Próxima</button>
          <select value={itensPorPagina} onChange={handleItensPorPaginaChange}>
            <option value={10}>10 por página</option>
            <option value={25}>25 por página</option>
            <option value={50}>50 por página</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default VendasListaPage; // Exportando como VendasListaPage