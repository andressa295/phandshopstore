import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ListaDeVendas from './components/ListaDeVendas';
import './components/ListaDeVendas.css';

interface Cliente {
  nome: string;
}

interface Venda {
  id: string;
  created_at: string;
  cliente: Cliente | null;  // Supabase retorna objeto cliente, não array
  valor_total: number;
  status: 'pendente' | 'pago' | 'cancelado' | 'enviado';
}

export default async function VendasPage() {
  const supabase = createServerComponentClient({ cookies });

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

  const { data: initialVendas, error } = await supabase
    .from('pedidos')
    .select('id, created_at, valor_total, status, cliente:clientes(nome)')
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Erro ao buscar vendas:', error);
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Erro ao carregar os dados de vendas.</p>
      </div>
    );
  }

  // Forçar o tipo correto para passar para o componente
  const vendasFormatadas: Venda[] = (initialVendas ?? []).map(venda => ({
    id: venda.id,
    created_at: venda.created_at,
    valor_total: venda.valor_total,
    status: venda.status,
    cliente: venda.cliente && venda.cliente.length > 0 ? venda.cliente[0] : null,
  }));

  return <ListaDeVendas initialVendas={vendasFormatadas} />;
}
