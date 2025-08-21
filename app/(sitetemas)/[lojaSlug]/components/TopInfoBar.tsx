'use client';

import React from 'react';
import Link from 'next/link';
// Importa o ícone MessageSquareText do Lucide React para consistência
import { MessageSquareText } from 'lucide-react'; 

// REMOVIDO: import '../styles/top-info-bar.css'; // O estilo virá do tema ativo

interface TopInfoBarProps {
    text: string | null;
    link: string | null;
    isActive: boolean;
}

const TopInfoBar: React.FC<TopInfoBarProps> = ({ 
    text, 
    link, 
    isActive
}) => {
    if (!isActive || !text) { // Só renderiza se estiver ativo e tiver texto
        return null;
    }

    return (
        // CORREÇÃO: Adicionada a tag de abertura do div pai.
        <div className="ph-topmost-bar"> 
            <div className="ph-topmost-content"> 
                <div className="ph-topmost-message">
                    {link ? (
                        <Link href={link} target="_blank" rel="noopener noreferrer" className="ph-topmost-message-link">
                            {/* Ícone Lucide React para consistência */}
                            <MessageSquareText size={16} /> {text}
                        </Link>
                    ) : (
                        <span>
                            {/* Ícone Lucide React para consistência */}
                            <MessageSquareText size={16} /> {text}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopInfoBar;
