"use client";

import React from "react";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterProps {
  text?: string;
  links?: FooterLink[];
  backgroundColor?: string;
  textColor?: string;
}

export default function Footer({
  text = `© ${new Date().getFullYear()} Phandshop. Todos os direitos reservados.`,
  links = [
    { label: "Sobre", href: "/sobre" },
    { label: "Política de Privacidade", href: "/politica" },
    { label: "Contato", href: "/contato" },
  ],
  backgroundColor = "var(--color-primary)",
  textColor = "#FFFFFF",
}: FooterProps) {
  return (
    <footer
      className="py-6 mt-8"
      style={{ backgroundColor, color: textColor }}
    >
      <div className="max-w-5xl mx-auto px-4 text-center">
        <nav className="mb-4 flex flex-wrap justify-center gap-4 text-sm">
          {links.map((link, i) => (
            <a
              key={i}
              href={link.href}
              className="hover:underline transition"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-xs">{text}</p>
      </div>
    </footer>
  );
}
