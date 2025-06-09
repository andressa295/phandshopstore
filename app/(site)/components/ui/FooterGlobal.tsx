'use client';

import Image from "next/image";
import Link from "next/link";
import styles from './Footer.module.css'; // Mude se o nome do seu CSS for diferente
import { FaWhatsapp, FaFacebook, FaInstagram } from "react-icons/fa";

export function Footer() {
  const menuItems = ['Loja online', 'Funcionalidades', 'Dropship', 'Loja de temas', 'Planos e Preços'];
  const atendimentoItems = ['Central de ajuda', 'Fale conosco'];

  return (
    <footer id="contato" className={styles.footer}>
      {/* Grade superior com os links de navegação */}
      <div className={styles.footerGrid}>

        <div className={styles.column}>
          <h4>Menu</h4>
          <ul>
            {menuItems.map((item) => (
              <li key={item}>
                <Link href="#" className={styles.footerLink}>{item}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Atendimento</h4>
          <ul>
            {atendimentoItems.map((item) => (
              <li key={item}>
                <Link href="#" className={styles.footerLink}>{item}</Link>
              </li>
            ))}
            <li>
              <a href="https://wa.me/SEUNUMERO" target="_blank" rel="noopener noreferrer" className={styles.footerLink}>WhatsApp</a>
            </li>
          </ul>
        </div>

        <div className={styles.column}>
          <h4>Siga-nos</h4>
          <div className={styles.socialIcons}>
            <a href="#" aria-label="Instagram" className={styles.footerLink}><FaInstagram size={24} /></a>
            <a href="#" aria-label="Facebook" className={styles.footerLink}><FaFacebook size={24} /></a>
            <a href="#" aria-label="Whatsapp" className={styles.footerLink}><FaWhatsapp size={24} /></a>
          </div>
        </div>
      </div>

      {/* Seção inferior com logo, copyright e dados da empresa */}
      <div className={styles.footerBottom}>
        <div className={styles.logoAndCopyright}>
          <Link href="/">
            <Image src="/logo.png" alt="Logo Phandshop Branco" width={150} height={40} />
          </Link>
          <p>© {new Date().getFullYear()} Phandshop. Todos os direitos reservados.</p>
        </div>
        
        <div className={styles.companyDetails}>
          Phandshop Pagamentos e Serviços LTDA.<br/>
          CNPJ: 22.324.028/0001-17<br/>
          Rua Doutor Fontes de Resende, 01 - sala 24, Vila Matilde, São Paulo - SP
        </div>
      </div>
    </footer>
  );
}