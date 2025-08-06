import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import EstatisticasComponente from './components/EstatisticasComponente';
import { notFound } from 'next/navigation';
import { PostgrestError } from '@supabase/supabase-js';

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
  preco_unitario: number;
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
    return notFound();
  }
  
  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .select('id')
    .eq('usuario_id', user.id)
    .single();

  if (lojaError) {
    const pgError = lojaError as PostgrestError;
    if (pgError.code === 'PGRST116') {
      console.warn(`[EstatisticasPage] Usuário '${user.id}' não tem uma loja cadastrada. Exibindo mensagem amigável.`);
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500">Você ainda não tem uma loja cadastrada. Por favor, crie uma para gerenciar suas estatísticas.</p>
        </div>
      );
    } else {
      console.error('[EstatisticasPage] Erro ao buscar a loja do usuário:', lojaError);
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Erro: Não foi possível encontrar a loja do usuário. Verifique as permissões.</p>
        </div>
      );
    }
  }

  const lojaId = loja?.id;

  if (!lojaId) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Você ainda não tem uma loja cadastrada. Por favor, crie uma para gerenciar suas estatísticas.</p>
      </div>
    );
  }

  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();

  const { data: vendas, error: vendasError } = await supabase
    .from('vendas')
    .select('id, valor_total, created_at')
    .eq('loja_id', lojaId)
    .gte('created_at', firstDayOfMonth)
    .lte('created_at', lastDayOfMonth)
    .order('created_at', { ascending: true });

  const { data: visitas, error: visitasError } = await supabase
    .from('historico_acessos')
    .select('id, data_acesso')
    .eq('usuario_id', user.id)
    .gte('data_acesso', firstDayOfMonth)
    .lte('data_acesso', lastDayOfMonth);

  const { data: topProdutos, error: produtosError } = await supabase
    .from('itens_venda')
    .select(`
      quantidade,
      preco_unitario,
      nome_produto
    `)
    .eq('loja_id', lojaId)
    .order('quantidade', { ascending: false })
    .limit(5);

  const { count: estoqueBaixo, error: estoqueError } = await supabase
    .from('produtos')
    .select('estoque', { count: 'exact' })
    .eq('loja_id', lojaId)
    .lt('estoque', 50);

  const { count: pedidosPendentes, error: pedidosError } = await supabase
    .from('vendas')
    .select('status', { count: 'exact' })
    .eq('loja_id', lojaId)
    .eq('status', 'pendente');

  if (vendasError || visitasError || produtosError || estoqueError || pedidosError) {
    console.error('Erro ao buscar estatísticas:', vendasError || visitasError || produtosError || estoqueError || pedidosError);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Erro ao carregar as estatísticas. Verifique sua conexão com o banco de dados e as políticas de RLS.</p>
      </div>
    );
  }
  
  const estatisticas: EstatisticasData = {
    vendas: vendas || [],
    visitas: (visitas || []).map(v => ({ id: v.id, created_at: v.data_acesso as string })),
    topProdutos: topProdutos || [],
    estoqueBaixo: estoqueBaixo || 0,
    pedidosPendentes: pedidosPendentes || 0,
  };

  return <EstatisticasComponente data={estatisticas} lojaId={lojaId} />;
}
