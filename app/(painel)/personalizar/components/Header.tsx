'use client';

import React from 'react';
import styles from './Header.module.css';
import { useTheme } from '../context/ThemeContext';
import { FiArrowLeft, FiExternalLink, FiSmartphone, FiMonitor } from 'react-icons/fi';

const Header: React.FC = () => {
    const { previewMode, setPreviewMode } = useTheme();

    const handleBack = () => {
        window.location.href = '/dashboard'; // Link to internal dashboard
    };

    const handleOpenStore = () => {
        window.open('https://minhaloja.phandshop.com', '_blank'); // Open store in new tab
    };

    return (
        <header className={styles.topbar}>
            {/* "Voltar ao painel" button on the far left */}
            <button onClick={handleBack} className={styles.backButton} title="Voltar ao painel">
                <FiArrowLeft size={18} />
                <span>Voltar ao painel</span>
            </button>

            {/* Mobile/Notebook view options centralized */}
            <div className={styles.centerGroup}>
                <button
                    onClick={() => setPreviewMode('desktop')}
                    className={`${styles.iconButton} ${previewMode === 'desktop' ? styles.active : ''}`}
                    title="Visualizar no desktop"
                >
                    <FiMonitor size={18} />
                </button>
                <button
                    onClick={() => setPreviewMode('mobile')}
                    className={`${styles.iconButton} ${previewMode === 'mobile' ? styles.active : ''}`}
                    title="Visualizar no celular"
                >
                    <FiSmartphone size={18} />
                </button>
            </div>

            {/* "Ver Loja" button on the far right */}
            <button onClick={handleOpenStore} className={styles.viewStoreButton} title="Ver minha loja">
                <span>Ver Loja</span>
                <FiExternalLink size={18} />
            </button>
        </header>
    );
};

export default Header;