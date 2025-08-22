// app/(sitetemas)/[lojaSlug]/page.tsx
import React from 'react';
import ProductListingClient from './components/ProductListingClient';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/next';

interface PageProps {
  params: { lojaSlug: string };
}

export default async function ProductListingPage({ params }: PageProps) {
  // Resolve params corretamente
  const { lojaSlug } = await params;

  const supabase = createServerComponentClient<Database>({ cookies });

  // Buscar dados da loja
  const { data: lojaData, error: lojaError } = await supabase
    .from('lojas')
    .select('*')
    .eq('slug', lojaSlug)
    .single();

  if (!lojaData || lojaError) {
    return <p>Loja não encontrada.</p>;
  }

  // Buscar produtos da loja
  const { data: produtos, error: produtosError } = await supabase
    .from('produtos')
    .select('*')
    .eq('loja_id', lojaData.id);

  if (produtosError) {
    return <p>Erro ao carregar produtos.</p>;
  }

  // Buscar banners da loja
  const { data: banners, error: bannersError } = await supabase
    .from('banners')
    .select('*')
    .eq('loja_id', lojaData.id)
    .order('ordem', { ascending: true });

  if (bannersError) {
    return <p>Erro ao carregar banners.</p>;
  }

  // Buscar items da info bar
  const { data: infoBarItems, error: infoBarError } = await supabase
    .from('info_bar_items')
    .select('*')
    .eq('loja_id', lojaData.id);

  if (infoBarError) {
    return <p>Erro ao carregar Info Bar.</p>;
  }

  return (
    <ProductListingClient
      loja={lojaData}
      produtos={produtos || []}
      banners={banners || []}
      infoBarItems={infoBarItems || []}
      temaConfig={lojaData.configuracoes_tema_json || {}}
    />
  );
}
