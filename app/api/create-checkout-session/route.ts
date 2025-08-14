import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  // Movido o construtor do Stripe e a verificação para dentro da função POST
  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'STRIPE_SECRET_KEY não está definida.' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2025-06-30.basil',
  });

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
    let lojaId: string;

    const { data: lojaData, error: lojaError } = await supabase
      .from('lojas')
      .select('id, stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (lojaError) {
      if (lojaError.code === 'PGRST116' || lojaError.details === 'The result contains 0 rows') {
        return NextResponse.json({ error: 'Loja não encontrada para o usuário autenticado.' }, { status: 404 });
      }
      console.error('Erro ao buscar dados da loja:', lojaError.message);
      return NextResponse.json({ error: 'Erro ao processar o pagamento.' }, { status: 500 });
    }

    lojaId = lojaData.id;

    if (lojaData.stripe_customer_id) {
      stripeCustomerId = lojaData.stripe_customer_id;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { 
          supabase_user_id: user.id,
          loja_id: lojaId
        },
      });

      stripeCustomerId = customer.id;

      const { error: updateError } = await supabase
        .from('lojas')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', lojaId);

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
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      customer: stripeCustomerId,
      metadata: {
        plan_name: planName,
        is_annual: isAnnual ? 'true' : 'false',
        supabase_user_id: user.id,
        loja_id: lojaId,
      },
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no handler da API de checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.', details: error.message }, { status: 500 });
  }
}
