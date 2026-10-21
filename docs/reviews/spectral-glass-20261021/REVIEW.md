# Spectral glass · 2026-10-21

**Latest: [Round 2 final built evidence](#round-2-final-built-evidence).** Round 1 below is retained history and was rejected for fidelity. Round 2 improves the optical construction; it does not establish exact equivalence to the source video.

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

## Round 2 — original-video fidelity correction (2026-10-21)

User rejects the first implementation's visual gap and asks to use the original video as the quality standard. Baseline is `93926a8` main; the retained 5235 built preview has the identical original material renderer. The preceding implementation is historical, not accepted fidelity. Before editing, re-inspected reference frames 01/03/04, original studio capture, the rendered studio and original rendered Aurora peer. The same reusable SpectralGlass owner serves the Playground and full studio; controls continue to use existing Oreo Button/IconButton/theme. No new shell pattern is needed.

Observed failures: the shared white vertical stripe comes from sampling the same screen-space studio background through all discs; edge depth is underlit, surface faces are too uniformly black/blue, and the animation barely changes the disc orientation. Target: broad lavender face reflections, sharply bounded pink/white strip highlights, bright rounded rims with darker interior layers, genuine transmitted silhouettes between discs, fine surface wear, and a full periodic turn. Replace the screen-space transmission/mask recipe with bounded ray transport through the actual closed disc volumes. Material/light parameters remain artwork values, not UI tokens. Preserve the one review index and all earlier media.

Round 2 baseline: `r2-before-desktop.png`; earlier original motion recording is retained, and the unchanged built preview remains available for matched recovery until the new build.


## Round 2 final built evidence

Source: `eeee854d1a5fd898116c5cb8c30a887c949f20ce`, based on `444f88792bd38701cf4cfb7cf1dd7f453d71259a`. Final captures use the production build at `http://localhost:5235/spectral-glass-studio?revision=eeee854`, Chrome / Playwriter session 8, en-US. These are real reusable-component fixtures, not production or device-hardware claims. Desktop viewport 1440×1000; mobile 390×844; tablet 768×1024. Full-page captures preserve content below the viewport. Static studio comparisons use Reduced Motion; motion recording uses no-preference.

The rejected baseline samples one studio-background stripe through every slab. The replacement traces front/back refraction and subsequent glass volumes, with Beer–Lambert absorption, Fresnel reflection, total internal reflection, three separately refracted color bands and six spatial studio lights. Rounded-cylinder geometry owns both intersections and normals. Thickness is now .42; brighter layered rims, broad face reflections and changing silhouettes are the intended visible corrections. Object-local scratches stay attached during movement. Four fixed samples, FXAA and a small reconstruction filter reduce thin-edge aliasing.

**Fidelity assessment:** materially closer in thickness, layered rim lighting, transmitted silhouettes and orientation changes. The reference still has finer spectral gradients, cleaner very thin edges and subtler scratches. This implementation is bounded RGB transport (16 boundary events); reflection branches sample studio lights directly. It is not the author's full spectral path tracer, microfacet integrator, caustic solver or AI denoiser. The original unpublished shader/light parameters are unknown. A successful build or integration is not evidence of exact visual equivalence.

### Original reference and current material

![Original supplied video frame](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/reference-glass-01.png)
![Current real component artwork, source eeee854](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-artwork.png)

### Desktop light — matched baseline and correction

![Before: rejected renderer, actual pre-edit capture](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-before-desktop.png)
![After: final built studio, same viewport and light theme](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-desktop.png)

### Desktop dark

![Before: original dark studio](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-studio-dark.png)
![After: final built dark studio](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-dark.png)

### Mobile light and dark

Historical before captures are from the original renderer at the same 390 CSS px width and matching themes. Their animation phases differ; they support layout and material comparison, not a pixel-matched pose claim. Final captures use Reduced Motion.

![Before: original mobile light](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-mobile-light.png)
![After: final built mobile light](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-mobile-light.png)
![Before: original mobile dark](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-mobile-dark.png)
![After: final built mobile dark](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-mobile-dark.png)

### Tablet and Reduced Motion

![Before: original verified Reduced Motion, 768 CSS px](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-reduced-motion-verified.png)
![After: final built Reduced Motion, 768 CSS px](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-tablet.png)

### Alternative compositions and material

![After: final built orbit](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-orbit.png)
![After: final built single](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-single.png)
![After: final built amber](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-amber.png)

### Context loss and recovery

The built renderer was actually lost through WEBGL_lose_context and recovered using its existing Retry preview action. No mocked success replaces the optical renderer.

![Before: original context-loss state](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-error-context-loss.png)
![After: final built context-loss state](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-error.png)
![Before: original retry recovery](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-retry-recovered.png)
![After: final built retry recovery](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-recovered.png)

### Motion comparison

![Before: original real-page stack, orbit, single and pause recording](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-interactions-clean.mp4)
![After: final built stack, orbit and single motion](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-motion.mp4)
![After: final built pause retains the current pose](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-paused.png)

Final recording: 740 original JPEG frames, source timestamp span 40.285 s; MP4 40.32 s, 1440×984. It preserves actual variable frame timing. Only the top 16 px automation-toolbar tab is cropped; originals remain 1440×1000 in `motion-originals/r2-final-loop/`, with timestamp manifest. Original frames 0/200/400/739 and paused still were inspected. The capture includes more than one 16-second single-object period; exact loop seam timing is not numerically measured. Capture frame rate is not a device-performance guarantee. Pause was clicked after the recording and is evidenced by the still and real control readback.

| Before | After | Why |
| --- | --- | --- |
| Shared screen-space stripe through every disc | Volume intersections and spatial lights | Reflection/transmission now respond to actual geometry |
| Underlit thin rim | Thick rounded edge with internal paths and absorption | Recover the reference's bright rim and dark internal layers |
| Small orientation variation | Periodic stack articulation; full single/orbit turn | Expose face, edge and rear optics instead of hiding the material |
| Roughness promised frosted glass | Sharp-to-soft reflection copy | The actual algorithm softens studio reflections; it is not a scattering integrator |

Motion verdict: acceptable as a scoped improvement; not source-quality certification. The 16-second decorative motion serves the material study. Controls update immediately; pause and live Reduced Motion are honored. Hidden/offscreen/paused states stop scheduling. 650,000 optical pixels, DPR 1.25 and 30 Hz scheduling are budgets, not guaranteed FPS. No entrance or layout motion was added.

### Reusable consumer and documentation

![Before: original component Playground](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-component-playground-final.png)
![After: final built reusable component Playground](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-playground.png)
![Before: original material recipe](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/after-component-docs-verified.png)
![After: final built corrected recipe and limits](/Users/ziye/Documents/Project/Research/oreo-ui-material-20261021/docs/reviews/spectral-glass-20261021/r2-built-docs.png)

### Consistency, validation and delivery

| Lens | Evidence / scope |
| --- | --- |
| Entry | Actual studio and Playground/Doc navigation checked; shared route/shell owners retained |
| Loading | Shared component loading owner unchanged; previous real held-module capture retained above. Round 2 ready/error/retry verified; no new delayed-module capture claimed |
| Empty | Not applicable to procedural artwork |
| Actions | Oreo Button/IconButton and native range controls retained; composition, palette, reset, pause and retry exercised |
| Titled scrolling | Full-page mobile/tablet captures show existing document flow and responsive stacking |
| Icons / colors | Shared theme icon and semantic shell tokens retained; black stage and optical palette intentionally theme-independent |

- Production build and typecheck passed on source eeee854; 12 existing Playground configuration/schema tests passed; diff whitespace check passed.
- Final built captures were opened and inspected. No THREE/shader/WebGL errors during normal rendering; intentional context loss is recorded separately. Browser extension-provider errors are excluded from application conclusions.
- Exact-source self-review covered shader bounds, settings normalization, light/material ownership, render-target cleanup, visibility/pause scheduling and both consumers. No independent reviewer is claimed.
- [PR #124](https://github.com/oreo-design/oreo-ui/pull/124) delivers this correction. Integration is verified independently by PR head/merge and remote-main source readback; it does not close the fidelity limitations above.
- Unverified: production deployment, physical mobile GPU performance, full spectral equivalence and exact loop-seam timing.

### Round 2 superseded captures

All `r2-trial-*`, `r2-single-trial.png`, `r2-after-*`, `r2-thickness-max.png` and `r2-loop.mp4` are retained intermediate work. `r2-trial-04.png` is a blank development load and invalid as UI evidence. Despite its historical filename, `r2-final-desktop.png` captured stale HMR/default .30 and is superseded. Only `r2-built-*` prove the final source .42 default. No historical original is overwritten. Raw frame directories are durable local evidence; compact videos and screenshots are tracked.
