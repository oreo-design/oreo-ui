import { useLayoutEffect, useMemo, type ReactNode } from "react";
import { SiteThemeModeContext, type ThemeMode } from "./useThemeMode";
import { siteThemeStore, themeStorageKey, useSiteTheme } from "./store";
import { variationTokens } from "./tokens";

/** The only website owner of document theme styles, including body portals. */
export function SiteThemeProvider({ children }: { children: ReactNode }) {
  const { theme } = useSiteTheme();
  useLayoutEffect(() => {
    const root = document.documentElement;
    const tokens = { ...variationTokens(theme), "color-scheme": theme.dark ? "dark" : "light" };
    const previous = Object.fromEntries(Object.keys(tokens).map(key => [key, root.style.getPropertyValue(key)]));
    const previousDark = root.classList.contains("theme-dark");
    root.dataset.siteTheme = theme.variation?.preset ?? "oreo";
    root.classList.toggle("theme-dark", theme.dark);
    Object.entries(tokens).forEach(([key, value]) => root.style.setProperty(key, value));
    return () => {
      delete root.dataset.siteTheme;
      root.classList.toggle("theme-dark", previousDark);
      Object.entries(previous).forEach(([key, value]) => value ? root.style.setProperty(key, value) : root.style.removeProperty(key));
    };
  }, [theme]);
  useLayoutEffect(() => {
    if (new URLSearchParams(window.location.search).has("dark")) siteThemeStore.patchTheme({ dark: true });
    const sync = (event: StorageEvent) => {
      if (event.key !== null && event.key !== themeStorageKey) return;
      try { if (event.storageArea === window.localStorage) siteThemeStore.refresh(); } catch { /* Session theme remains usable. */ }
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);
  const mode = useMemo<ThemeMode>(() => [theme.dark, next => {
    const current = siteThemeStore.getSnapshot().theme.dark;
    siteThemeStore.patchTheme({ dark: typeof next === "function" ? next(current) : next });
  }], [theme.dark]);
  return <SiteThemeModeContext.Provider value={mode}>{children}</SiteThemeModeContext.Provider>;
}
