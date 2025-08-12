import React from "react";
import Planos from "../components/Planos";

export const metadata = {
  title: "Planos e Preços | Phandshop",
  description: "Compare os planos da Phandshop e escolha a melhor opção para sua loja virtual. Do básico ao Master, temos a solução ideal para você vender online!",
};

const PaginaDePlanos = () => {
  return (
    <main style={{ backgroundColor: "#6b21a8", minHeight: "100vh" }}>
      <section style={{ textAlign: "center", padding: "4rem 1rem 2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold", color: "#ffffffff" }}>
          Planos e Preços
        </h1>
        <p style={{ fontSize: "1rem", color: "#ddddddff", marginTop: "0.5rem" }}>
          Escolha o plano ideal para o seu negócio e comece a vender online hoje mesmo.
        </p>
      </section>

      <Planos />
    </main>
  );
};

export default PaginaDePlanos;
