// =======================================================
// ARQUIVO: app/(interno)/dashboard/vendas/detalhes/[vendaId]/page.tsx
// =======================================================
// Esta é a página de detalhes de uma venda específica no backoffice.

import React from 'react';
import '@/app/globals.css'; // Certifique-se de que seus estilos globais estão importados
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Metadata } from 'next'; // <-- Adicionado: Importação do tipo Metadata

// Componente DetalhesDaVenda (assumindo que este componente existe em '../components/DetalhesDaVenda')
// Este componente receberá os dados já formatados.
import DetalhesDaVenda from '../components/DetalhesDaVenda';

// Interfaces ajustadas para corresponderem ao nosso esquema de banco de dados
interface ItemPedidoSupabase {
    id: string;
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
    // O retorno da query do Supabase para o join de produto é um objeto ou null
    nome_produto: { nome: string } | null; // Nome real da coluna no Supabase
}

interface ClienteDetalheSupabase {
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
    documento: string | null;
}

interface Endereco {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
}

// Interface para os dados retornados diretamente do Supabase
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

// A interface 'DetalhesVendaProp' esperada pelo componente DetalhesDaVenda
// Esta interface reflete o formato final dos dados após o mapeamento.
interface ItemVendido {
    id: string;
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
    nome_produto: string; // O tipo final que o componente DetalhesDaVenda espera
}

interface DetalhesVendaProp {
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

// Define a interface para as props da página, especificando o tipo de 'params'.
interface VendaDetalhesPageProps {
  params: {
    vendaId: string; // O ID da venda virá da URL dinâmica
  };
}

export default async function VendaDetalhesPage({ params }: VendaDetalhesPageProps) {
    const supabase = createServerComponentClient({ cookies });
    const { vendaId } = params;

    // Verifica se o usuário está autenticado
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        // Redireciona para a página de login ou exibe 404 se não autenticado
        return notFound();
    }
    
    // Buscando o ID da loja do usuário para a query de segurança
    // Isso garante que o usuário só possa ver vendas da sua própria loja.
    const { data: loja, error: lojaError } = await supabase.from('lojas').select('id').eq('usuario_id', user.id).single();
    const lojaId = loja?.id;

    if (lojaError || !lojaId) {
        console.error('Erro ao buscar ID da loja ou loja não encontrada para o usuário:', lojaError);
        return notFound(); // Se não encontrar a loja do usuário, não pode ver vendas
    }

    // Usando os nomes corretos de tabelas e colunas e ajustando a query de join
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
        .eq('loja_id', lojaId) // Filtro de segurança para garantir que a venda pertence à loja do usuário
        .single();

    if (vendaError || !venda) {
        console.error('Erro ao buscar a venda:', vendaError);
        return notFound(); // Venda não encontrada ou erro na busca
    }
    
    // Mapeamento corrigido para garantir que o tipo final seja compatível com DetalhesVendaProp
    // A query do Supabase com 'select' e 'join' retorna arrays, mesmo que a query principal seja single().
    const formattedVenda: DetalhesVendaProp = {
        ...venda,
        // O Supabase retorna 'cliente' como um array de objetos em alguns joins,
        // mesmo que a query .single() na venda garanta um único cliente.
        // Acessamos o primeiro elemento do array ou null.
        cliente: Array.isArray(venda.cliente) && venda.cliente.length > 0 ? venda.cliente[0] : null,
        itens_venda: (venda.itens_venda as any[]).map(item => ({
            ...item,
            // O Supabase retorna 'nome_produto' como um array de objetos. Pegamos o 'nome' do primeiro item.
            nome_produto: Array.isArray(item.nome_produto) && item.nome_produto.length > 0
                ? item.nome_produto[0].nome
                : 'Produto Indisponível'
        })),
    };

    return (
        <DetalhesDaVenda venda={formattedVenda} />
    );
}