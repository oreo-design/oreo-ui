import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { Icon } from "@/components/icon";
import { OreoLogo } from "./OreoLogo";
import type { DocsNav } from "./DocsPage";

type Item = { label: string; page: string };
type Group = { title: string; items: Item[] };

const NAV: Group[] = [
  {
    title: "Getting Started",
    items: [{ label: "Spacing Playground", page: "spacing" }, { label: "Spacing Guide", page: "spacing-guide" }, { label: "AI Remixes", page: "ai-remixes" }, { label: "Changelog", page: "changelog" }],
  },
  {
    title: "Components",
    items: [
      {label:"Adaptive Issue Table",page:"adaptive-issue-table"},
      {label:"Adaptive Issue Row",page:"adaptive-issue-row"},
      {label:"Pull Request Pill",page:"pull-request-pill"},
      {label:"Resize Frame",page:"resize-frame"},
      { label: "Button", page: "button" },
      { label: "Data Filter Popover", page: "data-filter-popover" },
      { label: "Data Sort Menu", page: "data-sort-menu" },
      { label: "Row Action Menu", page: "row-action-menu" },
      { label: "Bulk Action Bar", page: "bulk-action-bar" },
      { label: "Workflow Status Badge", page: "workflow-status-badge" },
      { label: "Workflow Run Bars", page: "workflow-run-bars" },
      { label: "Workflow Table", page: "workflow-table" },

      { label: "Release Entry", page: "release-entry" },
      { label: "Upgrade Prompt", page: "upgrade-prompt" },
      { label: "Icon Button", page: "icon-button" },
      { label: "Status Icon", page: "status-icon" },
      { label: "Chip", page: "chip" },
      { label: "Tag", page: "tag" },
      { label: "Shortcut", page: "shortcut" },
      { label: "Avatar", page: "avatar" },
 {label:"Segment Rule Builder",page:"segment-rule-builder"},{label:"Segment Preview",page:"segment-preview"},{label:"Subscription Plan Picker",page:"subscription-plan-picker"},{label:"Revenue Target Editor",page:"revenue-target-editor"},
 {label:"Issue Row",page:"issue-row"},{label:"Issue Queue",page:"issue-queue"},{label:"Issue Reader",page:"issue-reader"},
 {label:"Task Properties",page:"task-properties"},{label:"Task Subtasks",page:"task-subtasks"},{label:"Task Detail Panel",page:"task-detail-panel"},
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
      {label:"Annotated Waveform",page:"annotated-waveform"},
      {label:"Production Task List",page:"production-task-list"},
      {label:"Mix Version List",page:"mix-version-list"},
      {label:"Voice Signal",page:"voice-signal"},
      {label:"Voice Latency Breakdown",page:"voice-latency-breakdown"},
      {label:"Turn Latency History",page:"turn-latency-history"},
      {label:"Budget Cap Control",page:"budget-cap-control"},
      {label:"Budget Outcome",page:"budget-outcome"},
      {label:"Monthly Budget Card",page:"monthly-budget-card"},
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
      {label:"Linked Documents",page:"linked-documents"},
      {label:"Linked Document Row",page:"linked-document-row"},
      {label:"Linked Documents Selector",page:"linked-documents-selector"},
      {label:"Linked Document Details",page:"linked-document-details"},
      {label:"Agent Lanes",page:"agent-lanes"},
      {label:"Agent Lane Identity",page:"agent-lane-identity"},
      {label:"Agent Task Bar",page:"agent-task-bar"},
      {label:"Agent Timeline Axis",page:"agent-timeline-axis"},

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
      {label:"Monitor Reveal",page:"monitor-reveal"},{label:"Region Spotlight",page:"region-spotlight"},{label:"Incident Recommendation",page:"incident-recommendation"},
      { label: "Brand Swatch", page: "brand-swatch" },
      { label: "Type Scale", page: "type-scale" },
      { label: "Email Signature", page: "email-signature" },
      { label: "Project Summary", page: "project-summary" },
      { label: "Task Row", page: "task-row" },
      {label:"Task Schedule Chip",page:"task-schedule-chip"},{label:"Task Calendar",page:"task-calendar"},{label:"Task Timeline",page:"task-timeline"},
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
      {label:"Test Results",page:"test-results"},{label:"Test Run Summary",page:"test-run-summary"},{label:"Test Result Filters",page:"test-result-filters"},{label:"Test File Group",page:"test-file-group"},{label:"Test Failure Detail",page:"test-failure-detail"},{label:"Test Stack Trace",page:"test-stack-trace"},
      {label:"Branch History",page:"branch-history"},{label:"Merge Status Badge",page:"merge-status-badge"},{label:"Merge Checks",page:"merge-checks"},{label:"Change Summary",page:"change-summary"},{label:"Pull Request Card",page:"pull-request-card"},
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
      {label:"Workflow Directory",page:"workflow-directory"},
      {label:"Document Review",page:"unlink-documents-workspace"},
      {label:"Agent Lanes Workspace",page:"agent-lanes-workspace"},
      {label:"Adaptive Issues",page:"adaptive-issues"},
      {label:"Test Workspace",page:"test-workspace"},
      {label:"Merge Workspace",page:"merge-workspace"},
      { label: "Support Console", page: "support-console" },
      {label:"Project Feed",page:"project-feed"},
      {label:"Subscription Workspace",page:"subscription-workspace"},
      {label:"Issue Browser",page:"issue-browser"},
      {label:"Task Board",page:"task-board"},
      {label:"Music Project",page:"music-project"},
      {label:"Voice Agent",page:"voice-agent"},
      {label:"Agent Budget",page:"agent-budget"},
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

function Directory({ nav, onNavigate }: { nav: DocsNav; onNavigate?: () => void }) {
  const [query, setQuery] = useState("");
  const list = useRef<HTMLElement>(null);
  const groups = NAV.map(group => ({ ...group, items: group.items.filter(item => item.page && `${group.title} ${item.label}`.toLowerCase().includes(query.trim().toLowerCase())) })).filter(group => group.items.length);
  useEffect(() => {
    list.current?.querySelector('[aria-current="page"]')?.scrollIntoView({ block: "nearest" });
  }, [nav.active]);
  return <>
    <div className="site-directory-search"><label className="sr-only" htmlFor={onNavigate ? "mobile-page-search" : "page-search"}>Find a page</label><input id={onNavigate ? "mobile-page-search" : "page-search"} type="search" placeholder="Find a page…" value={query} onChange={event => setQuery(event.target.value)} /></div>
    <nav ref={list} className="site-directory" aria-label="Site navigation">
      {groups.map(group => <section key={group.title}><h2>{group.title}</h2><ul>{group.items.map(item => <li key={item.page}><a href={`/${item.page}`} aria-current={nav.active === item.page ? "page" : undefined} className={cn("site-directory-link", nav.active === item.page && "is-active")} onClick={event => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
        event.preventDefault(); nav.onNavigate(item.page!); onNavigate?.();
      }}>{item.label}</a></li>)}</ul></section>)}
      {!groups.length && <div className="site-directory-empty" role="status"><Icon name="search" /><p>No matching pages</p><button type="button" className="site-action" onClick={() => setQuery("")}>Clear search</button></div>}
    </nav>
  </>;
}

function Brand() {
  return <a href="/" className="site-brand" aria-label="Oreo UI home"><OreoLogo className="h-4 w-auto" /><span>Oreo UI</span></a>;
}

export function Sidebar({ nav }: { nav: DocsNav }) {
  return <aside className="site-sidebar"><Brand /><Directory nav={nav} /></aside>;
}

/** The same directory is available on every route, including standalone templates. */
export function MobileNavigation({ nav }: { nav: DocsNav }) {
  const shell = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const [dark, setDark] = useState(false);
  // Pages own their preview theme. Mirror only the page root, never nested specimens.
  useLayoutEffect(() => {
    const pageRoot = shell.current?.nextElementSibling;
    const root = document.documentElement;
    const sync = () => setDark(root.classList.contains("theme-dark") || Boolean(pageRoot?.classList.contains("theme-dark")));
    const observer = new MutationObserver(sync);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    if (pageRoot) observer.observe(pageRoot, { attributes: true, attributeFilter: ["class"] });
    sync();
    return () => observer.disconnect();
  }, [nav.active]);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const media = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => { if (media.matches) dialog.current?.close(); };
    media.addEventListener("change", closeOnDesktop);
    return () => { document.body.style.overflow = previous; media.removeEventListener("change", closeOnDesktop); };
  }, [open]);
  return <div ref={shell} className={cn("site-mobile-nav", dark && "theme-dark")}>
    <div className="site-mobile-bar"><Brand /><button type="button" className="site-action" aria-haspopup="dialog" aria-expanded={open} onClick={() => { dialog.current?.showModal(); setOpen(true); }}>Browse pages</button></div>
    <dialog ref={dialog} className="site-navigation-dialog" aria-label="Browse pages" onClose={() => setOpen(false)}>
      <div className="site-mobile-bar"><span className="text-sm font-medium">Browse pages</span><button type="button" className="site-action" onClick={() => dialog.current?.close()}>Close</button></div>
      {open && <Directory nav={nav} onNavigate={() => dialog.current?.close()} />}
    </dialog>
  </div>;
}
