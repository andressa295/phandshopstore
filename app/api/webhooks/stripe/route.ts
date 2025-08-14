import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY ?? '';
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';

if (!stripeSecretKey || !stripeWebhookSecret) {
  throw new Error('As variáveis de ambiente do Stripe não estão definidas.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();
  const rawBody = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Assinatura do webhook ausente.' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, stripeWebhookSecret);
  } catch (err: any) {
    console.error(`Erro na assinatura do webhook: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    // Lidando com o evento de pagamento concluído
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      const {
        supabase_user_id,
        loja_id,
        plan_name,
        is_annual
      } = session.metadata || {};

      if (!loja_id || !plan_name || !supabase_user_id) {
        throw new Error('Metadados essenciais ausentes na sessão de checkout.');
      }

      // 1. Busca o ID do plano na sua tabela 'planos'
      const { data: planoData, error: planoError } = await supabase
        .from('planos')
        .select('id')
        .eq('nome_plano', plan_name)
        .single();

      if (planoError || !planoData) {
        throw new Error(`Plano '${plan_name}' não encontrado.`);
      }

      const planoId = planoData.id;
      const status = 'ativa'; // Define o status como ativo
      const now = new Date();
      const periodEnd = is_annual === 'true'
        ? new Date(now.setFullYear(now.getFullYear() + 1))
        : new Date(now.setMonth(now.getMonth() + 1));
      
      // 2. Insere ou atualiza a assinatura na sua tabela 'assinaturas'
      const { error: dbError } = await supabase
        .from('assinaturas')
        .insert({
          loja_id: loja_id,
          plano_id: planoId,
          status: status,
          periodo_atual_inicio: new Date().toISOString(),
          periodo_atual_fim: periodEnd.toISOString(),
          stripe_subscription_id: session.subscription,
        });

      if (dbError) {
        throw new Error(`Erro ao salvar a assinatura no banco de dados: ${dbError.message}`);
      }

      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Lidando com outros eventos de Stripe (opcional)
    // Ex: invoice.payment_succeeded, customer.subscription.updated, etc.
    // ...

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (error: any) {
    console.error('Erro no handler do webhook:', error);
    return NextResponse.json({ error: 'Erro interno do servidor.', details: error.message }, { status: 500 });
  }
}