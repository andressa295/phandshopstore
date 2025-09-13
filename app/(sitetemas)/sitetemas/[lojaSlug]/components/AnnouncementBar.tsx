"use client";

import React from "react";

interface AnnouncementBarProps {
  message: string;
  link?: { label: string; href: string };
  backgroundColor?: string;
  textColor?: string;
}

export default function AnnouncementBar({
  message,
  link,
  backgroundColor = "var(--color-primary)",
  textColor = "#FFFFFF",
}: AnnouncementBarProps) {
  return (
    <div
      className="w-full text-center py-2 px-4 text-sm flex items-center justify-center gap-2"
      style={{ backgroundColor, color: textColor }}
      role="status"
      aria-live="polite"
    >
      <span>{message}</span>
      {link && (
        <a
          href={link.href}
          className="underline hover:opacity-90 transition"
        >
          {link.label}
        </a>
      )}
    </div>
  );
}
