'use client';

import React from 'react';
import { useSupabase } from '../UserContext';

export default function PlanoUsuario() {
  const { profile, loading } = useSupabase();

  if (loading) return <p>Carregando plano do usuário...</p>;
  if (!profile) return <p>Perfil não encontrado.</p>;

  // Lógica para determinar o preço correto com base no perfil e recorrência
  let preco = 0;
  if (profile.plano === 'plano_gratis') {
      preco = 0;
  } else if (profile.recorrencia === 'anual') {
      preco = profile.preco_anual || 0;
  } else {
      preco = profile.preco_mensal || 0;
  }

  return (
    <section className="p-4 border rounded-md bg-white shadow-sm max-w-sm">
      <h2 className="text-xl font-semibold mb-2">Plano atual</h2>
      <p><strong>Nome:</strong> {profile.plano?.replace('plano_', '').toUpperCase()}</p>
      <p><strong>Recorrência:</strong> {profile.recorrencia?.toUpperCase() || 'Não especificado'}</p>
      <p><strong>Preço:</strong> R$ {preco.toFixed(2)}</p>
    </section>
  );
}