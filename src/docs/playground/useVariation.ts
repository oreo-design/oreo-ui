import { useSyncExternalStore } from "react";
import { parseVariation, presetAppearance, defaultVariation, type ThemeAppearance } from "./variation";

const key = "oreo:playground:theme:v1";
let theme = presetAppearance("oreo");
let initialized = false;
let storageError = "";
let snapshot = { theme, storageError };
const listeners = new Set<() => void>();
function publish() { snapshot = { theme, storageError }; listeners.forEach(fn => fn()); }
function initialize() {
  if (initialized) return;
  initialized = true;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    const a = JSON.parse(raw) as ThemeAppearance;
    if (typeof a.dark !== "boolean" || !Number.isFinite(a.radius) || a.radius < 0 || a.radius > 999 || !["phosphor", "lucide"].includes(a.library)) throw new Error();
    theme = { dark: a.dark, radius: a.radius, library: a.library, variation: parseVariation(a.variation) };
    snapshot = { theme, storageError };
  } catch { storageError = "Saved theme could not be loaded. Using Oreo Default."; snapshot = { theme, storageError }; }
}
export function setTheme(next: ThemeAppearance) {
  theme = { ...next, variation: next.variation ?? { ...defaultVariation } };
  try { localStorage.setItem(key, JSON.stringify(theme)); storageError = ""; }
  catch { storageError = "Theme works for this session, but could not be saved. Retry or use Share to keep it."; }
  publish();
}
export function patchTheme(patch: Partial<ThemeAppearance>) { setTheme({ ...theme, ...patch }); }
export function useVariation() {
  initialize();
  return useSyncExternalStore(fn => { listeners.add(fn); return () => { listeners.delete(fn); }; }, () => snapshot);
}
