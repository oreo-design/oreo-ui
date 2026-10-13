# Review workspace

An Oreo UI template inspired by [@_heyrico’s reference](https://x.com/_heyrico/status/2109297236199006618).

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
| Sender, recipient, subject, message and actions | EmailDraft | Avatar, Button, Icon |
| Rail / queue / detail layout | ReviewWorkspaceShell | Above components via slots |

The reference’s right and bottom edges are cropped. Responsive behavior, complete email text, filter/sort menus, empty/error/recovery states and local draft state are extensions. The icon rail demonstrates the four sections backed by this fixture; it accepts arbitrary navigation items and brand/footer slots. The original illustration avatars and brand artwork are replaced with Oreo initials and simple marks. Colors map to Oreo semantic tokens (including teal success rather than the reference’s bright green); sizes use the existing spacing scale and card/control radii.

Drafts and model selections survive contact switches in memory and reset on reload. `onSend` only validates and displays a local completion message. No model endpoint or mail service is called. `.example` addresses are intentional fixture data. Host apps own persistence, permissions and actual sending.

Below 760px, `detailOpen` selects list or detail. The template includes a back control. At wider widths, the queue and detail scroll independently. Wrap in `.theme-dark` for dark surfaces; pass the same skin to any portaled menus.

Copy the primitives with their CSS, plus the existing Oreo Avatar, Button, Icon and `cn` dependencies and global tokens. The optional fixture additionally uses Menu. No new package dependencies.
