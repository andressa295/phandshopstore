// =======================================================
// ARQUIVO: app/(interno)/dashboard/vendas/detalhes/types.ts
// =======================================================
// Este arquivo centraliza todas as interfaces de tipagem para a área de vendas.

import React from 'react'; // Necessário para React.ReactNode

// Interfaces para os dados brutos do Supabase (antes do mapeamento)
export interface ItemPedidoSupabaseRaw {
    id: string;
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
    nome_produto: { nome: string }[] | null; // Supabase retorna como array de objetos
}

export interface ClienteDetalheSupabaseRaw {
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
    documento: string | null;
}

export interface EnderecoRaw {
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
}

// Interface auxiliar para o retorno RAW da query da Venda do Supabase
export interface VendaRawFromSupabase {
    id: string;
    created_at: string;
    status: StatusVenda; // Usando o tipo de status definido abaixo
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


// Interfaces para os dados formatados que serão passados para os componentes
export interface ItemVendido {
    id: string;
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
    nome_produto: string; // Já formatado para string
}

export interface ClienteVenda { // Cliente formatado para o componente
    id: string;
    nome: string;
    email: string;
    telefone: string | null;
    documento: string | null;
}

export interface Endereco { // Endereço formatado para o componente
    rua: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    complemento?: string;
}

export type StatusVenda =
  | 'pendente'
  | 'pago'
  | 'cancelado'
  | 'enviado'
  | 'entregue'
  | 'separando'
  | 'confeccao'
  | 'fabricacao'
  | 'arquivado';

// Interface principal para os detalhes da venda (formato final para o componente DetalhesDaVenda)
export interface DetalhesVendaProp {
    id: string;
    created_at: string;
    status: StatusVenda;
    valor_total: number;
    metodo_pagamento: string;
    endereco_entrega: Endereco | null;
    observacoes_cliente: string | null;
    observacoes_internas: string | null;
    tracking_link: string | null;
    tracking_codigo: string | null;
    transportadora: string | null;
    data_envio: string | null;
    cliente: ClienteVenda | null; // Cliente já no formato final
    itens_venda: ItemVendido[];
}

// Interfaces para os componentes de Modal e Toast
export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    onSave?: () => void;
    saveButtonText?: string;
    className?: string;
}

export interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void; // Usado para cancelar/fechar
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    className?: string;
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';
