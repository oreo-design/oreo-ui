import type { ModelRoute, RoutingPolicy } from "@/components/model-routing";
export const MODELS: Omit<ModelRoute, "share" | "requests">[] = [
  {
    id: "opus",
    name: "Opus 5.5",
    provider: "Anthropic",
    tone: "blue",
    p50: 0.84,
    p95: 2.16,
    cost: 0.0126,
    errors: 0.42,
  },
  {
    id: "gpt",
    name: "GPT-6.1 Sol",
    provider: "OpenAI",
    tone: "mint",
    p50: 0.51,
    p95: 1.34,
    cost: 0.0048,
    errors: 0.27,
  },
  {
    id: "haiku",
    name: "Haiku 4.5",
    provider: "Anthropic",
    tone: "purple",
    p50: 0.23,
    p95: 0.64,
    cost: 0.0007,
    errors: 0.61,
  },
  {
    id: "qwen",
    name: "Qwen3.5 9B",
    provider: "Self-hosted",
    tone: "pink",
    p50: 0.38,
    p95: 1.09,
    cost: 0.0019,
    errors: 1.08,
  },
];
export const ALLOCATIONS: Record<RoutingPolicy, number[]> = {
  cost: [6, 21, 49, 24],
  balanced: [17, 42, 27, 14],
  quality: [53, 28, 13, 6],
};
export type RouterConfig = {
  policy: RoutingPolicy;
  fallback: boolean;
  from: string;
  to: string;
};
export const DEFAULT_CONFIG: RouterConfig = {
  policy: "balanced",
  fallback: true,
  from: "opus",
  to: "gpt",
};
/** Largest-remainder allocation preserves the total request count. */
export function routesFor(
  policy: RoutingPolicy,
  requests: number,
): ModelRoute[] {
  const shares = ALLOCATIONS[policy],
    counts = shares.map((s) => Math.floor((s * requests) / 100));
  const order = shares
    .map((s, i) => ({ i, remainder: (s * requests) / 100 - counts[i] }))
    .sort((a, b) => b.remainder - a.remainder);
  const remaining = requests - counts.reduce((a, b) => a + b, 0);
  for (let i = 0; i < remaining; i++) counts[order[i].i]++;
  return MODELS.map((m, i) => ({
    ...m,
    share: shares[i],
    requests: counts[i],
  }));
}
export const blendedCost = (policy: RoutingPolicy) =>
  MODELS.reduce(
    (sum, m, i) => sum + (m.cost * ALLOCATIONS[policy][i]) / 100,
    0,
  );
