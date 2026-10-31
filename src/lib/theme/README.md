# Site theme ownership

`tokens.ts` defines the existing Oreo semantic colors, density and radius overrides for Oreo, Claude, OpenAI and ASCII interpretations. `store.ts` owns the persisted preference; `SiteThemeProvider` applies it to the document root once, including body portals. The v1 playground storage key and share-link format remain compatible. Pages must not mutate document theme styles or reset spacing/radius tokens.

Website controls edit `useSiteTheme` / `patchTheme`. Reusable templates use `useThemeMode(defaultDark)` so they join the site preference when hosted and keep an independent mode when copied into another app. Theme edits persist across navigation/reloads and synchronize between tabs; unavailable storage leaves the session functional with a recoverable error.

Preset, reset, mode and cross-tab changes share `transition.ts`: a 280ms transition of the actual element properties using the existing `--ease-out`. `SiteThemeProvider` temporarily enables `transition.css` before applying root tokens, then removes that scope after the transition. There are no document snapshots or whole-page crossfades. Controls, content and body portals interpolate the properties they use, including spacing and smooth corners; non-interpolable properties retain their browser behavior. `flushSync` commits React and tokens immediately and persistence does not wait for animation. Interrupted transitions continue from rendered values; superseded cleanup cannot end a newer transition. Initial rendering, reduced motion, hidden documents and continuous slider/color edits apply directly. The broad property transition is limited to this theme-change window, not permanent component interaction styling.

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
roles. Custom spacing, accent and corners still work. Illustrations have a dedicated display slot; functional controls do not gain
unrelated artwork just to signal a preset.

Legacy `material` preferences, saved comparisons and share links migrate to
`ascii`: old default radius 20 → 0, density 1.15 → 1 and purple accent → neutral;
other custom values remain. Newly saved/exported configurations use `ascii`.

### ASCII surface recipes (three-frame review)

The theme is not only palette/radius. `recipes.css` owns construction rails and
quiet 45° hatching, static 4px composer registration marks, card/dialog title
roles, technical copy, and the illustrated-paper slot. `ThemeIllustration.tsx`
keeps Figma 330:10859's three original SVG layers at intrinsic dimensions; those
assets are decorative artwork, not operation icons. Docs uses this display slot;
functional empty/error states retain their actual icon and action semantics.

Paper levels: warm page, white card/dialog, 80% white composer, pale cream
illustration with a 64px fade. Card/dialog shadows are 0/8/16 at 4% in light,
backdrop 19%; separators continue to use 0.5px border-default. Border and corner
marks are independent of the custom accent; status and data colors stay semantic.

Structural corners default to zero. Keycaps (4), model selectors (12) and media
(8) have semantic bases; a custom radius adds to these bases, so controls still
respond to the site slider. Non-ASCII presets resolve to their former radii.
Keycaps/selectors use the shared smooth-corner owner; circles/capsules remain
intrinsic. Registration marks disappear when the user rounds structural corners,
so square corner markers cannot float outside a rounded surface.

Inter is UI/prose; Source Serif 4 is page/card/dialog display; Geist Mono is
editing/model labels/keycaps and technical notice copy. Source Serif Pro in the
adjacent references is intentionally mapped to the already self-hosted Source
Serif 4 family. The 17px card heading maps to existing text-base (16px); the modal
24px heading maps to text-2xl. Intro/section headings remain in their existing
roles. Notice padding/gaps map to spacing 5/2/4; modal padding remains spacing 6.

All recipe switches reset at the token boundary, including nested exports under
an ASCII root. Exported component code requires Oreo's shared theme recipes and
surface CSS, just as the component requires its existing base tokens/utilities.
