// app/(sitetemas)/sitetemas/[lojaSlug]/carrinho/page.tsx
"use client";

import React from "react";

export default function CarrinhoPage() {
  // Mock → depois substituir por estado global / Supabase
  const items = [
    { id: 1, name: "Produto 1", price: 99.9, qty: 1, image: "/placeholder.jpg" },
    { id: 2, name: "Produto 2", price: 149.9, qty: 2, image: "/placeholder.jpg" },
  ];

  const subtotal = items.reduce((acc, i) => acc + i.price * i.qty, 0);

  return (
    <main className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Carrinho</h1>
      <div className="grid gap-4">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b pb-4">
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover" />
            <div className="flex-1">
              <h2 className="font-bold">{item.name}</h2>
              <p>Qtd: {item.qty}</p>
            </div>
            <p className="font-bold">R$ {item.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
      <div className="text-right mt-6">
        <p className="text-lg mb-2">Subtotal: R$ {subtotal.toFixed(2)}</p>
        <a
          href="/checkout"
          className="inline-block bg-[var(--color-primary)] text-white px-6 py-2 rounded-[var(--radius)]"
        >
          Finalizar compra
        </a>
      </div>
    </main>
  );
}
