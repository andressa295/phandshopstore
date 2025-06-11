'use client';

import Image from "next/image";
import Link from "next/link";
import styles from './Footer.module.css';
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

export function Footer() {
  const menuItems = [
    { label: 'Funcionalidades', href: '/#funcionalidades' },
    { label: 'Planos e Preços', href: '/planos' },
    { label: 'Para Desenvolvedores', href: '/criadores' }
  ];

  const atendimentoItems = [
    { label: 'Central de ajuda', href: '/central-de-ajuda' },
    { label: 'Fale conosco', href: '/contato' },
    { label: 'Trabalhe conosco', href: '/carreiras' }
  ];

  return (
    <footer id="contato" className={styles.footer}>
      <div className={styles.footerGrid}>
        <div className={styles.column}>
          <h4>Menu</h4>
          <ul>
            {menuItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={styles.footerLink}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Atendimento</h4>
          <ul>
            {atendimentoItems.map((item) => (
              <li key={item.label}>
                <Link href={item.href} className={styles.footerLink}>{item.label}</Link>
              </li>
            ))}
            <li>
              <a
                href="https://wa.me/5511999999999"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.footerLink}
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Siga-nos</h4>
          <div className={styles.socialIcons}>
            <a href="https://instagram.com/phandshop" aria-label="Instagram" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
              <FaInstagram size={24} />
            </a>
            <a href="https://facebook.com/phandshop" aria-label="Facebook" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
              <FaFacebook size={24} />
            </a>
            <a href="https://wa.me/5511999999999" aria-label="Whatsapp" className={styles.footerLink} target="_blank" rel="noopener noreferrer">
              <FaWhatsapp size={24} />
            </a>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.logoAndCopyright}>
          <Link href="/">
            <Image src="/logo.png" alt="Logo Phandshop Branco" width={150} height={40} />
          </Link>
          <p>© {new Date().getFullYear()} Phandshop. Todos os direitos reservados.</p>
        </div>

        <div className={styles.companyDetails}>
          Phandshop Pagamentos e Serviços LTDA.<br />
          CNPJ: 22.324.028/0001-17<br />
          Rua Doutor Fontes de Resende, 01 - sala 24, Vila Matilde, São Paulo - SP
        </div>
      </div>
    </footer>
  );
}
