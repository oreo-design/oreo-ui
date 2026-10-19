# Outline brand footer — review record

Reference: https://x.com/uiinspoo/status/2112107576234295718, curated by uiinspoo and credited to @creativestefan. Actual 10.966-second video inspected at 0, .7, 1.5, 2.5, 4, 6, 8 and 10 seconds before editing. The caption says logo animation; the observed scene is a dark footer, brand/tagline at left, two navigation groups at right, disclaimer/copyright above a large lowercase wordmark. Each letter has outlined contours and real-looking path nodes. Hover highlights one letter in yellow-green, then fades after leaving. There is no dropdown in the observed clip despite the caption's generic link text. Touch/keyboard behavior is an Oreo adaptation.

Baseline: c8f995763d0f2772f3d42d4bd50c42bd45d4b2f3. New `/outline-brand-footer` entry redirects to Button Playground; captured at 1440×1000 and 390×844. No previous wordmark interaction exists at this route. No per-component-route baseline.

## Pre-edit grounding

- Interactive footer wordmark → rendered `icon-reveal?view=docs#footer` and its actual IconReveal implementation. Reuse SVG scaling, semantic color tokens, focus/touch equivalence and Reduced Motion conventions. The existing radial mask reveals icon texture across the word; this reference requires independent vector letters with contour nodes and per-letter release fades, so a separate PathGlyph/OutlineWordmark owner is appropriate.
- Footer composition → existing IconRevealDocs footer (brand left, grouped links right, copyright and wordmark below). Extract reusable FooterLinkGroups for host-owned links; retain neutral inherited link/icon color and focus rings. Wider borderless composition is intentional to match the source footer, not a replacement for the contained docs example.
- Brand language → rendered BrandGuidePage, existing OreoLogo, Inter font, brand color specimens and content spacing. Keep actual Oreo logo unchanged. The oversized wordmark is a decorative interaction study using the project's existing Inter outlines, not a new official logo asset. Accent is a semantic selectable role rather than copied source neon.
- Actions → shared Button/IconButton for theme and reset; individual letters are native toggle buttons with visible focus and pressed state. No fake loading: all vector artwork is local. Empty glyph data uses the shared AgentWorkspaceState.
- Scroll → document flow, no pinned title overlapping content. Existing Playground inspector arrangement is reused; global fixed-preview preference remains a shared-owner gap outside this scoped addition.

Planned scope: PathGlyph, OutlineWordmark, FooterLinkGroups, complete Outline Brand Footer template, catalog playgrounds and four-part API/state/copy/layout documentation. No source-site brand assets or trading claims carried into the template.


## Implementation and verification

Final source: `1c03fe3d98b67e8bcaf45693594e0d5a7dbb96c2`. Three independent components and one complete template, with registered Playgrounds, real JSX exports and four-part component contracts. Existing shared components were not modified. Default Inter 350 outlines and their license are retained; custom art can supply its own viewBox/path/nodes. Source neon maps to the existing warm palette token; artwork coordinates and node geometry are deliberately not UI spacing values.

TypeScript and Vite production build passed. Focused browser validation covered temporary hover, exclusive held selection, clear/reset, focus-visible, arrows/End/Space/Escape, touch toggle on/off, optional six-letter artwork, empty artwork/recovery, revealed precedence, node visibility, animation disabled, reduced motion, actual navigation, grouped links/compact/empty input, documentation and code exports. No additional unit tests were added for this presentation-only interaction. The existing large bundle advisory remains. Exact source review covered state ownership, stable IDs, finite dimensions, preserved link semantics, CSS transition precedence, route registration, source export and source/asset licensing.

Browser: Chrome via Playwriter session 9, English local fixture, 1440×1000 / 900×1000 / 390×844, full-page captures may exceed viewport height. `final-*` media uses the production build at localhost:5193. Earlier dev captures remain as historical evidence; Vite's symlink allow-list blocked the local font URL, so these can use a fallback font. Final production assets include the actual font. Baseline production was recovered at localhost:5192: source `7c56bb11bccc99b02bde0587befb0112b61f73ff`, verified identical to baseline `c8f9957` for src, package.json and Vite configuration (difference is evidence documentation). `baseline-production-*` supersedes the earlier baseline screenshots for typography comparison. The missing footer route still reaches Button Playground. The after light view provides the matched light-theme comparison; dark is the template's deliberate default.

Review corrections: bounded the isolated glyph Playground width after its initial max-width was overridden by the existing catalog wrapper; tightened Reduced Motion selector precedence and verified both `transition-property:none` and `transition-duration:0s` in production. Replaced explanatory implementation copy in the product footer with brand copy. Automation initially used a button locator for a styled radio; corrected to its visible label, and all dependent scenarios completed.

