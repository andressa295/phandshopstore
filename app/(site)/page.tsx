'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css'; // Mude o nome se o seu for page.module.css
import { FaGem, FaBolt, FaHeadset, FaQuoteLeft, FaCheckCircle, FaChevronDown } from 'react-icons/fa';

export default function Home() {
  // --- DADOS E LÓGICA PARA AS SEÇÕES ---
  const diferenciais = [
    { icon: <FaGem size={28} />, title: 'Taxa 0% por Venda', description: 'Venda sem se preocupar com comissões sobre suas vendas. Seu lucro é 100% seu.' },
    { icon: <FaBolt size={28} />, title: 'Alta Performance', description: 'Sua loja carrega em um piscar de olhos, garantindo uma experiência rápida para o seu cliente.' },
    { icon: <FaHeadset size={28} />, title: 'Suporte que Resolve', description: 'Converse com pessoas de verdade, prontas para te ajudar a resolver qualquer problema em tempo recorde.' }
  ];
  const funcionalidades = [
    { icon: <FaCheckCircle />, title: "Design Flexível", text: "Personalize temas ou crie o seu do zero para ter uma loja com a sua cara." },
    { icon: <FaCheckCircle />, title: "Checkout Otimizado", text: "Processo de compra rápido e seguro, projetado para não perder vendas." },
    { icon: <FaCheckCircle />, title: "Ferramentas de Marketing", text: "Crie cupons, promoções e integre com as principais redes sociais facilmente." },
    { icon: <FaCheckCircle />, title: "Gestão Simplificada", text: "Controle pedidos, clientes e estoque em um painel intuitivo e poderoso." }
  ];
  const logosIntegracoes = [
    { src: "/logos/mercado-pago.png", alt: "Mercado Pago", width: 140, height: 140 },
    { src: "/logos/correios.png", alt: "Correios", width: 120, height: 120 },
    { src: "/logos/melhor-envio.png", alt: "Melhor Envio", width: 130, height: 130 },
    { src: "/logos/instagram.png", alt: "Instagram", width: 120, height: 120 },
    { src: "/logos/google.png", alt: "Google", width: 500, height: 500 },
  ];
  const depoimentos = [
    { texto: "A plataforma é incrivelmente fácil de usar e o suporte é o mais rápido que já vi. Minhas vendas aumentaram 30%!", autor: "Ana Souza", loja: "Ana Acessórios" },
    { texto: "Finalmente encontrei uma plataforma sem comissão por venda. A liberdade e a economia fizeram toda a diferença.", autor: "Bruno Carvalho", loja: "Geek Point" },
  ];
  const faqItems = [
    { q: "Preciso de CNPJ para começar?", a: "Não, você pode começar a vender com o seu CPF e formalizar seu negócio quando se sentir pronto." },
    { q: "Como funciona a taxa 0% por venda?", a: "É simples: não cobramos comissão sobre suas vendas! Nossos planos são assinaturas com valor fixo. As únicas taxas que você terá são as do provedor de pagamento que escolher (ex: Mercado Pago, Stripe), que são inevitáveis em qualquer plataforma." },
    { q: "Posso usar meu próprio domínio?", a: "Sim! Você pode conectar seu próprio domínio (ex: www.sualoja.com.br) de forma fácil em nosso painel." },
  ];

  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);
  
  const [faturamento, setFaturamento] = React.useState('10000');
  const [taxaConcorrente, setTaxaConcorrente] = React.useState(2.99);
  const economiaAnual = (parseFloat(faturamento || '0') * (taxaConcorrente / 100)) * 12;
  const formatCurrency = (value: number) => {
    if (isNaN(value)) return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0);
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <main>
      
      {/* 1. HERO */}
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <div className={styles.heroGrid}>
            <div>
              <h1 className={styles.heroTitle}>Sua loja online, simples e sem limites.</h1>
              <p className={styles.heroSubtitle}>Crie sua loja com temas personalizáveis e ferramentas de marketing. Taxa de comissão por venda: <strong>0%</strong>. Sempre.</p>
              <div className={styles.heroActions}>
                <Link href="/cadastro" className={styles.heroButtonPrimary}>Criar minha loja grátis</Link>
                {/* Você pode adicionar um botão secundário se quiser */}
                {/* <Link href="/planos" className={styles.heroButtonSecondary}>Conheça os planos</Link> */}
              </div>
            </div>
            <div className={styles.heroImageWrapper}>
              <Image src="/site.png" alt="Ilustração Phandshop" width={700} height={700} priority className={styles.heroImage}/>
            </div>
          </div>
        </div>
      </section>

      {/* 2. DIFERENCIAIS */}
      <section className={styles.diferenciaisSection}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>POR QUE A PHANDSHOP?</span>
            <h2>A plataforma completa para o seu sucesso</h2>
          </div>
          <div className={styles.diferenciaisGrid}>
            {diferenciais.map((item) => (
              <div key={item.title} className={styles.diferencialCard}>
                <div className={styles.iconWrapper}>{item.icon}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 3. FUNCIONALIDADES & INTEGRAÇÕES */}
      <section className={styles.featuresSection}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>FERRAMENTAS</span>
            <h2>Uma plataforma, inúmeras possibilidades</h2>
          </div>
          <div className={styles.featuresGrid}>
            {funcionalidades.map((item) => (
              <div key={item.title} className={styles.featureCard}>
                <div className={styles.featureIcon}>{item.icon}</div>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              </div>
            ))}
          </div>
          <div className={styles.integrationsWrapper}>
            <h4 className={styles.integrationsTitle}>Integre com as ferramentas que você já ama</h4>
            <div className={styles.logosContainer}>
              {logosIntegracoes.map((logo) => (
                <Image key={logo.alt} src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className={styles.logoImage}/>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. CALCULADORA DE ECONOMIA */}
      <section className={styles.calculadoraSection}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>Taxa Zero na Prática</span>
            <h2>Pare de deixar dinheiro na mesa</h2>
            <p>Veja o quanto você economizaria por ano conosco, sem pagar comissão por venda.</p>
          </div>
          <div className={styles.calculadoraBox}>
            <div className={styles.calculadoraInputGroup}>
              <div>
                <label htmlFor="faturamento">Seu faturamento mensal (R$)</label>
                <input id="faturamento" type="number" value={faturamento} onChange={e => setFaturamento(e.target.value)} placeholder="Ex: 10000" />
              </div>
              <div>
                <label htmlFor="taxa">Taxa de comissão que você paga hoje</label>
                <select id="taxa" value={taxaConcorrente} onChange={e => setTaxaConcorrente(parseFloat(e.target.value))}>
                  <option value={1.5}>1,5%</option>
                  <option value={2.5}>2,5%</option>
                  <option value={4.99}>4,99%</option>
                </select>
              </div>
            </div>
            <div className={styles.calculadoraResultado}>
              <p>Sua economia anual na Phandshop seria de:</p>
              <span className={styles.economiaValor}>{formatCurrency(economiaAnual)}</span>
              <p className={styles.economiaDetalhe}>Dinheiro que volta para o seu bolso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. DEPOIMENTOS */}
      <section className={styles.depoimentosSection}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>NOSSOS CLIENTES</span>
            <h2>Lojas que confiam e crescem com a gente</h2>
          </div>
          <div className={styles.depoimentosGrid}>
            {depoimentos.map((item, index) => (
              <div key={index} className={styles.depoimentoCard}>
                <FaQuoteLeft className={styles.quoteIcon} />
                <p className={styles.depoimentoTexto}>"{item.texto}"</p>
                <p className={styles.depoimentoAutor}>{item.autor}, <span>{item.loja}</span></p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 6. PLANOS (SIMPLIFICADO) */}
      <section className={styles.planosSection}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2 style={{color: 'white'}}>Um plano completo e sem surpresas</h2>
            <p className={styles.planosSubtitle}>Acesse todas as ferramentas para escalar seu negócio com um preço justo e transparente.</p>
            <Link href="/planos" className={styles.planosBotao}>
              Conheça Nossos Planos
            </Link>
          </div>
        </div>
      </section>

      {/* 7. FAQ */}
      <section className={styles.faqSection}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <span className={styles.preTitle}>DÚVIDAS</span>
            <h2>Perguntas Frequentes</h2>
          </div>
          <div className={styles.faqContainer}>
            {faqItems.map((item, index) => (
              <div key={index} className={`${styles.faqItem} ${openFaq === index ? styles.open : ''}`}>
                <div className={styles.faqQuestion} onClick={() => toggleFaq(index)}>
                  <h4>{item.q}</h4>
                  <FaChevronDown className={styles.faqIcon} />
                </div>
                <div className={`${styles.faqAnswer} ${openFaq === index ? styles.open : ''}`}>
                  <p>{item.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* 8. SUPORTE (DO SEU CÓDIGO ORIGINAL) */}
      <section className={styles.suporteSection}>
        <div className={styles.contentContainer}>
          <div className={styles.suporteContainer}>
            <div className={styles.suporteLeft}>
              <h2 className={styles.suporteTitle}>Suporte e Mentoria Phandshop</h2>
              <p className={styles.suporteText}>
                Na Phandshop, você conta com suporte rápido, mentorias ao vivo e acompanhamento especializado em cada etapa. Nosso sucesso é o seu sucesso. Com 97% de avaliações positivas, nosso suporte responde em até 1 minuto e nossas mentorias te ajudam a dominar sua loja virtual.
              </p>
            </div>
            <div className={styles.suporteRight}>
              <div className={styles.suporteBox}>
                <h3 className={styles.suporteBoxTitle}>Horário de Atendimento</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className={styles.suporteBoxItem}>
                    <span>Segunda à Sexta</span>
                    <span style={{ color: '#6D28D9', fontWeight: 600 }}>09h às 20h</span>
                  </div>
                  <div className={styles.suporteBoxItem}>
                    <span>Finais de Semana e Feriados</span>
                    <span style={{ color: '#6D28D9', fontWeight: 600 }}>10h às 15h</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* 9. CTA FINAL */}
      <section className={styles.ctaSection}>
        <div className={styles.contentContainer}>
          <div className={styles.sectionHeader}>
            <h2>Pronto para vender para todo o Brasil?</h2>
            <p>Crie sua loja virtual em poucos minutos. Sem cartão de crédito e sem compromisso.</p>
            <Link href="/planos" className={styles.heroButtonPrimary}>Começar gratuitamente agora</Link>
          </div>
        </div>
      </section>

    </main>
  );
}
