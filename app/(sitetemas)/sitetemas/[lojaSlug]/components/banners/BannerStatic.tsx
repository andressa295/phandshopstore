"use client";

import React from "react";

interface BannerStaticProps {
  height?: number | string;
  styleVariant?: "full" | "boxed";
  overlay?: boolean;
  overlayColor?: string;
  src?: string;
  alt?: string;
}

export default function BannerStatic({
  height = 400,
  styleVariant = "full",
  overlay = false,
  overlayColor = "rgba(0,0,0,0.4)",
  src = "/placeholder.jpg",
  alt = "Banner estático",
}: BannerStaticProps) {
  return (
    <div
      className={`banner-static banner-${styleVariant}`}
      style={{ height, position: "relative" }}
    >
      <img
        src={src}
        alt={alt}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />
      {overlay && (
        <div
          className="overlay"
          style={{
            backgroundColor: overlayColor,
            position: "absolute",
            inset: 0,
          }}
        />
      )}
    </div>
  );
}
