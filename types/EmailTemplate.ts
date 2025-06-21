// types/EmailTemplate.ts
export type EmailTemplate = {
    id: string;
    titulo: string;
    assuntoPadrao: string;
    conteudoHtmlPadrao: string;
    variaveisDisponiveis?: string[];
    categoria: 'usuario' | 'vendas' | 'promocao';
    descricao: string;
    integracaoExterna?: boolean;
    instalado?: boolean;
};