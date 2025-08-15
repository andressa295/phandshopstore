export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      lojas: {
        Row: {
          created_at: string;
          id: string;
          nome_loja: string | null;
          slug: string;
          stripe_customer_id: string | null;
          user_id: string | null;
          meta_mensal: number | null;
          custos_fixos: number | null;
          custos_variaveis: number | null;
        };
        Insert: {
          created_at?: string;
          id?: string;
          nome_loja?: string | null;
          slug: string;
          stripe_customer_id?: string | null;
          user_id?: string | null;
          meta_mensal?: number | null;
          custos_fixos?: number | null;
          custos_variaveis?: number | null;
        };
        Update: {
          created_at?: string;
          id?: string;
          nome_loja?: string | null;
          slug?: string;
          stripe_customer_id?: string | null;
          user_id?: string | null;
          meta_mensal?: number | null;
          custos_fixos?: number | null;
          custos_variaveis?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "lojas_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };

      produtos: {
        Row: {
          id: string;
          loja_id: string;
          nome: string;
          estoque: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          loja_id: string;
          nome: string;
          estoque?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          loja_id?: string;
          nome?: string;
          estoque?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "produtos_loja_id_fkey";
            columns: ["loja_id"];
            referencedRelation: "lojas";
            referencedColumns: ["id"];
          }
        ];
      };

      vendas: {
        Row: {
          id: string;
          loja_id: string;
          valor: number;
          created_at: string;
          status: string;
        };
        Insert: {
          id?: string;
          loja_id: string;
          valor: number;
          created_at?: string;
          status?: string;
        };
        Update: {
          id?: string;
          loja_id?: string;
          valor?: number;
          created_at?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "vendas_loja_id_fkey";
            columns: ["loja_id"];
            referencedRelation: "lojas";
            referencedColumns: ["id"];
          }
        ];
      };

      pedidos: {
        Row: {
          id: string;
          loja_id: string;
          status: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          loja_id: string;
          status?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          loja_id?: string;
          status?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "pedidos_loja_id_fkey";
            columns: ["loja_id"];
            referencedRelation: "lojas";
            referencedColumns: ["id"];
          }
        ];
      };

      historico_acessos: {
        Row: {
          id: string;
          loja_id: string | null;
          dispositivo: string | null;
          usuario_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          loja_id?: string | null;
          dispositivo?: string | null;
          usuario_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          loja_id?: string | null;
          dispositivo?: string | null;
          usuario_id?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "historico_acessos_loja_id_fkey";
            columns: ["loja_id"];
            referencedRelation: "lojas";
            referencedColumns: ["id"];
          }
        ];
      };

      receita_historico: {
        Row: {
          id: string;
          loja_id: string | null;
          created_at: string;
          valor_venda: number | null;
          status: string | null;
        };
        Insert: {
          id?: string;
          loja_id?: string | null;
          created_at?: string;
          valor_venda?: number | null;
          status?: string | null;
        };
        Update: {
          id?: string;
          loja_id?: string | null;
          created_at?: string;
          valor_venda?: number | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "receita_historico_loja_id_fkey";
            columns: ["loja_id"];
            referencedRelation: "lojas";
            referencedColumns: ["id"];
          }
        ];
      };
    };

    Views: { [_ in never]: never };
    Functions: { [_ in never]: never };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
}
