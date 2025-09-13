"use client";

import React from "react";

interface AccountDashboardProps {
  title?: string;
  welcomeMessage?: string;
  items?: { label: string; href?: string }[];
}

export default function AccountDashboard({
  title = "Minha Conta",
  welcomeMessage = "Bem-vindo de volta! Aqui você poderá ver seus pedidos e atualizar seus dados.",
  items = [
    { label: "Meus pedidos", href: "/conta/pedidos" },
    { label: "Meus endereços", href: "/conta/enderecos" },
    { label: "Configurações de conta", href: "/conta/configuracoes" },
  ],
}: AccountDashboardProps) {
  return (
    <section>
      <h1 className="text-xl font-bold mb-4">{title}</h1>
      <p>{welcomeMessage}</p>
      <ul className="mt-4 list-disc list-inside">
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <a href={item.href} className="text-blue-600 hover:underline">
                {item.label}
              </a>
            ) : (
              item.label
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
