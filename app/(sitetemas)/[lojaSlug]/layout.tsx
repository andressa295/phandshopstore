
import React from 'react';

export default function LojaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div lang="pt-BR">
      <div>
        {children}
      </div>
    </div>
  );
}
