# Oreo UI

A small, copy-paste React component library that reproduces the **Oreo UI** design language on a modern headless stack. Built as a design-system reference: own the source, theme via tokens, animate with springs.

**[Live demo →](https://oreo-ui-preview.vercel.app)**

## Stack

| Layer | Choice |
| --- | --- |
| Behavior / a11y | [Base UI](https://base-ui.com) (`useRender` for polymorphism) |
| Styling | Tailwind CSS v4 + [tailwind-variants](https://www.tailwind-variants.org) (`tv`) |
| Class merging | `clsx` + `tailwind-merge` (`cn`) |
| Motion | [Motion](https://motion.dev) springs (`bounce` / `duration`) |
| Theming | Design tokens as CSS variables (light + dark) |

## What's inside

- **Connection State + Calendar Sync** — a reusable integration stack, controlled empty/sync/success/error states, grouped meeting disclosures and a complete first-connection template. [Composition and source breakdown](src/patterns/calendar-sync/README.md).

- **Button** — `primary` / `secondary` / `tertiary` variants, `danger` flag, leading/trailing icons, Material-style state-layer hover/press, and a tunable Motion spring on press.
- **Icon Button** — square, icon-only action sharing Button's surface, with a `shape` switch (capsule / rounded square) and an optional `floating` elevation.
- **Chip** — compact, tappable suggestion pill with leading icon, four states (default / hover / selected / disabled), a Motion press spring, and a scrollable `ChipGroup`.
- **Tag** — small palette-driven label for metadata and filters: seven tones, optional `#` prefix, leading icon, and a trailing remove action.
- **Shortcut** — keyboard key-caps (`⌘ ⇧ ⌥ ^`) rendered from tokens, with modifier glyph mapping and a `combine` mode for merged combos. Semantic `<kbd>`.
- **Avatar** — circular avatar that infers its type from props (photo / gradient agent / brand logo / initials / empty), with four sizes and an overlapping `AvatarGroup` (`+N` overflow).
- **Switch** — the boolean control for settings rows: Base UI state on the Oreo track/thumb surface, with a slight overshoot on the thumb.
- **Page Loader** — story-driven page loading sized to the wait: six storylines (snake / breakout / runner / fishing / orbit / kitchen), each at three tiers — a glyph loop under 5s, a CSS ambient scene to 30s, and a playable canvas minigame beyond, with `tierForEstimate` mapping an estimate to a tier.
- **Settings pattern** — a configurable settings-page framework (`/settings`): three appearance axes (background hierarchy · card style · nav icons) expressed through a local `--settings-*` variable layer, a full row vocabulary (setting / link-out / stat / meter / entity picker / editor / callout), a filtering nav rail that collapses into a drawer, and a six-page showcase with a floating axis switcher.
- **Icon** — thin adapter over [Phosphor](https://phosphoricons.com) that drives size/color via tokens and `currentColor`.
- **Docs app** — three-column layout (component nav · content · on-this-page scrollspy) with Preview/Code tabs, an API table, and a floating **"Make them yours"** panel that drives theme, radius, and the press spring live across every preview.

Design tokens are extracted 1:1 from the Oreo UI Figma file; switching theme or radius only changes CSS variables — components are never touched. The palette tones used by Tag and the Avatar "alphabet" type ship with both light and dark skins.

## Review workspace

Inspired by [@_heyrico’s agentic interface](https://x.com/_heyrico/status/2109659622114288121), `/review-components` documents nine reusable parts: `WorkspaceRail`, `SignalStrength`, `ContactRow`, `ReviewQueue`, `FollowUpSummary`, `EmailDraft`, `ReviewNavigation`, `EmailDraftToolbar`, and `ReviewWorkspaceShell`.

`/review-workspace` composes them into the complete template: grouped contact signals, editable drafts, attachments, model selection, queue navigation, dismiss/restore, filtering and sorting. Demo state is local and resets on reload; no files upload and no emails send. See [the component map and integration notes](src/patterns/review-workspace/README.md).

## Skills catalog

Inspired by [@_heyrico’s Skills interface](https://x.com/_heyrico/status/2109682274090545238), `/skill-card` provides a live playground and documentation for seven exports: `SkillCard`, `SkillProviderBadge`, `SkillSearch`, `SkillCatalogTabs`, `SkillSection`, `SkillEmptyState`, and `SkillWorkspaceShell`.

`/skills-workspace` composes them with the existing `WorkspaceRail` into a responsive template. Search across names, descriptions and providers, add/remove skills, and switch between Installed and Discover. Installation is a local demo only and resets on reload. Provider initials replace brand artwork; dark mode and mobile behavior extend the cropped reference.

Copy `src/components/skill-card` with its Oreo dependencies for the primitives, or add `src/patterns/skills-workspace` for the complete fixture. The components use existing theme, palette and radius tokens without new dependencies.

## Activity workspace

[Activity components](/activity-components) and the [Activity template](/activity-workspace) bring usage, forecasts, budget meters, spend rankings, request logs and audit events into one workspace. Eight reusable exports live in `src/components/activity`; the local-state demo lives in `src/patterns/activity-workspace`. The template extends [Ludvig Rask’s reference](https://x.com/ludvigrask_/status/2109657592800694706) with light/dark themes, responsive layouts, period selection, request filters and budget editing. All data is illustrative; edits reset on reload.

## Develop

### Automation Studio

Inspired by [rico’s agentic workspace](https://x.com/_heyrico/status/2110385506685186429), `/automation-components` adds eight reusable parts for grouped navigation, panels, run summaries, result disclosures, Build/Canvas views, workflow steps and empty/error states. `/automation-studio` combines them with Oreo’s Message, PromptBox and shared controls into a complete responsive template. The cropped reference informs the visible layout; workflow nodes and local interactions are independent extensions. No AI service, ad account or scheduler is connected. See the [component map and integration notes](src/patterns/automation-studio/README.md).

### Settings design-language experiment

`/settings-lab` compares content changes, composition and deliberate extensions of the original Settings pattern. The reusable implementation, lineage contract and checks are documented in [the experiment guide](docs/settings-language/README.md), with evidence in [the results](docs/settings-language/RESULTS.md).

Run `pnpm settings:verify` to compare against the pinned original and exercise the lab. It starts its own local servers on available ports and closes them when done.

Requires Node 18+ and pnpm.

```bash
pnpm install
pnpm approve-builds   # approve esbuild's build script (pnpm blocks it by default)
pnpm dev              # http://localhost:5173
pnpm build            # type-check + production build
pnpm preview          # serve the production build
```

> **Why `approve-builds`?** pnpm v9+ blocks dependency build scripts unless approved.
> esbuild (Vite's bundler) needs its postinstall to fetch a platform binary — run the
> command once and select `esbuild`. If you skip it and `pnpm dev` fails to start, that's why.

## Structure

```
src/
├─ index.css                  # design tokens (CSS vars), light + dark skins
├─ lib/                       # cn, tv helpers + palette (shared color tones)
├─ components/
│  ├─ button/                 # Button + IconButton (shared surface.ts)
│  ├─ chip/                   # Chip + ChipGroup
│  ├─ tag/                    # Tag
│  ├─ shortcut/               # Shortcut (kbd key-caps)
│  ├─ avatar/                 # Avatar + AvatarGroup (agents.ts gradients)
│  ├─ switch/                 # Switch (Base UI Switch on Oreo tokens)
│  └─ icon/                   # Phosphor adapter
├─ patterns/
│  ├─ board/                  # Onboarding Board pattern
│  └─ settings/               # Settings framework (3 appearance axes + row vocabulary + demo/)
├─ docs/                      # DocsLayout, Sidebar, OnThisPage, CustomizePanel, primitives
├─ pages/                     # one *Docs.tsx page per component
├─ lib/site.ts                # route table: slug → title + description (drives <head> and sitemap)
└─ App.tsx                    # page registry + nav state
```

Adding a docs page means one entry in `src/lib/site.ts` (title + meta description) and one in
`App.tsx` — the `<title>`, canonical URL, Open Graph tags and `sitemap.xml` all follow from it.
The favicons, app icons and social card in `public/` are drawn from the Oreo mark by
`node scripts/generate-brand-assets.mjs` (headless Chrome does the rasterizing); re-run it if the
mark or the card copy changes.

Each component folder is self-contained — `*.tsx` + `*.variants.ts` + `index.ts` — so you can copy a single folder into your project and own the code.

## Component pattern

Each component = **Base UI behavior** + **`tv()` variants** + **`cn()` merge** + **token-driven theme**. Interactive states use Tailwind `data-[*]` variants tied to Base UI's data attributes; press animation is an optional Motion spring exposed as props (`bounce`, `duration`, `tapScale`).

## Feature cards and Features showcase

Inspired by [Tailark’s Features 4](https://x.com/TailarkUI/status/2109456782389321994), `/feature-cards` adds six composable exports: `LayeredCard`, `InvoicePreview`, `SegmentedUsage`, `UsageSummary`, `FeaturePanel`, and `FeatureItem`. The playground edits invoice fields, usage values and the optional fade; documentation includes composition code and empty/at-capacity examples.

`/features-showcase` composes these into the complete two-column marketing section with four supporting benefits. It uses one column below 1024px, supports Oreo light/dark tokens, and reuses `GradientMask`. All data is illustrative; it does not create invoices or connect to analytics. The source crops are attributed, with independently implemented code and Oreo marks. Copy `src/components/feature-cards` and its imports, then `src/patterns/features-showcase` for the complete section.

## Orbit Gallery

`/orbit-gallery` adds a reusable `OrbitGallery` with Flat, Tilt, Ring and Gallery layouts, wheel/drag rotation, keyboard controls, a native detail viewer and empty/image-failure states. It reuses the Oreo playground, code export and theme tokens. `/orbit-gallery-showcase` opens the complete portfolio study.

Inspired by [Awesome Design’s video](https://www.pinterest.com/pin/211174979526687/). The first three layouts follow the reference; the Gallery grid and detail viewer are extensions. Demo artwork consists of attributed low-resolution video stills under `public/examples/orbit-gallery`; replace it with your own images. Copy `src/components/orbit-gallery` with its imports and provide unique item IDs. Motion is interruptible, keyboard actions are immediate, and reduced motion removes spatial interpolation.

## Inline Quick Menu

`/inline-quick-menu` recreates [Nitish Khagwal’s inline quick menu](https://x.com/nitishkmrk/status/2110258300495245505): a Private / Public capsule, horizontal anchored choices, a connecting pointer and a turning chevron. Includes a live playground, generated JSX and API documentation. `InlineQuickMenu` supports custom options, controlled or uncontrolled state, disabled choices, horizontal keyboard navigation and reduced motion. Copy `src/components/inline-quick-menu` with Oreo’s Icon, cn and theme tokens; no new dependencies. Selection is local UI state, with persistence left to the consumer.
## Project chat and Music Workspace

Inspired by [Brad / @designflyio’s project chat](https://x.com/designflyio/status/2110182813714805096), `/project-chat` documents seven exports: `CollaboratorPresence`, `ProjectChannels`, `ChatBubble`, `AudioClip`, `TypingPresence`, `CollaborationComposer`, and `ProjectChatPanel`. They reuse Oreo avatars, message primitives, buttons, icons, and theme tokens.

`/music-workspace` places the chat beside a searchable music project table. It includes per-song drafts and messages, local attachments, native audio playback with timestamp seeking, minimize/reopen, dark mode and a stacked mobile layout. Demo data resets on reload; no files upload and no messages leave the browser. The original synthesized audio fixture is unrelated to the reference artist’s music, and the waveform is illustrative. See [the component map](src/patterns/music-workspace/README.md).


## Knowledge Base

Inspired by [David’s Folders UI](https://x.com/david_visuals_/status/2109652303129252256), `/knowledge-components` adds six reusable exports: `FolderArtwork`, `FolderCard`, `FolderTree`, `WorkspaceSwitcher`, `KnowledgeSearch`, and `KnowledgeFileTable`. The live playground edits folder tone, text, members, selection and disabled state, and exports the current JSX.

`/knowledge-base` composes the complete responsive template with nested folder browsing, folder-scoped search (⌘/Ctrl K), sortable file names, accessible file-summary dialogs and two switchable workspaces. Counts reflect local fixtures; state resets on reload. SVG artwork is independently drawn and uses scoped Tailwind palette variables, while surfaces, controls and typography reuse Oreo tokens. Dark mode and mobile layouts extend the static light reference. Home and Integrations are local views; AI and analytics services are outside this example.

Copy `src/components/knowledge-base` with its imports, then `src/patterns/knowledge-base` for the template. Reuses Oreo Avatar, AvatarGroup, Menu, Icon, Button and Base UI Dialog with no new application dependencies.

## Connections workspace

[Connection components](/connection-components) and the [Connections template](/connections-workspace) translate [Rauno Freiberg’s inline form demo](https://x.com/raunofreiberg/status/2109991552215031963) into six reusable exports: `ProjectIdentity`, `ConnectionGroup`, `ConnectionRow`, `InlineProjectPicker`, `ConnectionSetup`, and `NewConnectionButton`. Search and select projects in place; new connections reveal setup instructions directly beneath the row. Base UI handles keyboard selection, dismissal and disclosure semantics. The complete local-state template includes both permission directions, duplicate filtering, disconnect, reset, light/dark themes and responsive layouts. No Vercel permissions are changed. See [the source breakdown](src/patterns/connections-workspace/README.md).

## Inline Confirm

`/inline-confirm` recreates [Elia’s inline destructive action, shared by Ali Bey](https://x.com/alibey_10/status/2109948796088295538). The neutral capsule expands into a question, Cancel and Delete; confirmation contracts into progress and a persistent success result. An async rejection keeps an inline error and retry. Escape and Cancel restore focus, leaving the group dismisses it, and keyboard/reduced-motion modes remove spatial transitions.

Includes an editable playground, generated JSX and API documentation with local success/failure examples. Copy `src/components/inline-confirm` with its Oreo Button, Icon, cn, motion and theme-token imports; no new dependencies. Supply `onConfirm` and resolve only after the real operation succeeds. Gallery examples do not delete projects; exported starter code requires you to connect the action.

### Document activity and workspace

- `/document-activity`: storage playground, timeline and access-request examples, composition and API documentation.
- `/document-workspace`: property document template with Files / Activity views, folder and date filtering, search, photo previews, local file records and reversible access decisions.
- Source: `src/components/document-activity` and `src/patterns/document-workspace`.
- Design reference: [csakani / Sakani UI](https://x.com/samosemudiamhe/status/2110304795869524372). Independent implementation using Oreo primitives; all interactions are local fixtures, with no backend connection.
- Visual evidence: [task review](docs/reviews/samo-20261015/REVIEW.md).

### Subscription

`/subscription-components` contains a live product-card playground, composition examples and the accessible dialog API. `/subscription` is the complete workspace template. Two independently moving decorative planes retain static captions, use Oreo theme tokens, and remain still on touch or reduced motion. The template uses fictional data and creates no account, subscription or payment. Source reference: [Hamza A. / Benji Taylor](https://x.com/HamzaInstantly/status/2110392051074511159).

### Meeting components and planner

Inspired by [Noman’s multi-select dropdown](https://x.com/noman_huge/status/2110294792034996359), `/meeting-components` adds an editable picker playground and documentation for `MultiSelectMenu`, `MeetingCard`, `MeetingResponse`, `RescheduleSuggestions` and `AttendeeCalendars`. The shared `MenuCheckboxItem` extends Oreo’s Base UI menu with a leading checkbox and persistent multi-selection.

`/meeting-planner` composes the components into a responsive calendar template: category management, attendee availability, RSVP, edit and reschedule confirmation, search, delete/undo and light/dark themes. Data is local and resets on reload; availability is illustrative and Join is a service placeholder. Copy `src/components/meeting`, `src/components/multi-select-menu` and their Oreo imports, then `src/patterns/meeting-planner` for the template. No new dependencies. See the [visual review](docs/reviews/noman-20261015/REVIEW.md).

### Text Toolbar and Writing Studio

Inspired by [shawn.’s text toolbar concept](https://x.com/zzzzshawn/status/2110512054851526682), `/text-toolbar` adds `TextToolbar`, `ColorOrb`, `FontSizeStepper`, `TextAlignmentControl` and `FontFamilyPicker`, plus a typed format model and style mapper. The original spectrum illustration opens an accessible named-color menu; all controls reuse Oreo primitives and both icon libraries.

`/writing-studio` demonstrates selectable text blocks, local editing and formatting, undo/redo, reversible reset, validated links, plain-text mentions and text transforms. It formats whole blocks, not arbitrary rich-text selections. Copy exports plain text; no document is uploaded, and reload resets the draft. See the [component map](src/patterns/writing-studio/README.md) and [visual review](docs/reviews/shawn-20261015/REVIEW.md).

### Canvas Toolbar & Canvas Studio

Inspired by [rico’s navigation concept](https://x.com/_heyrico/status/2110408550845702320), `/canvas-toolbar` adds a floating toolbar, zoom menu, mode control, add menu and canvas block. `/canvas-studio` demonstrates pan/zoom, local note/task/link editing, grid arrangement, undo and a labeled local suggestion. It reuses Oreo controls, menus, icon adapters and empty-state patterns.

[Visual and interaction review](docs/reviews/rico-20261015/REVIEW.md).

- **Toggle Composer / Composer Studio** — Quick and Long post modes, solid/frosted surfaces, selection formatting, live preview and session drafts. [Reference](https://x.com/gregmwashington/status/2110188748994675112).

- **Switch / Preference Studio** — opt-in stretch feedback on the existing Switch, plus a responsive settings template with live appearance and activity preferences. [Reference](https://x.com/samosemudiamhe/status/2110425458806235278).

- **Edge Monitor / Edge Observatory** — metric tiles, regional traffic, percentile latency, request filters and deployment previews. [Reference](https://x.com/augustasdesign/status/2110393766754341153).

### Changelog

Browse selected main-branch updates at `/changelog`, with date anchors, search/type filters, real component previews, Markdown download and an agent upgrade prompt. `ReleaseEntry` (`/release-entry`) and `UpgradePrompt` (`/upgrade-prompt`) include editable playgrounds and API docs. The complete template lives in `src/patterns/changelog`; update its curated `data.ts` with verified merges. A merge entry does not assert a package release or website deployment.

### Presence Room

`/presence-room` combines an editable brief, checklist and discussion with a live-presence demo. Reusable `PresenceStack` and `PresenceBadge` live in `src/components/presence` with playgrounds at `/presence-stack` and `/presence-badge`. Existing `TypingPresence` now supports multiple people without changing its single-person default. All room activity is local, including connection failure/retry; no realtime backend is implied.

### Finance Workspace

`/finance-workspace` combines a multi-series BalanceChart, AllocationBar, SpendingGauge and masked PaymentCard with existing Oreo metrics, cards, controls and empty states. The full local template includes period selection, savings goals, editable budgets, card freezing, demo payments and searchable activity. Each new component has its own editable playground and API docs. See `src/patterns/finance-workspace/README.md` for data and integration boundaries.

### Agent Connections

`/agent-connections` composes AgentConnectCard, QuotaUsage and AgentClientPicker into a local MCP setup workspace. Client selection, read-only access changes, config copying and disconnection are interactive fixtures; no server calls or credentials are involved. Each component has its own docs/playground route. Reference: [Priyank](https://x.com/Priyank/status/2110430943270052172).
