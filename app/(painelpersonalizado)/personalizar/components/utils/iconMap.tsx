// app/(painelpersonalizado)/personalizar/components/utils/iconMap.ts
import React, { ReactNode } from 'react';
// Importe SOMENTE os ícones que serão usados AQUI para o infoIconMap e renderIconFromString
import { FaBoxOpen, FaStar, FaShieldAlt, FaSyncAlt, FaShippingFast, FaMoneyBillWave, FaCreditCard, FaTag, FaWhatsapp } from 'react-icons/fa';
import { MdImage, MdViewCarousel, MdMessage, MdMail, MdSettingsApplications } from 'react-icons/md';

// Mapeamento para ícones de informação (usado em Detalhe do Produto > Informações sobre a compra)
export const infoIconMap: Record<string, ReactNode> = {
    seguranca: <FaShieldAlt size={16} />,
    trocasDevolucoes: <FaSyncAlt size={16} />,
    entregas: <FaShippingFast size={16} />,
    dinheiro: <FaMoneyBillWave size={16} />,
    cartaoCredito: <FaCreditCard size={16} />,
    promocoes: <FaTag size={16} />,
    whatsapp: <FaWhatsapp size={16} />,
    imagemPropria: null // Este será renderizado como uma imagem, não um ícone diretamente aqui
};

// Função auxiliar para mapear strings de ícones para componentes React.ReactNode (para HomePageModule.icon)
export const renderIconFromString = (iconString: string, size: number = 14, color?: string): ReactNode => {
    const style = { fontSize: size, color: color };
    switch (iconString) {
        case 'MdImage': return <MdImage style={style} />;
        case 'FaStar': return <FaStar style={style} />;
        case 'MdViewCarousel': return <MdViewCarousel style={style} />;
        case 'FaBoxOpen': return <FaBoxOpen style={style} />;
        case 'MdMail': return <MdMail style={style} />;
        case 'MdSettingsApplications': return <MdSettingsApplications style={style} />;
        case 'MdMessage': return <MdMessage style={style} />;
        default: return null;
    }
};