"use client";

import React from "react";

interface MiniBanner {
  src: string;
  alt?: string;
  href?: string;
  title?: string;
}

interface MiniBannerSectionProps {
  banners: MiniBanner[];
  columns?: number;
}

export default function MiniBannerSection({
  banners,
  columns = 3,
}: MiniBannerSectionProps) {
  return (
    <section className="p-6 max-w-6xl mx-auto">
      <div
        className={`grid gap-4`}
        style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
      >
        {banners.map((banner, idx) => (
          <a
            key={idx}
            href={banner.href || "#"}
            className="relative group block overflow-hidden rounded-[var(--radius)] shadow-sm"
          >
            <img
              src={banner.src}
              alt={banner.alt ?? `Mini banner ${idx + 1}`}
              className="w-full h-40 object-cover transition group-hover:scale-105"
            />
            {banner.title && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
                <span className="text-white font-semibold text-sm">
                  {banner.title}
                </span>
              </div>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
