# Review workspace

An Oreo UI template inspired by [@_heyrico’s reference](https://x.com/_heyrico/status/2109659622114288121).

- Template: `/review-workspace`
- Interactive component documentation: `/review-components`
- Copyable primitives: `src/components/review-workspace`
- Example data and state: this directory

## Component map

| Reference area | Component | Existing Oreo parts |
| --- | --- | --- |
| Icon navigation, selected tile, dividers | WorkspaceRail | Icon, radius and surface tokens |
| Three colored segments | SignalStrength | Success, progress and palette tokens |
| Avatar / person / company / signal row | ContactRow | Avatar, SignalStrength |
| Sectioned contact list, filter and sort toolbar | ReviewQueue | ContactRow; Menu in the template |
| Suggested action card | FollowUpSummary | Icon, card and surface tokens |
| Sender, recipient, subject, message and attachment slot | EmailDraft | Avatar, EmailDraftToolbar, AttachmentBar in the template |
| Previous / next / dismiss | ReviewNavigation | IconButton, Button |
| Attachment / model / send | EmailDraftToolbar | IconButton, Button, Icon |
| Rail / queue / detail layout | ReviewWorkspaceShell | Above components via slots |

The complete reference shows the contact toolbar and the attachment / model / send footer. Responsive behavior, filter/sort menus, empty/error/recovery states and local draft state are extensions. The compact icon rail keeps four review sections backed by the fixture and links the other entries to real Oreo component/template pages; it accepts arbitrary navigation items and brand/footer slots. The original illustration avatars and brand artwork are replaced with Oreo initials and simple marks. At desktop size the rail is 48px, queue 320px, cards max 672px and address rows 40px; all use existing spacing-scale steps. Reference body copy is retained. The message grows with its content and available width so narrow layouts do not clip the sign-off. Sender/recipient brands and company-color slots preserve identity hierarchy. Colors map to Oreo semantic tokens (including teal success rather than the reference’s bright green); sizes use the existing spacing scale and card/control radii.

Drafts, selected attachment names and model selections survive contact switches in memory and reset on reload. Previous/next follows the filtered and sorted queue, disables at its boundaries, and does not wrap. Dismiss removes a contact only from this local queue; Restore dismissed restores the queue and clears its filters. Dismissed contacts retain their drafts. The native file picker stores names only, clears after selection so the same file can be selected again, and never reads or uploads file contents. Attachments use Oreo’s existing removable file chips. `onSend` only validates and displays a local completion message. No model endpoint or mail service is called. Displayed template addresses match the supplied reference; they are display-only fixture data. Host apps own persistence, permissions and actual sending.

Below 760px, `detailOpen` selects list or detail. The template includes a back control. At wider widths, the queue and detail scroll independently. Wrap in `.theme-dark` for dark surfaces; pass the same skin to any portaled menus.

Copy the primitives with their CSS, plus the existing Oreo Avatar, Button, Icon and `cn` dependencies and global tokens. The optional fixture additionally uses Menu and Attachment. No new package dependencies.
