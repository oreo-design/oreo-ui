# Breakout 404

[Abhisek Mishra’s reference](https://x.com/abhisek_im/status/2112015149569888373) shows a dotted playfield, six navigation icons surrounded by eight targets, a paddle, orange ball, pastel trail and per-destination hit counts. The live page also retains a direct home link. Oreo maps those destinations to its own catalog and uses its own icons, tokens and controls.

Three independently registered components:

| Component | Atomic properties | Interaction / states | Copy | Layout |
| --- | --- | --- | --- | --- |
| BreakoutNavigator | destinations, goal, speed, trail, resetKey, onProgress | ready, playing, paused, won; pointer/touch/keyboard; miss preserves progress, restart clears it; empty input shows shared state | caller supplies destination labels; game hints/status English in source | responsive logical 600×340 field; side progress moves below at ≤760px viewport or ≤620px container width |
| DestinationProgress | destinations, hits, goal, compact | real links always available; unstarted/partial/complete counts; empty list explanation | labels caller-owned; accessible count wording English | vertical desktop list, optional two-column compact list, wrapping labels |
| RecoveryMessage | title, description, href, linkLabel, eyebrow, children | native direct link; no game dependency | all main copy configurable; empty eyebrow hides it | centered h1 and supporting sentence; use once at page-heading level |

Copy `src/components/breakout-navigation` plus the referenced Oreo Button, Icon, AgentWorkspaceState and `page-loader/stage.tsx` dependencies. No new package is needed. GameStage now has optional `responsive` and `onFocusLost` properties; existing fixed-size consumers keep their defaults. Pointer coordinates are converted to the logical field size. Completion stays local and never navigates automatically.

The template `/breakout-404` is a composed missing-page example, not a replacement for the site's global router or an HTTP status implementation. Hosts may route their own not-found paths to this composition. Links remain available without playing. State resets on reload or changed IDs/configuration; persistence is host-owned.

Use Space to launch/pause, Escape to pause, arrows/A/D to steer, or pointer/touch on the field. Moving focus outside the game or hiding the tab pauses; returning never auto-resumes. Reduced motion removes the decorative trail. Ball motion is essential to this optional, user-started game. No audio or automatic motion on entry.

Tests: `node --experimental-strip-types --test src/components/breakout-navigation/model.test.mjs`. [Reference, baseline and final evidence](../../../docs/reviews/breakout-404-20261019/REVIEW.md).
