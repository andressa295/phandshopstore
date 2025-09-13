export interface InfoBarItem {
  icon: string;
  title: string;
  subtitle?: string;
}

export interface HeaderLink {
  label: string;
  href: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface MiniBanner {
  src: string;
  title?: string;
  href?: string;
}

export interface ProductItem {
  id: string | number;
  name: string;
  price: number;
  imageUrl: string;
  href?: string;
}

export interface ThemeConfig {
  themeName: string;
  planTier: "free" | "basic" | "master";

  tokens: {
    colors: {
      primary: string;
      secondary: string;
      text: string;
      background: string;
    };
    fonts: {
      heading: string;
      body: string;
    };
    radius: number;
    shadow: string;
  };

  announcementBar?: {
    message: string;
    link?: { label: string; href: string };
    backgroundColor?: string;
    textColor?: string;
  };

  banner: {
    type: "slider" | "static" | "video" | "grid";
    overlay: boolean;
    style?: "full" | "boxed";
    height: number;
    images?: { src: string; alt?: string }[];
  };

  header: {
    storeName: string;
    searchMode: "icon" | "full";
    links: HeaderLink[];
  };

  footer: {
    text: string;
    links: FooterLink[];
    backgroundColor: string;
    textColor: string;
  };

  infobar: {
    variant: "belowBanner" | "overBanner";
    iconColor: string;
    textColor: string;
    backgroundColor: string;
    items: InfoBarItem[];
  };

  newsletter: {
    enabled: boolean;
    title: string;
    description: string;
    placeholder: string;
    buttonLabel: string;
    backgroundColor: string;
    textColor: string;
  };

  miniBanners: {
    enabled: boolean;
    columns: number;
    banners: MiniBanner[];
  };

  productShowcase: {
    title: string;
    layout: "grid" | "carousel";
    columns: number;
    products: ProductItem[];
    pricing?: {
      enablePix: boolean;
      pixDiscount: number; // 0.1 = 10%
      installments?: {
        enabled: boolean;
        max: number;
        interestFree: boolean;
      };
    };
  };

  textImageSection: {
    title: string;
    text: string;
    imageUrl: string;
    reverse?: boolean;
    backgroundColor?: string;
    cta?: { label: string; href: string };
  };

  features?: {
    newsletter?: boolean;
    highlight?: boolean;
    miniBanners?: boolean;
  };

  mediaConstraints?: {
    type: "banner" | "logo" | "product" | "miniBanner";
    aspectRatio: string;
    maxSizeMB?: number;
  }[];
}
