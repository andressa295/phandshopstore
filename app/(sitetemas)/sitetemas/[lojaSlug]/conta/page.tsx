"use client";

import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";
import AccountDashboard from "../components/AccountDashboard";

export default function ContaPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [view, setView] = useState<"login" | "register">("login");

  if (isLogged) return <AccountDashboard />;

  return (
    <main className="p-6 max-w-md mx-auto">
      {view === "login" ? (
        <>
          <LoginForm />
          <p className="mt-4 text-sm">
            Não tem conta?{" "}
            <button
              className="text-[var(--color-primary)] underline"
              onClick={() => setView("register")}
            >
              Cadastre-se
            </button>
          </p>
        </>
      ) : (
        <>
          <RegisterForm />
          <p className="mt-4 text-sm">
            Já tem conta?{" "}
            <button
              className="text-[var(--color-primary)] underline"
              onClick={() => setView("login")}
            >
              Entrar
            </button>
          </p>
        </>
      )}
    </main>
  );
}
