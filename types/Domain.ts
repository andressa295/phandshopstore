// types/Domain.ts (Sem alterações)
export type Domain = {
    id: number;
    nome: string; // Ex: www.minhaloja.com.br
    principal: boolean; // Se é o domínio principal
    statusDominio: 'ativo' | 'inativo' | 'pendente';
    statusSsl: 'ativado' | 'pendente' | 'erro';
};