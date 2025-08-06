import React from 'react';
import '@/app/globals.css';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';

// Componente DetalhesDaVenda
import DetalhesDaVenda from '../components/DetalhesDaVenda';


interface LocalPageProps<T extends Record<string, string | string[]> = Record<string, string | string[]>> {
  params: T;
  // Se você usar searchParams nesta página, adicione aqui:
  // searchParams?: { [key: string]: string | string[] | undefined };
}

// Interfaces ajustadas para corresponderem ao nosso esquema de banco de dados
interface ItemPedidoSupabase {
    id: string;
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
    nome_produto: { nome: string } | null;
}

export interface ClienteDetalheSupabase {
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
    documento: string | null;
}

export interface Endereco {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
}

interface VendaSupabaseData {
    id: string;
    created_at: string;
    status: 'pendente' | 'pago' | 'cancelado' | 'enviado' | 'entregue' | 'separando' | 'confeccao' | 'fabricacao' | 'arquivado';
    valor_total: number;
    metodo_pagamento: string;
    endereco_entrega: Endereco | null;
    observacoes_cliente: string | null;
    observacoes_internas: string | null;
    tracking_link: string | null;
    tracking_codigo: string | null;
    transportadora: string | null;
    data_envio: string | null;
    cliente: ClienteDetalheSupabase | null;
    itens_venda: ItemPedidoSupabase[];
}

interface ItemVendido {
    id: string;
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
    nome_produto: string;
}

export interface DetalhesVendaProp {
    id: string;
    created_at: string;
    status: 'pendente' | 'pago' | 'cancelado' | 'enviado' | 'entregue' | 'separando' | 'confeccao' | 'fabricacao' | 'arquivado';
    valor_total: number;
    metodo_pagamento: string;
    endereco_entrega: Endereco | null;
    observacoes_cliente: string | null;
    observacoes_internas: string | null;
    tracking_link: string | null;
    tracking_codigo: string | null;
    transportadora: string | null;
    data_envio: string | null;
    cliente: ClienteDetalheSupabase | null;
    itens_venda: ItemVendido[];
}

export const metadata: Metadata = {
    title: 'Detalhes da Venda | Phandshop',
};

// A interface da página agora estende a nossa LocalPageProps
interface VendaDetalhesPageProps extends LocalPageProps<{ vendaId: string }> {}
// === FIM DA CORREÇÃO DE TIPAGEM ===


export default async function VendaDetalhesPage({ params }: VendaDetalhesPageProps) {
    const supabase = createServerComponentClient({ cookies });
    const { vendaId } = params;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return notFound();
    }
    
    const { data: loja, error: lojaError } = await supabase.from('lojas').select('id').eq('usuario_id', user.id).single();
    const lojaId = loja?.id;

    if (lojaError || !lojaId) {
        console.error('Erro ao buscar ID da loja ou loja não encontrada para o usuário:', lojaError);
        return notFound();
    }

    const { data: venda, error: vendaError } = await supabase
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
        .single();

    if (vendaError || !venda) {
        console.error('Erro ao buscar a venda:', vendaError);
        return notFound();
    }
    
    const formattedVenda: DetalhesVendaProp = {
        ...venda,
        cliente: Array.isArray(venda.cliente) && venda.cliente.length > 0 ? venda.cliente[0] : null,
        itens_venda: (venda.itens_venda as any[]).map(item => ({
            ...item,
            nome_produto: Array.isArray(item.nome_produto) && item.nome_produto.length > 0
                ? item.nome_produto[0].nome
                : 'Produto Indisponível'
        })),
    };

    return (
        <DetalhesDaVenda venda={formattedVenda} />
    );
}
