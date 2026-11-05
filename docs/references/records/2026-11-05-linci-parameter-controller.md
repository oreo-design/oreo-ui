# linci — Parameter Controller

Source: https://x.com/lincidesign/status/2118152731642954107 · inspected 2026-11-05.

The post includes four 2400×2400 stills: a complete Tuner panel; a 2×2 numeric/color/power/select group; an XY controller; and a shadow layer editor. Author describes a general browser prototype tuning panel. No original source code or interaction recording was supplied; behavior below is Oreo implementation, not a claim about the author's hidden code.

User explicitly requested reference-first 1:1 reconstruction, then replacement of foundation values with the most appropriate existing Oreo tokens. Implemented as six controlled inputs plus panel/card/section compositions, four component entries and `/parameter-controller` template. Reference geometry is preserved; source success green/sky blue and 22px numeric type intentionally adopt existing teal/indigo/24px roles. Editable HEX data is retained.

Reuse: canonical semantic Icon in both libraries, IconButton, Base UI switch, smooth corners, focus/state layers, theme tokens and catalog/lazy-route ownership. Native selects suit this short fixed list; color-calendar's semantic preset picker does not replace arbitrary HEX. Rendered Budget Cap Control supplies the numeric peer comparison.

Single review owner (originals, baseline, raw-reference phase, token phase, responsive/state captures, recording, revision manifest):
`/Users/ziye/Documents/Project/Research/oreo-ui-evidence/parameter-controls-20261105/REVIEW.md`.

Evidence is durable outside the disposable LayerFS Store. That index is authoritative; this archive does not duplicate the UI checklist. Adoption: implemented in task branch, delivery metadata will be recorded in the index and PR.
