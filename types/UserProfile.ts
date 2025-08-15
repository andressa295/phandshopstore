// types/UserProfile.ts
export interface UserProfile {
  id: string;
  email: string | null;
  nome_completo: string | null;
  lojaId: string | null;
  lojaNome: string | null;
  lojaSlug: string | null;
  plano: string | null;
  recorrencia: 'mensal' | 'anual' | null;
  preco_mensal?: number | null;
  preco_anual?: number | null;
}