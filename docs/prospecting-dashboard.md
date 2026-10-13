# Prospecting dashboard

An independent implementation of [M A L’s prospecting dashboard](https://x.com/malikyoloo/status/2109881557528068119), shared with a Keitoto link. The reference is one cropped desktop image, not an application recording. Its visible hierarchy informs this template; interactions, responsive behavior and dark mode are independent extensions. No source code or portrait assets were copied.

## Explore

- `/prospecting-components`: adjustable playground for metrics, scores, buying signals and the accent action.
- `/prospecting-components?view=docs`: all eight components, composition, API, empty/error/recovery examples.
- `/prospecting-dashboard`: complete local fixture.

## Component decomposition

| Export | Responsibility | Existing Oreo pattern reused |
| --- | --- | --- |
| `ProspectMetric` | Label, number, change, comparison and miniature chart | Text/status tokens and card radius |
| `MiniBarChart` | Data-normalized miniature columns; latest sample accented | Status and neutral tokens |
| `ScoreMeter` | Ten segments and exact accessible 0–100 value | Status palette |
| `BuyingSignal` | Six buying-signal categories with icon and text | Icon adapter and palette |
| `ProspectAction` | Gradient primary action with inset highlight | Button behavior, variants and disabled state |
| `ProspectPanel` | Inset panel, section identity and action slot | Card radius, elevation and Icon |
| `ProspectTable` | Semantic rows, save actions, score sorting and optional overflow menu | Avatar, IconButton and Base UI Menu |
| `ActivityTimeline` | Event, metadata and connecting line | Icon, border and surface tokens |

All colors derive from existing theme variables. Spacing uses the existing quarter-rem scale; card corners use `--radius-card-small` and `--radius-card-medium`. Standalone positive labels override the mint palette's dark foreground with the existing success token because palette foregrounds assume a filled palette surface.

## Template behavior

Seven- and thirty-day metrics are example summaries. Recommendations use a separate eight-person fixture. `View all` expands six rows to eight; search matches name, role, company and signal. Qualified means score >= 80, independently of the score meter's green threshold of 75 from the reference. Save is reversible, dismiss hides a record, and reset restores the fixture. Export downloads the currently visible rows, including saved state. Recent activity can narrow to replies and meetings. No network service, live AI scoring, CRM connection or outreach is implied. State resets on reload.

Metrics use four columns from 1280px, two from 640px and one below. Panels stack below 1280px. Tables scroll within their panel. The positioned scroll wrapper also contains the absolutely positioned screen-reader labels so they cannot widen the page on mobile.

Use native `select` for periods and Base UI Menu for overflow actions. All icon-only buttons have names. Scores expose meter values; table headers expose sort direction. Results and actions announce through a polite status region. No new animation is introduced; button press transforms are disabled for these frequent actions, and existing menu motion honors reduced-motion preference.
