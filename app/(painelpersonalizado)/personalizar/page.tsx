// app\(editorpainel)\personalizar\page.tsx
import React from 'react';

// Este page.tsx é um Server Component por padrão.
// Ele apenas renderiza um título, e o layout acima (PersonalizarLayout)
// se encarregará de adicionar a funcionalidade de cliente.

export default function PersonalizarPage() {
  return (
    <div style={{ flex: 1, padding: '2rem' }}>
      <h1>TESTE Conteúdo Server-Side Opcional da Página</h1>
      <p>Este texto é renderizado no servidor. A visualização da loja e a sidebar são do cliente.</p>
    </div>
  );
}