import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

// Usa o operador de coalescência nula (??) para fornecer um valor padrão
// em ambientes onde a variável não está definida. Isso permite que a aplicação
// inicie, mas ainda vai falhar em tempo de execução se a chave não estiver lá.
const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? '';
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY não está definida nas variáveis de ambiente.');
}

const stripe = new Stripe(stripeSecretKey, {
  // CORREÇÃO: Usando a versão da API do Stripe que o seu ambiente espera.
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  try {
    const { data: { user } } = await supabase.auth.getUser();

    // Lógica para verificar se o usuário está logado
    if (!user) {
      return NextResponse.json({ error: 'Acesso não autorizado.' }, { status: 401 });
    }

    const { priceId, planName, isAnnual, supabaseUserId } = await req.json();

    const lineItems = [
      {
        price: priceId,
        quantity: 1,
      },
    ];

    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single();

    if (userError || !userData?.stripe_customer_id) {
      console.error('Erro ao buscar o ID do cliente Stripe:', userError?.message || 'ID do cliente não encontrado.');
      return NextResponse.json({ error: 'Erro ao processar o pagamento.' }, { status: 500 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: lineItems,
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      customer: userData.stripe_customer_id,
      metadata: {
        plan_name: planName,
        is_annual: isAnnual ? 'true' : 'false',
        supabase_user_id: supabaseUserId,
      },
    });

    return NextResponse.json({ sessionId: session.id }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no handler da API de checkout:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.', details: error.message }, { status: 500 });
  }
}
