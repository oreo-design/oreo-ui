# Landmark Stays review

## Reference and baseline
- Source: https://x.com/pitus_/status/2110709524504199488, Phil Pitus quoting Charlie J's hotel search demo. See source.json and reference-03s.png / reference-11s.png / reference-19s.png (inspected frames from the actual video).
- Baseline: 6cd2197ce4d1610e528ed9a3f36ab07ed6a68602. Task branch codex/landmark-stays-20261016.
- Local fixture environment: localhost:5255, Chromium via Playwriter session 10, English, light, 1440×1080. New route previously falls back to Button docs: before-entry.png. No hotel components existed, so there is no prior hotel detail/room state to capture.

## Pre-edit consistency map
| Category | Existing owner and observed peer | Decision / coverage |
|---|---|---|
| Entry | Place Explorer template, DocsPage / Sidebar / registry | Reuse template navigation, documentation/playground registration. Actual before-place-explorer.png and before-place-map.png inspected. |
| Maps / selection | PlaceMap + PlaceDetailCard; source and rendered peer | Extend marker content and landmark labels additively. Preserve default cafe markers, origin, route and palette; hotel cards are a distinct content role. |
| Loading | All fixture data is synchronous | No invented network loading. Components receive ready data; future remote hosts own loading/error. |
| Empty / recovery | AgentWorkspaceState used by PlaceMap and peer templates | Reuse for filtered/no-saved results, with clear filters action. |
| Action components | Button / IconButton / Chip / MapStylePicker | Reuse canonical controls, selected/disabled semantics and inherited icon colors. |
| Titled scroll surfaces | Existing horizontal ChipGroup and template result lists | Result strip has a visible heading and keyboard-focusable cards, no nested competing page scroll. |
| Icons / color | Icon and semantic palette; PlaceMap's five theme-aware palettes | Inherit icon colors; use semantic tokens. Original vector hotel artwork, not downloaded photos. |
| Modal | Existing Base UI Dialog consumers | Use managed focus, labelled title/description and theme-local portal. |

## Scope
Three hotel-specific pieces (Stay Price Label, Stay Result Card, Stay Selection Card), a complete Landmark Stays template, and optional PlaceMap slots. Reference hierarchy: price markers, landmark, linked detail card, result strip, quick filters. All hotel records and prices are fictional. Map is schematic; distances are illustrative straight-line values from the same coordinates. No booking, live inventory or walking navigation claims.

## Capture plan
Matching desktop entry, existing Place Map and Place Explorer, changelog; new normal/selected/empty/recovery, room detail and saved flow, mobile and dark, component playgrounds. Hover/selection is immediate (no added transition); inherited control motion uses existing primitives. Direct headless Playwriter cannot record extension tabCapture: continuous motion recording is an explicit coverage gap, not a delivery gate.

## Verification
- `node --test scripts/landmark-stays/model.test.mjs`: 4 passing tests (distance axes, intersecting filters and landmark change, saved/price ordering without mutation, exact subtotal and invalid night counts). See model-tests.txt.
- `npm run build`: passes TypeScript and Vite; existing bundle-size warning remains.
- Browser checks: mouse hover selects Rue Cler House; next changes to Maison Jardin; room subtotal £143 × 5 = £715; save / saved-only / JSON download / unsave-last / empty recovery; budget + 4-star intersection gives two results; unmatched query produces filtered empty then recovery; landmark change updates distances; price sort orders results; keyboard Enter selects The Seine Rooms; changing nights to three yields £624; Escape restores focus to View rooms (focus locator count 1).
- New component playground selection/save/pagination inspected; documentation API loads; no app errors observed in collected console output.
- Original Place Map / Place Explorer default views inspected before and after; default names, minutes, selected route, palette, toolbar and detail actions preserved. The SVG fills its percentage-coordinate scene, allowing the hotel template's taller mobile scene without marker drift.
- No new timed animation is introduced: hotel selection is immediate, tapScale=1 on template controls; existing Button/InlineQuickMenu motion remains canonical. Recording remains unavailable in direct headless mode.
- Production deployment is outside scope.

## Final evidence map
All screenshots are local fixture evidence, English. Desktop is 1440×1080 viewport (full-page captures may be taller); mobile is 390×844. Original captures are retained. PNGs were visually inspected.

| State | Before | After | Result |
|---|---|---|---|
| New template entry | [Missing-route fallback](before-entry.png) | [Complete template](after-entry.png) | New route with six sample stays and linked map/results. |
| Existing map playground | [Before](before-place-map.png) | [After](after-place-map.png) | Existing cafe labels/routes preserved. |
| Existing place template | [Before](before-place-explorer.png) | [After](after-place-explorer.png) | Same default layout and selection. |
| Empty shortlist | No hotel state existed | [Empty](after-empty.png) | Unsave last item retains focus on Saved; recovery restores all stays. |
| Filtered empty | No hotel state existed | [No results](after-filter-empty.png) | Search + combined filters and clear recovery checked. |
| Room / save | No hotel state existed | [Saved room](after-room-saved.png) | Correct subtotal and saved toggle. |
| Narrow viewport | No prior hotel page; desktop fallback baseline retained | [Light](after-mobile.png), [dark selected](after-mobile-dark.png), [dark room](after-mobile-room-dark.png) | Taller 1000/820 scene; compact prices prevent marker collisions; all actions reachable. |
| Component previews | No prior hotel components | [Price](after-price-playground.png), [result](after-result-playground.png), [selection](after-selection-playground.png) | Canonical docs layout and working property controls. |
| Changelog | [Before](before-changelog.png) | [After](after-changelog.png) | Entry links PR #83 and the new template. |
| Export | No prior hotel export | [Actual downloaded JSON](shortlist-export.json) | One saved Maison Jardin; five nights; GBP 715; 0.971 km. |

### Corrections and limits
- superseded-entry-01.png: initial View rooms icon incorrectly wrapped; corrected to the Button trailingIcon slot.
- superseded-mobile-01.png: initial short mobile scene crowded landmark and hotel pills; now taller with price-only markers.
- superseded-mobile-dark-01.png / superseded-mobile-room-dark-01.png: saturated illustration and unsettled theme transition; replaced by muted palette captures with finite animations completed.
- No live accommodation provider, geographic map, payment, reservation or real-account flow was exercised. No loading/network error is claimed for this synchronous local fixture. New component docs have no independent pre-existing equivalent; existing map peer and missing-route baseline are retained instead.
- Continuous interaction recording remains a gap: the available direct headless session lacks extension tabCapture. Interaction state checks and screenshots are not motion footage.

## Delivery revision
Implementation commit: c4f64db6a9d6b5e5c517f84822e3f8b41050aca5. Changelog delivery: [PR #83](https://github.com/oreo-design/oreo-ui/pull/83). See manifest.json for capture timestamps, sizes, SHA-256 hashes and final component-source hashes. Final exact-head review and remote merge verification are reported with delivery.
