import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers'; 
// Inicialize o Stripe com sua Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore 
  apiVersion: '2024-06-20', 
});

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado.' }, { status: 401 });
    }

    const { priceId, planName, isAnnual } = await req.json();

    if (planName === 'Plano Grátis') {
      const { data: existingSub, error: existingSubError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingSubError && existingSubError.code !== 'PGRST116') { // PGRST116 é "No rows found"
        console.error("Erro ao verificar assinatura existente para plano grátis:", existingSubError);
        return NextResponse.json({ error: 'Erro ao verificar plano existente.' }, { status: 500 });
      }

      if (existingSub) {
        
        const { error: updateProfileError } = await supabase
          .from('usuarios')
          .update({ plano: 'plano_gratis', recorrencia: 'mensal' }) // Atualiza o perfil do usuário
          .eq('id', user.id);

        if (updateProfileError) {
          console.error("Erro ao atualizar perfil para plano grátis:", updateProfileError);
          return NextResponse.json({ error: 'Erro ao atualizar seu plano para gratuito.' }, { status: 500 });
        }
        return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=plan_updated` }, { status: 200 });
      }

      const { error: insertError } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        stripe_customer_id: 'FREE_PLAN_CUSTOMER', // ID fictício para clientes grátis
        stripe_price_id: 'FREE_PLAN_PRICE', // ID fictício para o preço grátis
        status: 'active', // Plano grátis é ativo
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(new Date().setFullYear(new Date().getFullYear() + 100)).toISOString(), // Longa duração para grátis
      });

      if (insertError) {
        console.error("Erro ao registrar plano grátis:", insertError);
        return NextResponse.json({ error: 'Erro ao registrar plano gratuito.' }, { status: 500 });
      }

      // Atualiza o perfil do usuário para o plano grátis
      const { error: updateProfileError } = await supabase
        .from('usuarios')
        .update({ plano: 'plano_gratis', recorrencia: 'mensal' })
        .eq('id', user.id);

      if (updateProfileError) {
        console.error("Erro ao atualizar perfil para plano grátis:", updateProfileError);
        return NextResponse.json({ error: 'Erro ao atualizar seu plano para gratuito.' }, { status: 500 });
      }

      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=success`,
      }, { status: 200 });
    }


    // Validação para planos pagos (continua a partir daqui)
    if (!priceId || !planName) {
      return NextResponse.json({ error: 'ID do preço e nome do plano são obrigatórios para planos pagos.' }, { status: 400 });
    }

    // Busca perfil do usuário para pegar email e nome (já existe)
    const { data: userProfile, error: profileError } = await supabase
      .from('usuarios')
      .select('nome, email')
      .eq('id', user.id)
      .single();

    if (profileError || !userProfile) {
      console.error("Erro ao buscar perfil do usuário:", profileError);
      return NextResponse.json({ error: 'Erro ao obter dados do usuário.' }, { status: 500 });
    }

    let customerId: string;

    // Verifica se já existe cliente Stripe cadastrado pra esse usuário
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('user_id', user.id)
      .single();

    if (existingSub?.stripe_customer_id) {
      customerId = existingSub.stripe_customer_id;
    } else {
      // Cria cliente no Stripe
      const customer = await stripe.customers.create({
        email: userProfile.email,
        name: userProfile.nome,
        metadata: { supabase_user_id: user.id },
      });

      customerId = customer.id;

      // Salva customer_id no Supabase
      const { error: insertError } = await supabase.from('subscriptions').upsert({
        user_id: user.id,
        stripe_customer_id: customerId,
        status: 'customer_created',
        
      }, { onConflict: 'user_id' }); 

      if (insertError) {
        console.error("Erro ao salvar customer_id:", insertError);
        return NextResponse.json({ error: 'Falha ao vincular usuário ao Stripe.' }, { status: 500 });
      }
    }

    // Cria sessão de checkout no Stripe
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/planos?status=cancel`,
      metadata: {
        supabase_user_id: user.id,
        plan_name: planName,
        is_annual: isAnnual ? 'true' : 'false',
      },
      allow_promotion_codes: true,
      payment_method_options: {
        card: { installments: { enabled: true } },
      },
      payment_method_types: ['card', 'boleto', 'pix'],
    });

    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error('Erro ao criar sessão de checkout do Stripe:', error.message || error);
    return NextResponse.json({ error: error.message || 'Erro interno do servidor.' }, { status: 500 });
  }
}
