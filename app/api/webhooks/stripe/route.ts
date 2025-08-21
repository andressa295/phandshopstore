// app/api/stripe-webhook/route.ts
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? '';
  const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

  if (!stripeSecretKey || !stripeWebhookSecret) {
    return NextResponse.json({ error: 'Chaves do Stripe não configuradas.' }, { status: 500 });
  }

  const stripe = new Stripe(stripeSecretKey, { apiVersion: '2025-06-30.basil' });


  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) return NextResponse.json({ error: 'Assinatura ausente.' }, { status: 400 });

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { supabase_user_id, loja_id, plan_name, is_annual } = session.metadata || {};

      if (!loja_id || !plan_name || !supabase_user_id) {
        throw new Error('Metadados essenciais ausentes.');
      }

      const { data: planoData, error: planoError } = await supabase
        .from('planos')
        .select('id')
        .eq('nome_plano', plan_name)
        .single();

      if (planoError || !planoData) throw new Error(`Plano '${plan_name}' não encontrado.`);

      const planoId = planoData.id;
      const now = new Date();
      const periodEnd = is_annual === 'true'
        ? new Date(now.setFullYear(now.getFullYear() + 1))
        : new Date(now.setMonth(now.getMonth() + 1));

      // Verificar assinatura existente
      const { data: existing, error: existingError } = await supabase
        .from('assinaturas')
        .select('id')
        .eq('loja_id', loja_id)
        .eq('status', 'ativa')
        .single();

      if (existing) {
        await supabase
          .from('assinaturas')
          .update({
            plano_id: planoId,
            periodo_atual_inicio: new Date().toISOString(),
            periodo_atual_fim: periodEnd.toISOString(),
            stripe_subscription_id: session.subscription,
          })
          .eq('id', existing.id);
      } else {
        await supabase
          .from('assinaturas')
          .insert({
            loja_id,
            plano_id: planoId,
            status: 'ativa',
            periodo_atual_inicio: new Date().toISOString(),
            periodo_atual_fim: periodEnd.toISOString(),
            stripe_subscription_id: session.subscription,
          });
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error: any) {
    console.error('Erro no webhook:', error);
    return NextResponse.json({ error: 'Erro interno.', details: error.message }, { status: 500 });
  }
}
