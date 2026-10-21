import { useSyncExternalStore } from "react";
import { defaultVariation, parseVariation, presetAppearance, type ThemeAppearance } from "./tokens.ts";

// Keep the existing key so saved playground settings become the site preference.
export const themeStorageKey = "oreo:playground:theme:v1";
export function parseAppearance(raw: string | null): ThemeAppearance {
  if (!raw) return presetAppearance("oreo");
  const a = JSON.parse(raw) as ThemeAppearance;
  if (typeof a?.dark !== "boolean" || !Number.isFinite(a.radius) || a.radius < 0 || a.radius > 999)
    throw new Error("Unsupported theme");
  return { dark: a.dark, radius: a.radius, library: "lucide", variation: a.variation ? parseVariation(a.variation) : { ...defaultVariation } };
}
export function createThemeStore(storage: () => Pick<Storage, "getItem" | "setItem">) {
  let initialized = false;
  let snapshot = { theme: presetAppearance("oreo"), storageError: "" };
  const listeners = new Set<() => void>();
  const publish = () => listeners.forEach(fn => fn());
  function read() {
    try { snapshot = { theme: parseAppearance(storage().getItem(themeStorageKey)), storageError: "" }; }
    catch { snapshot = { theme: snapshot.theme, storageError: "Saved theme could not be loaded. Retry saving or reset the theme." }; }
  }
  const getSnapshot = () => { if (!initialized) { initialized = true; read(); } return snapshot; };
  const setTheme = (next: ThemeAppearance) => {
    const theme = parseAppearance(JSON.stringify(next));
    let storageError = "";
    try { storage().setItem(themeStorageKey, JSON.stringify(theme)); }
    catch { storageError = "Theme works for this session, but could not be saved. Retry or use Share to keep it."; }
    snapshot = { theme, storageError }; initialized = true; publish();
  };
  return { getSnapshot, setTheme,
    patchTheme: (patch: Partial<ThemeAppearance>) => setTheme({ ...getSnapshot().theme, ...patch }),
    refresh: () => { initialized = true; read(); publish(); },
    subscribe: (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; },
  };
}
export const siteThemeStore = createThemeStore(() => window.localStorage);
export const { setTheme, patchTheme } = siteThemeStore;
export function useSiteTheme() {
  return useSyncExternalStore(siteThemeStore.subscribe, siteThemeStore.getSnapshot, siteThemeStore.getSnapshot);
}
