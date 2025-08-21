// app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? '';

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();
  const body = await req.json();
  const { priceId, planName, isAnnual, supabaseUserId } = body;

  if (!stripeSecretKey) {
    return NextResponse.json({ error: 'Chave do Stripe não configurada.' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-06-30.basil' });


  // Buscar loja do usuário
  const { data: lojaData, error: lojaError } = await supabase
    .from('lojas')
    .select('id')
    .eq('user_id', supabaseUserId)
    .single();

  if (lojaError || !lojaData) {
    return NextResponse.json({ error: 'Loja do usuário não encontrada.' }, { status: 400 });
  }

  const lojaId = lojaData.id;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [
        { price: priceId, quantity: 1 }
      ],
      metadata: {
        supabase_user_id: supabaseUserId,
        loja_id: lojaId,
        plan_name: planName,
        is_annual: isAnnual ? 'true' : 'false',
      },
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/planos`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Erro ao criar checkout session:', error);
    return NextResponse.json({ error: 'Erro ao criar checkout session.' }, { status: 500 });
  }
}
