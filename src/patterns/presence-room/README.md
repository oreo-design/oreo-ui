# Presence Room

A complete local collaboration template inspired by [Elia's presence interaction](https://x.com/eliakuratli/status/2110376615595409417) and its public [Arc preview](https://uiarc.dev/components/presence-stack). No paid source was accessed. The document/discussion context is an Oreo composition, not a claim of real multiplayer synchronization.

- `PresenceStack`: controlled roster, stable IDs, bounded face count, +N overflow, mouse fan-out, name hint, Base UI people popover, optional member selection, join/leave announcements.
- `PresenceBadge`: online, away and typing. Accessible label, optional continuous opacity pulse, reduced-motion fallback.
- Existing `TypingPresence`: compatible single-person API, now optionally accepts multiple `people` and `animate`.
- Reuses Avatar, ChatBubble, CollaborationComposer, StepProgress, AgentWorkspaceState and Button. Sample portraits are existing repository assets.

The page provides editable session text, checklist progress, a local discussion with file-name attachments, explicit simulated joins/leaves/status changes, optional activity playback, empty-room recovery and connection failure/retry. Pausing the connection hides stale presence; sending fails without losing the composer draft. Reconnecting permits a retry. Nothing is sent to another person or saved across reloads.

For a real application, supply presence from your transport and replace local message handling. Use stable IDs; disconnect/expiry rules belong to the host. Selecting a person currently shows their activity details. Replace that callback with a meaningful app action.

The static `CollaboratorPresence` header in Project Chat remains unchanged: it summarizes fixed membership, while PresenceStack opens a changing live roster. Both use the canonical Avatar primitive. TypingPresence preserves its default appearance for existing Music Workspace consumers.
