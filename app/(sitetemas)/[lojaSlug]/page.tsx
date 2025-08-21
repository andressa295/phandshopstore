// app/(sitetemas)/[lojaSlug]/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic'; // Importa next/dynamic para carregamento dinâmico
import ProductListingClient from './components/ProductListingClient';

// Interfaces (mantidas do seu código anterior)
interface ProductListingPageProps {
    params: { lojaSlug: string };
}

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
    caminho_componente: string; // Ex: "TemaPadrao", "Prado"
}

// NOVA INTERFACE: Define as props esperadas pelo componente de tema dinâmico
interface DynamicThemeComponentProps {
    children: React.ReactNode;
    temaConfig: any; // Use um tipo mais específico se você tiver a interface completa para temaConfig
}

export default async function ProductListingPage({ params }: ProductListingPageProps) {
    const  lojaSlug  = params;
    const supabase = createServerComponentClient({ cookies: () => cookies() });

    // --- Buscar loja ---
    const { data: loja, error: lojaError } = await supabase
        .from('lojas')
        .select(`
            id,
            nome_loja,
            slug,
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

    if (lojaError || !loja) {
        console.error('Erro ao buscar loja ou loja não encontrada:', lojaError);
        redirect('/');
    }

    // --- Configurações do tema (do JSONB) ---
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

    // --- Buscar dados do Tema para obter o caminho do componente ---
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
            // Fallback para tema padrão se o tema configurado não for encontrado
            const { data: defaultTema, error: defaultTemaError } = await supabase
                .from('temas')
                .select(`id, nome_tema, caminho_componente`)
                .eq('nome_tema', 'Tema Padrão') // Assumindo que você tem um tema com este nome
                .single();
            
            if (defaultTemaError || !defaultTema) {
                console.error('Erro ao buscar tema padrão:', defaultTemaError);
                redirect('/'); // Se nem o tema padrão for encontrado, redireciona
            }
            tema = defaultTema;
        } else {
            tema = temaData;
        }
    } else {
        // Se a loja não tem um theme_id configurado, usa o tema padrão
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

    // --- Carregamento Dinâmico do Componente do Tema ---
    // O caminho deve ser relativo ao diretório 'components/temas'
    const ThemeWrapper = dynamic<DynamicThemeComponentProps>(() => 
        import(`./components/temas/${tema?.caminho_componente || 'TemaPadrao'}/${tema?.caminho_componente || 'TemaPadrao'}`)
        .catch(err => {
            console.error(`Falha ao carregar componente do tema ${tema?.caminho_componente || 'TemaPadrao'}:`, err);
            // Retorna um componente fallback caso o tema não possa ser carregado
            return ({ children }: { children: React.ReactNode }) => (
                <div className="theme-fallback-wrapper">
                    <p>O tema selecionado não pôde ser carregado. Exibindo tema padrão.</p>
                    {children}
                </div>
            );
        }),
        { ssr: true } // Renderiza no servidor
    );

    // --- Buscar produtos e banners em paralelo ---
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
