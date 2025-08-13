// app/(site)/plataforma/conversao/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Conversao.module.css';
import { FaSyncAlt, FaTags, FaUserCheck, FaStar, FaMousePointer, FaArrowRight } from 'react-icons/fa';

export default function ConversaoPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <h1 className={styles.heroTitle}>Aumente suas Vendas com as Ferramentas de Conversão</h1>
          <p className={styles.heroSubtitle}>
            Conheça as funcionalidades que transformam visitantes em clientes e otimizam sua receita, tudo em um só lugar.
          </p>
        </div>
      </section>

      {/* Bloco: Recuperação de Carrinho */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaSyncAlt size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Recuperação de Carrinho</h2>
              <p className={styles.blockDescription}>
                Recupere vendas perdidas com e-mails e notificações automáticas para clientes que abandonaram o carrinho. Nossa ferramenta inteligente identifica o momento certo para interagir, aumentando suas chances de fechar a venda.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Checkout Simplificado */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaUserCheck size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Checkout Simplificado</h2>
              <p className={styles.blockDescription}>
                Reduza a fricção na etapa final da compra com um checkout rápido, seguro e intuitivo. Ofereça opções de pagamento flexíveis e um processo com poucos cliques para que seus clientes não desistam no último segundo.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bloco: Cupons e Descontos */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}> {/* <--- Linha corrigida */}
            <div className={styles.iconContainer}>
              <FaTags size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Cupons e Descontos</h2>
              <p className={styles.blockDescription}>
                Crie promoções personalizadas para atrair novos clientes e fidelizar os antigos. Nossa plataforma te dá o controle para criar cupons exclusivos, campanhas de frete grátis e descontos progressivos.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Prova Social e Avaliações */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}> {/* <--- Linha corrigida */}
            <div className={styles.iconContainer}>
              <FaStar size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Prova Social e Avaliações</h2>
              <p className={styles.blockDescription}>
                Gere confiança e incentive a compra mostrando o que outros clientes pensam dos seus produtos. Permita que seus clientes deixem avaliações e depoimentos que comprovam a qualidade da sua marca.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bloco: Personalização e Recomendações */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}> {/* <--- Linha corrigida */}
            <div className={styles.iconContainer}>
              <FaMousePointer size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Personalização e Recomendações</h2>
              <p className={styles.blockDescription}>
                Ofereça uma experiência de compra única com sugestões de produtos feitas sob medida para cada cliente. Com base no histórico de navegação, mostre os produtos certos, na hora certa.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}