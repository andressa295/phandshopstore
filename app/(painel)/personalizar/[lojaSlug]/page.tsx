'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '../components/Sidebar';
import Editor from '../components/editor/Editor';
import Preview from '../components/Preview';
import { ThemeProvider, useTheme } from '../context/ThemeContext';
import PanelHeader from '../components/Header';
import panelStyles from '../context/theme-editor-panel.module.css';
const PageContent = () => {
    const { isLoading, error } = useTheme();
    const [activeSection, setActiveSectionState] = React.useState<string | null>(null);

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
                    <Sidebar setActiveSection={setActiveSectionState} activeSection={activeSection} />
                ) : (
                    <Editor
                        activeSection={activeSection}
                        goBack={() => setActiveSectionState(null)}
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

    const fixStyles = `
        /* Remove o espaço em branco indesejado */
        .main-layout {
            font-size: 0 !important; /* <--- MANTÉM ESTE AQUI PARA O &NBSP; */
            line-height: 0;
            height: 100vh;
            width: 100%;
            display: flex;
            margin: 0;
            padding: 0;
        }

        /* Reseta a fonte para os containers do seu painel */
        .theme-editor-panel_panelArea__1ULmn,
        .theme-editor-panel_editorContainer__NF_7Z {
            font-size: 16px !important; /* <--- RESET AGORA */
            line-height: 1.5 !important;
            font-family: 'Poppins', sans-serif !important;
        }

        /* Estilos de layout que você já tinha */
        .theme-editor-panel_editorContainer__NF_7Z {
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .theme-editor-panel_mainContent__tr7iz {
            flex: 1;
            display: flex;
            overflow: hidden;
            gap: 16px;
            padding: 16px;
        }
        .theme-editor-panel_panelArea__1ULmn {
            flex-shrink: 0;
            width: 320px;
            background-color: white;
            overflow-y: auto;
        }
        .theme-editor-panel_previewArea__cn0nt {
            flex: 1;
            overflow: hidden;
            background-color: #f6f7f9;
        }

        /* Garante que o iframe não tenha bordas */
        iframe {
            border: none;
            box-shadow: none;
        }
    `;

    if (!lojaSlug) {
        return <div className={panelStyles.errorState}>Erro: O slug da loja não foi fornecido.</div>;
    }

    return (
        <ThemeProvider lojaSlug={lojaSlug} isIframeHost={true}>
            <style jsx global>{fixStyles}</style>
            <div className={panelStyles.editorContainer}>
                <main className="main-layout">
                    <PageContent />
                </main>
            </div>
        </ThemeProvider>
    );
};

export default PersonalizarPage;