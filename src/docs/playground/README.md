# Component playgrounds

`DocsPage` shows a playground for routes registered in `registry.tsx`. Other routes keep their existing page. `?view=docs` and section hashes open the documentation directly.

Each adapter uses `definePlayground(title, controls, render)` and renders the real library component. The inferred values are checked against its public props by TypeScript. Keep valid enum options and defaults alongside the adapter; do not infer props by parsing documentation prose or mutate demo DOM.

Controls support text, multiline text, booleans, enums, and bounded numbers. `group` creates an inspector section. Numbers can reference another property through `minFrom` / `maxFrom`; both the input and the stored value respect those bounds. Preview callbacks should update these same values so interactions and the inspector agree.

Register imported components in `componentModules` for JSX export. Export uses the actual preview element tree, includes its imports, and escapes user text. It omits callbacks and converts controlled `value` / `open` to initial values; consumers connect their own handlers. These are local fixtures, with no network-backed submission or persistence.

When a component ships from a different module, set its `source` (IconButton uses `button`). Keep layout wrappers in adapters when needed to contain floating components. Colors, surfaces, type, spacing and controls reuse Oreo tokens, Button, Icon and Switch.

Focused numeric checks: `node --test src/docs/playground/schema.test.ts`. Build: `pnpm build`.

Optional `spec.demo(reducedMotion)` supplies timestamped property patches and a total duration. Prompt Box's new sequence lives in `prompt-box.demo.ts`: Play demo runs once, Pause/Resume preserves elapsed time, Replay starts over, and Reset or manual property/preview interaction cancels playback. Code view and background tabs pause. Playback is opt-in; reduced motion replaces typewriter ticks with one complete-text update. Existing component transitions remain responsible for presentation. A demo never sends a real prompt or records microphone audio.

The earlier requested Prompt Box script could not be located in local source, worktrees, reachable/unreachable Git history, or related local conversation records; this sequence is newly authored, not a recovered version. Player checks: `node --test src/docs/playground/demo.test.ts src/docs/playground/schema.test.ts`.
