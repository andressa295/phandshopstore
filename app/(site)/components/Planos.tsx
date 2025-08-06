'use client';

import React, { useState, useEffect } from "react";
import styles from './Planos.module.css';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import { FaGift, FaLightbulb, FaGem, FaRocket, FaCrown } from 'react-icons/fa';

const colors = {
  primary: '#6b21a8', secondary: '#a21caf', accent: '#7C3AED', text: '#333333', lightText: '#666666', border: '#e0e0e0', background: '#f8f9fa', white: '#ffffff', success: '#28a745', danger: '#dc3545', warning: '#ffc107', info: '#17a2b8',
};

const typography = {
  fontFamily: 'Poppins, sans-serif', headingSize: '1.8rem', subHeadingSize: '1.2rem', bodySize: '0.95rem', smallSize: '0.8rem',
};

const planosData = [
  {
    icon: <FaGift />,
    name: 'Plano Grátis',
    monthlyPrice: 'R$ 0,00', monthlyPriceDetails: '', annualFullPrice: 'R$ 0,00', annualMonthlyEquivalent: null,
    features: [ 'Até 30 produtos cadastrados', 'Tema padrão com design responsivo e profissional', 'Integração com meios de pagamento', 'Integração com transportadoras (Envios)', 'Atendimento via WhatsApp para seus clientes', 'Certificado de segurança padrão', 'Aviso-me quando chegar', 'Guias de Tamanho', 'Dashboard simples de pedidos e vendas','Acesso ao App do lojista' ],
    callout: 'Neste plano, é aplicada uma tarifa de 2.5% por venda aprovada.',
    buttonText: 'Começar agora', isFeatured: false, stripePriceIdMonthly: null, stripePriceIdAnnual: null,
  },
  {
    icon: <FaLightbulb />,
    name: 'Plano Básico',
    monthlyPrice: 'R$ 69,90', monthlyPriceDetails: '/mês', annualFullPrice: 'R$ 699,00', annualMonthlyEquivalent: 'R$ 58,25/mês',
    features: [ 'Tudo do plano Grátis, e mais:', 'Produtos ilimitados', 'Suporte via Chat e E-mail', 'Tarifa por venda de 0%', 'Certificado de Segurança SSL Avançado', 'Domínio próprio personalizado' , 'Acesso a temas gratuitos', 'Sacolinha do Instagram', 'Painel administrativo com estatísticas básicas' ],
    callout: null, buttonText: 'Assinar Básico', isFeatured: false,
    stripePriceIdMonthly: 'price_1Rp0azK7GLhCiTF0MTeciHgh',
    stripePriceIdAnnual: 'price_1RpigWK7GLhCiTF0nw2zjXMk', 
  },
  {
    icon: <FaGem />,
    name: 'Plano Essencial',
    monthlyPrice: 'R$ 99,90', monthlyPriceDetails: '/mês', annualFullPrice: 'R$ 999,00', annualMonthlyEquivalent: 'R$ 83,25/mês',
    features: [ 'Tudo do plano Básico, e mais:', 'Temas premium', 'Tarifa por venda de 0%', 'Dashboard completo com métricas de vendas, produtos mais vendidos, abandono de carrinho', 'Domínio próprio + redirecionamento inteligente', 'Funcionalidade de cupons de desconto', 'Acesso a automação de e-mails básicos', ],
    callout: null, buttonText: 'Assinar Essencial', isFeatured: false,
    stripePriceIdMonthly: 'price_1Rp0brK7GLhCiTF0OeTdh8vJ',
    stripePriceIdAnnual: 'price_1RpifQK7GLhCiTF0nzZF0WiR', 
  },
  {
    icon: <FaRocket />,
    name: 'Plano Profissional',
    monthlyPrice: 'R$ 149,90', monthlyPriceDetails: '/mês', annualFullPrice: 'R$ 1.499,00', annualMonthlyEquivalent: 'R$ 124,92/mês',
    features: [ 'Tudo do plano Essencial, e mais:', 'Compre Junto', 'Brindes no Carrinho', 'Upsell e Cross-sell automáticos', 'Recuperação de carrinho abandonado automática', 'Relatórios de vendas, clientes e produtos detalhados', 'Multi-admin (criação de subusuários com permissões)' ],
    callout: null, buttonText: 'Assinar Profissional', isFeatured: true,
    stripePriceIdMonthly: 'price_1Rp0cfK7GLhCiTF0VSO36ysl',
    stripePriceIdAnnual: 'price_1Rpie2K7GLhCiTF0BYgs0Gp5', 
  },
  {
    icon: <FaCrown />,
    name: 'Plano Premium',
    monthlyPrice: 'R$ 249,90', monthlyPriceDetails: '/mês', annualFullPrice: 'R$ 2.499,00', annualMonthlyEquivalent: 'R$ 208,25/mês',
    features: [ 'Tudo do plano Profissional, e mais:', 'Relatórios complexos e customizados', 'Atendimento prioritário (WhatsApp direto com especialista)', 'Acesso Antecipado a novas funcionalidades', 'Domínio grátis no plano anual (1º ano de domínio incluso)', 'Acesso ao programa de parceiros e marketplace', 'Consultoria estratégica 1x ao mês ','Loja feita pra você, em até 15 dias (Ao assinar o plano anual, nossa equipe configura sua loja do zero)' ],
    callout: null, buttonText: 'Assinar Premium', isFeatured: false,
    stripePriceIdMonthly: 'price_1Rp0dDK7GLhCiTF0cDcu7cay',
    stripePriceIdAnnual: 'price_1Rpid4K7GLhCiTF08Tcs9F4g', 
  },
];

