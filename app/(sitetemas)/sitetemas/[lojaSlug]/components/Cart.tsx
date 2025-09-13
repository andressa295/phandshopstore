"use client";

import React from "react";

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartProps {
  items?: CartItem[];
}

export default function Cart({ items = [] }: CartProps) {
  const total = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <section className="p-4">
      <h1 className="text-xl font-bold mb-4">Carrinho de Compras</h1>

      {items.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-2"
            >
              <div className="flex items-center gap-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    {item.quantity}x R$ {item.price.toFixed(2)}
                  </p>
                </div>
              </div>
              <span className="font-semibold">
                R$ {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}

          <div className="flex justify-between font-bold text-lg pt-4">
            <span>Total:</span>
            <span>R$ {total.toFixed(2)}</span>
          </div>

          <button className="mt-4 w-full bg-[var(--color-primary)] text-white py-2 rounded hover:opacity-90 transition">
            Finalizar Compra
          </button>
        </div>
      )}
    </section>
  );
}
