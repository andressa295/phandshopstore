'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Preview from './Preview';
import { EditorProvider, useEditor } from './EditorContext';

export default function PersonalizarClientWrapper() {
    const [activeScreenKey, setActiveScreenKey] = useState('mainMenu');

    return (
        <EditorProvider>
            <InnerPersonalizarClientWrapper activeScreenKey={activeScreenKey} setActiveScreenKey={setActiveScreenKey} />
        </EditorProvider>
    );
}

function InnerPersonalizarClientWrapper({
    activeScreenKey,
    setActiveScreenKey,
}: {
    activeScreenKey: string;
    setActiveScreenKey: React.Dispatch<React.SetStateAction<string>>;
}) {
    const { previewMode } = useEditor();

    const sidebarWidth = '420px';

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                boxSizing: 'border-box' as 'border-box',
            }}
        >
            <aside
                style={{
                    width: sidebarWidth,
                    minWidth: sidebarWidth,
                    maxWidth: sidebarWidth,
                    backgroundColor: '#fff',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    boxSizing: 'border-box' as 'border-box',
                    borderRight: '1px solid #e0e0e0',
                    flexShrink: 0,
                    height: '100vh',
                }}
            >
                <Sidebar activeScreenKey={activeScreenKey} setActiveScreenKey={setActiveScreenKey} />
            </aside>

            <div
                style={{
                    flexGrow: 1,
                    flexShrink: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    backgroundColor: '#f0f2f5',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    boxSizing: 'border-box' as 'border-box',
                    padding: '20px',
                }}
            >
                <Preview previewMode={previewMode} />
            </div>
        </div>
    );
}
