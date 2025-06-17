// app/(painelpersonalizado)/personalizar/components/utils/constants.ts
import React from 'react';
// Importe os ícones como componentes React para serem usados diretamente no JSX
import { FaHome, FaBullhorn, FaShoppingCart, FaStore, FaBoxOpen } from 'react-icons/fa';
import { MdFormatSize, MdSettingsApplications, MdCode, MdPalette } from 'react-icons/md';

export const webSafeFonts = [
    'Poppins, sans-serif',
    'Arial, sans-serif',
    'Verdana, sans-serif',
    'Helvetica, sans-serif',
    'Times New Roman, serif',
    'Courier New, monospace',
    'Lucida Console, monospace',
    'Impact, sans-serif',
    'Palatino Linotype, Book Antiqua, Palatino, serif',
    'Trebuchet MS, Helvetica, sans-serif',
    'Roboto, sans-serif',
    'Open Sans, sans-serif',
    'Lato, sans-serif',
    'Montserrat, sans-serif',
];

export const fontSizeOptions = Array.from({ length: 9 }, (_, i) => 10 + i).map(size => ({
    value: `${size}px`,
    label: `${size}px`
}));

export type PersonalizacaoMenuChild = {
    label: string;
    screenKey: string;
};

export type PersonalizacaoMenuItem = {
    icon?: React.ReactNode; 
    label: string; 
    screenKey?: string;
    children?: PersonalizacaoMenuChild[];
};

export const personalizacaoMenuItems: PersonalizacaoMenuItem[] = [
    {
        icon: <MdPalette />, label: 'Cores', screenKey: 'CoresUnificadas' 
    },
    {
        icon: <MdFormatSize />, label: 'Fontes', screenKey: 'FontesPrincipais' 
    },
    {
        icon: <FaHome />, label: 'Página inicial', screenKey: 'HomePageModulesList' 
    },
    {
        icon: <MdSettingsApplications />, label: 'Tipo de Designer', screenKey: 'TipoDesigner' 
    },
    {
        icon: <FaBullhorn />, label: 'Barra de Anúncio', screenKey: 'BarraAnuncio' 
    },
    {
        icon: <FaBoxOpen />, label: 'Lista de Produtos', screenKey: 'ListaProdutos' 
    },
    {
        icon: <FaStore />, label: 'Detalhe do Produto', screenKey: 'DetalheProduto' 
    },
    {
        icon: <FaShoppingCart />, label: 'Carrinho de Compras', screenKey: 'CarrinhoCompras' 
    },
    {
        icon: <MdSettingsApplications />, label: 'Rodapé da Página', screenKey: 'RodapePagina' 
    },
    {
        icon: <MdCode />, label: 'Edição de CSS Avançada', screenKey: 'AdvancedCssEditor' 
    },
];