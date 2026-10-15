# Meeting Planner

Reference: [Noman / @noman_huge](https://x.com/noman_huge/status/2110294792034996359), a static multi-select meeting category image featuring Hugeicons. This implementation uses Oreo's Icon abstraction, not downloaded source artwork or Hugeicons assets.

| Reference element | Reusable owner |
| --- | --- |
| Persistent category rows, leading checkboxes | `MenuCheckboxItem`, extending the existing Base UI Menu |
| Category entry, selected count, popup and editor action | `MultiSelectMenu` |
| Event details, attendee disclosure and flexibility | `MeetingCard`, `AttendeeCalendars` |
| Yes / No / Maybe | `MeetingResponse`, using Oreo Button |
| Suggested times and find more | `RescheduleSuggestions` |
| Agenda, editing, category management, delete/undo | `MeetingPlanner` composition |

Selection and meeting data are controlled by the consumer. The template uses local state; refresh resets fixtures. Start values are local ISO strings and durations are minutes. An application must provide timezone, availability, invitation, persistence and video-service integration. The sample explicitly labels illustrative availability and its disconnected Join action.

The composition uses the shared Button, IconButton, Icon, Avatar, AvatarGroup, Menu, DocumentEmpty and semantic theme tokens. Native dialogs follow the local workspace template's focus/escape pattern; the public catalog's Dialog primitive is still marked upcoming. Headings remain in document flow, while long category lists scroll inside the dialog. No asynchronous loading state is invented for synchronous fixture actions.

The static reference is light desktop only. Dark theme, responsive agenda, error/recovery and all interaction behavior are Oreo extensions. The full evidence matrix and known limits live in `docs/reviews/noman-20261015/REVIEW.md`.
