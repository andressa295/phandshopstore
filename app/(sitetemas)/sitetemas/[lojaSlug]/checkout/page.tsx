// app/(sitetemas)/sitetemas/[lojaSlug]/checkout/page.tsx
"use client";

import React, { useState } from "react";

export default function CheckoutPage() {
  const [step, setStep] = useState<"address" | "payment" | "review">("address");

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      {step === "address" && (
        <section>
          <h2 className="font-bold mb-2">Endereço de entrega</h2>
          <form className="grid gap-3">
            <input type="text" placeholder="Nome completo" className="border p-2 rounded" />
            <input type="text" placeholder="Endereço" className="border p-2 rounded" />
            <input type="text" placeholder="Cidade" className="border p-2 rounded" />
            <input type="text" placeholder="CEP" className="border p-2 rounded" />
          </form>
          <button
            onClick={() => setStep("payment")}
            className="mt-4 bg-[var(--color-primary)] text-white px-6 py-2 rounded-[var(--radius)]"
          >
            Continuar para pagamento
          </button>
        </section>
      )}

      {step === "payment" && (
        <section>
          <h2 className="font-bold mb-2">Pagamento</h2>
          <form className="grid gap-3">
            <input type="text" placeholder="Número do cartão" className="border p-2 rounded" />
            <input type="text" placeholder="Validade" className="border p-2 rounded" />
            <input type="text" placeholder="CVV" className="border p-2 rounded" />
          </form>
          <button
            onClick={() => setStep("review")}
            className="mt-4 bg-[var(--color-primary)] text-white px-6 py-2 rounded-[var(--radius)]"
          >
            Revisar pedido
          </button>
        </section>
      )}

      {step === "review" && (
        <section>
          <h2 className="font-bold mb-2">Revisão do pedido</h2>
          <p>Produtos: R$ 349,70</p>
          <p>Frete: R$ 19,90</p>
          <p className="font-bold">Total: R$ 369,60</p>
          <button className="mt-4 bg-green-600 text-white px-6 py-2 rounded-[var(--radius)]">
            Finalizar pedido
          </button>
        </section>
      )}
    </main>
  );
}
