# Theme coverage audit

Run the existing Vite dev server and open `/scripts/theme-audit/index.html?start=0&count=6`.
This development-only entry imports real Playground registry components. Each row
shows default Oreo and a spacious, rounded custom-accent version side by side.
It is not an application route and is not included in the production entry.

`Run theme checks` measures each custom specimen with density, radius and accent
changed independently, then restores the combined variation. Results are available
in `window.__themeAuditResults` for the interactive browser audit. Use `count=30`
for metrics batches. Each axis records changed computed declarations and examples;
zero changes are **not automatically failures or passes**. Some specimens are text,
artwork, intrinsic circles/capsules, semantic status or explicit data/brand palettes.
Focus checks do not force `:focus-visible`; verify keyboard focus and portaled
surfaces in the real Playground. Probing may activate component focus handlers.

Screenshots are 720px-wide specimen viewports with a 440px scroll area. They show
actual component markup, not complete long dashboards or every interaction state.
Use the real component route for full-size, dark, mobile, error and popup checks.

`node scripts/theme-audit/check.mjs` rejects bare pixel/rem spacing and corners in
component CSS. It is a source contract, not a substitute for visual review; complex
expressions, artwork geometry, inline SVG and utility classes require review too.
