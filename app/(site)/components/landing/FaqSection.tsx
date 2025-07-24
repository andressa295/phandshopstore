'use client';

import React from 'react';
import styles from '../../page.module.css'; 
import { FaChevronDown } from 'react-icons/fa';

export function FaqSection() {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);
  const toggleFaq = (index: number) => setOpenFaq(openFaq === index ? null : index);

  const faqItems = [
    { q: "Preciso de CNPJ para começar?", a: "Não, você pode começar a vender com o seu CPF e formalizar seu negócio quando se sentir pronto." },
    { q: "Como funciona a taxa 0% por venda?", a: "É simples: não cobramos comissão sobre suas vendas! Nossos planos são assinaturas com valor fixo. As únicas taxas que você terá são as do provedor de pagamento que escolher (ex: Mercado Pago, Stripe), que são inevitáveis em qualquer plataforma." },
    { q: "Posso usar meu próprio domínio?", a: "Sim! Você pode conectar seu próprio domínio (ex: www.sualoja.com.br) de forma fácil em nosso painel." },
    // --- MUDANÇA APLICADA ---
    { 
      q: "Preciso ter conhecimentos técnicos ou de design?", 
      a: (
        <>
          Absolutamente não! A Phandshop foi criada para empreendedores, não para programadores.
          <br /><br />
          • Nosso painel é <strong>totalmente intuitivo</strong>.
          <br />
          • Personalize sua loja com <strong>temas prontos</strong> e fáceis de editar.
          <br />
          • Se você sabe usar redes sociais, você consegue criar uma loja incrível.
          <br /><br />
          E para qualquer dúvida, nosso suporte responde em <strong>até 1 minuto</strong> para te ajudar.
        </>
      ) 
    },
  ];

  return (
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
  );
}