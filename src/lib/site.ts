/* ----------------------------------------------------------------------------
 * Site metadata — the single source of truth for routes, <title>, meta
 * descriptions and the sitemap. App.tsx keys its page map off PAGE_META, and
 * vite.config.ts emits sitemap.xml from it at build time, so nothing drifts.
 * -------------------------------------------------------------------------- */

export const SITE = {
  name: "Oreo UI",
  url: "https://oreo-ui-preview.vercel.app",
  title: "Oreo UI — Copy-paste React components for chat and agent interfaces",
  description:
    "A copy-paste React component library for chat and agent UIs. Base UI behavior, Tailwind v4 design tokens and Motion springs — own the source, theme with CSS variables.",
  ogImage: "/og.png",
  locale: "en_US",
} as const;

export type PageMeta = { title: string; description: string };

/** Every route lives at /<slug>. Order here is the sitemap order. */
export const PAGE_META = {
  "callback-priority": { title:"Callback Priority", description:"Compact operational priority badges with readable labels and signal bars." },
  "callback-card": { title:"Callback Card", description:"A service callback card with priority, reported date, technician and cost." },
  "callback-board": { title:"Callback Board", description:"Controlled service callback stages with record counts and accessible detail actions." },
  "callback-workspace": { title:"Callback Workspace", description:"An operational callback board with team views, branch grouping, search and editable local service records." },
  "thinking-state": { title:"Thinking State", description:"Six tiny pixel signals for ongoing assistant activity, with controlled motion and accessible labels." },
  "thinking-timeline": { title:"Thinking Timeline", description:"A controlled operational timeline with running, paused, complete and recoverable error states." },
  "thinking-workspace": { title:"Thinking Workspace", description:"A calm assistant template with a local run sequence, pause, stop, retry and editable pixel signals." },
  "command-search": { title:"Command Search", description:"Grouped workspace command search with keyboard navigation and real host actions." },
  "workspace-metric": { title:"Workspace Metric", description:"Quiet metric cards with explicit values, units and supporting context." },
  "deployment-row": { title:"Deployment Row", description:"Actionable project build records with clear ready and failed states." },
  "command-dashboard": { title:"Command Dashboard", description:"A developer workspace with working command search, local project drafts and build recovery." },
  "invoice-status-badge": { title:"Invoice Status Badge", description:"Payment state labels using the shared Oreo Tag palette." },
  "invoice-table": { title:"Invoice Table", description:"Sortable invoice rows with customer avatars and accessible actions." },
  "invoice-totals": { title:"Invoice Totals", description:"Outstanding, overdue, paid and draft totals from one invoice dataset." },
  "invoice-workspace": { title:"Invoice Workspace", description:"A local CRM invoice workspace with list, board, compact and overview views." },
  "ask-analytics": { title:"Ask Analytics", description:"A compact dashboard question card with suggestions, grounded answers and recovery states." },
  "insight-sources": { title:"Insight Sources", description:"Actionable source chips for analytics answers." },
  "analytics-assistant": { title:"Analytics Assistant", description:"A local analytics dashboard with a question assistant, source details and saved insights." },
  "hub-search-hero": { title:"Hub Search Hero", description:"A dotted catalog header with controlled search and shortcut support." },
  "agent-category-grid": { title:"Agent Category Grid", description:"A compact category directory with accessible selection and counts." },
  "integration-tile": { title:"Integration Tile", description:"A tool identity, connection state and agent count in one compact card." },
  "agent-hub": { title:"Agent Hub", description:"Explore sample agents, browse work categories and manage local demo integrations." },
  "place-map": { title:"Place Map", description:"An illustrative neighborhood map with accessible markers, selected routes and composable details." },
  "place-detail-card": { title:"Place Detail Card", description:"A compact venue summary with amenities, rating, navigation and optional copy/save actions." },
  "map-style-picker": { title:"Map Style Picker", description:"Five labeled map palettes using Oreo Inline Quick Menu behavior." },
  "place-explorer": { title:"Place Explorer", description:"A local place discovery conversation with an interactive map, filters, saved venues and copyable itineraries." },
  "agent-connect-card": { title: "Agent Connect Card", description: "A compact integration setup card with arced client identities and a focused action." },
  "quota-usage": { title: "Quota Usage", description: "A compact circular quota meter with clear usage, unknown and over-limit states." },
  "agent-client-picker": { title: "Agent Client Picker", description: "A controlled client selector with native radio navigation and provider marks." },
  "agent-connections": { title: "Agent Connections", description: "A complete local MCP setup template with client selection, read-only tool access, configuration and connection management." },
  "balance-chart": { title:"Balance Chart", description:"Accessible multi-series financial snapshots with a shared scale and a data table." },
  "allocation-bar": { title:"Allocation Bar", description:"Proportional savings categories with labels and amounts." },
  "spending-gauge": { title:"Spending Gauge", description:"A segmented half-ring budget meter with remaining and over-budget states." },
  "payment-card": { title:"Payment Card", description:"A masked account card with an explicit frozen state." },
  "finance-workspace": { title:"Finance Workspace", description:"A complete local finance dashboard with cash flow, savings goals, spending and demo payments." },
  "presence-stack": { title:"Presence Stack", description:"An interactive live roster with avatar overlap, status badges and an accessible people panel." },
  "presence-badge": { title:"Presence Badge", description:"Accessible online, away and typing marks with optional motion." },
  "presence-room": { title:"Presence Room", description:"A local collaborative brief with presence, editable content, checklist and discussion." },
  changelog: { title: "Changelog", description: "Selected Oreo UI updates with live previews, source links and upgrade context." },
  "release-entry": { title: "Release Entry", description: "A reusable update entry with source provenance and a live preview slot." },
  "upgrade-prompt": { title: "Upgrade Prompt", description: "Readable, copyable upgrade context with success feedback and manual recovery." },
  "brand-guide": { title: "Brand Guide", description: "A practical brand kit with logo downloads, colours, typography and a signature builder." },
  "brand-swatch": { title: "Brand Swatch", description: "A reusable colour specimen with an accessible copy action." },
  "type-scale": { title: "Type Scale", description: "Preview and export a responsive modular typography scale." },
  "email-signature": { title: "Email Signature", description: "A portable signature preview with matching escaped HTML export." },
  "project-summary": { title: "Project Summary", description: "Compact project progress, team and delivery metadata." },
  "task-row": { title: "Task Row", description: "Accessible task completion and detail actions with contextual metadata." },
  "project-workspace": { title: "Project Workspace", description: "An interactive project overview, task list and board with editing and progress." },
  "tree-stepper": { title: "Tree Stepper", description: "A hierarchical checklist that opens only the selected branch." },
  "step-progress": { title: "Step Progress", description: "A compact accessible progress track for completed checks." },
  "security-review": { title: "Security Review", description: "A local review workspace with branching steps, evidence, outcomes and completion summary." },
  "timeframe-selector": { title: "Timeframe Selector", description: "Compact duration choices that expand and cycle inline." },
  "inline-search-select": { title: "Inline Search Select", description: "A selected value that turns into an anchored search field." },
  "position-studio": { title: "Position Studio", description: "A local practice position form with inline token search and duration selection." },
  "studio-inbox-components": { title: "Studio Inbox", description: "Grouped collaboration notifications with controlled selection, unread state and type filters." },
  "studio-inbox": { title: "Studio Inbox Template", description: "A music collaboration inbox with project discussions, audio previews and local replies." },
  "edge-monitor": { title: "Edge Monitor", description: "Metric cards, regional traffic, latency percentiles and deployment history for infrastructure dashboards." },
  "edge-observatory": { title: "Edge Observatory", description: "A responsive infrastructure monitoring template with regional traffic, latency, logs and deployment previews." },
  switch: { title: "Switch", description: "An accessible on/off control with optional stretch motion, existing Oreo tokens and native form behavior." },
  "preference-studio": { title: "Preference Studio", description: "A settings template with immediate appearance, density, people and activity preferences in a live workspace preview." },
  "toggle-composer": { title: "Toggle Composer", description: "Quick and long post editors with solid and frosted surfaces, selection formatting and accessible mode switching." },
  "composer-studio": { title: "Composer Studio", description: "A writing template with live preview, image attachments and session drafts." },
  "canvas-toolbar": { title: "Canvas Toolbar", description: "Floating canvas navigation with zoom, pan, selection, organization and creation controls." },
  "canvas-studio": { title: "Canvas Studio", description: "A local idea board with pan, zoom, block editing, grid arrangement and reversible changes." },
  "text-toolbar": { title: "Text Toolbar", description: "A compact text formatting surface with a spectrum color orb, formatting grid, font size, alignment and family controls." },
  "writing-studio": { title: "Writing Studio", description: "A local writing canvas with block formatting, editing, reversible history, links and plain-text mentions." },
  "meeting-components": { title: "Meeting Components", description: "Multi-select category menus, meeting detail cards, attendee availability, responses and reschedule suggestions." },
  "meeting-planner": { title: "Meeting Planner", description: "A local calendar template with meeting details, multi-select categories, flexible scheduling and reversible actions." },
  "automation-components": { title: "Automation Components", description: "Composable agent workspace navigation, panels, run summaries, result disclosures and Build/Canvas workflow views." },
  "automation-studio": { title: "Automation Studio", description: "A three-panel agent workspace template with an inspectable automation draft, local demo runs and responsive layouts." },
  "document-activity": { title: "Document Activity", description: "Composable document timelines, attachments, access approvals, member activity and storage insights." },
  "document-workspace": { title: "Document Workspace", description: "A property document template with scoped search, activity filters, file previews and local approval flows." },
  "connection-state": { title: "Connection State", description: "Composable integration stack, connection states and grouped meeting lists with recovery and reduced-motion support." },
  "calendar-sync": { title: "Calendar Sync", description: "A complete first-connection template: empty calendar, syncing, success and grouped meetings." },
  "comment-thread": { title: "Comment Thread", description: "Composable comments, participant summaries, highlighted resolutions and collapsible resolved threads with resilient replies." },
  "comment-workspace": { title: "Comment Workspace", description: "An interactive discussion workspace with search, filters, resolution highlights and resolved-thread history." },

  "subscription-components": { title: "Subscription Components", description: "Two-plane product previews, a shared usage disclosure, and an accessible subscription offer dialog with pointer depth and reduced-motion support." },
  subscription: { title: "Subscription", description: "A complete subscription workspace template with a three-product offer, layered previews, and an accessible dialog." },
  "inline-confirm": { title: "Inline Confirm", description: "An in-place destructive action that unfolds into Cancel and Confirm, with asynchronous progress, success and retry." },
  "inline-quick-menu": { title: "Inline Quick Menu", description: "A capsule trigger with an anchored horizontal choice menu, instant keyboard navigation and theme-aware styling." },
  "project-chat": { title: "Project Chat", description: "Composable collaborator presence, project channels, audio clips, messages and a resilient composer." },
  "music-workspace": { title: "Music Workspace", description: "A music project workspace with contextual collaboration, audio feedback and per-project conversations." },
  "knowledge-components": { title: "Knowledge Base Components", description: "Layered folder artwork, selectable cards, nested navigation, workspace search and a sortable file table." },
  "knowledge-base": { title: "Knowledge Base", description: "A complete knowledge workspace template with tactile folders, nested browsing, scoped search and file previews." },
  "connection-components": { title: "Connections", description: "Inline project search, expandable setup rows and directional connection groups built for direct manipulation." },
  "connections-workspace": { title: "Connections Workspace", description: "A complete project connections template with inline search, setup instructions and non-modal editing." },
  "orbit-gallery": { title: "Orbit Gallery", description: "A scrollable and draggable image orbit with Flat, Tilt, Ring and Gallery layouts, responsive controls and reduced-motion support." },
  "orbit-gallery-showcase": { title: "Orbit Gallery Showcase", description: "An experimental portfolio gallery with floating artwork and smoothly changing spatial layouts." },
  "feature-cards": { title: "Feature Cards", description: "Layered cards, invoice previews, segmented usage meters and feature panels for product storytelling." },
  "features-showcase": { title: "Features Showcase", description: "A spacious two-column features template with layered invoice and usage cards and four supporting benefits." },
  "prospecting-components": { title: "Prospecting Components", description: "Composable prospect metrics, buying signals, segmented scores, recommendations and activity timelines." },
  "prospecting-dashboard": { title: "Prospecting Dashboard", description: "An interactive sales intelligence template with prospect discovery, saved contacts, filtering and CSV export." },
  "activity-components": { title: "Activity Components", description: "Composable usage charts, forecast lines, budget meters, request logs, spend leaderboards and audit timelines." },
  "activity-workspace": { title: "Activity Workspace", description: "A complete workspace activity template bringing usage, forecasts, billing, budgets and request logs together." },
  "cut-reveal": { title: "Cut Reveal", description: "A reusable scissors-and-paper opening sequence, with a progress line, split curtains, skip control and reduced-motion support." },
  "neutomni-intro": { title: "Neutomni Intro", description: "An independent React recreation of Neutomni’s red-and-white opening sequence, featured by Awwwards." },
  "skill-card": { title: "Skill Card", description: "Composable skill cards, provider identities, catalog tabs, search, empty states and a responsive workspace shell." },
  "skills-workspace": { title: "Skills Workspace", description: "A complete Skills discovery template with grouped cards, search and an interactive installed collection." },
  "status-icon": { title: "Status Icon", description: "Rounded task status icons with distinct outlines, progress fills and completion marks, built on Oreo’s tokens." },
  "context-window": { title: "Context Window", description: "Inspect token usage by category, remove context files and compact conversations on Oreo’s token-driven surface." },
  "review-workspace": { title: "Review Workspace", description: "A three-column UI template for contact signals, follow-ups and editable email drafts." },
  "review-components": { title: "Review Components", description: "Composable workspace rail, contact queue, signal strength, follow-up summary, email draft and review shell." },
  kanban: {
    title: "Kanban",
    description: "An interactive Kanban board with sortable cards, assignee swimlanes, soft work-in-progress limits and interruptible motion.",
  },
  "gradient-mask": {
    title: "Gradient Mask",
    description: "An eased CSS opacity mask for images and decorative content, with four directions, configurable fade ranges, and a live linear-versus-eased comparison.",
  },
  button: {
    title: "Button",
    description:
      "A compact, tappable control pairing a short action label with an optional icon. Three emphasis variants, a danger flag, state-layer hover and a Motion press spring.",
  },
  "icon-button": {
    title: "Icon Button",
    description:
      "A square, icon-only action sharing Button's surface — capsule or rounded-square shape, optional floating elevation, and a required accessible label.",
  },
  chip: {
    title: "Chip",
    description:
      "A tappable suggestion pill that surfaces quick-start actions: leading icon, four states, a Motion press spring and a scrollable ChipGroup.",
  },
  tag: {
    title: "Tag",
    description:
      "A palette-driven label for metadata and filters — seven tones, an optional # prefix, a leading icon and a trailing remove action.",
  },
  shortcut: {
    title: "Shortcut",
    description:
      "Keyboard key-caps rendered from tokens: ⌘ ⇧ ⌥ ^ modifier glyphs, a combine mode for merged combos, and semantic <kbd> markup.",
  },
  avatar: {
    title: "Avatar",
    description:
      "An avatar that infers its type from props — photo, gradient agent, brand logo, initials or empty — with four sizes and an overlapping AvatarGroup.",
  },
  menu: {
    title: "Menu",
    description:
      "The floating list surface behind pickers and overflow actions: a leading glyph per row and a trailing check, shortcut, toggle or submenu chevron.",
  },
  "code-block": {
    title: "Code Block",
    description:
      "A code surface for assistant responses and docs — intentionally dark in both themes, with a quiet language/filename header and a copy action.",
  },
  response: {
    title: "Response",
    description:
      "Assistant output as markdown, tuned for chat: tighter rhythm, smaller headings, GFM tables and lists, and fenced code routed into Code Block.",
  },
  "streaming-text": {
    title: "Streaming Text",
    description:
      "Plain text arriving token by token — diffs the growing string, animates only the appended tokens, with plain, fade and gradient-tail entrance variants.",
  },
  message: {
    title: "Message",
    description:
      "One turn in the transcript — user turns as a soft bubble, assistant turns flat and full width, with actions revealed on hover or keyboard focus.",
  },
  conversation: {
    title: "Conversation",
    description:
      "The transcript viewport: sticks to the bottom while the assistant streams, releases the moment the user scrolls up, and offers a return button.",
  },
  "tool-call": {
    title: "Tool Call",
    description:
      "What the agent is doing, as a quiet line in the transcript — a shimmered caption while the tool runs, swapping to a resting name with a check.",
  },
  reasoning: {
    title: "Reasoning",
    description:
      "One line of agent activity: a glyph that becomes a chevron, a label that shimmers while the work runs, and a disclosure holding what was thought or touched — bare in the transcript or on its own card.",
  },
  plan: {
    title: "Plan",
    description:
      "The agent's task list — a thin progress bar and a step timeline with done, active and pending states, with progress derived from the steps.",
  },
  sources: {
    title: "Sources",
    description:
      "Citations behind an answer, tucked into a soft pill with a count that expands into a grid of link cards with domain and title.",
  },
  confirmation: {
    title: "Confirmation",
    description:
      "Human-in-the-loop approval: the agent states what it wants to do, shows the exact payload, waits, then resolves in place in the transcript.",
  },
  attachment: {
    title: "Attachment",
    description:
      "File chips for composers and messages — image and video thumbnails fill the chip, every other kind gets its paper file icon, across three layouts.",
  },
  "branch-picker": {
    title: "Branch Picker",
    description:
      "A pager for regenerated answers: lives in the message action row, slides the counter in the paging direction and disables itself at the ends.",
  },
  "thread-list": {
    title: "Thread List",
    description:
      "Conversation history for the sidebar — date sections, a new-chat entry, and rows whose time swaps to rename and delete actions on hover.",
  },
  "assistant-modal": {
    title: "Assistant Modal",
    description:
      "The floating chat launcher: a bottom-corner button whose glyph blur-swaps to a caret, with the panel springing up from that corner.",
  },
  "page-loader": {
    title: "Page Loader",
    description:
      "Story-driven page loading sized to the wait: one metaphor at three scales — a glyph loop under 5s, an ambient scene to 30s, and a playable minigame beyond.",
  },
  "code-diff": {
    title: "Code Diff",
    description:
      "A proposed change as a compact unified diff — the natural payload for a Confirmation detail slot or an editing tool result.",
  },
  terminal: {
    title: "Terminal",
    description:
      "A shell run in the transcript on the Code Block ink surface: command and live status up top, dimmed streaming output below.",
  },
  "web-search": {
    title: "Web Search",
    description:
      "The search tool run rendered richly — a query pill, a shimmered status that swaps to a summary, and result rows fading in as they land.",
  },
  subagents: {
    title: "Subagents",
    description:
      "Parallel delegated work as a stack of agent cards — status, task, model and an eased progress bar per agent. The fan-out counterpart to Plan.",
  },
  "prompt-box": {
    title: "Prompt Box",
    description:
      "A multi-state input for agent conversations: the card adapts its controls to empty, filled and running states, and hosts attachments and tags.",
  },
  "keyword-tag": {
    title: "Keyword Tag",
    description:
      "A compact tag for models, integrations, referenced content and agent actions — optional leading icon and a hover remove action, built for dense composers.",
  },
  "context-bar": {
    title: "Context Bar",
    description:
      "A status surface that docks onto the Prompt Box — project context, background task count, upgrade nudges or a steerable task queue.",
  },
  "inbox-stream": {
    title: "Inbox Stream",
    description:
      "A feed pattern of dismissable cards in urgency tiers: generic card shells, filter chips, skeletons, and a three-layer enter/exit choreography.",
  },
  "onboarding-board": {
    title: "Onboarding Board",
    description:
      "A starter checklist pattern: drag cards between columns, edit titles and notes inline, and add tasks — all persisted to the browser.",
  },
  "settings-lab": {
    title: "Settings Pattern Lab",
    description: "Preserving design craft through content changes, composition and deliberate extensions.",
  },
  settings: {
    title: "Settings",
    description:
      "A configurable settings-page framework: three background hierarchies, three card styles and switchable nav icons cover most mainstream settings pages from one set of parts.",
  },
} as const satisfies Record<string, PageMeta>;

export type PageSlug = keyof typeof PAGE_META;

export const PAGE_SLUGS = Object.keys(PAGE_META) as PageSlug[];

export const DEFAULT_PAGE: PageSlug = "button";

export function isPageSlug(value: string): value is PageSlug {
  return value in PAGE_META;
}

/** Home ("/") sells the library; every other route sells its component. */
export function metaForRoute(slug: PageSlug, home: boolean) {
  if (home) {
    return { title: SITE.title, description: SITE.description, canonical: `${SITE.url}/` };
  }
  const page = PAGE_META[slug];
  return {
    title: `${page.title} — ${SITE.name}`,
    description: page.description,
    canonical: `${SITE.url}/${slug}`,
  };
}
