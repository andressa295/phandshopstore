// app/(site)/plataforma/automacao/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Automacao.module.css';
import { FaEnvelope, FaBell, FaSitemap, FaBoxOpen, FaChartPie, FaCogs, FaArrowRight } from 'react-icons/fa';

export default function AutomacaoPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <h1 className={styles.heroTitle}>Automação que Faz a sua Loja Trabalhar para Você</h1>
          <p className={styles.heroSubtitle}>
            Reduza o trabalho manual e foque no crescimento do seu negócio com ferramentas que automatizam o seu dia a dia.
          </p>
        </div>
      </section>

      {/* Bloco: E-mails automáticos */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaEnvelope size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>E-mails Automáticos</h2>
              <p className={styles.blockDescription}>
                Envie e-mails personalizados e segmentados para seus clientes automaticamente, como boas-vindas, confirmações de pedido e ofertas especiais, sem nenhum esforço manual.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Notificações Inteligentes */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaBell size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Notificações Inteligentes</h2>
              <p className={styles.blockDescription}>
                Mantenha seus clientes informados e engajados com notificações de estoque, atualizações de pedidos e promoções relâmpago, enviadas diretamente para o navegador deles.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Fluxo de Venda */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaSitemap size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Fluxo de Venda</h2>
              <p className={styles.blockDescription}>
                Crie fluxos de trabalho que reagem ao comportamento do cliente. Por exemplo, se um cliente adiciona um item ao carrinho, inicie uma sequência de e-mails para incentivar a compra.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Gestão de Estoque Inteligente */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaBoxOpen size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Gestão de Estoque Inteligente</h2>
              <p className={styles.blockDescription}>
                Automatize o controle de estoque. Receba alertas de produtos com baixo estoque e atualize a contagem em tempo real em todos os seus canais de venda.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bloco: Automação de Marketing e Segmentação */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaChartPie size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Automação de Marketing e Segmentação</h2>
              <p className={styles.blockDescription}>
                Crie listas de clientes automaticamente com base no comportamento deles. Envie campanhas direcionadas para clientes novos, VIPs ou inativos.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Automação de Processos Internos */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaCogs size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Automação de Processos Internos</h2>
              <p className={styles.blockDescription}>
                Simplifique a operação do seu e-commerce com automações para processamento de pedidos, impressão de etiquetas e atualização de status.
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