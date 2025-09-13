import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { padraoConfig } from "../app/(sitetemas)/sitetemas/[lojaSlug]/themes/padrao/config";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 🔑 precisa ser service role
);

async function populateThemeConfigs() {
  console.log("🚀 Populando tabela 'theme_configs'...");

  // 1️⃣ Inserir/atualizar config padrão na tabela theme_configs
  const { error: insertError } = await supabase
    .from("theme_configs")
    .upsert(
      {
        nome_tema: padraoConfig.themeName,
        config_json: padraoConfig,
        is_default: true,
      },
      { onConflict: "nome_tema" }
    );

  if (insertError) {
    console.error("❌ Erro ao inserir Tema Padrão:", insertError.message);
    process.exit(1);
  }

  console.log("✅ Tema Padrão configurado como default em 'theme_configs'.");

  // 2️⃣ Buscar lojas
  const { data: lojas, error: lojasError } = await supabase
    .from("lojas")
    .select("id, theme_config");

  if (lojasError) {
    console.error("❌ Erro ao buscar lojas:", lojasError.message);
    return;
  }

  // 3️⃣ Atualizar apenas lojas que ainda não possuem config
  for (const loja of lojas ?? []) {
    if (!loja.theme_config) {
      const { error: updateError } = await supabase
        .from("lojas")
        .update({ theme_config: padraoConfig }) // 🔥 injeta JSON direto
        .eq("id", loja.id);

      if (updateError) {
        console.error(`❌ Erro ao atualizar loja ${loja.id}:`, updateError.message);
      } else {
        console.log(`✅ Loja ${loja.id} atualizada com Tema Padrão.`);
      }
    }
  }

  console.log("🎉 População concluída.");
}

populateThemeConfigs();
