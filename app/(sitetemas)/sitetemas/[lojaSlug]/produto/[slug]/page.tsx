// app/(sitetemas)/sitetemas/[lojaSlug]/produto/[slug]/page.tsx
"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useTheme } from "../../theme/ThemeProvider"; // ✅ importar hook certo

export default function ProdutoPage() {
  const { slug } = useParams();
  const { lojaData } = useTheme();

  // Mock → depois buscar do Supabase
  const product = {
    name: "Produto Exemplo",
    price: "R$ 199,90",
    description: "Descrição completa do produto.",
    images: ["/placeholder.jpg", "/placeholder.jpg"],
  };

  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Galeria */}
        <div>
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-96 object-cover rounded-[var(--radius)]"
          />
          <div className="flex gap-2 mt-2">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${product.name} ${i}`}
                className="w-20 h-20 object-cover rounded-[var(--radius)] border"
              />
            ))}
          </div>
        </div>

        {/* Infos */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-xl text-[var(--color-primary)] mb-4">
            {product.price}
          </p>
          <p className="mb-6">{product.description}</p>
          <button className="bg-[var(--color-primary)] text-white px-6 py-2 rounded-[var(--radius)]">
            Adicionar ao carrinho
          </button>
        </div>
      </div>
    </main>
  );
}
