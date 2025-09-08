import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ProductList from '.././components/ProductList';
import { notFound } from 'next/navigation';

export default async function ProdutosPage({ params }: { params: { lojaSlug: string } }) {
    const supabase = createServerComponentClient({ cookies });
    
    // 1. Busca os dados da loja
    const { data: loja, error: lojaError } = await supabase
        .from('lojas')
        .select('id, nome_loja, slug')
        .eq('slug', params.lojaSlug)
        .single();

    if (lojaError || !loja) {
        return notFound();
    }
    
    // 2. Busca todos os produtos da loja
    const { data: produtos, error: produtosError } = await supabase
        .from('produtos')
        .select('*')
        .eq('loja_id', loja.id);

    if (produtosError) {
        console.error('Erro ao buscar produtos:', produtosError);
        return <div>Não foi possível carregar os produtos.</div>;
    }

    // 3. Passa os produtos para o componente do lado do cliente
    return <ProductList produtos={produtos} lojaSlug={loja.slug} />;
}