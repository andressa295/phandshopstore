"use client";

import React, { useState } from "react";
import Link from "next/link";

const links = [
  { href: "/", label: "Voltar ao site" },
  { href: "/suporte", label: "Suporte" },
  { href: "/perfil", label: "Perfil" },
];

export default function CriadoresNav() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <nav
      style={{
        display: "flex",
        gap: "2rem",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem 0",
        fontSize: "1rem",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {links.map(({ href, label }, idx) => (
        <Link key={href} href={href} passHref>
          <span
            style={{
              color: hoverIndex === idx ? "#7c3aed" : "#666",
              textDecoration: "none",
              fontWeight: 500,
              cursor: "pointer",
              transition: "color 0.3s ease-in-out",
              padding: "4px 8px",
              borderRadius: "6px",
              backgroundColor: hoverIndex === idx ? "#f5f0ff" : "transparent",
            }}
            onMouseEnter={() => setHoverIndex(idx)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
