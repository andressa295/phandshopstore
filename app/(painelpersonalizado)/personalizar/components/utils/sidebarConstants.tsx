import React from 'react';
import { FaPalette, FaFont, FaHome, FaSlidersH, FaBoxOpen, FaShoppingCart, FaColumns, FaCode, FaImages, FaFileAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';

export interface MenuChild {
    label: string;
    key: string; 
    icon?: React.ReactNode;
}

export interface MenuItem {
    icon: React.ReactNode;
    label: string;
    key: string; 
    children?: MenuChild[];
}

export const personalizacaoMenuItems: MenuItem[] = [
    { label: 'Imagem da sua marca', key: 'logo', icon: <FaImages /> },
    { label: 'Cores da sua marca', key: 'cores', icon: <FaPalette /> },
    { label: 'Tipo de Letra', key: 'tipografia', icon: <FaFont /> },
    { label: 'Configurações avançadas', key: 'configuracoesAvancadas', icon: <FaSlidersH /> },
    { label: 'Tipo de design', key: 'tipoDesign', icon: <FaColumns /> },
    { label: 'Cabeçalho', key: 'cabecalho', icon: <FaHome /> }, // Ícone provisório
    { label: 'Página inicial', key: 'homePageModules', icon: <FaHome /> },
    { label: 'Lista de produtos', key: 'listaProdutos', icon: <FaBoxOpen /> },
    { label: 'Detalhe do produto', key: 'detalheProduto', icon: <FaShoppingCart /> },
    { label: 'Carrinho de compras', key: 'carrinho', icon: <FaShoppingCart /> },
    { label: 'Rodapé da página', key: 'rodape', icon: <FaFileAlt /> },
    { label: 'Edição de CSS Avançada', key: 'advancedCss', icon: <FaCode /> },
];