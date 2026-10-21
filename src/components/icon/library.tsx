import * as React from "react";
import { phosphorGlyphs } from "./glyphs.phosphor";
import { lucideGlyphs } from "./glyphs.lucide";
import type { IconGlyph, IconLibrary, IconWeight } from "./types";
import type { IconName } from "./names";

/** Every library's glyph table, keyed by the shared Oreo vocabulary. */
export const ICON_GLYPHS: Record<IconLibrary, Record<IconName, IconGlyph>> = {
  phosphor: phosphorGlyphs,
  lucide: lucideGlyphs,
};

export const ICON_LIBRARIES = ["phosphor", "lucide"] as const;

/**
 * Weights each library can actually express.
 *
 * Phosphor ships six drawn weights. Lucide is stroke-only, so it gets the four
 * that map cleanly onto `strokeWidth`; `fill` and `duotone` have no honest
 * equivalent and are left off the menu rather than faked.
 */
export const ICON_WEIGHTS: Record<IconLibrary, readonly IconWeight[]> = {
  phosphor: ["regular", "bold", "fill", "duotone"],
  lucide: ["thin", "light", "regular", "bold"],
};

/**
 * Semantic weight → Lucide `strokeWidth`. `fill`/`duotone` can't be drawn with
 * a stroke, so they fall back to the heaviest outline instead of rendering a
 * blob — an open path like `check` filled with `currentColor` looks broken.
 */
export const LUCIDE_STROKE: Record<IconWeight, number> = {
  thin: 1,
  light: 1.5,
  regular: 2,
  bold: 2.5,
  fill: 2.5,
  duotone: 2.5,
};

const IconLibraryContext = React.createContext<IconLibrary>("lucide");

/**
 * Points every `<Icon name="…">` underneath it at a different icon set.
 *
 * ```tsx
 * <IconLibraryProvider library="lucide">
 *   <App />
 * </IconLibraryProvider>
 * ```
 *
 * Both glyph tables are imported eagerly so the switch can happen at runtime.
 * An app that only ever ships one set should instead drop the provider and
 * prune the other table from `ICON_GLYPHS`.
 */
export function IconLibraryProvider({
  library,
  children,
}: {
  library: IconLibrary;
  children: React.ReactNode;
}) {
  return <IconLibraryContext.Provider value={library}>{children}</IconLibraryContext.Provider>;
}

/** The icon set in effect here. Defaults to Lucide when no provider is set. */
export function useIconLibrary() {
  return React.useContext(IconLibraryContext);
}
