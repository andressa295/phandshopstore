"use client";

import React, { useState } from "react";

interface NewsletterProps {
  title?: string;
  description?: string;
  placeholder?: string;
  buttonLabel?: string;
  backgroundColor?: string;
  textColor?: string;
  onSubmit?: (email: string) => void;
}

export default function Newsletter({
  title = "Assine nossa Newsletter",
  description = "Receba promoções e novidades direto no seu e-mail",
  placeholder = "Seu e-mail",
  buttonLabel = "Assinar",
  backgroundColor = "var(--color-secondary)",
  textColor = "#000000",
  onSubmit,
}: NewsletterProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    onSubmit?.(email);
    setEmail("");
  };

  return (
    <section
      className="p-6 text-center"
      style={{ backgroundColor, color: textColor }}
    >
      <h2 className="text-xl font-bold mb-2">{title}</h2>
      <p className="mb-4">{description}</p>
      <form onSubmit={handleSubmit} className="flex justify-center gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          className="p-2 rounded-[var(--radius)] border"
        />
        <button
          type="submit"
          className="bg-[var(--color-primary)] text-white px-4 rounded-[var(--radius)] hover:opacity-90 transition"
        >
          {buttonLabel}
        </button>
      </form>
    </section>
  );
}
