import type { ChangeKind } from "@/components/release-entry";
export type Change = { id: string; kind: ChangeKind; title: string; description: string; page: string; pr: number; preview?: "type" | "steps" | "result" };
export type Release = { date: string; label: string; title: string; description: string; changes: Change[] };
export const REPOSITORY = "https://github.com/oreo-design/oreo-ui";
/** Selected main-branch changes. Dates are merge dates in Asia/Shanghai, not package releases. */
export const releases: Release[] = [
  { date: "2026-10-15", label: "October 15, 2026", title: "More pieces. More possibilities.", description: "Brand tools, focused workspaces, and the small details that make them work.", changes: [
    { id:"analytics-assistant", kind:"Added", title:"Analytics Assistant", description:"A compact Ask Analytics card and reusable source chips, composed into a dashboard with local sample answers, saved insights and connection-error recovery.", page:"analytics-assistant", pr:50 },
    { id:"agent-hub", kind:"Added", title:"Agent Hub", description:"A searchable agent catalog with reusable search hero, category grid and integration tiles. Explore local agents, create drafts and try demo connection states.", page:"agent-hub", pr:49 },
    { id:"place-explorer", kind:"Added", title:"Place Explorer", description:"An illustrative neighborhood map, venue detail card and five-style picker, composed into a local discovery template with filters, saved places and copyable itineraries.", page:"place-explorer", pr:48 },
    { id:"agent-connections", kind:"Added", title:"Agent Connections", description:"An arced setup card, compact quota rings and native client picker, composed into a local MCP workspace with read-only tool access and connection management.", page:"agent-connections", pr:47 },
    { id:"finance-workspace", kind:"Added", title:"Finance Workspace", description:"A multi-series balance chart, savings allocation, spending gauge and masked payment card, composed into an interactive local finance dashboard.", page:"finance-workspace", pr:46 },
    { id:"presence-room", kind:"Added", title:"Presence Room", description:"Live-roster avatars, online and typing badges, and multi-person typing prompts in a local collaborative brief with discussion and connection recovery.", page:"presence-room", pr:45 },
    { id:"brand-tools", kind:"Added", title:"Brand Guide", description:"Build a brand kit with reusable colour swatches, a modular type scale, logo downloads and an email signature builder.", page:"brand-guide", pr:43, preview:"type" },
    { id:"project-workspace", kind:"Added", title:"Project Workspace", description:"Project summaries and task rows, brought together in an editable overview, list and Kanban board.", page:"project-workspace", pr:42 },
    { id:"security-review", kind:"Added", title:"Tree Stepper & Security Review", description:"A branching checklist with evidence, outcomes and a compact progress indicator that stays in sync with completed checks.", page:"security-review", pr:41, preview:"steps" },
    { id:"position-studio", kind:"Added", title:"Position Studio", description:"Inline asset search and a compact timeframe selector, composed into an interactive position form.", page:"position-studio", pr:40 },
    { id:"result-disclosure", kind:"Fixed", title:"Result card disclosure defaults", description:"AgentResultCard accepts defaultOpen for an initially expanded result while retaining controlled open and onOpenChange behavior.", page:"automation-components", pr:29, preview:"result" },
  ]},
  { date: "2026-10-14", label: "October 14, 2026", title: "Small actions, considered.", description: "Inline confirmation and connections that keep the next step close.", changes: [
    { id:"inline-confirm", kind:"Added", title:"Inline Confirm", description:"A compact destructive-action confirmation that keeps the decision beside its trigger.", page:"inline-confirm", pr:26 },
    { id:"connections", kind:"Added", title:"Connections Workspace", description:"Connection rows, grouped integrations and setup surfaces composed into a complete workspace template.", page:"connections-workspace", pr:24 },
  ]},
];
export function changesMarkdown(data: Release[]) {
  return "# Oreo UI changelog\n\nSelected updates merged to main. Merge dates use Asia/Shanghai. These are not package releases or deployment announcements.\n\n" + data.map(release => `## ${release.label} — ${release.title}\n\n${release.description}\n\n` + release.changes.map(change => `- **${change.kind}: [${change.title}](https://oreo-ui-preview.vercel.app/${change.page})** — ${change.description} ([PR #${change.pr}](${REPOSITORY}/pull/${change.pr}))`).join("\n")).join("\n\n");
}
export function upgradePrompt(data: Release[]) {
  return `Review these Oreo UI source updates for my project. Inspect the linked PR diffs and the components I actually use. Preserve local customizations and existing behavior. Propose the smallest relevant changes, explain any migration needed, and run focused validation. Do not assume a published package version or that the website has deployed these changes.\n\n${changesMarkdown(data)}`;
}
