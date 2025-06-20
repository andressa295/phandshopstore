// types/PaginaInformativa.ts (VERIFIQUE ESTE ARQUIVO!)
export type PaginaInformativa = {
    id: number;
    titulo: string; // Título da página
    urlAmigavel: string;
    conteudoHtml: string;
    ativa: boolean;
    metaTitulo?: string;
    metaDescricao?: string;
};