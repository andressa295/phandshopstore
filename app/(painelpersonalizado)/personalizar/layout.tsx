'use client';

import React, { useState, ReactNode } from 'react';
import Link from 'next/link';
import {
    FaDesktop, FaMobileAlt, FaArrowRight
} from 'react-icons/fa';

import PersonalizarClientWrapper from './components/PersonalizarClientWrapper';

// Componente Principal do Layout
export default function PersonalizarLayout({ children }: { children: React.ReactNode }) {
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

    const HEADER_HEIGHT = '64px';
    const BUTTON_BAR_HEIGHT = '60px'; // Aumentei um pouco a altura para melhor visualização dos novos botões

    // CALCULANDO A ALTURA TOTAL OCUPADA PELOS CABEÇALHOS FIXOS
    const totalFixedHeaderHeight = `calc(${HEADER_HEIGHT} + ${BUTTON_BAR_HEIGHT})`;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            fontFamily: 'Poppins, sans-serif',
            backgroundColor: '#f8f9fa', // Adicionado um background suave para o layout
        }}>
            {/* Top Bar (Cabeçalho Superior do Personalizador) - FIXO */}
            <header style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0 2rem',
                backgroundColor: '#6b21a8', // Cor primária (roxo)
                color: '#fff',
                height: HEADER_HEIGHT,
                flexShrink: 0,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)', // Sombra mais proeminente
                zIndex: 1100,
                fontFamily: "'Poppins', sans-serif",
                overflow: 'visible'
            }}>
                <Link href="/painel" style={{
                    textDecoration: 'none',
                    color: '#fff',
                    fontWeight: '600', // Levemente mais bold
                    fontSize: '1.1rem', // Um pouco maior
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'opacity 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                    <FaArrowRight size={14} style={{ transform: 'rotate(180deg)' }} /> Voltar para o Painel
                </Link>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}> {/* Aumentei o gap */}
                    <button
                        onClick={() => alert('Abrir ajuda...')}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#fff',
                            fontSize: '1rem',
                            cursor: 'pointer',
                            opacity: 0.8,
                            transition: 'opacity 0.2s ease-in-out'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                        onMouseLeave={(e) => e.currentTarget.style.opacity = '0.8'}
                    >
                        Ajuda
                    </button>
                    <a
                        href="https://sua-loja-real.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            background: '#8a2be2', // Um tom de roxo mais claro
                            border: 'none',
                            color: '#fff',
                            padding: '0.6rem 1.2rem', // Padding ajustado
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            fontSize: '0.95rem',
                            fontWeight: 'bold',
                            borderRadius: '25px', // Botão mais arredondado
                            cursor: 'pointer',
                            transition: 'background-color 0.2s ease-in-out, transform 0.2s ease-in-out',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#9932cc'; // Roxo mais escuro no hover
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#8a2be2';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Ver sua loja <FaArrowRight size={14} style={{ transform: 'rotate(-45deg)' }} />
                    </a>
                </div>
            </header>

            {/* Nova barra para os botões de visualização (desktop/mobile) - FIXA E CENTRALIZADA */}
            <div style={{
                position: 'fixed',
                top: HEADER_HEIGHT,
                left: 0,
                right: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff', // Fundo branco
                height: BUTTON_BAR_HEIGHT,
                zIndex: 1099,
                boxShadow: '0 2px 6px rgba(0,0,0,0.08)', // Sombra mais sutil
                gap: '0', // Remover gap padrão, o gap será interno aos botões
                borderBottom: '1px solid #e0e0e0', // Borda sutil na parte inferior
            }}>
                <div style={{
                    display: 'flex',
                    backgroundColor: '#e9ecef', // Fundo cinza claro para o container dos botões
                    borderRadius: '8px', // Bordas arredondadas para o container
                    padding: '4px', // Padding interno
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.1)', // Sombra interna para dar profundidade
                }}>
                    <button
                        onClick={() => setPreviewMode('desktop')}
                        style={{
                            background: previewMode === 'desktop' ? '#6b21a8' : 'transparent', // Cor de fundo ativa
                            border: 'none',
                            color: previewMode === 'desktop' ? '#fff' : '#6c757d', // Cor do texto ativa/inativa
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '6px', // Bordas arredondadas para os botões individuais
                            transition: 'all 0.3s ease-in-out', // Transição suave para todas as propriedades
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: previewMode === 'desktop' ? 'bold' : 'normal',
                            boxShadow: previewMode === 'desktop' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
                            outline: 'none', // Remove o outline padrão ao focar
                        }}
                        onMouseEnter={(e) => {
                            if (previewMode !== 'desktop') e.currentTarget.style.backgroundColor = '#dee2e6';
                        }}
                        onMouseLeave={(e) => {
                            if (previewMode !== 'desktop') e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <FaDesktop size={18} /> Desktop
                    </button>
                    <button
                        onClick={() => setPreviewMode('mobile')}
                        style={{
                            background: previewMode === 'mobile' ? '#6b21a8' : 'transparent',
                            border: 'none',
                            color: previewMode === 'mobile' ? '#fff' : '#6c757d',
                            fontSize: '0.95rem',
                            cursor: 'pointer',
                            padding: '0.6rem 1.2rem',
                            borderRadius: '6px',
                            transition: 'all 0.3s ease-in-out',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontWeight: previewMode === 'mobile' ? 'bold' : 'normal',
                            boxShadow: previewMode === 'mobile' ? '0 2px 5px rgba(0,0,0,0.2)' : 'none',
                            outline: 'none',
                        }}
                        onMouseEnter={(e) => {
                            if (previewMode !== 'mobile') e.currentTarget.style.backgroundColor = '#dee2e6';
                        }}
                        onMouseLeave={(e) => {
                            if (previewMode !== 'mobile') e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        <FaMobileAlt size={18} /> Mobile
                    </button>
                </div>
            </div>

            {/* Container principal do conteúdo do painel (Sidebar + Preview) */}
            <div style={{
                display: 'flex',
                flexGrow: 1,
                width: '100%',
                paddingTop: totalFixedHeaderHeight,
                backgroundColor: '#f8f9fa', // Cor de fundo do conteúdo principal
            }}>
                <PersonalizarClientWrapper previewMode={previewMode} />
            </div>

            {/* Rodapé do Layout - NÃO FIXO */}
            <footer style={{
                backgroundColor: '#ffffff', // Fundo branco para o rodapé
                color: '#6c757d', // Cor de texto mais suave
                padding: '1rem',
                textAlign: 'center',
                fontFamily: 'Poppins, sans-serif',
                borderTop: '1px solid #e0e0e0', // Borda superior sutil
                fontSize: '0.85rem',
                flexShrink: 0,
                boxShadow: '0 -2px 6px rgba(0,0,0,0.05)', // Sombra para o rodapé
            }}>
                <p>&copy; 2024 Painel de Personalização. Desenvolvido por PhandCo.</p>
            </footer>
        </div>
    );
}