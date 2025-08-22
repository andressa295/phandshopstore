// app/(sitetemas)/[lojaSlug]/page.tsx
import { cookies } from 'next/headers';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import ProductListingClient from './components/ProductListingClient';
import type { LojaData, ProdutoData, BannerData, InfoBarItem, Database } from '@/types/next';

interface PageProps {
  params: {
    lojaSlug: string;
  };
}

export default async function ProductListingPage({ params }: PageProps) {
  const { lojaSlug } = params;

  const supabase = createServerComponentClient<Database, 'public'>({ cookies });

  // --- Buscar dados da loja ---
  const { data: lojaData, error: lojaError } = await supabase
    .from('lojas')
    .select('*')
    .eq('slug', lojaSlug)
    .single();

  if (!lojaData || lojaError) {
    throw new Error('Loja não encontrada');
  }

  // Mapear para seu tipo
  const loja: LojaData = {
    id: lojaData.id,
    nome_loja: lojaData.nome_loja,
    slug: lojaData.slug,
    theme_id: lojaData.theme_id ?? null,
    configuracoes_tema_json: lojaData.configuracoes_tema_json ?? {},
    top_info_bar_text: lojaData.top_info_bar_text ?? null,
    top_info_bar_link: lojaData.top_info_bar_link ?? null,
    top_info_bar_active: lojaData.top_info_bar_active ?? false,
    track_order_link_active: lojaData.track_order_link_active ?? false,
    support_link_active: lojaData.support_link_active ?? false,
    lojaLogoUrl: lojaData.lojaLogoUrl ?? null,
  };

  // --- Buscar produtos ---
  const { data: produtosData } = await supabase
    .from('produtos')
    .select('*')
    .eq('loja_id', loja.id);

  const produtos: ProdutoData[] = (produtosData ?? []).map((p: any) => ({
    id: p.id,
    nome: p.nome,
    descricao: p.descricao ?? null,
    preco: p.preco,
    estoque: p.estoque,
    imagem_url: p.imagem_url ?? null,
  }));

  // --- Buscar banners ---
  const { data: bannersData } = await supabase
    .from('banners')
    .select('*')
    .eq('loja_id', loja.id)
    .order('ordem', { ascending: true });

  const banners: BannerData[] = (bannersData ?? []).map((b: any) => ({
    id: b.id,
    imagem_url: b.imagem_url ?? '',
    link_url: b.link_url ?? null,
    titulo: b.titulo ?? null,
    subtitulo: b.subtitulo ?? null,
    ordem: b.ordem ?? 0,
  }));

  return (
    <ProductListingClient
      loja={loja}
      produtos={produtos}
      banners={banners}
      infoBarItems={loja.configuracoes_tema_json.info_bar_items ?? []}
      temaConfig={loja.configuracoes_tema_json}
    />
  );
}
