import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? '';
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY n\u00e3o est\u00e1 definida nas vari\u00e1veis de ambiente.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Acesso n\u00e3o autorizado.' }, { status: 401 });
    }

    const { priceId, planName, isAnnual } = await req.json();

    if (!priceId || !planName || isAnnual === undefined) {
      return NextResponse.json({ error: 'Dados da requisi\u00e7\u00e3o incompletos.' }, { status: 400 });
    }

    let stripeCustomerId: string;
    let email = user.email;

    if (!email) {
        console.error('E-mail do usu\u00e1rio n\u00e3o encontrado.');
        return NextResponse.json({ error: 'E-mail do usu\u00e1rio n\u00e3o encontrado.' }, { status: 400 });
    }

    // 1. Busca o ID do cliente Stripe na tabela 'usuarios'
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userError && userError.code !== 'PGRST116') {
      console.error('Erro ao buscar o ID do cliente Stripe:', userError.message);
      return NextResponse.json({ error: 'Erro ao processar o pagamento.' }, { status: 500 });
    }

    if (userData?.stripe_customer_id) {
      stripeCustomerId = userData.stripe_customer_id;
    } else {
      // 2. Se o cliente n\u00e3o tem ID do Stripe, cria um novo
      const customer = await stripe.customers.create({
        email,
        metadata: { supabase_user_id: user.id },
      });

      stripeCustomerId = customer.id;

      // 3. Salva o ID do novo cliente do Stripe na tabela 'usuarios'
      const { error: updateError } = await supabase
        .from('usuarios')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', user.id);

      if (updateError) {
        console.error('Erro ao salvar stripe_customer_id no Supabase:', updateError.message);
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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      customer: stripeCustomerId,
      metadata: {
        plan_name: planName,
        is_annual: isAnnual ? 'true' : 'false',
        supabase_user_id: user.id, // Usando o ID do usuário autenticado no servidor, que é mais seguro
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no handler da API de checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.', details: error.message }, { status: 500 });
  }
}
