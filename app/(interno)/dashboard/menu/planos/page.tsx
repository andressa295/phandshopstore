// PlanosPage.tsx
'use client';

import React, { useState, useEffect } from 'react';
import styles from './PlanosPage.module.css';
import { FaGift, FaLightbulb, FaGem, FaRocket, FaCrown } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { MdBusiness } from 'react-icons/md'; // Importação Material Design

const planosData = [
  { icon: <FaGift />, id: 'gratis', name: 'Plano Grátis', monthlyPrice: 'R$ 0,00', monthlyPriceDetails: '', annualFullPrice: 'R$ 0,00', annualMonthlyEquivalent: null, features: ['Até 15 produtos cadastrados','Tema padrão com design responsivo','Integração com meios de pagamento','Integração com transportadoras','Atendimento via WhatsApp','Certificado de segurança','Aviso-me quando chegar','Guias de Tamanho','Dashboard simples','Acesso ao App do lojista'], isFeatured: false, stripePriceIdMonthly: null, stripePriceIdAnnual: null },
  { icon: <FaLightbulb />, id: 'basico', name: 'Plano Básico', monthlyPrice: 'R$ 69,00', monthlyPriceDetails: '/mês', annualFullPrice: 'R$ 699,00', annualMonthlyEquivalent: 'R$ 58,25/mês', features: ['Tudo do plano Grátis, e mais:','Produtos ilimitados','Suporte via Chat e E-mail','Tarifa por venda de 0%','Certificado SSL Avançado','Domínio próprio','Acesso a temas gratuitos','Sacolinha do Instagram','Painel com estatísticas básicas'], isFeatured: false, stripePriceIdMonthly: 'price_id_basico_mensal', stripePriceIdAnnual: 'price_id_basico_anual' },
  { icon: <FaGem />, id: 'essencial', name: 'Plano Essencial', monthlyPrice: 'R$ 99,00', monthlyPriceDetails: '/mês', annualFullPrice: 'R$ 999,00', annualMonthlyEquivalent: 'R$ 83,25/mês', features: ['Tudo do plano Básico, e mais:','Temas premium','Tarifa 0%','Dashboard completo com métricas','Domínio próprio + redirecionamento','Funcionalidade de cupons','Acesso a automação básica'], isFeatured: false, stripePriceIdMonthly: 'price_id_essencial_mensal', stripePriceIdAnnual: 'price_id_essencial_anual' },
  { icon: <FaRocket />, id: 'profissional', name: 'Plano Profissional', monthlyPrice: 'R$ 149,00', monthlyPriceDetails: '/mês', annualFullPrice: 'R$ 1.499,00', annualMonthlyEquivalent: 'R$ 124,92/mês', features: ['Tudo do plano Essencial, e mais:','Compre Junto','Brindes no Carrinho','Upsell e Cross-sell','Recuperação de carrinho abandonado','Relatórios detalhados','Multi-admin'], isFeatured: true, stripePriceIdMonthly: 'price_id_profissional_mensal', stripePriceIdAnnual: 'price_id_profissional_anual' },
  { icon: <FaCrown />, id: 'premium', name: 'Plano Premium', monthlyPrice: 'R$ 249,90', monthlyPriceDetails: '/mês', annualFullPrice: 'R$ 2.499,00', annualMonthlyEquivalent: 'R$ 208,25/mês', features: ['Tudo do plano Profissional, e mais:','Relatórios complexos','Atendimento prioritário','Acesso antecipado','Domínio grátis','Acesso a parceiros','Consultoria mensal','Loja feita pra você em até 15 dias'], isFeatured: false, stripePriceIdMonthly: 'price_id_premium_mensal', stripePriceIdAnnual: 'price_id_premium_anual' },
  { icon: <MdBusiness />, id: 'Business', name: 'Plano Business', monthlyPrice: 'R$ 499,00', monthlyPriceDetails: '/mês', annualFullPrice: 'R$ 4.990,00', annualMonthlyEquivalent: 'R$ 415,83/mês', features: ['Tudo do plano Profissional, e mais:','Multi-loja (várias lojas no mesmo painel)','Loja B2B/Atacado e Varejo no mesmo ambiente','API aberta e integrações avançadas','Relatórios financeiros preditivos','Onboarding personalizado (configuração completa com especialista)','Suporte VIP (fila exclusiva, WhatsApp/telefone direto)','Usuários ilimitados com controle de permissões', 'CDN premium (melhor performance e escalabilidade)'], isFeatured: false, stripePriceIdMonthly: 'price_id_premium_mensal', stripePriceIdAnnual: 'price_id_premium_anual' },

];

