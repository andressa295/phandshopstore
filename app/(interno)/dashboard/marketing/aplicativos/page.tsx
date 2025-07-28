'use client';

import React from 'react';
import { useUser } from '../../UserContext';
import styles from './Aplicativos.module.css';
import Link from 'next/link';
import Image from 'next/image';
import {
  FaPlusSquare, FaPlug, FaSearch, FaInfoCircle,
  FaTruck, FaDollarSign, FaChartLine, FaShareAlt,
  FaHeadset, FaChartPie, FaMoneyBillWave, FaRobot, FaLightbulb
} from 'react-icons/fa';

import { apps, AppItem } from '../../../../../data/apps'; // <- caminho corrigido, confere se o arquivo tá aí mesmo

const categoryIcons: Record<string, React.ReactNode> = {
  '📦 Logística & Fulfillment': <FaTruck size={24} style={{ marginRight: '10px' }} />,
  '🛒 Checkout & Conversão': <FaDollarSign size={24} style={{ marginRight: '10px' }} />,
  '🎯 Marketing & Performance': <FaChartLine size={24} style={{ marginRight: '10px' }} />,
  '📱 Social e Vendas Multicanal': <FaShareAlt size={24} style={{ marginRight: '10px' }} />,
  '💬 Atendimento & Relacionamento': <FaHeadset size={24} style={{ marginRight: '10px' }} />,
  '📊 Relatórios & BI': <FaChartPie size={24} style={{ marginRight: '10px' }} />,
  '🧾 Financeiro & Fiscal': <FaMoneyBillWave size={24} style={{ marginRight: '10px' }} />,
  '🤖 Automação e IA': <FaRobot size={24} style={{ marginRight: '10px' }} />,
  '🧠 Extras Visionários': <FaLightbulb size={24} style={{ marginRight: '10px' }} />,
};

export default function MarketingAplicativosPage() {
  const { user, profile, loading } = useUser();

  console.log('Valor de apps após importação:', apps);

  // ⚠️ Proteção contra apps indefinido
  if (!Array.isArray(apps)) {
    return (
      <div className={styles.errorContainer}>
        Erro ao carregar aplicativos. Verifique a importação de dados.
      </div>
    );
  }

  const appsByCategory = apps.reduce((acc, app) => {
    if (!acc[app.category]) {
      acc[app.category] = [];
    }
    acc[app.category].push(app);
    return acc;
  }, {} as Record<string, AppItem[]>);

  const categoryOrder = [
    '📦 Logística & Fulfillment',
    '🛒 Checkout & Conversão',
    '🎯 Marketing & Performance',
    '📱 Social e Vendas Multicanal',
    '💬 Atendimento & Relacionamento',
    '📊 Relatórios & BI',
    '🧾 Financeiro & Fiscal',
    '🤖 Automação e IA',
    '🧠 Extras Visionários',
  ];

  const sortedCategories = categoryOrder.filter(cat => appsByCategory[cat]);

  if (loading) {
    return <div className={styles.loadingContainer}>Carregando aplicativos...</div>;
  }

  if (!user) {
    return <div className={styles.accessDenied}>Acesso negado. Por favor, faça login.</div>;
  }

  const currentUserPlan = profile?.plano || 'plano_gratis';

  const isPlanAllowed = (appPlanRequired: string) => {
    const planOrder = ['plano_gratis', 'plano_basico', 'plano_essencial', 'plano_profissional', 'plano_premium'];
    const userPlanIndex = planOrder.indexOf(currentUserPlan);
    const requiredPlanIndex = planOrder.indexOf(appPlanRequired);
    return userPlanIndex >= requiredPlanIndex;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <FaPlug size={32} className={styles.icon} />
        Aplicativos
      </h1>
      <p className={styles.subtitle}>
        Impulsione suas vendas com as melhores ferramentas e integrações para sua loja.
      </p>

      <div className={styles.searchBar}>
        <FaSearch className={styles.searchIcon} />
        <input type="text" placeholder="Buscar aplicativos..." className={styles.searchInput} />
      </div>

      {sortedCategories.map(category => (
        <div key={category} className={styles.categorySection}>
          <h2 className={styles.categoryTitle}>{categoryIcons[category]}{category}</h2>
          <div className={styles.appGrid}>
            {appsByCategory[category].map(app => (
              <div key={app.id} className={styles.appCard}>
                {app.icon && (
                  <Image
                    src={app.icon}
                    alt={`${app.name} Icon`}
                    width={60}
                    height={60}
                    className={styles.appIcon}
                  />
                )}
                <h3 className={styles.appName}>{app.name}</h3>
                <p className={styles.appDescription}>{app.description}</p>
                <div className={styles.appStatus}>
                  <span className={`${styles.statusBadge} ${styles[app.status.replace(/\s/g, '')]}`}>
                    {app.status}
                  </span>
                  <span className={styles.appType}>{app.type}</span>
                </div>

                {isPlanAllowed(app.planRequired) ? (
                  <Link
                    href={`/dashboard/marketing/aplicativos/${app.id}`}
                    className={`${styles.installButton} ${app.status === 'Não Instalado' ? styles.installButtonHighlight : ''}`}
                  >
                    {app.status === 'Instalado' ? 'Gerenciar' : 'Instalar'}
                    <FaPlusSquare size={14} style={{ marginLeft: '8px' }} />
                  </Link>
                ) : (
                  <div className={styles.upgradeNotice}>
                    <FaInfoCircle size={14} style={{ marginRight: '5px' }} />
                    Requer Plano {app.planRequired.replace('plano_', ' ').replace(/\b\w/g, char => char.toUpperCase())}
                    <Link href="/planos" className={styles.upgradeLink}>Fazer Upgrade</Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      <p className={styles.footerText}>
        Em breve, mais aplicativos para você!
      </p>
    </div>
  );
}
