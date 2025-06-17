'use client';

import React from 'react';
import { EditorProvider } from './EditorContext'; // Assegure que o caminho está correto
import Sidebar from './Sidebar'; // Sidebar é um default export
import Preview from './Preview'; // IMPORTAÇÃO CORRETA: Assumindo que Preview.tsx está na mesma pasta (components)

// PersonalizarClientWrapper agora aceita a prop previewMode
interface PersonalizarClientWrapperProps {
    previewMode: 'desktop' | 'mobile';
}

export default function PersonalizarClientWrapper({ previewMode }: PersonalizarClientWrapperProps) {
    const [activeScreenKey, setActiveScreenKey] = React.useState('mainMenu');

    return (
        <EditorProvider>
            {/* O container principal que organiza a Sidebar e o Preview lado a lado */}
            {/* Altura ajustada para ocupar o espaço restante após cabeçalho e barra de botões */}
            <div style={{ display: 'flex', height: 'calc(100vh - 64px - 50px)', width: '100%' }}> 
                {/* Componente Sidebar */}
                <Sidebar activeScreenKey={activeScreenKey} setActiveScreenKey={setActiveScreenKey} />
                
                {/* Componente Preview (área de visualização do tema) */}
                <div style={{ flexGrow: 1, overflowY: 'auto' }}>
                    {/* Passando o previewMode para o Preview */}
                    <Preview previewMode={previewMode} />
                </div>
            </div>
        </EditorProvider>
    );
}