Native video recording lacks the tab's activeTab permission. Real browser screencast frames were captured through the same Playwriter session, with original timestamps. Frames were staged in /tmp because the session filesystem scope was the original checkout, then retained in this task's evidence package. Original video: 1440×1000. Review copy: top 96px cropped to remove automation toolbar, 1440×904, 6.767 seconds. Original, timing data and sampled frames are preserved. Actual inspected frames show sequential hover, overlapping release fades, held selection, clear, keyboard focus and Escape release. No simulated implementation frames or downloaded source video were used as after evidence.

Limits: touch is desktop Chrome emulation, not a physical-device test. No screen-reader walkthrough or production deployment. No individual before screenshots for new component routes, and no prior motion exists on the missing template route. Global fixed-demo/scrolling-inspector redesign remains outside this addition. Decorative contour contrast intentionally follows the reference's low emphasis; actionable text, links and focus use normal semantic foregrounds. Source site's legal/trading content was not adopted.

## Six-lens consistency pass

| Lens | Target / peer / owner | Result and evidence |
| --- | --- | --- |
| Entry | IconReveal footer and independent catalog entries | Checked: real anchors, separate template section, actual Components/Documentation navigation; no gated entry. |
| Loading | Local SVG vs IconReveal's local artwork | Not applicable: no data request or loading phase; no artificial spinner. |
| Empty | Missing glyphs / AgentWorkspaceState | Checked: centered icon, title and explanation; returning nonempty glyphs restores interaction. Empty optional link groups are omitted. |
| Actions | Existing Button/IconButton and native glyph toggle controls | Checked: shared clear/theme actions, positional accessible names and aria-pressed, pointer/touch/keyboard states. Glyphs are artwork controls, not a new navigation-button style. |
| Titled scroll | IconReveal footer / document flow | Checked: no fixed overlay on footer; narrow page scrolls normally. Existing catalog global layout preference remains unverified/out of scope. |
| Icons/color | OreoLogo, neutral navigation, semantic palette | Checked: original logo untouched, neutral labels/icons, intentional decorative accent. Dark/light medium/narrow/wide captured. |

## Observed reference: resting and active letter

![reference-0.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/reference-0.png)

![reference-1-5.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/reference-1-5.png)

## Grounding: rendered product peers

![peer-icon-footer.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/peer-icon-footer.png)

![peer-brand-guide.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/peer-brand-guide.png)

## Wide entry: Before / After (light, 1440px)

![baseline-production-wide.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/baseline-production-wide.png)

![final-wide-light.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-wide-light.png)

## Narrow entry: Before / After (light, 390px)

![baseline-production-narrow.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/baseline-production-narrow.png)

![final-narrow-light.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-narrow-light.png)

## Template default dark / active letter

![final-wide-dark.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-wide-dark.png)

![final-hover.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-hover.png)

![final-narrow-dark.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-narrow-dark.png)

## Medium viewport themes

![final-medium-dark.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-medium-dark.png)

![final-medium-light.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-medium-light.png)

## Input and accessibility states

![keyboard-wide.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/keyboard-wide.png)

![touch-narrow.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/touch-narrow.png)

![final-reduced-motion.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-reduced-motion.png)

## Component states and corrected isolated glyph size

![final-path-glyph.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-path-glyph.png)

![final-empty-wordmark.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-empty-wordmark.png)

![final-studio.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-studio.png)

![final-studio-revealed.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/final-studio-revealed.png)

![compact-footer-links.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/compact-footer-links.png)

## Independent component Playgrounds and code

![playground-outline-wordmark.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/playground-outline-wordmark.png)

![code-outline-wordmark.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/code-outline-wordmark.png)

![code-path-glyph.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/code-path-glyph.png)

![playground-footer-link-groups.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/playground-footer-link-groups.png)

![code-footer-link-groups.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/code-footer-link-groups.png)

## Four-part documentation

![docs-outline-wordmark.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/docs-outline-wordmark.png)

![docs-path-glyph.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/docs-path-glyph.png)

![docs-footer-link-groups.png](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/docs-footer-link-groups.png)

## Actual motion

![Hover, release, hold, clear and keyboard focus](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/interaction.mp4)

[Original uncropped video](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/interaction-original.mp4) · [Frame timestamps](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/interaction-timing.json)

![Inspected motion samples](/Users/ziye/Documents/Project/Research/oreo-ui-logo-reveal-20261019/docs/reviews/logo-reveal-20261019/motion-contact-sheet.jpg)
