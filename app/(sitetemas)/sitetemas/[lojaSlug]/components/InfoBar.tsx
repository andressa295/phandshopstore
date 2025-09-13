"use client";

import React from "react";
import {
  CreditCard,
  Truck,
  Shield,
  MessageCircle,
  Package,
  Gift,
} from "lucide-react";

const IconMap: Record<string, any> = {
  "credit-card": CreditCard,
  "truck": Truck,
  "shield": Shield,
  "whatsapp": MessageCircle,
  "package": Package,
  "gift": Gift,
};

interface InfoItem {
  icon: string;
  title: string;
  subtitle?: string;
}

interface InfoBarProps {
  items: InfoItem[];
  variant?: "belowBanner" | "overBanner";
  iconColor?: string;
  textColor?: string;
  backgroundColor?: string;
}

export default function InfoBar({
  items,
  variant = "belowBanner",
  iconColor = "var(--color-primary)",
  textColor = "#333",
  backgroundColor = "transparent",
}: InfoBarProps) {
  return (
    <section
      className={`padrao-infobar ${variant === "overBanner" ? "over" : ""}`}
      style={{ backgroundColor, color: textColor }}
    >
      <div className="padrao-infobar__grid grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {items.map((it, idx) => {
          const Icon = IconMap[it.icon] || Package;
          return (
            <div key={idx} className="padrao-infobar__item flex flex-col items-center gap-2">
              <Icon size={22} aria-hidden style={{ color: iconColor }} />
              <div>
                <div className="padrao-infobar__title font-semibold">{it.title}</div>
                {it.subtitle && (
                  <div className="padrao-infobar__subtitle text-sm opacity-80">
                    {it.subtitle}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
