// lojaMock.ts
import type { ThemeConfig } from "./types";
import { padraoConfig } from "../themes/padrao/config";

export const lojaData = {
  nome: "Loja Mockada",
  logoUrl: "/uploads/logo.png",
};

export const catalog = [
  {
    id: "1",
    name: "Tênis Esportivo",
    price: 299.9,
    imageUrl: "/uploads/produtos/tenis.jpg",
    href: "/produto/1",
  },
  {
    id: "2",
    name: "Jaqueta Jeans",
    price: 199.9,
    imageUrl: "/uploads/produtos/jaqueta.jpg",
    href: "/produto/2",
  },
  {
    id: "3",
    name: "Bolsa Feminina",
    price: 159.9,
    imageUrl: "/uploads/produtos/bolsa.jpg",
    href: "/produto/3",
  },
  {
    id: "4",
    name: "Relógio Clássico",
    price: 349.9,
    imageUrl: "/uploads/produtos/relogio.jpg",
    href: "/produto/4",
  },
];

export const themeConfig: ThemeConfig = padraoConfig;
