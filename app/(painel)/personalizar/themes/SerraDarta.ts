// app/(painel)/personalizar/themes/SerraDarta.ts
import { BaseTheme } from './BaseTheme';
import { ThemeConfig } from '../types';

const SerraDarta: ThemeConfig = {
    ...BaseTheme, // Herda todas as configurações do tema base
    name: 'Serra Darta',
    primaryColor: '#8B4513', // Cor primária marrom
    secondaryColor: '#DEB887', // Cor secundária bege
    textColor: '#5C4033', // Cor de texto marrom escuro
    primaryFont: 'Georgia, serif',
    
    // Sobrescreve as cores do cabeçalho e rodapé
    headerBackgroundColor: '#8B4513',
    headerTextColor: '#ffffff',
    footer: {
        ...BaseTheme.footer,
        footerBackgroundColor: '#5C4033',
        footerTextColor: '#DEB887',
    },

    // Adicione outras sobrescritas visuais aqui, se necessário
};

export default SerraDarta;