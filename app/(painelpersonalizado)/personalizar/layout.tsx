'use client';

import React, { useState, ReactNode, useEffect } from 'react';
import Link from 'next/link';
import { FaDesktop, FaMobileAlt, FaArrowRight, FaQuestionCircle } from 'react-icons/fa';
import PersonalizarClientWrapper from './components/PersonalizarClientWrapper';

import type { CSSProperties } from 'react';

// Alturas ajustadas pra deixar o header mais fino e clean
const HEADER_HEIGHT_TOP_PANEL = '3rem'; // 48px - menos espaço, mais elegante
const FOOTER_HEIGHT_BOTTOM_PANEL = '2rem'; // 32px mantém o rodapé discreto

export default function PersonalizarLayout({ children }: { children: ReactNode }) {
    const [showHelpModal, setShowHelpModal] = useState(false);

    useEffect(() => {
        // Reset estilos overflow para deixar rolagem global OK
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
        document.body.style.height = 'auto';
        document.documentElement.style.height = 'auto';
        document.body.style.margin = '0';
        document.documentElement.style.margin = '0';
        document.body.style.boxSizing = 'border-box';
        document.documentElement.style.boxSizing = 'border-box';

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            document.body.style.height = '';
            document.documentElement.style.height = '';
            document.body.style.margin = '';
            document.documentElement.style.margin = '';
            document.body.style.boxSizing = '';
            document.documentElement.style.boxSizing = '';
        };
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                boxSizing: 'border-box' as 'border-box',
                fontFamily: 'Inter, sans-serif',
                backgroundColor: '#F3E8FF', // Fundo levemente lilás pra combinar com o roxo, sem agredir os olhos
                minHeight: '100vh',
            } as CSSProperties}
        >
            {/* HEADER MODERNO E ENXUTO */}
            <header
                style={{
                    height: HEADER_HEIGHT_TOP_PANEL,
                    backgroundColor: '#6A0DAD', // Roxo Phandshop topzera
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0 1.25rem',
                    color: '#F3E8FF', // Texto claro pro contraste
                    boxShadow: '0 2px 6px rgba(106, 13, 173, 0.3)',
                    flexShrink: 0,
                    boxSizing: 'border-box',
                    fontWeight: 300, // Fonte fina e elegante
                    fontSize: '0.9rem',
                }}
            >
                {/* Lado Esquerdo */}
                <Link
                    href="/dashboard"
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        color: '#F3E8FF',
                        textDecoration: 'none',
                        cursor: 'pointer',
                        fontWeight: 400,
                        fontSize: '0.85rem',
                        transition: 'color 0.2s ease',
                        flexShrink: 0,
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = '#D6BCFA')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#F3E8FF')}
                >
                    <FaArrowRight style={{ transform: 'rotate(180deg)', fontSize: '1.1rem' }} /> Voltar
                </Link>

                {/* Centro - Botões compactos desktop/mobile */}
                <div
                    style={{
                        backgroundColor: '#7C3AED88', // Roxo translúcido para suavizar
                        borderRadius: '0.375rem',
                        padding: '0.15rem',
                        display: 'flex',
                        gap: '0.3rem',
                        boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.12)',
                    }}
                >
                    {/* Remove previewMode aqui, pois agora é interno ao contexto */}
                    {/* Pode adicionar controles aqui se quiser, mas sem afetar o PersonalizarClientWrapper */}
                </div>

                {/* Lado Direito */}
                <div
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        alignItems: 'center',
                        minWidth: 0,
                    }}
                >
                    <button
                        onClick={() => setShowHelpModal(true)}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#E9D8FD',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 400,
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.375rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            transition: 'background-color 0.2s ease, color 0.2s ease',
                            userSelect: 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#9F7AEA';
                            e.currentTarget.style.color = '#3C096C';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'transparent';
                            e.currentTarget.style.color = '#E9D8FD';
                        }}
                    >
                        <FaQuestionCircle /> Ajuda
                    </button>
                    <a
                        href="https://sua-loja-real.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            backgroundColor: '#9F7AEA',
                            color: '#FFF',
                            padding: '0.5rem 1rem',
                            borderRadius: '9999px',
                            textDecoration: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            fontWeight: 600,
                            fontSize: '0.9rem',
                            boxShadow: '0 4px 8px rgba(159, 122, 234, 0.5)',
                            transition: 'all 0.2s ease-in-out',
                            userSelect: 'none',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#7C3AED';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                            e.currentTarget.style.boxShadow = '0 10px 20px rgba(124, 58, 237, 0.6)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#9F7AEA';
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(159, 122, 234, 0.5)';
                        }}
                    >
                        Ver loja <FaArrowRight style={{ marginLeft: '0.25rem', fontSize: '1rem' }} />
                    </a>
                </div>
            </header>

            {/* Conteúdo principal */}
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    padding: '20px',
                    overflowX: 'hidden',
                    boxSizing: 'border-box' as 'border-box',
                    flexGrow: 1,
                    minHeight: 0, // Pra rolagem funcionar direito
                }}
            >
                {/* REMOVIDO previewMode daqui */}
                <PersonalizarClientWrapper />
            </div>

            {/* Rodapé */}
            <footer
                style={{
                    height: FOOTER_HEIGHT_BOTTOM_PANEL,
                    backgroundColor: '#FFFFFF',
                    color: '#6c757d',
                    padding: '0.75rem',
                    textAlign: 'center',
                    borderTop: '1px solid #E2E8F0',
                    fontSize: '0.75rem',
                    boxShadow:
                        '0 -1px 3px 0 rgba(0, 0, 0, 0.1), 0 -1px 2px 0 rgba(0, 0, 0, 0.06)',
                    flexShrink: 0,
                    fontFamily: 'Inter, sans-serif',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxSizing: 'border-box' as 'border-box',
                }}
            >
                <p>© 2024 Painel de Personalização. Desenvolvido por PhandCo.</p>
            </footer>

            {/* Modal Ajuda */}
            {showHelpModal && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1200,
                        boxSizing: 'border-box' as 'border-box',
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '2rem',
                            borderRadius: '0.5rem',
                            boxShadow:
                                '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                            maxWidth: '24rem',
                            textAlign: 'center',
                            boxSizing: 'border-box' as 'border-box',
                        }}
                    >
                        <h3
                            style={{
                                marginTop: 0,
                                color: '#2D3748',
                                fontSize: '1.125rem',
                                fontWeight: 600,
                            }}
                        >
                            Ajuda e Documentação
                        </h3>
                        <p
                            style={{
                                color: '#4A5568',
                                lineHeight: '1.625',
                                marginTop: '1rem',
                                marginBottom: '1.5rem',
                            }}
                        >
                            A funcionalidade de ajuda e documentação completa está em
                            desenvolvimento e estará disponível em breve!
                        </p>
                        <button
                            onClick={() => setShowHelpModal(false)}
                            style={{
                                backgroundColor: '#6A0DAD',
                                color: '#fff',
                                border: 'none',
                                padding: '0.625rem 1.25rem',
                                borderRadius: '0.375rem',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 600,
                                transition: 'background-color 0.2s ease',
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor = '#580BA0')
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor = '#6A0DAD')
                            }
                        >
                            Entendi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
