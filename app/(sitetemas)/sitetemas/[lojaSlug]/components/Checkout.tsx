"use client";

import React, { useState } from "react";

interface CheckoutForm {
  name: string;
  email: string;
  address: string;
  paymentMethod: string;
}

export default function Checkout() {
  const [form, setForm] = useState<CheckoutForm>({
    name: "",
    email: "",
    address: "",
    paymentMethod: "pix",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Pedido finalizado com sucesso! 🚀");
  };

  return (
    <section className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Finalizar Compra</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados pessoais */}
        <div>
          <label className="block text-sm font-medium mb-1">Nome</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Endereço */}
        <div>
          <label className="block text-sm font-medium mb-1">Endereço</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Método de pagamento */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Método de Pagamento
          </label>
          <select
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="pix">PIX</option>
            <option value="boleto">Boleto</option>
            <option value="cartao">Cartão de Crédito</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--color-primary)] text-white py-2 rounded hover:opacity-90 transition"
        >
          Confirmar Pedido
        </button>
      </form>
    </section>
  );
}
