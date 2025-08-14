// lib/supabase/dashboard/getDashboardData.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { PostgrestError } from '@supabase/supabase-js';

// CORRIGIDO: Interface DashboardData com todas as propriedades necessárias
export interface DashboardData {
  mesAtual: number;
  mesAnterior: number;
  faturamentoBruto: number;
  faturamentoPendente: number;
  totalLojistas: number;
  novosCadastrosSemana: number;
  ticketsAbertos: number;
  taxaDeChurn: string;
  sistemaStatus: string;
  notificacoesPendentes: number;
  vendasHoje: number;
  visitantesHoje: number;
  ticketMedio: number;
  taxaConversao: string;
  custosFixos: number;
  custosVariaveis: number;
  detalhes: { mes: string; valor: number }[];
  vendasSemanaisGrafico: { name: string; vendas: number }[];
  metaMensal: number;
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const supabase = createServerComponentClient({ cookies });

  try {
    // Dados simulados para as métricas que não temos tabelas
    const simulatedData = {
      mesAtual: 120000,
      mesAnterior: 110000,
      faturamentoBruto: 350000,
      faturamentoPendente: 15000,
      totalLojistas: 124,
      novosCadastrosSemana: 12,
      ticketsAbertos: 8,
      taxaDeChurn: '2.5%',
      sistemaStatus: 'Operacional',
      notificacoesPendentes: 3,
      vendasHoje: 1200,
      visitantesHoje: 500,
      ticketMedio: 150.75,
      taxaConversao: '3.5%',
      custosFixos: 30000,
      custosVariaveis: 15000,
      detalhes: [
        { mes: 'Jan', valor: 110000 },
        { mes: 'Fev', valor: 115000 },
        { mes: 'Mar', valor: 120000 },
        { mes: 'Abr', valor: 125000 },
        { mes: 'Mai', valor: 130000 },
        { mes: 'Jun', valor: 135000 },
        { mes: 'Jul', valor: 120000 },
      ],
      vendasSemanaisGrafico: [
        { name: 'Seg', vendas: 5000 },
        { name: 'Ter', vendas: 7000 },
        { name: 'Qua', vendas: 6500 },
        { name: 'Qui', vendas: 9000 },
        { name: 'Sex', vendas: 12000 },
        { name: 'Sáb', vendas: 11000 },
        { name: 'Dom', vendas: 13000 },
      ],
      metaMensal: 150000,
    };
    
    return {
      ...simulatedData,
    };

  } catch (error) {
    console.error('Erro inesperado em getDashboardData:', error);
    return null;
  }
}

function gerarGraficoSemanal(vendas: any[], hoje: Date): DashboardData['vendasSemanaisGrafico'] {
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const vendasPorDia: { [key: string]: number } = {};
    
    for (let i = 0; i < 7; i++) {
        const dia = new Date(hoje);
        dia.setDate(hoje.getDate() - i);
        vendasPorDia[dia.toDateString()] = 0;
    }

    vendas.forEach(venda => {
        const dataVenda = new Date(venda.created_at);
        const dataVendaStr = dataVenda.toDateString();
        if (vendasPorDia[dataVendaStr] !== undefined) {
            vendasPorDia[dataVendaStr] += venda.valor_total || 0;
        }
    });

    const vendasSemanaisGrafico = Object.keys(vendasPorDia)
        .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
        .map(dateStr => ({
            name: dias[new Date(dateStr).getDay()],
            vendas: vendasPorDia[dateStr],
        }));

    return vendasSemanaisGrafico;
}