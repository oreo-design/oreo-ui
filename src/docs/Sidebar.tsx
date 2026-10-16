import { cn } from "@/lib/cn";
import { OreoLogo } from "./OreoLogo";
import type { DocsNav } from "./DocsPage";

type Item = { label: string; page?: string; soon?: boolean };
type Group = { title: string; items: Item[] };

const NAV: Group[] = [
  {
    title: "Getting Started",
    items: [{ label: "Changelog", page: "changelog" }, { label: "Introduction", soon: true }, { label: "Tokens", soon: true }],
  },
  {
    title: "Components",
    items: [
      { label: "Button", page: "button" },
      { label: "Release Entry", page: "release-entry" },
      { label: "Upgrade Prompt", page: "upgrade-prompt" },
      { label: "Icon Button", page: "icon-button" },
      { label: "Status Icon", page: "status-icon" },
      { label: "Chip", page: "chip" },
      { label: "Tag", page: "tag" },
      { label: "Shortcut", page: "shortcut" },
      { label: "Avatar", page: "avatar" },
      {label:"Activity Event Row",page:"activity-event-row"},
      {label:"Grouped Activity Feed",page:"grouped-activity-feed"},
      {label:"Performance Score",page:"performance-score"},
      {label:"Review Progress",page:"review-progress"},
      {label:"Member Performance Table",page:"member-performance-table"},
      {label:"Route Job Card",page:"route-job-card"},
      {label:"Allocation Timeline",page:"allocation-timeline"},
      {label:"Pixel Meter",page:"pixel-meter"},
      {label:"Inference Chart",page:"inference-chart"},
      {label:"Regional Traffic",page:"regional-traffic"},
      {label:"Agent Health Table",page:"agent-health-table"},
      {label:"Folder Empty State",page:"folder-empty-state"},
      {label:"Folder Collection",page:"folder-collection"},
      {label:"Chain Token Badge",page:"chain-token-badge"},
      {label:"Token Amount Panel",page:"token-amount-panel"},
      {label:"Chain Token Picker",page:"chain-token-picker"},
      {label:"Agent Mention Composer",page:"agent-mention-composer"},
      {label:"Agent Session Card",page:"agent-session-card"},
      {label:"Company Identity",page:"company-identity"},
      {label:"Company Table",page:"company-table"},
      {label:"Weekly Heatmap",page:"weekly-heatmap"},
      {label:"Agent Runs Card",page:"agent-runs-card"},
      {label:"Progressive Steps",page:"progressive-steps"},
      {label:"Model Trend Chart",page:"model-trend-chart"},
      {label:"Model Usage Ring",page:"model-usage-ring"},
      {label:"Agent Usage Row",page:"agent-usage-row"},
      {label:"Saved Payment Methods",page:"saved-payment-methods"},
      {label:"Discount Code Field",page:"discount-code-field"},
      {label:"Checkout Summary",page:"checkout-summary"},
      { label: "Escalation Card", page: "escalation-card" },
      { label: "Source Conflict Card", page: "source-conflict-card" },
      { label: "Knowledge Source Table", page: "knowledge-source-table" },
      { label: "Conversation Activity", page: "conversation-activity" },
      { label: "Browser Session Tabs", page: "browser-session-tabs" },
      { label: "Browser Control Bar", page: "browser-control-bar" },
      { label: "Query Filter Bar", page: "query-filter-bar" },
      { label: "Trace Table", page: "trace-table" },
      { label: "Spend Limit Chart", page: "spend-limit-chart" },
      { label: "Secret Field", page: "secret-field" },
      { label: "API Key Table", page: "api-key-table" },
      { label: "Forecast Timeline", page: "forecast-timeline" },
      { label: "Usage Projection", page: "usage-projection" },
      { label: "Daily Usage Pace", page: "daily-usage-pace" },
      { label: "Recipient Search", page: "recipient-search" },
      { label: "Payment Rail Picker", page: "payment-rail-picker" },
      { label: "Recipient Form", page: "recipient-form" },
      { label: "Revenue Matrix", page: "revenue-matrix" },
      { label: "Pipeline Funnel", page: "pipeline-funnel" },
      { label: "Deal Stage Badge", page: "deal-stage-badge" },
      { label: "Deal Table", page: "deal-table" },
      { label: "Operations Map", page: "operations-map" },
      { label: "Operations Feed", page: "operations-feed" },
      { label: "Health Meters", page: "health-meters" },
      { label: "Route Timeline", page: "route-timeline" },
      { label: "Pipeline File", page: "pipeline-file" },
      { label: "Camera Checkpoint", page: "camera-checkpoint" },
      { label: "Experiment Chart", page: "experiment-chart" },
      { label: "Variant Results", page: "variant-results" },
      { label: "Experiment Decision", page: "experiment-decision" },
      { label: "Project Create Card", page: "project-create-card" },
      { label: "Project Board Overview", page: "project-board-overview" },
      { label: "Workspace Setup", page: "workspace-setup" },
      { label: "Tool Access Row", page: "tool-access-row" },
      { label: "Member Access Table", page: "member-access-table" },
      { label: "Workspace Invitation", page: "workspace-invitation" },
      { label: "Client Summary", page: "client-summary" },
      { label: "Client Contact Strip", page: "client-contact-strip" },
      { label: "Client Finance Summary", page: "client-finance-summary" },
      { label: "Routing Policy", page: "routing-policy" },
      { label: "Routing Flow", page: "routing-flow" },
      { label: "Route Metrics", page: "route-metrics" },
      { label: "Callback Priority", page: "callback-priority" },
      { label: "Callback Card", page: "callback-card" },
      { label: "Callback Board", page: "callback-board" },
      { label: "Command Search", page: "command-search" },
      { label: "Workspace Metric", page: "workspace-metric" },
      { label: "Deployment Row", page: "deployment-row" },
      { label: "Invoice Status Badge", page: "invoice-status-badge" },
      { label: "Invoice Table", page: "invoice-table" },
      { label: "Invoice Totals", page: "invoice-totals" },
      { label: "Ask Analytics", page: "ask-analytics" },
      { label: "Insight Sources", page: "insight-sources" },
      { label: "Hub Search Hero", page: "hub-search-hero" },
      { label: "Agent Category Grid", page: "agent-category-grid" },
      { label: "Integration Tile", page: "integration-tile" },
      {label:"Calendar Event Block",page:"calendar-event-block"},
      {label:"Calendar Color Picker",page:"calendar-color-picker"},
      {label:"Calendar Source List",page:"calendar-source-list"},
      {label:"Calendar Week Grid",page:"calendar-week-grid"},
      {label:"Storage Usage Card",page:"storage-usage-card"},
      {label:"Storage Module Table",page:"storage-module-table"},
      {label:"Retention Policy Row",page:"retention-policy-row"},
      {label:"Dashboard Stat Card",page:"dashboard-stat-card"},
      {label:"Comparison Bar Chart",page:"comparison-bar-chart"},
      {label:"Trend Area Chart",page:"trend-area-chart"},
      {label:"Channel Breakdown",page:"channel-breakdown"},
      {label:"Skeleton Reveal",page:"skeleton-reveal"},
      {label:"Balance Spark Bars",page:"balance-spark-bars"},
      {label:"Finance Attention List",page:"finance-attention-list"},
      {label:"Bank Account List",page:"bank-account-list"},
      {label:"Agent Run Card",page:"agent-run-card"},
      {label:"Agent Run Activity",page:"agent-run-activity"},
      {label:"Agent Inbox Board",page:"agent-inbox-board"},
      {label:"Currency Balance Card",page:"currency-balance-card"},
      {label:"Currency Balance Summary",page:"currency-balance-summary"},
      {label:"Money Activity List",page:"money-activity-list"},
      {label:"Cash Flow Bars",page:"cash-flow-bars"},
      { label: "Stay Price Label", page: "stay-price-label" },
      { label: "Stay Result Card", page: "stay-result-card" },
      { label: "Stay Selection Card", page: "stay-selection-card" },
      { label: "Place Map", page: "place-map" },
      { label: "Place Detail Card", page: "place-detail-card" },
      { label: "Map Style Picker", page: "map-style-picker" },
      { label: "Agent Connect Card", page: "agent-connect-card" },
      { label: "Quota Usage", page: "quota-usage" },
      { label: "Agent Client Picker", page: "agent-client-picker" },
      { label: "Balance Chart", page: "balance-chart" },
      { label: "Allocation Bar", page: "allocation-bar" },
      { label: "Spending Gauge", page: "spending-gauge" },
      { label: "Payment Card", page: "payment-card" },
      { label: "Presence Stack", page: "presence-stack" },
      { label: "Presence Badge", page: "presence-badge" },
      { label: "Menu", page: "menu" },
      { label: "Meeting", page: "meeting-components" },
      { label: "Edge Monitor", page: "edge-monitor" },
      { label: "Brand Swatch", page: "brand-swatch" },
      { label: "Type Scale", page: "type-scale" },
      { label: "Email Signature", page: "email-signature" },
      { label: "Project Summary", page: "project-summary" },
      { label: "Task Row", page: "task-row" },
      { label: "Task Status Group", page: "task-status-group" },
      { label: "Task List Row", page: "task-list-row" },
      { label: "Grouped Task List", page: "grouped-task-list" },
      { label: "Tree Stepper", page: "tree-stepper" },
      { label: "Step Progress", page: "step-progress" },
      { label: "Timeframe Selector", page: "timeframe-selector" },
      { label: "Inline Search Select", page: "inline-search-select" },
      { label: "Studio Inbox", page: "studio-inbox-components" },
      { label: "Switch", page: "switch" },
      { label: "Toggle Composer", page: "toggle-composer" },
      { label: "Canvas Toolbar", page: "canvas-toolbar" },
      { label: "Text Toolbar", page: "text-toolbar" },
      { label: "Inline Quick Menu", page: "inline-quick-menu" },
      { label: "Inline Confirm", page: "inline-confirm" },
      { label: "Gradient Mask", page: "gradient-mask" },
      { label: "Icon Reveal", page: "icon-reveal" },
      { label: "Word Roller", page: "word-roller" },
      { label: "Loading Sequence", page: "loading-sequence" },
      { label: "Cut Reveal", page: "cut-reveal" },
      { label: "Orbit Gallery", page: "orbit-gallery" },
      { label: "Kanban", page: "kanban" },
      { label: "Skill Card", page: "skill-card" },
      { label: "Feature Cards", page: "feature-cards" },
      { label: "Subscription", page: "subscription-components" },
      { label: "Knowledge Base", page: "knowledge-components" },
      { label: "Document Activity", page: "document-activity" },
      { label: "Prospecting", page: "prospecting-components" },
      { label: "Activity", page: "activity-components" },
      { label: "Connections", page: "connection-components" },
      { label: "Connection State", page: "connection-state" },
      { label: "Select", soon: true },
      { label: "Dialog", soon: true },
    ],
  },
  {
    // Conversation output — the chat transcript itself (taxonomy after assistant-ui).
    title: "Chat",
    items: [
      { label: "Comment Thread", page: "comment-thread" },
      { label: "Project Chat", page: "project-chat" },
      { label: "Message", page: "message" },
      { label: "Conversation", page: "conversation" },
      { label: "Response", page: "response" },
      { label: "Streaming Text", page: "streaming-text" },
      { label: "Code Block", page: "code-block" },
      { label: "Attachment", page: "attachment" },
      { label: "Branch Picker", page: "branch-picker" },
    ],
  },
  {
    // Agentic semantics — what the assistant is doing, not just saying.
    title: "Agent",
    items: [
      { label: "Automation", page: "automation-components" },
      { label: "Prompt Box", page: "prompt-box" },
      { label: "Keyword Tag", page: "keyword-tag" },
      { label: "Context Bar", page: "context-bar" },
      { label: "Context Window", page: "context-window" },
      { label: "Tool Call", page: "tool-call" },
      { label: "Reasoning", page: "reasoning" },
      { label: "Thinking State", page: "thinking-state" },
      { label: "Thinking Timeline", page: "thinking-timeline" },
      { label: "Plan", page: "plan" },
      { label: "Sources", page: "sources" },
      { label: "Confirmation", page: "confirmation" },
      { label: "Web Search", page: "web-search" },
      { label: "Code Diff", page: "code-diff" },
      { label: "Terminal", page: "terminal" },
      { label: "Subagents", page: "subagents" },
    ],
  },
  {
    // App chrome around the conversation.
    title: "Shell",
    items: [
      { label: "Review Components", page: "review-components" },
      { label: "Thread List", page: "thread-list" },
      { label: "Assistant Modal", page: "assistant-modal" },
      { label: "Page Loader", page: "page-loader" },
    ],
  },
  {
    title: "Templates",
    items: [
      { label: "Support Console", page: "support-console" },
      {label:"Project Feed",page:"project-feed"},
      {label:"Storage Manager",page:"storage-manager"},
      {label:"Commerce Dashboard",page:"dashboard-suite"},
      {label:"Campaign Dashboard",page:"campaign-dashboard"},
      {label:"CRM Dashboard",page:"crm-dashboard"},
      {label:"Membership Dashboard",page:"membership-dashboard"},
      {label:"Finance Overview",page:"finance-overview"},
      {label:"Agent Inbox",page:"agent-inbox"},
      {label:"Color Calendar",page:"color-calendar"},
      {label:"Cross-Currency",page:"cross-currency"},
      {label:"Landmark Stays",page:"landmark-stays"},
      {label:"Agent Observatory",page:"agent-observatory"},
      {label:"Dispatch Allocation",page:"dispatch-allocation"},
      {label:"Writing Folders",page:"writing-folders"},
      {label:"Team Performance",page:"team-performance"},
      {label:"Token Bridge",page:"token-bridge"},
      {label:"Engineering Handoff",page:"engineering-handoff"},
      {label:"Company Directory",page:"company-directory"},
      {label:"Agent Runs",page:"agent-runs"},
      {label:"Progressive Checkout",page:"progressive-checkout"},
      {label:"Model Costs",page:"model-costs"},
      {label:"Plan Upgrade",page:"plan-upgrade"},
      { label: "Consulting Workspace", page: "consulting-workspace" },
      { label: "Browser Agent", page: "browser-agent" },
      { label: "Trace Explorer", page: "trace-explorer" },
      { label: "Grouped Tasks", page: "grouped-tasks" },
      { label: "Usage Forecast", page: "usage-forecast" },
      { label: "Payment Workspace", page: "payment-workspace" },
      { label: "Sales Workspace", page: "sales-workspace" },
      { label: "Fleet Control", page: "fleet-control" },
      { label: "Pipeline Workspace", page: "pipeline-workspace" },
      { label: "Incident Monitor", page: "incident-monitor" },
      { label: "Experiment Workspace", page: "experiment-workspace" },
      { label: "Project Board", page: "project-board" },
      { label: "Access Workspace", page: "access-workspace" },
      { label: "Client Workspace", page: "client-workspace" },
      { label: "Model Router", page: "model-router" },
      { label: "Callback Workspace", page: "callback-workspace" },
      { label: "Thinking Workspace", page: "thinking-workspace" },
      { label: "Command Dashboard", page: "command-dashboard" },
      { label: "Invoice Workspace", page: "invoice-workspace" },
      { label: "Analytics Assistant", page: "analytics-assistant" },
      { label: "Agent Hub", page: "agent-hub" },
      { label: "Place Explorer", page: "place-explorer" },
      { label: "Agent Connections", page: "agent-connections" },{ label: "Finance Workspace", page: "finance-workspace" }, { label: "Presence Room", page: "presence-room" },
      { label: "Brand Guide", page: "brand-guide" }, { label: "Project Workspace", page: "project-workspace" }, { label: "Security Review", page: "security-review" }, { label: "Position Studio", page: "position-studio" }, { label: "Studio Inbox", page: "studio-inbox" }, { label: "Edge Observatory", page: "edge-observatory" }, { label: "Preference Studio", page: "preference-studio" }, { label: "Composer Studio", page: "composer-studio" }, { label: "Canvas Studio", page: "canvas-studio" }, { label: "Writing Studio", page: "writing-studio" }, { label: "Meeting Planner", page: "meeting-planner" }, { label: "Subscription", page: "subscription" }, { label: "Comment Workspace", page: "comment-workspace" }, { label: "Calendar Sync", page: "calendar-sync" }, { label: "Document Workspace", page: "document-workspace" }, { label: "Automation Studio", page: "automation-studio" }, { label: "Connections", page: "connections-workspace" }, { label: "Knowledge Base", page: "knowledge-base" }, { label: "Music Workspace", page: "music-workspace" }, { label: "Orbit Gallery", page: "orbit-gallery-showcase" }, { label: "Neutomni Intro", page: "neutomni-intro" }, { label: "Activity Workspace", page: "activity-workspace" }, { label: "Prospecting Dashboard", page: "prospecting-dashboard" }, { label: "Features Showcase", page: "features-showcase" }, { label: "Review Workspace", page: "review-workspace" }, { label: "Skills Workspace", page: "skills-workspace" }],
  },
  {
    title: "Patterns",
    items: [
      { label: "Settings", page: "settings" },
      { label: "Pattern Lab", page: "settings-lab" },
      { label: "Inbox Stream", page: "inbox-stream" },
      { label: "Onboarding Board", page: "onboarding-board" },
    ],
  },
];

