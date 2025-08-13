// app/(site)/plataforma/analises/page.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import styles from './Analises.module.css';
import { FaChartBar, FaGoogle, FaFileAlt, FaFilter, FaUsers, FaMoneyBillWave, FaArrowRight } from 'react-icons/fa';

export default function AnalisesPage() {
  return (
    <main className={styles.pageWrapper}>
      <section className={styles.heroSection}>
        <div className={styles.contentContainer}>
          <h1 className={styles.heroTitle}>Dados que se Transformam em Decisões para o seu Negócio</h1>
          <p className={styles.heroSubtitle}>
            Tome decisões inteligentes com relatórios claros, dashboards modernos e análises detalhadas do seu e-commerce.
          </p>
        </div>
      </section>

      {/* Bloco: Dashboard Moderna */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaChartBar size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Dashboard Moderna</h2>
              <p className={styles.blockDescription}>
                Visualize em tempo real as métricas mais importantes da sua loja. Acompanhe vendas, tráfego, produtos mais vendidos e muito mais em um painel intuitivo e personalizável.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Google Analytics Integrado */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaGoogle size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Google Analytics Integrado</h2>
              <p className={styles.blockDescription}>
                Conecte sua loja ao Google Analytics com apenas alguns cliques. Tenha acesso a dados avançados sobre o comportamento dos visitantes e o desempenho das suas campanhas de marketing.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Relatórios Detalhados */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaFileAlt size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Relatórios Detalhados</h2>
              <p className={styles.blockDescription}>
                Gere relatórios completos sobre vendas por produto, por cliente ou por canal. Filtre e exporte os dados para ter total controle sobre a performance da sua loja.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Funil de Vendas e Jornada do Cliente */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaFilter size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Funil de Vendas e Jornada do Cliente</h2>
              <p className={styles.blockDescription}>
                Visualize a jornada completa do seu cliente, desde a primeira visita até a compra. Identifique os pontos onde você está perdendo vendas e otimize sua taxa de conversão.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bloco: Análise de Clientes e Segmentos */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaUsers size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Análise de Clientes e Segmentos</h2>
              <p className={styles.blockDescription}>
                Descubra quem são seus clientes mais valiosos, entenda seus hábitos de compra e crie estratégias de fidelização mais eficazes.
              </p>
              <Link href="#" className={styles.verMaisLink}>
                Ver detalhes <FaArrowRight className={styles.arrowIcon} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bloco: Desempenho de Campanhas e ROI */}
      <section className={styles.featureSection}>
        <div className={styles.contentContainer}>
          <div className={styles.featureBlock}>
            <div className={styles.iconContainer}>
              <FaMoneyBillWave size={40} className={styles.featureIcon} />
            </div>
            <div className={styles.textContainer}>
              <h2 className={styles.blockTitle}>Desempenho de Campanhas e ROI</h2>
              <p className={styles.blockDescription}>
                Conecte o desempenho das suas campanhas de marketing diretamente aos resultados de vendas. Saiba exatamente qual o retorno sobre o investimento (ROI) de cada ação.
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