// =======================================================
// ARQUIVO: app/(interno)/dashboard/vendas/detalhes/[vendaId]/page.tsx
// =======================================================
// Esta é a página de detalhes de uma venda específica no backoffice.

import React from 'react';
import '@/app/globals.css';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

// Importa todos os tipos do arquivo centralizado
import type {
  DetalhesVendaProp,
  ItemPedidoSupabaseRaw,
  ClienteVenda,
  Endereco,
  ClienteDetalheSupabaseRaw,
  EnderecoRaw,
  ItemVendido,
  StatusVenda, // Importado para uso na interface auxiliar
} from '../types';

// Componente DetalhesDaVenda
import DetalhesDaVenda from '../components/DetalhesDaVenda';

export const metadata: Metadata = {
  title: 'Detalhes da Venda | Phandshop',
};

// Define a interface para as props da página, tipando 'params' diretamente
interface VendaDetalhesPageProps {
  params: {
    vendaId: string; // O ID da venda virá da URL dinâmica (UUID é string)
  };
}

export default async function VendaDetalhesPage({ params }: VendaDetalhesPageProps) {
  const supabase = createServerComponentClient({ cookies });
  const { vendaId } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return notFound();
  }

  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .select('id')
    .eq('usuario_id', user.id)
    .single();

  const lojaId = loja?.id;

  if (lojaError || !lojaId) {
    console.error('Erro ao buscar ID da loja ou loja não encontrada para o usuário:', lojaError);
    return notFound();
  }

  // Define uma interface auxiliar para o retorno da query do Supabase antes da formatação
  // Ajustado para refletir que 'cliente' pode vir como ClienteDetalheSupabaseRaw[]
  interface VendaRawFromSupabase {
    id: string;
    created_at: string;
    status: StatusVenda;
    valor_total: number;
    metodo_pagamento: string;
    endereco_entrega: EnderecoRaw | null;
    observacoes_cliente: string | null;
    observacoes_internas: string | null;
    tracking_link: string | null;
    tracking_codigo: string | null;
    transportadora: string | null;
    data_envio: string | null;
    cliente: ClienteDetalheSupabaseRaw | ClienteDetalheSupabaseRaw[] | null; // Pode vir como objeto ou array
    itens_venda: ItemPedidoSupabaseRaw[];
  }

  const { data: vendaRaw, error: vendaError } = await supabase
    .from('vendas')
    .select(
      `
      id, created_at, status, valor_total, metodo_pagamento,
      endereco_entrega, observacoes_cliente, observacoes_internas,
      tracking_link, tracking_codigo, transportadora, data_envio,
      cliente:clientes(id, nome, email, telefone, documento),
      itens_venda:itens_venda(
        id, produto_id, quantidade, preco_unitario, nome_produto:produtos(nome)
      )
    `
    )
    .eq('id', vendaId)
    .eq('loja_id', lojaId)
    .single<VendaRawFromSupabase>(); // Adicionado cast para a interface auxiliar

  if (vendaError || !vendaRaw) {
    console.error('Erro ao buscar a venda:', vendaError);
    return notFound();
  }

  // Mapeamento e formatação dos dados para o tipo DetalhesVendaProp
  const formattedVenda: DetalhesVendaProp = {
    id: vendaRaw.id,
    created_at: vendaRaw.created_at,
    status: vendaRaw.status,
    valor_total: vendaRaw.valor_total,
    metodo_pagamento: vendaRaw.metodo_pagamento,
    endereco_entrega: vendaRaw.endereco_entrega, // EnderecoRaw é compatível com Endereco
    observacoes_cliente: vendaRaw.observacoes_cliente,
    observacoes_internas: vendaRaw.observacoes_internas,
    tracking_link: vendaRaw.tracking_link,
    tracking_codigo: vendaRaw.tracking_codigo,
    transportadora: vendaRaw.transportadora,
    data_envio: vendaRaw.data_envio,
    
    // Cliente: Supabase pode retornar como array mesmo para single() em joins.
    // Mapeamos para o formato ClienteVenda esperado.
    cliente:
      Array.isArray(vendaRaw.cliente) && vendaRaw.cliente.length > 0
        ? (vendaRaw.cliente[0] as ClienteVenda) // Cast para ClienteVenda
        : (vendaRaw.cliente as ClienteVenda || null), // Se não for array, usa o objeto direto ou null
    
    // Itens da Venda: Mapeia para extrair nome_produto corretamente
    itens_venda: (vendaRaw.itens_venda || []).map((itemRaw: ItemPedidoSupabaseRaw) => ({
      id: itemRaw.id,
      produto_id: itemRaw.produto_id,
      quantidade: itemRaw.quantidade,
      preco_unitario: itemRaw.preco_unitario,
      nome_produto:
        Array.isArray(itemRaw.nome_produto) && itemRaw.nome_produto.length > 0
          ? itemRaw.nome_produto[0].nome
          : (itemRaw.nome_produto?.nome || 'Produto Indisponível'), // Garante que pega o nome ou fallback
    })),
  };

  return <DetalhesDaVenda venda={formattedVenda} />;
}
