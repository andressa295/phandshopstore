export type Produto = {
    id: number;
    nome: string;
    categoria: string;
    estoque: number;
    preco: number;
    precoPromocional?: number | null;
    ativo: boolean;
    imagensAdicionais?: string[];
    descricao?: string;
    sku?: string;
    peso?: number | null;
    altura?: number | null;
    largura?: number | null;
    comprimento?: number | null;
    metaTitulo?: string;
    metaDescricao?: string;
    palavrasChave?: string;
    urlAmigavel?: string;

    hasVariacoes?: boolean;
    variacoes?: {
        tamanhosRoupas?: string[];
        tamanhosCalcados?: number[]; 
        cores?: string[];
    };

    isPersonalizado?: boolean;
    personalizacaoTextoCampos?: { id: string; label: string; maxCaracteres?: number; }[];
    personalizacaoNumericaCampos?: { id: string; label: string; min?: number; max?: number; }[];

    // CORREÇÃO: Adicionando os novos campos
    freteGratis?: boolean;
    formasPagamento?: string[];
};
