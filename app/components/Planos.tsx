'use client';

import Link from "next/link";
import React, { useState } from "react";
import {
  CheckCircle,
  ShoppingCart,
  Globe,
  BarChart2,
  DollarSign,
} from "lucide-react";

import styles from './Planos.module.css';

interface Plano {
  nome: string;
  precoMensal: string | null;
  precoAnual: string | null;
  destaque: boolean;
  beneficios: string[];
}

const planos: Plano[] = [
  {
    nome: "Básico",
    precoMensal: "R$ 49,00",
    precoAnual: "R$ 29,00",
    destaque: false,
    beneficios: [
      "Produtos, visitas e usuários ilimitados",
      "Marketplace gratuitos e zero taxas",
      "Mentoria ao vivo",
      "Tarifa por venda com 1%",
      "Atendimento humanizado via chat",
      "Integração com Mercado Pago",
      "Integração com Melhor Envio",
    ],
  },
  {
    nome: "Essencial",
    precoMensal: "R$ 99,00",
    precoAnual: "R$ 79,00",
    destaque: false,
    beneficios: [
      "Produtos, visitas e usuários ilimitados",
      "Marketplace gratuitos e zero taxas",
      "Mentoria ao vivo",
      "Tarifa por venda com 1%",
      "Atendimento via chat e WhatsApp",
      "+50 integrações com a plataforma",
      "ERPs",
      "Intermediadores de pagamento",
      "Gestão de fretes e blog",
    ],
  },
  {
    nome: "Premium",
    precoMensal: "R$ 149,00",
    precoAnual: "R$ 129,00",
    destaque: true,
    beneficios: [
      "Produtos, visitas e usuários ilimitados",
      "Marketplace gratuitos e zero taxas",
      "Mentoria ao vivo",
      "Tarifa por venda com 1%",
      "Acesso ao código-fonte HTML e CSS",
      "Criador de landing pages",
      "Brindes no carrinho",
      "Relatórios complexos",
      "Aviso-me",
      "Personalizador de produtos",
      "Guias de tamanho",
      "Captura de e-mail",
      "Criar selos customizados",
      "Aplicativos grátis",
      "Sacolinha do Instagram",
    ],
  },
  {
    nome: "Master",
    precoMensal: "R$ 299,00",
    precoAnual: "R$ 249,00",
    destaque: true,
    beneficios: [
      "Produtos, visitas e usuários ilimitados",
      "Marketplace gratuitos e zero taxas",
      "Mentoria ao vivo",
      "Tarifa por venda com 1%",
      "Implantação da loja online pronta em até 15 dias úteis",
      "Design e layout exclusivo",
      "Configurações de pagamento, ERP e transporte",
      "Garantia de 30 dias",
      "Underbook no checkout",
      "Kit de produto",
      "Importação por tornilha",
      "Aplicativo grátis",
      "Personalizador de produtos grátis",
      "Sacolinha do Instagram",
      "Todas as funcionalidades do Premium",
    ],
  },
];

const Planos = () => {
  const [tipoPlano, setTipoPlano] = useState<"mensal" | "anual">("mensal");

  const renderPreco = (plano: Plano) => {
    const preco = tipoPlano === "mensal" ? plano.precoMensal : plano.precoAnual;
    if (!preco) return null;
    const isMaster = plano.nome === "Master";
    const priceClassName = isMaster ? styles.planPriceMaster : '';
    const unitClassName = isMaster ? styles.planPriceUnitMaster : '';
    return (
      <div className={`${styles.planPrice} ${priceClassName}`}>
        {preco}
        <span className={`${styles.planPriceUnit} ${unitClassName}`}> /mês</span>
      </div>
    );
  };

  const renderIcon = (beneficio: string, isMaster: boolean) => {
    const commonIconStyle = {
      width: '1.125rem', height: '1.125rem',
      flexShrink: 0, marginRight: '0.5rem',
    };
    let colorClass = styles.iconSuccess;
    if (isMaster) colorClass = styles.iconMaster;
    else if (beneficio.includes("Produtos") || beneficio.includes("Marketplace") || beneficio.includes("Mentoria") || beneficio.includes("Tarifa")) {
      colorClass = styles.iconPrimary;
    }
    if (beneficio.includes("Produtos")) return <ShoppingCart className={colorClass} style={commonIconStyle} />;
    if (beneficio.includes("Marketplace")) return <Globe className={colorClass} style={commonIconStyle} />;
    if (beneficio.includes("Mentoria")) return <BarChart2 className={colorClass} style={commonIconStyle} />;
    if (beneficio.includes("Tarifa")) return <DollarSign className={colorClass} style={commonIconStyle} />;
    return <CheckCircle className={colorClass} style={commonIconStyle} />;
  };

  return (
    <section className={styles.planosSectionWrapper}>
      <div className={styles.toggleContainer}>
        {["mensal", "anual"].map((tipo) => (
          <button
            key={tipo}
            onClick={() => setTipoPlano(tipo as "mensal" | "anual")}
            className={`${styles.toggleButton} ${tipoPlano === tipo ? styles.toggleButtonActive : ''}`}
            aria-pressed={tipoPlano === tipo}
          >
            {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </button>
        ))}
      </div>

      <div className="planos-container"> {/* Container estilizado pelo globals.css */}
        {planos.map((plano) => {
          const isMaster = plano.nome === "Master";
          const cardSpecificStyleClass = isMaster ? styles.planCardMaster : styles.planCardDefault;

          return (
            <article key={plano.nome} className={`card ${cardSpecificStyleClass}`}>
              {isMaster && (<div className={styles.masterBadge}>🎉 OFERTA ESPECIAL</div>)}

              {/* Seção do Título e Preço (Topo do card) */}
              <div>
                <h2 className={styles.planTitle}>{plano.nome}</h2>
                {isMaster && (<p className={styles.planSubtitle}>Profissional + Loja Pronta</p>)}
                {renderPreco(plano)}
                {isMaster && (<div className={styles.planPriceNote}>No plano anual você tem o seu site pronto</div>)}
              </div>

              {/* Wrapper para a lista e divisor que vai crescer e ocupar espaço */}
              <div className={styles.benefitsSection}>
                <hr className={`${styles.divider} ${isMaster ? styles.dividerMaster : ''}`} />
                <ul className={styles.benefitsList}>
                  {plano.beneficios.map((b, i) => (
                    <li key={i} className={styles.benefitItem}>
                      {renderIcon(b, isMaster)}
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botão de Ação (Fundo do card) */}
              <Link
                href="/cadastro"
                aria-label={`Criar loja virtual no plano ${plano.nome}`}
                className={`${styles.ctaButton} ${isMaster ? styles.ctaButtonMaster : ''}`}
              >
                CRIAR LOJA VIRTUAL GRÁTIS
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Planos;