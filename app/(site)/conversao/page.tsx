// app/(site)/conversao/page.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaShoppingCart, FaCreditCard, FaTags, FaArrowRight, FaStar, FaClock, FaMobileAlt, FaShieldAlt } from 'react-icons/fa';
import styles from './Conversao.module.css';

export default function ConversaoPage() {
  return (
    <div className={styles.container}>
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Ferramentas de Conversão
          </h1>
          <p className={styles.heroSubtitle}>
            Aumente suas vendas e retenha clientes com recursos poderosos,
            projetados para otimizar a jornada de compra do início ao fim.
          </p>
        </div>
      </section>

      {/* Seção 1: Recuperação de Carrinho */}
      <section className={styles.featureSection}>
        <div className={styles.featureContent}>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <FaShoppingCart size={40} color="#6b21a8" />
            </div>
            <h2 className={styles.featureTitle}>Recuperação de Carrinho</h2>
            <p className={styles.featureDescription}>
              Conquiste clientes que abandonaram o carrinho com e-mails e
              notificações automatizadas. Lembre-os dos produtos e ofereça
              incentivos para fechar a compra.
            </p>
          </div>
          <div className={styles.featureImageContainer}>
            <Image
              src="/placeholder-cart.png"
              alt="Recuperação de Carrinho"
              width={500}
              height={350}
              className={styles.featureImage}
            />
          </div>
        </div>
      </section>

      {/* Seção 2: Checkout Simplificado (com fundo roxo) */}
      <section className={`${styles.featureSection} ${styles.purpleBackground}`}>
        <div className={styles.featureContent}>
          <div className={styles.featureImageContainer}>
            <Image
              src="/placeholder-checkout.png"
              alt="Checkout Simplificado"
              width={500}
              height={350}
              className={styles.featureImage}
            />
          </div>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <FaCreditCard size={40} color="#fff" />
            </div>
            <h2 className={`${styles.featureTitle} ${styles.whiteText}`}>
              Checkout Simplificado
            </h2>
            <p className={styles.featureDescription}>
              Transforme visitantes em clientes com um processo de compra rápido e
              intuitivo. Menos etapas, mais conversão e uma experiência
              agradável para todos.
            </p>
          </div>
        </div>
      </section>

      {/* Seção 3: Cupons e Descontos */}
      <section className={styles.featureSection}>
        <div className={styles.featureContent}>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <FaTags size={40} color="#6b21a8" />
            </div>
            <h2 className={styles.featureTitle}>Cupons e Descontos</h2>
            <p className={styles.featureDescription}>
              Aumente as vendas e a lealdade dos clientes com cupons e descontos
              personalizados. Crie promoções para datas especiais, grupos de
              clientes e muito mais.
            </p>
          </div>
          <div className={styles.featureImageContainer}>
            <Image
              src="/placeholder-cupons.png"
              alt="Cupons e Descontos"
              width={500}
              height={350}
              className={styles.featureImage}
            />
          </div>
        </div>
      </section>

      {/* Seção 4: Prova Social */}
      <section className={`${styles.featureSection} ${styles.purpleBackground}`}>
        <div className={styles.featureContent}>
          <div className={styles.featureImageContainer}>
            <Image
              src="/placeholder-social.png"
              alt="Prova Social"
              width={500}
              height={350}
              className={styles.featureImage}
            />
          </div>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <FaStar size={40} color="#fff" />
            </div>
            <h2 className={`${styles.featureTitle} ${styles.whiteText}`}>
              Prova Social
            </h2>
            <p className={styles.featureDescription}>
              Construa confiança com avaliações de produtos e depoimentos de
              clientes. Deixe que a voz de seus clientes falem por você.
            </p>
          </div>
        </div>
      </section>

      {/* Seção 5: Urgência e Escassez */}
      <section className={styles.featureSection}>
        <div className={styles.featureContent}>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <FaClock size={40} color="#6b21a8" />
            </div>
            <h2 className={styles.featureTitle}>Urgência e Escassez</h2>
            <p className={styles.featureDescription}>
              Use contadores de tempo e alertas de estoque baixo para
              incentivar compras imediatas.
            </p>
          </div>
          <div className={styles.featureImageContainer}>
            <Image
              src="/placeholder-urgency.png"
              alt="Urgência e Escassez"
              width={500}
              height={350}
              className={styles.featureImage}
            />
          </div>
        </div>
      </section>

      {/* Seção 6: Segurança e Confiança no Checkout */}
      <section className={`${styles.featureSection} ${styles.purpleBackground}`}>
        <div className={styles.featureContent}>
          <div className={styles.featureImageContainer}>
            <Image
              src="/placeholder-security.png"
              alt="Segurança e Confiança"
              width={500}
              height={350}
              className={styles.featureImage}
            />
          </div>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <FaShieldAlt size={40} color="#fff" />
            </div>
            <h2 className={`${styles.featureTitle} ${styles.whiteText}`}>
              Segurança e Confiança
            </h2>
            <p className={styles.featureDescription}>
              Ofereça um ambiente de compra seguro com as mais recentes
              tecnologias de proteção de dados, garantindo a tranquilidade
              dos seus clientes.
            </p>
          </div>
        </div>
      </section>

      {/* Seção 7: Layout Mobile-First */}
      <section className={styles.featureSection}>
        <div className={styles.featureContent}>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <FaMobileAlt size={40} color="#6b21a8" />
            </div>
            <h2 className={styles.featureTitle}>Design Mobile-First</h2>
            <p className={styles.featureDescription}>
              Sua loja é impecável em qualquer dispositivo. Nossos temas são
              otimizados para celular, garantindo uma experiência de compra
              perfeita para todos.
            </p>
          </div>
          <div className={styles.featureImageContainer}>
            <Image
              src="/placeholder-mobile.png"
              alt="Design Mobile-First"
              width={500}
              height={350}
              className={styles.featureImage}
            />
          </div>
        </div>
      </section>

      {/* Seção de CTA (Call to Action) */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Pronta para decolar?</h2>
        <p className={styles.ctaSubtitle}>
          Comece sua jornada no e-commerce hoje mesmo com todas as ferramentas
          que você precisa.
        </p>
        <Link href="/planos" className={styles.ctaButton}>
          Criar minha loja grátis <FaArrowRight />
        </Link>
      </section>
    </div>
  );
}