import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getSupabaseServerClient } from '@/lib/supabaseServer'; // Ajuste o caminho se 'lib' não estiver na raiz ou se o alias não estiver configurado

// Inicialize o Stripe com sua Secret Key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // @ts-ignore
  apiVersion: '2024-06-20', // Use a versão mais recente da API Stripe que é válida e suporta estas funcionalidades
});

export async function POST(req: Request) {
  const supabase = getSupabaseServerClient();

  try {
    const { data: { user } } = await supabase.auth.getUser(); // Usuário logado (pode ser null)

    const { priceId, planName, isAnnual, supabaseUserId } = await req.json(); // supabaseUserId vem do frontend (pode ser null)

    // --- LOGS DE ENTRADA ---
    console.log('--- Início da Requisição create-checkout-session ---');
    console.log('Dados recebidos do frontend:');
    console.log('  priceId:', priceId);
    console.log('  planName:', planName);
    console.log('  isAnnual:', isAnnual); // Deve ser true para planos anuais
    console.log('  supabaseUserId:', supabaseUserId);
    console.log('----------------------------------------------------');
    // --- FIM LOGS DE ENTRADA ---

    // --- Lógica para Plano Grátis ---
    if (planName === 'Plano Grátis') {
      if (!user) {
          console.error('Erro: Tentativa de ativar plano grátis sem usuário logado.');
          return NextResponse.json({ error: 'Erro: Usuário não logado para plano grátis. Redirecione para cadastro.' }, { status: 400 });
      }

      const { data: existingSub, error: existingSubError } = await supabase
        .from('subscriptions')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (existingSubError && existingSubError.code !== 'PGRST116') { // PGRST116 é "No rows found"
        console.error("Erro ao verificar assinatura existente para plano grátis:", existingSubError.message);
        return NextResponse.json({ error: 'Erro ao verificar plano existente.' }, { status: 500 });
      }

      if (existingSub) {
        console.log(`Usuário ${user.id} já possui uma assinatura existente, atualizando para plano grátis.`);
        const { error: updateProfileError } = await supabase
          .from('usuarios')
          .update({ plano: 'plano_gratis', recorrencia: 'mensal' }) // Atualiza o perfil do usuário
          .eq('id', user.id);

        if (updateProfileError) {
          console.error("Erro ao atualizar perfil para plano grátis:", updateProfileError.message);
          return NextResponse.json({ error: 'Erro ao atualizar seu plano para gratuito.' }, { status: 500 });
        }
        return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=plan_updated` }, { status: 200 });
      }

      console.log(`Registrando nova assinatura para plano grátis para o usuário ${user.id}.`);
      const { error: insertError } = await supabase.from('subscriptions').insert({
        user_id: user.id,
        stripe_customer_id: 'FREE_PLAN_CUSTOMER', // ID fictício para clientes grátis
        stripe_price_id: 'FREE_PLAN_PRICE', // ID fictício para o preço grátis
        status: 'active', // Plano grátis é ativo
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(new Date().setFullYear(new Date().getFullYear() + 100)).toISOString(), // Longa duração para grátis
      });

      if (insertError) {
        console.error("Erro ao registrar plano grátis:", insertError.message);
        return NextResponse.json({ error: 'Erro ao registrar plano gratuito.' }, { status: 500 });
      }

      const { error: updateProfileError } = await supabase
        .from('usuarios')
        .update({ plano: 'plano_gratis', recorrencia: 'mensal' })
        .eq('id', user.id);

      if (updateProfileError) {
        console.error("Erro ao atualizar perfil para plano grátis:", updateProfileError.message);
        return NextResponse.json({ error: 'Erro ao atualizar seu plano para gratuito.' }, { status: 500 });
      }

      console.log(`Plano grátis ativado para o usuário ${user.id}. Redirecionando.`);
      return NextResponse.json({
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=success`,
      }, { status: 200 });
    }
    // --- FIM Lógica para Plano Grátis ---

    // Validação para planos pagos
    if (!priceId || !planName) {
      console.error('Erro: ID do preço ou nome do plano ausente para planos pagos.');
      return NextResponse.json({ error: 'ID do preço e nome do plano são obrigatórios para planos pagos.' }, { status: 400 });
    }

    let stripeCustomerId: string | undefined = undefined; // Inicializa como undefined

    if (supabaseUserId) {
        // Busca perfil do usuário para pegar email e nome para o Stripe
        const { data: userProfile, error: profileError } = await supabase
            .from('usuarios')
            .select('nome, email')
            .eq('id', supabaseUserId)
            .single();

        if (profileError && profileError.code !== 'PGRST116') {
            console.error("Erro ao buscar perfil do usuário logado para plano pago:", profileError.message);
        } else if (userProfile) { // Se o perfil foi encontrado
            const { data: existingSub } = await supabase
                .from('subscriptions')
                .select('stripe_customer_id')
                .eq('user_id', supabaseUserId)
                .single();

            if (existingSub?.stripe_customer_id) {
                stripeCustomerId = existingSub.stripe_customer_id;
                console.log(`Cliente Stripe existente encontrado para o usuário ${supabaseUserId}: ${stripeCustomerId}`);
            } else {
                console.log(`Criando novo cliente Stripe para o usuário ${supabaseUserId}.`);
                const customer = await stripe.customers.create({
                    email: userProfile.email,
                    name: userProfile.nome,
                    metadata: { supabase_user_id: supabaseUserId },
                });
                stripeCustomerId = customer.id;
                console.log(`Cliente Stripe criado: ${stripeCustomerId}`);

                const { error: insertError } = await supabase.from('subscriptions').upsert({
                    user_id: supabaseUserId,
                    stripe_customer_id: stripeCustomerId,
                    status: 'customer_created',
                    stripe_price_id: priceId,
                }, { onConflict: 'user_id' });

                if (insertError) {
                    console.error("Erro ao salvar customer_id no Supabase:", insertError.message);
                }
            }
        }
    } else {
        console.log('Nenhum supabaseUserId fornecido. O Stripe criará um cliente convidado.');
    }

    const checkoutMode = isAnnual ? 'payment' : 'subscription';

    // --- LOG PARA VER O MODO DE CHECKOUT ---
    console.log('Modo de Checkout (checkoutMode):', checkoutMode); // Deve ser 'payment' para anuais
    // --- FIM LOG ---

    // Define paymentMethodOptions com parcelamento APENAS se o modo for 'payment'
    const paymentMethodOptions: Stripe.Checkout.SessionCreateParams.PaymentMethodOptions = {
        card: {}, // Inicializa as opções do cartão
    };

    if (checkoutMode === 'payment') {
        paymentMethodOptions.card = {
            installments: {
                enabled: true, // Habilita parcelamento
                // REMOVIDO: available_installments, pois não é uma propriedade válida aqui.
                // O Stripe determinará as opções de parcelamento automaticamente.
            },
        };
        console.log('Parcelamento habilitado (card) para o modo de pagamento.');
    } else {
        // Se for modo 'subscription' (planos mensais), o parcelamento não é habilitado.
        console.log('Parcelamento desabilitado (card) para o modo de assinatura.');
    }

    // --- LOG PARA VER AS OPÇÕES DE MÉTODO DE PAGAMENTO ---
    console.log('Opções de Método de Pagamento (paymentMethodOptions.card):', JSON.stringify(paymentMethodOptions.card));
    // --- FIM LOG ---

    // Cria sessão de checkout no Stripe
    console.log('Criando sessão de checkout do Stripe...');
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: checkoutMode,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/planos?status=cancel`,
      metadata: {
        supabase_user_id: supabaseUserId, // Passa o ID do usuário (ou null) para o metadata do Stripe
        plan_name: planName,
        is_annual: isAnnual ? 'true' : 'false',
      },
      allow_promotion_codes: true,
      payment_method_options: paymentMethodOptions, // Usa as opções condicionais
      // MÉTODOS DE PAGAMENTO ATIVOS NA SUA CONTA (Card e Boleto - APENAS SE ESTIVER ATIVADO NO DASHBOARD)
      // Com base na sua imagem, apenas 'card' está ativo.
      payment_method_types: ['card'], // Adicione 'boleto' aqui SOMENTE SE você ATIVAR ele no Stripe Dashboard.
                                      // Ex: payment_method_types: ['card', 'boleto'],
    });

    console.log('Sessão de checkout criada com sucesso. URL:', session.url);
    return NextResponse.json({ url: session.url }, { status: 200 });

  } catch (error: any) {
    console.error('--- ERRO AO CRIAR SESSÃO DE CHECKOUT DO STRIPE ---');
    console.error('Detalhes do erro:', error.message || error);
    if (error.raw) {
        console.error('Erro bruto do Stripe:', error.raw);
    }
    console.error('----------------------------------------------------');
    return NextResponse.json({ error: error.message || 'Erro interno do servidor.' }, { status: 500 });
  }
}