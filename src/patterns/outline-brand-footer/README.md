# Outline Brand Footer

Reference: https://x.com/uiinspoo/status/2112107576234295718 — @creativestefan via uiinspoo. Actual clip: footer navigation above contour-node lowercase lettering; individual hover fill with a fading release. This template uses Oreo copy/links, Inter outline artwork and semantic accents.

## Independent properties

PathGlyph is a decorative vector primitive with glyph, active, nodes, accent, animated and release dimensions. OutlineWordmark composes glyphs with independent label, revealed and resetKey props. FooterLinkGroups accepts host-owned groups, navigation label and compact spacing. The page owns its light/dark theme and reset action; no application-wide routing or settings are changed.

## Interaction and states

Hover is temporary. Click/touch holds one letter; another selection replaces it. Keyboard focus is visible, Enter/Space toggles, arrows/Home/End navigate, Escape clears and blurs. Leaving the group clears. Revealed overrides temporary highlights. Reduced Motion makes transitions instant. No auto-play or content gate. Empty glyph data uses AgentWorkspaceState; empty link groups are omitted.

## Copy

Supply a spoken wordmark label and per-glyph labels matching custom vector artwork. Default glyph arrays are fixtures, not a universal text-to-path converter. Links are real local catalog routes. The original Oreo logo remains unchanged; the footer wordmark is an interactive specimen. The source site's financial/legal claims are not reused.

## Layout

Document flow. Brand/tagline left, grouped navigation right; metadata and proportional full-width lettering below. Narrow screens stack the top columns without clipping the artwork. SVG drawing coordinates are artwork geometry; all UI surfaces/spacing/type use Oreo tokens. Keep custom glyphs on the same baseline and height. Footer headings wrap; no sticky overlap/fade is necessary.

## Dependencies and evidence

Existing Inter outlines (SIL OFL retained in `FONT-LICENSE.txt`), OreoLogo, shared Button/IconButton/Icon, AgentWorkspaceState and theme tokens. No new runtime packages. Continuous evidence: `docs/reviews/logo-reveal-20261019/REVIEW.md`.
