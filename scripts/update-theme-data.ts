// scripts/update-theme-data.ts

import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid'; // Para gerar UUIDs se necessário

// Importa a interface ThemeConfig e o defaultThemeConfig para garantir a estrutura
import { ThemeConfig, HomepageModuleType } from '../app/(painel)/personalizar/types'; // Ajuste o caminho se necessário
import defaultThemeConfig from '../app/(painel)/personalizar/context/defaultThemeConfig'; // Ajuste o caminho se necessário

// Garante que as variáveis de ambiente estão carregadas.
// Para scripts Node.js standalone, você pode precisar de 'dotenv' se não estiver em um ambiente Next.js.
// Certifique-se de que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão presentes no .env.local
// e que o script é executado no ambiente correto (ex: `npx ts-node scripts/update-theme-data.ts`).
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas.');
  console.error('Por favor, verifique seu arquivo .env.local e o ambiente de execução do script.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ====================================================================
// ATENÇÃO: SUBSTITUA ESTE VALOR PELO SLUG DA SUA LOJA DE TESTE!
// Este é o slug da loja que terá as configurações de tema atualizadas.
const lojaIdentifier = 'andressa-aliancas-1';
const lojaIdentifierType: 'id' | 'slug' = 'slug'; // Pode ser 'id' ou 'slug'
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
//   novasConfiguracoesDoTema.homepage.modules[0].data.title = "Novo Título do Banner via Script!";
//   novasConfiguracoesDoTema.homepage.modules[0].isActive = true;
// }


async function updateLojaThemeConfig() {
  console.info(`[SCRIPT] Iniciando atualização de configurações de tema.`);
  console.info(`[SCRIPT] Tentando encontrar a loja com identificador: '${lojaIdentifier}' (Tipo: '${lojaIdentifierType}')`);
  // Evita imprimir o JSON completo no console, a menos que seja para depuração intensa, devido ao tamanho.
  // console.debug('[SCRIPT] Novas configurações a serem salvas:', JSON.stringify(novasConfiguracoesDoTema, null, 2));

  try {
    // 1. Verificar se a loja é encontrada usando o identificador
    const { data: existingLoja, error: fetchError } = await supabase
      .from('lojas')
      .select('id, slug, configuracoes_tema_json')
      .eq(lojaIdentifierType, lojaIdentifier)
      .single(); // Usa single() para esperar apenas um resultado ou null/erro

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('[SCRIPT] Erro ao verificar a loja existente:', fetchError.message);
      return { success: false, error: fetchError.message };
    }

    if (!existingLoja) {
      console.warn(`[SCRIPT] Atenção: Nenhuma loja encontrada com ${lojaIdentifierType} '${lojaIdentifier}'.`);
      console.warn('[SCRIPT] Por favor, verifique se o identificador está correto no banco de dados e no script.');
      return { success: false, error: 'Loja não encontrada.' };
    }

    const lojaIdParaAtualizar = existingLoja.id;
    console.info(`[SCRIPT] Loja encontrada: ID='${lojaIdParaAtualizar}', Slug='${existingLoja.slug}'.`);
    console.info('[SCRIPT] Conteúdo atual de configuracoes_tema_json (antes do update):');
    console.debug(JSON.stringify(existingLoja.configuracoes_tema_json, null, 2));


    // 2. Proceder com a atualização
    console.info(`[SCRIPT] Tentando atualizar a loja com ID: '${lojaIdParaAtualizar}'...`);
    // O .select() após o update é importante para retornar os dados atualizados.
    const { data, error } = await supabase
      .from('lojas')
      .update({ configuracoes_tema_json: novasConfiguracoesDoTema })
      .eq('id', lojaIdParaAtualizar)
      .select();

    console.info('--- RESULTADO SUPABASE UPDATE ---');
    console.info('Data retornada pelo update:', data); // Deve ser um array com o objeto atualizado
    console.info('Erro retornado pelo update:', error);
    console.info('---------------------------------');

    if (error) {
      console.error('[SCRIPT] Erro ao atualizar configurações do tema:', error.message);
      return { success: false, error: error.message };
    }

    if (data && Array.isArray(data) && data.length > 0) {
      const updatedLoja = data[0]; // Como usamos .single() antes, esperamos 1 resultado
      console.info('[SCRIPT] Configurações do tema atualizadas com sucesso para a loja:');
      console.info(`[SCRIPT] ID da loja: '${updatedLoja.id}'`);
      console.info('[SCRIPT] Novo conteúdo JSON (retornado pelo update):');
      console.debug(JSON.stringify(updatedLoja.configuracoes_tema_json, null, 2));
      return { success: true, data: updatedLoja };
    } else {
      console.warn('[SCRIPT] Atenção: A operação de atualização foi concluída, mas nenhuma linha foi afetada ou os dados não foram retornados. Isso é inesperado.');
      console.warn('[SCRIPT] Realizando uma re-leitura do `configuracoes_tema_json` para verificar o estado atual do banco...');

      const { data: reReadLoja, error: reReadError } = await supabase
        .from('lojas')
        .select('configuracoes_tema_json')
        .eq('id', lojaIdParaAtualizar)
        .single(); // Usa single() aqui também

      if (reReadError) {
        console.error('[SCRIPT] Erro ao re-ler a loja após a tentativa de update:', reReadError.message);
      } else if (reReadLoja) {
        console.info('[SCRIPT] Conteúdo de `configuracoes_tema_json` na loja (APÓS A TENTATIVA DE UPDATE VIA SCRIPT):');
        console.debug(JSON.stringify(reReadLoja.configuracoes_tema_json, null, 2));
        // Comparação para ver se a re-leitura mostra o que esperávamos
        if (JSON.stringify(reReadLoja.configuracoes_tema_json) === JSON.stringify(novasConfiguracoesDoTema)) {
            console.info('[SCRIPT] A re-leitura CONFIRMA que os dados foram atualizados no banco, apesar do retorno do UPDATE ter sido vazio.');
            return { success: true, data: reReadLoja }; // Considera sucesso se a re-leitura estiver ok
        } else {
            console.error('[SCRIPT] A re-leitura NÃO CORRESPONDE às configurações que tentamos salvar. O update falhou.');
            return { success: false, error: 'Update falhou e re-leitura não corresponde.' };
        }
      } else {
        console.warn('[SCRIPT] Não foi possível re-ler o `configuracoes_tema_json` após a tentativa de update.');
      }

      console.error('[SCRIPT] Por favor, compartilhe este log COMPLETO. Se este problema persistir, será necessário investigar a fundo a comunicação entre o `supabase-js` e sua instância Supabase, possivelmente com o suporte do Supabase.');
      return { success: false, error: 'Nenhuma alteração aplicada ou linha afetada. Problema na comunicação do cliente/banco.' };
    }
  } catch (err: any) {
    console.error('[SCRIPT] Erro inesperado ao atualizar configurações:', err.message);
    return { success: false, error: 'Erro inesperado ao atualizar configurações.' };
  }
}

// Executa a função
updateLojaThemeConfig();
