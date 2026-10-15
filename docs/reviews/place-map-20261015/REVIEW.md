# Place Explorer — reference to Oreo UI

Reference: [pitus_ / Generative UI #1 — Map](https://x.com/pitus_/status/2110421626873643338). Inspected the 21.566-second public video at 2, 8, 14 and 20 seconds. `source.json` preserves metadata; `reference-*.png` preserve inspected frames. X itself returned 403, so its public video was viewed in a task-owned browser tab. No remote video was downloaded.

## Scope and revisions

- Baseline: `2dd797b01a6481ae64debb9907d1cc601d5b9802` (main).
- Branch: `codex/place-explorer-20261015`. Source hashes and capture environment are in [manifest.json](manifest.json); the final evidence commit identifies its parent source revision there.
- Local fixture preview: http://localhost:5222/place-explorer. Browser: Chromium through Playwriter session 55; English; local sample data; light and dark. Desktop 1440×1000, mobile 390×844, tablet 768×1024. Full-page captures preserve document height beyond the viewport.
- Primary dirty checkout and other tasks were left untouched. No production deployment or live navigation/service integration is claimed.

## Extracted building blocks

| Reference | Oreo implementation | Reused owner |
| --- | --- | --- |
| Park, lake, routes and place labels | `PlaceMap`: controlled semantic markers, immediate route selection, SVG artwork/toolbar/footer slots, shared empty state | Oreo semantic colors, radii and shadows; `AgentWorkspaceState` |
| Venue card and place carousel | `PlaceDetailCard`: rating, amenities, original vector thumbnail, stable previous/next/save/copy controls | `Button`, `IconButton`, `Icon` |
| Five-swatch expanding control | `MapStylePicker`: Meadow, Sage, Apricot, Paper, Midnight | `InlineQuickMenu` / Base UI keyboard, focus, portal and motion |
| Conversation plus generated map | Complete `PlaceExplorer` template: filters, keyword search, saved collection, route/detail synchronization and clipboard itinerary | `Message`, existing template header/theme conventions |

Original geography and venue illustration are reconstructed in SVG, not screenshot backgrounds or third-party map tiles. The reference's Send to iPhone becomes an actual clipboard action. Venues, walking times and routes are explicitly illustrative. Saved places reset on reload. No fake AI loading or delivery confirmation.

## Visual evidence

| Page / state | Before | After | Review |
| --- | --- | --- | --- |
| New template entry, light desktop | [Before](before-desktop.png) | [After](after-desktop.png) | Baseline route did not exist and resolved to the existing Button page; complete new page now shown. |
| Same new route, light mobile | [Before](before-mobile.png) | [After](after-mobile.png) | 390px layout: palette above map, card below map, wrapping filters and amenities. |
| Dark mobile / Northlight | No prior map equivalent | [After](after-mobile-dark.png) | Reduced-motion preference active; neutralized palette surfaces, visible selection and controls. |
| Dark tablet / Northlight | No prior map equivalent | [After](after-tablet.png) | 768px; card and route fit, controls do not cover markers. |
| Map playground | No prior module | [After](after-docs.png) | Existing documentation shell, properties, copy-source affordance. |
| Empty saved collection | No prior equivalent | [After](saved-empty.png) | Unsave last item; shared empty surface and Show all recovery. |
| Search no results / matching Wi-Fi | No prior equivalent | [Empty](search-empty.png), [Match](search-wifi.png) | No-result recovery and normalized amenity search. |
| Save and real clipboard copy | No prior equivalent | [After](after-copy.png) | Saved state and successful browser clipboard feedback. |
| Selection, menu, palette, pager, save/copy motion | No pre-change map interaction exists | [Recording](interaction.mp4), [original frames/timestamps](interaction-original.json.xz) | Actual UI actions; 1440×1000, 29.8-second MP4 encoded at 30fps from variable-rate browser frames. Encoding rate is not a performance claim. Contact sheet inspected. |
| Existing same-role menu | [Peer](peer-menu.png) | Picker in recording | Opened real Inline Quick Menu and used Escape; reused shared owner, no global consistency claim. |
| Website changelog entry | [Before top](changelog-before.png), [Before list](changelog-before-entry.png) | Pending final entry capture | Existing release-entry list receives this template. |

Superseded diagnostic originals are retained: `initial-desktop.png` (earlier bubble treatment), `initial-mobile.png` (palette overlapped a marker), `mobile-dark.png` (overbright inherited palette), `dark-corrected.png` (before final marker edge alignment). `style-menu.png` and `mobile-menu.png` capture transient opening frames; the recording is the settled interaction reference. Desktop/mobile final screenshots predate deletion of the route fade; their settled rendering is unchanged. The recording covers the final immediate route behavior.

## Consistency coverage

| Lens | Evidence / conclusion |
| --- | --- |
| Entry behavior | Template routes, docs and playground all use existing registry/sidebar ownership. Actual equivalent Inline Quick Menu opened and dismissed; template markers and pager tested. |
| Loading | Not applicable: all data and SVG artwork are synchronous local fixtures; no fabricated network/AI loading. |
| Empty / error / recovery | Map empty prop, saved-empty, unknown search, Show all recovery exercised. Clipboard success exercised; denied clipboard fallback reviewed in code but not runtime-induced. |
| Action components | Canonical Button/IconButton across filters, pagination, save/copy and search. Positioned map markers are semantic buttons because they select a location, with pressed state and visible focus. |
| Titled scrolling surfaces | Existing documentation shell; template uses document scrolling. Map clips only its scene; palette portal escapes clipping. Narrow-screen toolbar moved above scene after observing overlap. |
| Icon / color inheritance | Icons inherit control text; only geographic illustration and labeled swatches use palette accents. All colors map to Oreo variables; dark large surfaces mix accents with neutral backgrounds. SVG coordinates are intrinsic artwork geometry, not a new spacing/token system. |

## Focused validation

- TypeScript and Vite production build passed; existing bundle-size warning remains.
- `git diff --check` passed.
- Fresh template page collected zero `pageerror` events during final UI checks.
- All three place markers and wrapping pager synchronize route, title, amenities, description and count.
- Save → Saved filter → unsave last → empty → Show all checked. Focus moves to the stable Saved filter before the removed control disappears.
- Quiet corners (2), Fast Wi-Fi (1), All places (3); `cafe` matches accented café, `wifi` matches Wi-Fi; unknown term produces recoverable empty results. Search uses local keywords, not free-form AI reasoning.
- Actual clipboard write and success feedback verified. Clipboard denial branch remains an explicit coverage gap.
- Keyboard Enter on Next changes place immediately. Menu Enter/End/Enter selects Midnight; Escape closes the shared menu. Reduced-motion Northlight selection exercised; positional travel is removed.
- Three component playgrounds inspected; map empty switch and detail-card Next exercised; picker keyboard selection exercised.
- Available after media inspected at 1440, 768 and 390 widths. Desktop and mobile baseline captures match viewports/theme; new map-specific baseline states cannot exist on the baseline revision.

## Animation review

| Before | After | Why |
| --- | --- | --- |
| New route keyed fade, 160ms | Immediate polyline replacement | Route selection is direct state feedback; removes unnecessary pure fade and repeated-selection restart. |
| Potential keyboard detail animation | Keyboard intent sets `instant`, no reveal | Frequent keyboard selection stays immediate. |
| Standard detail reveal | 160ms shared `easeOut`, opacity + 4px transform only; reduced motion removes travel | Small occasional pointer selection cue without layout animation. Controls remain outside the keyed content to retain focus. |
| Potential custom palette motion | Existing InlineQuickMenu behavior reused | Shared trigger origin, keyboard intent and reduced-motion behavior remain canonical. |

**Verdict: Approve.** No remaining blocking motion findings after route simplification. No entrance spectacle, layout animation, fake camera movement or ungated hover animation. Distinct detail content replaces immediately without exit queues; rapid selections settle on the latest content. Browser recording documents behavior, not a frame-budget benchmark.

## Limits

Fixture evidence does not prove real geolocation, routing, phone delivery, persisted saved data or production deployment. Clipboard-denied fallback and screen-reader announcements were reviewed in source but not exercised with a denied permission or a screen reader. No prior map motion baseline is available because the page is new. These gaps do not block authorized source integration.
