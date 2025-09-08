// app/(sitetemas)/sitetemas/[lojaSlug]/produtos/[productId]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ProductDetailPage from '../../components/ProductDetailPage';
import { notFound } from 'next/navigation';

export default async function ProductPage({ params }: { params: { lojaSlug: string, productId: string } }) {
    const supabase = createServerComponentClient({ cookies });
    
    // 1. Busca os dados do produto no Supabase
    const { data: produto, error: produtoError } = await supabase
        .from('produtos')
        .select('*')
        .eq('id', params.productId)
        .single();

    if (produtoError || !produto) {
        return notFound();
    }
    
    // 2. Busca os dados da loja para obter o nome
    const { data: loja, error: lojaError } = await supabase
        .from('lojas')
        .select('nome_loja')
        .eq('slug', params.lojaSlug)
        .single();

    if (lojaError || !loja) {
        // Se a loja não for encontrada, retorna um nome padrão ou notFound
        return notFound();
    }

    // 3. Passa tanto o produto quanto o nome da loja para o componente
    return <ProductDetailPage produto={produto} lojaNome={loja.nome_loja} />;
}