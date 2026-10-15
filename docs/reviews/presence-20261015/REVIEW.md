# Presence Room — review index

Adds reusable PresenceStack and PresenceBadge, extends existing TypingPresence for optional multiple people, and composes them in a complete local Presence Room template. Website navigation, component playgrounds/API docs and Changelog include the addition. No paid Arc source was accessed; this is an independent implementation from its public behavior.

## Revisions and environment

- Baseline: `6d7f1597b76320a41591047b579826e57d60568f` (fresh origin/main, Changelog PR #44).
- Final source: `398a4a501e17f1b5554fdf4e8b7adaf0d4d40395`; feature implementation `a7eec67`.
- PR: https://github.com/oreo-design/oreo-ui/pull/45.
- Local preview: http://localhost:5217/presence-room. Managed Chromium via Playwriter session 45, English, local fixtures, no signed-in account or transport.
- Desktop 1440 × 1000; mobile 390 × 844; tablet 768 × 1024; 1024 × 900 breakpoint checked. Light/dark and reduced-motion checks. Mobile and desktop screenshots pair with the same missing-route fallback at baseline.
- Source: https://x.com/eliakuratli/status/2110376615595409417; public live reference https://uiarc.dev/components/presence-stack. Inspected overlapping faces, overflow, status marks, hover name and click roster. [Reference](reference.png), [hover](reference-hover.png), [roster](reference-roster.png).

## Scenario map

| Scenario | Before | After / evidence | Result |
| --- | --- | --- | --- |
| New template and desktop entry | [before-desktop](before-desktop.png), `/presence-room` fell back to Button | [desktop](final-desktop.png), [full page](final-desktop-full.png) | Complete brief, readiness checklist, discussion, stack and explicit demo controls |
| New mobile entry | [before-mobile](before-mobile.png), same missing route | [mobile](final-mobile.png), [complete mobile](final-mobile-full.png), [tablet](final-tablet.png) | Responsive single column, no horizontal overflow at 390/768/1024 |
| Presence roster | No interactive roster existed; static membership header in [peer before](peer-chat-before.png) | [roster](verified-roster.png), [keyboard](after-keyboard.png), [corrected mobile](mobile-roster-corrected.png) | All members and text statuses, selection details, Escape restores trigger focus. Enter and Space open; arrows inspect visual labels |
| Dark theme / nested portal | No Presence Room dark baseline | [dark](final-dark.png), [dark roster](final-dark-roster.png) | Existing tokens inherited through local portal host; no bright panel in dark page |
| Dynamic counts / overflow | No changing stack existed | [recording](interactions.mp4), playground checks | 5→6→5 in template, 5→7→3 in playground; max=1 with seven people yields +6 |
| Empty and recovery | No equivalent new-room state | [room empty](after-empty-room.png), [stack empty](after-empty-stack.png) | Clear guests keeps self; shared centered empty state adds a guest. Zero-member stack opens an explanatory list |
| Editing / readiness | New local fixture | Browser check: brief changed; completed checklist 2→3 | Own status briefly indicates typing; no persisted or remote save claimed |
| Discussion failure/recovery | Canonical CollaborationComposer already retains failed drafts | [offline failure](after-offline.png) | Pause connection hides presence; failed send keeps exact draft; reconnect/retry adds one local message and clears composer |
| Legacy single-person typing | [peer before](peer-chat-before.png), [API before](peer-api-before.png) | [peer after](peer-chat-after.png), [API after](peer-api-after.png) | Original appearance unchanged; new props opt in to multiple typers and dots. Template verified “Emma Wilson and Jules Park are typing…” |
| Component discovery/docs | New routes absent at baseline; exact separate route screenshots not taken | [stack playground](after-playground.png), [badge playground](badge-playground.png) | Registry/code export works. Both install/source hints map to `presence`; generated import verified. Badge online/away/typing accessible labels checked |
| Website changelog | [before](changelog-before.png) | [matched entry](changelog-after-entry.png), [new update](changelog-after.png) | Adds actual PR #45 and Presence Room link in same merge, bringing selected history to 8 entries |

## Consistency review

Compared actual Project Chat normal state before/after, its existing Avatar/AvatarGroup/static CollaboratorPresence/TypingPresence/CollaborationComposer, the real new room and component playgrounds. This is an Oreo Web comparison, not a cross-platform certification.

| Lens | Owner / peer | Result and evidence |
| --- | --- | --- |
| Entry behavior | Docs Sidebar/registry; Base UI Popover | Checked: native link routes, Enter/Space, Escape and focus restoration. Mobile focus initially caused page jump; popup itself is now initial focus, fixed positioning and collision padding keep it on screen |
| Loading | Static local template; CollaborationComposer pending state | No initial data request: content ready immediately. Send failure is real local promise rejection. No fake network spinner |
| Empty | AgentWorkspaceState; dense popover list | Checked: room empty centered with explanatory action; dense roster empty has contextual copy, since the surface itself is a small list |
| Actions | Button/IconButton; existing composer | Checked: shared variants, tapScale=1 for frequent controls, standard close control; demo controls labelled as simulation |
| Titled scrolling | Fixed roster header + separately scrolling list; discussion header outside transcript | Checked: bounded roster uses available viewport height and list overflow. Title remains opaque. Transcript scrolls independently; no decorative fade necessary |
| Icons / colour | Avatar/Icon/semantic tokens and `.theme-dark` | Checked: neutral operation icons; online/away/typing have text equivalents. Existing portrait assets reused. No reference brand colours copied |

Static CollaboratorPresence remains a fixed-membership summary; the new PresenceStack represents changing presence and opens a roster. That is a concrete interaction difference. TypingPresence remains the single canonical typing row; its default path remains static and visually matched.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No changing roster | 180ms transform/opacity, strong ease-out `[0.23,1,0.32,1]`, scale 0.95→1 | Short state changes, no animated width/left/layout; stable IDs permit reversal |
| Static typing row | Opt-in opacity-only dot pulse, 1s cycle | Continuous state indication is distinct from an entrance-duration budget; default legacy row has no added animation |
| Hover expansion | Mouse-only expansion, reserved width | No neighbouring header reflow; touch opens the list instead |
| Keyboard / reduced motion | Immediate avatar positions and static typing dots | No keyboard delay; CSS reduced-motion and Motion reduced-motion both checked |
| Popover opening | Immediate Base UI popup | Focus and information access take priority; no unnecessary entrance animation |

Decision: Approve. Inspected final media and reduced-motion computed styles (`animation-name: none` for all typing dots). Standard dot pulse is continuous informational motion; callers can disable it. No new dependency or animation system.

## Validation and limitations

- `npm run build`: TypeScript and Vite pass. Existing large-chunk warning remains. [Build output](build.txt).
- `git diff --check` passes. Fresh reload has no pageerror. Invalid icon name during implementation was fixed to the existing folder icon before final checks.
- Focus regression reproduced on mobile at scrollY=471 / popup top=-13. After correction: scrollY=0, popup top=458, height=355 within 844 viewport; Escape restores trigger focus.
- Browser checks: membership changes, max overflow, zero people, read-only roster, member action, checklist, editable brief, multi-typing, local send, failed send, retry, empty recovery, activity start/pause, badge labels, responsive widths, light/dark and reduced motion.
- Real-time collaboration, remote delivery, file upload, reload persistence, published package install and production deployment are not tested or implied. Demo messages and filenames stay in this tab. No screen-reader speech test or native mobile device test performed.
- Long custom-name and disconnected network integration cases are not exhaustively captured. IDs/max bounds and text wrapping were reviewed in source; host owns presence expiry and transport.

## Capture history and recording

All originals retained. `after-desktop-initial.png` is an invalid-icon/initial render capture; `after-desktop.png` and `after-hover.png` show the initial oversized logo, superseded by final desktop. `after-roster-initial.png` includes duplicate avatar/name announcement labels, fixed before verified-roster. `final-mobile-roster.png` exposes the focus-scroll bug and is superseded by **mobile-roster-corrected.png**. `after-playground.png` has the initial source-path hint, corrected to `src/components/presence/*` in final code and recording.

The final [interaction clip](interactions.mp4) is 1440 × 920, 30fps, 7.03s. It shows actual stack hover, count changes and roster opening in the real component playground. Trimmed from a longer capture and cropped 80px at the top to remove automation chrome; originals and timing are in [component-recording-originals.json.xz](component-recording-originals.json.xz). All 420 selected original frames are 1440 × 1000. Dimensions and contact sheet inspected. Reduced-motion behavior is verified through live styles; the clip does not claim complete reduced-motion coverage.

`interactions-partial.mp4` is a superseded first recording that changed viewport size during navigation; retain only as history, not complete acceptance proof. Its originals and timestamps are [recording-originals.json.xz](recording-originals.json.xz). New-page motion has no directly comparable baseline because no roster existed. Existing typing row has matched before/after stills because its motion remains unchanged.
