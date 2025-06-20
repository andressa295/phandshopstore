// PersonalizarClientWrapper.tsx
'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Preview from './Preview';
import { EditorProvider } from './EditorContext';

interface PersonalizarClientWrapperProps {
    previewMode: 'desktop' | 'mobile';
}

export default function PersonalizarClientWrapper({
    previewMode,
}: PersonalizarClientWrapperProps) {
    const [activeScreenKey, setActiveScreenKey] = useState('mainMenu');

    const sidebarWidth = '420px';
    const previewDesktopMaxWidth = '1200px';
    const previewMobileMaxWidth = '375px';

    return (
        <EditorProvider>
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
                        height: '100vh', // Garante altura total para permitir scroll interno
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
        </EditorProvider>
    );
}
