"use client";

import React from "react";
import FiltersSidebar from "../components/FiltersSidebar";

export default function PesquisaPage() {
  // Mock → depois substituir por Supabase
  const results = [
    { id: 1, name: "Aliança Ouro", price: "R$ 599,00", image: "/placeholder.jpg" },
    { id: 2, name: "Aliança Prata", price: "R$ 199,00", image: "/placeholder.jpg" },
  ];

  return (
    <main className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
      <FiltersSidebar />
      <section className="md:col-span-3">
        <h1 className="text-xl font-bold mb-4">Resultados da pesquisa</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {results.map((p) => (
            <div key={p.id} className="border rounded p-2">
              <img src={p.image} alt={p.name} className="h-40 w-full object-cover" />
              <h2 className="mt-2">{p.name}</h2>
              <p className="text-[var(--color-primary)]">{p.price}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
