"use client";

import React from "react";

export default function PaginaInstitucional({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Mock → depois puxar do Supabase (páginas institucionais dinâmicas)
  const content = {
    title: slug === "quem-somos" ? "Quem Somos" : "Política de Trocas",
    body:
      slug === "quem-somos"
        ? "Nossa loja nasceu com o objetivo de oferecer os melhores produtos."
        : "Você pode solicitar a troca em até 7 dias corridos após o recebimento.",
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{content.title}</h1>
      <p>{content.body}</p>
    </main>
  );
}
