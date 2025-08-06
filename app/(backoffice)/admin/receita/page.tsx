'use client';

import React, { useState } from 'react';
import {
  MdAttachMoney,
  MdTrendingUp,
  MdTrendingDown,
  MdOutlinePaid,
  MdOutlineBarChart,
  MdOutlineInsights,
  MdPeopleAlt,
  MdOutlineCancel,
  MdOutlineChecklist,
} from 'react-icons/md';
import '@/app/globals.css';

const dadosReceita = {
  mesAtual: 120000,
  mesAnterior: 110000,
  totalAnual: 1450000,
  metaMensal: 150000,
  faturamentoComRepasse: 80000,
  usuariosPagantes: 320,
  cancelamentos: 20,
  planos: {
    gratuito: 5000, // Simulação de faturamento com plano gratuito (2.5% de comissão)
    basico: 40000,
    master: 60000,
    plus: 20000,
  },
  custosFixos: 30000,
  custosVariaveis: 15000,
  ticketMedio: 150.75, // Nova métrica
  taxaConversao: '3.5%', // Nova métrica
  detalhes: [
    { mes: 'Jan', valor: 110000 },
    { mes: 'Fev', valor: 115000 },
    { mes: 'Mar', valor: 120000 },
    { mes: 'Abr', valor: 125000 },
    { mes: 'Mai', valor: 130000 },
    { mes: 'Jun', valor: 135000 },
    { mes: 'Jul', valor: 120000 },
  ]
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

const ReceitaPage: React.FC = () => {
  const [periodo, setPeriodo] = useState<'mes' | 'ano'>('mes');

  const repasse = dadosReceita.faturamentoComRepasse * 0.15;
  const lucroLiquido = dadosReceita.mesAtual - repasse - dadosReceita.custosFixos - dadosReceita.custosVariaveis;
  const diferencaPercentual = (((dadosReceita.mesAtual - dadosReceita.mesAnterior) / dadosReceita.mesAnterior) * 100).toFixed(1);
  const metaAtingida = dadosReceita.mesAtual >= dadosReceita.metaMensal;
  const previsaoProximoMes = dadosReceita.mesAtual * 1.05;

  const cardStyle = {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
  };

  const grid = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  };

  const iconStyle = {
    marginRight: '0.5rem',
    verticalAlign: 'middle',
    color: 'var(--purple-main)',
  };

  const insightsListStyle = {
    listStyle: 'none',
    padding: 0,
    marginTop: '1rem',
  };

  const insightItemStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.75rem',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ fontSize: '2rem', color: 'var(--purple-main)' }}>Painel de Receita</h2>
      <p style={{ color: 'var(--gray-dark-text)', marginBottom: '2rem' }}>
        Visão estratégica da receita da plataforma.
      </p>

      {/* METRICS */}
      <div style={grid}>
        <div style={cardStyle}>
          <p><MdAttachMoney style={iconStyle} /> Receita Mês Atual</p>
          <strong>{formatCurrency(dadosReceita.mesAtual)}</strong>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            {parseFloat(diferencaPercentual) >= 0 ? <MdTrendingUp style={iconStyle} /> : <MdTrendingDown style={iconStyle} />}
            {diferencaPercentual}% vs mês anterior
          </p>
        </div>
        <div style={cardStyle}>
          <p><MdOutlinePaid style={iconStyle} /> Lucro Líquido</p>
          <strong>{formatCurrency(lucroLiquido)}</strong>
        </div>
        <div style={cardStyle}>
          <p><MdOutlineChecklist style={iconStyle} /> Meta Mensal</p>
          <strong style={{ color: metaAtingida ? 'green' : 'orange' }}>
            {metaAtingida ? 'Atingida' : 'Não atingida'}
          </strong>
          <p style={{ fontSize: '0.9rem', color: '#888' }}>
            {formatCurrency(dadosReceita.metaMensal)}
          </p>
        </div>
        <div style={cardStyle}>
          <p>Ticket Médio</p>
          <strong>{formatCurrency(dadosReceita.ticketMedio)}</strong>
        </div>
        <div style={cardStyle}>
          <p>Taxa de Conversão</p>
          <strong>{dadosReceita.taxaConversao}</strong>
        </div>
        <div style={cardStyle}>
          <p>Previsão Próximo Mês</p>
          <strong>{formatCurrency(previsaoProximoMes)}</strong>
        </div>
      </div>

      {/* RECEITA POR PLANO */}
      <div style={{ ...cardStyle, marginBottom: '2rem' }}>
        <h3><MdOutlineBarChart style={iconStyle} /> Receita por Plano</h3>
        {Object.entries(dadosReceita.planos).map(([nome, valor]) => (
          <div key={nome} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ textTransform: 'capitalize' }}>{nome}</span>
            <strong>{formatCurrency(valor)}</strong>
          </div>
        ))}
      </div>

      {/* MINI DRE */}
      <div style={{ ...cardStyle, marginBottom: '2rem' }}>
        <h3><MdAttachMoney style={iconStyle} /> Resumo Financeiro</h3>
        <div style={{ lineHeight: '2rem' }}>
          <p>Receita bruta: {formatCurrency(dadosReceita.mesAtual)}</p>
          <p>Repasse (15%): -{formatCurrency(repasse)}</p>
          <p>Custos fixos: -{formatCurrency(dadosReceita.custosFixos)}</p>
          <p>Custos variáveis: -{formatCurrency(dadosReceita.custosVariaveis)}</p>
          <p><strong>Lucro líquido: {formatCurrency(lucroLiquido)}</strong></p>
        </div>
      </div>

      {/* GRÁFICO */}
      <div style={{ ...cardStyle, marginBottom: '2rem' }}>
        <h3><MdOutlineBarChart style={iconStyle} /> Histórico Mensal</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', height: '200px', gap: '0.5rem' }}>
          {dadosReceita.detalhes.map((item, idx) => {
            const altura = (item.valor / dadosReceita.mesAtual) * 100;
            return (
              <div key={idx} style={{ textAlign: 'center', width: '40px' }}>
                <div style={{
                  height: `${altura}%`,
                  background: 'var(--purple-main)',
                  borderRadius: '8px 8px 0 0',
                }} />
                <span style={{ fontSize: '0.75rem', color: '#555' }}>{item.mes}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* USUÁRIOS PAGANTES E CHURN */}
      <div style={grid}>
        <div style={cardStyle}>
          <p><MdPeopleAlt style={iconStyle} /> Usuários Pagantes</p>
          <strong>{dadosReceita.usuariosPagantes}</strong>
        </div>
        <div style={cardStyle}>
          <p><MdOutlineCancel style={iconStyle} /> Cancelamentos</p>
          <strong style={{ color: 'red' }}>{dadosReceita.cancelamentos}</strong>
        </div>
      </div>

      {/* INSIGHTS */}
      <div style={{ ...cardStyle, marginTop: '2rem' }}>
        <h3><MdOutlineInsights style={iconStyle} /> Insights Automáticos</h3>
        <ul style={insightsListStyle}>
          <li style={insightItemStyle}>
            <MdAttachMoney style={{ ...iconStyle, color: 'var(--green-success)' }} />
            Plano Master teve o maior faturamento do mês.
          </li>
          <li style={insightItemStyle}>
            <MdOutlineCancel style={{ ...iconStyle, color: 'red' }} />
            Cancelamentos aumentaram 25% vs mês anterior.
          </li>
          <li style={insightItemStyle}>
            <MdTrendingUp style={{ ...iconStyle, color: 'var(--green-success)' }} />
            Crescimento médio mensal: 4,5%.
          </li>
          <li style={insightItemStyle}>
            <MdAttachMoney style={iconStyle} />
            Projeção: {formatCurrency(previsaoProximoMes)} no próximo mês.
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ReceitaPage;
