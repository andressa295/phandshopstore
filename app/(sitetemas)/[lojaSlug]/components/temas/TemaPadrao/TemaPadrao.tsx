'use client'; 

import React, { useEffect } from 'react';


import './styles/theme.css'; // Variáveis globais e estilos base do tema
import './styles/header.css';
import './styles/benefit-infobar.css';
import './styles/banner-slider.css';
import './styles/footer.css';
import './styles/product-card.css';
import './styles/checkout-page.css';
import './styles/order-confirmation-page.css';
import './styles/my-account-page.css';
import './styles/search-page.css';
import './styles/testimonials-section.css';
import './styles/mini-banner-section.css';
import './styles/text-with-image-section.css';
import './styles/category-listing-page.css';


interface ThemeProps {
  children: React.ReactNode;
  temaConfig: any; 
}

const TemaPadrao: React.FC<ThemeProps> = ({ children, temaConfig }) => {
  useEffect(() => {
    const root = document.documentElement;

    if (temaConfig?.cores?.primaria) root.style.setProperty('--cor-primaria', temaConfig.cores.primaria);
    if (temaConfig?.cores?.secundaria) root.style.setProperty('--cor-secundaria', temaConfig.cores.secundaria);
    if (temaConfig?.cores?.texto) root.style.setProperty('--cor-texto', temaConfig.cores.texto);
    if (temaConfig?.cores?.fundo) root.style.setProperty('--cor-fundo', temaConfig.cores.fundo);

    if (temaConfig?.fontes?.principal) root.style.setProperty('--fonte-principal', temaConfig.fontes.principal);
    if (temaConfig?.fontes?.titulos) root.style.setProperty('--fonte-titulos', temaConfig.fontes.titulos);

    root.style.setProperty('--botao-arredondamento', temaConfig?.botoes?.arredondamento || '4px');
    root.style.setProperty('--botao-sombra', temaConfig?.botoes?.sombra ? '0 4px 8px rgba(0,0,0,0.1)' : 'none');

    if (temaConfig?.cor_fundo_card) root.style.setProperty('--cor-fundo-card', temaConfig.cor_fundo_card);
    if (temaConfig?.cor_fundo_input) root.style.setProperty('--cor-fundo-input', temaConfig.cor_fundo_input);
    if (temaConfig?.cor_fundo_secundario) root.style.setProperty('--cor-fundo-secundario', temaConfig.cor_fundo_secundario);

  }, [temaConfig]);

  return (
    <div className="ph-theme-wrapper ph-tema-padrao-wrapper">
      {children}
    </div>
  );
};

export default TemaPadrao;
