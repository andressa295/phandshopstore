// app/(interno)/dashboard/vendas/detalhes/[vendaId]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

interface PageProps {
  params: {
    vendaId: string;
  };
}

export const metadata: Metadata = {
  title: 'Detalhes da Venda | Phandshop',
};

export default async function DetalhesVendaPage({ params }: PageProps) {
  const supabase = getSupabaseServerClient();

  const { data: venda, error } = await supabase
    .from('vendas')
    .select('*, produtos_vendidos ( * )')
    .eq('id', params.vendaId)
    .single();

  if (error || !venda) {
    console.error('Erro ao buscar venda:', error);
    return notFound();
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Detalhes da Venda</h1>
      <p><strong>ID:</strong> {venda.id}</p>
      <p><strong>Cliente:</strong> {venda.cliente_nome}</p>
      <p><strong>Total:</strong> R$ {venda.total}</p>
      <p><strong>Data:</strong> {new Date(venda.created_at).toLocaleDateString()}</p>

      <h2>Produtos Vendidos</h2>
      <ul>
        {venda.produtos_vendidos?.map((produto: any) => (
          <li key={produto.id}>
            {produto.nome} - {produto.quantidade}x - R$ {produto.preco}
          </li>
        ))}
      </ul>
    </div>
  );
}
