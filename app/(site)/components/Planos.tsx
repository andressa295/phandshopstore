// Planos.tsx
import React from 'react';
import styles from './Planos.module.css';

// --- Dados dos Planos ---
// Manter os dados separados da lógica de renderização facilita a manutenção.
const planosData = [
  {
    icon: '🆓',
    name: 'Plano Grátis',
    price: 'R$ 0,00',
    priceDetails: '',
    annualPrice: null,
    features: [
      'Até 50 produtos cadastrados',
      'Tema Padrão para sua loja (Layout único)',
      'Integração com meios de pagamento',
      'Integração com transportadoras (Envios)',
      'Atendimento via WhatsApp para seus clientes',
      'Certificado de Segurança SSL Gratuito',
      'Aviso-me quando chegar',
      'Guias de Tamanho',
    ],
    callout: 'Neste plano, é aplicada uma tarifa de 2.5% por venda aprovada.',
    buttonText: 'Começar agora',
    isFeatured: false,
  },
  {
    icon: '💎',
    name: 'Plano Essencial',
    price: 'R$ 79,90',
    priceDetails: '/mês',
    annualPrice: 'ou R$ 49,90/mês no plano anual',
    features: [
      '✅ Tudo do plano Grátis, e mais:',
      'Acesso a todos os Temas para personalizar sua loja',
      'Tarifa por venda de 0%',
      'Produtos, visitas e usuários ilimitados',
      'Domínio próprio',
      'Sacolinha do Instagram',
      'Ferramentas de Personalização Avançada',
    ],
    callout: null,
    buttonText: 'Escolher Essencial',
    isFeatured: false,
  },
  {
    icon: '🚀',
    name: 'Plano Profissional',
    price: 'R$ 149,90',
    priceDetails: '/mês',
    annualPrice: 'ou R$ 119,90/mês no plano anual',
    features: [
      '✅ Tudo do plano Essencial, e mais:',
      'Acesso a Temas Profissionais',
      'Compre Junto',
      'Brindes no Carrinho',
      'Relatórios Avançados',
    ],
    callout: null,
    buttonText: 'Escolher Profissional',
    isFeatured: true, // Este será nosso plano em destaque
  },
  {
    icon: '👑',
    name: 'Plano Phand Premium',
    price: 'R$ 299,90',
    priceDetails: '/mês',
    annualPrice: 'ou R$ 249,90/mês no plano anual',
    features: [
      '✅ Tudo do plano Profissional, e mais:',
      'Relatórios Complexos',
      'Atendimento Prioritário',
      'Acesso Antecipado a novas funcionalidades',
    ],
    callout: null,
    buttonText: 'Escolher Premium',
    isFeatured: false,
  },
];

const Planos = () => {
  return (
    <section className={styles.planosSection}>
      <div className={styles.planosContainer}>
        {planosData.map((plano, index) => (
          <div key={index} className={`${styles.planoCard} ${plano.isFeatured ? styles.featured : ''}`}>
            
            {plano.isFeatured && <div className={styles.featuredBadge}>MAIS POPULAR</div>}
            
            <div className={styles.cardHeader}>
              <span className={styles.icon}>{plano.icon}</span>
              <h3 className={styles.planoName}>{plano.name}</h3>
            </div>

            <div className={styles.priceContainer}>
              <span className={styles.price}>{plano.price}</span>
              {plano.priceDetails && <span className={styles.priceDetails}>{plano.priceDetails}</span>}
            </div>
            
            {plano.annualPrice && <p className={styles.annualPrice}>{plano.annualPrice}</p>}
            
            <hr className={styles.separator} />

            <ul className={styles.featuresList}>
              {plano.features.map((feature, featureIndex) => (
                <li key={featureIndex} dangerouslySetInnerHTML={{ __html: feature }}></li>
              ))}
            </ul>

            <div className={styles.cardFooter}>
                {plano.callout && <p className={styles.callout}>{plano.callout}</p>}
                <a href="#" className={styles.ctaButton}>
                {plano.buttonText}
                </a>
            </div>

          </div>
        ))}
      </div>
    </section>
  );
};

export default Planos;