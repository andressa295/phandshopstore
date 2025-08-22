import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic'; 
import ProductListingClient from './components/ProductListingClient';

interface ProdutoData {
  id: string;
  nome: string;
  descricao: string | null;
  preco: number;
  estoque: number;
  imagem_url: string | null;
}

interface InfoBarItem {
  id: string;
  icone: string;
  titulo: string;
  descricao: string;
}

interface TemaData {
  id: string;
  nome_tema: string;
  caminho_componente: string; 
}

interface DynamicThemeComponentProps {
  children: React.ReactNode;
  temaConfig: any; 
}

export default async function ProductListingPage({
  params,
}: {
  params: { lojaSlug: string };
}) {
  const { lojaSlug } = params;
  const supabase = createServerComponentClient({ cookies: () => cookies() });

  console.log("--- page.tsx: Iniciando Depuração de Login/Loja ---");
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("Erro ao obter usuário autenticado (page.tsx):", userError);
  } else if (user) {
    console.log("Usuário autenticado (auth.uid()):", user.id);
    console.log("Email do usuário:", user.email);
  } else {
    console.log("Nenhum usuário autenticado encontrado (page.tsx).");
  }
  console.log("Loja Slug na URL:", lojaSlug);

  const { data: loja, error: lojaError } = await supabase
    .from('lojas')
    .select(`
      id,
      nome_loja,
      slug,
      owner_id,
      theme_id,
      configuracoes_tema_json,
      top_info_bar_text,
      top_info_bar_link,
      top_info_bar_active,
      track_order_link_active,
      support_link_active
    `)
    .eq('slug', lojaSlug)
    .single();

  if (lojaError) {
    console.error('Erro ao buscar loja por slug (page.tsx):', lojaError);
    redirect('/'); 
  }
  
  if (!loja) {
    console.error('Loja não encontrada para o slug:', lojaSlug);
    redirect('/');
  }

  console.log("Dados da loja buscados (page.tsx):", JSON.stringify(loja, null, 2));
  if (user && loja.owner_id && user.id !== loja.owner_id) {
    console.warn(`ATENÇÃO: Usuário autenticado (UID: ${user.id}) NÃO É O DONO da loja (Owner ID: ${loja.owner_id}). Isso pode causar problemas de RLS.`);
  }
  console.log("--- Fim da Depuração de Login/Loja ---");

  let configuracoesTema: any = {};
  try {
    configuracoesTema = loja.configuracoes_tema_json
      ? typeof loja.configuracoes_tema_json === 'string'
        ? JSON.parse(loja.configuracoes_tema_json)
        : loja.configuracoes_tema_json
      : {};
  } catch (err) {
    console.error('Erro ao parsear configuracoes_tema_json:', err);
  }

  let tema: TemaData | null = null;
  if (loja.theme_id) {
    const { data: temaData, error: temaError } = await supabase
      .from('temas')
      .select(`
        id,
        nome_tema,
        caminho_componente
      `)
      .eq('id', loja.theme_id)
      .single();

    if (temaError || !temaData) {
      console.error('Erro ao buscar tema da loja ou tema não encontrado:', temaError);
      const { data: defaultTema, error: defaultTemaError } = await supabase
        .from('temas')
        .select(`id, nome_tema, caminho_componente`)
        .eq('nome_tema', 'Tema Padrão')
        .single();
      
      if (defaultTemaError || !defaultTema) {
        console.error('Erro ao buscar tema padrão:', defaultTemaError);
        redirect('/');
      }
      tema = defaultTema;
    } else {
      tema = temaData;
    }
  } else {
    const { data: defaultTema, error: defaultTemaError } = await supabase
      .from('temas')
      .select(`id, nome_tema, caminho_componente`)
      .eq('nome_tema', 'Tema Padrão')
      .single();

    if (defaultTemaError || !defaultTema) {
      console.error('Erro ao buscar tema padrão:', defaultTemaError);
      redirect('/');
    }
    tema = defaultTema;
  }

  const ThemeWrapper = dynamic<DynamicThemeComponentProps>(() => 
    import(`./components/temas/${tema?.caminho_componente || 'TemaPadrao'}/${tema?.caminho_componente || 'TemaPadrao'}`)
      .catch(err => {
        console.error(`Falha ao carregar componente do tema ${tema?.caminho_componente || 'TemaPadrao'}:`, err);
        return ({ children }: { children: React.ReactNode }) => (
          <div className="theme-fallback-wrapper">
            <p>O tema selecionado não pôde ser carregado. Exibindo tema padrão.</p>
            {children}
          </div>
        );
      }),
    { ssr: true }
  );

  const [produtosResult, bannersResult] = await Promise.all([
    supabase
      .from('produtos')
      .select(`id, nome, descricao, preco, estoque, imagem_url`),
    supabase
      .from('banners')
      .select(`id, imagem_url, link_url, titulo, subtitulo, ordem`)
      .eq('loja_id', loja.id)
      .eq('is_ativo', true)
      .order('ordem', { ascending: true }),
  ]);

  const produtos: ProdutoData[] = (produtosResult.data || []) as ProdutoData[];
  if (produtosResult.error) console.error('Erro ao buscar produtos:', produtosResult.error);

  const banners = bannersResult.data || [];
  if (bannersResult.error) console.error('Erro ao buscar banners:', bannersResult.error);

  const infoBarItems: InfoBarItem[] = configuracoesTema.info_bar_items || [];

  return (
    <ThemeWrapper temaConfig={configuracoesTema}>
      <ProductListingClient
        loja={loja}
        produtos={produtos}
        temaConfig={configuracoesTema}
        banners={banners}
        infoBarItems={infoBarItems}
      />
    </ThemeWrapper>
  );
}
