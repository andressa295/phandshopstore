import { supabase } from '@/lib/supabaseClient';

export async function getDashboardData(userId: string) {
  const [produtos, pedidos, clientes] = await Promise.all([
    supabase.from('produtos').select('*').eq('user_id', userId),
    supabase.from('pedidos').select('*').eq('user_id', userId),
    supabase.from('clientes').select('*').eq('user_id', userId),
  ]);

  if (produtos.error || pedidos.error || clientes.error) {
    throw new Error('Erro ao buscar dados do dashboard');
  }

  const vendasHoje = pedidos.data?.filter(p => new Date(p.created_at).toDateString() === new Date().toDateString())
    .reduce((acc, curr) => acc + curr.total, 0);

  const visitantesHoje = Math.floor(Math.random() * 500); // Substituir quando tiver analytics
  const faturamentoMes = pedidos.data?.filter(p => new Date(p.created_at).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.total, 0);

  const ticketMedio = pedidos.data && pedidos.data.length > 0
    ? (pedidos.data.reduce((acc, curr) => acc + curr.total, 0) / pedidos.data.length)
    : 0;

  const vendasSemanaisGrafico = gerarGraficoSemanal(pedidos.data || []);

  return {
    vendasHoje,
    visitantesHoje,
    produtosEmEstoque: produtos.data?.length || 0,
    pedidosPendentes: pedidos.data?.filter(p => p.status === 'pendente').length || 0,
    faturamentoMes,
    taxaConversao: 2.3, // Placeholder até termos visitantes reais
    ticketMedio,
    estoqueBaixoAlert: produtos.data?.filter(p => p.estoque <= 5).length || 0,
    vendasSemanaisGrafico
  };
}

function gerarGraficoSemanal(pedidos: any[]) {
  const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hoje = new Date();
  const semana = Array(7).fill(0).map((_, i) => {
    const dia = new Date(hoje);
    dia.setDate(dia.getDate() - (6 - i));
    const diaStr = dias[dia.getDay()];
    const vendasDoDia = pedidos.filter(p =>
      new Date(p.created_at).toDateString() === dia.toDateString()
    ).reduce((acc, curr) => acc + curr.total, 0);

    return { name: diaStr, vendas: vendasDoDia };
  });

  return semana;
}
