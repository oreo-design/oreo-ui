# Surface geometry and feedback

`surfaces.css`, imported once by `index.css`, owns the shared rules. Playground
and Settings consume it; do not recreate its feature detection or coefficients.

## Smooth corners

Use `oreo-squircle` and set `--squircle-radius` to an **unscaled existing radius
token**, e.g. `var(--radius-control)`. The existing Settings method is retained:
round fallback at scale 1; native `corner-shape: superellipse(1.5)` at scale 1.25.
This is a visual approximation of Figma 60% smoothing, not the exact Figma path.
True circles/capsules (switch tracks, thumbs, avatars) retain their round shape.

For nested controls use one parent-owned inset and radius, not independent
rounded utilities. In rendered coordinates:

- `outer = min(token * scale, width / 2, height / 2)`
- `inner = max(0px, outer - inset)`
- `inset` includes padding and any intervening border; use the actual DOM geometry.

Set `--squircle-rendered-radius` on each surface to the calculated value. This
explicit override is already compensated; **do not multiply it again**. Both
surfaces use the same shape. These corner extents are concentric; a superellipse
is not a mathematically exact parallel-offset curve. Clamping before subtraction
prevents a large theme radius from producing a too-round inner selection.

Playground `.pg-segment` / `.pg-tabs` share outer height and inset variables;
their width is constrained by their labeled controls and exceeds their height.
The More tools popover includes its 0.5px border in its inset. Radius zero stays
zero; density changes update both height and padding. Do not compensate the theme
tokens themselves. To inspect fallback locally set the root corner scale to 1
and shape to round; this is visual simulation, not a Safari certification.

## State layers

`oreo-state-layer` paints one translucent gradient over the existing base color
and below text/icons. Selection sets `background-color` independently. Hover sets
`--surface-feedback` to hover; press replaces that feedback with press. Neither
changes the base. Avoid `background` shorthand on consumers (it clears the layer).
Only use this class on surfaces without their own background image/state layer.
Button and IconButton already own equivalent `::after` layers in
`components/button/surface.ts`; do not stack a second one on them.

Semantic inverse surfaces may supply `--surface-hover` / `--surface-press` using
the existing inverse tokens. Disabled controls and disabled labeled inputs do not
receive feedback. Hover is gated by hover capability; no new animation or layout
movement is introduced. Focus rings stay outside the surface and are not clipped.

Verify rest, hover, press, selected+hover, selected+press, disabled, keyboard
focus, light/dark, radius zero/large and compact/spacious density. Scope:
Playground chrome is migrated; this does not claim every historical component or
reference template already follows the global rule.
