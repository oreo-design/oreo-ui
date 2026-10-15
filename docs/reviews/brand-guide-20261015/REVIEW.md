# Brand Guide review

Reference: https://x.com/sofianedesign/status/2110254882808807837. Four actual image URLs obtained from public post metadata after X returned 403. Browser-viewed images show brand rules, application gallery, adjustable type scale, and email-signature editor. Reference screenshots retained here. No external brand/artwork copied into the implementation.

Baseline: 619e9dbe2fea1ac857c5fc25c088bc6042acad71. New route /brand-guide currently falls back to Button; actual desktop 1440×1000 and mobile 390×844 baseline captured before edits. Chromium through Playwriter 45, localhost:5215, English. Existing ProjectSummary playground inspected as a component/documentation peer. New task-owned isolated checkout preserves unrelated work.

Inventory: BrandSwatch, TypeScale, EmailSignature, full BrandGuide with rules, logo downloads, colours, typography, voice, applications, signature editor, downloadable guide. Reuse Button/IconButton, Icon, Tag, OreoLogo, AgentWorkspaceState and token palette. Brand artefact previews use explicit stable sample colours, independent of chrome theme. New interactions are instant, no new motion timing. Post-change and six-lens review pending.

## Final implementation and source review

Implementation revision: `a4c65c8dca437d133befd59de313e5da722ba909`. Final route: `/brand-guide`; reusable components: `/brand-swatch`, `/type-scale`, `/email-signature`. All three have documentation and configurable playgrounds. No dependencies added. Brand specimen colours are intentional fixed values mapped to existing Oreo light tokens (Ink/bg-inverse, Paper/bg-base, Soft grey/bg-elevated, Iris/purple-text, Mint/mint-text). They do not invert with interface chrome. The email artefact uses Arial and inline styles for portability; the brand typography tool uses the existing Inter family. Computed type sizes are the purpose of the component and therefore are data-driven values.

The SVG originals use the existing OreoLogo path. The image reference's Cachet identity and artwork were not reused. Original example voice, layouts and sample contacts use Oreo Studio and example.com. Signature HTML escapes all supplied text and does not turn supplied values into URLs or executable markup. Local JSON export includes current signature details, as stated in the download row; there is no server upload.

## Before / after evidence

| Scenario | Before / peer | After | Verification |
| --- | --- | --- | --- |
| Desktop entry | [before-entry](before-entry.png), actual unknown-route Button fallback | [default entry](after-entry-default.png), [full guide](after-full-light.png), [dark](after-entry-dark.png) | New guide has no comparable prior brand page. Desktop 1440×1000. Full capture retains the edited QA fixture. |
| Mobile entry | [before-mobile](before-mobile.png), same missing route at 390×844 | [light](after-mobile-light.png), [dark rules](after-mobile-dark.png) | Mobile section picker replaces sidebar; two-column rules and swatches, single-column applications/signature. No horizontal main overflow observed. |
| Logo / palette | No previous equivalent | [entry with white logo](after-entry-final.png), [dark swatches](after-colours-dark.png) | Variant controls update specimen and SVG link. White SVG downloaded and verified. |
| Type scale | [initial collision](after-type.png), superseded | [corrected scale](after-type-v2.png), [tablet](after-tablet-type.png) | Base 18 / ratio 1.333 yields 56.83px Display. Original `.ts-row` collided with TreeStepper; renamed to `.oreo-type-scale-row`. [Existing peer final](peer-tree-stepper-final.png) inspected. |
| Search empty and recovery | No previous equivalent | [no results](after-no-results.png) | Canonical AgentWorkspaceState; Clear search restores eight sections. |
| Applications | Reference application image | [application layouts](after-applications.png) | Independent social/contact examples with existing mark and specimen colours. |
| Signature editing | Reference signature image | [light](after-signature-light-v2.png), [dark](after-signature-dark.png), [mobile](after-mobile-signature.png) | Edited Jordan Lee and phone appear in preview and downloaded HTML/JSON. UI state resets on reload. |
| Export portability | New flow | [standalone HTML render](export-signature-rendered.png) | Downloaded HTML rendered without app CSS. CSS and JSON type scale strings match. Actual downloaded [HTML](export-oreo-signature.html), [CSS](export-oreo-type-scale.css), [JSON](export-oreo-brand-guide.json), [SVG](export-oreo-white.svg) retained. |
| Component library | [existing ProjectSummary playground](peer-project-summary.png) | [swatch](after-swatch-playground.png), [type](after-type-playground.png), [signature](after-signature-playground.png) | Canonical DocsPage/playground shell reused; inspected in the running app. |

## Six-lens consistency pass

