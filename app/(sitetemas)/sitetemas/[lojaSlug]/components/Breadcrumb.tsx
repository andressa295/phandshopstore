"use client";

import React from "react";

interface Path {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  paths: Path[];
  separator?: string;
}

export default function Breadcrumb({
  paths,
  separator = " / ",
}: BreadcrumbProps) {
  return (
    <nav className="text-sm text-gray-600" aria-label="breadcrumb">
      <ol className="flex flex-wrap gap-1">
        {paths.map((p, i) => (
          <li key={i} className="flex items-center">
            {p.href ? (
              <a
                href={p.href}
                className="text-blue-600 hover:underline transition"
              >
                {p.label}
              </a>
            ) : (
              <span>{p.label}</span>
            )}
            {i < paths.length - 1 && (
              <span className="mx-1 text-gray-400">{separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
