# Studio Inbox

Reference: [Brad / @designflyio](https://x.com/designflyio/status/2110486258640372119).

Three-column music collaboration inbox, composed from controlled `InboxNotification`, `InboxGroup`, and `InboxFilters`. Reuses Oreo Avatar, Button, Icon, AgentWorkspaceState and Project Chat's ChatBubble, AudioClip and CollaborationComposer.

- Search author, project or preview; combine type, project and unread filters.
- Open a notification to mark it read; mark all read; archive and undo the last archive.
- Discussions are retained per project, so replies and drafts survive selection changes. Hidden audio pauses.
- Sample audio is the existing Music Workspace fixture; timestamp seeks to 1:24.
- Approve a master locally, react to a preview, reply or attach local file names.
- Mobile swaps the list and detail; the Back action returns focus to the inbox heading.
- Default dark theme with a local light toggle. No added animation. No backend, uploads, live collaborators or persistent storage.

The original is a still image; interactions beyond the depicted state are template behavior. Source portraits are replaced with Oreo initials. Semantic tokens cover colors, radii and spacing; custom column proportions and viewport heights serve the split-pane layout. Scroll regions have opaque non-overlapping headers.
