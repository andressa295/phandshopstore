'use client';

import React, { useState } from "react";
import Image from 'next/image';
import Link from 'next/link';
import styles from "./PainelAfiliado.module.css";
import { 
    FaUserCircle, 
    FaSignOutAlt, 
    FaCopy, 
    FaWhatsapp, 
    FaTwitter, 
    FaCheckCircle, 
    FaExclamationCircle, 
    FaTimesCircle, 
    FaPiggyBank, 
    FaUniversity, 
    FaUsers 
} from 'react-icons/fa';

export default function PainelAfiliado() {
  // --- DADOS DE EXEMPLO (MOCK) ---
  const parceiro = {
    nome: "Britney da Silva",
    linkIndicacao: "https://phandshop.com/?ref=britney-silva",
  };

  const kpis = [
    { title: "Comissão a Receber", value: "R$ 450,75", icon: <FaPiggyBank /> },
    { title: "Total Ganho (Vitalício)", value: "R$ 2.380,50", icon: <FaPiggyBank /> },
    { title: "Lojas Ativas", value: 12, icon: <FaCheckCircle /> },
    { title: "Total de Indicações", value: 35, icon: <FaUserCircle /> },
  ];

  // Para testar o "Estado Vazio", basta trocar para: const indicacoes = [];
  const indicacoes = [
    { id: 1, loja: "Loja da Ana S.", data: "10/06/2025", plano: "Profissional", status: "Ativo", comissao: "R$ 22,50" },
    { id: 2, loja: "Império Geek", data: "05/06/2025", plano: "Essencial", status: "Ativo", comissao: "R$ 12,00" },
    { id: 3, loja: "Doces da Bia", data: "01/06/2025", plano: "Profissional", status: "Cancelado", comissao: "R$ 0,00" },
    { id: 4, loja: "Marcos Tech", data: "28/05/2025", plano: "Grátis", status: "Pendente", comissao: "R$ 0,00" },
  ];

  const graficoData = [
    { mes: "Jan", clientes: 5 }, { mes: "Fev", clientes: 8 }, { mes: "Mar", clientes: 12 },
    { mes: "Abr", clientes: 7 }, { mes: "Mai", clientes: 15 }, { mes: "Jun", clientes: 14 }
  ];

  const [paymentMethod, setPaymentMethod] = useState('pix');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(parceiro.linkIndicacao);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={styles.dashboardContainer}>
      <header className={styles.header}>
        <Image src="/logo.png" alt="Phandshop Logo" width={150} height={40} />
        <div className={styles.userMenu}>
          <FaUserCircle />
          <span>Olá, {parceiro.nome}!</span>
          <Link href="/" className={styles.logoutButton}>
            <FaSignOutAlt /> Sair
          </Link>
        </div>
      </header>

      <main className={styles.mainContent}>
        <section className={styles.kpiGrid}>
          {kpis.map(kpi => (
            <div key={kpi.title} className={styles.card}>
              <div className={styles.kpiIcon}>{kpi.icon}</div>
              <div className={styles.kpiInfo}>
                <p>{kpi.title}</p>
                <span>{kpi.value}</span>
              </div>
            </div>
          ))}
        </section>

        <div className={styles.mainGrid}>
          <div className={styles.leftColumn}>
            <div className={styles.card}>
              <h2>Sua Ferramenta de Divulgação</h2>
              <p className={styles.cardSubtitle}>Use seu link mágico para indicar a Phandshop e ganhar comissões.</p>
              <div className={styles.linkWrapper}>
                <input type="text" readOnly value={parceiro.linkIndicacao} />
                <button onClick={handleCopy}>{copied ? "Copiado!" : "Copiar"}</button>
              </div>
              <div className={styles.shareButtons}>
                <span>Compartilhar em:</span>
                <FaWhatsapp className={styles.shareIcon} />
                <FaTwitter className={styles.shareIcon} />
              </div>
            </div>

            <div className={styles.card}>
              <h2>Suas Indicações</h2>
              {indicacoes.length > 0 ? (
                <div className={styles.tableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Loja Indicada</th>
                        <th>Data</th>
                        <th>Plano</th>
                        <th>Status</th>
                        <th>Sua Comissão/Mês</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indicacoes.map(ind => (
                        <tr key={ind.id}>
                          <td>{ind.loja}</td>
                          <td>{ind.data}</td>
                          <td>{ind.plano}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles['status' + ind.status]}`}>
                              {ind.status === 'Ativo' && <FaCheckCircle />}
                              {ind.status === 'Pendente' && <FaExclamationCircle />}
                              {ind.status === 'Cancelado' && <FaTimesCircle />}
                              {ind.status}
                            </span>
                          </td>
                          <td>{ind.comissao}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <FaUsers />
                  <h3>Nenhuma indicação ainda</h3>
                  <p>Compartilhe seu link mágico para começar a ganhar comissões!</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.rightColumn}>
            <div className={styles.card}>
              <h2>Informações para Recebimento</h2>
              <p className={styles.cardSubtitle}>Mantenha seus dados atualizados para receber suas comissões em dia.</p>
              <div className={styles.tabs}>
                <button onClick={() => setPaymentMethod('pix')} className={paymentMethod === 'pix' ? styles.activeTab : ''}><FaPiggyBank /> PIX</button>
                <button onClick={() => setPaymentMethod('banco')} className={paymentMethod === 'banco' ? styles.activeTab : ''}><FaUniversity /> Conta Bancária</button>
              </div>

              {paymentMethod === 'pix' ? (
                <div className={styles.formContent}>
                  <label htmlFor="pix-tipo">Tipo de Chave PIX</label>
                  <select id="pix-tipo">
                    <option>CPF</option>
                    <option>CNPJ</option>
                  </select>
                  <label htmlFor="pix-chave">Chave PIX</label>
                  <input id="pix-chave" type="text" placeholder="Sua chave PIX" />
                </div>
              ) : (
                <div className={styles.formContent}>
                  <label htmlFor="banco">Banco</label>
                  <input id="banco" type="text" placeholder="Ex: 260 - Nu Pagamentos S.A." />
                  <label htmlFor="agencia">Agência</label>
                  <input id="agencia" type="text" placeholder="0001" />
                  <label htmlFor="conta">Conta com dígito</label>
                  <input id="conta" type="text" placeholder="123456-7" />
                </div>
              )}
              <button className={styles.saveButton}>Salvar Informações</button>
            </div>

            <div className={styles.card}>
                <h2>Novos Clientes Indicados</h2>
                <div className={styles.graficoWrapper}>
                    <svg viewBox="0 0 300 120" aria-label="Gráfico de clientes últimos meses" role="img">
                        {/* Linhas de fundo do gráfico */}
                        {[...Array(5)].map((_, i) => <line key={i} x1="0" y1={i * 25} x2="300" y2={i * 25} stroke="#e9e9f2" strokeWidth="1"/>)}
                        
                        {/* Linha de dados do gráfico */}
                        <polyline fill="none" stroke="var(--brand-purple)" strokeWidth="2"
                            points={graficoData.map((d, i) => `${(i * 50) + 25},${100 - d.clientes * 6}`).join(' ')}
                        />
                        
                        {/* Pontos e legendas do gráfico */}
                        {graficoData.map((d, i) => (
                            <g key={d.mes}>
                                <circle cx={(i * 50) + 25} cy={100 - d.clientes * 6} r="3" fill="var(--brand-purple)" />
                                <text x={(i * 50) + 25} y="115" className={styles.chartLabel}>{d.mes}</text>
                            </g>
                            
                        ))}
                    </svg>
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}