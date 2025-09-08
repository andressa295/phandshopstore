import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import SearchClient from '.././components/SearchPage';
import { notFound } from 'next/navigation';

export default async function SearchPage({ params }: { params: { lojaSlug: string } }) {
    const supabase = createServerComponentClient({ cookies });

    const { data: loja, error: lojaError } = await supabase
        .from('lojas')
        .select('id, slug')
        .eq('slug', params.lojaSlug)
        .single();

    if (lojaError || !loja) {
        return notFound();
    }
    
    // A busca inicial será feita no lado do cliente, mas a página é renderizada no servidor
    return <SearchClient lojaId={loja.id} />;
}