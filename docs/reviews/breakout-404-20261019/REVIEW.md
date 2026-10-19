# Breakout 404 — review record

Reference: [Abhisek Mishra](https://x.com/abhisek_im/status/2112015149569888373), [live 404](https://www.abhisekmishra.com/404). Actual live surface and video at 2/7/13/19 seconds inspected before editing. A quiet dotted field, six staggered navigation icons surrounded by eight hittable dots, black paddle, orange ball, pastel trail, per-destination hit counts, and a direct home link. The video shows relaunch after a miss. It does not show all targets cleared, so completion behavior is our explicit adaptation.

Baseline: `899d2848c27ba44ed27f8c0262dae7bbc168f13c`. `/breakout-404` previously redirected to the Button Playground; captured at 1440×1000 and 390×844. No existing breakout navigation page or prior motion to compare. No individual baseline for the new component routes.

## Pre-edit consistency map

- Playable board → actual rendered `page-loader?view=docs#breakout` (`peer-page-loader-breakout.png`) → reuse `src/components/page-loader/stage.tsx` GameStage, canvas token resolution, DPR scaling, timing clamp, focus/key plumbing and round-rectangle helper. Existing BreakoutLong is a 300×190 rectangular brick loader; the new navigation-target game needs separate collision/state logic and a responsive 600×340 board. Extend shared stage only with optional responsive sizing, coordinate mapping and blur callback; fixed-size loader defaults stay intact.
- Recovery → rendered Agent Queue error state (`peer-recovery-state.png`) → canonical AgentWorkspaceState for missing destination data or unavailable canvas. The 404 headline itself needs a minimal centered message/link composition, not a large error card over the game. Direct recovery never depends on playing/winning.
- Actions/icons → existing Button/IconButton and semantic Icon vocabulary, inherited neutral icon color; navigation target completion uses success color. No new icon library, font or raw theme palette.
- Loading → local deterministic game, no network data; no artificial loading state. Empty destinations render shared centered state. No fake async status.
- Scroll → sparse centered composition, document scroll on narrow screens, no content under a pinned game title. No unnecessary fade. Existing outer Oreo catalog navigation remains.
- Catalog → independent component Playgrounds, full composition under Templates. Existing demo/property inspector arrangement is reused; fixed-top catalog preference remains a shared-owner coverage gap outside this scoped feature.

Scope: three reusable components (BreakoutNavigator, DestinationProgress, RecoveryMessage) and a complete 404 template. Local game state only. Keyboard, pointer/touch coordinates, pause/restart, loss/relaunch, completion, reduced decorative motion, responsive/dark/light and source export will be verified. This task preserves unrelated work in the primary checkout.

Implementation review corrections: responsive GameStage coordinates map CSS size to logical field; new game uses a container query so its sidebar stacks in a narrow Playground even on a wide screen. Catalog destinations were checked against PAGE_META; Icons points to the existing Status Icon page. Empty and completion states are real controlled configurations, not hidden runtime test hooks.


## Verification and delivery scope

Source revision: `7c56bb11bccc99b02bde0587befb0112b61f73ff`. Final captures use the production build at `http://localhost:5192`, Chrome via Playwriter session 8, local fixtures, English, light/dark. Desktop 1440×1000, medium 900×1000, narrow 390×844; full-page captures can be taller. No signed-in account or backend. This is a reusable template route, not a replacement for the host's HTTP 404 routing.

TypeScript + Vite production build passed. Ten model tests passed (model-tests.txt). Reviewed collisions/substeps, pause/resume, retained progress after misses, stable destination identity, responsive pointer mapping, component ownership and all four route registrations. Browser checks covered launch, held arrow steering, mouse movement, Space/Escape pause and resume, focus-out pause, restart, misses, real one-target completion using public Playground props, empty destinations, generated JSX exports, docs, and the existing fixed-size Page Loader Breakout. Icons link navigated to `/status-icon`; the six destination URLs match existing catalog routes.

Touch was tested with desktop Chrome touch emulation at 390px: touch-start launched the round and movement positioned the paddle at approximately 70% of the scaled field. This is not physical-device evidence. Reduced-motion capture shows an actively moving ball without decorative trail; screenshots alone do not prove all motion behavior. There is no async loading state; no artificial spinner or network error was added. Empty destinations reuse AgentWorkspaceState. All navigation stays available before completion.

A final automation step initially timed out because its locator said “Launch” instead of the actual “Launch ball”. The corrected motion/capture run completed. Existing browser-extension session errors also occurred on baseline pages; no application error was identified. Native tab recording was blocked by missing extension activeTab permission. The fallback uses actual CDP screencast frames through the same Playwriter session, original timestamps retained. Original video is 1440×1000; review copy crops only the top 96px containing the automation toolbar (1440×904, 8.167 seconds). Frames and contact sheet were inspected: paddle moves, ball advances, pause holds position, resume continues. No source video frames were used to simulate implementation behavior.

Coverage gaps: individual component routes have no separate pre-change capture; before evidence records the actual missing template entry instead. No previous game motion existed. Physical mobile, canvas-context failure, screen-reader walkthrough and production deployment were not verified. Existing catalog fixed-top demo/scrolling-inspector design remains outside this task. Earlier initial/after captures are retained as the first review round; `final-*`, touch and reduced-motion captures supersede them where overlapping. No source edits followed the final source revision.

## Reference inspected before editing

reference-site.png

![reference-site.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/reference-site.png)

reference-video-13.png

![reference-video-13.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/reference-video-13.png)

## Desktop entry — before missing route / after complete template

before-wide.png

![before-wide.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/before-wide.png)

final-wide.png

![final-wide.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/final-wide.png)

## Narrow entry — same 390px fixture

before-narrow.png

![before-narrow.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/before-narrow.png)

final-narrow.png

![final-narrow.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/final-narrow.png)

## Shared Page Loader — before / after optional stage extension

peer-page-loader-breakout.png

![peer-page-loader-breakout.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/peer-page-loader-breakout.png)

peer-page-loader-after.png

![peer-page-loader-after.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/peer-page-loader-after.png)

## Responsive and theme states

after-wide-dark.png

![after-wide-dark.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/after-wide-dark.png)

after-narrow-dark.png

![after-narrow-dark.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/after-narrow-dark.png)

final-playground-narrow.png

![final-playground-narrow.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/final-playground-narrow.png)

## Recovery and completion states

miss-retains-progress.png

![miss-retains-progress.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/miss-retains-progress.png)

won-playground.png

![won-playground.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/won-playground.png)

empty-destinations.png

![empty-destinations.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/empty-destinations.png)

## Touch and reduced decorative motion

touch-narrow-paused.png

![touch-narrow-paused.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/touch-narrow-paused.png)

reduced-motion-playing.png

![reduced-motion-playing.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/reduced-motion-playing.png)

## Independent components and code export

playground-destination-progress.png

![playground-destination-progress.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/playground-destination-progress.png)

code-destination-progress.png

![code-destination-progress.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/code-destination-progress.png)

playground-recovery-message.png

![playground-recovery-message.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/playground-recovery-message.png)

code-recovery-message.png

![code-recovery-message.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/code-recovery-message.png)

## Documentation

docs-destination-progress.png

![docs-destination-progress.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/docs-destination-progress.png)

docs-recovery-message.png

![docs-recovery-message.png](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/docs-recovery-message.png)

## Actual interaction recording

![Launch, keyboard and pointer steering, pause and resume](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/interaction.mp4)

[Uncropped original](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/interaction-original.mp4) · [Timing record](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/interaction-timing.json)

![Inspected sampled frames](/Users/ziye/Documents/Project/Research/oreo-ui-breakout-404-20261019/docs/reviews/breakout-404-20261019/motion-contact-sheet.jpg)
