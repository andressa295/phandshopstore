import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import EstatisticasComponente from './components/EstatisticasComponente';

interface VendaData {
  id: string;
  valor_total: number;
  created_at: string;
}

interface VisitaData {
  id: string;
  created_at: string;
}

interface TopProdutoData {
  quantidade: number;
  preco: number;
  nome_produto: string;
}

export interface EstatisticasData {
  vendas: VendaData[];
  visitas: VisitaData[];
  topProdutos: TopProdutoData[];
  estoqueBaixo: number;
  pedidosPendentes: number;
}

export default async function EstatisticasPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Acesso negado. Por favor, faça login.</p>
      </div>
    );
  }

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();

  // Buscando dados de vendas
  const { data: vendas, error: vendasError } = await supabase
    .from('pedidos')
    .select('id, valor_total, created_at')
    .gte('created_at', firstDayOfMonth)
    .lte('created_at', lastDayOfMonth)
    .order('created_at', { ascending: true });

  // Buscando dados de visitas
  const { data: visitas, error: visitasError } = await supabase
    .from('visitas_loja')
    .select('id, created_at')
    .gte('created_at', firstDayOfMonth)
    .lte('created_at', lastDayOfMonth);

  // Buscando os produtos mais vendidos
  const { data: topProdutos, error: produtosError } = await supabase
    .from('items_pedido')
    .select(`
      quantidade,
      preco,
      nome_produto
    `)
    .order('quantidade', { ascending: false })
    .limit(5);

  // Buscando a contagem de produtos com estoque baixo (exemplo: < 50)
  const { count: estoqueBaixo, error: estoqueError } = await supabase
    .from('produtos')
    .select('estoque', { count: 'exact' })
    .lt('estoque', 50);

  // Buscando a contagem de pedidos pendentes
  const { count: pedidosPendentes, error: pedidosError } = await supabase
    .from('pedidos')
    .select('status', { count: 'exact' })
    .eq('status', 'pendente');

  if (vendasError || visitasError || produtosError || estoqueError || pedidosError) {
    console.error('Erro ao buscar estatísticas:', vendasError || visitasError || produtosError || estoqueError || pedidosError);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Erro ao carregar as estatísticas. Verifique sua conexão com o banco de dados.</p>
      </div>
    );
  }
  
  const estatisticas: EstatisticasData = {
    vendas: vendas || [],
    visitas: visitas || [],
    topProdutos: topProdutos || [],
    estoqueBaixo: estoqueBaixo || 0,
    pedidosPendentes: pedidosPendentes || 0,
  };

  return <EstatisticasComponente data={estatisticas} />;
}