import { createClient } from '@supabase/supabase-js';
import { ThemeConfig } from '../app/(painel)/personalizar/types';
import { Padrao } from '../app/(painel)/personalizar/themes/Padrao';
import { defaultThemeConfig } from '../app/(painel)/personalizar/context/defaultThemeConfig';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não estão definidas.');
  process.exit(1);
}

// Usa a chave de Service Role para ter permissão de escrita
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const themesDataWithConfig: { nome_tema: string, config: ThemeConfig }[] = [
  { nome_tema: 'Padrao', config: Padrao },
  { nome_tema: 'Tema Padrão', config: defaultThemeConfig }
];

async function updateThemesWithConfigs() {
  console.log("Iniciando atualização de configurações na coluna 'configuracoes_json'...");

  for (const theme of themesDataWithConfig) {
    const { error } = await supabase
      .from('temas')
      .update({ configuracoes_json: theme.config })
      .eq('nome_tema', theme.nome_tema);

    if (error) {
      console.error(`Erro ao atualizar o tema '${theme.nome_tema}':`, error.message);
    } else {
      console.log(`Configuração para o tema '${theme.nome_tema}' atualizada com sucesso.`);
    }
  }

  console.log("Processo concluído.");
}

updateThemesWithConfigs();
