import { useSyncExternalStore } from "react";
import { parseAppearanceVariation, presetAppearance, type ThemeAppearance } from "./tokens.ts";
import type { ThemeTransition } from "./transition.ts";

// Keep the existing key so saved playground settings become the site preference.
export const themeStorageKey = "oreo:playground:theme:v1";
export function parseAppearance(raw: string | null): ThemeAppearance {
  if (!raw) return presetAppearance("oreo");
  const a = JSON.parse(raw) as ThemeAppearance;
  if (typeof a?.dark !== "boolean" || !Number.isFinite(a.radius) || a.radius < 0 || a.radius > 999)
    throw new Error("Unsupported theme");
  const normalized = parseAppearanceVariation(a.radius, a.variation);
  return { dark: a.dark, radius: normalized.radius, library: "lucide", variation: normalized.variation };
}
export function createThemeStore(storage: () => Pick<Storage, "getItem" | "setItem">) {
  let initialized = false;
  let snapshot = { theme: presetAppearance("oreo"), storageError: "" };
  let requestedTheme = snapshot.theme;
  let transition: ThemeTransition | undefined;
  const listeners = new Set<() => void>();
  const publish = () => listeners.forEach(fn => fn());
  function read() {
    try { snapshot = { theme: parseAppearance(storage().getItem(themeStorageKey)), storageError: "" }; }
    catch { snapshot = { theme: snapshot.theme, storageError: "Saved theme could not be loaded. Retry saving or reset the theme." }; }
  }
  const getSnapshot = () => { if (!initialized) { initialized = true; read(); requestedTheme = snapshot.theme; } return snapshot; };
  function commitTheme(theme: ThemeAppearance, storageError: string, animate: boolean) {
    const changed = JSON.stringify(theme) !== JSON.stringify(getSnapshot().theme);
    requestedTheme = theme;
    const commit = () => { snapshot = { theme, storageError }; initialized = true; publish(); };
    if (transition && changed) transition.run(commit, animate);
    else commit();
  }
  const setTheme = (next: ThemeAppearance, animate = true) => {
    const theme = parseAppearance(JSON.stringify(next));
    let storageError = "";
    try { storage().setItem(themeStorageKey, JSON.stringify(theme)); }
    catch { storageError = "Theme works for this session, but could not be saved. Retry or use Share to keep it."; }
    commitTheme(theme, storageError, animate);
  };
  return { getSnapshot, setTheme,
    patchTheme: (patch: Partial<ThemeAppearance>) => {
      getSnapshot();
      const next = { ...requestedTheme, ...patch };
      // The control value commits immediately; every appearance edit can retarget
      // the rendered properties without queuing a page snapshot.
      setTheme(next);
    },
    refresh: () => {
      getSnapshot();
      try { commitTheme(parseAppearance(storage().getItem(themeStorageKey)), "", true); }
      catch { commitTheme(requestedTheme, "Saved theme could not be loaded. Retry saving or reset the theme.", false); }
    },
    installTransition: (next: ThemeTransition) => {
      transition?.dispose();
      transition = next;
      return () => { if (transition === next) { transition = undefined; next.dispose(); } };
    },
    subscribe: (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn); }; },
  };
}
export const siteThemeStore = createThemeStore(() => window.localStorage);
export const { setTheme, patchTheme } = siteThemeStore;
export function useSiteTheme() {
  return useSyncExternalStore(siteThemeStore.subscribe, siteThemeStore.getSnapshot, siteThemeStore.getSnapshot);
}
