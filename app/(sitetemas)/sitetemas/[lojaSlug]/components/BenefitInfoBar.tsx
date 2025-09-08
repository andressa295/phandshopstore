'use client';

import React from 'react';
import {
    MdLocalShipping, MdCreditCard, MdHeadset, MdStar, MdSecurity,
    MdAccessTime, MdWorkspacePremium, MdOutlineVerified, MdWhatsapp, MdArchive, MdClose
} from 'react-icons/md';

interface HighlightItem {
    id: string;
    icon: string;
    title: string;
    subtitle: string;
    isActive: boolean;
}

interface BenefitInfoBarProps {
    title?: string;
    subtitle?: string;
    isActive?: boolean;
    layout?: string;
    highlightItems: HighlightItem[];
}

const IconComponents = {
    MdLocalShipping, MdCreditCard, MdHeadset, MdStar, MdSecurity,
    MdAccessTime, MdWorkspacePremium, MdOutlineVerified, MdWhatsapp, MdArchive, MdClose,
};

type IconComponentName = keyof typeof IconComponents;

const BenefitInfoBar: React.FC<BenefitInfoBarProps> = ({
    title,
    subtitle,
    isActive,
    layout,
    highlightItems,
}) => {
    if (!isActive || !highlightItems || highlightItems.length === 0) {
        return null;
    }

    const containerClass = layout === 'cards'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        : "flex flex-wrap justify-center gap-8 md:gap-12";

    return (
        <section className="ph-info-bar-section">
            <div className="ph-loja-container">
                {title && <h2 className="ph-info-bar-title">{title}</h2>}
                {subtitle && <p className="ph-info-bar-subtitle">{subtitle}</p>}
                
                <div className={containerClass}>
                    {highlightItems.map((item) => {
                        const IconComponent = IconComponents[item.icon as IconComponentName];
                        if (!item.isActive) return null;

                        return (
                            <div key={item.id} className="ph-info-bar-item">
                                {IconComponent ? (
                                    <IconComponent size={32} className="ph-info-bar-icon" />
                                ) : (
                                    <span className="ph-info-bar-icon">{item.icon}</span>
                                )}
                                <h3 className="ph-info-bar-item-title">{item.title}</h3>
                                <p className="ph-info-bar-item-subtitle">{item.subtitle}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BenefitInfoBar;