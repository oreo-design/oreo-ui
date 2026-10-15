# Canvas Studio

Reference: [rico — navigation](https://x.com/_heyrico/status/2110408550845702320). The supplied static image shows a compact navigation bar and pan/select/organize hover states. The template is an original local idea board that makes those controls operable.

| Source element         | Reusable owner      | Template behavior                                                             |
| ---------------------- | ------------------- | ----------------------------------------------------------------------------- |
| Zoom percentage + menu | `CanvasZoomMenu`    | Center-preserving 10–200% zoom, presets and fit                               |
| Hand / cursor          | `CanvasModeControl` | Pointer-captured pan or block selection; pressed state and hover/focus labels |
| Full navigation        | `CanvasToolbar`     | Typed host callbacks, disabled when unavailable                               |
| Add                    | `CanvasAddMenu`     | Create note, task or HTTP(S) link                                             |
| Board content          | `CanvasBlock`       | Type/title/detail preview; host owns coordinates and editing                  |
| Organize               | Toolbar callback    | Deterministic 3-column grid; undo restores positions                          |
| Ask AI                 | Toolbar callback    | Explicitly labeled local suggestion, no network request                       |
| Information            | Toolbar callback    | Keyboard help and local-data limits                                           |

Reuses Oreo Button, IconButton, Menu, Icon and `AgentWorkspaceState` (centered empty/error owner). Both icon adapters include hand, columns and info. All UI colors use semantic tokens; `text-on-accent` is a new stable light foreground for saturated selected controls because `text-on-inverse` changes with the theme. The reference blue maps to `status-progress`, not an arbitrary copied blue. Spacing and radii follow the existing Tailwind scale and card/control tokens. Spatial coordinates and zoom percentages are document/viewport data, not application UI tokens.

The template has five seeded blocks and a 12-block limit. All content stays in memory. Undo retains the last 40 block mutations, including layout/reset/removal; pan/zoom and selection do not add history entries. Reset is reversible. Links reject non-HTTP(S) protocols. Every block is accessible through the normal-size list beneath the zoomed canvas, including content outside the viewport. Dialogs restore focus or fall back to the canvas after the source control is removed. Mobile users can pan in Drag mode and use the list to edit at a comfortable size.

Keyboard shortcuts only act while the canvas itself is focused: arrows pan; +/− zoom; Home fits; H/V select Drag/Cursor. Native Tab order is retained for the toolbar group. Menus and hover labels open without added movement. Pan is a direct functional transform with pointer capture and cancellation; it adds no inertia or decorative spring. The template uses the existing reduced-motion convention.

No persistence, collaboration, file upload, AI generation or node connection engine is claimed. Original reference and before/after evidence: `docs/reviews/rico-20261015/REVIEW.md`.
