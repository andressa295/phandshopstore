"use client";

import React from "react";
import type { ThemeConfig } from "./theme/types";
import ThemeProvider from "./theme/ThemeProvider"; // ✅ import default

import Header from "./components/Header";
import AnnouncementBar from "./components/AnnouncementBar";
import Banner from "./components/Banner";
import ProductShowcase from "./components/ProductShowcase";
import TextImageSection from "./components/TextImageSection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

interface BaseStoreLayoutProps {
  lojaData: { nome: string; logoUrl?: string };
  catalog?: any[];
  themeConfig: ThemeConfig;
}

export default function BaseStoreLayout({
  lojaData,
  catalog = [],
  themeConfig,
}: BaseStoreLayoutProps) {
  return (
    <ThemeProvider themeConfig={themeConfig} lojaData={lojaData}>
      <div className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text)]">
        {/* Announcement bar (opcional) */}
        {themeConfig.announcementBar && (
          <AnnouncementBar
            message={themeConfig.announcementBar.message}
            link={themeConfig.announcementBar.link}
          />
        )}

        {/* Header */}
        <Header
          lojaNome={lojaData.nome}
          links={themeConfig.header?.links ?? []}
        />

        <main className="flex-1">
          {/* Banner */}
          <Banner config={themeConfig.banner} />

          {/* Product Showcase */}
          <ProductShowcase
            title={themeConfig.productShowcase.title}
            products={
              themeConfig.productShowcase.products.length > 0
                ? themeConfig.productShowcase.products
                : catalog
            }
            layout={themeConfig.productShowcase.layout}
            columns={themeConfig.productShowcase.columns}
            themeConfig={themeConfig} // ✅ fix aplicado
          />

          {/* Text + Image Section */}
          <TextImageSection {...themeConfig.textImageSection} />

          {/* Newsletter */}
          {themeConfig.newsletter.enabled && (
            <Newsletter {...themeConfig.newsletter} />
          )}
        </main>

        {/* Footer */}
        <Footer {...themeConfig.footer} />
      </div>
    </ThemeProvider>
  );
}
