# Site theme ownership

`tokens.ts` defines the existing Oreo semantic colors, density and radius overrides for Oreo, Claude, OpenAI and Material interpretations. `store.ts` owns the persisted preference; `SiteThemeProvider` applies it to the document root once, including body portals. The v1 playground storage key and share-link format remain compatible. Pages must not mutate document theme styles or reset spacing/radius tokens.

Website controls edit `useSiteTheme` / `patchTheme`. Reusable templates use `useThemeMode(defaultDark)` so they join the site preference when hosted and keep an independent mode when copied into another app. Theme edits persist across navigation/reloads and synchronize between tabs; unavailable storage leaves the session functional with a recoverable error.

Use `--spacing`, `--space-x*` and semantic radius tokens for UI geometry. Use background/text/border/accent tokens for surfaces and interaction; keep text hierarchy, semantic error/success colors, circular glyphs, data-series colors and brand artwork meaningful. Do not scale the root font size or SVG paths to implement density. Tailwind dimensions already consume the spacing scale. Viewport breakpoints, intrinsic media geometry and layout constraints are independent of UI spacing.

Explicit reference specimens (the Claude visual-remix comparison and Neutomni artwork) may keep their named reference palette inside the specimen. Their hosting page/navigation uses the global theme. They are not alternate website theme providers.

Validation: `node --experimental-strip-types --test src/lib/theme/store.test.ts`, `node scripts/theme-audit/site-contract.mjs`, plus the component token/icon guards and matched route/portal captures in the task review index.
