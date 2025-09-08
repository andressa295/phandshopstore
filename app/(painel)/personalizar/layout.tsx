import React from 'react';

export default function PersonalizarLayout({ children }: { children: React.ReactNode }) {
  return (
    
    <div style={{ margin: 0, padding: 0, backgroundColor: '#fff' }}>
      <main className="main-layout">
            {children}
          </main>
    </div>
  );
}