export function Sidebar({ nav }: { nav: DocsNav }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 overflow-y-auto border-r border-[var(--color-border-subtle)] px-4 py-6 lg:block">
      <div className="flex items-center gap-2.5 px-2">
        <OreoLogo className="h-[15px] w-auto text-[var(--color-text-primary)]" />
        <span className="text-[15px] font-semibold tracking-tight">Oreo UI</span>
      </div>

      <nav className="mt-7 space-y-6">
        {NAV.map((group) => (
          <div key={group.title}>
            <div className="px-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-secondary)]">
              {group.title}
            </div>
            <ul className="mt-2 space-y-0.5">
              {group.items.map((item) => {
                const active = item.page != null && item.page === nav.active;
                const itemClass = cn(
                  "flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[13px] transition-colors",
                  active
                    ? "bg-[var(--color-state-press)] font-medium text-[var(--color-text-primary)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-state-hover)] hover:text-[var(--color-text-primary)]",
                  item.soon && "pointer-events-none opacity-50",
                );
                return (
                  <li key={item.label}>
                    {item.page ? (
                      // Real links so pages can be opened in new tabs and shared;
                      // plain clicks stay client-side via pushState.
                      <a
                        href={`/${item.page}`}
                        onClick={(e) => {
                          if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                          e.preventDefault();
                          nav.onNavigate(item.page!);
                        }}
                        aria-current={active ? "page" : undefined}
                        className={itemClass}
                      >
                        {item.label}
                      </a>
                    ) : (
                      <button type="button" disabled className={itemClass}>
                        {item.label}
                        {item.soon && (
                          <span className="rounded-full border border-[var(--color-border-default)] px-1.5 py-px text-[10px] font-normal">
                            soon
                          </span>
                        )}
                      </button>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
