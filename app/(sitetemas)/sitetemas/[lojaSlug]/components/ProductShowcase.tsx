"use client";

import React from "react";
import { ThemeConfig, ProductItem } from "../theme/types";

interface ProductShowcaseProps {
  products: ProductItem[];
  title: string;
  layout?: "grid" | "carousel";
  columns?: number;
  themeConfig: ThemeConfig;
}

export default function ProductShowcase({
  products,
  title,
  layout = "grid",
  columns = 4,
  themeConfig,
}: ProductShowcaseProps) {
  const pricing = themeConfig.productShowcase.pricing;

  return (
    <section className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>

      <div
        className={
          layout === "grid"
            ? `grid gap-6 grid-cols-2 md:grid-cols-${columns}`
            : "flex gap-4 overflow-x-auto"
        }
      >
        {products.map((p) => {
          const originalPrice = Number(p.price);
          const pixPrice =
            pricing?.enablePix && pricing.pixDiscount > 0
              ? originalPrice * (1 - pricing.pixDiscount)
              : null;

          const installments = pricing?.installments?.enabled
            ? pricing.installments
            : null;

          return (
            <div
              key={p.id}
              className="product-card border rounded-lg shadow-sm overflow-hidden hover:shadow-md transition bg-white flex flex-col"
            >
              <a href={p.href || "#"}>
                <img
                  src={p.imageUrl}
                  alt={p.name}
                  className="w-full aspect-square object-cover"
                />
              </a>

              <div className="product-card-content flex-1 flex flex-col p-4">
                <h3 className="font-semibold text-base mb-2">{p.name}</h3>

                {/* Preço normal */}
                <p className="product-price text-[var(--color-primary)] font-bold text-lg">
                  {originalPrice.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </p>

                {/* Pix com desconto */}
                {pixPrice && (
                  <p className="product-pix text-green-600 text-sm">
                    no Pix:{" "}
                    {pixPrice.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                )}

                {/* Parcelamento */}
                {installments && (
                  <p className="product-installments text-gray-600 text-sm">
                    até {installments.max}x de{" "}
                    {(originalPrice / installments.max).toLocaleString(
                      "pt-BR",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}{" "}
                    {installments.interestFree && "sem juros"}
                  </p>
                )}

                {/* Botão */}
                <button className="mt-auto bg-[var(--color-primary)] text-white py-2 px-4 rounded hover:opacity-90 transition">
                  Adicionar ao carrinho
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
