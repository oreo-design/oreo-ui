# Glass Studio

`/spectral-glass-studio` composes the reusable `SpectralGlass` artwork with Oreo Button,
IconButton, Icon, shared site-theme state and native range inputs. All adjustments
are browser-local and reset on reload. `/spectral-glass` exposes the same component
in the standard Playground; `?view=docs` explains the API and material recipe.

- `components/spectral-glass/material.ts`: optical settings, artwork palette and bounds.
- `components/spectral-glass/scene.ts`: lazy Three.js renderer, lathed closed geometry,
  procedural studio environment, PMREM, deterministic surface texture and cyclic pose.
- `components/spectral-glass/index.tsx`: lifecycle, local loading and recoverable WebGL failure.
- `patterns/spectral-glass-studio`: composition and controlled property editor.

The reference author describes WebGPU spectral path tracing, blue noise and Intel AI
denoising. This implementation uses RGB WebGL rasterization with MeshPhysicalMaterial
and a studio transmission buffer composited through an object mask onto black. It does not simulate
multi-bounce interactions between glass objects, caustics, spectral transport or denoising.
The optical settings are artistic parameters, not measured physical sample properties.

A 16-second closed trigonometric pose loop stops when paused, offscreen, hidden or
Reduced Motion is enabled. The black artwork stage is intentionally theme-independent.
No pointer orbit gesture is implied; rotation uses the accessible View angle slider.

Reference: https://x.com/aecyydesign/status/2112623654530138136?s=20
Research: [spectral glass](../../../docs/references/records/2026-10-21-spectral-glass.md).
Evidence: [task review](../../../docs/reviews/spectral-glass-20261021/REVIEW.md).
