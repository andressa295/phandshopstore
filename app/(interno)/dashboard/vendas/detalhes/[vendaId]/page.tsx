import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import DetalhesDaVenda from '../components/DetalhesDaVenda';

interface ItemPedido {
  id: string;
  produto_id: string;
  quantidade: number;
  preco_unitario: number;
  nome_produto: { nome: string } | null;
}

interface VendaDetalheProp {
  id: string;
  created_at: string;
  cliente_id: string;
  cliente: {
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
    cpfCnpj: string | null;
  } | null;
  status: string;
  valor_total: number;
  endereco_ent: string | null;
  observacoes_c: string | null;
  observacoes_i: string | null;
  tracking_link: string | null;
  tracking_cod: string | null;
  transportador: string | null;
  data_envio: string | null;
  items_pedido: ItemPedido[];
}

export default async function DetalheVendaPage({ params }: { params: { vendaId: string } }) {
  const supabase = createServerComponentClient({ cookies });
  const { vendaId } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Acesso negado. Por favor, faça login.</p>
      </div>
    );
  }

  const { data: venda, error } = await supabase
    .from('pedidos')
    .select(
      `
      id, created_at, status, valor_total, endereco_ent,
      observacoes_c, observacoes_i, tracking_link,
      tracking_cod, transportador, data_envio,
      cliente_id,
      cliente:clientes (
        id, nome, email, telefone, cpfCnpj
      ),
      items_pedido:items_pedido (
        id, produto_id, quantidade, preco_unitario,
        nome_produto:produtos (nome)
      )
      `
    )
    .eq('id', vendaId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Erro ao buscar a venda:', error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Erro ao carregar os detalhes da venda.</p>
      </div>
    );
  }

  // Tipagem de fallback se o Supabase retornar null
  const vendaData = venda as VendaDetalheProp | null;

  return <DetalhesDaVenda venda={vendaData} />;
}
