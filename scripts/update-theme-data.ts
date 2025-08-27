// scripts/update-theme-data.ts

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // Para gerar UUIDs se necessário

// Importa a interface ThemeConfig e o defaultThemeConfig para garantir a estrutura
import { ThemeConfig, HomepageModuleType } from '../app/(painel)/personalizar/types'; // Ajuste o caminho se necessário
import defaultThemeConfig from '../app/(painel)/personalizar//context/defaultThemeConfig'; // Ajuste o caminho se necessário

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ====================================================================
// ATENÇÃO: SUBSTITUA ESTE VALOR PELO SLUG DA SUA LOJA DE TESTE!
// Este é o slug da loja que terá as configurações de tema atualizadas.
const lojaIdentifier = 'andressa-aliancas-1';
const lojaIdentifierType = 'slug';
// ====================================================================

// ====================================================================
// O objeto JSON que será salvo na coluna 'configuracoes_tema_json'
// Usamos o defaultThemeConfig como base e o modificamos para incluir
// um timestamp, garantindo que o JSON seja sempre diferente a cada execução.
// ====================================================================
const novasConfiguracoesDoTema: ThemeConfig = JSON.parse(JSON.stringify(defaultThemeConfig)); // Faz uma cópia profunda

// Adiciona um timestamp para garantir que o JSON seja sempre diferente
if (novasConfiguracoesDoTema.advanced) {
  novasConfiguracoesDoTema.advanced.lastUpdatedScript = new Date().toISOString();
} else {
  novasConfiguracoesDoTema.advanced = { lastUpdatedScript: new Date().toISOString() };
}

// Opcional: Você pode modificar módulos específicos aqui se quiser testar
// Por exemplo, desativar um módulo ou mudar um título
// if (novasConfiguracoesDoTema.homepage?.modules && novasConfiguracoesDoTema.homepage.modules.length > 0) {
//   novasConfiguracoesDoTema.homepage.modules[0].data.title = "Novo Título do Banner via Script!";
//   novasConfiguracoesDoTema.homepage.modules[0].isActive = true;
// }


async function updateLojaThemeConfig() {
  console.log(`Tentando encontrar a loja com identificador: ${lojaIdentifier} (Tipo: ${lojaIdentifierType})`);
  console.log('Novas configurações a serem salvas (incluindo timestamp):', JSON.stringify(novasConfiguracoesDoTema, null, 2));

  try {
    // Primeiro, vamos verificar se a loja é encontrada usando o slug
    const { data: existingLoja, error: fetchError } = await supabase
      .from('lojas')
      .select('id, slug, configuracoes_tema_json')
      .eq(lojaIdentifierType, lojaIdentifier);

    if (fetchError) {
      console.error('Erro ao verificar a loja existente:', fetchError.message);
      return { success: false, error: fetchError.message };
    }

    if (!existingLoja || existingLoja.length === 0) {
      console.warn(`Atenção: Nenhuma loja encontrada com ${lojaIdentifierType} '${lojaIdentifier}'.`);
      console.warn('Por favor, verifique se o slug está correto no banco de dados e no script.');
      return { success: false, error: 'Loja não encontrada.' };
    }

    const lojaIdParaAtualizar = existingLoja[0].id;
    console.log(`Loja encontrada com ID: ${lojaIdParaAtualizar} e Slug: ${existingLoja[0].slug}`);
    console.log('Conteúdo atual de configuracoes_tema_json na loja (antes do update):', JSON.stringify(existingLoja[0].configuracoes_tema_json, null, 2));


    // Se a loja foi encontrada, procedemos com a atualização USANDO O ID
    console.log(`Tentando atualizar a loja com ID: ${lojaIdParaAtualizar}`);
    const { data, error } = await supabase
      .from('lojas')
      .update({ configuracoes_tema_json: novasConfiguracoesDoTema })
      .eq('id', lojaIdParaAtualizar)
      .select();

    console.log('--- RESULTADO SUPABASE UPDATE ---');
    console.log('Data:', data);
    console.log('Error:', error);
    console.log('---------------------------------');

    if (error) {
      console.error('Erro ao atualizar configurações do tema:', error.message);
      return { success: false, error: error.message };
    }

    if (data && Array.isArray(data) && data.length > 0) {
      const updatedData = data as Array<Record<string, any>>;
      console.log('Configurações do tema atualizadas com sucesso para a loja:', updatedData);
      console.log('O ID da loja é:', updatedData[0].id);
      console.log('O novo conteúdo JSON é:', JSON.stringify(updatedData[0].configuracoes_tema_json, null, 2));
      return { success: true, data: updatedData };
    } else {
      console.warn('Atenção: A operação de atualização foi concluída, mas nenhuma linha foi afetada ou os dados não foram retornados. Isso é inesperado, pois o RLS está desativado e o ID está correto. Além disso, o UPDATE de JSONB via SQL Editor funcionou.');
      console.warn('Isso sugere um problema na comunicação ou interpretação da resposta pelo cliente supabase-js para a coluna JSONB.');
      console.warn('\nRealizando uma re-leitura do configuracoes_tema_json para verificar o estado atual do banco...');

      const { data: reReadLoja, error: reReadError } = await supabase
        .from('lojas')
        .select('configuracoes_tema_json')
        .eq('id', lojaIdParaAtualizar);

      if (reReadError) {
        console.error('Erro ao re-ler a loja após a tentativa de update:', reReadError.message);
      } else if (reReadLoja && reReadLoja.length > 0) {
        console.log('Conteúdo de configuracoes_tema_json na loja (APÓS A TENTATIVA DE UPDATE VIA SCRIPT):', JSON.stringify(reReadLoja[0].configuracoes_tema_json, null, 2));
      } else {
        console.warn('Não foi possível re-ler o configuracoes_tema_json após a tentativa de update.');
      }

      console.warn('Por favor, compartilhe este log COMPLETO. Se este problema persistir, será necessário investigar a fundo a comunicação entre o supabase-js e sua instância Supabase, possivelmente com o suporte do Supabase.');
      return { success: false, error: 'Nenhuma alteração aplicada ou linha afetada. Problema na comunicação do cliente/banco.' };
    }
  } catch (err: any) {
    console.error('Erro inesperado ao atualizar configurações:', err.message);
    return { success: false, error: 'Erro inesperado ao atualizar configurações.' };
  }
}

updateLojaThemeConfig();