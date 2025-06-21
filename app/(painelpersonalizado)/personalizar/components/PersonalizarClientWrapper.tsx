'use client';

import React from 'react';
import { useEditor } from './EditorContext'; 
import Preview from './Preview'; 
import Sidebar from './Sidebar'; 


const colors = {
    primary: '#6b21a8',
    secondary: '#a21caf',
    accent: '#7C3AED',
    text: '#333333',
    lightText: '#666666',
    border: '#e0e0e0',
    background: '#f8f9fa',
    white: '#ffffff',
    success: '#28a745',
    danger: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8',
};

const typography = {
    fontFamily: 'Poppins, sans-serif',
    headingSize: '1.8rem',
    subHeadingSize: '1.2rem',
    bodySize: '0.95rem',
    smallSize: '0.8rem',
};


export default function PersonalizarClientWrapper() {
    // CORREÇÃO: Pegando previewMode diretamente do useEditor (contexto)
    const { previewMode } = useEditor();

    // Larguras (podem ser globais ou definidas no layout.tsx)
    const sidebarWidth = '280px'; // A largura da sidebar de edição aqui é diferente da do layout
    // const previewDesktopMaxWidth = '1200px'; // Não usado diretamente aqui
    // const previewMobileMaxWidth = '375px'; // Não usado diretamente aqui

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                height: '100%', // Ocupa a altura total disponível no main do layout.tsx
                boxSizing: 'border-box' as 'border-box',
            }}
        >
            {/* A sidebar de edição do personalizador */}
            <aside
                style={{
                    width: sidebarWidth,
                    minWidth: sidebarWidth,
                    maxWidth: sidebarWidth,
                    backgroundColor: colors.white, // Usando colors do topo
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    boxSizing: 'border-box' as 'border-box',
                    borderRight: '1px solid #e0e0e0',
                    flexShrink: 0,
                    height: '100%', // Garante altura total para permitir scroll interno
                }}
            >
                {/* O Sidebar aqui já acessa o contexto */}
                <Sidebar /> 
            </aside>

            {/* Área do Preview */}
            <div
                style={{
                    flexGrow: 1,
                    flexShrink: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    backgroundColor: '#f0f2f5', // Um fundo claro para a área de preview
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    boxSizing: 'border-box' as 'border-box',
                    padding: '20px',
                }}
            >
                {/* Preview agora recebe o previewMode do contexto */}
                <Preview previewMode={previewMode} />
            </div>
        </div>
    );
}