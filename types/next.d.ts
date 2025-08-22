// types/next.d.ts
export type LojaData = {
    id: string;
    nome_loja: string;
    slug: string;
    theme_id: string | null;
    configuracoes_tema_json: {
        cores?: {
            primaria?: string;
            secundaria?: string;
            texto?: string;
            fundo?: string;
        };
        fontes?: {
            principal?: string;
            titulos?: string;
        };
        botoes?: {
            arredondamento?: string;
            sombra?: boolean;
        };
        info_bar_items?: InfoBarItem[];
        testimonials_data?: any[];
        mini_banners_data?: any[];
        newsletter_data?: { title?: string; subtitle?: string };
        text_with_image_data?: {
            title?: string;
            subtitle?: string;
            contentHtml: string;
            images: any[];
            imagePosition?: 'left' | 'right' | 'top' | 'bottom';
            callToActionText?: string;
            callToActionLink?: string;
        };
    };
    top_info_bar_text: string | null;
    top_info_bar_link: string | null;
    top_info_bar_active: boolean;
    track_order_link_active: boolean;
    support_link_active: boolean;
    lojaLogoUrl?: string | null;
};

export type ProdutoData = {
    id: string;
    nome: string;
    descricao: string | null;
    preco: number;
    estoque: number;
    imagem_url: string | null;
};

export type BannerData = {
    id: string;
    imagem_url: string;
    link_url: string | null;
    titulo: string | null;
    subtitulo: string | null;
    ordem: number;
};

export type InfoBarItem = {
    id: string;
    icone: string;
    titulo: string;
    descricao: string;
};

export type Database = {
    public: {
        Tables: {
            lojas: {
                Row: LojaData;
            };
            produtos: {
                Row: ProdutoData & { loja_id: string };
            };
            banners: {
                Row: BannerData & { loja_id: string };
            };
        };
    };
};
