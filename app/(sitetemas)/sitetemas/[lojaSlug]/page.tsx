import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ClientThemeRenderer from './components/ClientThemeRenderer';
import { Padrao } from '../../../(painel)/personalizar/themes/Padrao';
import { ThemeConfig, LojaData } from '../../../(painel)/personalizar/types';

// Força a renderização dinâmica (sempre SSR)
export const dynamic = 'force-dynamic';

interface PageProps {
  params: { lojaSlug: string };
}

export default async function Page({ params }: PageProps) {
  const { lojaSlug } = params;
  const supabase = createServerComponentClient({ cookies });

  const { data: loja, error } = await supabase
    .from('lojas')
    .select(`
      *, 
      temas (nome_tema, configuracoes_json)
    `)
    .eq('slug', lojaSlug)
    .single();

  if (error || !loja) {
    console.error('Erro ao buscar loja ou ela não existe. Usando tema padrão.');
    return (
      <ClientThemeRenderer
        initialThemeConfig={Padrao}
        lojaSlug={lojaSlug}
        lojaData={null}
        produtos={[]}
        banners={[]}
        categorias={[]}
        infoBarItems={[]}
      />
    );
  }

  const initialThemeConfig = loja.temas?.configuracoes_json as ThemeConfig;

  const [produtosResult, bannersResult, categoriasResult] = await Promise.all([
    supabase.from('produtos').select(`*`),
    supabase.from('banners').select(`*`),
    supabase.from('categorias').select(`*`),
  ]);

  const dataProps = {
    initialThemeConfig,
    lojaData: loja as LojaData,
    produtos: produtosResult.data || [],
    banners: bannersResult.data || [],
    categorias: categoriasResult.data || [],
    infoBarItems: [],
    lojaSlug,
  };

  return <ClientThemeRenderer {...dataProps} />;
}
