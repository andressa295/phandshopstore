// scripts/update-theme-data.ts (ou em uma API Route do Next.js)

import { createClient } from '@supabase/supabase-js';

// Carrega as variáveis de ambiente. Em um ambiente Next.js, elas são carregadas automaticamente.
// Se estiver executando como um script Node.js puro, você pode precisar de 'dotenv'.
// require('dotenv').config(); 

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verifica se as credenciais estão disponíveis
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas.');
  process.exit(1); // Sai com erro
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ====================================================================
// ATENÇÃO: SUBSTITUA ESTE VALOR PELO ID OU SLUG DA SUA LOJA DE TESTE!
// Você pode usar o ID (UUID) da loja ou o slug (nome na URL).
// Se usar o slug, mude a linha '.eq('id', lojaIdentifier)' para '.eq('slug', lojaIdentifier)'.
const lojaIdentifier = '2a12f653-f582-4ea4-b7e1-988601715f1c'; // Ex: 'a1b2c3d4-e5f6-7890-1234-567890abcdef'
// ====================================================================

// O objeto JSON que será salvo na coluna 'configuracoes_tema_json'
const novasConfiguracoesDoTema = {
  info_bar_items: [
    {
      id: "1",
      icone: "CreditCard",
      titulo: "Parcele em até 12x",
      descricao: "No cartão de crédito"
    },
    {
      id: "2",
      icone: "Truck",
      titulo: "Envio Full em até 24h",
      descricao: "Para capitais selecionadas"
    },
    {
      id: "3",
      icone: "Gift",
      titulo: "Frete Grátis",
      descricao: "Estado de SP (consulte condições)"
    },
    {
      id: "4",
      icone: "ShieldCheck",
      titulo: "Segurança na Compra",
      descricao: "Seus dados protegidos"
    },
    {
      id: "5",
      icone: "MessageSquareText",
      titulo: "Atendimento WhatsApp",
      descricao: "Fale conosco agora!"
    },
    {
      id: "6",
      icone: "Package",
      titulo: "Entrega Rápida",
      descricao: "Receba em 2 dias úteis"
    },
    {
      id: "7",
      icone: "AlertCircle",
      titulo: "Atenção!",
      "descricao": "Verifique a disponibilidade"
    },
    {
      id: "8",
      icone: "QrCode",
      titulo: "Pague com Pix",
      descricao: "Pagamento instantâneo"
    },
    {
      id: "9",
      icone: "Receipt",
      titulo: "Boleto Bancário",
      descricao: "Pague em qualquer banco"
    }
  ],
  // Mantenha outras configurações do tema que você já tem aqui ou adicione novas
  outras_configuracoes_do_tema: {
    cor_primaria: "#7C3AED",
    fonte_titulos: "Inter, sans-serif"
    // ...
  }
};

async function updateLojaThemeConfig() {
  console.log(`Tentando atualizar a loja com identificador: ${lojaIdentifier}`);
  console.log('Novas configurações a serem salvas:', JSON.stringify(novasConfiguracoesDoTema, null, 2));

  try {
    const { data, error } = await supabase
      .from('lojas') // Nome da sua tabela de lojas
      .update({ configuracoes_tema_json: novasConfiguracoesDoTema })
      .eq('id', lojaIdentifier); // Use 'id' se lojaIdentifier for um UUID, ou 'slug' se for o slug da URL

    if (error) {
      console.error('Erro ao atualizar configurações do tema:', error.message);
      return { success: false, error: error.message };
    }

    // Correção: Adiciona uma asserção de tipo explícita para 'data'
    // Isso informa ao TypeScript que, se 'data' existe e é um array, ele é um array de objetos.
    if (data && Array.isArray(data)) {
      const updatedData = data as Array<Record<string, any>>; // Asserção de tipo
      if (updatedData.length > 0) {
        console.log('Configurações do tema atualizadas com sucesso para a loja:', updatedData);
        return { success: true, data: updatedData };
      } else {
        console.warn('Nenhum registro encontrado ou atualizado. Verifique se o ID/Slug da loja está correto.');
        return { success: false, error: 'Loja não encontrada ou não atualizada.' };
      }
    } else {
      console.warn('Nenhum registro encontrado ou atualizado. Verifique se o ID/Slug da loja está correto.');
      return { success: false, error: 'Loja não encontrada ou não atualizada.' };
    }
  } catch (err: any) {
    console.error('Erro inesperado ao atualizar configurações:', err.message);
    return { success: false, error: 'Erro inesperado ao atualizar configurações.' };
  }
}

// Para executar a função, chame-a.
// Se este for um script temporário, você pode chamá-la diretamente:
updateLojaThemeConfig();

// Se for uma API Route, a chamada seria no handler da API, por exemplo:
/*
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const result = await updateLojaThemeConfig();
    if (result.success) {
      res.status(200).json({ message: 'Configurações atualizadas com sucesso!', data: result.data });
    } else {
      res.status(500).json({ error: result.error });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
*/
