'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Editor from '../components/editor/Editor';
import Preview from '../components/Preview';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import PanelHeader from '../components/Header';
import panelStyles from '../context/theme-editor-panel.module.css';

// Componente para renderizar a interface do editor (dependente do contexto)
const EditorUI: React.FC = () => {
    const [activeSection, setActiveSection] = React.useState<string | null>(null);
    const { isLoading, error } = useTheme();

    if (isLoading) {
        return <div className={panelStyles.loadingState}>Carregando dados da loja...</div>;
    }

    if (error) {
        return <div className={panelStyles.errorState}>Ocorreu um erro: {error}</div>;
    }

    return (
        <>
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
        </>
    );
};

const PersonalizarPage: React.FC = () => {
    const params = useParams();
    const lojaSlug = params.lojaSlug as string;

    if (!lojaSlug) {
        return <div className={panelStyles.errorState}>Erro: O slug da loja não foi fornecido.</div>;
    }

    return (
        // CORREÇÃO: O ThemeProvider agora envolve todo o conteúdo do painel
        <ThemeProvider lojaSlug={lojaSlug} isIframeHost={true}>
            <div className={panelStyles.editorContainer}>
                <PanelHeader />
                <main className={panelStyles.mainContent}>
                    <EditorUI />
                </main>
            </div>
        </ThemeProvider>
    );
};

export default PersonalizarPage;