"use client";

import React from "react";

interface GalleryItem {
  src: string;
  alt?: string;
  href?: string;
  cta?: string;
}

interface GalleryProps {
  images: GalleryItem[];
  title?: string;
  itemHeight?: string | number;
}

export default function Gallery({
  images,
  title,
  itemHeight = "12rem", // ~48 (tailwind h-48)
}: GalleryProps) {
  return (
    <section className="p-6 max-w-6xl mx-auto">
      {title && <h2 className="text-2xl font-bold mb-4">{title}</h2>}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((img, i) => (
          <div
            key={i}
            className="relative group overflow-hidden rounded-[var(--radius)] shadow-sm"
            style={{ height: itemHeight }}
          >
            <a href={img.href || "#"} className="block w-full h-full">
              <img
                src={img.src}
                alt={img.alt ?? `Imagem ${i + 1}`}
                className="w-full h-full object-cover group-hover:opacity-90 transition"
              />
            </a>
            {img.cta && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="bg-[var(--color-primary)] text-white text-sm px-3 py-1 rounded">
                  {img.cta}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
