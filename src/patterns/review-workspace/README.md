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
| Three colored segments | SignalStrength | Existing green / blue / yellow tokens |
| Avatar / person / company / signal row | ContactRow | Avatar, SignalStrength |
| Sectioned contact list, filter and sort toolbar | ReviewQueue | ContactRow; Menu in the template |
| Suggested action card | FollowUpSummary | Icon, card and surface tokens |
| Sender, recipient, subject, message and attachment slot | EmailDraft | Avatar, EmailDraftToolbar, AttachmentBar in the template |
| Previous / next / dismiss | ReviewNavigation | IconButton, Button |
| Attachment / model / send | EmailDraftToolbar | IconButton, Button, Icon |
| Rail / queue / detail layout | ReviewWorkspaceShell | Above components via slots |

The reference is measured at a 1440 × 900 product frame (the supplied JPEG is 3×). Desktop uses a 48px rail, 320px queue, an inset panel, 680px cards, and 40px address rows. The 680px width and 3px row gap follow the measured reference because Oreo has no matching component-width/row-gap token; other spacing and radii use its existing scale. Surfaces, text and focus colors use Oreo semantic tokens. Mentions use the existing Tailwind blue-500 token for the reference blue and dark-mode contrast. Signal colors use existing Tailwind green-600, blue-500 and yellow-400 tokens to retain the reference’s green/blue/yellow meaning. The detail surface blends the existing base/elevated tokens without introducing a raw color.

The fixture now uses avatar and company artwork cropped from the supplied reference, with exact source rectangles and attribution in `assets/source.json`. These images are fixture data passed through existing `Avatar.src` and brand slots; consumers should supply their own assets. Reusable components do not embed the reference image or contact artwork. The model mark is also replaceable with `modelMark`. Library icons and the global Inter typography remain Oreo equivalents. The theme switch lives in the gallery header so it does not add an extra item to the reference rail.

The editable message keeps a plain-text controlled value while rendering original paragraph spacing and presentational @mentions. It uses native plaintext-only editing, preserves the caret while typing, serializes actual line nodes to avoid duplicate blank lines on paste, and rebuilds presentation on blur or external value changes. It grows with its content on narrow layouts. No rich HTML is stored or accepted. Suggested action copy, subject, addresses, body, signature and model label follow the supplied reference. Responsive behavior, filter/sort menus, empty/error/recovery states and local draft state are extensions.

Drafts, selected attachment names and model selections survive contact switches in memory and reset on reload. Previous/next follows the filtered and sorted queue, disables at its boundaries, and does not wrap. Dismiss removes a contact only from this local queue; Restore dismissed restores the queue and clears its filters. Dismissed contacts retain their drafts. The native file picker stores names only, clears after selection so the same file can be selected again, and never reads or uploads file contents. Attachments use Oreo’s existing removable file chips. `onSend` only validates and displays a local completion message. No model endpoint or mail service is called. Displayed template addresses match the supplied reference; they are display-only fixture data. Host apps own persistence, permissions and actual sending.

Below 760px, `detailOpen` selects list or detail. The template includes a back control. At wider widths, the queue and detail scroll independently. Wrap in `.theme-dark` for dark surfaces; pass the same skin to any portaled menus.

Copy the primitives with their CSS, plus the existing Oreo Avatar, Button, Icon and `cn` dependencies and global tokens. The optional fixture additionally uses Menu and Attachment. No new package dependencies.
