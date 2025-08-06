import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ListaDeVendas from './components/ListaDeVendas';
import './components/ListaDeVendas.css';
import { notFound } from 'next/navigation';

// Interface do cliente
interface Cliente {
    nome: string;
}

// Interface da venda
interface Venda {
    id: string;
    created_at: string;
    cliente: Cliente | null;
    valor_total: number;
    status:
        | 'pendente'
        | 'pago'
        | 'cancelado'
        | 'enviado'
        | 'arquivado'
        | 'entregue'
        | 'separando'
        | 'confeccao'
        | 'fabricacao';
}

export const metadata: Metadata = {
    title: 'Lista de Vendas | Phandshop',
};

export default async function VendasPage() {
    const supabase = createServerComponentClient({ cookies });

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

    if (lojaError && lojaError.code !== 'PGRST116') {
        console.error('Erro ao buscar a loja do usuário:', lojaError);
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">
                    Erro: Ocorreu um problema ao buscar os dados da sua loja.
                </p>
            </div>
        );
    }

    const lojaId = loja?.id;
    if (!lojaId) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-gray-500">
                    Você ainda não tem uma loja cadastrada. Por favor, crie uma para gerenciar suas vendas.
                </p>
            </div>
        );
    }

    const { data: initialVendas, error } = await supabase
        .from('vendas')
        .select('id, created_at, valor_total, status, cliente:clientes(nome)')
        .eq('loja_id', lojaId)
        .order('created_at', { ascending: false })
        .limit(10);

    if (error) {
        console.error('Erro ao buscar vendas:', error);
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-red-500">Erro ao carregar a lista de vendas.</p>
                <p className="text-sm text-gray-400">
                    Detalhes do erro: {JSON.stringify(error, null, 2)}
                </p>
            </div>
        );
    }
    
    const vendasFormatadas: Venda[] = (initialVendas as any[]).map((venda) => ({
        ...venda,
        cliente:
            Array.isArray(venda.cliente) && venda.cliente.length > 0
                ? venda.cliente[0]
                : null,
    }));

    // CORREÇÃO: Renderiza o componente `ListaDeVendas` mesmo que não haja vendas
    return <ListaDeVendas lojaId={lojaId} initialVendas={vendasFormatadas} />;
}
