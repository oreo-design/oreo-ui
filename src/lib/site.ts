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
  "inline-quick-menu": { title: "Inline Quick Menu", description: "A capsule trigger with an anchored horizontal choice menu, instant keyboard navigation and theme-aware styling." },
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
