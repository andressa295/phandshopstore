// app/(sitetemas)/layout.tsx (ou o caminho exato do seu LojaLayout)
import React from 'react';

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Adiciona lang="pt-BR" no elemento div conforme seu exemplo
    <div lang="pt-BR">
      <div>
        {children}
      </div>
    </div>
  );
}
