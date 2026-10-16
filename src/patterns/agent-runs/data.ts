import type { HourBucket } from "@/components/agent-runs/model";
export const AGENTS = [
  {
    id: "triage",
    name: "Support triage",
    description: "Classifies conversations and drafts replies.",
  },
  {
    id: "research",
    name: "Research assistant",
    description: "Finds and summarizes source material.",
  },
  {
    id: "digest",
    name: "Weekly digest",
    description: "Turns team activity into concise updates.",
  },
];
export function agentWeek(agent: string, previous = false): HourBucket[] {
  const n = Math.max(
    0,
    AGENTS.findIndex((a) => a.id === agent),
  );
  return Array.from({ length: 168 }, (_, i) => {
    const day = Math.floor(i / 24),
      hour = i % 24;
    const wave =
      hour >= 7 && hour <= 18
        ? Math.max(1, 11 - Math.abs(hour - 10) * 1.2)
        : i % 9 === 2
          ? 1
          : 0;
    const runs = Math.round(
      wave *
        (day < 5 ? 12 : 3) *
        (1 - n * 0.23) *
        (0.7 + ((i * 7) % 9) / 10) *
        (previous ? 0.87 : 1),
    );
    return {
      day,
      hour,
      runs,
      credits: runs * (n + 2),
      failures: Math.floor(runs * (i % 13 === 0 ? 0.07 : 0.012)),
      durationSeconds: runs * (35 + n * 12 + (i % 19)),
    };
  });
}
export function selectedWeek(agent = "all", previous = false) {
  const agents =
    agent === "all" ? AGENTS : AGENTS.filter((a) => a.id === agent);
  if (!agents.length) return [];
  return agents
    .map((a) => agentWeek(a.id, previous))
    .reduce<
      HourBucket[]
    >((sum, week) => week.map((b, i) => ({ ...b, runs: b.runs + (sum[i]?.runs ?? 0), credits: b.credits + (sum[i]?.credits ?? 0), failures: b.failures + (sum[i]?.failures ?? 0), durationSeconds: b.durationSeconds + (sum[i]?.durationSeconds ?? 0) })), []);
}
