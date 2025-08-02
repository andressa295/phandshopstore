// app/(interno)/dashboard/vendas/detalhes/[vendaId]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import DetalhesDaVenda from '../components/DetalhesDaVenda';

// Tipagem unificada para o componente de detalhes, que agora está correta.
interface ItemPedido {
    id: string;
    produto_id: string;
    quantidade: number;
    preco_unitario: number;
    nome_produto: { nome: string } | null;
}

interface VendaDetalheProp {
    id: string;
    created_at: string;
    cliente_id: string;
    cliente: { id: string; nome: string; email: string; telefone: string | null; cpfCnpj: string | null; } | null;
    status: 'concluida' | 'pendente' | 'cancelada' | 'em_processamento' | 'enviada' | 'entregue' | 'separando' | 'confeccao' | 'fabricacao' | 'arquivado' | string;
    valor_total: number;
    endereco_ent: string | null;
    observacoes_c: string | null;
    observacoes_i: string | null;
    tracking_link: string | null;
    tracking_cod: string | null;
    transportador: string | null;
    data_envio: string | null;
    items_pedido: ItemPedido[];
}

// Interface que corresponde exatamente à estrutura retornada pelo Supabase
interface SupabaseVenda {
    id: string;
    created_at: string;
    cliente_id: string;
    cliente: { id: string; nome: string; email: string; telefone: string | null; cpfCnpj: string | null; }[];
    status: string;
    valor_total: number;
    endereco_ent: string | null;
    observacoes_c: string | null;
    observacoes_i: string | null;
    tracking_link: string | null;
    tracking_cod: string | null;
    transportador: string | null;
    data_envio: string | null;
    items_pedido: { 
        id: string; 
        produto_id: string; 
        quantidade: number; 
        preco_unitario: number; 
        nome_produto: { nome: string }[]; // AQUI: o Supabase retorna um array
    }[];
}

export const metadata: Metadata = {
    title: 'Detalhes da Venda | Phandshop',
};

export default async function DetalheVendaPage({ params }: { params: { vendaId: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { vendaId } = params;

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return notFound();
    }

    const { data: venda, error } = await supabase
        .from('pedidos')
        .select(`
            id, created_at, status, valor_total, endereco_ent,
            observacoes_c, observacoes_i, tracking_link,
            tracking_cod, transportador, data_envio,
            cliente_id,
            cliente:clientes(id, nome, email, telefone, cpfCnpj),
            items_pedido:items_pedido(
                id, produto_id, quantidade, preco_unitario,
                nome_produto:produtos(nome)
            )
        `)
        .eq('id', vendaId)
        .single();

    if (error || !venda) {
        console.error('Erro ao buscar a venda:', error);
        return notFound();
    }

    // Mapeia o resultado do Supabase para a estrutura esperada pela interface do componente
    const formattedVenda: VendaDetalheProp = {
        id: venda.id,
        created_at: venda.created_at,
        cliente_id: venda.cliente_id,
        cliente: venda.cliente?.[0] || null,
        status: venda.status,
        valor_total: venda.valor_total,
        endereco_ent: venda.endereco_ent,
        observacoes_c: venda.observacoes_c,
        observacoes_i: venda.observacoes_i,
        tracking_link: venda.tracking_link,
        tracking_cod: venda.tracking_cod,
        transportador: venda.transportador,
        data_envio: venda.data_envio,
        // AQUI: Mapeia cada item para a estrutura correta
        items_pedido: (venda.items_pedido as any[]).map(item => ({
            ...item,
            nome_produto: item.nome_produto?.[0] || null, // Pega o primeiro item do array
        })),
    };

    return (
        <DetalhesDaVenda venda={formattedVenda} />
    );
}