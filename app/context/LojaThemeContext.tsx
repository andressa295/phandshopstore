'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Aqui definimos os temas possíveis como tipo restrito
export type TemaDisponivel = 'prado' | 'giardini' | 'miloch' | 'phand' | 'lunna' | 'atena';

interface LojaThemeContextData {
  tema: TemaDisponivel;
  setTema: (tema: TemaDisponivel) => void;

  corPrimaria: string;
  setCorPrimaria: (cor: string) => void;

  posicaoBanner: 'top' | 'left' | 'right' | 'bottom';
  setPosicaoBanner: (pos: 'top' | 'left' | 'right' | 'bottom') => void;

  bordaFotos: boolean;
  setBordaFotos: (borda: boolean) => void;

  formatoBotoes: 'oval' | 'retangular';
  setFormatoBotoes: (formato: 'oval' | 'retangular') => void;

  logoUrl: string;
  setLogoUrl: (url: string) => void;

  bannerUrl: string;
  setBannerUrl: (url: string) => void;
}

const LojaThemeContext = createContext<LojaThemeContextData | undefined>(undefined);

export function useLojaTheme() {
  const context = useContext(LojaThemeContext);
  if (!context) {
    throw new Error('useLojaTheme deve ser usado dentro de um LojaThemeProvider');
  }
  return context;
}

export function LojaThemeProvider({ children }: { children: ReactNode }) {
  const [tema, setTema] = useState<TemaDisponivel>('prado');
  const [corPrimaria, setCorPrimaria] = useState('#5c3ac7');
  const [posicaoBanner, setPosicaoBanner] = useState<'top' | 'left' | 'right' | 'bottom'>('top');
  const [bordaFotos, setBordaFotos] = useState(true);
  const [formatoBotoes, setFormatoBotoes] = useState<'oval' | 'retangular'>('oval');
  const [logoUrl, setLogoUrl] = useState('https://via.placeholder.com/150?text=Logo');
  const [bannerUrl, setBannerUrl] = useState('https://via.placeholder.com/800x200?text=Banner');

  return (
    <LojaThemeContext.Provider
      value={{
        tema,
        setTema,
        corPrimaria,
        setCorPrimaria,
        posicaoBanner,
        setPosicaoBanner,
        bordaFotos,
        setBordaFotos,
        formatoBotoes,
        setFormatoBotoes,
        logoUrl,
        setLogoUrl,
        bannerUrl,
        setBannerUrl,
      }}
    >
      {children}
    </LojaThemeContext.Provider>
  );
}
