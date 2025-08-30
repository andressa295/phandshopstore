'use client';

import React from 'react';
import Link from 'next/link';
import { MessageSquareText } from 'lucide-react';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { HeaderSettingsConfig } from '../../../../(painel)/personalizar/types';

const TopInfoBar: React.FC = () => {
  const { config } = useTheme();
  const headerSettings: HeaderSettingsConfig = config.headerSettings || {};

  const text = headerSettings.announcementText;
  const link = headerSettings.announcementLink;
  const isActive = headerSettings.showAnnouncementBar;

  if (!isActive || !text) {
    return null; // Só renderiza se estiver ativo e tiver texto
  }

  return (
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
