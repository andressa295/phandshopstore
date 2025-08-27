'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation'; // <-- Importado o hook useParams
import Sidebar from './components/Sidebar';
import Editor from './components/editor/Editor';
import Preview from './components/Preview';
import { ThemeProvider } from './context/ThemeContext';
import PanelHeader from './components/Header'; // Renomeado para evitar confusão com Header da loja
import panelStyles from './context/theme-editor-panel.module.css';

// Removida a interface PersonalizarPageProps pois o componente não recebe mais props diretamente da rota
// O componente agora não tem props
const PersonalizarPage: React.FC = () => { 
  const params = useParams(); // <-- Usando o hook useParams para pegar os parâmetros da URL
  const lojaSlug = params.lojaSlug as string; // Extrai o lojaSlug de forma segura
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    // Passa a lojaSlug para o ThemeProvider
    <ThemeProvider lojaSlug={lojaSlug}> 
      <div className={panelStyles.editorContainer}>
        <PanelHeader /> {/* Usando o Header do painel */}
        <main className={panelStyles.mainContent}>
          <div className={panelStyles.panelArea}>
            {!activeSection ? (
              <Sidebar setActiveSection={setActiveSection} />
            ) : (
              <Editor
                activeSection={activeSection}
                goBack={() => setActiveSection(null)}
              />
            )}
          </div>

          <div className={panelStyles.previewArea}>
            <Preview />
          </div>
        </main>
      </div>
    </ThemeProvider>
  );
};

export default PersonalizarPage;
