'use client';

import Image from "next/image";
import Link from "next/link";
import styles from './Footer.module.css';
import { FaWhatsapp, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

export function Footer() {
    const plataformaItems = [
        { label: 'Sobre a Phandshop', href: '/sobre' },
        { label: 'Nossas Planos', href: '/planos' },
        { label: 'Conversão', href: '/conversao' },
        { label: 'Automação', href: '/automacao' },
        { label: 'Análises', href: '/analises' }
    ];

    const profissionaisItems = [
        { label: 'Seja um parceiro', href: '/seja-um-parceiro' },
        { label: 'Especialistas', href: '/contratar/diretorio' },
        { label: 'Contrate um parceiro', href: '/contratar' },
        { label: 'Trabalhe Conosco', href: '/trabalhe-conosco' }
    ];

    const recursosItems = [
        { label: 'Temas Exclusivos', href: '/temas' },
        { label: 'Blog da Phandshop', href: '/blog' },
        { label: 'Tutoriais', href: '/tutoriais' },
        { label: 'Documentação API', href: '/api' }
    ];

    const atendimentoItems = [
        { label: 'Fale Conosco', href: '/contato' },
        { label: 'Central de Ajuda', href: '/ajuda' },
        { label: 'Status do Sistema', href: '/status' }
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.footerTop}>
                <div className={styles.footerLogoWrapper}>
                    
                </div>
            </div>

            <div className={styles.footerGrid}>
                {/* Coluna 1: Plataforma */}
                <div className={styles.column}>
                    <h4>Plataforma</h4>
                    <ul>
                        {plataformaItems.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className={styles.footerLink}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Coluna 2: Profissionais */}
                <div className={styles.column}>
                    <h4>Profissionais</h4>
                    <ul>
                        {profissionaisItems.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className={styles.footerLink}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Coluna 3: Recursos */}
                <div className={styles.column}>
                    <h4>Recursos</h4>
                    <ul>
                        {recursosItems.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className={styles.footerLink}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Coluna 4: Atendimento */}
                <div className={styles.column}>
                    <h4>Atendimento</h4>
                    <ul>
                        {atendimentoItems.map((item) => (
                            <li key={item.label}>
                                <Link href={item.href} className={styles.footerLink}>{item.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className={styles.footerBottom}>
                {/* Direitos autorais e links */}
                <div className={styles.logoAndCopyright}>
                    <span>&copy; {new Date().getFullYear()} Phandshop. Todos os direitos reservados.</span>
                </div>
                <div className={styles.footerBottomLinks}>
                    <Link href="/politicas-e-termos" className={styles.footerLink}>Políticas, Termos e Condições</Link>
                </div>

                {/* Redes Sociais */}
                <div className={styles.footerSocials}>
                    <Link href="https://instagram.com/phandshop" className={styles.socialIcon} aria-label="Instagram">
                        <FaInstagram />
                    </Link>
                    <Link href="https://facebook.com/phandshop" className={styles.socialIcon} aria-label="Facebook">
                        <FaFacebook />
                    </Link>
                    <Link href="https://twitter.com/phandshop" className={styles.socialIcon} aria-label="Twitter">
                        <FaTwitter />
                    </Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