const PlanosPage: React.FC = () => {
  const [showAnnual, setShowAnnual] = useState(false);
  const [loadingCheckout, setLoadingCheckout] = useState(false);
  const [expandedPlanId, setExpandedPlanId] = useState<string | null>(null);
  const [currentPlanId, setCurrentPlanId] = useState<string | null>(null);

  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const fetchUserPlan = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data, error } = await supabase.from('subscriptions').select('plan_id').eq('user_id', user.id).single();
      if (!error && data) setCurrentPlanId(data.plan_id);
    };
    fetchUserPlan();
  }, []);

  const handlePlanToggle = (planId: string) => setExpandedPlanId(expandedPlanId === planId ? null : planId);

  const handleUpgradeDowngrade = async (plan: typeof planosData[0], isAnnual: boolean) => {
    if (!currentPlanId) return;
    const priceId = isAnnual ? plan.stripePriceIdAnnual : plan.stripePriceIdMonthly;
    if (!priceId) { alert('Não é possível assinar esse plano.'); return; }
    setLoadingCheckout(true);
    try {
      const response = await fetch('/api/create-checkout-session', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ priceId, planName: plan.name, isAnnual }) });
      if (!response.ok) { const errorData = await response.json(); throw new Error(errorData.error || 'Falha ao iniciar checkout'); }
      const { url } = await response.json(); if(url) router.push(url);
    } catch (error: any) { alert('Erro ao iniciar checkout: ' + error.message); console.error(error); setLoadingCheckout(false); }
  };

  return (
    <section className={styles.planosSection}>
      <div className={styles.toggleContainer}>
        <button className={`${styles.toggleButton} ${!showAnnual ? styles.activeToggle : ''}`} onClick={() => setShowAnnual(false)} disabled={loadingCheckout}>Mensal</button>
        <button className={`${styles.toggleButton} ${showAnnual ? styles.activeToggle : ''}`} onClick={() => setShowAnnual(true)} disabled={loadingCheckout}>Anual (16% OFF!)</button>
      </div>

      <div className={styles.plansGrid}>
        {planosData.map((plano, index) => {
          const isCurrent = plano.id === currentPlanId;
          const currentIndex = planosData.findIndex(p => p.id === currentPlanId);
          const isUpgrade = currentPlanId && index > currentIndex;
          const isDowngrade = currentPlanId && index < currentIndex;

          return (
            <div key={plano.id} className={styles.planCard}>
              <div className={styles.planHeader}>
                <div className={styles.icon}>{plano.icon}</div>
                <h2 className={styles.planName}>{plano.name}</h2>
                <p className={styles.planPrice}>
                  {showAnnual ? plano.annualFullPrice : plano.monthlyPrice}
                  <span className={styles.pricePerMonth}>{showAnnual ? '' : '/mês'}</span>
                </p>
                {plano.annualFullPrice !== 'R$ 0,00' && plano.annualMonthlyEquivalent && (
                  <p className={styles.annualPrice}>ou {plano.annualMonthlyEquivalent} no plano anual</p>
                )}
                {isCurrent && <span className={styles.currentPlanLabel}>Plano Atual</span>}
              </div>

              {expandedPlanId === plano.id && (
                <div className={styles.planFeatures}>
                  <h3 className={styles.featuresTitle}>Recursos incluídos:</h3>
                  <ul className={styles.featureList}>
                    {plano.features.map((feature, idx) => (
                      <li key={idx} className={styles.featureItem}><span className={styles.checkmark}>&#10003;</span> {feature}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={styles.planCardActions}>
                <button className={styles.detailsButton} onClick={() => handlePlanToggle(plano.id)}>
                  {expandedPlanId === plano.id ? 'Ocultar detalhes' : 'Ver detalhes'}
                </button>

                <button
                  className={styles.ctaButton}
                  disabled={isCurrent || loadingCheckout}
                  onClick={() => handleUpgradeDowngrade(plano, showAnnual)}
                >
                  {isCurrent ? 'Plano Atual' : isUpgrade ? 'Fazer Upgrade' : isDowngrade ? 'Fazer Downgrade' : 'Assinar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default PlanosPage;
