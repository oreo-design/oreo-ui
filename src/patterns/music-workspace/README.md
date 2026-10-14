# Music Workspace

Reference: [Brad / @designflyio, Light mode](https://x.com/designflyio/status/2110182813714805096), two images viewed on 2026-10-14. The first shows the standalone collaboration panel; the second shows it over a cropped music project list. The full page header and unseen table columns, responsive layout, dark theme, empty states, and interactive behavior are independent extensions.

| Reference element | Reusable export | Existing Oreo pattern |
| --- | --- | --- |
| Overlapping portraits and online count | CollaboratorPresence | Avatar, AvatarGroup; initials in this fixture |
| Song pills with unread badges | ProjectChannels | Theme/palette tokens, native navigation buttons |
| Bordered incoming / muted outgoing messages | ChatBubble | Message, MessageContent |
| Play button, waveform, mix version, duration | AudioClip | IconButton, native audio and range input |
| Typing row | TypingPresence | Avatar, semantic status |
| Attachment, draft, send and privacy note | CollaborationComposer | IconButton, Icon; promise-based delivery |
| Rounded floating shell | ProjectChatPanel | Oreo borders, radii and panel shadow |
| Project list + chat | MusicWorkspace | All seven parts, searchable fixture table |

Copy `components/project-chat` together with the referenced Oreo imports, then optionally copy this pattern and `public/examples/music-workspace` for the demo. No new dependency is required.

Colors, radii and typography use existing tokens/classes. The panel width (24rem), desktop overlap offset (13rem) and maximum height (36rem) are template composition constraints, not new shared tokens. No new animation is introduced; frequent channel switching is immediate and button spring scale is 1. Mobile moves chat beneath the horizontally scrollable table below 768px.

The host application must provide real permissions, presence, unread counts, uploads, message persistence and delivery. `onSend` receives `{ text, files }` and may return a Promise; rejection preserves the draft and exposes retry feedback. The fixture stores filenames only and never uploads. All messages and drafts reset on reload. Audio pauses when its channel or panel is hidden. Close and minimize preserve state and restore keyboard focus to the launcher.

`AudioClip.seek` is `{seconds, request}`; change request to seek to the same position again. `active={false}` pauses playback. The visual waveform is illustrative, not decoded audio analysis. The locally generated 3:58 tone proves native playback/seek behavior only. Replace it with your own recording in a real application.
