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
  spacing: { title: "Spacing Playground", description: "Tune five layers of layout spacing, highlight their boundaries and compare a frozen baseline with your current recipe." },
  "spacing-guide": { title: "Spacing Guide", description: "Oreo layout spacing roles, scoped tokens and composition rules for readable pages." },
  "data-filter-popover": {title:"Data Filter Popover",description:"A draft filter form with grouped checkboxes, pills, owner selection and explicit apply."},
  "data-sort-menu": {title:"Data Sort Menu",description:"Field and direction selection with an accessible anchored menu."},
  "row-action-menu": {title:"Row Action Menu",description:"Composable row actions with nested groups and semantic destructive items."},
  "bulk-action-bar": {title:"Bulk Action Bar",description:"A selection toolbar with an explicit select-all-matching action."},
  "workflow-status-badge": {title:"Workflow Status Badge",description:"Text and icon status for live, degraded, failing, draft, paused and archived workflows."},
  "workflow-run-bars": {title:"Workflow Run Bars",description:"Compact seven-day run bars with a readable count."},
  "workflow-table": {title:"Workflow Table",description:"A selectable automation table with metrics, owners, actions and loading or empty states."},
  "workflow-directory": {title:"Workflow Directory",description:"A complete local workflow management template with filters, sorting, nested actions and bulk updates."},

  "merge-workspace": {title:"Merge Workspace",description:"A conversational pull request template with branch history, conflict resolution, checks and local merge simulation."},
  "branch-history": {title:"Branch History",description:"A compact commit graph with caller-owned lanes, branch labels and conflict markers."},
  "merge-status-badge": {title:"Merge Status Badge",description:"A semantic PR status capsule for creating, conflicts, checks and completion."},
  "merge-checks": {title:"Merge Checks",description:"Compact check statuses with keyboard-accessible detail disclosures."},
  "change-summary": {title:"Change Summary",description:"Addition and deletion counts with a compact change disclosure."},
  "pull-request-card": {title:"Pull Request Card",description:"A controlled PR card composing commit history, conflict progress, checks and merge actions."},
  "ai-remixes": { title: "AI Remix Experiments", description: "Five Oreo UI components, ten interactive adaptations. Compare original components with new capabilities and independent Claude-inspired treatments." },
 "subscription-workspace":{title:"Subscription Workspace",description:"Customer segments, revenue goals and local customer/member enrollment in one workspace."},
 "segment-rule-builder":{title:"Segment Rule Builder",description:"Inline typed rules with match-all or match-any semantics."},
 "segment-preview":{title:"Segment Preview",description:"Live customer counts, revenue, tenure and per-leg distribution."},
 "subscription-plan-picker":{title:"Subscription Plan Picker",description:"A native radio group of recurring-price plan cards."},
 "revenue-target-editor":{title:"Revenue Target Editor",description:"A monthly revenue target with exact cent allocation and an explainable gap."},
 "issue-browser":{title:"Issue Browser",description:"A compact issue workspace with fast list navigation, a persistent reader and local discussions."},
 "issue-row":{title:"Issue Row",description:"A dense selectable issue with status, labels and discussion counts."},
 "issue-queue":{title:"Issue Queue",description:"An issue list with shared loading, empty and failure states."},
 "issue-reader":{title:"Issue Reader",description:"A nonmodal markdown reader with issue metadata and a persistent reply composer."},
 "task-board":{title:"Task Board",description:"A campaign board with inline task details, local discussions and editable properties."},
 "task-properties":{title:"Task Properties",description:"Searchable task properties, paired date validation and controlled label selection."},
 "task-subtasks":{title:"Task Subtasks",description:"A controlled checklist with inline creation and derived completion."},
 "task-detail-panel":{title:"Task Detail Panel",description:"A nonmodal inspector that keeps the board in view."},
 "music-project":{title:"Music Project",description:"An audio project workspace with timestamped comments, production tasks and mix versions."},
 "annotated-waveform":{title:"Annotated Waveform",description:"An accessible track waveform with collaborator markers and timestamp navigation."},
 "production-task-list":{title:"Production Task List",description:"Nested production checklists with derived completion and audio timestamp links."},
 "mix-version-list":{title:"Mix Version List",description:"Controlled audio version selection with uploader, duration and latest metadata."},
 "voice-agent":{title:"Voice Agent",description:"A silent local voice-session replay with dual signal lanes, latency stages and turn inspection."},
 "voice-signal":{title:"Voice Signal",description:"Caller and agent signal lanes with seek position, phase and sample transcripts."},
 "voice-latency-breakdown":{title:"Voice Latency Breakdown",description:"Exact stage timings, total latency and an explicit budget marker."},
 "turn-latency-history":{title:"Turn Latency History",description:"Selectable per-turn latency bars with outliers and nearest-rank percentiles."},
 "agent-budget":{title:"Agent Budget",description:"Explainable AI budgets with bounded cap editing, remaining-run estimates and local pause simulation."},
 "budget-cap-control":{title:"Budget Cap Control",description:"A controlled spending cap with hatched usage, keyboard input and explained boundaries."},
 "budget-outcome":{title:"Budget Outcome",description:"Translate remaining allowance into agent runs and time at the current spending pace."},
 "monthly-budget-card":{title:"Monthly Budget Card",description:"A complete budget editor with cap, estimates, reset date and explicit draft/save behavior."},
 "storage-manager":{title:"Storage Manager",description:"A local storage workspace with module accounting, retention drafts, recycle-bin recovery and reviewed cleanup."},
 "storage-usage-card":{title:"Storage Usage Card",description:"Segmented capacity with exact module totals and recycle-bin usage."},
 "storage-module-table":{title:"Storage Module Table",description:"Selectable storage inventory with file counts, growth and occupied shares."},
 "retention-policy-row":{title:"Retention Policy Row",description:"A reusable settings row with a controlled retention duration."},
 "dashboard-suite":{title:"Commerce Dashboard",description:"Pixel revenue charts and shared metrics in a local commerce dashboard."},
 "campaign-dashboard":{title:"Campaign Dashboard",description:"Layered metric cards and stacked audience revenue with local campaign records."},
 "crm-dashboard":{title:"CRM Dashboard",description:"Revenue trends, grouped audience activity and a local relationship workspace."},
 "membership-dashboard":{title:"Membership Dashboard",description:"Sparse revenue trends and membership records in a local workspace."},
 "dashboard-stat-card":{title:"Dashboard Stat Card",description:"A layered metric card with header, footer and filled variants."},
 "comparison-bar-chart":{title:"Comparison Bar Chart",description:"Stacked or grouped series with a zero baseline and exact-data disclosure."},
 "trend-area-chart":{title:"Trend Area Chart",description:"A neutral area chart with pointer and keyboard observation inspection."},
 "channel-breakdown":{title:"Channel Breakdown",description:"Source counts and proportional pixel meters with controlled selection."},

 "finance-overview":{title:"Finance Overview",description:"A local finance overview with skeleton-to-data reveal, reminders, bank accounts and recoverable refresh."},
 "skeleton-reveal":{title:"Skeleton Reveal",description:"A matched skeleton/content slot with accessible loading and retained-data refresh."},
 "balance-spark-bars":{title:"Balance Spark Bars",description:"Compact balance history with a highlighted final bar and accessible values."},
 "finance-attention-list":{title:"Finance Attention List",description:"Financial reminders with supporting context, explicit actions and loading recovery."},
 "bank-account-list":{title:"Bank Account List",description:"Bank identities, native balances, mini trends and an illustrative combined total."},
 "agent-inbox": {title:"Agent Inbox",description:"A local agent inbox with status groups, board/list views, activity, approval, retry and undo."},
 "agent-run-card": {title:"Agent Run Card",description:"An expandable run summary with status, telemetry and host-owned actions."},
 "agent-run-activity": {title:"Agent Run Activity",description:"A compact model activity timeline with readable event timestamps."},
 "agent-inbox-board": {title:"Agent Inbox Board",description:"Controlled run grouping, board/list views, drag movement and accessible status selection."},
 "calendar-event-block":{title:"Calendar Event Block",description:"A compact calendar event with semantic color, timing and selection."},
 "calendar-color-picker":{title:"Calendar Color Picker",description:"Accessible named calendar colors with inheritance support."},
 "calendar-source-list":{title:"Calendar Source List",description:"Controlled calendar visibility and color actions."},
 "calendar-week-grid":{title:"Calendar Week Grid",description:"A timed calendar with all-day events, overlap columns and sticky day labels."},
 "color-calendar":{title:"Color Calendar",description:"A colorful local calendar with week/day views, editable events, source colors, undo and export."},
 "currency-balance-card": {title:"Currency Balance Card",description:"Currency identity, balance and controlled account selection."},
 "currency-balance-summary": {title:"Currency Balance Summary",description:"Combined account totals and controlled visibility with explicit illustrative conversion rates."},
 "money-activity-list": {title:"Money Activity List",description:"Currency-aware transaction and draft rows with details and recovery states."},
 "cash-flow-bars": {title:"Cash Flow Bars",description:"Incoming and outgoing USD bars with keyboard inspection and exact data."},
 "cross-currency": {title:"Cross-Currency",description:"A local multi-currency finance dashboard with reviewed operations, undo, filtering and activity export."},
 "stay-price-label": {title:"Stay Price Label",description:"Compact nightly prices with selected hotel names for map marker buttons."},
 "stay-result-card": {title:"Stay Result Card",description:"Accommodation results with star category, distance, price and controlled selection."},
 "stay-selection-card": {title:"Stay Selection Card",description:"Selected accommodation details, pagination, save and room actions for map footers."},
 "landmark-stays": {title:"Landmark Stays",description:"A local accommodation explorer with linked map markers, filters, room details and exportable shortlists."},
 "pixel-meter": {title:"Pixel Meter",description:"A compact dot-matrix meter with exact accessible values, unknown and overflow states."},
 "inference-chart": {title:"Inference Chart",description:"A zero-baseline dithered count chart with bucket inspection and exact values."},
 "regional-traffic": {title:"Regional Traffic",description:"Schematic world traffic with controlled region selection and precise counts."},
 "agent-health-table": {title:"Agent Health Table",description:"Sortable agent telemetry with pixel success meters, status and host-owned actions."},
 "agent-observatory": {title:"Agent Observatory",description:"A local agent monitoring dashboard with region and period filters, details, pause/resume, undo and CSV export."},
 "route-job-card": {title:"Route Job Card",description:"Transport route cards with pickup, destination and passenger metadata."},
 "allocation-timeline": {title:"Allocation Timeline",description:"Controlled resource timelines with drag allocation and an unassigned job tray."},
 "dispatch-allocation": {title:"Dispatch Allocation",description:"A local transport scheduler with drag allocation, conflict checks, dispatch review and undo."},
  "folder-empty-state": {title:"Folder Empty State",description:"Fading decorative folder rows with a clear creation action."},
  "folder-collection": {title:"Folder Collection",description:"Controlled list and grid folder browsing with counts and recovery states."},
  "writing-folders": {title:"Writing Folders",description:"A local writing library with folders, document editing and organization, undo and export."},
  "performance-score": {title:"Performance Score",description:"A compact score ring with clear thresholds and accessible numeric context."},
  "review-progress": {title:"Review Progress",description:"Segmented review completion with exact counts and optional category filtering."},
  "member-performance-table": {title:"Member Performance Table",description:"Sortable team reviews with scores, changes and review status."},
  "team-performance": {title:"Team Performance",description:"A local team performance dashboard with period filters, editable reviews, undo and CSV export."},
  "chain-token-badge": {title:"Chain Token Badge",description:"Overlapping chain and token identity marks with network labels."},
  "token-amount-panel": {title:"Token Amount Panel",description:"A token amount surface with wallet context, balance, Max and network selection."},
  "chain-token-picker": {title:"Chain Token Picker",description:"Searchable chain and token lists with balances, selection and recovery states."},
  "token-bridge": {title:"Token Bridge",description:"A local cross-chain transfer simulation with exact amounts, sample quotes, review and history."},
  "agent-mention-composer": {title:"Agent Mention Composer",description:"Caret-aware agent mentions for comments and engineering handoffs."},
  "agent-session-card": {title:"Agent Session Card",description:"A controlled execution session with progress, clarification, recovery and results."},
  "engineering-handoff": {title:"Engineering Handoff",description:"A local work item with agent delegation, clarification, sample patch review and completion."},
  "activity-event-row": {title:"Activity Event Row",description:"A compact project event with actor, action, subject, time and unread state."},
  "grouped-activity-feed": {title:"Grouped Activity Feed",description:"A chronological activity list with UTC date groups and empty, loading and error states."},
  "company-identity": {title:"Company Identity",description:"A compact company mark, name, domain and hot-account signal."},
  "company-table": {title:"Company Table",description:"A dense account table with controlled sorting, details, favorites and ARR totals."},
  "company-directory": {title:"Company Directory",description:"A local CRM directory with views, filters, editable accounts, undo and CSV export."},
  "project-feed": {title:"Project Feed",description:"A local project activity workspace with filters, details, comments, read states and export."},
  "weekly-heatmap": {title:"Weekly Heatmap",description:"A keyboard-accessible day-by-hour activity matrix with exact values and controlled selection."},
  "agent-runs-card": {title:"Agent Runs Card",description:"Weekly agent activity, calculated summaries and metric selection."},
  "agent-runs": {title:"Agent Runs",description:"A local activity dashboard with hourly heatmaps, agent and week filters, detailed tables and CSV export."},
  "progressive-steps": {title:"Progressive Steps",description:"Sculpted linear steps with expanded and compact variants, controlled navigation and completion."},
  "progressive-checkout": {title:"Progressive Checkout",description:"A local four-step checkout with cart, details, saved sample methods, review and recovery."},
  "model-trend-chart": {title:"Model Trend Chart",description:"Daily model cost, token and request series with accessible inspection."},
  "model-usage-ring": {title:"Model Usage Ring",description:"Model request shares and total token usage with selectable legends."},
  "agent-usage-row": {title:"Agent Usage Row",description:"Agent activity with model, tokens, costs and optional actions."},
  "model-costs": {title:"Model Costs",description:"A local LLM usage dashboard with synchronized costs, model shares and sample activity."},
  "saved-payment-methods": {title:"Saved Payment Methods",description:"Selectable payment identities with edit and remove actions."},
  "discount-code-field": {title:"Discount Code Field",description:"Explicit discount validation and applied-code status."},
  "checkout-summary": {title:"Checkout Summary",description:"Clear line items, discount, tax basis and due-today totals."},
  "plan-upgrade": {title:"Plan Upgrade",description:"A complete local upgrade flow with plans, saved payment methods and checkout review."},
  "icon-reveal": { title: "Icon Reveal", description: "An icon-texture wordmark revealed by a pointer spotlight, keyboard focus or touch." },
  "word-roller": { title: "Word Roller", description: "A draggable, scrollable word list with snapping, looping and keyboard selection." },
  "loading-sequence": { title: "Loading Sequence", description: "Four decorative page-entry sequences with pause, replay and reduced-motion support." },
 "escalation-card": {title:"Escalation Card",description:"A client question, advisor context and human decision in one expandable card."},
 "source-conflict-card": {title:"Source Conflict Card",description:"Compare conflicting knowledge sources and choose an explicit resolution policy."},
 "knowledge-source-table": {title:"Knowledge Source Table",description:"Reviewable document metadata with approved, duplicate and conflict states."},
 "conversation-activity": {title:"Conversation Activity",description:"Accessible daily counts of answered and escalated conversations."},
 "consulting-workspace": {title:"Consulting Workspace",description:"A local advisory dashboard with client escalations, source review and knowledge conflict resolution."},
 "browser-session-tabs": {title:"Browser Session Tabs",description:"Accessible browser tabs with agent activity independent of selection."},
 "browser-control-bar": {title:"Browser Control Bar",description:"Controlled agent ownership, pause, takeover and recovery actions."},
 "browser-agent": {title:"Browser Agent",description:"A local browser session template with visible agent activity and user handoff."},
 "query-filter-bar": {title:"Query Filter Bar",description:"Composable field, condition and value filters with search and validation."},
 "trace-table": {title:"Trace Table",description:"Dense trace results with selectable columns, status and host-owned details."},
 "trace-explorer": {title:"Trace Explorer",description:"A local observability workspace with trace queries, saved filters, details and JSON export."},
 "task-status-group": {title:"Task Status Group",description:"Controlled, collapsible status headers with task counts and host-owned creation."},
 "task-list-row": {title:"Task List Row",description:"Dense task table rows with tags, priority, due date and multiple assignees."},
 "grouped-task-list": {title:"Grouped Task List",description:"Accessible status-grouped task tables with empty groups and controlled disclosure."},
 "grouped-tasks": {title:"Grouped Tasks",description:"A sprint workspace with synchronized task lists and Kanban boards, filters and local editing."},
  "spend-limit-chart": {title:"Spend Limit Chart",description:"Daily spending split at a reporting threshold with exact accessible amounts."},
  "secret-field": {title:"Secret Field",description:"A masked secret with reveal and asynchronous copy feedback."},
  "api-key-table": {title:"API Key Table",description:"API key metadata, permission tags and host-owned actions."},
  "support-console": {title:"Support Console",description:"A local support workspace with inbox drafts, daily budgets and demo API key management."},
  "forecast-timeline": {title:"Forecast Timeline",description:"Selectable account usage timelines with exhaustion and reset markers."},
  "usage-projection": {title:"Usage Projection",description:"Observed cumulative usage and constant-pace scenarios through the next reset."},
  "daily-usage-pace": {title:"Daily Usage Pace",description:"Observed daily usage compared with remaining allowance."},
  "usage-forecast": {title:"Usage Forecast",description:"A local account capacity workspace with forecast timelines, scenario controls and CSV export."},
  "recipient-search": {title:"Recipient Search",description:"Recipient Search: accessible recipient creation and payment-detail UI with host-owned data."},
  "payment-rail-picker": {title:"Payment Rail Picker",description:"Payment Rail Picker: accessible recipient creation and payment-detail UI with host-owned data."},
  "recipient-form": {title:"Recipient Form",description:"Recipient Form: accessible recipient creation and payment-detail UI with host-owned data."},
  "payment-workspace": {title:"Payment Workspace",description:"A five-step local payment draft flow with inline recipient creation, funding selection and review."},
  "revenue-matrix": {title:"Revenue Matrix",description:"Revenue Matrix: reusable sales UI with accessible data and host-owned actions."},
  "pipeline-funnel": {title:"Pipeline Funnel",description:"Pipeline Funnel: reusable sales UI with accessible data and host-owned actions."},
  "deal-stage-badge": {title:"Deal Stage Badge",description:"Deal Stage Badge: reusable sales UI with accessible data and host-owned actions."},
  "deal-table": {title:"Deal Table",description:"Deal Table: reusable sales UI with accessible data and host-owned actions."},
  "sales-workspace": {title:"Sales Workspace",description:"A complete CRM dashboard with revenue pixels, pipeline stages and editable local deals."},
  "operations-map": {title:"Operations Map",description:"Operations Map: reusable operations UI with accessible selection and local demo data."},
  "operations-feed": {title:"Operations Feed",description:"Operations Feed: reusable operations UI with accessible selection and local demo data."},
  "health-meters": {title:"Health Meters",description:"Health Meters: reusable operations UI with accessible selection and local demo data."},
  "route-timeline": {title:"Route Timeline",description:"Route Timeline: reusable operations UI with accessible selection and local demo data."},
  "pipeline-file": {title:"Pipeline File",description:"Pipeline File: reusable operations UI with accessible selection and local demo data."},
  "camera-checkpoint": {title:"Camera Checkpoint",description:"Camera Checkpoint: reusable operations UI with accessible selection and local demo data."},
  "fleet-control": {title:"Fleet Control",description:"Fleet Control: reusable operations UI with accessible selection and local demo data."},
  "pipeline-workspace": {title:"Pipeline Workspace",description:"Pipeline Workspace: reusable operations UI with accessible selection and local demo data."},
  "incident-monitor": {title:"Incident Monitor",description:"Incident Monitor: reusable operations UI with accessible selection and local demo data."},

  "experiment-chart": {title:"Experiment Chart",description:"Cumulative and daily A/B conversion comparisons with accessible date inspection."},
  "variant-results": {title:"Variant Results",description:"A/B variant identity, conversion counts and observed rates."},
  "experiment-decision": {title:"Experiment Decision",description:"Host-owned readiness and reversible experiment decisions."},
  "experiment-workspace": {title:"Experiment Workspace",description:"An A/B testing workspace with synchronized charts, editable drafts and local decision review."},
  "project-create-card": {title:"Project Create Card",description:"An illustrated project creation entry with restrained hover feedback."},
  "project-board-overview": {title:"Project Board Overview",description:"Four project stages composed with shared project summaries."},
  "project-board": {title:"Project Board",description:"A complete local project workspace with overview, draggable board and grid views."},
  "workspace-setup": {title:"Workspace Setup",description:"A compact, actionable workspace onboarding checklist."},
  "tool-access-row": {title:"Tool Access Row",description:"Shared-tool identity, status and actions."},
  "member-access-table": {title:"Member Access Table",description:"Workspace member identity and tool assignments."},
  "workspace-invitation": {title:"Workspace Invitation",description:"A complete shared-workspace invitation panel."},
  "access-workspace": {title:"Access Workspace",description:"A local shared-tool workspace with team access, invitations, sessions and settings."},
  "client-summary": {title:"Client Summary",description:"Company identity, project counts and paid revenue."},
  "client-contact-strip": {title:"Client Contact Strip",description:"Responsive company contact details."},
  "client-finance-summary": {title:"Client Finance Summary",description:"Derived client invoice and payment totals."},
  "client-workspace": {title:"Client Workspace",description:"A complete local client template with invoices, projects, contacts, documents and notes."},
  "routing-policy": { title:"Routing Policy", description:"Controlled cost, balanced and quality policy selection." },
  "routing-flow": { title:"Routing Flow", description:"An accessible model-routing flow with optional simulated packet motion." },
  "route-metrics": { title:"Route Metrics", description:"Compact model allocation, latency, cost and error metrics." },
  "model-router": { title:"Model Router", description:"A local model-routing template with draft policies, fallback testing and undo." },
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
  "task-schedule-chip":{title:"Task Schedule Chip",description:"Compact project-colored tasks with status and assignee for planning surfaces."},
  "task-calendar":{title:"Task Calendar",description:"Month and week deadline calendars with dated task creation and overflow expansion."},
  "task-timeline":{title:"Task Timeline",description:"Day-based project schedules with task duration bars and deadline milestones."},
  "task-row": { title: "Task Row", description: "Accessible task completion and detail actions with contextual metadata." },
  "project-workspace": { title: "Project Workspace", description: "An interactive project overview, task list, board, calendar and timeline with shared editing and progress." },
  "tree-stepper": { title: "Tree Stepper", description: "A hierarchical checklist that opens only the selected branch." },
  "step-progress": { title: "Step Progress", description: "A compact accessible progress track for completed checks." },
  "security-review": { title: "Security Review", description: "A local review workspace with branching steps, evidence, outcomes and completion summary." },
  "timeframe-selector": { title: "Timeframe Selector", description: "Compact duration choices that expand and cycle inline." },
  "inline-search-select": { title: "Inline Search Select", description: "A selected value that turns into an anchored search field." },
  "position-studio": { title: "Position Studio", description: "A local practice position form with inline token search and duration selection." },
  "studio-inbox-components": { title: "Studio Inbox", description: "Grouped collaboration notifications with controlled selection, unread state and type filters." },
  "studio-inbox": { title: "Studio Inbox Template", description: "A music collaboration inbox with project discussions, audio previews and local replies." },
  "monitor-reveal":{title:"Monitor Reveal",description:"Nonblocking staged introductions for monitoring surfaces with reduced-motion support."},
  "region-spotlight":{title:"Region Spotlight",description:"A compact regional latency trend, traffic and error summary."},
  "incident-recommendation":{title:"Incident Recommendation",description:"Incident context, baseline comparison and explicit review actions."},
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
