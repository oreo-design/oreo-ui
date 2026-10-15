# Comment Thread and Comment Workspace

Reference: [Vas — comments, resolution and resolved threads](https://x.com/justvasi/status/2110388408061444136). The 11-second video shows a compact comment card: an open discussion, one reply marked as its resolution, collapsible intervening comments, and a resolved thread whose history remains accessible.

## Parts and routes

- `CommentItem`: avatar, author, supplied time, plain multiline text, badge and action slot.
- `CommentSummary`: deduplicated participant avatars, comment count and disclosure button.
- `CommentComposer`: text-only reply, pending state, duplicate-submit guard and retained-draft retry.
- `CommentThread`: controlled data; independent resolution and resolved state, contextual actions and collapsible history.
- `/comment-thread`: playground, examples, composition and typed API documentation.
- `/comment-workspace`: complete local template with three discussions, search, status filters, per-thread selection, reply, resolve/reopen and own-comment deletion with one-level Undo.

The first comment is the question. `resolutionId` identifies a reply and does not close the thread. The template reopens a resolved thread when a reply is submitted. State lives in memory and resets on reload; this is not a connected collaboration product. Changing the selected conversation remounts its component and discards an unsent draft. Copy uses the browser clipboard and reports permission failure without losing comment text.

## Product mapping

Use Oreo `Avatar`, `AvatarGroup`, `Button`, `IconButton`, `Icon`, `Menu` and `DocsPage`. Base UI owns menu keyboard behavior and dismissal. All surfaces, borders, text and resolution colors use existing semantic tokens; spacing/radius/type use the Tailwind scale. The status badge uses Oreo's mint foreground/background pair in both themes. The reference's portraits are represented by Oreo initials. No reference video assets are shipped.

The reference is a single card. The project workspace, filtering, light theme, mobile layout, Undo and request failure example are deliberate extensions. The 18rem desktop list and 48rem minimum workspace height are composition dimensions from the Tailwind scale, not new component tokens.

## Motion review

| Before | After | Why |
| --- | --- | --- |
| No thread family on baseline | 200ms height/opacity disclosure, shared `easeOut` | Short accordion exception preserves the question's position and folds intermediate history |
| Pointer-only reference | Keyboard disclosure changes immediately; reduced motion removes height movement | Respect repeated keyboard use and motion preferences |
| Portaled menu can escape docs theme | Thread menu inherits the nearest Oreo dark skin when opened | Consistent menu surface across standalone template and local docs theme |

Motion decision: approve for the bounded disclosure. Height is the accordion exception from the project's animation recipe; no practical transform substitute can reflow following content without scaling text. Buttons disable press scale in this family. Menus retain the shared anchored 150ms/100ms behavior and disable it for keyboard interaction.

## Verification

TypeScript and production build; real browser state transitions, resolve/reopen, history expansion, deletion/Undo, reply pending/success, failed reply/retry, search empty/recovery; desktop, tablet and narrow layouts in both themes. Local review index and original captures: `/Users/ziye/Documents/Project/Research/output/oreo-vasi-20261015/REVIEW.md`.

No previous comment-thread route existed at baseline `ae25227202641f5252ed199eb37692c0e9e61027`. Baseline captures record catalog/peer surfaces and the new URL's old Button-home fallback. They do not claim a pre-existing thread UI. Real-time collaboration, storage, production deployment, physical touch devices and screen-reader operation are not verified by these local captures.
