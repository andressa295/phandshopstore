import type { ThemeConfig } from "./types";

export function resolveThemeConfig({
  dbConfig,
  themeConfig,
}: {
  dbConfig?: Partial<ThemeConfig>;
  themeConfig: ThemeConfig;
}): ThemeConfig {
  return {
    ...themeConfig,
    ...dbConfig,
    tokens: { ...themeConfig.tokens, ...dbConfig?.tokens },
    features: { ...themeConfig.features, ...dbConfig?.features },
    banner: { ...themeConfig.banner, ...dbConfig?.banner },
    mediaConstraints:
      dbConfig?.mediaConstraints ?? themeConfig.mediaConstraints,
  };
}
