export type AgentHealthStatus = "Healthy" | "Paused" | "Deploying" | "Degraded";
export type AgentTelemetry = {
  id: string;
  name: string;
  role: string;
  region: string;
  status: AgentHealthStatus;
  requests: number;
  successes: number;
  costPer1k: number;
  p95ms: number;
  model: string;
  version: string;
};
export type TrafficRegion = {
  id: string;
  label: string;
  requests: number;
  latency: number;
  x: number;
  y: number;
};
export type InferencePoint = { label: string; value: number };
export type HealthSort = {
  key: "name" | "status" | "success" | "costPer1k" | "p95ms";
  direction: "asc" | "desc";
};
export const successRate = (a: AgentTelemetry) =>
  a.requests > 0 ? (a.successes / a.requests) * 100 : 0;
export function validTelemetry(a: AgentTelemetry) {
  return (
    Number.isSafeInteger(a.requests) &&
    a.requests >= 0 &&
    Number.isSafeInteger(a.successes) &&
    a.successes >= 0 &&
    a.successes <= a.requests &&
    Number.isFinite(a.costPer1k) &&
    a.costPer1k >= 0 &&
    Number.isFinite(a.p95ms) &&
    a.p95ms >= 0
  );
}
export function healthRows(
  agents: AgentTelemetry[],
  query = "",
  status = "All statuses",
  region = "all",
  sort: HealthSort = { key: "name", direction: "asc" },
) {
  const q = query.trim().toLowerCase();
  return agents
    .filter(
      (a) =>
        (!q || `${a.name} ${a.role} ${a.model}`.toLowerCase().includes(q)) &&
        (status === "All statuses" || a.status === status) &&
        (region === "all" || a.region === region),
    )
    .sort((a, b) => {
      const x = sort.key === "success" ? successRate(a) : a[sort.key],
        y = sort.key === "success" ? successRate(b) : b[sort.key];
      const result =
        typeof x === "number" && typeof y === "number"
          ? x - y
          : String(x).localeCompare(String(y), "en");
      return (
        (sort.direction === "asc" ? result : -result) ||
        a.id.localeCompare(b.id)
      );
    });
}
export function summarizeHealth(agents: AgentTelemetry[]) {
  const requests = agents.reduce((n, a) => n + a.requests, 0),
    successes = agents.reduce((n, a) => n + a.successes, 0),
    latencies = agents
      .filter((a) => a.requests > 0)
      .map((a) => a.p95ms)
      .sort((a, b) => a - b),
    i = Math.floor(latencies.length / 2);
  return {
    requests,
    successes,
    success: requests ? (successes / requests) * 100 : 0,
    active: agents.filter((a) => a.status !== "Paused").length,
    medianP95: !latencies.length
      ? 0
      : latencies.length % 2
        ? latencies[i]
        : (latencies[i - 1] + latencies[i]) / 2,
  };
}
export function toggleAgent(
  agents: AgentTelemetry[],
  id: string,
  previous: AgentHealthStatus = "Healthy",
) {
  if (!agents.some((a) => a.id === id))
    throw new Error("Agent no longer exists.");
  return agents.map((a) =>
    a.id === id
      ? {
          ...a,
          status:
            a.status === "Paused"
              ? previous === "Paused"
                ? "Healthy"
                : previous
              : ("Paused" as AgentHealthStatus),
        }
      : a,
  );
}
/** Integer apportionment preserves totals, including zero and one request. */
export function splitRequests(total: number, weights: number[]) {
  if (
    !Number.isSafeInteger(total) ||
    total < 0 ||
    !weights.length ||
    weights.some((w) => !Number.isFinite(w) || w < 0) ||
    weights.reduce((s, w) => s + w, 0) <= 0
  )
    throw new Error("Invalid request distribution.");
  const sum = weights.reduce((s, w) => s + w, 0),
    values = weights.map((w) => (total * w) / sum),
    counts = values.map(Math.floor),
    remainder = total - counts.reduce((s, v) => s + v, 0);
  const order = values
    .map((v, i) => ({ i, f: v - counts[i] }))
    .sort((a, b) => b.f - a.f || a.i - b.i);
  for (let i = 0; i < remainder; i++) counts[order[i].i]++;
  return counts;
}
export function telemetryCSV(agents: AgentTelemetry[]) {
  const cell = (v: string | number) =>
    `"${String(v)
      .replace(/^[=+@-]/, "'$&")
      .replace(/"/g, '""')}"`;
  return [
    [
      "Agent",
      "Role",
      "Region",
      "Status",
      "Requests",
      "Successes",
      "Success %",
      "USD per 1K",
      "p95 ms",
    ],
    ...agents.map((a) => [
      a.name,
      a.role,
      a.region,
      a.status,
      a.requests,
      a.successes,
      successRate(a).toFixed(2),
      a.costPer1k.toFixed(4),
      a.p95ms,
    ]),
  ]
    .map((row) => row.map(cell).join(","))
    .join("\r\n");
}
