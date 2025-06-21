export type FormaEntrega = {
    id: number;
    nome: string;
    tipo?: 'correios' | 'transportadora' | 'retirada' | 'frete_fixo' | 'frete_gratis' | ''; // Permite string vazia e undefined
    precoFixo?: number | null;
    prazoDiasMin?: number | null;
    prazoDiasMax?: number | null;
    regiaoAtiva?: string;
    pedidoMinimoFreteGratis?: number | null;
    ativa: boolean;
};