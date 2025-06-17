'use client';
import React from 'react';

// Este será o painel da direita, que no futuro terá os controles
export default function EditorPage() {
  return (
    <aside style={{ width: '320px', background: '#fafafa', borderLeft: '1px solid #ddd', padding: '1.5rem' }}>
      <h3>Opções de Edição</h3>
      <p>Selecione um item no menu para ver as opções.</p>
    </aside>
  );
}