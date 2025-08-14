'use client';

import React, { useState, useEffect } from "react";
import styles from './Planos.module.css';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

import { FaGift, FaLightbulb, FaGem, FaRocket, FaCrown } from 'react-icons/fa';

const iconsMap: Record<string, React.ReactElement> = {
  'Plano Grátis': <FaGift />,
  'Plano Básico': <FaLightbulb />,
  'Plano Essencial': <FaGem />,
  'Plano Profissional': <FaRocket />,
  'Plano Premium': <FaCrown />,
};

interface Plano {
  id: string;
  nome_plano: string;
  preco_mensal: number;
  preco_anual: number;
  recursos: string[];
  stripe_price_id_mensal: string;
  stripe_price_id_anual: string;
  tarifa_venda_percentual: number;
  is_ativo: boolean;
}

const Planos = () => {
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAnnual, setShowAnnual] = useState(false);
  const [loadingButton, setLoadingButton] = useState<string | null>(null);
  const supabase = createClientComponentClient();
  const router = useRouter();

  useEffect(() => {
    const fetchPlanos = async () => {
      const { data, error: dbError } = await supabase
        .from('planos')
        .select('*')
        .eq('is_ativo', true)
        .order('preco_mensal', { ascending: true });

      if (dbError) {
        setError('Erro ao carregar planos. Tente novamente.');
        console.error(dbError);
      } else {
        setPlanos(data as Plano[]);
      }
      setLoading(false);
    };

    fetchPlanos();
  }, [supabase]);

  const handleSubscribe = async (plano: Plano, isAnnual: boolean) => {
    const buttonId = `${plano.nome_plano}-${isAnnual ? 'anual' : 'mensal'}`;
    setLoadingButton(buttonId);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push(`/cadastro?plano=${plano.nome_plano.toLowerCase().replace(/ /g, '_')}&recorrencia=${isAnnual ? 'anual' : 'mensal'}`);
      setLoadingButton(null);
      return;
    }

    if (plano.nome_plano === 'Plano Grátis') {
      router.push('/dashboard');
      setLoadingButton(null);
      return;
    }

    const priceId = isAnnual ? plano.stripe_price_id_anual : plano.stripe_price_id_mensal;
    if (!priceId) {
      alert('Erro ao iniciar o processo de pagamento. Entre em contato com o suporte.');
      setLoadingButton(null);
      return;
    }

    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId,
          planName: plano.nome_plano,
          isAnnual,
          supabaseUserId: user.id
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao iniciar checkout do Stripe.');
      }

      const { url } = await response.json();
      if (url) {
        router.push(url);
      } else {
        alert('Erro ao iniciar o processo de pagamento.');
        setLoadingButton(null);
      }
    } catch (error) {
      alert('Erro ao iniciar o processo de pagamento.');
      setLoadingButton(null);
    }
  };

  if (loading) {
    return <section className={styles.planosSection}><p>Carregando planos...</p></section>;
  }

  if (error) {
    return <section className={styles.planosSection}><p>{error}</p></section>;
  }

  return (
    <section className={styles.planosSection}>
      <div className={styles.toggleContainer}>
        <button
          className={`${styles.toggleButton} ${!showAnnual ? styles.activeToggle : ''}`}
          onClick={() => setShowAnnual(false)}
          disabled={loadingButton !== null}
        >
          Mensal
        </button>
        <button
          className={`${styles.toggleButton} ${showAnnual ? styles.activeToggle : ''}`}
          onClick={() => setShowAnnual(true)}
          disabled={loadingButton !== null}
        >
          Anual (16% OFF)
        </button>
      </div>

      <div className={styles.planosContainer}>
        {planos.map((plano, index) => (
          <div key={index} className={`${styles.planoCard} ${plano.nome_plano === 'Plano Profissional' ? styles.featured : ''}`}>
            {plano.nome_plano === 'Plano Profissional' && <div className={styles.featuredBadge}>MAIS POPULAR</div>}

            <div className={styles.cardHeader}>
              <div className={styles.icon}>{iconsMap[plano.nome_plano] || <FaGem />}</div>
              <h3 className={styles.planoName}>{plano.nome_plano}</h3>
            </div>

            <div className={styles.priceContainer}>
              <span className={styles.price}>
                {showAnnual ? `R$ ${plano.preco_anual.toFixed(2).replace('.', ',')}` : `R$ ${plano.preco_mensal.toFixed(2).replace('.', ',')}`}
              </span>
              <span className={styles.priceDetails}>{showAnnual ? `(por ano)` : `/mês`}</span>
            </div>
            {showAnnual && (
              <p className={styles.annualPriceDetail}>(pagamento único anual)</p>
            )}

            <hr className={styles.separator} />

            <ul className={styles.featuresList}>
              {plano.recursos.map((feature, featureIndex) => (
                <li key={featureIndex} dangerouslySetInnerHTML={{ __html: feature }}></li>
              ))}
            </ul>

            <div className={styles.cardFooter}>
              {plano.nome_plano === 'Plano Grátis' && <p className={styles.callout}>Neste plano, é aplicada uma tarifa de {plano.tarifa_venda_percentual}% por venda aprovada.</p>}
              <button
                onClick={() => handleSubscribe(plano, showAnnual)}
                className={styles.ctaButton}
                disabled={loadingButton !== null}
              >
                {loadingButton === `${plano.nome_plano}-${showAnnual ? 'anual' : 'mensal'}` 
                  ? 'Redirecionando...' 
                  : plano.nome_plano === 'Plano Grátis' ? 'Começar agora' : `Assinar ${plano.nome_plano}`}
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Planos;