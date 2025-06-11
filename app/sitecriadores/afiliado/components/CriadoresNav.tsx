// components/CriadoresNav.tsx
"use client";

import React, { useState } from "react";

const links = [
  { href: "/", label: "Voltar ao site" },
  { href: "/suporte", label: "Suporte" },
  { href: "/perfil", label: "Perfil" },
];

export default function CriadoresNav() {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <nav style={{ display: "flex", gap: "1.5rem" }}>
      {links.map(({ href, label }, idx) => (
        <a
          key={href}
          href={href}
          style={{
            color: hoverIndex === idx ? "#9B59B6" : "#B3B3B3",
            textDecoration: "none",
            fontWeight: 500,
            alignSelf: "center",
            cursor: "pointer",
            transition: "color 0.3s",
          }}
          onMouseEnter={() => setHoverIndex(idx)}
          onMouseLeave={() => setHoverIndex(null)}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
