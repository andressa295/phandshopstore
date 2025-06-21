// types/FormaEntrega.ts
export type FormaEntrega = {
    id: number;
    nome: string; // Ex: SEDEX, PAC, Retirada na Loja, Frete Fixo
    tipo: 'correios' | 'transportadora' | 'retirada' | 'frete_fixo' | 'frete_gratis';
    precoFixo?: number | null; // Se tipo 'frete_fixo'
    prazoDiasMin?: number | null; // Prazo de entrega mínimo em dias úteis
    prazoDiasMax?: number | null; // Prazo de entrega máximo em dias úteis
    regiaoAtiva?: string; // Ex: 'SP', 'BR', 'Sul' (simulação, complexidade real via CEP)
    pedidoMinimoFreteGratis?: number | null; // Para tipo 'frete_gratis' ou outros
    ativa: boolean;
};