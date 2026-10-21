# Site theme ownership

`tokens.ts` defines the existing Oreo semantic colors, density and radius overrides for Oreo, Claude, OpenAI and ASCII interpretations. `store.ts` owns the persisted preference; `SiteThemeProvider` applies it to the document root once, including body portals. The v1 playground storage key and share-link format remain compatible. Pages must not mutate document theme styles or reset spacing/radius tokens.

Website controls edit `useSiteTheme` / `patchTheme`. Reusable templates use `useThemeMode(defaultDark)` so they join the site preference when hosted and keep an independent mode when copied into another app. Theme edits persist across navigation/reloads and synchronize between tabs; unavailable storage leaves the session functional with a recoverable error.

Preset, reset, mode and cross-tab changes share `transition.ts`: a 220ms document View Transition using the existing `--ease-out`. The new page fades over the opaque old snapshot, covering controls, content and body portals together, including changes in spacing and smooth corners. This is a whole-page crossfade, not per-element geometry interpolation. `flushSync` commits React and root tokens in the capture callback; persistence happens immediately, not at animation completion. Superseded callbacks cannot restore an older theme. Initial rendering, reduced motion, hidden documents, unsupported browsers and continuous slider/color edits apply directly. No component-wide `transition: all`, cloned DOM or extra animation dependency is needed.

Use `--spacing`, `--space-x*` and semantic radius tokens for UI geometry. Use background/text/border/accent tokens for surfaces and interaction; keep text hierarchy, semantic error/success colors, circular glyphs, data-series colors and brand artwork meaningful. Do not scale the root font size or SVG paths to implement density. Tailwind dimensions already consume the spacing scale. Viewport breakpoints, intrinsic media geometry and layout constraints are independent of UI spacing.

Explicit reference specimens (the Claude visual-remix comparison and Neutomni artwork) may keep their named reference palette inside the specimen. Their hosting page/navigation uses the global theme. They are not alternate website theme providers.

Validation: `node --experimental-strip-types --test src/lib/theme/store.test.ts`, `node scripts/theme-audit/site-contract.mjs`, plus the component token/icon guards and matched route/portal captures in the task review index.

### ASCII (Figma 330:10660)

Warm paper, neutral ink, fine existing border tokens and zero structural radius.
Inter remains the UI/prose face, Geist Mono is the editing/code face and Source
Serif 4 is the display-title face. These are role tokens, not a blanket mono font.
The serif/mono fonts are self-hosted; copied ASCII examples include their imports.
Dark is an Oreo interpretation because the supplied frame is light-only.
Semantic status colors, artwork, true circles and capsule controls retain their
roles. Custom spacing, accent and corners still work. No illustration or landing
page content is injected into other pages just to signal a preset.

Legacy `material` preferences, saved comparisons and share links migrate to
`ascii`: old default radius 20 → 0, density 1.15 → 1 and purple accent → neutral;
other custom values remain. Newly saved/exported configurations use `ascii`.
