# Motion components integration — 2026-10-16

## Scope and provenance

Recovered IconReveal, WordRoller and LoadingSequence from the existing local working tree onto a clean branch based on main `f3dc4d58c5e369e5c07cc92d588c6026fccd5298` (Support Console, PR #64). The 13 component, documentation and preview files are unchanged from the previously reviewed implementations; [imported-source.json](imported-source.json) records their SHA-256 identities. Shared navigation, routes and playground registration were added to current main, not copied wholesale from the old branch.

Only additional behavior change: generated WordRoller JSX now exports `defaultValue` instead of an unhandled controlled `value`. This keeps copied examples selectable. No package, lockfile, global token or component API changes. Support Console remains the main-branch version. Grouped Tasks and the independent oreo-ui-avatar repository are outside this change. Original dirty worktree files were not edited, staged or reset.

Routes: `/icon-reveal`, `/word-roller`, `/loading-sequence`; append `?view=docs` for usage and API documentation.

## Validation

- `npm run build` passed: TypeScript plus production Vite build. Existing large-chunk advisory remains; no claim of bundle-size optimization. [Build output](build.txt).
- Existing playground tests passed, 7/7: `node --test src/docs/playground/schema.test.ts src/docs/playground/demo.test.ts`. [Output](playground-tests.txt).
- 25 current integration assertions passed. Current main integration checked with Playwriter headless Chrome, keyboard and programmatic form input only. No mouse, user browser or foreground UI used. [Interaction assertions](interaction-checks.json), [final browser log](final-browser.txt), [loading log](loading-browser.txt).
- IconReveal: focus reveals the full SVG mask; Escape returns to spotlight; controlled reveal works. Long text and visible focus captured.
- WordRoller: End, looping, typeahead, disabled keyboard behavior, finite boundary and empty state checked. Generated JSX uses `defaultValue` and omits host callbacks. [Export](word-roller-export.tsx).
- LoadingSequence: all four variants begin with inert content and unlock it on completion; paused CSS clock inspected; reduced motion finishes within the 1.5-second assertion window (CSS specifies 200ms). Current capture covers the full longest sequence. New pointer/touch and callback-count tests were not run in this integration; earlier matching-source evidence is identified below.
- All three API documentation routes and generated code views checked. No new runtime error in successful final checks. Early automation failures were a case-sensitive heading assumption and a navigation/snapshot race; corrected checks passed.
- Nine layout captures: 1440×1000 and 768×1024 light; 390×844 dark, for each route. `body` scroll width equals client width for all nine. [Layout metrics](layout-checks.json). These are browser viewports, not physical phone tests.
- Dependency reuse required local package symlinks with an isolated Vite temp directory. Initial pnpm status-check and symlink-cache attempts failed before final successful `npm run build`; no install or dependency edits were made in the original checkout.

## Visual evidence

All screenshots are actual application output. Before images show the same routes falling back to Button on the main baseline, because these routes did not exist. No equivalent before motion existed.

| Surface | Before | Current integration |
| --- | --- | --- |
| IconReveal | [Missing route](before/icon-reveal.png) | [Keyboard focus](after/icon-reveal-desktop-focus.png), [dark long text](after/icon-reveal-desktop-dark-long.png), [tablet](after/icon-reveal-tablet-light.png), [phone dark](after/icon-reveal-mobile-dark.png) |
| WordRoller | [Missing route](before/word-roller.png) | [Desktop](after/word-roller-desktop-light.png), [tablet](after/word-roller-tablet-light.png), [phone dark](after/word-roller-mobile-dark.png) |
| LoadingSequence | [Missing route](before/loading-sequence.png) | [Desktop](after/loading-sequence-desktop-light.png), [tablet](after/loading-sequence-tablet-light.png), [phone dark](after/loading-sequence-mobile-dark.png), [four-sequence motion](after/loading-motion.mp4) |
| Existing peer | [CutReveal](before/cut-reveal.png) | Existing component/API preserved |

The current motion clip is an approximately 9-second CDP frame capture of all four sequences, 1440×1000, light theme, normal motion. 263 real frames were encoded according to their timestamps at 30fps; duplicate frames are encoder output, not a performance benchmark. A one-second contact sheet was visually inspected for entrance, middle and completion. Originals remain in the local integration capture directory.

Historical recordings from October 13 use matching component sources and supplement, rather than replace, current integration checks: [IconReveal pointer motion](historical/icon-reveal.mp4), [WordRoller motion](historical/word-roller.mp4), [LoadingSequence](historical/loading-sequence.mp4). IconReveal's historical clip shortens idle gaps; do not use it to measure animation timing. Original review records and raw media remain in the local research output directories named `oreo-icon-reveal-20261013`, `oreo-word-roller-20261013` and `oreo-details-motion-20261013`.

## Consistency and motion review

| Lens | Evidence and conclusion |
| --- | --- |
| Component reuse | Existing DocsPage, ComponentPlayground, Icon adapter, cn helper and controls reused. New components remain independently importable. |
| State | Controlled/uncontrolled WordRoller, empty/disabled, IconReveal reveal/focus and finite LoadingSequence intro/complete states are represented. LoadingSequence is decorative; no fictitious network progress or retry state. |
| Interaction | Existing playground keyboard controls and export conventions preserved. WordRoller export compatibility corrected. Pointer/touch behavior preserved by identical source, not newly physically exercised. |
| Visual system | Existing text, background, radius and motion tokens used; decorative SVG/CSS geometry is local. Desktop, tablet and dark mobile captures inspected. No layout regression found in this focused coverage. |
| Information architecture | Sidebar, route metadata, API pages and playground registrations agree. LoadingSequence copy distinguishes presentation from data fetching. |
| Accessibility and responsive behavior | Focus, listbox semantics, inert content and reduced-motion completion checked. No horizontal body overflow in the nine captures. Screen reader and real device testing remain outside this pass. |

| Before | After | Why |
| --- | --- | --- |
| Main has none of these three routes | Matching local implementations plus current navigation/docs/playground | Recover reviewed work without merging unrelated old branch changes |
| WordRoller export would emit controlled value without callback | Emits initial defaultValue | Standalone copied code remains interactive |
| Existing local motion APIs and timings | Preserved | Integration should not redesign previously authored behavior |

Motion verdict: suitable for this scoped integration. IconReveal retains fast reveal and slower settle, WordRoller retains spring snapping and immediate keyboard changes, and LoadingSequence retains finite transform/opacity/clip-path choreography. Reduced-motion paths remain present. LoadingSequence has no Skip intro control; unlike CutReveal this is its existing API, and adding one is a separate product decision. Review opportunities, not newly established defects: assess decorative-text contrast at very small sizes, physical touch/wheel feel, and whether consuming products need a skip control or shorter wordmark intro.
