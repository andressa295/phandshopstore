// lib/supabase/dashboard/getAdminDashboardData.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// CORRIGIDO: Interface AdminDashboardData com todas as propriedades necessárias
export interface AdminDashboardData {
  totalLojistas: number;
  novosCadastrosSemana: number;
  ticketsAbertos: number;
  faturamentoBruto: number;
  faturamentoPendente: number;
  taxaDeChurn: string;
  sistemaStatus: string;
  notificacoesPendentes: number;
  mesAtual: number;
  mesAnterior: number;
  metaMensal: number;
  custosFixos: number; // Adicionado
  custosVariaveis: number; // Adicionado
}

export async function getAdminDashboardData(): Promise<AdminDashboardData | null> {
  const supabase = createServerComponentClient({ cookies });

  try {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    
    // CORRIGIDO: Buscas reais para as métricas disponíveis
    const [
      { count: totalLojistas },
      { count: novosCadastrosSemana },
      { count: ticketsAbertos }
    ] = await Promise.all([
      supabase.from('lojas').select('id', { count: 'exact' }),
      supabase.from('lojas').select('id', { count: 'exact' }).gte('created_at', startOfWeek.toISOString()),
      supabase.from('tickets_suporte').select('id', { count: 'exact' }).eq('status', 'aberto')
    ]);

    // Dados simulados para as métricas que não temos tabelas
    const simulatedData = {
      faturamentoBruto: 350000,
      faturamentoPendente: 15000,
      taxaDeChurn: '2.5%',
      sistemaStatus: 'Operacional',
      notificacoesPendentes: 3,
      mesAtual: 120000,
      mesAnterior: 110000,
      metaMensal: 150000,
      custosFixos: 30000, // Adicionado
      custosVariaveis: 15000, // Adicionado
    };
    
    return {
      ...simulatedData,
      totalLojistas: totalLojistas || 0,
      novosCadastrosSemana: novosCadastrosSemana || 0,
      ticketsAbertos: ticketsAbertos || 0,
    };
  } catch (error) {
    console.error('Erro no serviço getAdminDashboardData:', error);
    return null;
  }
}