# Icon ownership

All website operation icons, exported Figma icons and brand/file symbols live in this directory. Consumers use `@/components/icon`; do not import an icon package, draw SVG paths, or use text characters as operation icons in page/component files.

- `playground-icon.tsx`: typed design-slot registry. Figma exports win in their exact slots; additional operations use Lucide with a consistent 1.5 stroke at 16px. There is no guessed fallback.
- `assets/figma/`: untouched exports from Oreo Website, with node IDs in `sources.json`. Preserve native width/height and geometry. CSS masks inherit the control's semantic foreground, including dark, selected and disabled states.
- `icon.tsx`, `names.ts`, `glyphs.lucide.ts`: reusable semantic vocabulary. Lucide is the default. Add meaningful names here rather than passing arbitrary glyphs around.
- `kit-glyphs.tsx`, `custom-glyphs.tsx`, `status-icon.tsx`: existing authored Figma symbols and animated status/cut glyph renderers. Shapes have a single shared owner. Their motion, semantic states and original geometry are preserved.
- `assets/brands/`, `assets/attachments/`: static identity/file artwork. These are assets, not a second operation icon library. `apple.svg` preserves the previously installed Phosphor Apple brand silhouette; the Lucide adapter no longer imports Phosphor.
- `glyphs.phosphor.ts` is an explicit downstream compatibility adapter, not used by the website. Old saved website configurations are normalized to Lucide while retaining theme values. The website no longer offers a conflicting icon-library chooser.

Dynamic charts, maps, wordmark illustrations, and data-driven SVG are not operation icons and remain with their owning visualization components. Keyboard shortcut characters represent actual keys, not substitute icons.

Run `node scripts/icon-audit/check.mjs` for asset provenance/dimensions and import-boundary checks. The dev-only `scripts/icon-audit/index.html` renders the real adapter and kit consumers; it is not a production route or a substitute for product screenshots.
