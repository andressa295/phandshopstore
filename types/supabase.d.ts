export type Database = {
  public: {
    Tables: {
      lojas: {
        Row: {
          id: string;
          nome_loja: string;
          slug: string;
          theme_id: string | null;
          configuracoes_tema_json: any;
          top_info_bar_text: string | null;
          top_info_bar_link: string | null;
          top_info_bar_active: boolean;
          track_order_link_active: boolean;
          support_link_active: boolean;
          lojaLogoUrl?: string | null;
        };
      };
      produtos: {
        Row: {
          id: string;
          nome: string;
          descricao: string | null;
          preco: number;
          estoque: number;
          loja_id: string;
          imagem_url: string | null;
        };
      };
      banners: {
        Row: {
          id: string;
          imagem_url: string;
          link_url: string | null;
          titulo: string | null;
          subtitulo: string | null;
          ordem: number;
          loja_id: string;
        };
      };
    };
  };
};
