import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? '';
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY não está definida nas variáveis de ambiente.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil', // Use a versão mais recente da API Stripe
});

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
    }

    const { priceId, planName, isAnnual } = await req.json();

    if (!priceId || !planName || isAnnual === undefined) {
      return NextResponse.json({ error: 'Dados da requisição incompletos.' }, { status: 400 });
    }

    let stripeCustomerId: string;
    let lojaId: string; // Variável para armazenar o ID da loja

    // 1. Busca o ID da loja e o ID do cliente Stripe na tabela 'lojas'
    const { data: lojaData, error: lojaError } = await supabase
      .from('lojas')
      .select('id, stripe_customer_id') // Seleciona o ID da loja e o stripe_customer_id
      .eq('user_id', user.id) // Busca pela loja associada ao usuário logado
      .single();

    if (lojaError) {
      // Se o erro for 'PGRST116' (nenhuma linha encontrada), significa que o cliente Stripe ainda não existe para esta loja
      if (lojaError.code === 'PGRST116' || lojaError.details === 'The result contains 0 rows') {
        console.warn('Nenhuma loja encontrada para o usuário ou stripe_customer_id ausente. Tentando criar novo cliente Stripe.');
        // Se não encontrou a loja, pode ser um erro, ou o usuário ainda não tem uma loja criada corretamente.
        // Neste ponto, é crucial que a loja já exista, pois o cadastro já deveria ter criado.
        // Se chegou aqui e não tem loja, algo deu errado no cadastro.
        return NextResponse.json({ error: 'Loja não encontrada para o usuário autenticado.' }, { status: 404 });
      }
      console.error('Erro ao buscar dados da loja:', lojaError.message);
      return NextResponse.json({ error: 'Erro ao processar o pagamento.' }, { status: 500 });
    }

    lojaId = lojaData.id; // Armazena o ID da loja

    if (lojaData.stripe_customer_id) {
      stripeCustomerId = lojaData.stripe_customer_id;
    } else {
      // 2. Se a loja não tem ID do Stripe, cria um novo cliente no Stripe
      const customer = await stripe.customers.create({
        email: user.email, // Usa o email do usuário autenticado
        metadata: { 
          supabase_user_id: user.id,
          loja_id: lojaId // Adiciona o ID da loja no metadata do cliente Stripe
        },
      });

      stripeCustomerId = customer.id;

      // 3. Salva o ID do novo cliente do Stripe na tabela 'lojas'
      const { error: updateError } = await supabase
        .from('lojas')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', lojaId); // Atualiza a loja correta pelo seu ID

      if (updateError) {
        console.error('Erro ao salvar stripe_customer_id na tabela lojas:', updateError.message);
        return NextResponse.json({ error: 'Erro ao processar o pagamento.' }, { status: 500 });
      }
    }

    const lineItems = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // Adiciona session_id para webhook
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      customer: stripeCustomerId,
      metadata: {
        plan_name: planName,
        is_annual: isAnnual ? 'true' : 'false',
        supabase_user_id: user.id,
        loja_id: lojaId, // Passa o ID da loja para o webhook
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no handler da API de checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.', details: error.message }, { status: 500 });
  }
}