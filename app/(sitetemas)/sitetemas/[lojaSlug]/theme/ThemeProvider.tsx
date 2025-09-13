"use client";

import React, { createContext, useContext, ReactNode, useEffect } from "react";
import type { ThemeConfig } from "./types";

interface LojaData {
  nome: string;
  logoUrl?: string;
}

interface ThemeProviderProps {
  themeConfig: ThemeConfig;
  lojaData: LojaData;
  children: ReactNode;
}

const ThemeContext = createContext<{
  themeConfig: ThemeConfig;
  lojaData: LojaData;
} | null>(null);

export default function ThemeProvider({
  themeConfig,
  lojaData,
  children,
}: ThemeProviderProps) {
  // Injetar tokens como CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--color-primary", themeConfig.tokens.colors.primary);
    root.style.setProperty("--color-secondary", themeConfig.tokens.colors.secondary);
    root.style.setProperty("--color-text", themeConfig.tokens.colors.text);
    root.style.setProperty("--color-background", themeConfig.tokens.colors.background);
    root.style.setProperty("--radius", `${themeConfig.tokens.radius}px`);
    root.style.setProperty("--shadow", themeConfig.tokens.shadow);
    root.style.setProperty("--font-heading", themeConfig.tokens.fonts.heading);
    root.style.setProperty("--font-body", themeConfig.tokens.fonts.body);
  }, [themeConfig]);

  return (
    <ThemeContext.Provider value={{ themeConfig, lojaData }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme precisa ser usado dentro do ThemeProvider");
  }
  return ctx;
}
