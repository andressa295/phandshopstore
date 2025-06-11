// app/central-de-ajuda/page.tsx

import React from 'react';
import Link from 'next/link';
import styles from './HelpCenter.module.css';
import { 
  FaRocket, FaBoxOpen, FaPalette, FaCreditCard, FaTruck, 
  FaFileAlt, FaBullhorn, FaUserCog, FaSearch, FaBook
} from 'react-icons/fa';

// --- DADOS DAS CATEGORIAS ---
const categories = [
  { icon: <FaRocket />, title: 'Primeiros Passos', description: 'Configure sua loja e faça sua primeira venda.', href: '/ajuda/primeiros-passos' },
  { icon: <FaBoxOpen />, title: 'Produtos e Estoque', description: 'Aprenda a cadastrar, importar e gerenciar seus produtos.', href: '/ajuda/produtos' },
  { icon: <FaPalette />, title: 'Personalizando sua Loja', description: 'Deixe a loja com a cara da sua marca, alterando temas e cores.', href: '/ajuda/personalizacao' },
  { icon: <FaCreditCard />, title: 'Pagamentos', description: 'Configure os meios de pagamento para receber por suas vendas.', href: '/ajuda/pagamentos' },
  { icon: <FaTruck />, title: 'Envios e Frete', description: 'Domine as configurações de frete, Correios e transportadoras.', href: '/ajuda/envios' },
  { icon: <FaFileAlt />, title: 'Pedidos e Clientes', description: 'Gerencie os pedidos recebidos e sua base de clientes.', href: '/ajuda/pedidos' },
  { icon: <FaBullhorn />, title: 'Marketing e Vendas', description: 'Crie cupons, integre redes sociais e impulsione suas vendas.', href: '/ajuda/marketing' },
  { icon: <FaUserCog />, title: 'Minha Conta e Planos', description: 'Gerencie sua assinatura, dados e configurações da sua conta.', href: '/ajuda/conta' },
];

// --- DADOS DOS ARTIGOS POPULARES (EXEMPLO) ---
const popularArticles = [
    { title: "Como configuro meu domínio próprio?", href: "/ajuda/personalizacao/configurar-dominio" },
    { title: "Integrando com o Mercado Pago: Guia Completo", href: "/ajuda/pagamentos/mercado-pago" },
    { title: "Cadastrando um produto com variações de tamanho e cor", href: "/ajuda/produtos/variacoes" },
    { title: "Como funciona a Sacolinha do Instagram?", href: "/ajuda/marketing/sacolinha-instagram" },
    { title: "Entendendo os tipos de frete", href: "/ajuda/envios/tipos-de-frete" },
];

// Definimos a função do componente da página aqui
function HelpCenterPage() {
  return (
    <main className={styles.pageWrapper}>

      {/* 1. SEÇÃO DE BUSCA */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Como podemos ajudar?</h1>
          <p>Encontre respostas, tutoriais e dicas para aproveitar ao máximo a Phandshop.</p>
          <div className={styles.searchBar}>
            <FaSearch className={styles.searchIcon} />
            <input type="text" placeholder="Busque por 'produto', 'frete', 'domínio'..." />
          </div>
        </div>
      </section>

      {/* 2. SEÇÃO DE CATEGORIAS */}
      <section className={styles.categoriesSection}>
        <div className={styles.contentContainer}>
          <div className={styles.categoriesGrid}>
            {categories.map((category) => (
              <Link href={category.href} key={category.title} className={styles.categoryCard}>
                <div className={styles.categoryIcon}>{category.icon}</div>
                <h3>{category.title}</h3>
                <p>{category.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 3. SEÇÃO DE ARTIGOS POPULARES */}
      <section className={styles.popularSection}>
        <div className={styles.contentContainer}>
            <h2 className={styles.sectionTitle}>Artigos Populares</h2>
            <ul className={styles.popularList}>
                {popularArticles.map(article => (
                    <li key={article.title}>
                        <Link href={article.href}>
                            <FaBook />
                            <span>{article.title}</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
      </section>

      {/* 4. SEÇÃO DE CONTATO */}
      <section className={styles.contactSection}>
        <div className={styles.contentContainer}>
            <div className={styles.contactBox}>
                <h3>Não encontrou o que procurava?</h3>
                <p>Sem problemas. Nossa equipe de especialistas está pronta para conversar com você e resolver qualquer questão.</p>
                <Link href="/contato" className={styles.contactButton}>Falar com o Suporte</Link>
            </div>
        </div>
      </section>

    </main>
  );
}

// A CORREÇÃO PRINCIPAL ESTÁ AQUI:
// Exportamos a função como padrão no final do arquivo.
// Isso garante que o Next.js entenda que HelpCenterPage é o componente principal desta rota.
export default HelpCenterPage;