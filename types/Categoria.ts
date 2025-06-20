// types/Categoria.ts (VERIFIQUE ESTE ARQUIVO!)
export type Categoria = {
    id: number;
    nome: string;
    descricao?: string;
    subcategorias?: Categoria[];
    produtosAssociadosIds?: number[];
};