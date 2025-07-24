'use client';

import React from 'react';
import ThemeGallery from './ThemeGallery';

export default function Page() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Escolha seu tema</h1>
      <ThemeGallery />
    </main>
  );
}
