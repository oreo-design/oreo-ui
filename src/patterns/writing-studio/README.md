# Writing Studio

Reference: [shawn. / @zzzzshawn — text toolbar concept](https://x.com/zzzzshawn/status/2110512054851526682). The reference is a static selection-toolbar image. This independently implemented template demonstrates **whole-block formatting**, not arbitrary rich-text ranges.

| Reference | Reusable owner |
| --- | --- |
| Spectrum sphere and dotted well | `ColorOrb`: original SVG illustration; a named, keyboard-accessible color menu replaces tiny sphere hit targets |
| Nine-cell action panel | `TextToolbar`: six controlled toggles plus optional link, mention and text-transform callbacks |
| Minus / size / plus | `FontSizeStepper`: bounded, disabled at limits |
| Alignment group | `TextAlignmentControl`: three mutually exclusive pressed buttons |
| Hand font selector | `FontFamilyPicker`: theme-scoped Base UI menu |
| Text rendering | `textFormatStyle` and exported typed color/font/format values |
| Editing context | `WritingStudio`: three selectable blocks, textarea editing, 60-entry undo history, redo, reversible reset, validated links, local text transforms and plain-text mentions |

Reuse includes Oreo Button, IconButton, Menu and both Icon adapters. New semantic glyph names have Phosphor and Lucide mappings. Ordinary icons inherit their control color. App colors use existing semantic tokens; the decorative sphere uses calculated HSL coordinates, not reference-image assets or product-state colors. Its curved geometry and shadow are illustration-specific. The 24px outer panel radius uses the Tailwind radius scale to reproduce the reference's larger shell; internal surfaces retain the existing 16px card token.

All edits remain in the current tab and reset on reload. Copy exports plain document text. Links accept only HTTP(S), open separately and never wrap the selectable block button. Mentions append plain text and send no notifications. Text actions are deterministic local transforms, not AI. Font size is expressed in pixels as a document attribute; system handwriting/serif/mono fonts vary across platforms. Inline-code styling temporarily overrides the selected font; turning it off restores that choice.

The toolbar is a labeled group with native Tab order rather than an ARIA toolbar with an incomplete roving-focus model. All controls have names; state toggles expose pressed state. Menus are immediate (`transition-none`) for frequent text editing. No new motion, sphere rotation or selection animation is introduced.

Use `/text-toolbar` for the playground and `/text-toolbar?view=docs` for composition/API guidance. Review evidence is in `docs/reviews/shawn-20261015/REVIEW.md`.
