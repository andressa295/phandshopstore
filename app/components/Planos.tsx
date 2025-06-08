// src/app/components/Planos.tsx
'use client';

import Link from "next/link";
import React, { useState } from "react";
import {
  CheckCircle,
  ShoppingCart,
  Globe,
  BarChart2,
  DollarSign,
  MinusCircle, // Ícone para benefícios desabilitados
} from "lucide-react";

import styles from './Planos.module.css';

// Nova interface para os benefícios
interface Beneficio {
  texto: string;
  disponivel: boolean;
}

interface Plano {
  nome: string;
  precoMensal: string | null;
  precoAnual: string | null;
  destaque: boolean;
  beneficios: Beneficio[]; // A lista agora é de objetos 'Beneficio'
}

// Array de planos com a nova estrutura de benefícios
const planos: Plano[] = [
  {
    nome: "Básico",
    precoMensal: "R$ 49,00",
    precoAnual: "R$ 29,00",
    destaque: false,
    beneficios: [
      { texto: "Produtos, visitas e usuários ilimitados", disponivel: true },
      { texto: "Marketplace gratuitos e zero taxas", disponivel: true },
      { texto: "Mentoria ao vivo", disponivel: true },
      { texto: "Tarifa por venda com 1%", disponivel: true },
      { texto: "Atendimento humanizado via chat", disponivel: true },
      { texto: "Integração com Mercado Pago", disponivel: true },
      { texto: "Integração com Melhor Envio", disponivel: true },
      // Itens desabilitados para preencher espaço e mostrar valor
      { texto: "Atendimento via chat e WhatsApp", disponivel: false },
      { texto: "+50 integrações com a plataforma", disponivel: false },
      { texto: "Acesso ao código-fonte HTML e CSS", disponivel: false },
      { texto: "Criador de landing pages", disponivel: false },
      { texto: "Brindes no carrinho", disponivel: false },
      { texto: "Relatórios complexos", disponivel: false },
      { texto: "Personalizador de produtos", disponivel: false },
      { texto: "Sacolinha do Instagram", disponivel: false },
    ],
  },
  {
    nome: "Essencial",
    precoMensal: "R$ 99,00",
    precoAnual: "R$ 79,00",
    destaque: false,
    beneficios: [
      { texto: "Produtos, visitas e usuários ilimitados", disponivel: true },
      { texto: "Marketplace gratuitos e zero taxas", disponivel: true },
      { texto: "Mentoria ao vivo", disponivel: true },
      { texto: "Tarifa por venda com 1%", disponivel: true },
      { texto: "Atendimento via chat e WhatsApp", disponivel: true },
      { texto: "+50 integrações com a plataforma", disponivel: true },
      { texto: "ERPs", disponivel: true },
      { texto: "Intermediadores de pagamento", disponivel: true },
      { texto: "Gestão de fretes e blog", disponivel: true },
      // Itens desabilitados para preencher espaço
      { texto: "Acesso ao código-fonte HTML e CSS", disponivel: false },
      { texto: "Criador de landing pages", disponivel: false },
      { texto: "Brindes no carrinho", disponivel: false },
      { texto: "Relatórios complexos", disponivel: false },
      { texto: "Personalizador de produtos", disponivel: false },
      { texto: "Sacolinha do Instagram", disponivel: false },
    ],
  },
  {
    nome: "Premium",
    precoMensal: "R$ 149,00",
    precoAnual: "R$ 129,00",
    destaque: true, // Marquei este como destaque também, visualmente fica bom
    beneficios: [
      { texto: "Produtos, visitas e usuários ilimitados", disponivel: true },
      { texto: "Marketplace gratuitos e zero taxas", disponivel: true },
      { texto: "Mentoria ao vivo", disponivel: true },
      { texto: "Tarifa por venda com 1%", disponivel: true },
      { texto: "Acesso ao código-fonte HTML e CSS", disponivel: true },
      { texto: "Criador de landing pages", disponivel: true },
      { texto: "Brindes no carrinho", disponivel: true },
      { texto: "Relatórios complexos", disponivel: true },
      { texto: "Aviso-me", disponivel: true },
      { texto: "Personalizador de produtos", disponivel: true },
      { texto: "Guias de tamanho", disponivel: true },
      { texto: "Captura de e-mail", disponivel: true },
      { texto: "Criar selos customizados", disponivel: true },
      { texto: "Aplicativos grátis", disponivel: true },
      { texto: "Sacolinha do Instagram", disponivel: true },
    ],
  },
  {
    nome: "Master",
    precoMensal: "R$ 299,00",
    precoAnual: "R$ 249,00",
    destaque: true,
    beneficios: [
      { texto: "Implantação da loja online pronta", disponivel: true },
      { texto: "Design e layout exclusivo", disponivel: true },
      { texto: "Configurações de pagamento, ERP e frete", disponivel: true },
      { texto: "Tarifa por venda com 1%", disponivel: true },
      { texto: "Garantia de 30 dias", disponivel: true },
      { texto: "Underbook no checkout", disponivel: true },
      { texto: "Kit de produto", disponivel: true },
      { texto: "Importação por planilha", disponivel: true },
      { texto: "Aplicativo grátis", disponivel: true },
      { texto: "Personalizador de produtos grátis", disponivel: true },
      { texto: "Sacolinha do Instagram", disponivel: true },
      { texto: "Mentoria ao vivo", disponivel: true },
      { texto: "Atendimento prioritário via WhatsApp", disponivel: true },
      { texto: "Relatórios avançados", disponivel: true },
      { texto: "Todas as funcionalidades do Premium", disponivel: true },
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

  const renderIcon = (beneficio: Beneficio, isMaster: boolean) => {
    const commonIconStyle = {
      width: '1.125rem', height: '1.125rem',
      flexShrink: 0, marginRight: '0.5rem',
    };
    
    if (!beneficio.disponivel) {
      return <MinusCircle className={styles.iconDisabled} style={commonIconStyle} />;
    }

    let colorClass = styles.iconSuccess;
    if (isMaster) colorClass = styles.iconMaster;
    else if (
      beneficio.texto.includes("Produtos") || beneficio.texto.includes("Marketplace") ||
      beneficio.texto.includes("Mentoria") || beneficio.texto.includes("Tarifa")
    ) {
      colorClass = styles.iconPrimary;
    }

    if (beneficio.texto.includes("Produtos")) return <ShoppingCart className={colorClass} style={commonIconStyle} />;
    if (beneficio.texto.includes("Marketplace")) return <Globe className={colorClass} style={commonIconStyle} />;
    if (beneficio.texto.includes("Mentoria")) return <BarChart2 className={colorClass} style={commonIconStyle} />;
    if (beneficio.texto.includes("Tarifa")) return <DollarSign className={colorClass} style={commonIconStyle} />;
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

      <div className="planos-container">
        {planos.map((plano) => {
          const isMaster = plano.nome === "Master";
          // Adicionado destaque para Premium também, para balancear o visual
          const cardDestaqueClass = plano.destaque ? styles.planCardDestaque : '';
          const cardSpecificStyleClass = isMaster ? styles.planCardMaster : styles.planCardDefault;

          return (
            <article key={plano.nome} className={`card ${cardSpecificStyleClass} ${cardDestaqueClass}`}>
              {plano.destaque && !isMaster && (<div className={styles.premiumBadge}>MAIS POPULAR</div>)}
              {isMaster && (<div className={styles.masterBadge}>OFERTA ESPECIAL</div>)}

              <div>
                <h2 className={styles.planTitle}>{plano.nome}</h2>
                {isMaster && (<p className={styles.planSubtitle}>Profissional + Loja Pronta</p>)}
                {renderPreco(plano)}
                {isMaster && (<div className={styles.planPriceNote}>No plano anual você tem o seu site pronto</div>)}
              </div>

              <div className={styles.benefitsSection}>
                <hr className={`${styles.divider} ${isMaster ? styles.dividerMaster : ''}`} />
                <ul className={styles.benefitsList}>
                  {plano.beneficios.map((b, i) => (
                    <li key={i} className={`${styles.benefitItem} ${!b.disponivel ? styles.benefitItemDisabled : ''}`}>
                      {renderIcon(b, isMaster)}
                      <span>{b.texto}</span>
                    </li>
                  ))}
                </ul>
              </div>

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