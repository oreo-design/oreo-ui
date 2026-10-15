# Calendar Sync

A local, frontend-only first-connection template inspired by [Alvish’s 14-second empty-state video](https://x.com/alvish/status/2110359771094368574).

## Video breakdown

| Reference moment | Reusable piece | Oreo implementation |
| --- | --- | --- |
| 0s: Google, plug and app cards above an empty calendar | `IntegrationStack` | Two replaceable identity slots around a status tile, overlapping 64px cards, Oreo surfaces and shadows |
| 0s: centered title, explanation and Connect action on a fading dotted field | `ConnectionState` | Controlled state, named region, live status, shared Button; neutral Oreo primary action replaces source green |
| ~4s: rotating progress sector and syncing copy | `IntegrationStack` + `ConnectionState` | Transform-only progress rotation, cancellation supplied by the host |
| ~8s: success check, side identities fade | `IntegrationStack` | Semantic success token; 160ms opacity and 240ms transform transitions |
| ~10s: Coming up / Earlier with dates, times, company marks and attendees | `MeetingGroup` + `MeetingRow` | Counts derive from the supplied array, shared AvatarGroup with overflow, native details disclosure |

The source is a cropped product flow, not a complete application shell. The header, documentation links, dark theme, narrow layout, cancellation, failure simulation and meeting notes are Oreo additions. The sample uses a simple blue G and Oreo’s mark rather than copying Operate branding. Names and notes are fictional fixture data; this does not connect to Google or read a real calendar.

## Routes and ownership

- `/connection-state`: anatomy, interactive demo, empty/error examples, composition and props.
- `/calendar-sync`: standalone template using the same components.
- `components/connection-state`: controlled presentation and typed meeting rows; no timers or I/O.
- `patterns/calendar-sync`: simulation, fixture data, theme control, focus restoration and timer cleanup.

The demonstration waits 2.8 seconds, shows success for 0.8 seconds, then reveals the meetings. Failure has a distinct retry state; retry clears the failure simulation. Cancel and Reset clear the pending timer. An integration host must derive these states from actual authorized requests and should retain existing meetings on refresh. Do not reuse this initial-connection state as a generic content loader.

## Design and motion

Use Oreo `Button`, `IconButton`, `Icon`, `AvatarGroup`, semantic colors, radius and shadow tokens. Do not fork the shared control surface. Illustration-only geometry (card overlap/tilt, radial dot spacing) is local because no equivalent product token exists. `ConnectionState` accepts arbitrary identity nodes and copy; the same pattern is used by docs and template.

State copy uses the shared `easeOut` curve over 160ms; the result enters with a 6px translation over 240ms. Reduced motion removes positional movement and rotation. Keyboard-triggered connection changes set `instant`, restore focus at cancellation/failure, and focus the result heading after completion. Meeting disclosures use native keyboard behavior without animated height.
