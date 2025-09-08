import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { Padrao } from '../app/(painel)/personalizar/themes/Padrao'; // Importa o tema padrão
import * as dotenv from 'dotenv'; // Importa a biblioteca dotenv de forma correta

// Carrega as variáveis de ambiente do arquivo .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_ANON_KEY não estão definidas.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Dados dos temas fornecidos por você
const themesData = [
  { "id": "Prado", "nome": "Prado", "categoria": "Moda feminina elegante", "descricao": "Estilo sofisticado, paleta refinada, visual “chique de boutique”", "imagemUrl": "https://placehold.co/600x400/E0E7FF/4338CA?text=Prado+Preview" },
  { "id": "Neon", "nome": "Neon", "categoria": "Moda jovem / Streetwear", "descricao": "Cores vibrantes, visual urbano, fontes ousadas", "imagemUrl": "https://placehold.co/600x400/FF00FF/000000?text=Neon+Preview" },
  { "id": "Zeta", "nome": "Zeta", "categoria": "Eletrônicos / Tech store", "descricao": "Estilo clean, tech vibes, bem minimalista e direto", "imagemUrl": "https://placehold.co/600x400/000000/00FFFF?text=Zeta+Preview" },
  { "id": "Luna", "nome": "Luna", "categoria": "Joias / Acessórios", "descricao": "Visual delicado, lunar, tons suaves, brilho discreto", "imagemUrl": "https://placehold.co/600x400/F0F0F0/666666?text=Luna+Preview" },
  { "id": "Império", "nome": "Império", "categoria": "Moda masculina premium / Alta costura", "descricao": "Estilo imponente, visual com seriedade e luxo", "imagemUrl": "https://placehold.co/600x400/333333/FFD700?text=Imperio+Preview" },
  { "id": "Giardini", "nome": "Giardini", "categoria": "Decoração / Casa & Jardim", "descricao": "Estilo natural, floral, cores verdes e aconchego", "imagemUrl": "https://placehold.co/600x400/D4EDDA/155724?text=Giardini+Preview" },
  { "id": "Miloch", "nome": "Miloch", "categoria": "Moda casual / Lifestyle", "descricao": "Visual versátil, moderno e sem exageros – bem \"toda loja combina\"", "imagemUrl": "https://placehold.co/600x400/A0A0A0/FFFFFF?text=Miloch+Preview" },
  { "id": "Flex", "nome": "Flex", "categoria": "Pet shop / Produtos variados", "descricao": "Adaptável, divertido, layout leve com muitas imagens", "imagemUrl": "https://placehold.co/600x400/ADD8E6/0000FF?text=Flex+Preview" },
  { "id": "Doçura", "nome": "Doçura", "categoria": "Confeitaria / Food / Loja de doces", "descricao": "Visual fofo, paleta pastel, bem “comestível”", "imagemUrl": "https://placehold.co/600x400/FFD1DC/FF69B4?text=Docura+Preview" },
  { "id": "Aurora", "nome": "Aurora", "categoria": "Cosméticos / Skincare", "descricao": "Delicadeza, tons rosados, brilho suave, vibe \"autoamor\"", "imagemUrl": "https://placehold.co/600x400/FFC0CB/FF69B4?text=Aurora+Preview" },
  { "id": "Pixel", "nome": "Pixel", "categoria": "Games / Geek", "descricao": "Visual gamer, blocado, fontes tech, elementos em 8-bit", "imagemUrl": "https://placehold.co/600x400/404040/00FF00?text=Pixel+Preview" },
  { "id": "Maré", "nome": "Maré", "categoria": "Moda praia / Verão", "descricao": "Azul, areia, elementos tropicais, leveza e frescor", "imagemUrl": "https://placehold.co/600x400/87CEEB/F0E68C?text=Mare+Preview" },
  { "id": "Onda", "nome": "Onda", "categoria": "Esportes Aquáticos / Surf", "descricao": "Design fluido, cores do oceano, energia e movimento.", "imagemUrl": "https://placehold.co/600x400/007FFF/FFFFFF?text=Onda+Preview" },
  { "id": "Essência", "nome": "Essência", "categoria": "Perfumaria / Aromas", "descricao": "Elegância, minimalismo, tons neutros e foco no produto.", "imagemUrl": "https://placehold.co/600x400/F5F5DC/696969?text=Essencia+Preview" },
  { "id": "Harmonia", "nome": "Harmonia", "categoria": "Bem-estar / Yoga / Meditação", "descricao": "Cores suaves, elementos orgânicos, tranquilidade e equilíbrio.", "imagemUrl": "https://placehold.co/600x400/E6E6FA/8A2BE2?text=Harmonia+Preview" },
  { "id": "Inspire", "nome": "Inspire", "categoria": "Arte / Papelaria Criativa", "descricao": "Design artístico, cores vibrantes, fontes caligráficas, inspiração.", "imagemUrl": "https://placehold.co/600x400/FFD700/FF4500?text=Inspire+Preview" },
  { "id": "Zenith", "nome": "Zenith", "categoria": "Tecnologia / Inovação", "descricao": "Visual futurista, linhas limpas, cores escuras e detalhes luminosos.", "imagemUrl": "https://placehold.co/600x400/1A1A1A/00FF00?text=Zenith+Preview" },
  { "id": "Alvorada", "nome": "Alvorada", "categoria": "Cafés Especiais / Padarias", "descricao": "Tons quentes, rústico, aconchegante, aroma visual de café.", "imagemUrl": "https://placehold.co/600x400/D2B48C/8B4513?text=Alvorada+Preview" },
  { "id": "Conceito", "nome": "Conceito", "categoria": "Design / Arquitetura / Móveis", "descricao": "Minimalista, sofisticado, foco na forma e função, tipografia elegante.", "imagemUrl": "https://placehold.co/600x400/B0C4DE/4682B4?text=Conceito+Preview" },
  { "id": "Simples", "nome": "Simples", "categoria": "Produtos Básicos / Essenciais", "descricao": "Clean, direto ao ponto, sem distrações, funcionalidade acima de tudo.", "imagemUrl": "https://placehold.co/600x400/F5F5F5/333333?text=Simples+Preview" }
];

async function populateThemesTable() {
  console.log("Iniciando população da tabela 'public.temas'...");

  for (const theme of themesData) {
    const { data: existingTheme, error: fetchError } = await supabase
      .from('temas')
      .select('id')
      .eq('caminho_componente', theme.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error(`Erro ao verificar tema '${theme.nome}':`, fetchError.message);
      continue;
    }

    if (existingTheme) {
      console.log(`Tema '${theme.nome}' já existe (ID: ${existingTheme.id}). Pulando inserção.`);
    } else {
      const { error: insertError } = await supabase
        .from('temas')
        .insert({
          nome_tema: theme.nome,
          descricao: theme.descricao,
          preview_url: theme.imagemUrl,
          is_free: true,
          caminho_componente: theme.id,
          configuracoes_json: Padrao
        });

      if (insertError) {
        console.error(`Erro ao inserir tema '${theme.nome}':`, insertError.message);
      } else {
        console.log(`Tema '${theme.nome}' inserido com sucesso.`);
      }
    }
  }
  console.log("População da tabela 'public.temas' concluída.");
}

populateThemesTable();