| Lens | Target and peer | Owner / rule | Result and evidence |
| --- | --- | --- | --- |
| Entry behavior | Template anchors, mobile picker, component routes | Existing template routing + native navigation controls | Checked: desktop sections scroll instantly; mobile picker reaches the same content. Selected navigation arrow is decorative and aria-hidden to keep stable names. |
| Loading | Local synchronous fixture and generated exports | No remote data dependency | Not applicable: no fake loading state added. Font uses repository asset. |
| Empty / failure | No matching sections, clipboard failures | AgentWorkspaceState and inline status/fallback text | Search empty/recovery checked. Clipboard rejected-write handler has selectable textarea, focus and dismiss; real denial capture remains unverified because this extension connection does not expose Browser.setPermission. No permission was changed. |
| Actions | Template / standalone playground / existing docs | Button, IconButton, native swatch and selects | Checked rendered components and focus rings. Copy/download actions are real; no decorative primary buttons. Clipboard write promises resolved and UI reported success, but external OS paste checks did not confirm contents, so no claim of cross-app paste verification. |
| Titled scrolling | Long guide, fixed sidebar/status | Document scroll; sticky opaque status; normal-flow headings | Checked at entry/type/signature/bottom and mobile/tablet. Heading content does not pass behind a translucent title. No unnecessary fade introduced. |
| Icons / colours | Existing Icon, Tag, OreoLogo; theme specimens | Neutral operation icons, semantic tokens; fixed artefact colours | Checked light/dark. Fixed white email preview and saturated brand swatches are intentional artefact exceptions, documented in the UI. |

This review compares actual Oreo surfaces and the supplied visual reference; it is not a claim of consistency across unrelated products.

## Motion / interaction review before commit

| Before | After | Why |
| --- | --- | --- |
| No brand-guide route | Instant section jump, type changes, signature editing and search | These are frequent reading/editing actions. No entrance animations or new timing constants. |
| Shared Button defaults can scale on press | Template uses `tapScale={1}` | Keyboard and frequent actions remain immediate. |
| Unscoped `.ts-row` during first iteration | Unique `.oreo-type-scale-row` selectors | Prevented type styling from affecting existing TreeStepper and its motion targets. |

**Approve.** No new movement, keyframes, transitions or layout-property animation. No motion values to tune; reduced-motion users get the same immediate interactions. Existing components' behavior remains owned by their canonical implementations.

[Interaction recording](interaction.mp4): scale adjustment, custom preview text, signature editing and client instructions. 1440×920, 3.87s, decoded frame inspected. CDP screencast on the Playwriter-managed page was used because the extension's native capture has an activeTab limitation in this session. Top 80px removed from the delivered clip to omit automation chrome; original 1440×1000 frames/timestamps/manifests preserved in [motion-originals.zip](motion-originals.zip). There is no comparable previous brand interaction to record.

## Checks and limits

- `npm run build` (TypeScript + Vite): passed, existing chunk-size advisory. [Build log](build.log).
- `git diff --check`: passed.
- Focused helper assertions passed: signature escapes markup and creates no user-provided link URLs; type scale normal/invalid bounds and exported numeric values agree.
- Actual downloads inspected: Jordan Lee and +1 555 0100 retained in HTML/JSON; 18px / 1.333 retained in CSS/JSON; white SVG uses the existing mark with white fill. Browser download.saveAs was unavailable for the extension-managed download; actual task-named files in Downloads were copied into this evidence directory.
- Browser interactions: logo variants, section search/recovery, type controls, live signature editing, mail-client help selection, theme switch, responsive navigation, downloads and clipboard success status exercised. Real mail-client paste/send is not tested. Clipboard-denial focus/dismiss is source-reviewed but not visually exercised. No external account or data mutation occurred.
- Final page reload had no React exception, but a resource 403 remains in browser logs (also present on earlier unrelated template previews). This is not a zero-network-errors claim.
- Physical touch devices, screen readers and an exhaustive icon-provider matrix were not tested. Desktop/tablet/mobile captures are browser fixtures, not production deployment proof.

Historical originals retained: `after-entry-light.png` is the initial failed render from an unsupported icon name (fixed to the existing arrow-down icon); `after-entry-light-v2.png` precedes the copy-icon alignment correction. `after-type.png` precedes the selector collision fix. `after-entry-clean.png` is actually the default signature section after browser scroll restoration, not an entry baseline. `interaction-fast-superseded.mp4` and `motion-fast-originals.zip` preserve the first too-fast recording. Use the final files linked in the table for review. Other v2 captures supersede v1 files where named. Baseline media was never overwritten.

Implementation / merge status is reported separately from these evidence limits. Missing media is not a delivery gate.
