import { getSupabaseServerClient } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    vendaId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const supabase = getSupabaseServerClient();

  const { data: venda, error } = await supabase
    .from('vendas')
    .select('*')
    .eq('id', params.vendaId)
    .single();

  if (error || !venda) {
    console.error('Erro ao buscar venda:', error);
    return notFound();
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Detalhes da Venda</h1>
      <div style={{ lineHeight: '1.6' }}>
        <p><strong>ID:</strong> {venda.id}</p>
        <p><strong>Data:</strong> {new Date(venda.created_at).toLocaleString()}</p>
        <p><strong>Cliente:</strong> {venda.cliente_nome}</p>
        <p><strong>Status:</strong> {venda.status}</p>
        <p><strong>Total:</strong> R$ {venda.valor_total.toFixed(2)}</p>
        {/* Adicione aqui mais campos conforme necessário */}
      </div>
    </main>
  );
}
