import { ThemeConfig } from "../../theme/types";

export const padraoConfig: ThemeConfig = {
  themeName: "Padrão",
  planTier: "free",

  /** 🎨 Tokens de design */
  tokens: {
    colors: {
      primary: "#6a0dad",
      secondary: "#f5f5f5",
      text: "#333333",
      background: "#ffffff",
    },
    fonts: {
      heading: "Roboto, sans-serif",
      body: "Open Sans, sans-serif",
    },
    radius: 8,
    shadow: "0 2px 6px rgba(0,0,0,0.08)",
  },

  /** 🖼️ Banner principal */
  banner: {
    type: "slider", // "static" | "slider" | "video" | "grid"
    overlay: false,
    style: "full",
    height: 400,
    images: [
      { src: "/uploads/banner1.jpg", alt: "Promoção 1" },
      { src: "/uploads/banner2.jpg", alt: "Promoção 2" },
    ],
  },

  /** 🏷️ Cabeçalho */
  header: {
    storeName: "Minha Loja",
    searchMode: "icon", // ou "full"
    links: [
      { label: "Início", href: "/" },
      { label: "Produtos", href: "/produtos" },
      { label: "Contato", href: "/contato" },
      { label: "Carrinho", href: "/carrinho" },
    ],
  },

  /** 🚀 Faixa de benefícios padrão (InfoBar) */
  infobar: {
    variant: "belowBanner",
    iconColor: "#6B21A8",
    textColor: "#333333",
    backgroundColor: "#F9FAFB",
    items: [
      { icon: "credit-card", title: "Parcele em até 12x", subtitle: "no cartão" },
      { icon: "shield", title: "Loja 100% segura" },
      { icon: "truck", title: "Frete grátis", subtitle: "acima de R$199" },
      { icon: "whatsapp", title: "Atendimento via WhatsApp" },
    ],
  },

  /** 📰 Newsletter */
  newsletter: {
    enabled: true,
    title: "Assine nossa Newsletter",
    description: "Receba promoções e novidades direto no seu e-mail",
    placeholder: "Digite seu e-mail",
    buttonLabel: "Assinar",
    backgroundColor: "#f5f5f5",
    textColor: "#333333",
  },

  /** 🖼️ Mini banners */
  miniBanners: {
    enabled: true,
    columns: 3,
    banners: [
      { src: "/uploads/mini1.jpg", title: "Roupas", href: "/categorias/roupas" },
      { src: "/uploads/mini2.jpg", title: "Tênis", href: "/categorias/tenis" },
      { src: "/uploads/mini3.jpg", title: "Acessórios", href: "/categorias/acessorios" },
    ],
  },

  /** 🛍️ Vitrine de produtos */
  productShowcase: {
    title: "Mais vendidos",
    layout: "grid",
    columns: 4,
    products: [
      { id: "1", name: "Tênis Esportivo", price: 299.9, imageUrl: "/uploads/p1.jpg", href: "/produto/1" },
      { id: "2", name: "Jaqueta Jeans", price: 199.9, imageUrl: "/uploads/p2.jpg", href: "/produto/2" },
      { id: "3", name: "Bolsa Feminina", price: 159.9, imageUrl: "/uploads/p3.jpg", href: "/produto/3" },
    ],
  },

  /** ✨ Seção de destaque institucional */
  textImageSection: {
    title: "Nossa missão",
    text: "Na Phandshop, acreditamos que todo lojista merece vender online de forma simples, rápida e escalável.",
    imageUrl: "/uploads/missao.jpg",
    reverse: false,
    backgroundColor: "#ffffff",
    cta: { label: "Saiba mais", href: "/quem-somos" },
  },

  /** 📌 Rodapé */
  footer: {
    text: `© ${new Date().getFullYear()} Phandshop. Todos os direitos reservados.`,
    links: [
      { label: "Sobre", href: "/sobre" },
      { label: "Política de Privacidade", href: "/politica" },
      { label: "Contato", href: "/contato" },
    ],
    backgroundColor: "#6a0dad",
    textColor: "#ffffff",
  },

  /** 📏 Restrições de mídia para uploads */
  mediaConstraints: [
    { type: "banner", aspectRatio: "16/9", maxSizeMB: 2 },
    { type: "logo", aspectRatio: "1/1", maxSizeMB: 1 },
    { type: "product", aspectRatio: "1/1", maxSizeMB: 1 },
    { type: "miniBanner", aspectRatio: "4/3", maxSizeMB: 1 },
  ],
};
