// app/(interno)/dashboard/estatisticas/page.tsx
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
  // ✅ Validação de variáveis em runtime (não quebra o build)
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('[EstatisticasPage] Variáveis de ambiente ausentes!');
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Erro: Variáveis de ambiente não configuradas. Contate o suporte.
        </p>
      </div>
    );
  }

  // Usa a URL e a chave ANÔNIMA para a conexão segura no servidor
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();

  // Se não houver usuário logado, retorna 404 (página não encontrada)
  if (!user) return notFound();

  // 1. Busca a loja do usuário
  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .select('id, owner_id')
    .eq('owner_id', user.id)
    .single();

  if (lojaError) {
    const pgError = lojaError as PostgrestError;
    if (pgError.code === 'PGRST116') {
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-gray-500">
            Você ainda não tem uma loja cadastrada. Crie uma para gerenciar suas estatísticas.
          </p>
        </div>
      );
    } else {
      console.error('[EstatisticasPage] Erro ao buscar a loja do usuário:', lojaError);
      return (
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">
            Erro: Não foi possível encontrar a loja do usuário. Verifique as permissões.
          </p>
        </div>
      );
    }
  }

  const lojaId = loja?.id;
  if (!lojaId) return notFound();

  // 2. Define o período de busca (mês atual)
  const today = new Date();
  const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).toISOString();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0, 23, 59, 59).toISOString();

  // 3. Busca todos os dados em paralelo para otimizar a performance
  const [
    vendasRes,
    visitasRes,
    topProdutosRes,
    estoqueBaixoRes,
    pedidosPendentesRes,
  ] = await Promise.all([
    supabase
      .from('vendas')
      .select('id, valor_total, created_at')
      .eq('loja_id', lojaId)
      .gte('created_at', firstDayOfMonth)
      .lte('created_at', lastDayOfMonth)
      .order('created_at', { ascending: true }),

    supabase
      .from('historico_acessos')
      .select('id, created_at')
      .eq('loja_id', lojaId)
      .gte('created_at', firstDayOfMonth)
      .lte('created_at', lastDayOfMonth),

    supabase
      .from('itens_venda')
      .select('quantidade, preco_unitario, nome_produto')
      .eq('loja_id', lojaId)
      .order('quantidade', { ascending: false })
      .limit(5),

    supabase
      .from('produtos')
      .select('id', { count: 'exact' })
      .eq('loja_id', lojaId)
      .lt('estoque', 5),

    supabase
      .from('pedidos')
      .select('id', { count: 'exact' })
      .eq('loja_id', lojaId)
      .eq('status', 'pendente'),
  ]);

  // 4. Lida com os erros de busca
  const { data: vendas, error: vendasError } = vendasRes;
  const { data: visitas, error: visitasError } = visitasRes;
  const { data: topProdutos, error: produtosError } = topProdutosRes;
  const { count: estoqueBaixo, error: estoqueError } = estoqueBaixoRes;
  const { count: pedidosPendentes, error: pedidosError } = pedidosPendentesRes;

  if (vendasError || visitasError || produtosError || estoqueError || pedidosError) {
    console.error('Erro ao buscar estatísticas:', vendasError || visitasError || produtosError || estoqueError || pedidosError);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">
          Erro ao carregar as estatísticas. Verifique sua conexão com o banco de dados e as políticas de RLS.
        </p>
      </div>
    );
  }

  // 5. Consolida os dados e os passa para o componente cliente
  const estatisticas: EstatisticasData = {
    vendas: vendas || [],
    visitas: (visitas || []).map(v => ({ id: v.id, created_at: v.created_at as string })),
    topProdutos: topProdutos || [],
    estoqueBaixo: estoqueBaixo || 0,
    pedidosPendentes: pedidosPendentes || 0,
  };

  return <EstatisticasComponente data={estatisticas} lojaId={lojaId} />;
}
