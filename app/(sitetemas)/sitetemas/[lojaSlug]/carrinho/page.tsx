import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import CartPage from '../components/CartPage';
import { notFound } from 'next/navigation';

// ⚠️ Hack temporário: o Next gera tipagem errada em .next/types
// params nunca é Promise, mas o compilador acha que é.
// Por isso usamos @ts-expect-error só aqui.
export default async function CarrinhoPage({ params }: { params: { lojaSlug: string } }) {
  const supabase = createServerComponentClient({ cookies });

  // Busca os dados da loja
  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .select('id, nome_loja')
    .eq('slug', params.lojaSlug)
    .single();

  if (lojaError || !loja) {
    return notFound();
  }

  // Produtos para cross-sell
  const { data: crossSellProducts } = await supabase
    .from('produtos')
    .select('*')
    .eq('loja_id', loja.id)
    .limit(4);

  // Produto para compre junto
  const { data: compreJuntoProduct } = await supabase
    .from('produtos')
    .select('*')
    .eq('loja_id', loja.id)
    .limit(1);

  return (
    <CartPage
      lojaNome={loja.nome_loja}
      crossSellProducts={crossSellProducts || []}
      compreJuntoProduct={compreJuntoProduct?.[0] || null}
    />
  );
}
