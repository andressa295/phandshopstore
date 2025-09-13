"use client";

import React from "react";

interface OrderConfirmationProps {
  orderId?: string;
  message?: string;
  nextSteps?: { label: string; href: string }[];
}

export default function OrderConfirmation({
  orderId,
  message = "Seu pedido foi confirmado com sucesso!",
  nextSteps = [
    { label: "Ver meus pedidos", href: "/conta/pedidos" },
    { label: "Continuar comprando", href: "/" },
  ],
}: OrderConfirmationProps) {
  return (
    <section className="max-w-2xl mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">🎉 Pedido Confirmado</h1>
      <p className="mb-2">{message}</p>
      {orderId && (
        <p className="mb-6 text-sm text-gray-600">
          Número do pedido: <span className="font-semibold">{orderId}</span>
        </p>
      )}

      <div className="flex justify-center gap-4">
        {nextSteps.map((step, i) => (
          <a
            key={i}
            href={step.href}
            className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            {step.label}
          </a>
        ))}
      </div>
    </section>
  );
}
