'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css'; // Certifique-se que o nome do arquivo CSS é o mesmo
import { FaGem, FaBolt, FaHeadset, FaQuoteLeft, FaCheckCircle, FaChevronDown } from 'react-icons/fa';

export default function Home() {
  // --- DADOS PARA AS SEÇÕES (FÁCIL DE EDITAR AQUI) ---
  const diferenciais = [
    { icon: <FaGem size={28} />, title: 'Taxa 0% de Verdade', description: 'Venda sem se preocupar com taxas por transação. Seu lucro é 100% seu, sem pegadinhas.' },
    { icon: <FaBolt size={28} />, title: 'Alta Performance', description: 'Sua loja carrega em um piscar de olhos, garantindo uma experiência rápida para o seu cliente.' },
    { icon: <FaHeadset size={28} />, title: 'Suporte que Resolve', description: 'Converse com pessoas de verdade, prontas para te ajudar a resolver qualquer problema em tempo recorde.' }
  ];

  const depoimentos = [
    { texto: "A plataforma é incrivelmente fácil de usar e o suporte é o mais rápido que já vi. Minhas vendas aumentaram 30%!", autor: "Ana Souza", loja: "Ana Acessórios" },
    { texto: "Finalmente encontrei uma plataforma com taxa zero de verdade. A liberdade e a economia fizeram toda a diferença.", autor: "Bruno Carvalho", loja: "Geek Point" },
  ];
  
  const faqItems = [
    { q: "Preciso de CNPJ para começar?", a: "Não, você pode começar a vender com o seu CPF e formalizar seu negócio quando se sentir pronto. Oferecemos flexibilidade total." },
    { q: "Como funciona a taxa 0%?", a: "É simples: não existem taxas por venda! Nosso plano é uma assinatura mensal fixa, sem surpresas no final do mês." },
    { q: "Posso usar meu próprio domínio?", a: "Sim! Você pode conectar seu próprio domínio (ex: www.sualoja.com.br) de forma fácil através do nosso painel." },
    { q: "O suporte realmente ajuda?", a: "Nosso suporte é nosso maior orgulho. É formado por especialistas na plataforma, prontos para te ajudar via chat e e-mail em tempo recorde." },
  ];

  // Lógica para o Acordeão (sanfona) do FAQ
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    // O layout que envolve a página (com Header e Footer do site) virá do seu arquivo layout.tsx
    <main>
      
      {/* ========= 1. SEÇÃO HERO ========= */}
      <section className={styles.heroSection}>
        <div className={styles.heroTextWrapper}>
          <h1 className={styles.heroTitle}>Sua loja online, simples e sem limites.</h1>
          <p className={styles.heroSubtitle}>
            Crie sua loja com temas personalizáveis, ferramentas de marketing e a menor taxa do mercado: <strong>0% por venda</strong>. Comece a vender hoje mesmo.
          </p>
          <Link href="/cadastro" className={styles.heroButton}>
            Criar minha loja grátis
          </Link>
        </div>
        <div className={styles.heroImageWrapper}>
          <Image
            src="/site.png" // VERIFIQUE SE ESTE CAMINHO ESTÁ CORRETO
            alt="Ilustração de uma loja online da Phandshop"
            width={700}
            height={700}
            priority
            className={styles.heroImage}
          />
        </div>
      </section>

      {/* ========= 2. SEÇÃO DIFERENCIAIS ========= */}
      <section className={styles.diferenciaisSection}>
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
      </section>

      {/* ========= 3. SEÇÃO DEPOIMENTOS (PROVA SOCIAL) ========= */}
      <section className={styles.depoimentosSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.preTitle}>NOSSOS CLIENTES</span>
          <h2>Lojas que confiam e crescem com a gente</h2>
        </div>
        <div className={styles.depoimentosGrid}>
          {depoimentos.map((item, index) => (
            <div key={index} className={styles.depoimentoCard}>
              <FaQuoteLeft className={styles.quoteIcon} />
              <p className={styles.depoimentoTexto}>{item.texto}</p>
              <p className={styles.depoimentoAutor}>{item.autor}, <span>{item.loja}</span></p>
            </div>
          ))}
        </div>
      </section>
      
      {/* ========= 4. SEÇÃO DE PLANOS (SIMPLIFICADA COM BOTÃO) ========= */}
      <section className={styles.planosSection}>
        <div className={styles.sectionHeader}>
          <h2>Um plano completo e sem surpresas</h2>
          <p className={styles.planosSubtitle}>Tenha acesso a todas as nossas ferramentas com um preço justo e transparente.</p>
          <Link href="/planos" className={styles.planosBotao}>
            Conheça Nossos Planos
          </Link>
        </div>
      </section>

      {/* ========= 6. SEÇÃO FAQ (PERGUNTAS FREQUENTES) ========= */}
      <section className={styles.faqSection}>
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
      </section>
      
      {/* ========= 7. SEÇÃO CTA FINAL ========= */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionHeader}>
          <h2>Pronto para vender para todo o Brasil?</h2>
          <p>Crie sua loja virtual em poucos minutos. Sem cartão de crédito e sem compromisso.</p>
          <Link href="/cadastro" className={styles.heroButton}>
            Começar gratuitamente agora
          </Link>
        </div>
      </section>

    </main>
  );
}