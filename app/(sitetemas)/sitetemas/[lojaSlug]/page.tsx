"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import TemaPadrao from "./themes/padrao/TemaPadrao";
import { ThemeConfig } from "./theme/types";

// Tipos auxiliares
interface LojaRow {
  id: string;
  nome_loja: string;
  slug: string;
  theme_config_id: string; // FK para theme_configs
}

interface ThemeConfigRow {
  id: string;
  nome_tema: string;
  config_json: ThemeConfig | string;
}

// 🔑 Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LojaPage() {
  const { lojaSlug } = useParams<{ lojaSlug: string }>();

  const [lojaData, setLojaData] = useState<LojaRow | null>(null);
  const [themeConfig, setThemeConfig] = useState<ThemeConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoja() {
      try {
        // 1️⃣ Busca a loja pelo slug
        const { data: lojaRow, error: e1 } = await supabase
          .from("lojas")
          .select("id, nome_loja, slug, theme_config_id")
          .eq("slug", lojaSlug)
          .maybeSingle();

        if (e1) throw new Error(e1.message);
        if (!lojaRow) {
          console.warn("Loja não encontrada");
          setLoading(false);
          return;
        }

        setLojaData(lojaRow);

        // 2️⃣ Busca a configuração do tema vinculada
        const { data: themeConfigRow, error: e2 } = await supabase
          .from("theme_configs")
          .select("id, nome_tema, config_json")
          .eq("id", lojaRow.theme_config_id)
          .maybeSingle();

        if (e2) throw new Error(e2.message);
        if (!themeConfigRow) {
          console.warn("Configuração de tema não encontrada");
          setLoading(false);
          return;
        }

        const config =
          typeof themeConfigRow.config_json === "string"
            ? JSON.parse(themeConfigRow.config_json)
            : themeConfigRow.config_json;

        setThemeConfig(config as ThemeConfig);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchLoja();
  }, [lojaSlug]);

  if (loading) return <p>Carregando...</p>;
  if (!lojaData) return <p>Loja não encontrada</p>;
  if (!themeConfig) return <p>Tema não configurado</p>;

  // 📦 produtos mock → depois trocar pela tabela "produtos"
  const produtos = [
    { id: 1, name: "Produto A", price: 99.9, imageUrl: "/placeholder.jpg" },
    { id: 2, name: "Produto B", price: 149.9, imageUrl: "/placeholder.jpg" },
    { id: 3, name: "Produto C", price: 199.9, imageUrl: "/placeholder.jpg" },
  ];

  return (
    <TemaPadrao
      lojaData={{ nome: lojaData.nome_loja, logoUrl: "/logoroxo.png" }}
      produtos={produtos}
      themeConfig={themeConfig}
    />
  );
}
