"use client";

import React, { useState } from "react";

interface LoginFormProps {
  buttonLabel?: string;
  onSubmit?: (data: { email: string; password: string }) => void;
}

export default function LoginForm({
  buttonLabel = "Entrar",
  onSubmit,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({ email, password });
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <label className="flex flex-col gap-1 text-sm">
        <span>E-mail</span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          required
          className="border p-2 rounded"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        <span>Senha</span>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Digite sua senha"
          required
          className="border p-2 rounded"
        />
      </label>

      <button
        type="submit"
        className="bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-90 transition"
      >
        {buttonLabel}
      </button>
    </form>
  );
}
