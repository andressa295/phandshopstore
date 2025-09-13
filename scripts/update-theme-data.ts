import { createClient } from "@supabase/supabase-js";
import { ThemeConfig } from "../app/(sitetemas)/sitetemas/[lojaSlug]/theme/types";
import { padraoConfig } from "../app/(sitetemas)/sitetemas/[lojaSlug]/themes/padrao/config";

// 🔑 Variáveis de ambiente
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "Erro: Variáveis NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas."
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Usa a configuração do tema padrão
const themesDataWithConfig: { nome_tema: string; config: ThemeConfig }[] = [
  { nome_tema: "Padrao", config: padraoConfig },
];

async function updateThemesWithConfigs() {
  console.log(
    "Iniciando atualização da coluna 'configuracoes_json' na tabela 'temas'..."
  );

  for (const theme of themesDataWithConfig) {
    const { error } = await supabase
      .from("temas")
      .update({ configuracoes_json: theme.config })
      .eq("nome_tema", theme.nome_tema);

    if (error) {
      console.error(
        `❌ Erro ao atualizar o tema '${theme.nome_tema}':`,
        error.message
      );
    } else {
      console.log(
        `✅ Configuração para o tema '${theme.nome_tema}' atualizada com sucesso.`
      );
    }
  }

  console.log("Processo concluído.");
}

updateThemesWithConfigs();
