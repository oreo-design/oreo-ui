# Glass Studio

`/spectral-glass-studio` composes the reusable `SpectralGlass` artwork with Oreo Button,
IconButton, Icon, shared site-theme state and native range inputs. All adjustments
are browser-local and reset on reload. `/spectral-glass` exposes the same component
in the standard Playground; `?view=docs` explains the API and material recipe.

- `components/spectral-glass/material.ts`: optical settings, artwork palette and bounds.
- `components/spectral-glass/scene.ts`: lazy Three.js lifecycle, transform matrices,
  HDR render targets, FXAA, restrained bloom and cyclic pose.
- `components/spectral-glass/optics.ts`: rounded-cylinder intersections, bounded
  refractive transport, absorption, three RGB bands and finite studio softboxes.
- `components/spectral-glass/index.tsx`: local loading and recoverable WebGL failure.
- `patterns/spectral-glass-studio`: composition and controlled property editor.

Round 2 replaces the original screen-space transmission/mask renderer. Rays now
cross the actual front/back surfaces, can encounter another disc, and follow total
internal reflection. Four fixed subpixel samples reduce rim aliasing. The optical
pass has a 650,000 pixel budget and a 30 fps scheduling cap, not a device FPS guarantee.

The original author uses WebGPU spectral path tracing and AI denoising. This is a
bounded WebGL RGB ray tracer (16 boundary events, three wavelength bands). Fresnel
reflection branches sample studio lights directly; they do not recursively trace
other glass. It does not reproduce full spectral integration, rough microfacet
scattering, caustics or AI denoising. Parameters are artistic, not measured samples.

A 16-second closed trigonometric pose loop stops when paused, offscreen, hidden or
Reduced Motion is enabled. The black artwork stage is intentionally theme-independent.
No pointer orbit gesture is implied; rotation uses the accessible View angle slider.

Reference: https://x.com/aecyydesign/status/2112623654530138136?s=20
Research: [spectral glass](../../../docs/references/records/2026-10-21-spectral-glass.md).
Evidence: [task review](../../../docs/reviews/spectral-glass-20261021/REVIEW.md).
