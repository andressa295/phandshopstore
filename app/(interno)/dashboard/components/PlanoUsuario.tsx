// app/(interno)/dashboard/components/PlanoUsuario.tsx
'use client';

import React from 'react';
import { useUser } from '../UserContext';

export default function PlanoUsuario() {
  const { profile, loading } = useUser();

  if (loading) return <p>Carregando plano do usuário...</p>;
  if (!profile) return <p>Perfil não encontrado.</p>;

  // Lógica para determinar o preço correto
  let preco = 0;
  // A sua query precisa buscar o preco_mensal e preco_anual
  // Vou supor que você já a corrigiu
  if (profile.plano === 'plano_basico') {
      preco = profile.recorrencia === 'anual' ? 699.00 : 69.90;
  } else if (profile.plano === 'plano_essencial') {
      preco = profile.recorrencia === 'anual' ? 999.00 : 99.90;
  }
  // Adicionar outros planos aqui...

  return (
    <section className="p-4 border rounded-md bg-white shadow-sm max-w-sm">
      <h2 className="text-xl font-semibold mb-2">Plano atual</h2>
      <p><strong>Nome:</strong> {profile.plano?.replace('plano_', '').toUpperCase()}</p>
      <p><strong>Recorrência:</strong> {profile.recorrencia?.toUpperCase() || 'Não especificado'}</p>
      <p><strong>Preço:</strong> R$ {preco.toFixed(2)}</p>
    </section>
  );
}