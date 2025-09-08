// Este é um Server Component que busca os dados
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import OrderList from '../../components/OrderList'; // Componente do lado do cliente que irá renderizar a lista

// A interface para os dados que o componente vai receber
interface Order {
    id: string;
    status: string;
    valor_total: number;
    created_at: string;
}

export default async function OrdersPage({ params }: { params: { lojaSlug: string } }) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { user } } = await supabase.auth.getUser();

    // Se o cliente não estiver logado, redireciona para a página de login
    if (!user) {
        redirect(`/${params.lojaSlug}/login`);
    }

    // Busca todos os pedidos do cliente logado
    const { data: orders, error } = await supabase
        .from('pedidos')
        .select('*')
        .eq('user_id', user.id) // A busca segura: apenas os pedidos deste cliente
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Erro ao buscar pedidos do cliente:', error);
        return <div>Não foi possível carregar seus pedidos.</div>;
    }
    
    // Passa os pedidos para o componente do lado do cliente para renderizar
    return <OrderList orders={orders as Order[]} lojaSlug={params.lojaSlug} />;
}