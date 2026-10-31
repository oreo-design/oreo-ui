# Component playgrounds

`DocsPage` shows a playground for routes registered in `registry.tsx`. Other routes keep their existing page. `?view=docs` and section hashes open the documentation directly.

Each adapter uses `definePlayground(title, controls, render)` and renders the real library component. The inferred values are checked against its public props by TypeScript. Keep valid enum options and defaults alongside the adapter; do not infer props by parsing documentation prose or mutate demo DOM.

Controls support text, multiline text, booleans, enums, and bounded numbers. `group` creates an inspector section. Numbers can reference another property through `minFrom` / `maxFrom`; both the input and the stored value respect those bounds. Preview callbacks should update these same values so interactions and the inspector agree.

Register imported components in `componentModules` for JSX export. Export uses the actual preview element tree, includes its imports, and escapes user text. It omits callbacks and converts controlled `value` / `open` to initial values; consumers connect their own handlers. These are local fixtures, with no network-backed submission or persistence.

When a component ships from a different module, set its `source` (IconButton uses `button`). Keep layout wrappers in adapters when needed to contain floating components. Colors, surfaces, type, spacing and controls reuse Oreo tokens, Button, Icon and Switch.

Focused numeric checks: `node --test src/docs/playground/schema.test.ts`. Build: `pnpm build`.

Optional `spec.demo(reducedMotion)` supplies timestamped property patches and a total duration. Prompt Box's new sequence lives in `prompt-box.demo.ts`: Play demo runs once, Pause/Resume preserves elapsed time, Replay starts over, and Reset or manual property/preview interaction cancels playback. Code view and background tabs pause. An initial untouched demo starts automatically only without a shared configuration, restored session or configuration error. Reduced motion prevents automatic playback; explicit playback replaces typewriter ticks with one complete-text update. Returning to a tab does not override an explicit pause or manual takeover. Existing component transitions remain responsible for presentation. A demo never sends a real prompt or records microphone audio.

The earlier requested Prompt Box script could not be located in local source, worktrees, reachable/unreachable Git history, or related local conversation records; this sequence is newly authored, not a recovered version. Player checks: `node --test src/docs/playground/demo.test.ts src/docs/playground/schema.test.ts`.

## Playground shell (Figma 48:6)

The full-screen shell reuses the directory in `Sidebar`, registered component
adapters, `PropertyControl`, Oreo switches/buttons, Base UI tooltip/dialog focus
handling, and the existing `DemoPlayer`. The shell uses Mona Sans; component
previews retain Inter. Toolbar SVGs are original Figma exports, rendered through
masks so they inherit semantic icon colors. Hairline separators use
`--color-border-default` at 0.5px.

- Preview, Annotation and Code share the current controlled configuration.
- Annotation selects parts directly in the preview and measures actual DOM bounds and computed styles in the right sidebar. Button and Prompt Box
  have named anatomy; other components expose their root and arbitrary elements
  through Annotation. Portaled content outside the preview is not measured.
- Device controls choose Desktop or a live iPhone-style Mobile mockup. The
  screen is 375 CSS pixels wide, with at least 16px content insets on both sides;
  the 391×804 outer shell fits the available area by scaling as a unit. Its
  bezel, concentric smooth corners and island are physical mockup geometry,
  independent of theme radius/density. Screen colors and content still inherit
  the global theme. These dimensions have no product-token equivalent.
  This is a layout preview, not OS or browser-media-query emulation.
- Keep theme/playback controls outside the device. `PreviewStage` owns insets
  for every adapter and converts annotation bounds back to screen CSS pixels.
  Shared Menu popups inherit its optional `PortalContainerContext`, so model
  and permission menus scale with their triggers; explicit component portal
  hosts retain precedence and ordinary product menus keep their body portal.
- Compare offers independent interactive specimens. Apply copies the chosen
  values. Randomize stays inside the current schema; text remains locked by
  default. Unlocking text restores text fields to their component defaults.
- Up to 12 named presets per component are stored locally. Storage failures are
  surfaced without blocking the preview. Presets restore values and appearance.
- Share generates versioned configuration links, JSX and an agent prompt from
  the current adapter. External configurations are validated against the live
  schema. Clipboard failure provides selectable text. Shared text is part of
  the URL, so it must not contain secrets.
- Preview values survive a trip to Documentation in the current tab. Reloads
  start at defaults unless the URL contains a shared configuration.
- At narrow widths, the breadcrumb replaces the global mobile navigation bar;
  properties move into a keyboard-accessible dialog. Other site pages retain
  their existing navigation.

Focused state tests: `node --test src/docs/playground/{schema,demo,configuration}.test.ts`.
Visual implementation evidence continues in the existing task index at
`/Users/ziye/Documents/Project/Research/output/playground-figma-20261019/REVIEW.md`.

## Family usage rules

Component-family `rules.ts` files own pure-data guidance for independent properties, interaction/states, copy and composition. `docs/component-rules.ts` maps known route slugs to lazy data-only loaders. Docs and Agent sharing use the same text through `ComponentRules` / `formatComponentRules`; unknown families explicitly report missing dedicated rules. These modules must not import component renderers, fixtures, CSS or assets. Catalog metadata and export recipes refer to rule IDs instead of duplicating prose. Public component types own API facts; rules explain usage and host responsibilities rather than introducing another runtime schema.

The site is an internal source preview. Source references point to verified component modules; no published Oreo npm package or CLI is assumed. Follow imports for shared tokens, styles, component and external dependencies. Existing third-party dependency commands remain distinct from Oreo source instructions.
