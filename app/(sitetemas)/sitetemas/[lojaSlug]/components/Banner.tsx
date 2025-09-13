"use client";

import React from "react";
import { ThemeConfig } from "../theme/types";
import BannerStatic from "./banners/BannerStatic";
import BannerSlider from "./banners/BannerSlider";
// import BannerVideo from "./banners/BannerVideo";
// import BannerGrid from "./banners/BannerGrid";

interface BannerProps {
  config: ThemeConfig["banner"];
}

export default function Banner({ config }: BannerProps) {
  const { type, ...props } = config;

  switch (type) {
    case "static":
      return <BannerStatic {...props} />;
    case "slider":
      return <BannerSlider {...props} />;
    // case "video":
    //   return <BannerVideo {...props} />;
    // case "grid":
    //   return <BannerGrid {...props} />;
    default:
      return null;
  }
}
