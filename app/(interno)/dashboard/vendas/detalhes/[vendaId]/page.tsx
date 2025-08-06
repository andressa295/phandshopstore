
import React from 'react'
import '@/app/globals.css'
import { notFound } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import type { Metadata } from 'next'

// Tipos compartilhados
import type {
  DetalhesVendaProp,
  ItemPedidoSupabaseRaw,
  ClienteVenda,
  VendaRawFromSupabase,
} from '../components/types'

// Componente visual
import DetalhesDaVenda from '../components/DetalhesDaVenda'

// Metadata da página
export const metadata: Metadata = {
  title: 'Detalhes da Venda | Phandshop',
}

// Tipagem correta para Next.js App Router
type Props = {
  params: {
    vendaId: string
  }
}

export default async function VendaDetalhesPage({ params }: Props) {
  const supabase = createServerComponentClient({ cookies })
  const { vendaId } = params

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return notFound()

  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .select('id')
    .eq('usuario_id', user.id)
    .single()

  if (lojaError || !loja) {
    console.error('Erro ao buscar loja:', lojaError)
    return notFound()
  }

  const lojaId = loja.id

  const { data: vendaRaw, error: vendaError } = await supabase
    .from('vendas')
    .select(`
      id, created_at, status, valor_total, metodo_pagamento,
      endereco_entrega, observacoes_cliente, observacoes_internas,
      tracking_link, tracking_codigo, transportadora, data_envio,
      cliente:clientes(id, nome, email, telefone, documento),
      itens_venda:itens_venda(
        id, produto_id, quantidade, preco_unitario, nome_produto:produtos(nome)
      )
    `)
    .eq('id', vendaId)
    .eq('loja_id', lojaId)
    .single<VendaRawFromSupabase>()

  if (vendaError || !vendaRaw) {
    console.error('Erro ao buscar venda:', vendaError)
    return notFound()
  }

  // Formata os dados para o componente de detalhes da venda
  const formattedVenda: DetalhesVendaProp = {
    id: vendaRaw.id,
    created_at: vendaRaw.created_at,
    status: vendaRaw.status,
    valor_total: vendaRaw.valor_total,
    metodo_pagamento: vendaRaw.metodo_pagamento,
    endereco_entrega: vendaRaw.endereco_entrega,
    observacoes_cliente: vendaRaw.observacoes_cliente,
    observacoes_internas: vendaRaw.observacoes_internas,
    tracking_link: vendaRaw.tracking_link,
    tracking_codigo: vendaRaw.tracking_codigo,
    transportadora: vendaRaw.transportadora,
    data_envio: vendaRaw.data_envio,
    cliente:
      Array.isArray(vendaRaw.cliente) && vendaRaw.cliente.length > 0
        ? (vendaRaw.cliente[0] as ClienteVenda)
        : (vendaRaw.cliente as ClienteVenda) || null,
    itens_venda: (vendaRaw.itens_venda || []).map((itemRaw: ItemPedidoSupabaseRaw) => ({
      id: itemRaw.id,
      produto_id: itemRaw.produto_id,
      quantidade: itemRaw.quantidade,
      preco_unitario: itemRaw.preco_unitario,
      nome_produto:
        Array.isArray(itemRaw.nome_produto) && itemRaw.nome_produto[0]
          ? itemRaw.nome_produto[0].nome
          : 'Produto Indisponível',
    })),
  }

  return <DetalhesDaVenda venda={formattedVenda} />
}
