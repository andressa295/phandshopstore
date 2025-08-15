// lib/supabase/dashboard/getStoreDashboardData.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export interface StoreDashboardData {
  vendasHoje: number;
  visitantesHoje: number;
  pedidosPendentes: number;
  estoqueBaixoAlert: number;
  faturamentoMes: number;
  ticketMedio: number;
  taxaConversao: number;
  vendasSemanaisGrafico: { name: string; vendas: number }[];
  faturamentoComRepasse: number;
  custosFixos: number;
  custosVariaveis: number;
  mesAtual: number;
  mesAnterior: number;
  metaMensal: number;
  notificacoesPendentes: number;
  sistemaStatus: string;
}

interface VendaRecord {
  valor_venda: number | null;
  created_at: string;
  status: string;
}

export async function getStoreDashboardData(lojaId: string): Promise<StoreDashboardData | null> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();

    // 🔍 Busca vendas do mês
    const { data: vendas, error: vendasError } = await supabase
      .from('receita_historico')
      .select('valor_venda, created_at, status')
      .eq('loja_id', lojaId)
      .gte('created_at', startOfMonth) as { data: VendaRecord[] | null, error: any };

    if (vendasError) {
      console.error('Erro ao buscar dados de vendas:', vendasError);
      return null;
    }

    const vendasList = vendas ?? [];

    // 📊 Calcula métricas reais
    const vendasHoje = vendasList
      .filter(v => {
        const vendaDate = new Date(v.created_at);
        vendaDate.setHours(0, 0, 0, 0);
        return vendaDate.getTime() === today.getTime();
      })
      .reduce((acc, curr) => acc + (curr.valor_venda ?? 0), 0);

    const faturamentoMes = vendasList.reduce((acc, curr) => acc + (curr.valor_venda ?? 0), 0);
    const numVendasMes = vendasList.length;

    // 📌 Dados mockados/placeholders
    const simulatedData = {
      faturamentoComRepasse: faturamentoMes * 0.15,
      custosFixos: 1000,
      custosVariaveis: 500,
      mesAtual: faturamentoMes,
      mesAnterior: faturamentoMes * 0.9,
      metaMensal: 50000,
      notificacoesPendentes: 2,
      sistemaStatus: 'Operacional',
      pedidosPendentes: 3,
      estoqueBaixoAlert: 1,
      visitantesHoje: 50,
      ticketMedio: numVendasMes > 0 ? faturamentoMes / numVendasMes : 0,
      taxaConversao: 2.5,
      vendasSemanaisGrafico: gerarGraficoSemanal(vendasList, today),
    };

    return {
      ...simulatedData,
      vendasHoje,
      faturamentoMes,
    };
  } catch (error) {
    console.error('Erro inesperado em getStoreDashboardData:', error);
    return null;
  }
}

function gerarGraficoSemanal(vendas: VendaRecord[], hoje: Date): StoreDashboardData['vendasSemanaisGrafico'] {
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const vendasPorDia: Record<string, number> = {};

  // Inicializa últimos 7 dias
  for (let i = 0; i < 7; i++) {
    const dia = new Date(hoje);
    dia.setDate(hoje.getDate() - i);
    vendasPorDia[dia.toDateString()] = 0;
  }

  vendas.forEach(venda => {
    const dataVendaStr = new Date(venda.created_at).toDateString();
    if (vendasPorDia[dataVendaStr] !== undefined) {
      vendasPorDia[dataVendaStr] += venda.valor_venda ?? 0;
    }
  });

  return Object.keys(vendasPorDia)
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
    .map(dateStr => ({
      name: dias[new Date(dateStr).getDay()],
      vendas: vendasPorDia[dateStr],
    }));
}
