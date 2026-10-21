# Spectral glass · 2026-10-21

Source: https://x.com/aecyydesign/status/2112623654530138136?s=20 — Szymon / @aecyydesign.
Baseline: 8bd77d4 (fresh origin/main). Local fixture: localhost:5210, Chrome via Playwriter session 7, en-US, 1440×1000, site light theme initially. Separate task checkout preserves unrelated WIP.

## Grounding before editing

The author explicitly describes Three.js, a custom spectral path tracer on WebGPU, Intel AI denoising, blue-noise sampling, stable loops and procedural scratches/haze/smudges. Actual first clip: thick bevelled circular glass slabs on black, lavender/pink strip reflections, dark blue transmitting faces, subtle scratches. These are 3D objects, not blurred interface panels. Exact shader, spectrum model, denoiser port and lighting setup are unavailable; detailed reproduction choices remain inference.

| Target | Same-role peer | Owner and reuse | Difference |
| --- | --- | --- | --- |
| Decorative material | `/aurora-surface`, rendered before edit | AuroraSurface; existing Oreo tokens, docs and Playground shell | CSS edge glow cannot model volume refraction; create a dedicated 3D scene rather than modify AuroraSurface |
| Study template | `/aurora-faq`, source; Aurora Playground rendered | `useThemeMode`, Button, IconButton, Icon, ordinary document flow | Material studio needs an artwork viewport and optical controls |
| Property editor | Existing Aurora Surface Playground | registry/schema, global variation, docs primitives | Material color is artwork; shell remains theme-driven |

External reference is the supplied original video plus official Three.js MeshPhysicalMaterial documentation and transmission example. No additional visual pattern is needed for an optical-material study.

## New-route baseline

At the exact baseline, `/spectral-glass-studio` redirects to `/` (Button Playground). This records the actual attempted entry; there was no existing material page. It is not a same-role visual predecessor.

![Before: actual missing-route entry](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/before-studio-entry.png)

Closest rendered decorative-surface peer:

![Before: Aurora Surface peer](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/before-aurora-peer.png)

## Evidence and completion

Implementation is present. First production build and 11 existing Playground schema/configuration checks passed. Final capture and integration readback are being reconciled. Original reference captures and superseded visual iterations are retained beside this index.


## Implementation and source boundaries

Final source commit: `1091fbae3b0b46792328dc867f5cd5131aceb230`, based on `e4626b6`. Built-preview captures use `220adfb12511afb40968a033facd0a2925b3afa6` on `e96e27e`; a diff confirms the material component, studio and documentation blobs are identical in the final source commit. The later rebase preserves the independently added Motion Code routes and only combines additive imports/registry/reference entries. Earlier captures used the same task source before that rebase, on `8bd77d4`; media names and manifest preserve the distinction. New docs, component, studio and research are scoped to this checkout; original dirty `oreo-ui` is untouched.

The component uses Three.js RGB WebGL rasterization, closed bevelled discs with a shallow optical crown, physical transmission/dispersion, PMREM and procedural surface detail. A studio-background beauty buffer is composited through an object mask onto black. This does not model the source's spectral path tracing, inter-object multi-bounce transport, caustics, blue-noise integration or AI denoising. Reference lighting is richer; the real-time study is an explicit approximation and does not establish a visual match.

## Matched baseline and completed new view

The new route had no corresponding material UI before this addition. The actual route attempt at baseline reached Button Playground, shown above. The new complete fixture is below at the matching 1440 CSS px width and light theme. A full-page after capture is taller because the studio has real page content. No historical material page or before interaction is fabricated.

### After: complete material studio, light

![After: complete material studio, light](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-studio-light.png)

### After: dark theme and alternative composition

![After: material studio, dark](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-studio-dark.png)

![After: orbit composition, dark](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-orbit-dark.png)

### Narrow layouts

Before: no previous material page existed; missing-route baseline above.

![After: mobile light, 390 CSS px](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-mobile-light.png)

![After: mobile dark, 390 CSS px](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-mobile-dark.png)

### Reduced Motion

The first tablet attempt, `after-tablet-reduced-motion.png`, did not actually demonstrate the reduced-motion control state and is superseded. A live preference change revealed that the installed Motion hook snapshots the initial preference. The template now subscribes to the media query with useSyncExternalStore, matching the renderer's existing live listener.

![After: verified Reduced Motion at 768 CSS px](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-reduced-motion-verified.png)

### Failure and recovery

Before: no previous material renderer existed. This is a real context-loss exercise against the component via WEBGL_lose_context, followed by its real Retry preview action. It is not a mocked success or a server/authentication test.

![After: real context loss](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-error-context-loss.png)

![After: retry recovers the actual renderer](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-retry-recovered.png)

### Motion evidence

Before: no material animation existed on this route. The original four reference clips were played and inspected, but are not a before implementation recording.

![After: stack, orbit, single and pause; real page capture](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-interactions-clean.mp4)

