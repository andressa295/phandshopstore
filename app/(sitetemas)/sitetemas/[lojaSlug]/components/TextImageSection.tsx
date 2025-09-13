"use client";

import React from "react";

interface TextImageSectionProps {
  title: string;
  text: string;
  imageUrl: string;
  reverse?: boolean; // controla se a imagem fica à esquerda ou à direita
  backgroundColor?: string;
  cta?: { label: string; href: string };
}

export default function TextImageSection({
  title,
  text,
  imageUrl,
  reverse = false,
  backgroundColor = "transparent",
  cta,
}: TextImageSectionProps) {
  return (
    <section
      className="py-12 px-6"
      style={{ backgroundColor }}
    >
      <div
        className={`max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-center ${
          reverse ? "md:flex-row-reverse" : ""
        }`}
      >
        <div>
          <h2 className="text-2xl font-bold mb-4">{title}</h2>
          <p className="text-gray-700 mb-4">{text}</p>
          {cta && (
            <a
              href={cta.href}
              className="inline-block bg-[var(--color-primary)] text-white px-4 py-2 rounded hover:opacity-90 transition"
            >
              {cta.label}
            </a>
          )}
        </div>
        <div>
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-auto rounded-[var(--radius)] shadow"
          />
        </div>
      </div>
    </section>
  );
}
