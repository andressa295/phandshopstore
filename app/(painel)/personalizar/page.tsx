// app/(painel)/personalizar/page.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/editor/Editor';
import Preview from './components/Preview';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header'; 
import panelStyles from './context/theme-editor-panel.module.css';

const PersonalizarPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <ThemeProvider>
      <div className={panelStyles.editorContainer}>
        <Header /> 
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