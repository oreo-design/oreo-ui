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
      { label: "Gradient Mask", page: "gradient-mask" },
      { label: "Cut Reveal", page: "cut-reveal" },
      { label: "Kanban", page: "kanban" },
      { label: "Skill Card", page: "skill-card" },
      { label: "Feature Cards", page: "feature-cards" },
      { label: "Prospecting", page: "prospecting-components" },
      { label: "Activity", page: "activity-components" },
      { label: "Select", soon: true },
      { label: "Dialog", soon: true },
    ],
  },
  {
    // Conversation output — the chat transcript itself (taxonomy after assistant-ui).
    title: "Chat",
    items: [
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
    items: [{ label: "Neutomni Intro", page: "neutomni-intro" }, { label: "Activity Workspace", page: "activity-workspace" }, { label: "Prospecting Dashboard", page: "prospecting-dashboard" }, { label: "Features Showcase", page: "features-showcase" }, { label: "Review Workspace", page: "review-workspace" }, { label: "Skills Workspace", page: "skills-workspace" }],
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
