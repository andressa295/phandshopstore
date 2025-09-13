"use client";

import React from "react";

interface CategoryBannerProps {
  title: string;
  description?: string;
  image?: string;
  cta?: { label: string; href: string };
}

export default function CategoryBanner({
  title,
  description,
  image = "/placeholder.jpg",
  cta,
}: CategoryBannerProps) {
  return (
    <section className="relative w-full h-64 flex items-center justify-center overflow-hidden rounded-lg">
      {/* Imagem de fundo */}
      <img
        src={image}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-40" />

      {/* Conteúdo */}
      <div className="relative z-10 text-center text-white px-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        {description && (
          <p className="mt-2 text-sm max-w-xl mx-auto">{description}</p>
        )}
        {cta && (
          <a
            href={cta.href}
            className="mt-4 inline-block bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-90 transition"
          >
            {cta.label}
          </a>
        )}
      </div>
    </section>
  );
}