The built-in recording start initially returned success without a deliverable and subsequently failed with Could not start page capture / Screencast is already active. The stale capture was stopped only on this task-owned page. Recovery used Playwriter's CDP session and Page.startScreencast: 132 actual JPEG frames, 1440×1000, approximately 10.77 seconds of source timestamps. The rendered MP4 is approximately 10.6 seconds. It preserves observed frame timing and ends with a 1.5s still hold. The clean derivative crops the top 16px containing the automation toolbar tab, yielding 1440×984; it does not crop the artwork or controls. `after-interactions.mp4` and the original JPEG archive remain alongside it. Raw JPEGs and the 96MB archive stay local in this durable task folder; the compact original/clean videos are tracked.

Selected source frames 0, 44, 88 and 131 were opened and inspected, including moving orbit geometry and the final paused single. This verifies visible movement and control feedback, not real-device frame-rate performance or a full 16-second seamless-loop measurement.

## Reference frames

![Reference: layered glass](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/reference-glass-01.png)

![Reference: diagonally distributed glass](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/reference-glass-03.png)

![Reference: single volume](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/reference-glass-04.png)

The second clip frame is preserved as `reference-glass-02.png`; its horizontal crop includes surrounding X content and is not used as a clean reference plate. Source author text was read in the real browser. The exact unpublished shaders and denoiser integration remain unavailable.

## Consistency and motion second pass

| Lens | Result | Evidence and owner |
| --- | --- | --- |
| Entry | checked | Real missing-route baseline; actual built Playground and Doc navigation exercised; App, site metadata, Sidebar and shared Playground remain canonical |
| Loading | checked | A held built scene-chunk request verifies fixed artwork geometry, with heading and property controls still visible. Released request restores the renderer; no fabricated progress |
| Empty | not applicable | Procedural artwork always has a bounded composition; no account data or empty collection |
| Actions | checked | Existing Button/IconButton variants, immediate selected state, native keyboard range; pause/resume, reset and retry exercised |
| Titled scrolling | checked | Normal document flow; no inner scroll beneath a fixed local title; mobile global navigation has an opaque boundary |
| Icons and color | checked | Existing neutral Icon theme action. Interface colors remain semantic tokens; artwork palette and black stage are intentionally theme-independent |

Motion review:

| Before | After | Why |
| --- | --- | --- |
| Initial-only Reduced Motion label | Live media subscription | Control state stays aligned with the renderer after an OS preference change |
| Uniform black or pale transmission in early iterations | Studio transmission buffer and object mask; darker strip-light layout | Preserve volume/light contrast while retaining the approximation boundary |

Verdict: approve scoped motion with the stated limits. Decorative/explanatory geometry is the purpose; UI controls stay immediate. Geometry transforms use a closed trigonometric pose, pauses retain phase, reduced/hidden/offscreen states stop scheduling, and the renderer caps its pixel ratio/frame cadence. No new CSS entrance animation, hover motion, or layout animation was introduced. Reused Button motion belongs to its existing owner.

## Checks and delivery

- Production builds passed, including the live-preference correction. Final additive-registry rebase has an additional typecheck; its result is recorded in the delivery readback.
- Existing Playground schema and configuration checks: 11 passed.
- Source diff checks passed; unrelated WIP is excluded.
- Application WebGL/shader errors were absent during successful captures. The source X page and development profile emitted unrelated extension provider errors (ethereum/solana/session), which are not reported as application failures.
- General mobile device/GPU performance, real iOS/Android hardware and production deployment are unverified.
- Delivery: [PR #121](https://github.com/oreo-design/oreo-ui/pull/121). Exact head, checks and merge/main readback are verified as the final delivery step, separately from this visual review.

## Historical iterations

`after-studio-initial.png`, `after-studio-light-v2.png`, `after-studio-light-v3.png`, `after-studio-environment.png`, `after-studio-crown.png`, and `after-studio-composite.png` are superseded material/lighting investigations. They are retained and were opened before correction. `after-component-playground.png` initially captured a blank development load and is not valid proof until a reviewed replacement is captured. Later evidence is added here, without relabeling these originals as successful final verification.


## Completed Playground, documentation and local loading evidence

The earlier `after-component-playground.png` blank page remains historical and is superseded by the built preview below. The docs captures show the real component contract, source link, usage, properties and recipe. Delayed-module captures intentionally hold the real renderer module; they do not replace it with a visual mock.

![After: built component Playground](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-component-playground-final.png)

![After: component documentation](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-component-docs-verified.png)

![After: local module loading, whole shell remains usable](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-loading-built-preview.png)

All available screenshots in this directory were opened and inspected. Retained near-duplicate docs/loading captures are historical, not additional coverage. `after-single-frosted-amber.png` predates the last capture recovery and is not used to assert final palette fidelity; final geometry/control evidence is the reviewed motion and static captures above. No screenshots establish measured physical optics or equivalence to the original spectral renders.
