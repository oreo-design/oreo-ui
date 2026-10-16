# Dispatch Allocation

Reference: [Pratik / Savari allocation](https://x.com/maybepratikk/status/2110717643322015819).

- `RouteJobCard`: compact transport job identity, pickup/drop-off and load metadata; optional host action/drag handle.
- `AllocationTimeline`: fixed resource identities, hourly cells, compact allocated bars, drag overlay and collapsible unassigned tray. Controlled jobs; pure `assignJob` enforces timing, seat capacity, driver existence and overlap constraints. Never pass a filtered subset as the authoritative jobs collection.
- `/dispatch-allocation`: complete local template. Search and category filters, driver/vehicle identity, schedule date, pointer/touch drag, keyboard form alternative, unassign, dispatch review, one-step undo and full JSON export. Reload resets the demo. Dispatch changes local status only.

Routes `/route-job-card` and `/allocation-timeline` provide playgrounds, JSX export and API docs. This is a single-day 08:00–18:00 scheduler with integer-hour durations; multi-day journeys, travel buffers, shared vehicle constraints, driver shifts and live booking APIs are outside this fixture.

Reuses Button/IconButton, Icon, Avatar, AgentWorkspaceState, Base UI Dialog and the existing dnd-kit stack. The reference's layout and card-to-bar interaction are adapted to Oreo's neutral controls and semantic tokens. No external branding or background artwork is shipped.

Validation: `node scripts/dispatch-allocation/check.mjs`, `npm run build`. See [the review record](../../../docs/reviews/dispatch-allocation-20261016/REVIEW.md) for actual browser coverage and gaps.
