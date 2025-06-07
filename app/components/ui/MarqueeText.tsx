// src/app/components/ui/MarqueeText.tsx
import React from 'react';
import { FiShoppingBag } from 'react-icons/fi';

interface MarqueeTextProps {
  text: string;
  icon?: React.ElementType;
}

export const MarqueeText: React.FC<MarqueeTextProps> = ({ text, icon: Icon }) => {
  return (
    <div className="marquee-container">
      <div className="marquee-content">
        {/* Duplicamos o conteúdo para garantir um loop contínuo e suave */}
        {Array.from({ length: 20 }).map((_, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center' }}>
            {text} {Icon && <Icon style={{ marginLeft: '0.5rem', marginRight: '0.5rem' }} />}
          </span>
        ))}
      </div>
    </div>
  );
};