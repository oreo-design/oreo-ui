# Inline Quick Menu review

Source: [Nitish Khagwal — inline quick menu](https://x.com/nitishkmrk/status/2110258300495245505).
Baseline: `0a69d75d8ff1041ce1c682e0a875939793fd3cef`.

The new `/inline-quick-menu` route provides a live playground, code export and documentation. Before this addition the same URL normalized to the existing Button playground at `/`; there was no equivalent quick-menu component or before interaction to record.

## Implementation

- Base UI Menu provides horizontal roving focus, radio semantics, Escape/outside dismissal and focus return.
- Reuses Oreo Icon (Phosphor and Lucide), theme tokens, capsule radius, spacing and the shared documentation/playground shells. Adds the missing `lock` icon in both maps.
- A 44 px trigger opens a 52 px horizontal surface with a 12 px anchor gap and pointer. The selected choice updates the trigger and closes the menu.
- 240 ms opening transform, 180 ms opacity/blur, 140 ms exit, 200 ms chevron rotation, using `--ease-out`. Keyboard actions are immediate; reduced motion removes movement and blur, retaining a 100 ms fade.
- Custom options and controlled/uncontrolled state; the component makes no persistence or permission requests.

## Validation

TypeScript and production build passed. Playwriter interaction checks covered both selection directions, controlled playground state, uncontrolled custom options in docs, keyboard left/right and Enter, Escape/focus restoration, outside dismissal, disabled trigger, generated JSX using `defaultValue`, light/dark themes, 390 / 820 / 1440 px viewports, and reduced-motion styles. No task-component runtime errors were observed; the connected browser reports unrelated wallet-extension errors also present on the baseline.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No quick menu at this route | Trigger-anchored, interruptible CSS transitions | Shows the relationship between trigger and choices |
| Bottom-side reduced-motion specificity could retain translation | Side-qualified reduced-motion selector overrides both positions | No spatial motion after collision flipping |

Approve. The small 4 px blur is an intentional paint-cost exception to reproduce the supplied video; it is scoped to the small popup for 180 ms and removed under reduced motion. No layout properties animate, no looping timer runs, and hover effects are pointer-gated. Recorded rendered frames were inspected against the reference sequence.

## Evidence

The durable task-owned index is `artifacts/video-component-20261014/REVIEW.md` in the task checkout. It retains original source video and frame analysis, actual baseline screenshots, after screenshots, original timestamped browser frames and the encoded motion capture. Media stays outside Git under the existing `artifacts/` ignore rule. The browser tab-capture API required an extension click, so the motion recording uses Playwriter CDP rendered frames and their timestamps; a 60 fps output container does not imply a 60 fps performance measurement. No production deployment verification is claimed.
