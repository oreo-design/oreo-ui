import type { HandoffAgent } from "@/components/agent-handoff";
export const HANDOFF_AGENTS: HandoffAgent[] = [
  {
    id: "claude",
    name: "Claude",
    description: "Engineering · code and review",
    available: true,
  },
  {
    id: "codex",
    name: "Codex",
    description: "Engineering · implementation",
    available: true,
  },
  {
    id: "triage",
    name: "Triage",
    description: "Not connected to this workspace",
    available: false,
  },
];
export const SAMPLE_PATCH = `// Illustrative only — not applied to a repository
- const file = await exportDashboard(request);
- return response.download(file);
+ const job = await exportQueue.enqueue({
+   dashboardId: request.dashboardId,
+   format: request.format,
+   requestedBy: request.user.id,
+ });
+ return response.accepted({ jobId: job.id });`;