const Planos = () => {
  const [showAnnual, setShowAnnual] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSubscribe = async (plan: typeof planosData[0], isAnnual: boolean) => {
    setLoadingCheckout(true);

    const { data: { user } } = await supabase.auth.getUser();

    // Lógica corrigida:
    // 1. Se o usuário NÃO estiver logado, redireciona para o cadastro.
    if (!user) {
      console.log("Usuário não logado. Redirecionando para cadastro.");
      router.push(`/cadastro?plano=${plan.name.toLowerCase().replace(/ /g, '_')}&recorrencia=${isAnnual ? 'anual' : 'mensal'}`);
      setLoadingCheckout(false);
      return;
    }

    // 2. Se o usuário estiver logado e escolheu o plano GRÁTIS,
    // apenas redireciona para o dashboard, pois não há pagamento.
    if (plan.name === 'Plano Grátis') {
      console.log("Usuário logado e escolheu o Plano Grátis. Redirecionando para dashboard.");
      router.push('/dashboard');
      setLoadingCheckout(false);
      return;
    }

    // 3. Se o usuário estiver logado e escolheu um plano pago,
    // continua para o processo de checkout do Stripe.
    const priceId = isAnnual ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly;
    if (!priceId) {
      console.error("Erro: priceId do Stripe não encontrado para o plano selecionado:", plan.name, isAnnual);
      alert('Erro ao iniciar o processo de pagamento. Entre em contato com o suporte.');
      setLoadingCheckout(false);
      return;
    }

    console.log("Iniciando checkout do Stripe para priceId:", priceId);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: priceId,
          planName: plan.name,
          isAnnual: isAnnual,
          supabaseUserId: user.id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Falha ao iniciar checkout do Stripe.');
      }

      const { url } = await response.json();
      if (url) {
        router.push(url);
      }
    } catch (error: any) {
      console.error('Erro ao iniciar checkout:', error.message);
      alert('Erro ao iniciar o processo de pagamento: ' + error.message);
      setLoadingCheckout(false);
    }
  };

  return (
    <section className={styles.planosSection}>
      <div className={styles.toggleContainer}>
        <button
          className={`${styles.toggleButton} ${!showAnnual ? styles.activeToggle : ''}`}
          onClick={() => setShowAnnual(false)}
          disabled={loadingCheckout}
        >
          Mensal
        </button>
        <button
          className={`${styles.toggleButton} ${showAnnual ? styles.activeToggle : ''}`}
          onClick={() => setShowAnnual(true)}
          disabled={loadingCheckout}
        >
          Anual (2 meses grátis!)
        </button>
      </div>

      <div className={styles.planosContainer}>
        {planosData.map((plano, index) => (
          <div key={index} className={`${styles.planoCard} ${plano.isFeatured ? styles.featured : ''}`}>

            {plano.isFeatured && <div className={styles.featuredBadge}>MAIS POPULAR</div>}

            <div className={styles.cardHeader}>
              <div className={styles.icon}>{plano.icon}</div>
              <h3 className={styles.planoName}>{plano.name}</h3>
            </div>

            <div className={styles.priceContainer}>
              <span className={styles.price}>
                {showAnnual ? plano.annualFullPrice : plano.monthlyPrice}
              </span>
              {showAnnual ? (
                plano.annualMonthlyEquivalent && <span className={styles.priceDetails}>{plano.annualMonthlyEquivalent}</span>
              ) : (
                plano.monthlyPriceDetails && <span className={styles.priceDetails}>{plano.monthlyPriceDetails}</span>
              )}
            </div>

            {showAnnual && plano.name !== 'Plano Grátis' && (
                <p className={styles.annualPriceDetail}>
                    (pagamento único anual)
                </p>
            )}
            
            <hr className={styles.separator} />

            <ul className={styles.featuresList}>
              {plano.features.map((feature, featureIndex) => (
                <li key={featureIndex} dangerouslySetInnerHTML={{ __html: feature }}></li>
              ))}
            </ul>

            <div className={styles.cardFooter}>
              {plano.callout && <p className={styles.callout}>{plano.callout}</p>}
              <button
                onClick={() => handleSubscribe(plano, showAnnual)}
                className={styles.ctaButton}
                disabled={loadingCheckout}
              >
                {loadingCheckout ? 'Redirecionando...' : plano.buttonText}
              </button>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Planos;
