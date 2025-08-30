'use client';

import React from 'react';
import {
    MdLocalShipping,
    MdCreditCard,
    MdHeadset,
    MdStar,
    MdSecurity,
    MdAccessTime,
    MdWorkspacePremium,
    MdOutlineVerified,
    MdWhatsapp,
    MdArchive,
    MdClose,
} from 'react-icons/md';
import { useTheme } from '../../../../(painel)/personalizar/context/ThemeContext';
import { HighlightsModuleData, SingleHighlightItem } from '../../../../(painel)/personalizar/types';

const IconComponents = {
    MdLocalShipping: MdLocalShipping,
    MdCreditCard: MdCreditCard,
    MdHeadset: MdHeadset,
    MdStar: MdStar,
    MdSecurity: MdSecurity,
    MdAccessTime: MdAccessTime,
    MdWorkspacePremium: MdWorkspacePremium,
    MdOutlineVerified: MdOutlineVerified,
    MdWhatsapp: MdWhatsapp,
    MdArchive: MdArchive,
    MdClose: MdClose,
};

// CORREÇÃO: Define o tipo da chave do objeto IconComponents
type IconComponentName = keyof typeof IconComponents;

interface BenefitInfoBarProps {
    data: HighlightsModuleData;
}

const BenefitInfoBar: React.FC<BenefitInfoBarProps> = ({ data }) => {
    const items = data.highlightItems;

    if (!data.isActive || !items || items.length === 0) {
        return null;
    }

    const containerClass = data.layout === 'cards'
        ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        : "flex flex-wrap justify-center gap-8 md:gap-12";

    return (
        <section className="bg-white py-8 md:py-12">
            <div className="container mx-auto px-4 text-center">
                {data.title && <h2 className="text-3xl font-bold text-gray-800 mb-2">{data.title}</h2>}
                {data.subtitle && <p className="text-lg text-gray-600 mb-8">{data.subtitle}</p>}
                
                <div className={containerClass}>
                    {items.map((item) => {
                        // CORREÇÃO: Acessa o componente de forma segura e tipada
                        const IconComponent = IconComponents[item.icon as IconComponentName];
                        if (!item.isActive) return null;

                        return (
                            <div key={item.id} className="flex flex-col items-center text-center p-6 rounded-lg shadow-sm">
                                {IconComponent ? (
                                    <IconComponent size={32} className="text-purple-600 mb-4" />
                                ) : (
                                    <span className="text-4xl text-red-500 mb-4">{item.icon}</span>
                                )}
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-600">{item.subtitle}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BenefitInfoBar;