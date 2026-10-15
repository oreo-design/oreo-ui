import { cn } from "@/lib/cn";
import { OreoLogo } from "./OreoLogo";
import type { DocsNav } from "./DocsPage";

type Item = { label: string; page?: string; soon?: boolean };
type Group = { title: string; items: Item[] };

const NAV: Group[] = [
  {
    title: "Getting Started",
    items: [{ label: "Introduction", soon: true }, { label: "Tokens", soon: true }],
  },
  {
    title: "Components",
    items: [
      { label: "Button", page: "button" },
      { label: "Icon Button", page: "icon-button" },
      { label: "Status Icon", page: "status-icon" },
      { label: "Chip", page: "chip" },
      { label: "Tag", page: "tag" },
      { label: "Shortcut", page: "shortcut" },
      { label: "Avatar", page: "avatar" },
      { label: "Menu", page: "menu" },
      { label: "Meeting", page: "meeting-components" },
      { label: "Edge Monitor", page: "edge-monitor" },
      { label: "Brand Swatch", page: "brand-swatch" },
      { label: "Type Scale", page: "type-scale" },
      { label: "Email Signature", page: "email-signature" },
      { label: "Project Summary", page: "project-summary" },
      { label: "Task Row", page: "task-row" },
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
    items: [{ label: "Brand Guide", page: "brand-guide" }, { label: "Project Workspace", page: "project-workspace" }, { label: "Security Review", page: "security-review" }, { label: "Position Studio", page: "position-studio" }, { label: "Studio Inbox", page: "studio-inbox" }, { label: "Edge Observatory", page: "edge-observatory" }, { label: "Preference Studio", page: "preference-studio" }, { label: "Composer Studio", page: "composer-studio" }, { label: "Canvas Studio", page: "canvas-studio" }, { label: "Writing Studio", page: "writing-studio" }, { label: "Meeting Planner", page: "meeting-planner" }, { label: "Subscription", page: "subscription" }, { label: "Comment Workspace", page: "comment-workspace" }, { label: "Calendar Sync", page: "calendar-sync" }, { label: "Document Workspace", page: "document-workspace" }, { label: "Automation Studio", page: "automation-studio" }, { label: "Connections", page: "connections-workspace" }, { label: "Knowledge Base", page: "knowledge-base" }, { label: "Music Workspace", page: "music-workspace" }, { label: "Orbit Gallery", page: "orbit-gallery-showcase" }, { label: "Neutomni Intro", page: "neutomni-intro" }, { label: "Activity Workspace", page: "activity-workspace" }, { label: "Prospecting Dashboard", page: "prospecting-dashboard" }, { label: "Features Showcase", page: "features-showcase" }, { label: "Review Workspace", page: "review-workspace" }, { label: "Skills Workspace", page: "skills-workspace" }],
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
