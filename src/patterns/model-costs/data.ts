import type { UsageDay, UsageModel } from "@/components/model-usage";
export const MODELS: UsageModel[] = [
  { id: "gpt", name: "GPT-4o", tone: "purple" },
  { id: "claude", name: "Claude Sonnet", tone: "orange" },
  { id: "gemini", name: "Gemini Pro", tone: "blue" },
];
const requests = [12000, 15000, 18000, 21000, 22000, 16000, 20800],
  cost = [24800, 24000, 32000, 42000, 38500, 31000, 56100],
  tokens = [8e6, 10e6, 13e6, 14e6, 16e6, 11e6, 14.4e6];
export function sampleDays(env: "production" | "staging"): UsageDay[] {
  const scale = env === "production" ? 1 : 0.12;
  return requests.map((n, i) => ({
    id: `2026-09-${24 + i}`,
    label: `Sep ${24 + i}`,
    models: Object.fromEntries(
      MODELS.map((m, j) => [
        m.id,
        {
          requests: Math.round(n * [0.5, 0.3, 0.2][j] * scale),
          tokens: Math.round(tokens[i] * [0.4, 0.35, 0.25][j] * scale),
          costCents: Math.round(cost[i] * [0.45, 0.35, 0.2][j] * scale),
        },
      ]),
    ),
    latencySamples: [620 + i * 20, 780 + i * 24, 1000 + i * 40].map((n) =>
      Math.round(n * (env === "production" ? 1 : 0.85)),
    ),
  }));
}
export const AGENTS = [
  {
    id: "triage",
    title: "Support triage",
    description: "Classifies tickets and drafts helpful replies.",
    model: "gpt",
  },
  {
    id: "knowledge",
    title: "Knowledge retrieval",
    description: "Finds grounded answers across your docs.",
    model: "claude",
  },
  {
    id: "digest",
    title: "Weekly digest",
    description: "Turns project updates into a short brief.",
    model: "gemini",
  },
];
export type Run = {
  id: string;
  title: string;
  description: string;
  model: string;
  tokens: number;
  costCents: number;
  time: string;
  environment: "production" | "staging";
};
export const RUNS: Run[] = [
  {
    id: "r1",
    title: "Support reply generated",
    description: "Help me update the billing email on my account.",
    model: "gpt",
    tokens: 1842,
    costCents: 5,
    time: "Sep 30 · 09:42",
    environment: "production",
  },
  {
    id: "r2",
    title: "Document summary complete",
    description: "Summarize the changes in the release notes.",
    model: "claude",
    tokens: 3210,
    costCents: 9,
    time: "Sep 30 · 09:38",
    environment: "production",
  },
  {
    id: "r3",
    title: "Project digest generated",
    description: "A short overview of this week's decisions.",
    model: "gemini",
    tokens: 2400,
    costCents: 4,
    time: "Sep 30 · 09:34",
    environment: "production",
  },
  {
    id: "r4",
    title: "Staging reply generated",
    description: "A test reply for the preview workspace.",
    model: "gpt",
    tokens: 900,
    costCents: 3,
    time: "Sep 30 · 09:30",
    environment: "staging",
  },
];
