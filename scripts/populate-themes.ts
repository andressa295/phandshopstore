import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
import { padraoConfig } from "../app/(sitetemas)/sitetemas/[lojaSlug]/themes/padrao/config";

dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // precisa ser service role key
);

const themesData = [
  {
    id: "padrao",
    nome: "Padrão",
    categoria: "Default",
    descricao: "Tema base aplicado em todas as lojas recém-criadas.",
    imagemUrl: "https://placehold.co/600x400/6A0DAD/FFFFFF?text=Tema+Padrao",
    is_free: true,
    config: padraoConfig,
  },
  {
    id: "prado",
    nome: "Prado",
    categoria: "Moda feminina elegante",
    descricao: "Estilo sofisticado, paleta refinada, visual “chique de boutique”.",
    imagemUrl: "https://placehold.co/600x400/E0E7FF/4338CA?text=Prado+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "neon",
    nome: "Neon",
    categoria: "Moda jovem / Streetwear",
    descricao: "Cores vibrantes, visual urbano, fontes ousadas.",
    imagemUrl: "https://placehold.co/600x400/FF00FF/000000?text=Neon+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "zeta",
    nome: "Zeta",
    categoria: "Eletrônicos / Tech store",
    descricao: "Estilo clean, tech vibes, minimalista e direto.",
    imagemUrl: "https://placehold.co/600x400/000000/00FFFF?text=Zeta+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "luna",
    nome: "Luna",
    categoria: "Joias / Acessórios",
    descricao: "Visual delicado, lunar, tons suaves, brilho discreto.",
    imagemUrl: "https://placehold.co/600x400/F0F0F0/666666?text=Luna+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "imperio",
    nome: "Império",
    categoria: "Moda masculina premium / Alta costura",
    descricao: "Estilo imponente, visual com seriedade e luxo.",
    imagemUrl: "https://placehold.co/600x400/333333/FFD700?text=Imperio+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "giardini",
    nome: "Giardini",
    categoria: "Decoração / Casa & Jardim",
    descricao: "Estilo natural, floral, cores verdes e aconchego.",
    imagemUrl: "https://placehold.co/600x400/D4EDDA/155724?text=Giardini+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "miloch",
    nome: "Miloch",
    categoria: "Moda casual / Lifestyle",
    descricao: "Versátil, moderno e sem exageros – bem \"toda loja combina\".",
    imagemUrl: "https://placehold.co/600x400/A0A0A0/FFFFFF?text=Miloch+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "flex",
    nome: "Flex",
    categoria: "Pet shop / Produtos variados",
    descricao: "Adaptável, divertido, layout leve com muitas imagens.",
    imagemUrl: "https://placehold.co/600x400/ADD8E6/0000FF?text=Flex+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "pop",
    nome: "Pop",
    categoria: "Moda jovem / Trendy",
    descricao: "Design divertido, chamativo, pensado para impacto visual rápido.",
    imagemUrl: "https://placehold.co/600x400/FF69B4/000000?text=Pop+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "docura",
    nome: "Doçura",
    categoria: "Confeitaria / Food / Loja de doces",
    descricao: "Visual fofo, paleta pastel, bem “comestível”.",
    imagemUrl: "https://placehold.co/600x400/FFD1DC/FF69B4?text=Docura+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "aurora",
    nome: "Aurora",
    categoria: "Cosméticos / Skincare",
    descricao: "Delicadeza, tons rosados, brilho suave, vibe \"autoamor\".",
    imagemUrl: "https://placehold.co/600x400/FFC0CB/FF69B4?text=Aurora+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "pixel",
    nome: "Pixel",
    categoria: "Games / Geek",
    descricao: "Visual gamer, blocado, fontes tech, elementos em 8-bit.",
    imagemUrl: "https://placehold.co/600x400/404040/00FF00?text=Pixel+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "mare",
    nome: "Maré",
    categoria: "Moda praia / Verão",
    descricao: "Azul, areia, elementos tropicais, leveza e frescor.",
    imagemUrl: "https://placehold.co/600x400/87CEEB/F0E68C?text=Mare+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "onda",
    nome: "Onda",
    categoria: "Esportes Aquáticos / Surf",
    descricao: "Design fluido, cores do oceano, energia e movimento.",
    imagemUrl: "https://placehold.co/600x400/007FFF/FFFFFF?text=Onda+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "essencia",
    nome: "Essência",
    categoria: "Perfumaria / Aromas",
    descricao: "Elegância, minimalismo, tons neutros e foco no produto.",
    imagemUrl: "https://placehold.co/600x400/F5F5DC/696969?text=Essencia+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "harmonia",
    nome: "Harmonia",
    categoria: "Bem-estar / Yoga / Meditação",
    descricao: "Cores suaves, elementos orgânicos, tranquilidade e equilíbrio.",
    imagemUrl: "https://placehold.co/600x400/E6E6FA/8A2BE2?text=Harmonia+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "inspire",
    nome: "Inspire",
    categoria: "Arte / Papelaria Criativa",
    descricao: "Design artístico, cores vibrantes, fontes caligráficas, inspiração.",
    imagemUrl: "https://placehold.co/600x400/FFD700/FF4500?text=Inspire+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "zenith",
    nome: "Zenith",
    categoria: "Tecnologia / Inovação",
    descricao: "Visual futurista, linhas limpas, cores escuras e detalhes luminosos.",
    imagemUrl: "https://placehold.co/600x400/1A1A1A/00FF00?text=Zenith+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "alvorada",
    nome: "Alvorada",
    categoria: "Cafés Especiais / Padarias",
    descricao: "Tons quentes, rústico, aconchegante, aroma visual de café.",
    imagemUrl: "https://placehold.co/600x400/D2B48C/8B4513?text=Alvorada+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "conceito",
    nome: "Conceito",
    categoria: "Design / Arquitetura / Móveis",
    descricao: "Minimalista, sofisticado, foco na forma e função, tipografia elegante.",
    imagemUrl: "https://placehold.co/600x400/B0C4DE/4682B4?text=Conceito+Preview",
    is_free: true,
    config: {},
  },
  {
    id: "simples",
    nome: "Simples",
    categoria: "Produtos Básicos / Essenciais",
    descricao: "Clean, direto ao ponto, sem distrações, funcionalidade acima de tudo.",
    imagemUrl: "https://placehold.co/600x400/F5F5F5/333333?text=Simples+Preview",
    is_free: true,
    config: {},
  },
];

async function populateTemas() {
  console.log("🚀 Populando tabela 'temas'...");

  for (const theme of themesData) {
    const { error } = await supabase.from("temas").upsert(
      {
        nome_tema: theme.nome,
        descricao: theme.descricao,
        preview_url: theme.imagemUrl,
        is_free: theme.is_free,
        caminho_componente: theme.id,
        configuracoes_json: theme.config ?? {},
      },
      { onConflict: "caminho_componente" }
    );

    if (error) console.error(`❌ Erro em ${theme.nome}:`, error.message);
    else console.log(`✅ Tema '${theme.nome}' atualizado/inserido com sucesso.`);
  }

  console.log("🎉 População concluída.");
}

populateTemas();
